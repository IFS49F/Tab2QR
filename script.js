import qr from 'qr-image';
import './style.css';

chrome.tabs.query(
  {
    active: true,
    currentWindow: true
  },
  ([tab]) => {
    if (!tab || !tab.url) return false;

    const image = qr.imageSync(tab.url, {
      type: 'svg',
      margin: 0
    });
    const blob = new Blob([image], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);

    const container = document.createElement('img');
    container.alt = tab.url;
    container.src = url;
    document.body.appendChild(container);
  }
);
