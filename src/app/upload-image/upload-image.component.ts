import { Component, inject, OnInit } from '@angular/core';
import { FileDragDropComponent } from '../shared/components/file-drag-drop/file-drag-drop.component';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { Router, RouterLink } from '@angular/router';
import { ConversationService } from '../shared/services/conversation.service';
import { uploadDialog, uploadError1, uploadError2, uploadError3 } from '../shared/dialogs/uplodad.dialog';
import { Cloudinary } from '@cloudinary/url-gen/index';
import { cloudinaryConf } from '../shared/helpers/cloudinary-conf';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { ImageInfo } from '../shared/models/image-info.model';
import { concatMap } from 'rxjs/operators';
import { Dialogue } from '../shared/models/dialogue.model';

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

  cld: Cloudinary = cloudinaryConf;
  imageId : string = '';
  tryCount: number = 1;


  ngOnInit(): void {
    this.conversationService.startDialogue(uploadDialog);
  }

  uploadImage(files: FileList) {
    this.cloudinaryService.uploadImage(files[0]).pipe(
      concatMap(result => this.detectFacesInImage(result.public_id))
    ).subscribe({
      next: (imgInfo) => {
        if (!this.isValidImage(imgInfo)){
          this.onImageInvalid();
          return;
        }
        this.router.navigate([`/game/${this.imageId}`]);
      }
    })
  }

  detectFacesInImage(imageId: string) {
    this.imageId = imageId;
    const img = this.cld.image(imageId).resize(auto().width(480).height(480).gravity(focusOn(face())));
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

  onImageInvalid(){
    if (this.tryCount > 3) {
      this.router.navigate([`/game/haunted_mirror/ufs6rea5v2kqo28eckio`]);
      return;
    }

    this.conversationService.startDialogue(mensajesError[this.tryCount]);
    this.tryCount++;
  }

}
