// Minimal bilingual helper. Language is chosen via ?lang=ar|en query param.
export type Lang = "en" | "ar";

export function normalizeLang(v?: string | null): Lang {
  return v === "ar" ? "ar" : "en";
}

export const dir = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

const strings = {
  en: {
    archive: "Digital Archive",
    admin: "Admin",
    artifactId: "Artifact ID",
    category: "Category",
    description: "Description",
    keywords: "Keywords",
    historical: "Historical Information",
    period: "Historical Period",
    date: "Date",
    origin: "Origin",
    physical: "Physical Details",
    dimensions: "Dimensions",
    weight: "Weight",
    material: "Material",
    color: "Color",
    condition: "Condition",
    location: "Location",
    media: "Media & Digital Assets",
    notFound: "Artifact not found",
    scanAnother: "Scan another code",
    addArtifact: "Add artifact",
    name: "Name",
    save: "Save",
    viewPublic: "View public page",
    qrCode: "QR code",
    allArtifacts: "All artifacts",
    switchLang: "العربية",
  },
  ar: {
    archive: "الأرشيف الرقمي",
    admin: "الإدارة",
    artifactId: "رقم القطعة",
    category: "التصنيف",
    description: "الوصف",
    keywords: "الكلمات المفتاحية",
    historical: "المعلومات التاريخية",
    period: "الحقبة التاريخية",
    date: "التاريخ",
    origin: "المنشأ",
    physical: "التفاصيل المادية",
    dimensions: "الأبعاد",
    weight: "الوزن",
    material: "المادة",
    color: "اللون",
    condition: "الحالة",
    location: "الموقع",
    media: "الوسائط والأصول الرقمية",
    notFound: "القطعة غير موجودة",
    scanAnother: "امسح رمزًا آخر",
    addArtifact: "إضافة قطعة",
    name: "الاسم",
    save: "حفظ",
    viewPublic: "عرض الصفحة العامة",
    qrCode: "رمز الاستجابة",
    allArtifacts: "كل القطع",
    switchLang: "English",
  },
} as const;

export function t(lang: Lang) {
  return strings[lang];
}
