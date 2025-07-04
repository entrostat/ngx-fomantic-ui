import { Component } from '@angular/core';
import { ApiDefinition } from '../../../components/api/api.component';

const exampleStandardTemplate = `
<div class="ui segments">
    <div class="ui segment">
        <p>Single Select (with <code>selection</code> class applied)</p>
        <fui-select class="selection"
                    [(ngModel)]="selectedOption"
                    [options]="options"
                    labelField="name"
                    [isSearchable]="searchable"
                    [isDisabled]="disabled"
                    #select>
            <fui-select-option *ngFor="let option of select.filteredOptions"
                               [value]="option">
            </fui-select-option>
        </fui-select>
    </div>
    <div class="ui segment">
        <p>Multi Select (with <code>selection</code> class applied)</p>
        <fui-multi-select class="selection"
                          [(ngModel)]="selectedOptions"
                          [options]="options"
                          labelField="name"
                          [isSearchable]="searchable"
                          [isDisabled]="disabled"
                          [hasLabels]="!hideLabels"
                          [showCountText]="'Select'"
                          #multiSelect>
            <fui-select-option *ngFor="let option of multiSelect.filteredOptions"
                               [value]="option">
            </fui-select-option>
        </fui-multi-select>
        <br><br>
        <fui-checkbox [(ngModel)]="hideLabels">Hide labels?</fui-checkbox>
    </div>
    <div class="ui segment">
        <fui-checkbox [(ngModel)]="searchable">Searchable?</fui-checkbox>
        <br>
        <fui-checkbox [(ngModel)]="disabled">Disabled?</fui-checkbox>

    </div>
    <div class="ui segment">
        <p>Singly selected: {{ selectedOption | json }}</p>
        <p>Multi selected: {{ selectedOptions | json }}</p>
    </div>
</div>
`;

const exampleVariationsTemplate = `
<div class="ui segments">
    <div class="ui segment">
        <p><strong>Basic</strong></p>
        <fui-select placeholder="Choose">
            <fui-select-option value="Option 1"></fui-select-option>
            <fui-select-option value="Option 2"></fui-select-option>
            <fui-select-option value="Option 3"></fui-select-option>
            <fui-select-option value="Option 4"></fui-select-option>
        </fui-select>
    </div>
    <div class="ui segment">
        <p><strong>Inline</strong></p>
        <h4 class="ui header">
            <i class="trophy icon"></i>
            <div class="content">
                Trending repos
                <fui-select class="inline" [(ngModel)]="selectedRange">
                    <div class="header">Adjust time span</div>
                    <fui-select-option value="today"></fui-select-option>
                    <fui-select-option value="this week"></fui-select-option>
                    <fui-select-option value="this month"></fui-select-option>
                </fui-select>
            </div>
        </h4>
    </div>
    <div class="ui segment">
        <p><strong>Button</strong></p>
        <fui-select class="floating labeled icon button"
                    icon="filter"
                    [options]="filters"
                    [isSearchable]="true"
                    placeholder="Select Filter"
                    #filterSelect>
            <div class="header">
                <i class="tags icon"></i>
                Filter by tag
            </div>
            <fui-select-option *ngFor="let o of filterSelect.filteredOptions" [value]="o"></fui-select-option>
        </fui-select>
    </div>
</div>
`;

const exampleClearableTemplate = `
<fui-select class="selection"
            [(ngModel)]="selectedOption"
            [options]="filters"
            [isClearable]="true"
            #select>
    <fui-select-option *ngFor="let option of select.filteredOptions"
                       [value]="option">
    </fui-select-option>
</fui-select>
`;

const exampleInMenuSearchTemplate = `
<fui-multi-select [(ngModel)]="selected"
                  [options]="options"
                  labelField="name"
                  [maxSelected]="5"
                  icon="list"
                  #select>
    <div class="ui icon search input">
        <i class="search icon"></i>
        <input fuiSelectSearch type="text" placeholder="Search options...">
    </div>
    <div class="divider"></div>
    <div class="header">
        <i class="list icon"></i>
        Options
    </div>
    <div class="scrolling menu">
        <fui-select-option *ngFor="let o of select.filteredOptions" [value]="o"></fui-select-option>
    </div>
</fui-multi-select>
`;

const exampleTemplateTemplate = `
<div class="ui segments">
    <div class="ui segment">
        <ng-template let-option #optionTemplate>
            <i class="child icon"></i>{{ option.name }}
        </ng-template>
        <p><strong>Template</strong></p>
        <p>Note: You must still provide a <code>labelField</code> to support searching.</p>
        <fui-select class="selection"
                    [(ngModel)]="selectedOption"
                    [options]="options"
                    labelField="name"
                    [optionTemplate]="optionTemplate"
                    [isSearchable]="true"
                    #templated>
            <fui-select-option *ngFor="let o of templated.filteredOptions" [value]="o"></fui-select-option>
        </fui-select>
    </div>
    <div class="ui segment">
        <p><strong>Formatter</strong></p>
        <fui-select class="selection"
                    [(ngModel)]="selectedOption"
                    [options]="options"
                    [optionFormatter]="formatter"
                    #formatted>
            <fui-select-option *ngFor="let o of formatted.filteredOptions" [value]="o"></fui-select-option>
        </fui-select>
    </div>
    <div class="ui segment">
        <p>Selected: {{ selectedOption | json }}</p>
    </div>
</div>
`;

const exampleSearchLookupTemplate = `
<fui-select class="selection"
            [(ngModel)]="selectedOption"
            [optionsLookup]="optionsLookup"
            labelField="name"
            valueField="id"
            [isSearchable]="true"
            #searchSelect>
    <fui-select-option *ngFor="let o of searchSelect.filteredOptions" [value]="o"></fui-select-option>
</fui-select>
<div class="ui segment">
    <p>Currently selected: {{ selectedOption | json }}</p>
</div>
`;

@Component({
    selector: 'demo-page-select',
    templateUrl: './select.page.html',
    standalone: false
})
export class SelectPage {
    public api: ApiDefinition = [
        {
            selector: '<fui-select>',
            properties: [
                {
                    name: 'placeholder',
                    type: 'string',
                    description: 'Sets the placeholder string on the search box.',
                    defaultValue: 'Select one'
                },
                {
                    name: 'options',
                    type: 'T[]',
                    description: 'Sets the options available to the select component. ' +
                                 'Cannot be used in conjunction with <code>optionsLookup</code>.'
                },
                {
                    name: 'optionsFilter',
                    type: '(options:T[], query:string) => T[] | false',
                    description: 'A function to filter the provided options with a custom function. ' +
                                 'Return <code>false</code> to keep the current options. ' +
                                 'Cannot be used in conjunction with <code>optionsLookup</code>.'
                },
                {
                    name: 'optionsLookup',
                    type: '(query:string, initial?:U) => Promise<T[]>',
                    description: 'A function to asynchronously transform the provided query string into the array of options. ' +
                                 'Must return a <code>Promise</code>. ' +
                                 'This must be defined as an arrow function in your class.'
                },
                {
                    name: 'labelField',
                    type: 'string',
                    description: 'Sets the property name that is used as a label for each option. ' +
                                 'Supports dot notation for nested properties.'
                },
                {
                    name: 'valueField',
                    type: 'string',
                    description: 'Sets the property name that is used to bind to ngModel. Leaving this ' +
                                 'blank uses the entire object. Supports dot notation for nested properties.'
                },
                {
                    name: 'isDisabled',
                    type: 'boolean',
                    description: 'Sets whether or not the select is disabled',
                    defaultValue: 'false'
                },
                {
                    name: 'isSearchable',
                    type: 'boolean',
                    description: 'Sets whether the multi select is searchable.',
                    defaultValue: 'false'
                },
                {
                    name: 'isСlearable',
                    type: 'boolean',
                    description: 'Sets whether the select is clearable.',
                    defaultValue: 'false'
                },
                {
                    name: 'optionFormatter',
                    type: '(result:T, query?:string) => string',
                    description: 'A function to format a given result and query (if searchable) into a string to be displayed. ' +
                                 'HTML markup is supported.'
                },
                {
                    name: 'optionTemplate',
                    type: 'TemplateRef<IOptionContext>',
                    description: 'Sets the template to use when displaying an option.'
                },
                {
                    name: 'ngModel',
                    type: 'T',
                    description: 'Bind the selected option to the value of the provided variable.'
                },
                {
                    name: 'icon',
                    type: 'string',
                    description: 'Sets the icon used in the select.',
                    defaultValue: 'dropdown'
                },
                {
                    name: 'transition',
                    type: 'string',
                    description: 'Sets the transition used when displaying the filtered options.',
                    defaultValue: 'slide down'
                },
                {
                    name: 'transitionDuration',
                    type: 'number',
                    description: 'Sets the duration for the filtered options transition.',
                    defaultValue: '200'
                },
                {
                    name: 'localeOverrides',
                    type: 'RecursivePartial<ISearchLocaleValues>',
                    description: 'Overrides the values from the localization service.'
                }
            ],
            events: [
                {
                    name: 'selectedOptionChange',
                    type: 'T',
                    description: 'Fires whenever the selected option is changed. The selected option is passed as <code>$event</code>.'
                },
                {
                    name: 'ngModelChange',
                    type: 'T',
                    description: 'Fires whenever the selected option is changed. <code>[(ngModel)]</code> syntax is supported.'
                }
            ]
        },
        {
            selector: '<fui-multi-select>',
            properties: [
                {
                    name: 'placeholder',
                    type: 'string',
                    description: 'Sets the placeholder string on the search box.',
                    defaultValue: 'Select...'
                },
                {
                    name: 'options',
                    type: 'T[]',
                    description: 'Sets the options available to the multi select component. ' +
                                 'Cannot be used in conjunction with <code>optionsLookup</code>.'
                },
                {
                    name: 'optionsFilter',
                    type: '(options:T[], query:string) => T[] | false',
                    description: 'A function to filter the provided options with a custom function. ' +
                                 'Return <code>false</code> to keep the current options. ' +
                                 'Cannot be used in conjunction with <code>optionsLookup</code>.'
                },
                {
                    name: 'optionsLookup',
                    type: '(query:string, initial?:U) => Promise<T[]>',
                    description: 'A function to asynchronously transform the provided query string into the array of options. ' +
                                 'Must return a <code>Promise</code>. ' +
                                 'This must be defined as an arrow function in your class.'
                },
                {
                    name: 'labelField',
                    type: 'string',
                    description: 'Sets the property name that is used as a label for each option. ' +
                                 'Supports dot notation for nested properties.'
                },
                {
                    name: 'valueField',
                    type: 'string',
                    description: 'Sets the property name that is used to bind to ngModel. Leaving this ' +
                                 'blank uses the entire object. Supports dot notation for nested properties.'
                },
                {
                    name: 'isDisabled',
                    type: 'boolean',
                    description: 'Sets whether or not the multi select is disabled',
                    defaultValue: 'false'
                },
                {
                    name: 'isSearchable',
                    type: 'boolean',
                    description: 'Sets whether the multi select is searchable.',
                    defaultValue: 'false'
                },
                {
                    name: 'hasLabels',
                    type: 'boolean',
                    description: 'Sets whether the multi select uses labels.',
                    defaultValue: 'true'
                },
                {
                    name: 'showCountText',
                    type: 'string',
                    description: 'Display text when no value is selected. ' +
                                 'Eg:- If we pass a value \'Select\', it will display Select selections instead of ' +
                                 '0 selections'
                },
                {
                    name: 'maxSelected',
                    type: 'number',
                    description: 'Sets the maximum number of values that can be selected at any one time.'
                },
                {
                    name: 'optionFormatter',
                    type: '(result:T, query?:string) => string',
                    description: 'A function to format a given result and query (if searchable) into a string to be displayed. ' +
                                 'HTML markup is supported.'
                },
                {
                    name: 'optionTemplate',
                    type: 'TemplateRef<IOptionContext>',
                    description: 'Sets the template to use when displaying an option.'
                },
                {
                    name: 'ngModel',
                    type: 'T[]',
                    description: 'Bind the selected options to the value of the provided variable.'
                },
                {
                    name: 'icon',
                    type: 'string',
                    description: 'Sets the icon used in the multi select.',
                    defaultValue: 'dropdown'
                },
                {
                    name: 'transition',
                    type: 'string',
                    description: 'Sets the transition used when displaying the filtered options.',
                    defaultValue: 'slide down'
                },
                {
                    name: 'transitionDuration',
                    type: 'number',
                    description: 'Sets the duration for the filtered options transition.',
                    defaultValue: '200'
                },
                {
                    name: 'localeOverrides',
                    type: 'Partial<ISearchLocaleValues>',
                    description: 'Overrides the values from the localization service.'
                }
            ],
            events: [
                {
                    name: 'selectedOptionsChange',
                    type: 'T[]',
                    description: 'Fires whenever the selected options are changed. The selected options are passed as <code>$event</code>.'
                },
                {
                    name: 'ngModelChange',
                    type: 'T[]',
                    description: 'Fires whenever the selected options are changed. <code>[(ngModel)]</code> syntax is supported.'
                }
            ]
        },
        {
            selector: '<fui-select-option>',
            properties: [
                {
                    name: 'value',
                    type: 'T',
                    description: 'Sets the value of the option.',
                    required: true
                }
            ]
        },
        {
            selector: '[fuiSelectSearch]'
        }
    ];
    public exampleStandardTemplate: string = exampleStandardTemplate;
    public exampleVariationsTemplate: string = exampleVariationsTemplate;
    public exampleClearableTemplate: string = exampleClearableTemplate;
    public exampleInMenuSearchTemplate: string = exampleInMenuSearchTemplate;
    public exampleTemplateTemplate: string = exampleTemplateTemplate;
    public formatterCode = `
public formatter(option:IOption, query?:string):string {
    return \`name: "\${option.name}"\`;
}
`;
    public exampleSearchLookupTemplate: string = exampleSearchLookupTemplate;
    public searchLookupCode = `
type LookupFn<T, U> = (query:string, initial?:U) => Promise<T> | Promise<T[]>

// Example option interface:
interface IOption {
    id:number; // valueField is 'id' so \`U\` is \`number\`
    name:string
}

// Lookup function structure:
let lookupFn:LookupFn<IOption, number> = (query, initial?) => {
    if (initial != undefined) {
        // Return a promise that resolves with the specified initial item.
    }
    // Return a promise that resolves with a list of query results.
}
`;

}

interface IOption {
    id?: number;
    name: string;
}

const options = ['Example', 'Test', 'What', 'No', 'Benefit', 'Oranges', 'Artemis', 'Another', 'Apples', 'Foo', 'Bar'];
const namedOptions: IOption[] = options.map(name => ({ name }));
const idOptions: IOption[] = namedOptions.map(({ name }, id) => ({ name, id }));

@Component({
    selector: 'example-select-standard',
    template: exampleStandardTemplate,
    standalone: false
})
export class SelectExampleStandard {
    public options: IOption[] = namedOptions;
    public selectedOption: IOption;
    public selectedOptions: IOption[];

    public searchable = false;
    public disabled = false;
    public hideLabels = false;
}

@Component({
    selector: 'example-select-variations',
    template: exampleVariationsTemplate,
    standalone: false
})
export class SelectExampleVariations {
    public selectedRange = 'today';
    public filters: string[] = ['Important', 'Announcement', 'Discussion'];
}

@Component({
    selector: 'example-clearable-select',
    template: exampleClearableTemplate,
    standalone: false
})
export class SelectClearableExample {
    public selectedOption: string;
    public filters: string[] = ['Important', 'Announcement', 'Discussion'];
}

@Component({
    selector: 'example-select-in-menu-search',
    template: exampleInMenuSearchTemplate,
    standalone: false
})
export class SelectExampleInMenuSearch {
    public options: IOption[] = namedOptions;
    public selected: IOption[] = [namedOptions[0], namedOptions[5]];
}

@Component({
    selector: 'example-select-template',
    template: exampleTemplateTemplate,
    standalone: false
})
export class SelectExampleTemplate {
    public options: IOption[] = namedOptions;
    public selectedOption: IOption = this.options[5];

    public formatter(option: IOption, query?: string): string {
        return `name: '${option.name}'`;
    }
}

@Component({
    selector: 'example-select-search-lookup',
    template: exampleSearchLookupTemplate,
    standalone: false
})
export class SelectExampleLookupSearch {
    private options: IOption[] = idOptions;
    public selectedOption: number = this.options[3].id;

    public optionsLookup = async (query: string, initial: number) => {
        if (initial !== undefined) {
            return new Promise<IOption>(resolve =>
                setTimeout(() => resolve(this.options.find(item => item.id === initial)), 500));
        }

        let regex: RegExp | string;
        try {
            regex = new RegExp(query, 'i');
        } catch (e) {
            regex = query;
        }
        return new Promise<IOption[]>(resolve =>
            setTimeout(() => resolve(this.options.filter(item => item.name.match(regex))), 500));
    }
}

export const SelectPageComponents = [
    SelectPage,

    SelectExampleStandard,
    SelectExampleVariations,
    SelectClearableExample,
    SelectExampleInMenuSearch,
    SelectExampleTemplate,
    SelectExampleLookupSearch
];
