import { Component, inject, OnInit } from '@angular/core';
import { MirrorComponent } from './components/mirror/mirror.component';
import { PuzleComponent } from './components/puzle/puzle.component';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen/index';
import { cloudinaryConf } from '../shared/helpers/cloudinary-conf';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, retry, take } from 'rxjs';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { generativeBackgroundReplace, generativeReplace, grayscale, upscale } from '@cloudinary/url-gen/actions/effect';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MirrorComponent, PuzleComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly cloudinaryService: CloudinaryService = inject(CloudinaryService);

  cld: Cloudinary = cloudinaryConf;
  img: CloudinaryImage;
  imgBase: CloudinaryImage;
  backgroundImg: CloudinaryImage;
  imageId: string = '';
  showPuzzle: boolean = false;

  ngOnInit(): void {
    this.obtenerImageId();
    this.generarImagenes();
    this.warmImages();
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

}
