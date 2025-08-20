import { Component } from '@angular/core';
import { RouterOutlet } from '../../node_modules/@angular/router/router_module.d-Bx9ArA6K';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
      }
    `,
  ],
  imports: [RouterOutlet],
})
export class AppComponent {
  title = 'Educational Management System';
}
