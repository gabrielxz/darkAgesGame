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
const click = async (x,y,w=350)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
// Play Modern: primary button at innerX=60,y=322+122=444,w324,h54 -> center (222,471)
await click(222,471); await page.waitForTimeout(400);
// Briefing Begin (STAGE_W/2-110..+110, y STAGE_H-92 -> center ~640,656)
await click(640,656); await page.waitForTimeout(700);
await page.screenshot({ path:"/tmp/r-game.png" });
console.log("in game:", await page.evaluate(()=> window.__state ? window.__state.selected.name+" res="+window.__state.resources : "no"));
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
