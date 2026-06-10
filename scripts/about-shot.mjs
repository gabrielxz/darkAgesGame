import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors=[]; page.on("pageerror",e=>errors.push(e.message));
await page.goto("http://localhost:5173/", { waitUntil:"networkidle" });
await page.waitForTimeout(1200);
const box = await page.locator("canvas").boundingBox();
const sx=box.width/1280, sy=box.height/720;
const click=async(x,y,w=350)=>{ await page.mouse.click(box.x+x*sx,box.y+y*sy); await page.waitForTimeout(w); };
await click(276,567); // About (secondary row)
await page.waitForTimeout(300);
await page.screenshot({ path:"/tmp/about-fixed.png" });
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,5)):"none");
await browser.close();
