import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CuadroDialogoComponent } from './components/cuadro-dialogo/cuadro-dialogo.component';
import { ConversationService } from '../shared/services/conversation.service';
import { Dialogue } from '../shared/models/dialogue.model';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../shared/pipes/sanitize.pipe';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule, CuadroDialogoComponent, SafeHtmlPipe],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {
  private readonly dialogueService: ConversationService = inject(ConversationService);

  currentDialogue: Signal<Dialogue>;
  currentDialogueText: Signal<string>;
  isDialogOpen: Signal<boolean>;

  constructor() {
    this.currentDialogue = computed(() => this.dialogueService.getCurrentDialogue());
    this.isDialogOpen = computed(() => this.dialogueService.isDialogOpen());
    this.currentDialogueText = computed(() => this.dialogueService.getCurrentDialogueText());
  }

  onNextDialogue() {
    this.dialogueService.nextDialogue();
  }
}
