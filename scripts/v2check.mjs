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
// Help overlay from menu
await click(139,567); await page.waitForTimeout(300); await page.screenshot({ path:"/tmp/v2-help.png" }); // How to Play
await click(640,672); await page.waitForTimeout(200); // Got it
// Play Modern -> briefing
await click(222,471); await page.waitForTimeout(400); await page.screenshot({ path:"/tmp/v2-briefing.png" });
await click(640,656); await page.waitForTimeout(700); // Begin
// Research wrapping
await page.evaluate(()=>{ window.__state.resources = 2_000_000; });
await click(1141,151); await page.waitForTimeout(300); await page.screenshot({ path:"/tmp/v2-research.png" });
await click(640,672); await page.waitForTimeout(200); // close research
// Menu confirm dialog
await click(45,28); await page.waitForTimeout(300); await page.screenshot({ path:"/tmp/v2-confirm.png" });
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
