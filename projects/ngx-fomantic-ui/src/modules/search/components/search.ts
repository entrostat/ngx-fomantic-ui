import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { IFocusEvent, ITemplateRefContext, Util } from '../../../misc/util/internal';
import { DropdownService, FuiDropdownMenu } from '../../dropdown/internal';
import {
  FuiLocalizationService,
  ISearchLocaleValues,
  RecursivePartial
} from '../../../behaviors/localization/internal';
import { SearchService } from '../services/search.service';
import { FilterFn, LookupFn } from '../helpers/lookup-fn';

export interface IResultContext<T> extends ITemplateRefContext<T> {
  query: string;
}

@Component({
  selector: 'fui-search',
  template: `
    <div class="ui input" [class.icon]="hasIcon" (click)="onClick($event)">
      <input class="prompt" type="text" [attr.placeholder]="placeholder" autocomplete="off" [(ngModel)]="query">
      @if (hasIcon) {
        <i class="search icon"></i>
      }
    </div>
    <div class="results"
      fuiDropdownMenu
      [menuTransition]="transition"
      [menuTransitionDuration]="transitionDuration"
      menuSelectedItemClass="active">
    
      @for (r of results; track r) {
        <fui-search-result
          class="item"
          [value]="r"
          [query]="query"
          [formatter]="resultFormatter"
          [template]="resultTemplate"
        (click)="select(r)"></fui-search-result>
      }
    
      @if (results.length == 0) {
        <div class="message empty">
          <div class="header">{{ localeValues.noResults.header }}</div>
          <div class="description">{{ localeValues.noResults.message }}</div>
        </div>
      }
    </div>
    `,
  standalone: false,
  styles: [`
    /* Ensures results div has margin. */
    :host {
      display: inline-block;
      outline: 0;
    }

    /* Fixes positioning when results are pushed above the search. */
    .results {
      margin-bottom: .5em;
    }
  `]
})
export class FuiSearch<T> implements AfterViewInit {

  public dropdownService: DropdownService;
  public searchService: SearchService<T, T>;
  // Doing it on the host enables use in menus etc.
  @HostBinding('class.ui')
  @HostBinding('class.search')
  public readonly hasClasses: boolean;
  // Sets the Fomantic UI classes on the host element.
  @HostBinding('attr.tabindex')
  public readonly tabindex: number;
  // Sets whether the search element has a visible search icon.
  @Input()
  public hasIcon: boolean;
  public localeOverrides: RecursivePartial<ISearchLocaleValues>;
  @Input()
  public resultTemplate: TemplateRef<IResultContext<T>>;
  @Input()
  public retainSelectedResult: boolean;
  @Input()
  public maxResults: number;
  // Stores the currently selected result.
  public selectedResult?: T;
  // Emits whenever a new result is selected.
  @Output('resultSelected')
  public onResultSelected: EventEmitter<T>;
  @Input()
  public transition: string;
  @Input()
  public transitionDuration: number;
  @ViewChild(FuiDropdownMenu)
  private _menu: FuiDropdownMenu;

  constructor(private _element: ElementRef, renderer: Renderer2, private _localizationService: FuiLocalizationService) {
    this.dropdownService = new DropdownService();
    this.searchService = new SearchService<T, T>();

    this.onLocaleUpdate();
    this._localizationService.onLanguageUpdate.subscribe(() => this.onLocaleUpdate());

    this.hasClasses = true;
    this.tabindex = 0;
    this.hasIcon = true;
    this.retainSelectedResult = true;
    this.searchDelay = 200;
    this.maxResults = 7;

    this.onResultSelected = new EventEmitter<T>();

    this.transition = 'scale';
    this.transitionDuration = 200;
  }

  @HostBinding('class.active')
  public get isActive(): boolean {
    return this.dropdownService.isOpen;
  }

  public get query(): string {
    return this.searchService.query;
  }

  public set query(query: string) {
    this.selectedResult = undefined;
    // Initialise a delayed search.
    this.searchService.updateQueryDelayed(query, () => {
      // Set the results open state depending on whether a query has been entered.
      return this.dropdownService.setOpenState(this.searchService.query.length > 0);
    });
  }

  @Input()
  public set options(options: T[] | undefined) {
    if (options) {
      this.searchService.options = options;
    }
  }

  @Input()
  public set optionsFilter(filter: FilterFn<T> | undefined) {
    if (filter) {
      this.searchService.optionsFilter = filter;
    }
  }

  @Input()
  public set optionsLookup(lookupFn: LookupFn<T> | undefined) {
    this.searchService.optionsLookup = lookupFn;
  }

  @Input()
  public set optionsField(field: string | undefined) {
    this.searchService.optionsField = field;
  }

  @Input()
  public set searchDelay(delay: number) {
    this.searchService.searchDelay = delay;
  }

  @HostBinding('class.loading')
  public get isSearching(): boolean {
    return this.searchService.isSearching;
  }

  public get results(): T[] {
    return this.searchService.results.slice(0, this.maxResults);
  }

  private _placeholder: string;

  // Gets & sets the placeholder text displayed inside the text input.
  @Input()
  public get placeholder(): string {
    return this._placeholder || this.localeValues.placeholder;
  }

  public set placeholder(placeholder: string) {
    this._placeholder = placeholder;
  }

  private _localeValues: ISearchLocaleValues;

  public get localeValues(): ISearchLocaleValues {
    return this._localizationService.override<'search'>(this._localeValues, this.localeOverrides);
  }

  private _resultFormatter?: (r: T, q: string) => string;

  public get resultFormatter(): (result: T, query: string) => string {
    if (this._resultFormatter) {
      return this._resultFormatter;
    } else if (this.searchService.optionsLookup) {
      return r => this.readValue(r);
    } else {
      return (r, q) => this.searchService.highlightMatches(this.readValue(r), q);
    }
  }

  @Input()
  public set resultFormatter(formatter: (result: T, query: string) => string) {
    this._resultFormatter = formatter;
  }

  public ngAfterViewInit(): void {
    this._menu.service = this.dropdownService;
  }

  // Selects a result.
  public select(result: T): void {
    this.onResultSelected.emit(result);
    this.dropdownService.setOpenState(false);

    if (this.retainSelectedResult) {
      this.selectedResult = result;
      this.searchService.updateQuery(this.readValue(result));
    } else {
      this.searchService.updateQuery('');
    }
  }

  public onClick(e: MouseEvent): void {
    this.open();
  }

  @HostListener('focusin')
  public onFocusIn(): void {
    if (!this.dropdownService.isAnimating) {
      this.open();
    }
  }

  @HostListener('focusout', ['$event'])
  public onFocusOut(e: IFocusEvent): void {
    if (!this._element.nativeElement.contains(e.relatedTarget)) {
      this.dropdownService.setOpenState(false);
    }
  }

  // Reads the specified field from an item.
  public readValue(object: T): string {
    return Util.Object.readValue<T, string>(object, this.searchService.optionsField);
  }

  private onLocaleUpdate(): void {
    this._localeValues = this._localizationService.get().search;
  }

  private open(): void {
    if (this.searchService.query.length > 0) {
      // Only open on click when there is a query entered.
      this.dropdownService.setOpenState(true);
    }
  }
}
