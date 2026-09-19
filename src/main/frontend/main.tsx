import React from 'react';
import { createRoot } from 'react-dom/client';

// Minimal base shell. The opinionated conventions (file/manifest routing under router/, closed
// primitives under ui/, no global store, scoped styles) are how checkpoints add features additively
// (CLAUDE.md). Every observable element/value carries a stable data-testid, never renamed/removed.
function App() {
  return (
    <div data-testid="app-root">
      <nav data-testid="app-nav">OfficeHQ</nav>
      <main data-testid="app-home" />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
