import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on("pageerror", e => errors.push("PAGEERROR: "+e.message));
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const box = await page.locator("canvas").boundingBox();
const sx = box.width/1280, sy = box.height/720;
const click = async (x,y,w=120)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
await click(810,496); await page.waitForTimeout(400); // Play Modern
// Smart play via direct state calls each turn, then end turn through UI.
for (let t=0;t<25;t++){
  await page.evaluate(()=>{ const s=window.__state; if(!s) return;
    for (const c of s.cities){ if(c.infected>30 && !c.quarantine){ s.select(c); s.apply("quarantine"); } } });
  await click(1146,211,90); // end turn
}
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/shot-end.png" });
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
