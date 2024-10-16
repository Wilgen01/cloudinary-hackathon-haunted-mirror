import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CuadroDialogoComponent } from './components/cuadro-dialogo/cuadro-dialogo.component';
import { ConversationService } from '../shared/services/conversation.service';
import { Dialogue } from '../shared/models/dialogue.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule, CuadroDialogoComponent],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent implements OnInit {
  private readonly dialogueService: ConversationService = inject(ConversationService);

  currentDialogue: Signal<Dialogue>;
  currentDialogueText: Signal<string>;
  isVisible: Signal<boolean>;

  constructor() {
    this.currentDialogue = computed(() => this.dialogueService.getCurrentDialogue());
    this.isVisible = computed(() => this.dialogueService.isCharacterVisible());
    this.currentDialogueText = computed(() => this.dialogueService.getCurrentDialogueText());
  }

  ngOnInit(): void {
    const dialogues: Dialogue[] = [
      {
        text: 'Este espejo es un espejo de una pequeña casa de la que vive un hombre llamado John Doe. Su nombre es John Doe y su apellido es Doe.',
        isCharacterVisible: true,
        isEnd: false
      },
      {
        text: 'El espejo está rodeado por una pared de madera y una ventana de madera.',
        isCharacterVisible: false,
        isEnd: false
      },
      {
        text: 'La ventana está abierta y el espejo está rodeado por una pared de madera.',
        isCharacterVisible: true,
        isEnd: false
      }
    ]
    this.dialogueService.startDialogue(dialogues);
  }

  onNextDialogue() {
    this.dialogueService.nextDialogue();
  }
}
