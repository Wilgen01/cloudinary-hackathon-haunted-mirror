import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FileDragDropDirective } from '../../directives/file-drag-drop.directive';

@Component({
  selector: 'app-file-drag-drop',
  standalone: true,
  imports: [FileDragDropDirective],
  templateUrl: './file-drag-drop.component.html',
  styleUrl: './file-drag-drop.component.scss',
})
export class FileDragDropComponent {
  @ViewChild('input') private input: HTMLInputElement;
  @Output() private readonly dropFiles: EventEmitter<FileList> = new EventEmitter();


  public onFileChange(event: FileList) {
    this.dropFiles.emit(event)
    this.input.value = '';
  }
}
