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
const click = async (x,y,w=250)=>{ await page.mouse.click(box.x+x*sx, box.y+y*sy); await page.waitForTimeout(w); };
await click(470,496); // Play Classic
await page.waitForTimeout(600);
// Select Constantinople (infected city) ~ (58,126)+(40,20)
await click(95,145);
// Orbital strike it (bottom button, last) ~ y for orbitalStrike: top=262+96=358, i=6 => 358+6*48=646; x center ~1145
await click(1145,665);
await page.screenshot({ path: "/tmp/shot-after-strike.png" });
// End turn x6 (button center ~1146,211)
for (let i=0;i<6;i++) await click(1146,211,350);
await page.screenshot({ path: "/tmp/shot-turn7.png" });
console.log("ERRORS:", errors.length?JSON.stringify(errors.slice(0,10)):"none");
await browser.close();
