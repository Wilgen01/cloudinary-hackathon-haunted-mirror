import { Component, inject } from '@angular/core';
import { FileDragDropComponent } from '../shared/components/file-drag-drop/file-drag-drop.component';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [FileDragDropComponent, RouterLink],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss'
})
export class UploadImageComponent {
  private readonly cloudinaryService: CloudinaryService = inject(CloudinaryService);

  uploadImage(files: FileList) {
    this.cloudinaryService.uploadImage(files[0]).subscribe((res) => {
      console.log(res);
    });
  }
}
