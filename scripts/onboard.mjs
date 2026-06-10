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
const click = async (x,y,w=300)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
const move = async (x,y,w=250)=>{ await page.mouse.move(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
// Menu help
await click(640,603); await page.screenshot({ path:"/tmp/ob-help.png" }); // How to Play
await click(640,672); // Got it (close) ~ STAGE_H-62+25=683 -> ~672
// Play Modern -> briefing
await click(810,496); await page.waitForTimeout(500);
await page.screenshot({ path:"/tmp/ob-briefing.png" });
// Begin
await click(640,628); await page.waitForTimeout(700); // Begin button STAGE_H-92+28=656 -> approx 628
await page.screenshot({ path:"/tmp/ob-game.png" });
// Hover over an action button to show tooltip (Quarantine ~ index1: y=358+1*48=406, x ~1145)
await move(1145,406);
await page.screenshot({ path:"/tmp/ob-tooltip.png" });
console.log("scene check:", await page.evaluate(()=> window.__state ? "in-game state="+window.__state.selected.name : "no game state"));
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,8)):"none");
await browser.close();
