import { Component } from '@angular/core';

// The base home page: nothing here until a feature adds itself. A page is a new component like
// this one, plus one entry in app.routes.ts.
@Component({
  selector: 'app-home',
  template: `<p data-testid="home-empty">Nothing here yet.</p>`,
})
export class Home {}
