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
  // 301-350px
  { minWidth: 301, maxWidth: 350, baseFontSize: 12, baseLineHeight: 1.62 },
  // 351-400px
  { minWidth: 351, maxWidth: 400, baseFontSize: 9.5, baseLineHeight: 1.64 },
  // 401-450px
  { minWidth: 401, maxWidth: 450, baseFontSize: 11.7, baseLineHeight: 1.66 },
  // 451-500px
  { minWidth: 451, maxWidth: 500, baseFontSize: 13.5, baseLineHeight: 1.68 },
  // 501-550px
  { minWidth: 501, maxWidth: 550, baseFontSize: 15, baseLineHeight: 1.7 },
  // 551-600px
  { minWidth: 551, maxWidth: 600, baseFontSize: 16, baseLineHeight: 1.72 },
  // 601-650px
  { minWidth: 601, maxWidth: 650, baseFontSize: 17, baseLineHeight: 1.74 },
  // 651-700px
  { minWidth: 651, maxWidth: 700, baseFontSize: 18, baseLineHeight: 1.76 },
  // 701-750px
  { minWidth: 701, maxWidth: 750, baseFontSize: 19, baseLineHeight: 1.78 },
  // 751-800px
  { minWidth: 751, maxWidth: 800, baseFontSize: 20, baseLineHeight: 1.8 },
  // 801-850px
  { minWidth: 801, maxWidth: 850, baseFontSize: 21, baseLineHeight: 1.82 },
  // 851-900px
  { minWidth: 851, maxWidth: 900, baseFontSize: 22, baseLineHeight: 1.84 },
  // 901-950px
  { minWidth: 901, maxWidth: 950, baseFontSize: 23, baseLineHeight: 1.86 },
  // 951-1000px
  { minWidth: 951, maxWidth: 1000, baseFontSize: 24, baseLineHeight: 1.88 },
  // 1001-1050px
  { minWidth: 1001, maxWidth: 1050, baseFontSize: 25, baseLineHeight: 1.9 },
  // 1051-1100px
  { minWidth: 1051, maxWidth: 1100, baseFontSize: 26, baseLineHeight: 1.92 },
  // 1101-1150px
  { minWidth: 1101, maxWidth: 1150, baseFontSize: 27, baseLineHeight: 1.94 },
  // 1151-1200px
  { minWidth: 1151, maxWidth: 1200, baseFontSize: 28, baseLineHeight: 1.96 },
  // 1201-1250px
  { minWidth: 1201, maxWidth: 1250, baseFontSize: 29, baseLineHeight: 1.98 },
  // 1251-1300px
  { minWidth: 1251, maxWidth: 1300, baseFontSize: 30, baseLineHeight: 2.0 },
  // 1301-1350px
  { minWidth: 1301, maxWidth: 1350, baseFontSize: 30.5, baseLineHeight: 2.02 },
  // 1351-1400px
  { minWidth: 1351, maxWidth: 1400, baseFontSize: 31, baseLineHeight: 2.04 },
  // 1401-1450px
  { minWidth: 1401, maxWidth: 1450, baseFontSize: 31.5, baseLineHeight: 2.06 },
  // 1451px and above
  { minWidth: 1451, baseFontSize: 32, baseLineHeight: 2.08 },
];