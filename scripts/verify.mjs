import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on("pageerror", e => errors.push("PAGEERROR: "+e.message));
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const box = await page.locator("canvas").boundingBox();
const sx = box.width/1280, sy = box.height/720;
const click = async (x,y,w=200)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
const snap = () => page.evaluate(() => {
  const s = window.__state; if (!s) return null;
  return { turn: s.rule.gameTurns - s.remainingTurns, selected: s.selected.name,
    selLiving: s.selected.living, selInfected: s.selected.infected,
    resources: s.resources, dead: s.deathToll(), remaining: s.remaining, over: s.gameOver };
});
await click(470,496); await page.waitForTimeout(400);
console.log("start:", JSON.stringify(await snap()));
await click(95,145); // select Constantinople
console.log("selected Constantinople:", JSON.stringify(await snap()));
await click(1145,667); // orbital strike
console.log("after strike:", JSON.stringify(await snap()));
for (let i=0;i<3;i++) await click(1146,211,300);
console.log("after 3 ends:", JSON.stringify(await snap()));
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
