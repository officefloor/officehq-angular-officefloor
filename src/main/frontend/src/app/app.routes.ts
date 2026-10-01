import { Routes } from '@angular/router';

// SHARED SURFACE (config.yaml -> app.shared_surfaces.frontend): the route table.
//
// A page is a new component file, registered here with ONE entry that lazily imports it. Give the
// entry `data: { section, label }` and it appears in the nav bar automatically — the shell reads
// the router's own config, so a page is never a second edit to a nav component.
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    data: { section: 'home', label: 'Home', order: 0 },
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
];
