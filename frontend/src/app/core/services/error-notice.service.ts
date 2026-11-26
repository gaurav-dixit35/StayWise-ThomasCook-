import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorNoticeService {
  readonly message = signal<string | null>(null);

  show(message: string): void {
    this.message.set(message);
  }

  dismiss(): void {
    this.message.set(null);
  }
}
