import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { ControlsService } from '../../services/controls.service';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {
  private readonly controlsService: ControlsService = inject(ControlsService);
  
  isSoundActive: Signal<boolean>;
  isTextActive: Signal<boolean>;
  isGameCompleted: boolean = localStorage.getItem('gameCompleted') === 'true';

  constructor(){
    this.isSoundActive = computed(() => this.controlsService.isSoundActive());
    this.isTextActive = computed(() => this.controlsService.isTextActive());
  }

  toggleSound(){
    this.controlsService.toggleSound();
  }

  toggleText(){
    this.controlsService.toggleText();
  }

}
