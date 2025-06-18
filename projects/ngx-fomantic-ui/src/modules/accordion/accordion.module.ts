import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiCollapseModule } from '../collapse/internal';
import { FuiTransitionModule } from '../transition/internal';
import { FuiAccordion } from './components/accordion';
import { FuiAccordionPanel } from './components/accordion-panel';

@NgModule({
  imports: [
    CommonModule,
    FuiCollapseModule,
    FuiTransitionModule,

    // Components
    FuiAccordion,
    FuiAccordionPanel
  ],
  declarations: [],
  exports: [
    FuiAccordion,
    FuiAccordionPanel
  ],
  providers: []
})
export class FuiAccordionModule {
}
