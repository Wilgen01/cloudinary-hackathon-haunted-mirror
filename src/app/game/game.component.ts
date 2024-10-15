import { Component } from '@angular/core';
import { MirrorComponent } from './components/mirror/mirror.component';
import { PuzleComponent } from './components/puzle/puzle.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MirrorComponent, PuzleComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

}
