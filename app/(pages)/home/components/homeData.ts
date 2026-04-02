import {
  faBookOpen,
  faHeadphones,
  faSearch,
  faClock,
  faListOl,
  faSeedling,
  faBookmark,
  faStar,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type HomeFeature = {
  href: string;
  icon: IconDefinition;
  title: string;
  desc: string;
  gradient: string;
};

export type HomeTool = {
  href: string;
  icon: IconDefinition;
  title: string;
  desc: string;
};

export const featuredFeatures: HomeFeature[] = [
  {
    href: "/read-quran",
    icon: faBookOpen,
    title: "features.readQuran.title",
    desc: "features.readQuran.desc",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    href: "/listen-quran",
    icon: faHeadphones,
    title: "features.listenQuran.title",
    desc: "features.listenQuran.desc",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    href: "/search-ayah",
    icon: faSearch,
    title: "features.searchAyah.title",
    desc: "features.searchAyah.desc",
    gradient: "from-primary/30 to-primary/5",
  },
  {
    href: "/prayer-times",
    icon: faClock,
    title: "features.prayerTimes.title",
    desc: "features.prayerTimes.desc",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    href: "/azkar",
    icon: faMoon,
    title: "features.azkar.title",
    desc: "features.azkar.desc",
    gradient: "from-primary/50 to-primary/10",
  },
  {
    href: "/read-hadith",
    icon: faStar,
    title: "features.hadith.title",
    desc: "features.hadith.desc",
    gradient: "from-primary/20 to-primary/5",
  },
];

export const secondaryTools: HomeTool[] = [
  {
    href: "/tasbeeh",
    icon: faListOl,
    title: "tools.tasbeeh.title",
    desc: "tools.tasbeeh.desc",
  },
  {
    href: "/sadaqa-garya",
    icon: faSeedling,
    title: "tools.sadaqaGarya.title",
    desc: "tools.sadaqaGarya.desc",
  },
  {
    href: "/favourites",
    icon: faBookmark,
    title: "tools.favourites.title",
    desc: "tools.favourites.desc",
  },
];
