"use client";

import { useMemo } from "react";
import QuranPageRenderer from "./QuranPageRenderer";

interface QuranMultiPageRendererProps {
    verses: any[];
    fontSize: number;
    lineHeight: number;
}

export default function QuranMultiPageRenderer({
    verses,
    fontSize,
    lineHeight,
}: QuranMultiPageRendererProps) {
    const pages = useMemo(() => {
        if (!verses) return {};
        const groupedPages: Record<number, any[]> = {};
        verses.forEach((verse) => {
            const pageNum = verse.page_number;
            if (!groupedPages[pageNum]) {
                groupedPages[pageNum] = [];
            }
            groupedPages[pageNum].push(verse);
        });
        return groupedPages;
    }, [verses]);

    return (
        <div className="flex flex-col gap-8 w-full items-center">
            {Object.keys(pages)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((pageNum) => (
                    <div key={pageNum} className="w-full flex justify-center">
                        <QuranPageRenderer
                            verses={pages[parseInt(pageNum)]}
                            fontSize={fontSize}
                            lineHeight={lineHeight}
                            pageNumber={parseInt(pageNum)}
                        />
                    </div>
                ))}
        </div>
    );
}
