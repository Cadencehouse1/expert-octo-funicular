import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const jobs = [
  {
    slug: "full-time-nanny-manhattan",
    title: "Full-Time Nanny for Family with Two Children — Manhattan",
    roleType: "NANNY",
    location: "Manhattan, NY",
    schedule: "Mon–Fri, 8am–6pm, live-out",
    compensation: "$35–45/hr DOE, paid vacation, health stipend",
    summary:
      "A warm, engaged family seeks an experienced career nanny for their two children (ages 2 and 5).",
    description:
      "Our client family is looking for a nurturing, proactive nanny to care for their toddler and kindergartner. Responsibilities include school drop-off and pick-up, planning enriching activities, children's meal preparation, and light child-related housekeeping.\n\nThe ideal candidate is a true career nanny who views childcare as a profession and brings warmth, structure, and creativity to every day.",
    requirements:
      "5+ years of professional nanny experience with verifiable references\nCPR and First Aid certified\nComfortable with light travel during school breaks\nValid driver's license preferred",
  },
  {
    slug: "newborn-care-specialist-greenwich",
    title: "Newborn Care Specialist for First-Time Parents — Greenwich",
    roleType: "NEWBORN_CARE_SPECIALIST",
    location: "Greenwich, CT",
    schedule: "Overnight support, 5 nights/week, 3-month engagement",
    compensation: "$40–55/hr DOE",
    summary:
      "First-time parents expecting in late summer seek an experienced NCS for overnight newborn support.",
    description:
      "Expecting parents are seeking a certified Newborn Care Specialist to provide overnight care for their first baby, including feeding support, sleep conditioning, and gentle guidance for new parents.\n\nThis is a wonderful engagement with a gracious, appreciative family in a beautiful home.",
    requirements:
      "NCS certification or equivalent training\nExtensive newborn experience with verifiable references\nExperience supporting breastfeeding and bottle-feeding routines\nCPR certified",
  },
  {
    slug: "personal-assistant-beverly-hills",
    title: "Personal Assistant to Private Client — Beverly Hills",
    roleType: "PERSONAL_ASSISTANT",
    location: "Beverly Hills, CA",
    schedule: "Full-time, flexible hours, occasional travel",
    compensation: "$90–120k/year DOE, full benefits",
    summary:
      "A private client seeks a polished, discreet personal assistant to manage calendars, travel, and household coordination.",
    description:
      "Our client, a busy private individual, is seeking a highly organized personal assistant to manage complex calendars, coordinate domestic and international travel, liaise with household staff and vendors, and handle personal errands and special projects with discretion.",
    requirements:
      "3+ years supporting a principal, executive, or private family\nImpeccable discretion and written communication\nComfortable with a flexible schedule and occasional travel\nValid driver's license and clean driving record",
  },
  {
    slug: "rotational-nanny-international",
    title: "Rotational Nanny (2 weeks on / 2 weeks off) — International Travel",
    roleType: "ROTATIONAL_NANNY",
    location: "New York base, international travel",
    schedule: "2 weeks on / 2 weeks off rotation, live-in while on rotation",
    compensation: "$120–150k/year DOE, travel and accommodations provided",
    summary:
      "A globally based family seeks an experienced rotational nanny for their three children, with extensive international travel.",
    description:
      "A wonderful family with three children (ages 1, 4, and 7) seeks a seasoned rotational nanny to join their established care team. While on rotation, you will travel with the family, provide engaged full-scope care, and coordinate seamlessly with your rotation partner.\n\nThis role suits an experienced professional who thrives on travel and full immersion, balanced by generous time fully off.",
    requirements:
      "Prior rotational or travel nanny experience strongly preferred\nValid passport with no travel restrictions\nNewborn/toddler and school-age experience\nCPR and First Aid certified\nSwimming proficiency",
  },
];

async function main() {
  for (const job of jobs) {
    await db.job.upsert({
      where: { slug: job.slug },
      update: {},
      create: job,
    });
  }
  console.log(`Seeded ${jobs.length} sample jobs.`);
}

main().finally(() => db.$disconnect());
