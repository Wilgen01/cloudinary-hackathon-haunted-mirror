import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  isSoundActive: WritableSignal<boolean> = signal<boolean>(false);
  isTextActive: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    const sound = localStorage.getItem('sound');
    const text = localStorage.getItem('text');
    console.log(sound, text);
    
    if (sound == null || sound === 'true') this.isSoundActive.set(true);
    if (text == null || text === 'true') this.isTextActive.set(true);
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
