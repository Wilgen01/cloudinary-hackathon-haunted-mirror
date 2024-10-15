import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';


@Directive({
  selector: '[fileDragDrop]',
  standalone: true
})
export class FileDragDropDirective {

  @Output() private readonly dropFiles: EventEmitter<FileList> = new EventEmitter();


  @HostBinding('style.background') private background = '#eee';
  @HostBinding('style.border') private borderStyle = '4px dashed';
  @HostBinding('style.border-color') private borderColor = '#FF6500';
  @HostBinding('style.border-radius') private borderRadius = '5px';


  @HostListener('dragover', ['$event']) public onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.background = 'lightgray';
    this.borderStyle = '4px solid';
    this.borderColor = '#E65A00';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.background = '#eee';
    this.borderStyle = '4px dashed';
    this.borderColor = '#FF6500';
    this.borderRadius = '5px';
  }

  @HostListener('drop', ['$event']) public onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#FF6500';
    this.borderStyle = '4px dashed';
    let files = e.dataTransfer?.files;
    if (!files) return;
    let valid_files: FileList = files;
    this.dropFiles.emit(valid_files);
  }

  @HostListener('change', ['$event']) public onFileChange(e: InputEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.background = '#eee';
    this.borderColor = '#FF650';
    this.borderStyle = '4px dashed';
    let files = (e.target as HTMLInputElement)?.files;
    if (!files) return;
    let valid_files: FileList = files;
    this.dropFiles.emit(valid_files);
  }

}
