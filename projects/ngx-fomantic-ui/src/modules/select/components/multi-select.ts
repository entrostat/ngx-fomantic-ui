import { Component, Directive, ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import {
  CustomValueAccessor,
  customValueAccessorFactory,
  ICustomValueAccessorHost,
  KeyCode
} from '../../../misc/util/internal';
import { FuiLocalizationService } from '../../../behaviors/localization/internal';
import { FuiSelectBase } from '../classes/select-base';
import { FuiSelectOption } from './select-option';

@Component({
  selector: 'fui-multi-select',
  template: `
    <!-- Dropdown icon -->
    <i class="{{ icon }} icon" (click)="onCaretClick($event)"></i>
    
    @if (hasLabels) {
      <!-- Multi-select labels -->
      @for (selected of selectedOptions; track selected) {
        <fui-multi-select-label
          [value]="selected"
          [query]="query"
          [formatter]="configuredFormatter"
          [template]="optionTemplate"
        (deselected)="deselectOption($event)"></fui-multi-select-label>
      }
    }
    
    <!-- Query input -->
    <input fuiSelectSearch
      type="text"
      [hidden]="!isSearchable || isSearchExternal">
    
    <!-- Helper text -->
    <div class="text"
      [class.default]="hasLabels"
      [class.filtered]="!!query && !isSearchExternal">
    
      <!-- Placeholder text -->
      @if (hasLabels) {
        {{ placeholder }}
      } @else {
        {{ selectedMessage }}
      }
    
      <!-- Summary shown when labels are hidden -->
    </div>
    
    <!-- Select dropdown menu -->
    <div class="menu"
      fuiDropdownMenu
      [menuTransition]="transition"
      [menuTransitionDuration]="transitionDuration"
      [menuAutoSelectFirst]="true">
    
      <ng-content></ng-content>
      @if (availableOptions.length == 0 ) {
        @if (!maxSelectedReached) {
          <div class="message">{{ localeValues.noResultsMessage }}</div>
        }
        @if (maxSelectedReached) {
          <div class="message">{{ maxSelectedMessage }}</div>
        }
      }
    </div>
    `,
  standalone: false,
  styles: [`
    :host input.search {
      width: 12em !important;
    }
  `]
})
export class FuiMultiSelect<T, U> extends FuiSelectBase<T, U> implements ICustomValueAccessorHost<U[]> {

  public selectedOptions: T[];
  @Output()
  public selectedOptionsChange: EventEmitter<U[]>;
  @Input()
  public maxSelected: number;
  @HostBinding('class.multiple')
  public readonly hasClasses: boolean;
  // Stores the values written by ngModel before it can be matched to an option from `options`.
  private _writtenOptions?: U[];

  constructor(element: ElementRef, localizationService: FuiLocalizationService) {
    super(element, localizationService);

    this.selectedOptions = [];
    this.selectedOptionsChange = new EventEmitter<U[]>();

    this.hasLabels = true;
    this.hasClasses = true;
  }

  public get filteredOptions(): T[] {
    if (this.maxSelectedReached) {
      // If we have reached the maximum number of selections, then empty the results completely.
      return [];
    }

    const searchResults: T[] = this.searchService.results;

    if (!this.hasLabels) {
      return searchResults;
    } else {
      // Returns the search results \ selected options.
      return searchResults
        .filter(r => this.selectedOptions.find(o => r === o) == undefined);
    }
  }

  public get availableOptions(): T[] {
    return this.filteredOptions;
  }

  public get maxSelectedReached(): boolean {
    if (this.maxSelected == undefined) {
      // If there is no maximum then we can immediately return.
      return false;
    }
    return this.selectedOptions.length === this.maxSelected;
  }

  public get maxSelectedMessage(): string {
    return this._localizationService.interpolate(
      this.localeValues.multi.maxSelectedMessage,
      [['max', this.maxSelected.toString()]]);
  }

  public get selectedMessage(): string {
    return this._localizationService.interpolate(
      this.localeValues.multi.selectedMessage,
      [['count', this.selectedOptions.length.toString() === '0' && this._showCountText ?
        this._showCountText : this.selectedOptions.length.toString()]]);
  }

  private _hasLabels: boolean;

  @Input()
  public get hasLabels(): boolean {
    return this._hasLabels;
  }

  public set hasLabels(hasLabels: boolean) {
    this._hasLabels = hasLabels;
  }

  private _showCountText: string;

  @Input()
  public get showCountText(): string {
    return this._showCountText;
  }

  public set showCountText(showCountText: string) {
    this._showCountText = showCountText;
  }

  private _placeholder: string;

  @Input()
  public get placeholder(): string {
    return this._placeholder || this.localeValues.multi.placeholder;
  }

  public set placeholder(placeholder: string) {
    this._placeholder = placeholder;
  }

  public selectOption(option: T): void {
    if (this.selectedOptions.indexOf(option) !== -1) {
      this.deselectOption(option);
      return;
    }
    this.selectedOptions.push(option);
    this.selectedOptionsChange.emit(this.selectedOptions.map(o => this.valueGetter(o)));

    this.resetQuery(false);

    // Automatically refocus the search input for better keyboard accessibility.
    this.focus();

    if (!this.hasLabels) {
      this.onAvailableOptionsRendered();
    }
  }

  public writeValue(values: U[]): void {
    if (values instanceof Array) {
      if (this.searchService.options.length > 0) {
        // If the options have already been loaded, we can immediately match the ngModel values to options.
        this.selectedOptions = values
          // non-null assertion added here because Typescript doesn't recognise the non-null filter.
          .map(v => this.findOption(this.searchService.options, v)!)
          .filter(v => v != undefined);
      }
      if (values.length > 0 && this.selectedOptions.length === 0) {
        if (this.searchService.hasItemLookup) {
          // If the search service has a selected lookup function, make use of that to load the initial values.
          this.searchService
            .initialLookup(values)
            .then(items => this.selectedOptions = items);
        } else {
          // Otherwise, cache the written value for when options are set.
          this._writtenOptions = values;
        }
      }
      if (values.length === 0) {
        this.selectedOptions = [];
      }
    } else {
      this.selectedOptions = [];
    }
  }

  public deselectOption(option: T): void {
    // Update selected options to the previously selected options \ {option}.
    this.selectedOptions = this.selectedOptions.filter(so => so !== option);
    this.selectedOptionsChange.emit(this.selectedOptions.map(o => this.valueGetter(o)));

    // Automatically refocus the search input for better keyboard accessibility.
    this.focus();

    if (!this.hasLabels) {
      this.onAvailableOptionsRendered();
    }
  }

  public onQueryInputKeydown(event: KeyboardEvent): void {
    if (event.keyCode === KeyCode.Backspace && this.query === '' && this.selectedOptions.length > 0) {
      // Deselect the rightmost option when the user presses backspace in the search input.
      this.deselectOption(this.selectedOptions[this.selectedOptions.length - 1]);
    }
  }

  protected optionsUpdateHook(): void {
    if (!this._writtenOptions && this.selectedOptions.length > 0) {
      // We need to check the options still exist.
      this.writeValue(this.selectedOptions.map(o => this.valueGetter(o)));
    }

    if (this._writtenOptions && this.searchService.options.length > 0) {
      // If there were values written by ngModel before the options had been loaded, this runs to fix it.
      this.selectedOptions = this._writtenOptions
        // non-null assertion added here because Typescript doesn't recognise the non-null filter.
        .map(v => this.findOption(this.searchService.options, v)!)
        .filter(v => v != undefined);

      if (this.selectedOptions.length === this._writtenOptions.length) {
        this._writtenOptions = undefined;
      }
    }
  }

  protected initialiseRenderedOption(option: FuiSelectOption<T>): void {
    super.initialiseRenderedOption(option);

    // Boldens the item so it appears selected in the dropdown.
    option.isActive = !this.hasLabels && this.selectedOptions.indexOf(option.value) !== -1;
  }
}

// Value accessor directive for the select to support ngModel.
@Directive({
  selector: 'fui-multi-select',
  host: {
    '(selectedOptionsChange)': 'onChange($event)',
    '(touched)': 'onTouched()'
  },
  providers: [customValueAccessorFactory(FuiMultiSelectValueAccessor)],
  standalone: false
})
export class FuiMultiSelectValueAccessor<T, U> extends CustomValueAccessor<U[], FuiMultiSelect<T, U>> {
  constructor(host: FuiMultiSelect<T, U>) {
    super(host);
  }
}
