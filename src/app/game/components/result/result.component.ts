import { Component, inject, OnInit } from '@angular/core';
import { Cloudinary, CloudinaryImage, Transformation } from '@cloudinary/url-gen/index';
import { cloudinaryConf } from '../../../shared/helpers/cloudinary-conf';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { auto, scale } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { generativeBackgroundReplace, generativeReplace, upscale } from '@cloudinary/url-gen/actions/effect';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { image } from '@cloudinary/url-gen/qualifiers/source';
import { Position } from '@cloudinary/url-gen/qualifiers';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../../shared/services/conversation.service';
import { Dialogue } from '../../../shared/models/dialogue.model';
import { defeatDialog, victoryDialog } from '../../../shared/dialogs/result.dialog';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';
import { toastConf } from '../../../shared/helpers/toast-conf';

type EstadoJuego = 'WIN' | 'LOSE';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly cloudinaryService: CloudinaryService = inject(CloudinaryService);
  private readonly conversationService: ConversationService = inject(ConversationService);
  private readonly toast: HotToastService = inject(HotToastService);


  cld: Cloudinary = cloudinaryConf;
  img: CloudinaryImage;
  imgBase: CloudinaryImage;
  imageId: string = 'haunted_mirror/ufs6rea5v2kqo28eckio';
  tieneMarco: boolean = true;
  estadoJuego: EstadoJuego = (localStorage.getItem('gameState')as EstadoJuego) ?? 'LOSE';
  usuario: string = localStorage.getItem('name') ?? 'Midudev';

  ngOnInit(): void {
    localStorage.removeItem('gameState');
    this.toast.info('Nueva Opción disponible: Ahora puedes desactivar los textos, encuéntralo en el menú de opciones', toastConf);
    this.iniciarConversacion();
    this.obtenerImageId();
    this.imgBase = this.generarImagenBase();
    this.img = this.generarImagenMarco(); 
  }

  iniciarConversacion() {
    const dialog: Dialogue[] = this.estadoJuego === 'WIN' ? victoryDialog : defeatDialog;
    this.conversationService.startDialogue(dialog);
  }

  obtenerImageId() {
    this.activatedRoute.params.pipe(take(1)).subscribe({
      next: (params) => this.imageId = `${params['folder'] + '/' + params['file']}`
    });
  }


  generarImagenBase() {
    const img = this.cld.image(this.imageId);
    img.resize(
      auto()
        .width(480)
        .height(480)
        .gravity(focusOn(face()))
    ).effect(
      upscale()
    ).effect(
      generativeReplace().from('face').to('scary demon face with horns on the head sharp teeth and red eyes from which blood flows')
    ).effect(
      generativeBackgroundReplace().prompt('terrifying background infested with demons seeking to trap a soul')
    )
    return img;
  }

  downloadImage() {
    this.cloudinaryService.warmImage(this.img.toURL()).subscribe({
      next: (res) => {
        const blob = new Blob([res], { type: 'image/jpeg' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hauntes_mirror.jpg';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    })
  }

  toggleMarco() {
    this.img = this.tieneMarco ? this.generarImagenMarco() : this.generarImagenBase();
  }

  generarImagenMarco() {
    let img = this.generarImagenBase();
    img.resize(scale().width(500).height(500))
      .resize(auto().aspectRatio("8:10"))
      .roundCorners(byRadius(200))
      .overlay(
        source(
          image("haunted_mirror/ouvdbc9dfvccctkllqsw").transformation(
            new Transformation().resize(auto().width(500))
          )
        ).position(new Position().offsetY(-10))
      );

    return img;
  }

}
