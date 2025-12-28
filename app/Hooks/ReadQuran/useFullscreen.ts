"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

interface UseFullscreenReturn {
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    enterFullscreen: () => void;
    exitFullscreen: () => void;
}

export const useFullscreen = (
    elementRef: RefObject<HTMLElement>
): UseFullscreenReturn => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener(
                "webkitfullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

    const enterFullscreen = useCallback(async () => {
        const element = elementRef.current;
        if (!element) return;

        try {
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if ((element as any).webkitRequestFullscreen) {
                await (element as any).webkitRequestFullscreen();
            }
        } catch (error) {
            console.error("Error entering fullscreen:", error);
        }
    }, [elementRef]);

    const exitFullscreen = useCallback(async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                await (document as any).webkitExitFullscreen();
            }
        } catch (error) {
            console.error("Error exiting fullscreen:", error);
        }
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    return {
        isFullscreen,
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
    };
};
