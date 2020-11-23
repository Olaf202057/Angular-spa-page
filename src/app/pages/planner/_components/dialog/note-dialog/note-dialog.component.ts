import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { tap, finalize, takeUntil, filter } from 'rxjs/operators';

import { StateService, PlannerService } from 'src/app/core/services';

declare const $: any;

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss'],
})
export class NoteDialogComponent implements OnInit {
  private _match: any;
  private _stop$: Subject<any>;

  note: string;
  noteId: any;
  notes: any[];

  constructor(
    private readonly _store: StateService,
    private readonly _plannerService: PlannerService
  ) {
    this._setVariables();
  }

  ngOnInit(): void {
    this._setDialogEventListener();
  }

  private _setVariables(): void {
    this._stop$ = new Subject();
    this.note = '';
    this.noteId = 0;
  }

  private _setDialogEventListener(): void {
    $('#note-dialog').on('shown.bs.modal', () => {
      this._store.targetMatch
        .pipe(
          tap((match) => {
            this._match = match;
          }),
          takeUntil(this._stop$)
        )
        .subscribe(() => {});

      this._store.notes
        .pipe(
          filter(Boolean),
          tap((notes: any) => {
            this.notes = notes;

            const targetNote = this.notes.find(
              (el) => el.matchId === this._match.matchId
            );
            this.note = targetNote ? targetNote.body : '';
            this.noteId = targetNote ? targetNote.noteId : 0;
          }),
          takeUntil(this._stop$)
        )
        .subscribe(() => {});
    });

    $('#note-dialog').on('hidden.bs.modal', () => {
      this.note = '';
      this.noteId = 0;
      this._stop$.next();
    });
  }

  onSaveNote(): void {
    this._plannerService
      .createNote({
        matchId: this._match.matchId,
        body: this.note,
        noteId: this.noteId,
      })
      .pipe(
        finalize(() => {
          $('#note-dialog').modal('hide');
        })
      )
      .subscribe(() => {});
  }
}
