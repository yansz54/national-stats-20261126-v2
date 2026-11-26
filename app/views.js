// ANGKA NUSANTARA — page views.
//
// One render function per page. Every page is reached by a link in
// the masthead; every figure carries its source and year on the page;
// every control on a page changes what it says it changes.

import { META, YEARS, SERIES, SECTORS, AGE_GROUPS, UNEMPLOYMENT_BY_EDUCATION, LABOUR, INFLATION_COMPONENTS, COMMODITIES, PARTNERS, PROVINCES, PEOPLE, MINIMUM_WAGE } from "./data.js";
import { drawLine, drawBars, drawDonut, drawHbars, drawSpark } from "./charts.js";

export const ROUTES = [
  { hash: "", name: "Overview" },
  { hash: "population", name: "Population" },
  { hash: "economy", name: "Economy" },
  { hash: "jobs", name: "Jobs" },
  { hash: "prices", name: "Prices" },
  { hash: "trade", name: "Trade" },
  { hash: "regions", name: "Regions" },
  { hash: "people", name: "Health & Education" },
  { hash: "compare", name: "Compare Years" },
  { hash: "about", name: "About the Data" },
];

export function navLinks(current) {
  return ROUTES.map((r) => {
    const href = r.hash ? `#/${r.hash}` : "#/";
    const cls = r.hash === current ? ' class="active"' : "";
    return `<a href="${href}"${cls}>${r.name}</a>`;
  }).join("");
}

function srcLine(text) {
  return `<p class="source">Source: ${text}</p>`;
}

function fmt(n, decimals = 2) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function statCard(title, big, unit, sparkId, sparkValues, sparkColor, note) {
  return `<article class="card stat">
    <h3>${title}</h3>
    <p class="big">${big}</p>
    <p class="unit">${unit}</p>
    <canvas class="spark" id="${sparkId}" aria-label="Trend for ${title}"></canvas>
    <p class="note">${note}</p>
  </article>`;
}

// ---------- Overview ----------

function viewOverview() {
  const g = SERIES.growth.values, inf = SERIES.inflation.values;
  const un = SERIES.unemployment.values, pov = SERIES.poverty.values;
  const hd = SERIES.hdi.values, gd = SERIES.gdp.values;
  return `
  <section class="hero">
    <p class="kicker">Indonesia in numbers · ${META.updated}</p>
    <h2>One country, every number that matters.</h2>
    <p class="lede">Indonesia is the world's fourth most populous country and
    Southeast Asia's largest economy. This site gathers the figures a
    visitor needs — population, growth, jobs, prices, trade and the
    regions — from the national statistics office, each with its source
    and year on the page.</p>
  </section>
  <section class="grid stats">
    ${statCard("Population", "281.6m", "people, mid-2024", "sp-pop", SERIES.population.points.map((p) => p.value), "#0f5b4d", "Up from 270.2m at the 2020 census.")}
    ${statCard("GDP", "Rp 22,139tn", "nominal, 2024", "sp-gdp", gd, "#c4552d", "Real growth 5.03% in 2024.")}
    ${statCard("Growth", "5.03%", "real GDP, 2024", "sp-growth", g, "#0f5b4d", "After −2.07% in the pandemic year 2020.")}
    ${statCard("Inflation", "1.57%", "December 2024, year on year", "sp-inf", inf, "#d9a441", "Down from 5.51% in December 2022.")}
    ${statCard("Unemployment", "4.91%", "August 2024", "sp-un", un, "#2e6f8e", "Lowest August reading since 2019.")}
    ${statCard("Human Development", "75.02", "HDI, 2024", "sp-hdi", hd, "#0f5b4d", "Up from 74.39 in 2023.")}
  </section>
  <section class="card">
    <h3>Indonesia at a glance</h3>
    <dl class="facts">
      <div><dt>Capital</dt><dd>Jakarta (Nusantara is being built as the new capital)</dd></div>
      <div><dt>Provinces</dt><dd>38 provinces, from Aceh to Papua</dd></div>
      <div><dt>Language</dt><dd>Bahasa Indonesia, with 700+ local languages</dd></div>
      <div><dt>Currency</dt><dd>Rupiah (Rp)</dd></div>
      <div><dt>Largest island</dt><dd>New Guinea (shared with Papua New Guinea)</dd></div>
      <div><dt>Most populous province</dt><dd>West Java, ~49.9 million people (2024)</dd></div>
    </dl>
    ${srcLine("BPS, 2024. Province count reflects the 2022-2023 splits in Papua.")}
  </section>
  <section class="card">
    <h3>Where to start</h3>
    <p class="lede">Follow a question: how many people live here, and where?
    <a href="#/population">Population</a>. How is the economy doing?
    <a href="#/economy">Economy</a>. Who has work, and who does not?
    <a href="#/jobs">Jobs</a>. What do things cost? <a href="#/prices">Prices</a>.
    What does Indonesia sell to the world? <a href="#/trade">Trade</a>.
    How do the provinces compare? <a href="#/regions">Regions</a>.
    How healthy and educated is the population? <a href="#/people">Health &amp; Education</a>.
    Or put any two years side by side: <a href="#/compare">Compare Years</a>.</p>
  </section>`;
}

function bindOverview() {
  drawSpark(document.getElementById("sp-pop"), SERIES.population.points.map((p) => p.value), "#0f5b4d");
  drawSpark(document.getElementById("sp-gdp"), SERIES.gdp.values, "#c4552d");
  drawSpark(document.getElementById("sp-growth"), SERIES.growth.values, "#0f5b4d");
  drawSpark(document.getElementById("sp-inf"), SERIES.inflation.values, "#d9a441");
  drawSpark(document.getElementById("sp-un"), SERIES.unemployment.values, "#2e6f8e");
  drawSpark(document.getElementById("sp-hdi"), SERIES.hdi.values, "#0f5b4d");
}

// ---------- Population ----------

function viewPopulation() {
  const pts = SERIES.population.points;
  const rows = pts.map((p) => `<tr><td>${p.year}</td><td>${p.value.toFixed(1)} million${p.approx ? " ~" : ""}</td><td>${p.year === 2010 ? "Census" : p.year === 2020 ? "Census" : p.year === 2015 ? "Projection ~" : "Mid-year estimate"}</td></tr>`).join("");
  return `
  <h2>Population</h2>
  <p class="lede">281.6 million people at mid-2024 — the fourth largest
  population on earth, spread across more than 17,000 islands. Growth
  has slowed to about 1% a year.</p>
  <section class="card">
    <h3>Population, 2010–2024</h3>
    <canvas class="chart" id="ch-pop"></canvas>
    ${srcLine(SERIES.population.source + ". The 2015 point is a projection, marked ~.")}
  </section>
  <section class="grid two">
    <article class="card">
      <h3>Census milestones</h3>
      <table class="tbl"><thead><tr><th>Year</th><th>Population</th><th>What it is</th></tr></thead><tbody>${rows}</tbody></table>
    </article>
    <article class="card">
      <h3>Who lives here — age structure, 2024 ~</h3>
      <canvas class="chart" id="ch-age"></canvas>
      ${srcLine("BPS, 2024. Shares are approximate, marked ~. Two in three Indonesians are of working age (15–64).")}
    </article>
  </section>
  <section class="card">
    <h3>Where people live</h3>
    <p class="lede">Java holds about 56% of the population on about 7% of
    the land. Jakarta, the capital, packs ~10.7 million people into 664
    square kilometres — roughly 16,000 people per km². See the full
    province table on the <a href="#/regions">Regions</a> page.</p>
  </section>`;
}

function bindPopulation() {
  drawLine(document.getElementById("ch-pop"),
    SERIES.population.points.map((p) => p.year),
    SERIES.population.points.map((p) => p.value), { color: "#0f5b4d" });
  drawHbars(document.getElementById("ch-age"),
    AGE_GROUPS.map((a) => ({ label: a.group, value: a.share, display: a.share.toFixed(1) + "%" })),
    { color: "#0f5b4d", footnote: "Share of population, 2024 ~" });
}

// ---------- Economy ----------

function viewEconomy(state) {
  const perCapita = SERIES.gdp.values.map((g, i) => g * 1000 / [269.6, 270.2, 272.5, 275.8, 278.7, 281.6][i]);
  return `
  <h2>Economy</h2>
  <p class="lede">Nominal GDP reached Rp 22,139 trillion in 2024, with real
  growth of 5.03%. Per person that is about Rp 78.6 million a year.</p>
  <section class="card">
    <h3>Real GDP growth, 2019–2024</h3>
    <div class="controls">
      <button data-chart="line" class="${state.chartType === "line" ? "on" : ""}">Line</button>
      <button data-chart="bar" class="${state.chartType === "bar" ? "on" : ""}">Bars</button>
    </div>
    <canvas class="chart" id="ch-growth"></canvas>
    ${srcLine(SERIES.growth.source + ". 2020 is the pandemic contraction, −2.07%.")}
  </section>
  <section class="grid two">
    <article class="card">
      <h3>Nominal GDP, Rp trillion</h3>
      <canvas class="chart" id="ch-gdp"></canvas>
      ${srcLine(SERIES.gdp.source + ".")}
    </article>
    <article class="card">
      <h3>GDP per person, Rp million (computed)</h3>
      <canvas class="chart" id="ch-capita"></canvas>
      ${srcLine("Computed from nominal GDP and mid-year population; population for 2019–2023 is approximate, so this series is approximate too.")}
    </article>
  </section>
  <section class="card">
    <h3>What makes the economy — GDP by sector, 2024 ~</h3>
    <canvas class="chart" id="ch-sectors"></canvas>
    ${srcLine("BPS, 2024. Shares are rounded and approximate, marked ~. Manufacturing is the largest single sector.")}
  </section>`;
}

function bindEconomy(state) {
  const draw = state.chartType === "bar" ? drawBars : drawLine;
  draw(document.getElementById("ch-growth"), YEARS, SERIES.growth.values, { color: "#0f5b4d" });
  drawLine(document.getElementById("ch-gdp"), YEARS, SERIES.gdp.values, { color: "#c4552d" });
  drawLine(document.getElementById("ch-capita"), YEARS,
    SERIES.gdp.values.map((g, i) => g * 1000 / [269.6, 270.2, 272.5, 275.8, 278.7, 281.6][i]),
    { color: "#2e6f8e" });
  drawDonut(document.getElementById("ch-sectors"), SECTORS);
}

// ---------- Jobs ----------

function viewJobs() {
  return `
  <h2>Jobs</h2>
  <p class="lede">Of a labour force of ~152 million people (August 2024),
  ~144.6 million were working. Open unemployment was 4.91% — the
  lowest August reading since 2019 — but most work is informal.</p>
  <section class="grid three">
    <article class="card stat"><h3>Labour force</h3><p class="big">~152.1m</p><p class="unit">people, August 2024</p></article>
    <article class="card stat"><h3>Working</h3><p class="big">~144.6m</p><p class="unit">people, August 2024</p></article>
    <article class="card stat"><h3>Informal work</h3><p class="big">~59.2%</p><p class="unit">of workers, August 2024</p></article>
  </section>
  <section class="card">
    <h3>Open unemployment rate, 2019–2024</h3>
    <canvas class="chart" id="ch-unemp"></canvas>
    ${srcLine(SERIES.unemployment.source + ". The 2020 spike to 7.07% is the pandemic.")}
  </section>
  <section class="grid two">
    <article class="card">
      <h3>Unemployment by education, August 2024 ~</h3>
      <canvas class="chart" id="ch-edu"></canvas>
      ${srcLine("BPS Sakernas, August 2024. Rates are approximate, marked ~. Vocational high-school graduates face the highest rate.")}
    </article>
    <article class="card">
      <h3>Minimum wage</h3>
      <p class="lede">Jakarta's provincial minimum wage for 2025 is
      <strong>Rp ${MINIMUM_WAGE.jakarta2025.toLocaleString("en-US")}</strong>
      per month — the highest in the country, and the benchmark other
      provinces are measured against.</p>
      ${srcLine(MINIMUM_WAGE.source + ".")}
      <h3>Poverty, for context</h3>
      <p class="lede">The poverty rate was 9.03% in March 2024 — 25.22
      million people — down from 10.14% in March 2021. The Gini ratio
      stood at 0.379.</p>
      ${srcLine(SERIES.poverty.source + "; Gini " + SERIES.gini.source + ".")}
    </article>
  </section>`;
}

function bindJobs() {
  drawLine(document.getElementById("ch-unemp"), YEARS, SERIES.unemployment.values, { color: "#2e6f8e" });
  drawHbars(document.getElementById("ch-edu"),
    UNEMPLOYMENT_BY_EDUCATION.map((e) => ({ label: e.level, value: e.rate, display: e.rate.toFixed(1) + "%" })),
    { color: "#2e6f8e", labelWidth: 190, footnote: "Unemployment rate by education, % ~" });
}

// ---------- Prices ----------

function viewPrices(state) {
  const idx = YEARS.indexOf(state.priceYear);
  const val = SERIES.inflation.values[idx];
  return `
  <h2>Prices</h2>
  <p class="lede">Inflation — the December consumer-price rise, year on
  year — was 1.57% in 2024, inside Bank Indonesia's 2.5% ± 1% target
  band, after peaking at 5.51% in 2022.</p>
  <section class="card">
    <h3>Inflation, December year on year, 2019–2024</h3>
    <canvas class="chart" id="ch-inf"></canvas>
    ${srcLine(SERIES.inflation.source + ".")}
  </section>
  <section class="grid two">
    <article class="card">
      <h3>Pick a year</h3>
      <div class="controls">
        ${YEARS.map((y) => `<button data-year="${y}" class="${y === state.priceYear ? "on" : ""}">${y}</button>`).join("")}
      </div>
      <p class="big" id="price-readout">${val.toFixed(2)}%</p>
      <p class="unit">inflation in December ${state.priceYear}, year on year</p>
      <p class="lede">In December ${state.priceYear}, prices were
      ${val.toFixed(2)}% higher than a year earlier. The 2022 peak
      followed the September 2022 fuel-price rise; by 2024 the rate had
      fallen back to its lowest December reading in the series.</p>
    </article>
    <article class="card">
      <h3>What got more expensive — by component, 2024 ~</h3>
      <canvas class="chart" id="ch-comp"></canvas>
      ${srcLine("BPS, 2024 average. Component rates are approximate, marked ~.")}
    </article>
  </section>`;
}

function bindPrices() {
  drawLine(document.getElementById("ch-inf"), YEARS, SERIES.inflation.values, { color: "#d9a441" });
  drawHbars(document.getElementById("ch-comp"),
    INFLATION_COMPONENTS.map((c) => ({ label: c.component, value: c.rate, display: c.rate.toFixed(1) + "%" })),
    { color: "#d9a441", labelWidth: 190, footnote: "Average inflation by component, 2024 ~" });
}

// ---------- Trade ----------

function viewTrade(state) {
  const surplus = SERIES.exports.values.map((e, i) => +(e - SERIES.imports.values[i]).toFixed(1));
  const series = state.tradeView === "exports" ? SERIES.exports : state.tradeView === "imports" ? SERIES.imports : { label: "Trade surplus", unit: "US$ billion", values: surplus, source: "Computed from exports minus imports" };
  return `
  <h2>Trade</h2>
  <p class="lede">Indonesia has run a goods-trade surplus every year since
  2020. Exports hit a record US$291.9 billion in 2022 on high coal and
  palm-oil prices, then settled at US$264.7 billion in 2024.</p>
  <section class="card">
    <h3>${series.label}, 2019–2024</h3>
    <div class="controls">
      <button data-trade="exports" class="${state.tradeView === "exports" ? "on" : ""}">Exports</button>
      <button data-trade="imports" class="${state.tradeView === "imports" ? "on" : ""}">Imports</button>
      <button data-trade="surplus" class="${state.tradeView === "surplus" ? "on" : ""}">Surplus</button>
    </div>
    <canvas class="chart" id="ch-trade"></canvas>
    ${srcLine(series.source + ".")}
  </section>
  <section class="grid two">
    <article class="card">
      <h3>Top export commodities, 2024 ~</h3>
      <canvas class="chart" id="ch-commod"></canvas>
      ${srcLine("BPS / Customs, 2024. Values are approximate, marked ~.")}
    </article>
    <article class="card">
      <h3>Where exports go, 2024 ~</h3>
      <canvas class="chart" id="ch-partners"></canvas>
      ${srcLine("BPS / Customs, 2024. Shares are approximate, marked ~. One in four export dollars goes to China.")}
    </article>
  </section>`;
}

function bindTrade(state) {
  const surplus = SERIES.exports.values.map((e, i) => +(e - SERIES.imports.values[i]).toFixed(1));
  const values = state.tradeView === "exports" ? SERIES.exports.values : state.tradeView === "imports" ? SERIES.imports.values : surplus;
  drawLine(document.getElementById("ch-trade"), YEARS, values, { color: "#0f5b4d" });
  drawHbars(document.getElementById("ch-commod"),
    COMMODITIES.map((c) => ({ label: c.name, value: c.value, display: "$" + c.value.toFixed(1) + "bn" })),
    { color: "#0f5b4d", labelWidth: 190, footnote: "US$ billion, 2024 ~" });
  drawHbars(document.getElementById("ch-partners"),
    PARTNERS.map((p) => ({ label: p.country, value: p.share, display: p.share.toFixed(1) + "%" })),
    { color: "#c4552d", labelWidth: 130, footnote: "Share of exports, 2024 ~" });
}

// ---------- Regions ----------

function provinceDensity(p) {
  return (p.pop * 1000000) / (p.area * 1000);
}

function regionRows(state) {
  let list = PROVINCES.slice();
  const q = state.regionQuery.trim().toLowerCase();
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
  const key = state.regionSort;
  list.sort((a, b) => {
    if (key === "name") return a.name.localeCompare(b.name);
    if (key === "density") return provinceDensity(b) - provinceDensity(a);
    if (key === "hdi") return b.hdi - a.hdi;
    return b.pop - a.pop;
  });
  return list;
}

function viewRegions(state) {
  const rows = regionRows(state).map((p) => {
    const sel = state.regionSelected === p.name ? ' class="sel"' : "";
    return `<tr data-province="${p.name}"${sel}><td>${p.name}</td><td>~${p.pop.toFixed(1)}m</td><td>${Math.round(provinceDensity(p)).toLocaleString("en-US")}</td><td>~${p.hdi.toFixed(1)}</td></tr>`;
  }).join("");
  const sel = PROVINCES.find((p) => p.name === state.regionSelected);
  const detail = sel ? `
    <article class="card">
      <h3>${sel.name}</h3>
      <dl class="facts">
        <div><dt>Population (2024 ~)</dt><dd>~${sel.pop.toFixed(1)} million</dd></div>
        <div><dt>Area</dt><dd>${sel.area.toLocaleString("en-US")} thousand km²</dd></div>
        <div><dt>Density (computed)</dt><dd>~${Math.round(provinceDensity(sel)).toLocaleString("en-US")} people per km²</dd></div>
        <div><dt>HDI 2024 ~</dt><dd>${sel.hdi.toFixed(1)}</dd></div>
        <div><dt>Share of Indonesia</dt><dd>${(sel.pop / 281.6 * 100).toFixed(1)}% of the population</dd></div>
      </dl>
      ${srcLine("BPS, 2024. Population and HDI are approximate, marked ~; density is computed.")}
    </article>` : `
    <article class="card">
      <h3>Pick a province</h3>
      <p class="lede">Click any row in the table to see that province's
      detail card here — population, area, density and human development.</p>
    </article>`;
  return `
  <h2>Regions</h2>
  <p class="lede">Indonesia's 38 provinces range from Jakarta, the densest
  place in the country, to the vast, thinly settled provinces of
  Kalimantan and Papua. The table below is the 21 largest provinces by
  population; use the search and sort controls to explore it.</p>
  <section class="grid two">
    <article class="card wide-table">
      <h3>Provinces by population, 2024 ~</h3>
      <div class="controls">
        <input id="region-search" type="search" placeholder="Search a province…" value="${state.regionQuery}" aria-label="Search provinces">
        <select id="region-sort" aria-label="Sort provinces">
          <option value="pop" ${state.regionSort === "pop" ? "selected" : ""}>Sort: population</option>
          <option value="density" ${state.regionSort === "density" ? "selected" : ""}>Sort: density</option>
          <option value="hdi" ${state.regionSort === "hdi" ? "selected" : ""}>Sort: HDI</option>
          <option value="name" ${state.regionSort === "name" ? "selected" : ""}>Sort: name A–Z</option>
        </select>
      </div>
      <table class="tbl clickable"><thead><tr><th>Province</th><th>Population</th><th>Density /km²</th><th>HDI</th></tr></thead><tbody>${rows}</tbody></table>
      ${srcLine("BPS, 2024. Populations and HDI are approximate, marked ~; density is computed from population and published area.")}
    </article>
    ${detail}
  </section>`;
}

function bindRegions() {}

// ---------- People ----------

function viewPeople() {
  const p = PEOPLE;
  return `
  <h2>Health &amp; Education</h2>
  <p class="lede">Development is more than GDP. The Human Development
  Index reached 75.02 in 2024 — its highest reading yet — on longer
  lives and more schooling.</p>
  <section class="card">
    <h3>Human Development Index, 2019–2024</h3>
    <canvas class="chart" id="ch-hdi"></canvas>
    ${srcLine(SERIES.hdi.source + ".")}
  </section>
  <section class="grid three">
    <article class="card stat"><h3>Life expectancy</h3><p class="big">~${p.lifeExpectancy.value.toFixed(1)} yrs</p><p class="unit">${p.lifeExpectancy.source}</p></article>
    <article class="card stat"><h3>Mean years of schooling</h3><p class="big">~${p.meanSchooling.value.toFixed(1)} yrs</p><p class="unit">${p.meanSchooling.source}</p></article>
    <article class="card stat"><h3>Expected years of schooling</h3><p class="big">~${p.expectedSchooling.value.toFixed(1)} yrs</p><p class="unit">${p.expectedSchooling.source}</p></article>
    <article class="card stat"><h3>Adult literacy</h3><p class="big">~${p.literacy.value.toFixed(1)}%</p><p class="unit">${p.literacy.source}</p></article>
    <article class="card stat"><h3>Infant mortality</h3><p class="big">~${p.infantMortality.value.toFixed(1)}</p><p class="unit">${p.infantMortality.unit}, ${p.infantMortality.source}</p></article>
    <article class="card stat"><h3>Doctors</h3><p class="big">~${p.doctorsPer10k.value.toFixed(1)}</p><p class="unit">${p.doctorsPer10k.unit}, ${p.doctorsPer10k.source}</p></article>
  </section>
  <section class="card">
    <h3>Highest HDI by province, 2024 ~</h3>
    <canvas class="chart" id="ch-hdi-prov"></canvas>
    ${srcLine("BPS, 2024. Provincial HDI values are approximate, marked ~. Jakarta leads at ~83.7; Yogyakarta follows at ~81.5.")}
  </section>`;
}

function bindPeople() {
  drawLine(document.getElementById("ch-hdi"), YEARS, SERIES.hdi.values, { color: "#0f5b4d" });
  const top = PROVINCES.slice().sort((a, b) => b.hdi - a.hdi).slice(0, 8);
  drawHbars(document.getElementById("ch-hdi-prov"),
    top.map((p) => ({ label: p.name, value: p.hdi, display: "~" + p.hdi.toFixed(1) })),
    { color: "#0f5b4d", labelWidth: 150, footnote: "HDI by province, 2024 ~" });
}

// ---------- Compare ----------

const COMPARE_ROWS = [
  { label: "Population", unit: "million", get: (y) => (y === 2024 ? "281.6" : y === 2020 ? "270.2" : y === 2010 ? "237.6" : null), note: "Census / estimate years only" },
  { label: "Real GDP growth", unit: "%", get: (y) => SERIES.growth.values[YEARS.indexOf(y)].toFixed(2) },
  { label: "Nominal GDP", unit: "Rp trillion", get: (y) => SERIES.gdp.values[YEARS.indexOf(y)].toLocaleString("en-US") },
  { label: "Inflation (Dec, YoY)", unit: "%", get: (y) => SERIES.inflation.values[YEARS.indexOf(y)].toFixed(2) },
  { label: "Unemployment (Aug)", unit: "%", get: (y) => SERIES.unemployment.values[YEARS.indexOf(y)].toFixed(2) },
  { label: "Poverty rate (Mar)", unit: "%", get: (y) => SERIES.poverty.values[YEARS.indexOf(y)].toFixed(2) },
  { label: "People in poverty (Mar)", unit: "million ~", get: (y) => SERIES.poorPeople.values[YEARS.indexOf(y)].toFixed(2) },
  { label: "Gini ratio (Mar)", unit: "0–1", get: (y) => SERIES.gini.values[YEARS.indexOf(y)].toFixed(3) },
  { label: "HDI", unit: "index", get: (y) => SERIES.hdi.values[YEARS.indexOf(y)].toFixed(2) },
  { label: "Exports", unit: "US$ billion", get: (y) => SERIES.exports.values[YEARS.indexOf(y)].toFixed(1) },
  { label: "Imports", unit: "US$ billion", get: (y) => SERIES.imports.values[YEARS.indexOf(y)].toFixed(1) },
];

function viewCompare(state) {
  const a = state.compareA, b = state.compareB;
  const opts = (sel) => YEARS.map((y) => `<option value="${y}" ${y === sel ? "selected" : ""}>${y}</option>`).join("");
  const rows = COMPARE_ROWS.map((r) => {
    const va = r.get(a), vb = r.get(b);
    const cell = (v) => (v === null || v === undefined ? "—" : v);
    let change = "—";
    if (va !== null && vb !== null) {
      const na = parseFloat(String(va).replace(/,/g, "")), nb = parseFloat(String(vb).replace(/,/g, ""));
      if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        const d = nb - na;
        change = (d > 0 ? "+" : "") + d.toFixed(2);
      }
    }
    return `<tr><td>${r.label}</td><td>${r.unit}</td><td>${cell(va)}</td><td>${cell(vb)}</td><td>${change}</td></tr>`;
  }).join("");
  return `
  <h2>Compare Years</h2>
  <p class="lede">Pick any two years and put every headline indicator
  side by side. The pandemic year 2020 against 2024 shows the recovery
  in one glance.</p>
  <section class="card">
    <div class="controls">
      <label>Year A <select id="compare-a">${opts(a)}</select></label>
      <label>Year B <select id="compare-b">${opts(b)}</select></label>
    </div>
    <table class="tbl"><thead><tr><th>Indicator</th><th>Unit</th><th>${a}</th><th>${b}</th><th>Change</th></tr></thead><tbody>${rows}</tbody></table>
    ${srcLine("BPS, 2019–2024. Population is shown only for census and estimate years (2010, 2020, 2024); the poverty-people figures are approximate, marked ~.")}
  </section>`;
}

function bindCompare() {}

// ---------- About ----------

function viewAbout() {
  return `
  <h2>About the Data</h2>
  <p class="lede">This site is an independent explorer built from
  published figures of BPS (Statistics Indonesia). It is not BPS, and
  it is not affiliated with BPS.</p>
  <section class="card">
    <h3>Sources</h3>
    <ul class="list">
      <li><strong>Population</strong> — BPS Census 2010, Census 2020, mid-year estimates.</li>
      <li><strong>Economy</strong> — BPS national accounts (GDP, growth) 2019–2024.</li>
      <li><strong>Jobs</strong> — BPS Sakernas (National Labour Force Survey), August rounds.</li>
      <li><strong>Prices</strong> — BPS consumer price index, December year-on-year.</li>
      <li><strong>Poverty &amp; inequality</strong> — BPS, March rounds.</li>
      <li><strong>Trade</strong> — BPS / Customs export and import statistics.</li>
      <li><strong>Health &amp; education</strong> — BPS Human Development Index and related series; doctors from the Ministry of Health.</li>
      <li><strong>Minimum wage</strong> — Jakarta provincial government, 2025.</li>
    </ul>
  </section>
  <section class="card">
    <h3>The "~" rule</h3>
    <p class="lede">A figure marked "~" is approximate: a rounded
    mid-year estimate, a share, or a number whose exact decimal could
    not be verified before publication. Unmarked figures are the
    published figure to the precision shown. Anything labelled
    "computed" — GDP per person, province density, the trade surplus —
    is arithmetic on the published inputs, done in the page's own code.</p>
  </section>
  <section class="card">
    <h3>What each indicator means</h3>
    <dl class="facts">
      <div><dt>Real GDP growth</dt><dd>How much the economy's output grew, after removing price rises.</dd></div>
      <div><dt>Inflation (Dec, YoY)</dt><dd>How much consumer prices rose in December versus the previous December.</dd></div>
      <div><dt>Open unemployment rate</dt><dd>People without work, looking for work, as a share of the labour force.</dd></div>
      <div><dt>Poverty rate</dt><dd>People living below the BPS poverty line, as a share of the population.</dd></div>
      <div><dt>Gini ratio</dt><dd>Inequality of spending: 0 is perfect equality, 1 is total concentration.</dd></div>
      <div><dt>HDI</dt><dd>Human Development Index: health, education and income combined, 0–100.</dd></div>
    </dl>
  </section>
  <section class="card">
    <h3>How this site works</h3>
    <p class="lede">The site is plain static files — no build step, no
    network, no tracking. Charts are drawn by its own canvas code from
    the figures in its data file. It works on a desktop and on a phone,
    and every page is reached by a link.</p>
  </section>`;
}

function bindAbout() {}

// ---------- Router table ----------

export const VIEWS = {
  "": { render: viewOverview, bind: bindOverview },
  population: { render: viewPopulation, bind: bindPopulation },
  economy: { render: viewEconomy, bind: bindEconomy },
  jobs: { render: viewJobs, bind: bindJobs },
  prices: { render: viewPrices, bind: bindPrices },
  trade: { render: viewTrade, bind: bindTrade },
  regions: { render: viewRegions, bind: bindRegions },
  people: { render: viewPeople, bind: bindPeople },
  compare: { render: viewCompare, bind: bindCompare },
  about: { render: viewAbout, bind: bindAbout },
};
