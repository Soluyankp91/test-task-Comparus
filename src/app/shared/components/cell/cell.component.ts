import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CellType } from 'src/app/interfaces';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent {
  @Input() type: CellType = CellType.DISABLED;
  @Output() clickEmitter = new EventEmitter();

  CellType = CellType;
}
