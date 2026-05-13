import { SurveyStatus } from "@/app/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

export type VotePageData = {
  survey: {
    id: string;
    title: string;
    status: SurveyStatus;
  };
  question: {
    id: string;
    wording: string;
    options: { id: string; label: string }[];
  } | null;
};

export async function getSurveyForVote(surveyId: string): Promise<VotePageData | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    select: {
      id: true,
      title: true,
      status: true,
      questions: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: {
          id: true,
          wording: true,
          options: { orderBy: { sortOrder: "asc" }, select: { id: true, label: true } },
        },
      },
    },
  });

  if (!survey) return null;
  const q = survey.questions[0] ?? null;
  return {
    survey: { id: survey.id, title: survey.title, status: survey.status },
    question: q
      ? { id: q.id, wording: q.wording, options: q.options }
      : null,
  };
}

export type OptionResult = {
  optionId: string;
  label: string;
  count: number;
  percent: number;
};

export type ResultsPageData = {
  survey: {
    id: string;
    title: string;
    status: SurveyStatus;
    resultsPublic: boolean;
    endsAt: Date | null;
  };
  questionWording: string | null;
  totalVotes: number;
  options: OptionResult[];
};

export async function getSurveyResults(surveyId: string): Promise<ResultsPageData | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        include: {
          options: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!survey) return null;

  const q = survey.questions[0];
  if (!q) {
    return {
      survey: {
        id: survey.id,
        title: survey.title,
        status: survey.status,
        resultsPublic: survey.resultsPublic,
        endsAt: survey.endsAt,
      },
      questionWording: null,
      totalVotes: 0,
      options: [],
    };
  }

  const counts = await prisma.vote.groupBy({
    by: ["optionId"],
    where: { questionId: q.id },
    _count: { optionId: true },
  });

  const countMap = new Map(counts.map((c) => [c.optionId, c._count.optionId]));
  const totalVotes = [...countMap.values()].reduce((a, b) => a + b, 0);

  const options: OptionResult[] = q.options.map((opt) => {
    const count = countMap.get(opt.id) ?? 0;
    const percent =
      totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 1000) / 10;
    return { optionId: opt.id, label: opt.label, count, percent };
  });

  return {
    survey: {
      id: survey.id,
      title: survey.title,
      status: survey.status,
      resultsPublic: survey.resultsPublic,
      endsAt: survey.endsAt,
    },
    questionWording: q.wording,
    totalVotes,
    options,
  };
}
