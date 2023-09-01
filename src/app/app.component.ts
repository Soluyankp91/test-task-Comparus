import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Cell, CellType, Cells, ROUND_RESULT, Score } from './interfaces';
import { timer, firstValueFrom, race, Subject, map } from 'rxjs';
import { RandomSubsequence } from './shared/services/random-subsequence.service';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { DialogComponent } from './shared/components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  rowCount = 10;
  columnCount = 10;

  items: Cells;
  randomSubsequence: RandomSubsequence;

  millisecondsControl = new FormControl(100, [
    Validators.min(100),
    Validators.required,
  ]);
  milliseconds: number;

  score: Score = { computer: 0, player: 0 };

  cancelSignal$ = new Subject<void>();

  WIN_POINTS = 10;

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.items = Array.from({ length: this.columnCount }, () =>
      Array.from(
        { length: this.columnCount },
        () =>
          <Cell>{
            type: CellType.INITIAL,
            click$: null,
          }
      )
    );

    this.randomSubsequence = new RandomSubsequence(this.items.flat(1));
  }
  async game() {
    this.items.flat().forEach((item) => {
      item.type = CellType.INITIAL;
    });

    for (const item of this.randomSubsequence) {
      item.target.type = CellType.PENDING;
      this._cdr.detectChanges();
      item.target.click$ = new Subject();

      let roundResult = await firstValueFrom(
        race(
          timer(this.milliseconds).pipe(map(() => ROUND_RESULT.COMPUTER)),
          item.target.click$.pipe(map(() => ROUND_RESULT.PLAYER)),
          this.cancelSignal$.pipe(map(() => ROUND_RESULT.ABORT))
        )
      );

      item.target.click$.complete();
      item.target.click$ = null;

      switch (roundResult) {
        case ROUND_RESULT.COMPUTER: {
          this.score.computer++;
          item.target.type = CellType.REJECTED;
          break;
        }
        case ROUND_RESULT.PLAYER: {
          this.score.player++;
          item.target.type = CellType.FULFILLED;
          break;
        }
        case ROUND_RESULT.ABORT: {
          return;
        }
      }

      this._cdr.detectChanges();
      if (
        this.score.computer === this.WIN_POINTS ||
        this.score.player === this.WIN_POINTS
      ) {
        let winner =
          this.score.computer === this.WIN_POINTS
            ? ROUND_RESULT.COMPUTER
            : ROUND_RESULT.PLAYER;
        await this._dialog
          .open(DialogComponent, {
            data: {
              score: this.score,
              winner,
            },
          })
          .afterClosed();
        return;
      }
    }
  }

  gameStart() {
    if (!this.millisecondsControl.valid) {
      this.millisecondsControl.markAsTouched();
      return;
    }
    this.milliseconds = this.millisecondsControl.value as any;
    this.score = { computer: 0, player: 0 };

    this.cancelSignal$.next();
    this.game();
  }

  clickEmitted(rowIndex: number, columnIndex: number) {
    if (this.items[rowIndex][columnIndex].click$ instanceof Subject) {
      this.items[rowIndex][columnIndex].click$!.next();
    }
  }
}
