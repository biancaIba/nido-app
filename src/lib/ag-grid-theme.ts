import { themeQuartz } from 'ag-grid-community';

/**
 * Custom AG Grid theme based on Skrift design tokens
 */
export const skriftGridTheme = themeQuartz.withParams({
  accentColor: "#7778FF",
  borderColor: "#D9D9DE",
  borderRadius: 4,
  browserColorScheme: "light",
  columnBorder: false,
  fontFamily: "var(--font-inter), var(--font-geist-sans), system-ui, sans-serif",
  headerBackgroundColor: "#F7F7F8",
  headerFontSize: 14,
  headerRowBorder: true,
  iconSize: 14,
  wrapperBorderRadius: 10
});

/**
 * Dark mode version of the custom AG Grid theme
 */
export const skriftGridThemeDark = themeQuartz.withParams({
  accentColor: "#7778FF",
  borderColor: "#393939",
  browserColorScheme: "dark",
  columnBorder: false,
  fontFamily: "var(--font-inter), var(--font-geist-sans), system-ui, sans-serif",
  headerBackgroundColor: "#2A2A2A",
  headerFontSize: 14,
  headerRowBorder: true,
  iconSize: 14,
  wrapperBorderRadius: 10
});