import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss'
})
export class UploadImageComponent implements OnInit {
  @ViewChild('uploadedimage') uploadedimage: ElementRef;
  myWidget!: any;

  ngOnInit() {
    this.initWidget();
  }

  initWidget() {
    this.myWidget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'cloudWilgen',
        uploadPreset: 'haunted_mirror_preset'
      },
      (error : any, result : any) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          this.uploadedimage.nativeElement.setAttribute("src", result.info.secure_url);
        }
      }
    );
  }

  openWidget() {
    this.myWidget.open();
  }
}
