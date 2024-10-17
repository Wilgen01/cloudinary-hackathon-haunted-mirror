import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ImageInfo } from '../models/image-info.model';
import { ImageUploadResult } from '../models/image-upload-result.model';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  http: HttpClient = inject(HttpClient);

  constructor() { }

  obtenerInfoImagen(url: string) {
    return this.http.get<ImageInfo>(url);
  }

  uploadImage(file: File) {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'haunted_mirror_preset');
    data.append('cloud_name', 'cloudWilgen');
    return this.http.post<ImageUploadResult>('https://api.cloudinary.com/v1_1/cloudWilgen/upload', data);
  }
}
