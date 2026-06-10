import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const box = await page.locator("canvas").boundingBox();
const sx = box.width/1280, sy = box.height/720;
const click = async (x,y,w=350)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
await click(222,471); await page.waitForTimeout(400); await click(640,656); await page.waitForTimeout(700); // modern game
await page.evaluate(()=>{ window.__state.resources = 2_000_000; });
await click(1141,151); // Research
await page.waitForTimeout(300);
// crop the left (Medicine) column
await page.screenshot({ path:"/tmp/research-col.png", clip:{ x:box.x+70*sx, y:box.y+150*sy, width:400*sx, height:520*sy } });
await browser.close();
