import { toDataURL, toString } from "qrcode";
import "./style.css";

const elemImg = document.querySelector("img") as HTMLImageElement;
const elemInput = document.querySelector("input") as HTMLInputElement;
const elemCopyPNG = document.querySelector(
  "button.copy.png"
) as HTMLButtonElement;
const elemDownloadPNG = document.querySelector(
  "button.download.png"
) as HTMLButtonElement;
const elemDownloadSVG = document.querySelector(
  "button.download.svg"
) as HTMLButtonElement;

async function getCurrTabUrl() {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab?.url;
}

async function genQrUrl(url: string, type: "svg" | "png") {
  switch (type) {
    case "svg":
      const svg = await toString(url, {
        type: "svg",
        margin: 0
      });
      const svgBlob = new Blob([svg], {
        type: "image/svg+xml;charset=utf-8"
      });
      return URL.createObjectURL(svgBlob);
    case "png":
      const png = await toDataURL(url, {
        type: "image/png",
        width: 512
      });
      const pngBlob = new Blob([dataURLToArrayBuffer(png)], {
        type: "image/png"
      });
      return URL.createObjectURL(pngBlob);
  }
}

async function renderQr(url: string) {
  elemImg.alt = url;
  elemImg.src = await genQrUrl(url, "svg");
}

async function copyQr(url: string) {
  const png = await toDataURL(url, {
    type: "image/png",
    width: 512
  });
  const data = dataURLToArrayBuffer(png);
  browser.clipboard.setImageData(data, "png");
}

async function downloadQr(url: string, type: "svg" | "png") {
  browser.downloads.download({
    url: await genQrUrl(url, type),
    filename: `Tab2QR-${Date.now()}.${type}`
  });
}

function dataURLToArrayBuffer(url: string): ArrayBuffer {
  const base64 = url.substring(url.indexOf(",") + 1);
  const binStr = atob(base64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes.buffer;
}

elemInput.addEventListener("focus", () => elemInput.select(), false);
elemInput.addEventListener("keyup", () => renderQr(elemInput.value), false);
elemCopyPNG.addEventListener("click", () => copyQr(elemInput.value));
elemDownloadPNG.addEventListener("click", () =>
  downloadQr(elemInput.value, "png")
);
elemDownloadSVG.addEventListener("click", () =>
  downloadQr(elemInput.value, "svg")
);

(async () => {
  const url = await getCurrTabUrl();

  if (url) {
    renderQr(url);
    elemInput.value = url;
  }

  if ("clipboard" in browser) {
    elemCopyPNG.classList.remove("hidden");
  }
})();
