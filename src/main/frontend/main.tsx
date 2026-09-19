import React from 'react';
import { createRoot } from 'react-dom/client';

// Minimal base shell. The opinionated conventions (file/manifest routing under router/, closed
// primitives under ui/, no global store, scoped styles) are how checkpoints add features additively
// (CLAUDE.md). Every observable element/value carries a stable data-test-id, never renamed/removed.
function App() {
  return (
    <div data-test-id="app-root">
      <nav data-test-id="app-nav">OfficeHQ</nav>
      <main data-test-id="app-home" />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
