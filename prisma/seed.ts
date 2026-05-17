import { EventCategory, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seeds = [
  {
    id: "seed-vrc-party-001",
    title: "VRChat Summer Party Night",
    description: "Join us for a night of dancing and fun in our beachside world!",
    startAt: new Date("2026-07-01T20:00:00Z"),
    endAt: new Date("2026-07-01T23:00:00Z"),
    category: EventCategory.PARTY,
    worldName: "VRC Beach Party World",
    worldId: "wrld_party_beach_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-music-001",
    title: "Live DJ Set: Electronic Beats",
    description:
      "Experience a live DJ performance in VR with stunning visuals.",
    startAt: new Date("2026-07-05T19:00:00Z"),
    endAt: new Date("2026-07-05T21:00:00Z"),
    category: EventCategory.MUSIC,
    worldName: "Club Neon VR",
    worldId: "wrld_neon_club_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-art-001",
    title: "Digital Art Gallery Opening",
    description: "Explore an immersive gallery featuring community artists.",
    startAt: new Date("2026-07-10T18:00:00Z"),
    endAt: new Date("2026-07-10T20:00:00Z"),
    category: EventCategory.ART,
    worldName: "VRC Art Museum",
    worldId: "wrld_art_museum_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-game-001",
    title: "VRC Prop Hunt Tournament",
    description: "Compete in our monthly Prop Hunt championship!",
    startAt: new Date("2026-07-15T15:00:00Z"),
    endAt: new Date("2026-07-15T17:00:00Z"),
    category: EventCategory.GAME,
    worldName: "Prop Hunt Arena",
    worldId: "wrld_prop_hunt_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-social-001",
    title: "New Users Welcome Meetup",
    description:
      "A friendly gathering for VRChat newcomers to meet the community.",
    startAt: new Date("2026-07-20T14:00:00Z"),
    endAt: new Date("2026-07-20T16:00:00Z"),
    category: EventCategory.SOCIAL,
    worldName: "VRC Central Plaza",
    worldId: "wrld_central_plaza_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-other-001",
    title: "VRChat SDK Workshop",
    description: "Learn the basics of world-building and avatar creation.",
    startAt: new Date("2026-07-25T16:00:00Z"),
    endAt: new Date("2026-07-25T18:00:00Z"),
    category: EventCategory.OTHER,
    worldName: "Workshop Space VR",
    worldId: "wrld_workshop_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-party-002",
    title: "Costume Party: Anime Night",
    description:
      "Show off your best anime-inspired avatar at our costume party.",
    startAt: new Date("2026-08-01T20:00:00Z"),
    endAt: new Date("2026-08-01T22:00:00Z"),
    category: EventCategory.PARTY,
    worldName: "Anime Festival World",
    worldId: "wrld_anime_fest_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-social-002",
    title: "Language Exchange: Japanese-English",
    description: "Practice Japanese or English in a relaxed virtual setting.",
    startAt: new Date("2026-08-05T13:00:00Z"),
    endAt: new Date("2026-08-05T15:00:00Z"),
    category: EventCategory.SOCIAL,
    worldName: "Cultural Exchange Hall",
    worldId: "wrld_culture_hall_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-game-002",
    title: "VRC Escape Room Challenge",
    description: "Can your team solve all the puzzles before time runs out?",
    startAt: new Date("2026-08-10T17:00:00Z"),
    endAt: new Date("2026-08-10T19:00:00Z"),
    category: EventCategory.GAME,
    worldName: "Mystery Escape Room",
    worldId: "wrld_escape_room_001",
    creatorToken: "seed-creator-token",
  },
  {
    id: "seed-vrc-music-002",
    title: "Acoustic Session: Chill Vibes",
    description: "An intimate acoustic music session in a cozy virtual cafe.",
    startAt: new Date("2026-08-15T19:00:00Z"),
    endAt: new Date("2026-08-15T21:00:00Z"),
    category: EventCategory.MUSIC,
    worldName: "Cozy Cafe VR",
    worldId: "wrld_cozy_cafe_001",
    creatorToken: "seed-creator-token",
  },
];

async function main() {
  console.log("Seeding database...");
  for (const seed of seeds) {
    await prisma.event.upsert({
      where: { id: seed.id },
      update: seed,
      create: seed,
    });
  }
  console.log(`Seeded ${seeds.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
