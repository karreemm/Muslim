"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/general/useTranslation";

interface ButtonGroupProps {
  onSelectionChange: (selected: string) => void;
  defaultSelected?: string;
}

type TabOption = {
  value: string;
  label: string;
};

export default function ButtonGroup({ 
  onSelectionChange, 
  defaultSelected = "Surahs" 
}: ButtonGroupProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>(defaultSelected);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: TabOption[] = [
    { 
      value: "Surahs", 
      label: t("common.surahs"),
    },
    { 
      value: "Hadiths", 
      label: t("common.hadiths"),
    },
    { 
      value: "Azkar", 
      label: t("common.azkar"),
    },
  ];

  useEffect(() => {
    const activeIndex = options.findIndex(opt => opt.value === selected);
    const activeTab = tabsRef.current[activeIndex];
    
    if (activeTab && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [selected]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelectionChange(value);
  };

  return (
    <div className="w-full flex justify-center mb-8">
      <div 
        ref={containerRef}
        className="relative inline-flex p-1.5 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm"
      >
        <div 
          className="absolute top-1.5 bottom-1.5 bg-primary rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />

        {options.map((option, idx) => (
          <button
            key={option.value}
            ref={el => { tabsRef.current[idx] = el; }}
            onClick={() => handleSelect(option.value)}
            className={`
              relative z-10 flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-medium text-sm transition-colors duration-200
              ${selected === option.value 
                ? "text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            <span className="">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}