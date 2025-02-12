import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const i18n = new I18n({
  en: {
    "Find Your Perfect Match": "Find Your Perfect Match",
    "Where Meaningful Connections Begin": "Where Meaningful Connections Begin",
    "Get Started": "Get Started",
    "Active Users": "Active Users",
    "Daily Matches": "Daily Matches",
    "Success Rate": "Success Rate",
    "Premium Features": "Premium Features",
    "Success Stories": "Success Stories",
    "Smart Matching": "Smart Matching",
    "AI-powered algorithm finds your perfect match":
      "AI-powered algorithm finds your perfect match",
    "Video Chat": "Video Chat",
    "Connect face-to-face before meeting":
      "Connect face-to-face before meeting",
    "Verified Profiles": "Verified Profiles",
    "100% real people, verified through AI":
      "100% real people, verified through AI",
    Events: "Events",
    "Join local events and meetups": "Join local events and meetups",
    "I found my soulmate through this app! The smart matching really works.":
      "I found my soulmate through this app! The smart matching really works.",
    "The video chat feature helped me feel safe and comfortable before meeting in person.":
      "The video chat feature helped me feel safe and comfortable before meeting in person.",
    "The local events feature helped me meet amazing people in my area.":
      "The local events feature helped me meet amazing people in my area.",
  },
  ar: {
    "Find Your Perfect Match": "ابحث عن شريكك المثالي",
    "Where Meaningful Connections Begin": "حيث تبدأ العلاقات الهادفة",
    "Get Started": "ابدأ الآن",
    "Active Users": "المستخدمون النشطون",
    "Daily Matches": "التطابقات اليومية",
    "Success Rate": "معدل النجاح",
    "Premium Features": "الميزات المتميزة",
    "Success Stories": "قصص النجاح",
    "Smart Matching": "التوفيق الذكي",
    "AI-powered algorithm finds your perfect match":
      "خوارزمية مدعومة بالذكاء الاصطناعي تجد شريكك المثالي",
    "Video Chat": "دردشة فيديو",
    "Connect face-to-face before meeting": "تواصل وجهاً لوجه قبل اللقاء",
    "Verified Profiles": "ملفات شخصية موثقة",
    "100% real people, verified through AI":
      "100٪ أشخاص حقيقيون، تم التحقق منهم من خلال الذكاء الاصطناعي",
    Events: "الفعاليات",
    "Join local events and meetups": "انضم إلى الفعاليات واللقاءات المحلية",
    "I found my soulmate through this app! The smart matching really works.":
      "وجدت شريك حياتي من خلال هذا التطبيق! التوفيق الذكي يعمل حقًا.",
    "The video chat feature helped me feel safe and comfortable before meeting in person.":
      "ساعدتني ميزة دردشة الفيديو على الشعور بالأمان والراحة قبل اللقاء شخصيًا.",
    "The local events feature helped me meet amazing people in my area.":
      "ساعدتني ميزة الفعاليات المحلية على مقابلة أشخاص رائعين في منطقتي.",
  },
});

i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;
