import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

import { MaterialModule } from 'src/app/shared';
import { PlannerRoutingModule } from './planner-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { PredictionResultPipe } from './_core';

import {
  UpcomingEventsTableComponent,
  StrategyListComponent,
  NoteDialogComponent,
  PredictionsMarketSelectionDialogComponent,
  StrategyTabComponent,
  StrategyAppearanceComponent,
  StrategyColumnVisibilityComponent,
  StrategyFiltersComponent,
} from './_components';
import { PlannerComponent } from './planner.component';

@NgModule({
  declarations: [
    PlannerComponent,
    NoteDialogComponent,
    PredictionsMarketSelectionDialogComponent,
    UpcomingEventsTableComponent,
    StrategyListComponent,
    StrategyTabComponent,
    StrategyAppearanceComponent,
    StrategyColumnVisibilityComponent,
    StrategyFiltersComponent,
    PredictionResultPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableVirtualScrollModule,
    ReactiveFormsModule,
    MaterialModule,
    PlannerRoutingModule,
    ComponentsModule
  ],
  entryComponents: [],
})
export class PlannerModule {}
