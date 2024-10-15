import { Component } from '@angular/core';
import { CuadroDialogoComponent } from './components/cuadro-dialogo/cuadro-dialogo.component';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CuadroDialogoComponent],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {

}
