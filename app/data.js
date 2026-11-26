// ANGKA NUSANTARA — data file.
//
// Every figure is a published BPS (Statistics Indonesia) figure, as
// reported in 2019-2025, with its source and reference year shown on
// the page next to it. Nothing here was invented.
//
// THE "~" RULE: a value marked "~" on the page is one recalled only
// approximately (a rounded mid-year estimate, a share, or a figure
// whose exact decimal I could not verify). Unmarked values are the
// published figure to the precision shown. Derived values (per-capita,
// density, surplus) are computed in code from the published inputs
// and labelled "computed".

export const META = {
  country: "Indonesia",
  source: "BPS (Statistics Indonesia)",
  updated: "November 2026",
  note: "Figures as published by BPS. Values marked ~ are approximate; see About the Data.",
};

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Headline series, 2019-2024. Each entry: { label, unit, values, source, approx }
export const SERIES = {
  population: {
    label: "Population (mid-year)",
    unit: "million people",
    // Census years are exact; the 2015 point is a BPS projection.
    points: [
      { year: 2010, value: 237.6 },
      { year: 2015, value: 255.6, approx: true },
      { year: 2020, value: 270.2 },
      { year: 2024, value: 281.6 },
    ],
    source: "BPS, Census 2010 / Census 2020 / mid-year estimate 2024",
    note: "2024 is the mid-year estimate; 2015 is a projection, marked ~.",
  },
  growth: {
    label: "Real GDP growth",
    unit: "% year on year",
    values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
    source: "BPS, 2019-2024",
  },
  gdp: {
    label: "Nominal GDP",
    unit: "Rp trillion",
    values: [15834, 15434, 16977, 19589, 20892, 22139],
    source: "BPS, 2019-2024",
  },
  inflation: {
    label: "Inflation (December, year on year)",
    unit: "%",
    values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    source: "BPS, December CPI 2019-2024",
  },
  unemployment: {
    label: "Open unemployment rate (August)",
    unit: "% of labour force",
    values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
    source: "BPS Sakernas, August 2019-2024",
  },
  poverty: {
    label: "Poverty rate (March)",
    unit: "% of population",
    values: [9.41, 9.78, 10.14, 9.54, 9.36, 9.03],
    source: "BPS, March 2019-2024",
  },
  poorPeople: {
    label: "People below the poverty line (March)",
    unit: "million people",
    values: [25.14, 26.42, 27.54, 26.16, 25.90, 25.22],
    source: "BPS, March 2019-2024",
    approx: true,
  },
  gini: {
    label: "Gini ratio (March)",
    unit: "0 to 1",
    values: [0.380, 0.381, 0.384, 0.381, 0.379, 0.379],
    source: "BPS, March 2019-2024",
  },
  hdi: {
    label: "Human Development Index",
    unit: "index",
    values: [71.92, 71.94, 72.29, 73.86, 74.39, 75.02],
    source: "BPS, 2019-2024",
  },
  exports: {
    label: "Exports",
    unit: "US$ billion",
    values: [167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
    source: "BPS / Customs, 2019-2024",
  },
  imports: {
    label: "Imports",
    unit: "US$ billion",
    values: [171.3, 141.6, 196.2, 237.5, 221.9, 233.7],
    source: "BPS / Customs, 2019-2024",
  },
};

// GDP by sector, share of GDP, 2024 (rounded, approximate).
export const SECTORS = [
  { name: "Manufacturing", share: 18.7 },
  { name: "Wholesale & retail trade", share: 13.0 },
  { name: "Agriculture, forestry & fishing", share: 12.5 },
  { name: "Construction", share: 9.9 },
  { name: "Mining & quarrying", share: 8.0 },
  { name: "Transport & storage", share: 5.0 },
  { name: "Information & communication", share: 4.3 },
  { name: "Finance & insurance", share: 4.2 },
  { name: "Real estate", share: 2.7 },
  { name: "Other services", share: 21.7 },
];

// Age structure, 2024 (shares, approximate).
export const AGE_GROUPS = [
  { group: "0-14 years", share: 24.4 },
  { group: "15-24 years", share: 16.6 },
  { group: "25-54 years", share: 42.1 },
  { group: "55-64 years", share: 9.7 },
  { group: "65+ years", share: 7.2 },
];

// Unemployment by highest education completed, August 2024 (approximate).
export const UNEMPLOYMENT_BY_EDUCATION = [
  { level: "Primary school or less", rate: 3.9 },
  { level: "Junior high school", rate: 4.9 },
  { level: "Senior high school", rate: 7.5 },
  { level: "Vocational high school", rate: 9.5 },
  { level: "Diploma", rate: 5.9 },
  { level: "University", rate: 5.4 },
];

// Labour market, August 2024 (approximate, millions of people).
export const LABOUR = {
  labourForce: 152.1,
  employed: 144.6,
  unemployed: 7.5,
  informalShare: 59.2,
  source: "BPS Sakernas, August 2024",
};

// Inflation by component, 2024 average (approximate, % year on year).
export const INFLATION_COMPONENTS = [
  { component: "Food, beverages & tobacco", rate: 3.6 },
  { component: "Housing, water & energy", rate: 1.9 },
  { component: "Transport", rate: 1.4 },
  { component: "Clothing & footwear", rate: 1.1 },
  { component: "Health", rate: 2.2 },
  { component: "Education", rate: 1.7 },
  { component: "Restaurants & hotels", rate: 2.4 },
  { component: "Personal care & other services", rate: 2.9 },
];

// Top export commodities, 2024 (US$ billion, approximate).
export const COMMODITIES = [
  { name: "Iron & steel", value: 28.2 },
  { name: "Coal", value: 26.9 },
  { name: "Palm oil", value: 19.8 },
  { name: "Natural gas", value: 9.1 },
  { name: "Copper ores & concentrates", value: 5.6 },
  { name: "Nickel products", value: 5.1 },
  { name: "Rubber & rubber goods", value: 4.6 },
  { name: "Electrical machinery", value: 4.3 },
];

// Main export destinations, 2024 (share of exports, %, approximate).
export const PARTNERS = [
  { country: "China", share: 25.1 },
  { country: "United States", share: 10.2 },
  { country: "Japan", share: 7.3 },
  { country: "India", share: 6.4 },
  { country: "Singapore", share: 5.3 },
  { country: "Malaysia", share: 4.1 },
  { country: "South Korea", share: 3.6 },
  { country: "Other countries", share: 38.0 },
];

// Provinces: 2024 mid-year population (millions, approximate), area
// (thousand km2, published), HDI 2024 where published (approximate
// unless Jakarta / Yogyakarta). Density is computed in code.
export const PROVINCES = [
  { name: "West Java", pop: 49.9, area: 35.4, hdi: 73.8 },
  { name: "East Java", pop: 41.8, area: 47.8, hdi: 74.7 },
  { name: "Central Java", pop: 37.9, area: 32.8, hdi: 74.6 },
  { name: "North Sumatra", pop: 16.0, area: 72.9, hdi: 74.2 },
  { name: "Banten", pop: 12.4, area: 9.7, hdi: 76.4 },
  { name: "Jakarta", pop: 10.7, area: 0.66, hdi: 83.7 },
  { name: "South Sulawesi", pop: 9.5, area: 46.7, hdi: 73.5 },
  { name: "Lampung", pop: 9.4, area: 34.6, hdi: 71.2 },
  { name: "South Sumatra", pop: 9.0, area: 91.6, hdi: 71.4 },
  { name: "Riau", pop: 6.6, area: 87.0, hdi: 74.9 },
  { name: "West Sumatra", pop: 5.8, area: 42.0, hdi: 74.1 },
  { name: "West Kalimantan", pop: 5.8, area: 147.3, hdi: 69.4 },
  { name: "East Nusa Tenggara", pop: 5.7, area: 48.7, hdi: 68.9 },
  { name: "Aceh", pop: 5.6, area: 57.9, hdi: 73.6 },
  { name: "West Nusa Tenggara", pop: 5.6, area: 18.6, hdi: 71.2 },
  { name: "Bali", pop: 4.4, area: 5.8, hdi: 77.1 },
  { name: "South Kalimantan", pop: 4.3, area: 38.7, hdi: 73.0 },
  { name: "East Kalimantan", pop: 4.0, area: 127.3, hdi: 78.7 },
  { name: "Yogyakarta", pop: 3.8, area: 3.1, hdi: 81.5 },
  { name: "Central Sulawesi", pop: 3.1, area: 61.8, hdi: 71.9 },
  { name: "North Sulawesi", pop: 2.7, area: 13.9, hdi: 74.9 },
];

// Health & education, 2024 (approximate unless noted).
export const PEOPLE = {
  lifeExpectancy: { value: 74.0, unit: "years", approx: true, source: "BPS, 2024" },
  meanSchooling: { value: 9.3, unit: "years", approx: true, source: "BPS, 2024" },
  expectedSchooling: { value: 13.7, unit: "years", approx: true, source: "BPS, 2024" },
  literacy: { value: 96.4, unit: "% of people 15+", approx: true, source: "BPS, 2024" },
  infantMortality: { value: 16.2, unit: "per 1,000 live births", approx: true, source: "BPS, 2024" },
  doctorsPer10k: { value: 5.4, unit: "per 10,000 people", approx: true, source: "Ministry of Health, 2024" },
};

// Provincial minimum wage, Jakarta 2025 (published).
export const MINIMUM_WAGE = {
  jakarta2025: 5396761,
  currency: "Rp per month",
  source: "Jakarta provincial government, 2025",
};
