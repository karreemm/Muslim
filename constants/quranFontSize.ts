interface BreakpointConfig {
  minWidth: number;
  maxWidth?: number;
  baseFontSize: number;
  baseLineHeight: number;
}

export const DEFAULT_BREAKPOINTS: BreakpointConfig[] = [
  { minWidth: 0, maxWidth: 50, baseFontSize: 9, baseLineHeight: 1.5 },
  { minWidth: 51, maxWidth: 100, baseFontSize: 9.5, baseLineHeight: 1.52 },
  { minWidth: 101, maxWidth: 150, baseFontSize: 10, baseLineHeight: 1.54 },
  { minWidth: 151, maxWidth: 200, baseFontSize: 10.5, baseLineHeight: 1.56 },
  { minWidth: 201, maxWidth: 250, baseFontSize: 11, baseLineHeight: 1.58 },
  { minWidth: 251, maxWidth: 300, baseFontSize: 9, baseLineHeight: 1.6 },
  { minWidth: 301, maxWidth: 350, baseFontSize: 11, baseLineHeight: 1.8 },
  { minWidth: 351, maxWidth: 400, baseFontSize: 14, baseLineHeight: 1.8 },
  { minWidth: 401, maxWidth: 450, baseFontSize: 17, baseLineHeight: 1.82 },
  { minWidth: 451, maxWidth: 500, baseFontSize: 20, baseLineHeight: 1.84 },
  { minWidth: 501, maxWidth: 550, baseFontSize: 22, baseLineHeight: 1.86 },
  { minWidth: 551, maxWidth: 600, baseFontSize: 25, baseLineHeight: 1.88 },
  { minWidth: 601, maxWidth: 650, baseFontSize: 28, baseLineHeight: 1.9 },
  { minWidth: 651, maxWidth: 700, baseFontSize: 30, baseLineHeight: 1.9 },
  { minWidth: 701, maxWidth: 750, baseFontSize: 33, baseLineHeight: 1.92 },
  { minWidth: 751, maxWidth: 800, baseFontSize: 35, baseLineHeight: 1.94 },
  { minWidth: 801, maxWidth: 850, baseFontSize: 32, baseLineHeight: 1.96 },
  { minWidth: 851, maxWidth: 900, baseFontSize: 34, baseLineHeight: 1.98 },
  { minWidth: 901, maxWidth: 950, baseFontSize: 36, baseLineHeight: 2.0 },
  { minWidth: 951, maxWidth: 1000, baseFontSize: 36, baseLineHeight: 2.02 },
  { minWidth: 1001, maxWidth: 1050, baseFontSize: 38, baseLineHeight: 2.04 },
  { minWidth: 1051, maxWidth: 1100, baseFontSize: 38, baseLineHeight: 2.06 },
  { minWidth: 1101, maxWidth: 1150, baseFontSize: 38, baseLineHeight: 2.08 },
  { minWidth: 1151, maxWidth: 1200, baseFontSize: 38, baseLineHeight: 2.1 },
  { minWidth: 1201, maxWidth: 1250, baseFontSize: 38, baseLineHeight: 2.12 },
  { minWidth: 1251, maxWidth: 1300, baseFontSize: 40, baseLineHeight: 2.14 },
  { minWidth: 1301, maxWidth: 1350, baseFontSize: 40, baseLineHeight: 2.16 },
  { minWidth: 1351, maxWidth: 1400, baseFontSize: 40, baseLineHeight: 2.18 },
  { minWidth: 1401, maxWidth: 1450, baseFontSize: 40, baseLineHeight: 2.2 },
  { minWidth: 1451, baseFontSize: 42, baseLineHeight: 2.2 },
];