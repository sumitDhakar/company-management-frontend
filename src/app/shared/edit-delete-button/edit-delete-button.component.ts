import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-delete-button',
  templateUrl: './edit-delete-button.component.html',
  styleUrls: ['./edit-delete-button.component.scss']
})
export class EditDeleteButtonComponent {
  @Input() permissions: any;
  @Input() deleteDataTarget: any;
  @Input() editDataTarget: any;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  } 
}