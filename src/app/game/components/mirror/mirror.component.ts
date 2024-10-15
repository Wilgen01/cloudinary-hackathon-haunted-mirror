import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloudinaryModule } from '@cloudinary/ng';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { auto, scale } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary, CloudinaryImage, Transformation } from '@cloudinary/url-gen/index';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { compass, focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { image } from '@cloudinary/url-gen/qualifiers/source';
import { ImageInfo } from '../../../shared/models/image-info.model';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';
import { Position } from '@cloudinary/url-gen/qualifiers';
import { opacity } from '@cloudinary/url-gen/actions/adjust';

@Component({
  selector: 'app-mirror',
  standalone: true,
  imports: [CommonModule, CloudinaryModule],
  templateUrl: './mirror.component.html',
  styleUrl: './mirror.component.scss'
})
export class MirrorComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly cloudinaryService: CloudinaryService = inject(CloudinaryService);

  imageId: string = '';
  showImage: boolean = false;
  img!: CloudinaryImage;
  cld!: Cloudinary;
  imageInfo: ImageInfo = JSON.parse(localStorage.getItem('image_info') ?? '{}') as ImageInfo;



  ngOnInit(): void {
    this.obtenerImageId();
    this.obtenerImageInfo();
  }

  obtenerImageInfo() {
    if (localStorage.getItem(this.imageId)) {
      this.imageInfo = JSON.parse(localStorage.getItem(this.imageId) ?? '{}') as ImageInfo;
      this.establecerImagenInicial();
      return;
    }
    const tempImg = this.cld.image(this.imageId).resize(auto().width(300).height(300).gravity(focusOn(face())));
    this.cloudinaryService.obtenerInfoImagen(tempImg.addFlag('getinfo').toURL()).subscribe((res) => {
      this.imageInfo = res;
      localStorage.setItem(this.imageId, JSON.stringify(this.imageInfo));
      this.establecerImagenInicial();
    });
  }

  obtenerImageId() {
    this.inicializarCloudinary();

    this.activatedRoute.params.subscribe((params) => {
      this.imageId = `${params['folder'] + '/' + params['file']}`;
      this.img = this.cld.image(this.imageId);
    });
  }

  inicializarCloudinary() {
    this.cld = new Cloudinary({
      cloud: {
        cloudName: 'cloudWilgen'
      }
    });
  }

  establecerImagenInicial() {
    // this.img.addTransformation(new Transformation().effect(generativeBackgroundReplace().prompt('Add some devils to the background')))   
    this.img.overlay(
      source(
        image("haunted_mirror/ojo").transformation(
          new Transformation().resize(scale().width(40).height(40))
        )
      ).position(
        new Position()
          .gravity(compass("north_west"))
          .offsetX(this.imageInfo.landmarks[0][0].l_eye.x - 20)
          .offsetY(this.imageInfo.landmarks[0][0].l_eye.y - 20)
      ).blendMode("multiply")
    ).overlay(
      source(
        image("haunted_mirror/ojo").transformation(
          new Transformation().resize(scale().width(40).height(40))
        )
      ).position(
        new Position()
          .gravity(compass("north_west"))
          .offsetX(this.imageInfo.landmarks[0][0].r_eye.x - 20)
          .offsetY(this.imageInfo.landmarks[0][0].r_eye.y - 20)
      ).blendMode("multiply")
    ).resize(
      auto()
        .width(300)
        .height(300)
        .gravity(focusOn(face()))
    );


    this.img.overlay(
      source(
        image('haunted_mirror/mirror')
          .transformation(new Transformation()
            .resize(auto().width(500))
          )
      )
    );

    this.img.overlay(
      source(
        image('haunted_mirror/dirty_2')
          .transformation(new Transformation()
            .resize(auto().width(300))
            .adjust(opacity(70))
          )
      )
    );

    this.showImage = true;
  }

}
