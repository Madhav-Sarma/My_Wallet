const baseColors = {
  primary: "#2868c6",
  text: "#1A2B42",
  border: "#CAD4E0",
  white: "#FFFFFF",
  textLight: "#607890",
  expense: "#D9534F",
  income: "#4cbb17",
  shadow: "#000000",
  lending: "#2868c6",
borrowing: "#3A3D5A",
    lending: "#2868c6",     // same as primary blue
  borrowing: "#3A3D5A",  // darker grey from midnight theme border
};

const coffeeTheme = {
  ...baseColors,
  background: "#ECE5DD",
  card: "#D7CCC8",
  text: "#4E342E",       // dark brown
  textLight: "#8D6E63",  // lighter brown
};

const forestTheme = {
  ...baseColors,
  background: "#E6F2EF",
  card: "#D0E6D6",
  text: "#1B5E20",        // deep green
  textLight: "#4CAF50",   // mid green
};

const purpleTheme = {
  ...baseColors,
  background: "#F3E8FD",
  card: "#E0CFFD",
  text: "#6A1B9A",        // rich purple
  textLight: "#AB47BC",   // soft purple
};

const oceanTheme = {
  ...baseColors,
  background: "#E4F2FB",
  card: "#CFE4F9",
  text: "#01579B",        // deep ocean blue
  textLight: "#4FC3F7",   // light ocean blue
};

const sunsetTheme = {
  ...baseColors,
  background: "#FFF3E0",
  card: "#FFE0B2",
  text: "#E65100",        // deep orange
  textLight: "#FF9800",   // lighter orange
};

const midnightTheme = {
  ...baseColors,
  background: "#1A1C2B",
  card: "#2E3047",
  text: "#FFFFFF",        // white text
  textLight: "#CBD3F5",   // soft blue-white
  border: "#3A3D5A",
};

const blossomTheme = {
  ...baseColors,
  background: "#FFF0F5",
  card: "#FFD9EC",
  text: "#C2185B",        // dark pink
  textLight: "#F06292",   // soft pink
};


export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  midnight: midnightTheme,
  blossom: blossomTheme,
};

//change this to switch themes
export const COLORS = THEMES.ocean; // default to midnight theme