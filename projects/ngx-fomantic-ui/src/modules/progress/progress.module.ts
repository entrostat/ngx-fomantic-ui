import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FuiProgress} from './components/progress';

@NgModule({
  imports: [
    CommonModule,
    FuiProgress
  ],
  declarations: [
  ],
  exports: [
    FuiProgress
  ]
})
export class FuiProgressModule {
}
