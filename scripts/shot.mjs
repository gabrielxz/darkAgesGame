import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:5173/";
const steps = (process.argv[3] || "menu").split(",");

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

async function shot(name) {
  await page.screenshot({ path: `/tmp/shot-${name}.png` });
  console.log(`shot: /tmp/shot-${name}.png`);
}

// Click a label inside the pixi canvas by stage coordinates.
async function clickStage(x, y) {
  const box = await page.locator("canvas").boundingBox();
  const sx = box.width / 1280;
  const sy = box.height / 720;
  await page.mouse.click(box.x + x * sx, box.y + y * sy);
  await page.waitForTimeout(250);
}

for (const step of steps) {
  if (step === "menu") await shot("menu");
  else if (step === "classic") {
    await clickStage(470, 496); // "Play Classic" button (left card)
    await page.waitForTimeout(800);
    await shot("classic");
  } else if (step === "modern") {
    await clickStage(810, 496); // "Play Modern" button (right card)
    await page.waitForTimeout(800);
    await shot("modern");
  } else if (step.startsWith("click:")) {
    const [, xy] = step.split(":");
    const [x, y] = xy.split("x").map(Number);
    await clickStage(x, y);
    await shot("after-click");
  }
}

console.log("ERRORS:", errors.length ? JSON.stringify(errors.slice(0, 20), null, 2) : "none");
await browser.close();
