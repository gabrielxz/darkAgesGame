import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on("pageerror", e => errors.push("PAGEERROR: "+e.message));
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1100);
const box = await page.locator("canvas").boundingBox();
const sx = box.width/1280, sy = box.height/720;
const click = async (x,y,w=90)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
await click(222,471,400); await click(640,656,700); // modern -> begin
for (let i=0;i<25;i++) await click(1146,211,80); // end turn x25 (do nothing -> F)
await page.waitForTimeout(1200);
await page.screenshot({ path:"/tmp/v2-end.png" });
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,6)):"none");
await browser.close();
