import { toDataURL, toString } from "qrcode";
import browser from "webextension-polyfill";
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
    currentWindow: true,
  });
  return tab?.url;
}

async function genQrBlob(url: string, type: "svg" | "png") {
  switch (type) {
    case "svg": {
      const svg = await toString(url, {
        type: "svg",
        margin: 0,
      });
      return new Blob([svg], {
        type: "image/svg+xml;charset=utf-8",
      });
    }
    case "png": {
      const png = await toDataURL(url, {
        type: "image/png",
        width: 512,
      });
      return new Blob([dataURLToArrayBuffer(png)], {
        type: "image/png",
      });
    }
  }
}

async function renderQr(url: string) {
  elemImg.alt = `QR code of text: ${url}`;
  elemImg.src = URL.createObjectURL(await genQrBlob(url, "svg"));
}

async function copyQr(url: string) {
  // TODO: cleanup after Firefox finally implements
  // asynchronous Clipboard API properly:
  // https://caniuse.com/async-clipboard
  if ("write" in navigator.clipboard) {
    const blob = await genQrBlob(url, "png");
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  } else if (
    await browser.permissions.request({ permissions: ["clipboardWrite"] })
  ) {
    const png = await toDataURL(url, {
      type: "image/png",
      width: 512,
    });
    const data = dataURLToArrayBuffer(png);
    await browser.clipboard.setImageData(data, "png");
  }
}

async function downloadQr(url: string, type: "svg" | "png") {
  if (await browser.permissions.request({ permissions: ["downloads"] })) {
    await browser.downloads.download({
      url: URL.createObjectURL(await genQrBlob(url, type)),
      filename: `Tab2QR-${Date.now()}.${type}`,
    });
  }
}

function dataURLToArrayBuffer(url: string) {
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
})();
