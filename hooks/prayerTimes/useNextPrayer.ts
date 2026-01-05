import { useState, useEffect } from 'react';
import { PrayerTimings } from './usePrayerTimes';

interface UseNextPrayerReturn {
    nextPrayer: keyof PrayerTimings | null;
    timeRemaining: string;
}

export const useNextPrayer = (prayerTimes: any): UseNextPrayerReturn => {
    const [nextPrayer, setNextPrayer] = useState<keyof PrayerTimings | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>('');

    useEffect(() => {
        if (!prayerTimes) return;

        const calculateNextPrayer = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const currentSeconds = now.getSeconds();

            const prayers: { name: keyof PrayerTimings; time: number }[] = [];

            const prayerKeys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

            prayerKeys.forEach((key) => {
                const timeStr = prayerTimes[key];
                if (timeStr) {
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    prayers.push({ name: key, time: hours * 60 + minutes });
                }
            });

            prayers.sort((a, b) => a.time - b.time);

            let upcoming = prayers.find((p) => p.time > currentTime);

            if (!upcoming) {
                upcoming = prayers.find(p => p.name === 'Fajr');
            }

            if (upcoming) {
                setNextPrayer(upcoming.name);

                let diffMinutes = upcoming.time - currentTime;

                if (diffMinutes < 0) {
                    diffMinutes += 24 * 60;
                }

                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;
                const seconds = 59 - currentSeconds;

                const upcomingDate = new Date();
                const [upHours, upMinutes] = prayerTimes[upcoming.name].split(':').map(Number);
                upcomingDate.setHours(upHours, upMinutes, 0, 0);

                if (upcomingDate.getTime() <= now.getTime()) {
                    upcomingDate.setDate(upcomingDate.getDate() + 1);
                }

                const diffMs = upcomingDate.getTime() - now.getTime();
                const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

                setTimeRemaining(
                    `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`
                );
            }
        };

        calculateNextPrayer();
        const interval = setInterval(calculateNextPrayer, 1000);

        return () => clearInterval(interval);
    }, [prayerTimes]);

    return { nextPrayer, timeRemaining };
};
