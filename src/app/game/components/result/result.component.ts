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

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  cld: Cloudinary = cloudinaryConf;
  img: CloudinaryImage;
  imgBase: CloudinaryImage;
  imageId: string = 'haunted_mirror/ufs6rea5v2kqo28eckio';

  ngOnInit(): void {
    this.obtenerImageId();
    this.generarImagenes();
  }

  obtenerImageId() {
    this.activatedRoute.params.pipe(take(1)).subscribe({
      next: (params) => this.imageId = `${params['folder'] + '/' + params['file']}`
    });
  }

  generarImagenes() {
    this.imgBase = this.cld.image(this.imageId);
    this.img = this.generarImagenBase();
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
    ).resize(scale().width(500).height(500))
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
