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
await page.screenshot({ path:"/tmp/r-menu.png" });
// About (secondary row: innerX=60, rowY=322+224=546; About at innerX+166=226, w100 -> center ~276,567)
await click(276,567); await page.waitForTimeout(300); await page.screenshot({ path:"/tmp/r-about.png" });
await click(640,690); // Back (STAGE_H-70+25=675 ~ center) approx
await page.waitForTimeout(300);
// Sound test: ♪ at innerX+innerW-42 .. innerW=324 so x=60+324-42=342, +21=363, rowY center 567
await click(363,567); await page.waitForTimeout(300); await page.screenshot({ path:"/tmp/r-soundtest.png" });
await click(560,690); // Back (STAGE_W/2+20=660? back at +20..+180 center 740) hmm
await page.waitForTimeout(300);
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
