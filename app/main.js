// ANGKA NUSANTARA — router and controls.
//
// The state lives here; the views only render it. Every control on a
// page re-renders that page with new state, so a control can never
// claim to do something it does not do.

import { VIEWS, ROUTES, navLinks } from "./views.js";

const state = {
  chartType: "line",
  tradeView: "exports",
  regionSort: "pop",
  regionQuery: "",
  regionSelected: null,
  compareA: 2019,
  compareB: 2024,
  priceYear: 2024,
};

const app = document.getElementById("app");
const nav = document.getElementById("nav");

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  return ROUTES.some((r) => r.hash === hash) ? hash : "";
}

function render() {
  const route = currentRoute();
  nav.innerHTML = navLinks(route);
  const view = VIEWS[route];
  app.innerHTML = view.render(state);
  view.bind(state);
  wireControls(route);
  window.scrollTo(0, 0);
}

function wireControls(route) {
  // Chart type toggle (Economy).
  app.querySelectorAll("[data-chart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.chartType = btn.dataset.chart;
      render();
    });
  });
  // Trade series toggle (Trade).
  app.querySelectorAll("[data-trade]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tradeView = btn.dataset.trade;
      render();
    });
  });
  // Year picker (Prices).
  app.querySelectorAll("[data-year]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.priceYear = Number(btn.dataset.year);
      render();
    });
  });
  // Province search + sort (Regions).
  const search = document.getElementById("region-search");
  if (search) {
    search.addEventListener("input", () => {
      state.regionQuery = search.value;
      render();
      const again = document.getElementById("region-search");
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    });
  }
  const sort = document.getElementById("region-sort");
  if (sort) {
    sort.addEventListener("change", () => {
      state.regionSort = sort.value;
      render();
    });
  }
  // Province rows (Regions).
  app.querySelectorAll("[data-province]").forEach((row) => {
    row.addEventListener("click", () => {
      state.regionSelected = row.dataset.province;
      render();
    });
  });
  // Compare selectors (Compare Years).
  const ca = document.getElementById("compare-a");
  if (ca) ca.addEventListener("change", () => { state.compareA = Number(ca.value); render(); });
  const cb = document.getElementById("compare-b");
  if (cb) cb.addEventListener("change", () => { state.compareB = Number(cb.value); render(); });
}

window.addEventListener("hashchange", render);
render();
