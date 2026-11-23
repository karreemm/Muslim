"use client";

import { useState } from "react";
import ButtonGroup from "./components/ButtonGroup";
import FavouriteSurahsTable from "./sections/FavouriteSurahsTable";
import FavouriteHadithsTable from "./sections/FavouriteHadithsTable";
import FavouriteAzkarTable from "./sections/FavouriteAzkarTable";
import { useTranslation } from "@/hooks/general/useTranslation";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ParentComponent() {
  const [selectedButton, setSelectedButton] = useState<string>("Surahs");
  const { t } = useTranslation();

  return (
    <PageShell>
      <PageHeader
        title={t("favourites.title")}
        subtitle={t("favourites.subtitle")}
      />

      <ButtonGroup onSelectionChange={setSelectedButton} />

      <div className="transition-opacity duration-300">
        {selectedButton === "Surahs" && <FavouriteSurahsTable />}
        {selectedButton === "Hadiths" && <FavouriteHadithsTable />}
        {selectedButton === "Azkar" && <FavouriteAzkarTable />}
      </div>
    </PageShell>
  );
}
