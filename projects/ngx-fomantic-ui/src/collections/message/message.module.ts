import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FuiTransitionModule} from '../../modules/transition/internal';
import {FuiProgressModule} from '../../modules/progress/internal';
import {FuiUtilityModule} from '../../misc/util/internal';

import {FuiMessageContainer} from './components/message-container';
import {FuiMessage} from './components/message';
import {FuiMessageGlobalContainer} from './components/message-global-container';
import {FuiMessageService} from './services/message-service';

@NgModule({
    imports: [
        CommonModule,
        FuiTransitionModule,
        FuiProgressModule,
        FuiUtilityModule,

        // Components
        FuiMessage,
        FuiMessageContainer,
        FuiMessageGlobalContainer
    ],
    declarations: [],
    exports: [
        FuiMessage,
        FuiMessageContainer
    ],
    providers: [
        FuiMessageService
    ]
})
export class FuiMessageModule {
}
