import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  isSoundActive: WritableSignal<boolean> = signal<boolean>(true);
  isTextActive: WritableSignal<boolean> = signal<boolean>(true);

  constructor() {
    const sound = localStorage.getItem('sound');
    const text = localStorage.getItem('text');
    if (!sound || sound === 'true') this.isSoundActive.set(true);
    if (!text || text === 'true') this.isTextActive.set(true);
  }

  toggleSound() {
    this.isSoundActive.set(!this.isSoundActive());
    localStorage.setItem('sound', this.isSoundActive() ? 'true' : 'false');
  }

  toggleText() {
    this.isTextActive.set(!this.isTextActive());
    localStorage.setItem('text', this.isTextActive() ? 'true' : 'false');
  }
}
