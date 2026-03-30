import fs from 'node:fs';

const txt = fs.readFileSync(new URL('../data/northvietnam/hotels.ts', import.meta.url), 'utf8');
const linkRe = /href: '(https:\/\/maps\.app\.goo\.gl\/[^']+)'/g;
const links = [...txt.matchAll(linkRe)].map((m) => m[1]);

async function main() {
  const out = [];
  for (const url of links) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const final = res.url;
      const m = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/.exec(final);
      out.push({ url, final, lat: m ? Number(m[1]) : null, lng: m ? Number(m[2]) : null });
    } catch (e) {
      out.push({ url, error: String(e) });
    }
  }
  console.log(JSON.stringify(out, null, 2));
}

await main();

