import { Component, Input } from '@angular/core';

@Component({
  selector: 'sw-image', standalone: true,
  template: `
    <picture class="picture" [style.--image-focus]="focus">
      <source type="image/webp" [srcset]="webpSet" [sizes]="sizes" />
      <img [src]="jpegUrl" [srcset]="jpegSet" [sizes]="sizes" [alt]="alt" [attr.width]="width"
        [attr.height]="height" [attr.loading]="eager ? 'eager' : 'lazy'" [attr.fetchpriority]="eager ? 'high' : 'auto'"
        decoding="async" (error)="failed = true" [class.failed]="failed" />
      @if (failed) { <span class="fallback" aria-hidden="true"><span>SW</span></span> }
    </picture>
  `,
  styles: `:host{display:block;position:relative;overflow:hidden;background:#e9e6df}.picture{position:absolute;inset:0;display:block}.picture img{display:block;width:100%;height:100%;object-fit:cover;object-position:var(--image-focus,center);background:#e9e6df}.picture img.failed{visibility:hidden}.fallback{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(145deg,#e9e6df,#f5f3ed);color:#667083}.fallback span{display:grid;place-items:center;width:2.5rem;height:2.5rem;border:1px solid #bdad85;border-radius:50%;font:600 1rem Georgia,serif}`,
})
export class SwImageComponent {
  @Input({ required: true }) src = '';
  @Input() alt = '';
  @Input() focus = 'center';
  @Input() width: number | string = 1280;
  @Input() height: number | string = 800;
  @Input() sizes = '100vw';
  @Input() eager = false;
  failed = false;

  get webpSet(): string { return this.srcset('webp'); }
  get jpegSet(): string { return this.srcset('jpg'); }
  get jpegUrl(): string { return this.src.replace(/\.jpg(?:\?.*)?$/, /hero\.jpg/.test(this.src) ? '-1920.jpg' : '-1280.jpg'); }
  private srcset(format: string): string {
    const base = this.src.replace(/\.jpg(?:\?.*)?$/, '');
    const widths = /hero\.jpg/.test(this.src) ? [1920, 1280, 768] : /-([23])\.jpg/.test(this.src) ? [1280, 800] : [1280, 800, 480];
    return widths.map((width) => `${base}-${width}.${format} ${width}w`).join(', ');
  }
}
