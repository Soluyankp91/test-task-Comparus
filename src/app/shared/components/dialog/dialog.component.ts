import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameResults, ROUND_RESULT, Score, Winner } from 'src/app/interfaces';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  winner: Winner;

  score: Score;

  possibleWinners = ROUND_RESULT;
  constructor(@Inject(MAT_DIALOG_DATA) private dialogData: GameResults) {
    this.winner = dialogData.winner;
    this.score = dialogData.score;
  }
}
