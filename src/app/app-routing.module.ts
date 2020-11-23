import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'planner', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'planner',
        loadChildren: () =>
          import('./pages/planner/planner.module').then((m) => m.PlannerModule),
      },
      {
        path: 'scanner',
        loadChildren: () =>
          import('./pages/scanner/scanner.module').then((m) => m.ScannerModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
