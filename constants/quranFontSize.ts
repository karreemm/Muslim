interface BreakpointConfig {
  minWidth: number;
  maxWidth?: number;
  baseFontSize: number;
  baseLineHeight: number;
}

export const DEFAULT_BREAKPOINTS: BreakpointConfig[] = [
  // 0-50px
  { minWidth: 0, maxWidth: 50, baseFontSize: 9, baseLineHeight: 1.5 },
  // 51-100px
  { minWidth: 51, maxWidth: 100, baseFontSize: 9.5, baseLineHeight: 1.52 },
  // 101-150px
  { minWidth: 101, maxWidth: 150, baseFontSize: 10, baseLineHeight: 1.54 },
  // 151-200px
  { minWidth: 151, maxWidth: 200, baseFontSize: 10.5, baseLineHeight: 1.56 },
  // 201-250px
  { minWidth: 201, maxWidth: 250, baseFontSize: 11, baseLineHeight: 1.58 },
  // 251-300px
  { minWidth: 251, maxWidth: 300, baseFontSize: 11.5, baseLineHeight: 1.6 },
  // 301-350px — mobile phones (small)
  { minWidth: 301, maxWidth: 350, baseFontSize: 18, baseLineHeight: 1.8 },
  // 351-400px — mobile phones (medium)
  { minWidth: 351, maxWidth: 400, baseFontSize: 20, baseLineHeight: 1.8 },
  // 401-450px — mobile phones (large)
  { minWidth: 401, maxWidth: 450, baseFontSize: 22, baseLineHeight: 1.82 },
  // 451-500px — large phones / small tablets
  { minWidth: 451, maxWidth: 500, baseFontSize: 24, baseLineHeight: 1.84 },
  // 501-550px
  { minWidth: 501, maxWidth: 550, baseFontSize: 25, baseLineHeight: 1.86 },
  // 551-600px
  { minWidth: 551, maxWidth: 600, baseFontSize: 26, baseLineHeight: 1.88 },
  // 601-650px
  { minWidth: 601, maxWidth: 650, baseFontSize: 27, baseLineHeight: 1.9 },
  // 651-700px
  { minWidth: 651, maxWidth: 700, baseFontSize: 27.5, baseLineHeight: 1.9 },
  // 701-750px
  { minWidth: 701, maxWidth: 750, baseFontSize: 28, baseLineHeight: 1.92 },
  // 751-800px
  { minWidth: 751, maxWidth: 800, baseFontSize: 28.5, baseLineHeight: 1.94 },
  // 801-850px
  { minWidth: 801, maxWidth: 850, baseFontSize: 29, baseLineHeight: 1.96 },
  // 851-900px
  { minWidth: 851, maxWidth: 900, baseFontSize: 29.5, baseLineHeight: 1.98 },
  // 901-950px
  { minWidth: 901, maxWidth: 950, baseFontSize: 30, baseLineHeight: 2.0 },
  // 951-1000px
  { minWidth: 951, maxWidth: 1000, baseFontSize: 30.5, baseLineHeight: 2.02 },
  // 1001-1050px
  { minWidth: 1001, maxWidth: 1050, baseFontSize: 31, baseLineHeight: 2.04 },
  // 1051-1100px
  { minWidth: 1051, maxWidth: 1100, baseFontSize: 31.5, baseLineHeight: 2.06 },
  // 1101-1150px
  { minWidth: 1101, maxWidth: 1150, baseFontSize: 32, baseLineHeight: 2.08 },
  // 1151-1200px
  { minWidth: 1151, maxWidth: 1200, baseFontSize: 32.5, baseLineHeight: 2.1 },
  // 1201-1250px
  { minWidth: 1201, maxWidth: 1250, baseFontSize: 33, baseLineHeight: 2.12 },
  // 1251-1300px
  { minWidth: 1251, maxWidth: 1300, baseFontSize: 33.5, baseLineHeight: 2.14 },
  // 1301-1350px
  { minWidth: 1301, maxWidth: 1350, baseFontSize: 34, baseLineHeight: 2.16 },
  // 1351-1400px
  { minWidth: 1351, maxWidth: 1400, baseFontSize: 34.5, baseLineHeight: 2.18 },
  // 1401-1450px
  { minWidth: 1401, maxWidth: 1450, baseFontSize: 35, baseLineHeight: 2.2 },
  // 1451px and above
  { minWidth: 1451, baseFontSize: 36, baseLineHeight: 2.2 },
];