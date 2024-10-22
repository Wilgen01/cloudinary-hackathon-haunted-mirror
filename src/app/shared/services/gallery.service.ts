import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Gallery } from '../models/gallery.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private readonly firestore = inject(Firestore);
  private readonly collection = collection(this.firestore, 'gallery');

  constructor() { }

  getGallery() {
    const res = collectionData(this.collection, { idField: 'id' }) as Observable<Gallery[]>

    return res.pipe(
      map(data => {
        data.sort((a, b) => b.timestamp - a.timestamp);
        return data;
      })
    );
  }

  addGalleryItem(item: Partial<Gallery>) {
    if (!item.id) return;
    const document = doc(this.firestore, 'gallery', item.id);
    return setDoc(document, {...item});
  }

  updateItem(item: Partial<Gallery>) {
    if (!item.id) return;
    const document = doc(this.firestore, 'gallery', item.id);
    return updateDoc(document, {... item});
  }
}
