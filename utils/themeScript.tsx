export const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  try {
    var root = document.documentElement;

    var stored = localStorage.getItem('theme');
    var isDark = stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    var storedPalette = localStorage.getItem('palette');
    var palette = storedPalette === 'gold' ? 'gold' : 'teal';
    root.classList.remove('teal', 'gold');
    root.classList.add(palette);

    var storedLanguage = localStorage.getItem('language');
    root.dir = storedLanguage === 'en' ? 'ltr' : 'rtl';
  } catch (e) {}
})();
        `,
      }}
    />
  );
};
