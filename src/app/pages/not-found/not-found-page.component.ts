import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <p>404</p>
      <h1>That page has drifted out of the workshop.</h1>
      <a routerLink="/">Back to Dp Clean Technical Services</a>
    </section>
  `,
  styles: [
    `
      .not-found {
        min-height: 100vh;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 2rem;
      }

      p {
        margin: 0;
        font-size: 1rem;
        letter-spacing: 0.3em;
        color: #8b5e3c;
      }

      h1 {
        margin: 1rem 0 1.5rem;
        max-width: 18ch;
        font-size: clamp(2rem, 6vw, 4rem);
      }

      a {
        display: inline-flex;
        padding: 0.9rem 1.4rem;
        border-radius: 999px;
        background: #6f4e37;
        color: white;
        text-decoration: none;
      }
    `
  ]
})
export class NotFoundPageComponent {}
