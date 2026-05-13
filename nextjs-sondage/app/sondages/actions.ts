"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SurveyStatus } from "@/app/generated/prisma/client";
import { getDemoCreatorId, getDemoVoterId } from "@/lib/demo-users";
import { getPrisma } from "@/lib/prisma";

export async function createSurveyFromForm(formData: FormData) {
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/sondages/nouveau?error=db");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const endsRaw = String(formData.get("endsAt") ?? "").trim();
  const privateSurvey = formData.get("private") === "on";
  const optionEntries = formData.getAll("option").map((v) => String(v).trim()).filter(Boolean);

  if (!title || optionEntries.length < 2) {
    redirect("/sondages/nouveau?error=validation");
  }

  const endsAt = endsRaw ? new Date(endsRaw) : null;
  const creatorId = await getDemoCreatorId(prisma);
  const wording = description ? `${title}\n\n${description}` : title;

  const survey = await prisma.$transaction(async (tx) => {
    const s = await tx.survey.create({
      data: {
        title,
        status: SurveyStatus.PUBLISHED,
        endsAt,
        resultsPublic: !privateSurvey,
        createdById: creatorId,
      },
    });
    const question = await tx.question.create({
      data: {
        surveyId: s.id,
        wording,
        sortOrder: 0,
      },
    });
    let order = 0;
    for (const label of optionEntries) {
      await tx.answerOption.create({
        data: { questionId: question.id, label, sortOrder: order++ },
      });
    }
    return s;
  });

  revalidatePath("/tableau-de-bord");
  redirect(`/sondages/${survey.id}/resultats`);
}

export async function castVoteAction(surveyId: string, questionId: string, optionId: string) {
  const prisma = getPrisma();
  if (!prisma) {
    return { ok: false as const, error: "Base indisponible." };
  }

  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    select: { status: true },
  });
  if (!survey || survey.status !== SurveyStatus.PUBLISHED) {
    return { ok: false as const, error: "Ce sondage n’accepte plus de votes." };
  }

  const voterId = await getDemoVoterId(prisma);

  await prisma.vote.upsert({
    where: {
      userId_questionId: { userId: voterId, questionId },
    },
    create: { userId: voterId, questionId, optionId },
    update: { optionId, votedAt: new Date() },
  });

  revalidatePath(`/sondages/${surveyId}/vote`);
  revalidatePath(`/sondages/${surveyId}/resultats`);
  revalidatePath("/tableau-de-bord");
  return { ok: true as const };
}

export async function toggleResultsPublicAction(surveyId: string, nextValue: boolean) {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.survey.update({
    where: { id: surveyId },
    data: { resultsPublic: nextValue },
  });
  revalidatePath(`/sondages/${surveyId}/resultats`);
}

export async function closeSurveyAction(surveyId: string) {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.survey.update({
    where: { id: surveyId },
    data: { status: SurveyStatus.CLOSED, closedAt: new Date() },
  });
  revalidatePath(`/sondages/${surveyId}/resultats`);
  revalidatePath(`/sondages/${surveyId}/vote`);
  revalidatePath("/tableau-de-bord");
}
