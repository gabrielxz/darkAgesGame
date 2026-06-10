import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on("pageerror", e => errors.push("PAGEERROR: "+e.message));
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
const reqfail = [];
page.on("requestfailed", r => reqfail.push(r.url()+" "+r.failure()?.errorText));
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const box = await page.locator("canvas").boundingBox();
const sx = box.width/1280, sy = box.height/720;
const click = async (x,y,w=250)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
await click(810,496); await page.waitForTimeout(400); // Play Modern -> briefing
await click(640,628); await page.waitForTimeout(700); // Begin -> game
const inGame = await page.evaluate(()=> typeof window.__state !== "undefined" ? "no(devhook present!)" : "prod(no devhook)");
await page.screenshot({ path:"/tmp/prod-game.png" });
console.log("prod hook check (should be prod):", inGame);
console.log("requestfailed:", reqfail.length?JSON.stringify(reqfail.slice(0,5)):"none");
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
