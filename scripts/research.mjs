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
const click = async (x,y,w=200)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
await click(810,496); await page.waitForTimeout(400); // Play Modern
// Give resources so techs are affordable, then open research.
await page.evaluate(()=>{ window.__state.resources = 2_000_000; });
await click(1141,151); // Research button (TOP_PANEL.x+14 + rw/2 ~ 1024+14+108=1146; y 16+120+15=151)
await page.screenshot({ path: "/tmp/shot-research.png" });
const before = await page.evaluate(()=>({ rec: window.__state.rule.recoveryRate, owned:[...window.__state.unlockedTech] }));
// Click the first medicine card (top-left column, tier1). Column startX, card y=170.
// startX = (1280 - (3*360+2*20))/2 = (1280-1120)/2 = 80. card center x=80+180=260, y=170+75=245
await click(260,245);
const after = await page.evaluate(()=>({ rec: window.__state.rule.recoveryRate, res: window.__state.resources, owned:[...window.__state.unlockedTech] }));
await page.screenshot({ path: "/tmp/shot-research2.png" });
console.log("before:", JSON.stringify(before));
console.log("after:", JSON.stringify(after));
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
