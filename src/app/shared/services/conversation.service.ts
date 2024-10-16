import { Injectable, signal, WritableSignal } from '@angular/core';
import { Dialogue } from '../models/dialogue.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  dialogues: WritableSignal<Dialogue[]> = signal([]);
  currentDialogueIndex: WritableSignal<number> = signal(-1);
  isCharacterVisible: WritableSignal<boolean> = signal(false);
  currentDialogueText: WritableSignal<string> = signal('');
  private readonly typingSpeed: number = 40;
  private readonly typingSound: HTMLAudioElement;
  private typingInterval: any;

  constructor() {
    this.typingSound = new Audio('/sounds/typing-sound-3.wav');
  }

  startDialogue(dialogues: Dialogue[]) {
    this.dialogues.set(dialogues);
    this.currentDialogueIndex.set(0);
    this.isCharacterVisible.set(true);
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

        if(charIndex % 2 == 0 && fullText[charIndex] !== ' '){
          this.playTypingSound()
        };

        charIndex++;
      } else {
        clearInterval(this.typingInterval);
      }
    }, this.typingSpeed);
  }

  playTypingSound() {
    this.typingSound.volume = 0.007;
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
    this.isCharacterVisible.set(false);
    this.currentDialogueIndex.set(-1);
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
