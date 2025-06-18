import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FuiTransitionModule,
  Transition,
  TransitionController,
  TransitionDirection
} from '../../../modules/transition/internal';
import { HandledEvent, IDynamicClasses } from '../../../misc/util/internal';
import { MessageConfig, MessageState } from '../classes/message-config';
import { FuiProgressModule } from '../../../modules/progress/internal';
import { NgClass, NgIf } from '@angular/common';

export interface IMessage {
  dismiss(): void;
}

@Component({
  selector: 'fui-message',
  imports: [FuiProgressModule, FuiTransitionModule, NgIf, NgClass],
  standalone: true,
  template: `
    <div [fuiTransition]="transitionController">
      <div class="ui message"
           [ngClass]="dynamicClasses"
           (mousemove)="cancelTimer()"
           (mouseleave)="beginTimer(extendedTimeout)"
           (click)="onClicked($event)">
        <i class="close icon" *ngIf="hasDismissButton" (click)="onDismissClicked($event)"></i>
        <ng-content></ng-content>
        <ng-container *ngIf="isDynamic">
          <div class="header" *ngIf="header">{{ header }}</div>
          <p>{{ text }}</p>
        </ng-container>
      </div>
      <fui-progress *ngIf="isDynamic && hasProgress"
                    class="bottom attached"
                    [value]="timeoutProgress"
                    [autoSuccess]="false"
                    transition="linear"
                    [transitionDuration]="currentTimeout"
                    [canCompletelyEmpty]="true"></fui-progress>
    </div>
  `
})
export class FuiMessage implements IMessage {
  public isDynamic: boolean;
  public isClosing: boolean;
  public isDismissing: boolean;

  public text: string;
  public header?: string;
  public state: MessageState;

  public timeout: number;
  public extendedTimeout: number;
  public currentTimeout: number;

  @Input()
  public hasDismissButton: boolean;

  public hasProgress: boolean;

  public timeoutProgress: number;

  public transitionController: TransitionController;

  @Input()
  public transition: string;
  public transitionInDuration: number;

  @Input('transitionDuration')
  public transitionOutDuration: number;
  @Output('click')
  public onClick: EventEmitter<void>;
  @Output('dismiss')
  public onDismiss: EventEmitter<void>;
  @Input('class')
  public classes: string;
  private _displayTimeout: number;

  constructor() {
    const config = new MessageConfig('');
    this.loadConfig(config);

    this.isDynamic = false;
    this.transitionOutDuration = 300;
    this.timeoutProgress = 100;

    this.transitionController = new TransitionController(false);

    this.show();
  }

  public get dynamicClasses(): IDynamicClasses {
    const classes: IDynamicClasses = {};
    classes[this.state] = true;

    if (this.isDynamic && this.hasProgress) {
      classes.attached = true;
    }

    (this.classes || '')
      .split(' ')
      .forEach(c => classes[c] = true);

    return classes;
  }

  public loadConfig(config: MessageConfig): void {
    this.isDynamic = true;

    this.text = config.text;
    this.header = config.header;
    this.state = config.state;

    this.timeout = config.timeout;
    this.extendedTimeout = config.extendedTimeout;

    this.hasDismissButton = config.hasDismissButton;
    this.hasProgress = config.hasProgress;

    this.transition = config.transition;
    this.transitionInDuration = config.transitionInDuration;
    this.transitionOutDuration = config.transitionOutDuration;

    this.onClick = config.onClick;
    this.onDismiss = config.onDismiss;
  }

  public show(): void {
    this.transitionController.stopAll();
    this.transitionController.animate(
      new Transition(
        this.transition,
        this.isDynamic ? this.transitionInDuration : 0,
        TransitionDirection.In,
        () => {
          if (this.isDynamic) {
            this.beginTimer(this.timeout);
          }
        }));
  }

  public dismiss(): void {
    this.isDismissing = true;
    this.transitionOutDuration = this.transitionInDuration;

    this.hide();
  }

  public hide(): void {
    this.isClosing = true;

    this.transitionController.stopAll();
    this.transitionController.animate(
      new Transition(
        this.transition,
        this.transitionOutDuration,
        TransitionDirection.Out,
        () => {
          this.isClosing = false;
          this.onDismiss.emit();
        }));
  }

  public beginTimer(timeout: number): void {
    if (this.isDynamic && !this.isDismissing) {
      this.timeoutProgress = 0;
      this.currentTimeout = timeout;
      this._displayTimeout = window.setTimeout(() => this.onTimedOut(), timeout);
    }
  }

  public cancelTimer(): void {
    if (this.isDynamic && !this.isDismissing) {
      this.timeoutProgress = 100;
      this.currentTimeout = 0;
      clearTimeout(this._displayTimeout);

      if (this.isClosing) {
        this.isClosing = false;

        this.transitionController.cancel();
      }
    }
  }

  public onClicked(e: HandledEvent): void {
    if (!e.eventHandled) {
      this.cancelTimer();
      this.onClick.emit();
    }
  }

  public onDismissClicked(e: HandledEvent): void {
    e.eventHandled = true;
    this.dismiss();
  }

  private onTimedOut(): void {
    this.hide();
  }
}
