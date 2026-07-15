import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.artifact.upsert({
    where: { qrCode: "art-0001" },
    update: {},
    create: {
      qrCode: "art-0001",
      nameEn: "Bronze Oil Lamp",
      nameAr: "مصباح زيت برونزي",
      category: "Lighting",
      descriptionEn: "A small Roman-era bronze oil lamp with a single nozzle.",
      descriptionAr: "مصباح زيت برونزي صغير من العصر الروماني بفوهة واحدة.",
      publicDescriptionEn:
        "This bronze oil lamp lit homes nearly two thousand years ago. Olive oil burned through a wick in its nozzle.",
      publicDescriptionAr:
        "أضاء هذا المصباح البرونزي المنازل قبل نحو ألفي عام، حيث كان زيت الزيتون يحترق عبر فتيل في فوهته.",
      keywords: ["bronze", "roman", "lamp"],
      historicalPeriod: "Roman period",
      date: "circa 100 AD",
      origin: "Eastern Mediterranean",
      historicalBackgroundEn:
        "Oil lamps like this were mass-produced across the Roman Empire and are among the most common finds at domestic sites.",
      historicalBackgroundAr:
        "كانت المصابيح الزيتية مثل هذه تُنتج بكثرة في أنحاء الإمبراطورية الرومانية وتُعد من أكثر القطع شيوعًا في المواقع السكنية.",
      dimensions: "9 x 6 x 3 cm",
      weight: "180 g",
      material: "Bronze",
      color: "Dark green patina",
      condition: "Good",
      building: "Main Hall",
      floor: "Ground",
      room: "Room 2",
      displayCase: "Case B",
      shelfPosition: "Top shelf",
      responsibleCurator: "Dr. Layla Hassan",
      media: {
        create: [
          { type: "IMAGE", url: "https://placehold.co/600x400?text=Oil+Lamp", captionEn: "Front view", captionAr: "منظر أمامي", sortOrder: 0 },
        ],
      },
      conditionReports: {
        create: [
          { kind: "condition", summaryEn: "Stable, minor surface corrosion.", summaryAr: "مستقر، تآكل سطحي طفيف.", curator: "Dr. Layla Hassan" },
        ],
      },
    },
  });

  console.log("Seeded artifact art-0001");
}

main().finally(() => prisma.$disconnect());
