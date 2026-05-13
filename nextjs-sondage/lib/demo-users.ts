import type { PrismaClient } from "@/app/generated/prisma/client";

const CREATOR = { email: "demo-createur@sondage.local", name: "Organisateur démo" };
const VOTER = { email: "demo-votant@sondage.local", name: "Participant démo" };

export async function getDemoCreatorId(prisma: PrismaClient): Promise<string> {
  const u = await prisma.user.upsert({
    where: { email: CREATOR.email },
    create: CREATOR,
    update: {},
  });
  return u.id;
}

export async function getDemoVoterId(prisma: PrismaClient): Promise<string> {
  const u = await prisma.user.upsert({
    where: { email: VOTER.email },
    create: VOTER,
    update: {},
  });
  return u.id;
}
