import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { generativeBackgroundReplace, generativeReplace, grayscale, upscale } from '@cloudinary/url-gen/actions/effect';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen/index';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, retry, take } from 'rxjs';
import { TimerComponent } from '../shared/components/timer/timer.component';
import { gameDialog1, gameDialog2 } from '../shared/dialogs/game.dialog';
import { cloudinaryConf } from '../shared/helpers/cloudinary-conf';
import { toastConf } from '../shared/helpers/toast-conf';
import { Dialogue } from '../shared/models/dialogue.model';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { ControlsService } from '../shared/services/controls.service';
import { ConversationService } from '../shared/services/conversation.service';
import { MirrorComponent } from './components/mirror/mirror.component';
import { PuzleComponent } from './components/puzle/puzle.component';

enum STATE {
  WIN = 'WIN',
  LOSE = 'LOSE',
  FIRST_STEP = 'FIRST_STEP',
  SECOND_STEP = 'SECOND_STEP',
  THIRD_STEP = 'THIRD_STEP',
  FOURTH_STEP = 'FOURTH_STEP'
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
  private readonly controlsService: ControlsService = inject(ControlsService);
  private readonly spinner: NgxSpinnerService = inject(NgxSpinnerService);
  private readonly toast: HotToastService = inject(HotToastService);

  cld: Cloudinary = cloudinaryConf;
  img: CloudinaryImage;
  imgBase: CloudinaryImage;
  backgroundImg: CloudinaryImage;
  imageId: string = 'haunted_mirror/ufs6rea5v2kqo28eckio';
  showPuzzle: boolean = false;
  showTimer: boolean = false;
  time: number = 6660;
  gameState = STATE.FIRST_STEP;
  puzleCompleted: boolean = false;
  isloading: boolean = false;
  width: number = 480;

  constructor() {
    this.conversationService.dialogEnd$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.onDialogEnd();
    })
  }

  ngOnInit(): void {
    this.obtenerWidth();
    this.obtenerImageId();
    this.generarImagenes();
    this.warmImages();
    this.setGameState();
  }

  setGameState() {
    const state = (localStorage.getItem('gameState')) as keyof typeof STATE;
    this.gameState = state ? STATE[state] : STATE.FIRST_STEP;

    switch (this.gameState) {
      case STATE.FIRST_STEP:
        if (this.controlsService.isTextActive()) {
          this.iniciarConversacion(gameDialog1)
        } else {
          this.gameState = STATE.THIRD_STEP;
          localStorage.setItem('gameState', this.gameState);
          this.onDialogEnd();
        }
        break;
      case STATE.SECOND_STEP:
        this.time = 6660;
        this.showTimer = true;
        break;
      case STATE.THIRD_STEP:
        this.controlsService.isTextActive() ? this.iniciarConversacion(gameDialog2) : this.onDialogEnd();
        break;
      case STATE.FOURTH_STEP:
        this.time = 60000;
        this.showTimer = true;
        break;
      default:
        this.iniciarConversacion(gameDialog1)
        this.time = 6660;
        this.gameState = STATE.FIRST_STEP;
        break;
    }
  }

  onDialogEnd() {
    if (this.isloading) {
      this.spinner.show();
      return;
    };
    switch (this.gameState) {
      case STATE.FIRST_STEP:
        this.gameState = STATE.SECOND_STEP;
        localStorage.setItem('gameState', this.gameState);
        this.showTimer = true;
        break;
      case STATE.THIRD_STEP:
        this.gameState = STATE.FOURTH_STEP;
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
      fill()
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
    this.isloading = true;
    const respuestaImagen = this.cloudinaryService.warmImage(this.img.toURL());
    const respuestaBgImagen = this.cloudinaryService.warmImage(this.backgroundImg.toURL());


    forkJoin({ respuestaImagen, respuestaBgImagen }).pipe(
      retry({ count: 12, delay: 5000 })
    ).subscribe({
      next: (res => {
        this.showPuzzle = true
        this.isloading = false;
        if (!this.conversationService.isDialogOpen()) this.onDialogEnd();
        this.spinner.hide();
        console.log('next', res);
      }),
      error: (err => {
        console.log('error', err);
        this.spinner.hide();
        this.isloading = false;
        this.toast.error('No se ha podido procesar tu imagen, ¡Inténtalo de nuevo o usa una de las imágenes de ejemplo!', toastConf);
        this.router.navigate([`/upload`]);
      })
    })
  }

  onTimerEnd() {
    this.showTimer = false;
    switch (this.gameState) {
      case STATE.SECOND_STEP:
        this.gameState = STATE.THIRD_STEP;
        localStorage.setItem('gameState', this.gameState);
        this.iniciarConversacion(gameDialog2);
        break;
      case STATE.FOURTH_STEP:
        this.gameState = STATE.LOSE;
        localStorage.setItem('gameCompleted', 'true');
        localStorage.setItem('gameState', this.gameState);
        this.router.navigate([`/game/${this.imageId}/result`]);
        break;
    }
  }

  onPuzzleCompleted() {
    this.showTimer = false;
    this.puzleCompleted = true;
    this.gameState = STATE.WIN;
    localStorage.setItem('gameState', this.gameState);
    localStorage.setItem('gameCompleted', 'true');
    this.router.navigate([`/game/${this.imageId}/result`]);
  }

  obtenerWidth() {
    const width = window.innerWidth;
    if (width >= 480) return;
    const residuo = width % 3;
    this.width = width - (residuo + 9);
  }

}
