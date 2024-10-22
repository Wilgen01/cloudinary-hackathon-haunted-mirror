import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CloudinaryModule } from '@cloudinary/ng';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CharacterComponent } from './character/character.component';
import { ControlsComponent } from './shared/components/controls/controls.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CloudinaryModule, CharacterComponent, ControlsComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppComponent implements OnInit {
  ngOnInit() {
    initFlowbite();
  }
}