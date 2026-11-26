import { Component } from '@angular/core';
import { IMAGE_CREDITS } from './image-credits.data';

@Component({
  selector: 'app-credits-page', standalone: true,
  template: `<main class="credits"><p class="eyebrow">Photo sources</p><h1>Image credits</h1><p>Hotel names are fictional. Photographs are illustrative and do not depict StayWise properties.</p><div class="credit-list">@for (credit of credits; track credit.file) { <article><strong>{{ credit.file }}</strong><span>{{ credit.subject }}</span><span>{{ credit.artist }}</span><a [href]="credit.url" target="_blank" rel="noreferrer">Source page</a><small>{{ credit.license }}</small></article> }</div></main>`,
  styles: `:host{display:block}.credits{width:min(100% - 3rem,75rem);min-height:60vh;margin:3rem auto 5rem}.eyebrow{color:#8a6a29;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.credits h1{font:600 clamp(2rem,4vw,3rem) 'Playfair Display',Georgia,serif;color:#17243d}.credit-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem}.credit-list article{display:grid;gap:.35rem;padding:1rem;border:1px solid #ddd9d0;border-radius:.6rem;background:white}.credit-list a{color:#17243d}@media(max-width:700px){.credit-list{grid-template-columns:1fr}}`,
})
export class CreditsPage { readonly credits = IMAGE_CREDITS; }
