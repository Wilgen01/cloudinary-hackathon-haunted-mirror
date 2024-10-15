import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ImageInfo } from '../models/image-info.model';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  http: HttpClient = inject(HttpClient);

  constructor() { }

  obtenerInfoImagen(url: string) {
    return this.http.get<ImageInfo>(url);
  }
}
