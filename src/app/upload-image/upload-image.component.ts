import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary } from '@cloudinary/url-gen/index';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap } from 'rxjs/operators';
import { FileDragDropComponent } from '../shared/components/file-drag-drop/file-drag-drop.component';
import { uploadDialog, uploadDialogMidudev, uploadError1, uploadError2, uploadError3 } from '../shared/dialogs/uplodad.dialog';
import { cloudinaryConf } from '../shared/helpers/cloudinary-conf';
import { toastConf } from '../shared/helpers/toast-conf';
import { Dialogue } from '../shared/models/dialogue.model';
import { ImageInfo } from '../shared/models/image-info.model';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { ControlsService } from '../shared/services/controls.service';
import { ConversationService } from '../shared/services/conversation.service';

const mensajesError: Record<number, Dialogue[]> = {
  1: uploadError1,
  2: uploadError2,
  3: uploadError3
};

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [FileDragDropComponent, RouterLink],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss'
})
export class UploadImageComponent implements OnInit {
  private readonly cloudinaryService: CloudinaryService = inject(CloudinaryService);
  private readonly conversationService: ConversationService = inject(ConversationService);
  private readonly router: Router = inject(Router);
  private readonly spinner: NgxSpinnerService = inject(NgxSpinnerService);
  private readonly toast: HotToastService = inject(HotToastService);
  private readonly controlsService: ControlsService = inject(ControlsService);

  cld: Cloudinary = cloudinaryConf;
  imageId: string = '';
  tryCount: number = 1;


  ngOnInit(): void {
    localStorage.removeItem('gameState');
    this.startDialogue();
  }

  startDialogue() {
    const name = (localStorage.getItem('name') ?? '').toLocaleLowerCase();
    if (name === 'midudev' || name === 'midu') {
      this.conversationService.startDialogue(uploadDialogMidudev);
    } else {
      this.conversationService.startDialogue(uploadDialog);
    }
  }

  uploadImage(files: FileList) {
    this.spinner.show();
    this.cloudinaryService.uploadImage(files[0]).pipe(
      concatMap(result => this.detectFacesInImage(result.public_id))
    ).subscribe({
      next: (imgInfo) => {
        this.spinner.hide();
        if (!this.isValidImage(imgInfo)) {
          this.onImageInvalid();
          return;
        }
        localStorage.setItem(this.imageId, JSON.stringify(imgInfo));
        this.router.navigate([`/game/${this.imageId}`]);
      },
      error: () => { 
        this.toast.error('No se ha podido subir la imagen, ¡Inténtalo de nuevo!', toastConf);
        this.spinner.hide();
       }
    })
  }

  detectFacesInImage(imageId: string) {
    this.imageId = imageId;
    const img = this.cld.image(imageId).resize(fill().width(480).height(480).gravity(focusOn(face())));
    img.addFlag('getinfo');
    return this.cloudinaryService.obtenerInfoImagen(img.toURL())
  }

  isValidImage(imageInfo: ImageInfo) {
    const validation =
      imageInfo.landmarks.length > 0 &&
      imageInfo.landmarks[0].length > 0 &&
      imageInfo.landmarks[0][0].r_eye.x > 0 &&
      imageInfo.landmarks[0][0].r_eye.y > 0 &&
      imageInfo.landmarks[0][0].mouth_l.x > 0 &&
      imageInfo.landmarks[0][0].mouth_l.y > 0 &&
      imageInfo.landmarks[0][0].l_eye.x > 0 &&
      imageInfo.landmarks[0][0].l_eye.y > 0 &&
      imageInfo.landmarks[0][0].nose_tip.x > 0 &&
      imageInfo.landmarks[0][0].nose_tip.y > 0 &&
      imageInfo.landmarks[0][0].mouth_r.x > 0 &&
      imageInfo.landmarks[0][0].mouth_r.y > 0;
    return validation;
  }

  onImageInvalid() {
    if (this.tryCount > 3) {
      this.router.navigate([`/game/haunted_mirror/ufs6rea5v2kqo28eckio`]);
      return;
    }

    this.controlsService.isTextActive()?
    this.conversationService.startDialogue(mensajesError[this.tryCount]) : this.toast.error('No se ha podido detectar un rostro en la imagen que has subido, ¡Inténtalo de nuevo!', toastConf);
    this.tryCount++;
  }

  navigateToGame(imageId: string) {
    this.router.navigate([`/game/${imageId}`]);
  }

}
