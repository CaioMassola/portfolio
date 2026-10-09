import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './styles.scss';

const navigation = performance.getEntriesByType('navigation')[0] as
  PerformanceNavigationTiming | undefined;

// Reload always replays the opening from the top, regardless of the active section.
if (navigation?.type === 'reload') {
  window.history.scrollRestoration = 'manual';
  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname + window.location.search,
  );
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
