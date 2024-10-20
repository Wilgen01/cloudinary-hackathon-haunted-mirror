import { Component, inject, OnInit } from '@angular/core';
import { MirrorComponent } from './components/mirror/mirror.component';
import { PuzleComponent } from './components/puzle/puzle.component';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen/index';
import { cloudinaryConf } from '../shared/helpers/cloudinary-conf';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, retry, take } from 'rxjs';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { generativeBackgroundReplace, generativeReplace, grayscale, upscale } from '@cloudinary/url-gen/actions/effect';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { CommonModule } from '@angular/common';
import { TimerComponent } from '../shared/components/timer/timer.component';
import { ConversationService } from '../shared/services/conversation.service';
import { gameDialog1, gameDialog2 } from '../shared/dialogs/game.dialog';
import { Dialogue } from '../shared/models/dialogue.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

enum STATE {
  WIN = 'WIN',
  LOSE = 'LOSE',
  FIRST_STEP = 'FIRST_STEP',
  SECOND_STEP = 'SECOND_STEP',
  THIRD_STEP = 'THIRD_STEP'
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MirrorComponent, PuzleComponent, TimerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly cloudinaryService: CloudinaryService = inject(CloudinaryService);
  private readonly conversationService: ConversationService = inject(ConversationService);

  cld: Cloudinary = cloudinaryConf;
  img: CloudinaryImage;
  imgBase: CloudinaryImage;
  backgroundImg: CloudinaryImage;
  imageId: string = 'haunted_mirror/ufs6rea5v2kqo28eckio';
  showPuzzle: boolean = false;
  showTimer: boolean = false;
  time: number = 15000;
  gameState = STATE.FIRST_STEP;
  puzleCompleted: boolean = false;

  constructor() {
    this.conversationService.dialogEnd$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.onDialogEnd();
    })
  }

  ngOnInit(): void {
    this.setGameState();
    // this.obtenerImageId();
    // this.generarImagenes();
    // this.warmImages();
  }

  setGameState() {
    const state = (localStorage.getItem('gameState') ?? STATE.FIRST_STEP) as keyof typeof STATE;
    this.gameState = STATE[state];
    if (this.gameState === STATE.FIRST_STEP) {
      this.gameState = STATE.SECOND_STEP;
      localStorage.setItem('gameState', this.gameState);
      this.iniciarConversacion(gameDialog1);
    } else {
      this.showTimer = true;
    }
  }

  onDialogEnd() {
    switch (this.gameState) {
      case STATE.FIRST_STEP:
        this.showTimer = true;
        break;
      case STATE.SECOND_STEP:
        this.gameState = STATE.THIRD_STEP;
        localStorage.setItem('gameState', this.gameState);
        this.time = 60000;
        this.showTimer = true;
        break;
    }
  }

  iniciarConversacion(dialog: Dialogue[] = []) {
    this.conversationService.startDialogue(dialog);
  }

  obtenerImageId() {
    this.activatedRoute.params.pipe(take(1)).subscribe({
      next: (params) => this.imageId = `${params['folder'] + '/' + params['file']}`
    });
  }

  generarImagenes() {
    this.imgBase = this.cld.image(this.imageId);
    this.img = this.generarImagenBase();
    this.backgroundImg = this.generarImagenBase().effect(grayscale());
  }

  generarImagenBase() {
    const img = this.cld.image(this.imageId);
    img.resize(
      auto()
        .width(480)
        .height(480)
        .gravity(focusOn(face()))
    )
      .effect(upscale())
      .effect(generativeReplace().from('face').to('scary demon face with horns on the head sharp teeth and red eyes from which blood flows'))
      .effect(generativeBackgroundReplace().prompt('terrifying background infested with demons seeking to trap a soul'));

    return img;
  }

  warmImages() {
    const respuestaImagen = this.cloudinaryService.warmImage(this.img.toURL());
    const respuestaBgImagen = this.cloudinaryService.warmImage(this.backgroundImg.toURL());


    forkJoin({ respuestaImagen, respuestaBgImagen }).pipe(
      retry({ count: 10, delay: 5000 })
    ).subscribe({
      next: (res => {
        this.showPuzzle = true
        console.log('next', res);
      }),
      error: (err => {
        console.log('error', err);
      })
    })
  }

  onTimerEnd() {
    this.showTimer = false;
    switch (this.gameState) {
      case STATE.FIRST_STEP:
        this.iniciarConversacion(gameDialog1);
        break;
      case STATE.SECOND_STEP:
        this.iniciarConversacion(gameDialog2);
        break;
      case STATE.THIRD_STEP:
        alert('lose')
        this.router.navigate([`/game/${this.imageId}/result`]);
        break;
    }
  }

  onPuzzleCompleted() {
    this.showTimer = false;
    this.puzleCompleted = true;
    this.gameState = STATE.WIN;
    localStorage.setItem('gameState', this.gameState);
    alert('win')
    this.router.navigate([`/game/${this.imageId}/result`]);
  }

}
