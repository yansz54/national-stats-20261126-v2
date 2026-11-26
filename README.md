# ANGKA NUSANTARA — Indonesia in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![make.fun rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/yansz54/national-stats-20261126-v2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![make.fun reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/yansz54/national-stats-20261126-v2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An entry for the [make.fun "Build the best national statistics site"](https://make.fun/bounty/best-national-statistics-site-20261126-0539) bounty.

**One country, one page per question.** ANGKA NUSANTARA is an explorer
for Indonesia built from published BPS figures: Overview (six headline
indicators with sparklines), Population, Economy, Jobs, Prices, Trade,
Regions, Health & Education, a Compare-Years tool, and About the Data.
Every page is reached by a link; every figure carries its source and
reference year on the page; approximate values are marked "~".

## Run it

```sh
node serve.ts   # http://localhost:8080
```

Static files only — no build step, no network, no tracking. Charts are
drawn by the site's own canvas code from the figures in `app/data.js`.

## Hand it in

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library. See
[METHOD.md](METHOD.md) for the concept, the figures, and the verification.
