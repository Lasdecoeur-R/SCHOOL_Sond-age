"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SurveyStatus } from "@/app/generated/prisma/client";
import { getDemoCreatorId, getDemoVoterId } from "@/lib/demo-users";
import { getPrisma } from "@/lib/prisma";

/** Données sérialisables : évite FormData + champs contrôlés React (options souvent vides côté serveur). */
export type CreateSurveyPayload = {
  title: string;
  description: string;
  /** Valeur brute `<input type="date">` (`yyyy-mm-dd`) ou chaîne vide */
  endsAt: string | null;
  /** Si true, résultats non publics (équivalent checkbox « Sondage privé ») */
  resultsPrivate: boolean;
  options: string[];
};

function parseEndsAt(raw: string | null): Date | null {
  const t = raw?.trim();
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createSurveyAction(payload: CreateSurveyPayload) {
  const prisma = getPrisma();
  if (!prisma) {
    redirect("/sondages/nouveau?error=db");
  }

  const title = payload.title.trim();
  const description = (payload.description ?? "").trim();
  const optionEntries = (payload.options ?? []).map((o) => String(o).trim()).filter(Boolean);

  if (!title || optionEntries.length < 2) {
    redirect("/sondages/nouveau?error=validation");
  }

  const endsAt = parseEndsAt(payload.endsAt ?? null);
  const privateSurvey = Boolean(payload.resultsPrivate);
  const creatorId = await getDemoCreatorId(prisma);
  const wording = description ? `${title}\n\n${description}` : title;

  let surveyId: string;
  try {
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
    surveyId = survey.id;
  } catch (err) {
    console.error("[createSurveyAction]", err);
    redirect("/sondages/nouveau?error=create");
  }

  revalidatePath("/tableau-de-bord");
  redirect(`/sondages/${surveyId}/resultats`);
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
