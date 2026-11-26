// ANGKA NUSANTARA — chart helpers.
//
// Plain canvas 2D, no libraries. Every chart is drawn by this file
// from the numbers in data.js; nothing is a static image. All text
// uses the page font so the charts stay legible at any size.

const INK = "#1c2b33";
const FAINT = "#7a6f5d";
const GRID = "#e3dcc9";
const TERRA = "#c4552d";
const TEAL = "#0f5b4d";
const GOLD = "#d9a441";
const BAR = "#2e6f8e";

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.font = "12px Georgia, 'Times New Roman', serif";
  return { ctx, width, height };
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const lo = Math.floor(min / s) * s;
  const out = [];
  for (let v = lo; v <= max + s * 0.001; v += s) out.push(v);
  return out;
}

function fmt(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(2).replace(/0$/, "");
}

// Line chart with points, gridlines and year labels.
export function drawLine(canvas, years, values, opts = {}) {
  const { ctx, width, height } = setup(canvas, opts.height || 260);
  const padL = 52, padR = 14, padT = 14, padB = 28;
  const w = width - padL - padR, h = height - padT - padB;
  let min = Math.min(...values), max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12;
  min -= pad; max += pad;
  const x = (i) => padL + (i / (values.length - 1)) * w;
  const y = (v) => padT + h - ((v - min) / (max - min)) * h;

  const ticks = niceTicks(min, max, 4).filter((t) => t >= min - 1e-9 && t <= max + 1e-9);
  ctx.strokeStyle = GRID; ctx.lineWidth = 1;
  ctx.fillStyle = FAINT; ctx.textAlign = "right";
  for (const t of ticks) {
    ctx.beginPath(); ctx.moveTo(padL, y(t)); ctx.lineTo(width - padR, y(t)); ctx.stroke();
    ctx.fillText(fmt(t), padL - 8, y(t) + 4);
  }
  years.forEach((yr, i) => {
    if (i === 0) { ctx.textAlign = "left"; ctx.fillText(String(yr), x(i), height - 8); }
    else if (i === years.length - 1) { ctx.textAlign = "right"; ctx.fillText(String(yr), x(i), height - 8); }
    else { ctx.textAlign = "center"; ctx.fillText(String(yr), x(i), height - 8); }
  });

  ctx.strokeStyle = opts.color || TEAL; ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.stroke();
  ctx.fillStyle = opts.color || TEAL;
  values.forEach((v, i) => {
    ctx.beginPath(); ctx.arc(x(i), y(v), 3.5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = INK; ctx.font = "bold 12px Georgia, serif"; ctx.textAlign = "center";
  values.forEach((v, i) => {
    // A value label too close to a gridline label would collide with
    // it on the left edge, so drop it below the point instead. The
    // baselines sit 14px apart by construction, so anything under
    // 28px of vertical room reads as a collision.
    const nearTick = ticks.some((t) => Math.abs(y(v) - y(t)) < 28);
    const edge = i === 0 || i === values.length - 1;
    ctx.fillText(fmt(v), x(i), nearTick && edge ? y(v) + 17 : y(v) - 10);
  });
  ctx.font = "12px Georgia, serif";
}

// Vertical bar chart.
export function drawBars(canvas, labels, values, opts = {}) {
  const { ctx, width, height } = setup(canvas, opts.height || 260);
  const padL = 52, padR = 14, padT = 26, padB = 28;
  const w = width - padL - padR, h = height - padT - padB;
  let min = Math.min(0, ...values), max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const y = (v) => padT + h - ((v - min) / (max - min)) * h;
  const slot = w / values.length;
  const bw = Math.min(46, slot * 0.62);

  const ticks = niceTicks(min, max, 4).filter((t) => t >= min - 1e-9 && t <= max + 1e-9);
  ctx.strokeStyle = GRID; ctx.lineWidth = 1;
  ctx.fillStyle = FAINT; ctx.textAlign = "right";
  for (const t of ticks) {
    ctx.beginPath(); ctx.moveTo(padL, y(t)); ctx.lineTo(width - padR, y(t)); ctx.stroke();
    ctx.fillText(fmt(t), padL - 8, y(t) + 4);
  }
  ctx.fillStyle = opts.color || BAR;
  values.forEach((v, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = y(Math.max(v, 0)), bot = y(Math.min(v, 0));
    ctx.fillRect(cx - bw / 2, top, bw, Math.max(1, bot - top));
  });
  ctx.fillStyle = INK; ctx.font = "bold 12px Georgia, serif"; ctx.textAlign = "center";
  values.forEach((v, i) => {
    const cx = padL + slot * i + slot / 2;
    ctx.fillText(fmt(v), cx, y(v) - 6 < padT ? padT + 10 : y(v) - 6);
  });
  ctx.fillStyle = FAINT; ctx.font = "12px Georgia, serif";
  labels.forEach((lb, i) => {
    const cx = padL + slot * i + slot / 2;
    ctx.fillText(String(lb), cx, height - 8);
  });
}

// Donut chart with a legend column drawn beside it.
export function drawDonut(canvas, items, opts = {}) {
  const { ctx, width, height } = setup(canvas, opts.height || 240);
  const cx = 110, cy = height / 2, r = Math.min(88, height / 2 - 14), inner = r * 0.58;
  const total = items.reduce((s, it) => s + it.share, 0);
  const palette = [TEAL, TERRA, GOLD, BAR, "#7a9e7e", "#b07d4f", "#5b7a99", "#a34d6e", "#8a7ca8", "#6b8e6b"];
  let a = -Math.PI / 2;
  items.forEach((it, i) => {
    const sweep = (it.share / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.fillStyle = palette[i % palette.length];
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a + sweep);
    ctx.closePath(); ctx.fill();
    a += sweep;
  });
  ctx.beginPath(); ctx.fillStyle = "#f6f1e7";
  ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = INK; ctx.font = "bold 15px Georgia, serif"; ctx.textAlign = "center";
  ctx.fillText("100%", cx, cy - 2);
  ctx.fillStyle = FAINT; ctx.font = "11px Georgia, serif";
  ctx.fillText("of GDP", cx, cy + 14);

  ctx.textAlign = "left"; ctx.font = "12px Georgia, serif";
  items.forEach((it, i) => {
    const ly = 22 + i * ((height - 30) / items.length);
    ctx.fillStyle = palette[i % palette.length];
    ctx.fillRect(218, ly - 9, 12, 12);
    ctx.fillStyle = INK;
    ctx.fillText(`${it.name} — ${it.share.toFixed(1)}%`, 236, ly + 2);
  });
}

// Horizontal bars for ranked lists (provinces, commodities, partners).
export function drawHbars(canvas, rows, opts = {}) {
  const rowH = opts.rowH || 30;
  const height = rows.length * rowH + 34;
  const { ctx, width } = setup(canvas, height);
  const maxV = Math.max(...rows.map((r) => r.value));
  const padL = opts.labelWidth || 170, padR = 64, padT = 10;
  const barW = width - padL - padR;
  ctx.font = "12px Georgia, serif";
  rows.forEach((r, i) => {
    const y = padT + i * rowH + rowH / 2;
    ctx.fillStyle = INK; ctx.textAlign = "right";
    ctx.fillText(r.label, padL - 10, y + 4);
    ctx.fillStyle = opts.color || TEAL;
    const bw = Math.max(2, (r.value / maxV) * barW);
    ctx.fillRect(padL, y - 8, bw, 16);
    ctx.fillStyle = INK; ctx.textAlign = "left";
    ctx.fillText(r.display ?? fmt(r.value), padL + bw + 8, y + 4);
  });
  ctx.fillStyle = FAINT; ctx.textAlign = "left";
  ctx.fillText(opts.footnote || "", padL, height - 6);
}

// Small sparkline for overview cards.
export function drawSpark(canvas, values, color = TEAL) {
  const { ctx, width, height } = setup(canvas, 44);
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => 4 + (i / (values.length - 1)) * (width - 8);
  const y = (v) => 6 + (1 - (v - min) / span) * (height - 12);
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x(values.length - 1), y(values[values.length - 1]), 3, 0, Math.PI * 2); ctx.fill();
}
