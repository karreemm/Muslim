import { toArabicNumber } from '../../../Lib/Helpers';

export const RenderJuzText = (
  juzData: any, 
  fontSize: number, 
  lineHeight: number
) => {
  if (!juzData || !juzData.length) return null;

  const ayahs = juzData;
  const surahNumber = ayahs[0]?.surah.number;
  const firstAyahText = ayahs[0]?.text;

  // Display basmala logic: Check if it's Surah 9 (no basmala) or Surah start
  const displayBasmala = surahNumber !== 9 && firstAyahText?.includes('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');

  // Remove basmala from the first Ayah if necessary
  if (displayBasmala) {
    ayahs[0].text = firstAyahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
  }

  return (
    <>
      <div dir="rtl" className="flex flex-col items-center">
        {/* Display Basmala or Ta'awwudh (for Surah 9) */}
        <div className="basmala text-xl md:text-3xl text-center my-4">
          {surahNumber === 9 ? (
            <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
          ) : (
            <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          )}
        </div>

        {/* Ayah container */}
        <div className="shadow-md rounded-lg px-4 py-2 mt-5 md:mt-10 ayah-container max-w-[1200px] max-h-[300px] overflow-y-auto flex flex-wrap">
          {ayahs.map((ayah: any) => (
            <div
              key={ayah.number}
              className={`flex flex-col items-start ${ayah.text.includes('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') ? 'w-full' : ''}`}
              style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
            >
              {ayah.text.includes('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') ? (
                <>
                  <div className="w-full text-center my-4 md:my-8">
                    <p className="w-full ayah block text-2xl md:text-4xl">
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </p>
                  </div>
                  <p className="ayah w-full">
                    {ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim()}
                    <span className="separator mx-1">
                      <span className="icon">
                        ۝<span className="number">{toArabicNumber(ayah.numberInSurah)}</span>
                      </span>
                    </span>
                  </p>
                </>
              ) : (
                <p className="ayah w-full">
                  {ayah.text}
                  <span className="separator mx-1">
                    <span className="icon">
                      ۝<span className="number">{toArabicNumber(ayah.numberInSurah)}</span>
                    </span>
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};