import { Component, EventEmitter, Output } from '@angular/core';
import { FileDragDropDirective } from '../../directives/file-drag-drop.directive';

@Component({
  selector: 'app-file-drag-drop',
  standalone: true,
  imports: [FileDragDropDirective],
  templateUrl: './file-drag-drop.component.html',
  styleUrl: './file-drag-drop.component.scss',
})
export class FileDragDropComponent {
  @Output() private readonly dropFiles: EventEmitter<FileList> = new EventEmitter();


  public onFileChange(event: FileList) {
    this.dropFiles.emit(event)
  }
}
