import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { Dialogue } from '../models/dialogue.model';
import { ControlsService } from './controls.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private readonly controlsService: ControlsService = inject(ControlsService);

  dialogues: WritableSignal<Dialogue[]> = signal([]);
  currentDialogueIndex: WritableSignal<number> = signal(-1);
  isDialogOpen: WritableSignal<boolean> = signal(false);
  currentDialogueText: WritableSignal<string> = signal('');
  private readonly typingSpeed: number = 40;
  private readonly typingSound: HTMLAudioElement;
  private typingInterval: any;
  private dialogEnd: Subject<void> = new Subject();
  dialogEnd$ = this.dialogEnd.asObservable();

  constructor() {
    this.typingSound = new Audio('/sounds/typing-sound-3.wav');
  }

  startDialogue(dialogues: Dialogue[]) {
    if (!this.controlsService.isTextActive()) return;
    this.dialogues.set(dialogues);
    this.currentDialogueIndex.set(0);
    this.isDialogOpen.set(true);
    this.typeDialogue();
  }

  typeDialogue() {
    const currentIndex = this.currentDialogueIndex();
    const dialogues = this.dialogues();
    const fullText = dialogues[currentIndex].text;

    let currentText = '';
    let charIndex = 0;

    clearInterval(this.typingInterval);
    this.typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        currentText += fullText[charIndex];
        this.currentDialogueText.set(currentText);

        if (charIndex % 2 == 0 && fullText[charIndex] !== ' ') {
          this.playTypingSound()
        };

        charIndex++;
      } else {
        clearInterval(this.typingInterval);
      }
    }, this.typingSpeed);
  }

  playTypingSound() {
    if (!this.controlsService.isSoundActive()) return;
    this.typingSound.volume = 0.01;
    this.typingSound.pause();
    this.typingSound.currentTime = 0;
    this.typingSound.play().catch((error) => {
      console.error('Error al reproducir el sonido:', error);
    });
  }

  nextDialogue() {
    clearInterval(this.typingInterval);
    const currentIndex = this.currentDialogueIndex();
    const dialogues = this.dialogues();
    if (currentIndex + 1 < dialogues.length) {
      this.currentDialogueIndex.set(currentIndex + 1);
      this.typeDialogue();
    } else {
      this.endDialogue();
    }
  }

  endDialogue() {
    clearInterval(this.typingInterval);
    this.isDialogOpen.set(false);
    this.currentDialogueIndex.set(-1);
    this.dialogEnd.next();
  }

  getCurrentDialogueText(): string {
    return this.currentDialogueText();
  }

  getCurrentDialogue(): Dialogue {
    const currentIndex = this.currentDialogueIndex();
    const dialogues = this.dialogues();
    return dialogues[currentIndex] || '';
  }
}
