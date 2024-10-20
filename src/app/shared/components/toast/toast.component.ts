import { Component, Inject, Optional } from '@angular/core';
import { HotToastRef } from '@ngneat/hot-toast';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  constructor(
    @Optional()
    @Inject(HotToastRef)
    public toastRef: HotToastRef<any>
  ) { }
}
