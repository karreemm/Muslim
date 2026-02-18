"use client";

import { useState } from "react";
import { ClipLoader } from "react-spinners";
import JuzMultiPageRenderer from "../../components/JuzMultiPageRenderer";

export const RenderJuzText = (
  juzData: any,
  fontSize: number,
  lineHeight: number,
  isFullscreen: boolean = false,
) => {
  const [loading, setLoading] = useState<boolean>(!juzData);

  if (loading || !juzData) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`fontAmiri flex flex-col items-center transition-all duration-300 ${
        isFullscreen ? "w-full h-full" : ""
      }`}
    >
      <JuzMultiPageRenderer
        verses={juzData}
        fontSize={fontSize}
        lineHeight={lineHeight}
      />
    </div>
  );
};
