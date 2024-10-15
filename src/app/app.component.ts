import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage, Transformation } from '@cloudinary/url-gen';
import { auto, crop, fill, scale, thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { compass, focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { backgroundRemoval, cartoonify, generativeBackgroundReplace, negate, redEye } from '@cloudinary/url-gen/actions/effect';
import { hue } from '@cloudinary/url-gen/actions/adjust';
import { byAngle } from '@cloudinary/url-gen/actions/rotate';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { image } from '@cloudinary/url-gen/qualifiers/source';
import { Background, Position } from '@cloudinary/url-gen/qualifiers';
import { GenerativeBackgroundReplace } from '@cloudinary/url-gen/actions/effect/GenerativeBackgroundReplace';
import { CloudinaryService } from './shared/services/cloudinary.service';
import { ImageInfo } from './shared/models/image-info.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CloudinaryModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  cloudinaryService: CloudinaryService = inject(CloudinaryService);

  title = 'Angular Quick Start';
  img!: CloudinaryImage;
  showImage: boolean = false;

  ngOnInit() {
    // const cld = new Cloudinary({
    //   cloud: {
    //     cloudName: 'cloudWilgen'
    //   }
    // });

    // this.img = cld.image('haunted_mirror/mzxkoneikabz8v0fut5o');
    // const copiaImagen = cld.image('haunted_mirror/mzxkoneikabz8v0fut5o')
    //   .resize(auto().width(300).height(300).gravity(focusOn(FocusOn.face())));;
    // this.cloudinaryService.obtenerInfoImagen(copiaImagen.addFlag('getinfo').toURL()).subscribe((res) => {
    //   this.posicionarOjos(res)
    // });


    // .addTransformation(new Transformation().effect(generativeBackgroundReplace().prompt('Transform the background of the image into a sinister fiery hell with burning flames dark smoke molten lava and a  red-orange sky')))

  }

  posicionarOjos(imageInfo: ImageInfo) {
    this.img
      .overlay(
        source(
          image('haunted_mirror/ojos_tenebrosos')
            .transformation(new Transformation()
              .resize(auto().width(50))
            )
        )
          .position(
            new Position()
              .gravity(compass("north_west"))
              .offsetX(imageInfo.landmarks[0][0].r_eye.x)
              .offsetY(imageInfo.landmarks[0][0].r_eye.y)
          )
      )
      .resize(auto().width(300).height(300).gravity(focusOn(FocusOn.face())));;


    this.showImage = true;
  }
}