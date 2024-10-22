import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GalleryService } from '../shared/services/gallery.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  private readonly galleryService = inject(GalleryService);

  galleryItems = toSignal(this.galleryService.getGallery());

  addGalleryItem() {
    this.galleryService.addGalleryItem({
      id: 'id',
      fecha: new Date(),
      imageId: 'imageId',
      nombre: 'nombre',
      liberado: false,
      imageUrl: 'https://res.cloudinary.com/cloudWilgen/image/upload/c_fill,g_face,h_480,w_480/e_upscale/e_gen_replace:from_face;to_scary%20demon%20face%20with%20horns%20on%20the%20head%20sharp%20teeth%20and%20red%20eyes%20from%20which%20blood%20flows/e_gen_background_replace:prompt_terrifying%20background%20infested%20with%20demons%20seeking%20to%20trap%20a%20soul/v1/haunted_mirror/ufs6rea5v2kqo28eckio?_a=DATAg1AAZAA0',
      liberadoPor: 'Wilgen'
    });
  }


}
