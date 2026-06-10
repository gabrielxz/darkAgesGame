import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
const errors = [];
page.on("pageerror", e => errors.push("PAGEERROR: "+e.message));
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const box = await page.locator("canvas").boundingBox();
const sx = box.width/1280, sy = box.height/720;
const click = async (x,y,w=350)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
await click(222,471); await page.waitForTimeout(400); await click(640,656); await page.waitForTimeout(700);
const S = (x,y,w,h,name)=>page.screenshot({ path:`/tmp/z-${name}.png`, clip:{ x:box.x+x*sx, y:box.y+y*sy, width:w*sx, height:h*sy } });
await S(1020, 358, 244, 330, "actions");  // action panel buttons
await S(40, 100, 480, 320, "cities");      // a cluster of city nodes
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,6)):"none");
await browser.close();
