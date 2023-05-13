import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';

function setRootFontSize() {
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );
  if (vw <= 412) {
    document.documentElement.style.fontSize = '10px';
  } else {
    document.documentElement.style.fontSize = '10.5px';
  }
}

setRootFontSize();

window.addEventListener('resize', setRootFontSize);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
);
