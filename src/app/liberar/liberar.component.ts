import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { generativeBackgroundReplace, generativeReplace, grayscale, upscale } from '@cloudinary/url-gen/actions/effect';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen/index';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { take } from 'rxjs';
import { PuzleComponent } from '../game/components/puzle/puzle.component';
import { cloudinaryConf } from '../shared/helpers/cloudinary-conf';
import { GalleryService } from '../shared/services/gallery.service';

@Component({
  selector: 'app-liberar',
  standalone: true,
  imports: [CommonModule, PuzleComponent],
  templateUrl: './liberar.component.html',
  styleUrl: './liberar.component.scss'
})
export class LiberarComponent {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly galleryService: GalleryService = inject(GalleryService);

  cld: Cloudinary = cloudinaryConf;
  img: CloudinaryImage;
  imgBase: CloudinaryImage;
  backgroundImg: CloudinaryImage;
  imageId: string = 'haunted_mirror/ufs6rea5v2kqo28eckio';
  itemId: string;
  time: number = 6660;
  puzleCompleted: boolean = false;
  isloading: boolean = false;
  width: number = 480;

  ngOnInit(): void {
    this.obtenerWidth();
    this.obtenerImageId();
    this.generarImagenes();
  }


  obtenerImageId() {
    this.activatedRoute.params.pipe(take(1)).subscribe({
      next: (params) =>  this.imageId = `${params['folder'] + '/' + params['file']}`
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

  onPuzzleCompleted() {
    this.puzleCompleted = true;
    this.galleryService.updateItem({
      id: this.imageId.split('/')[1],
      liberado: true,
      liberadoPor: localStorage.getItem('name') ?? 'Wilgen',
      timestamp: Date.now()
    });
    this.router.navigate([`/gallery`]);
  }

  obtenerWidth() {
    const width = window.innerWidth;
    if (width >= 480) return;
    const residuo = width % 3;
    this.width = width - (residuo + 9);
  }
}
