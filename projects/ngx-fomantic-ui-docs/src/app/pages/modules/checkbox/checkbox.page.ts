import { Component } from '@angular/core';
import { ApiDefinition } from '../../../components/api/api.component';

const exampleStandardTemplate = `
<div class="ui form">
    <div class="grouped fields">
        <label>Checkbox Example</label>
        <div class="field">
            <fui-checkbox [(ngModel)]="eCheck" [isDisabled]="eCheckDisabled" [isReadonly]="eCheckReadonly">
                An example checkbox
            </fui-checkbox>
        </div>
        <div class="field">
            <fui-checkbox [(ngModel)]="eCheckDisabled">1st checkbox disabled?</fui-checkbox>
        </div>
        <div class="field">
            <fui-checkbox [(ngModel)]="eCheckReadonly">1st checkbox read-only?</fui-checkbox>
        </div>
        <div class="field">
            <fui-checkbox [(ngModel)]="eCheck">Mirrors value of 1st checkbox</fui-checkbox>
        </div>
    </div>
</div>
`;

const exampleRadioButtonTemplate = `
<div class="ui form">
    <div class="grouped fields">
        <label>Radio Button Example</label>
        <div class="field">
            <fui-radio-button name="example" value="hello" [(ngModel)]="eRadio">Value: "hello"</fui-radio-button>
        </div>
        <div class="field">
            <fui-radio-button name="example" value="world" [(ngModel)]="eRadio">Value: "world"</fui-radio-button>
        </div>
        <div class="field">
            <fui-radio-button name="example" value="example" [(ngModel)]="eRadio">Value: "example"</fui-radio-button>
        </div>
        <div class="field">
            <fui-radio-button name="example" [value]="{ example: 'object' }" [(ngModel)]="eRadio">
                Value: {{ '{' }} example: "object" }
            </fui-radio-button>
        </div>
    </div>
</div>
<p>The currently selected value is {{ eRadio | json }}</p>
`;

const exampleStyledTemplate = `
<div class="ui form">
    <div class="grouped fields">
        <label>Checkbox Style Examples</label>
        <div class="field">
            <fui-checkbox class="slider">Slider checkbox</fui-checkbox>
        </div>
        <div class="field">
            <fui-checkbox class="toggle">Toggle checkbox</fui-checkbox>
        </div>
    </div>
</div>
<div class="ui form">
    <div class="grouped fields">
        <label>Radio Button Style Examples</label>
        <div class="field">
            <fui-radio-button class="slider" name="styled" value="a" [(ngModel)]="eStyledRadio">
                Slider radio button
            </fui-radio-button>
        </div>
        <div class="field">
            <fui-radio-button class="toggle" name="styled" value="b" [(ngModel)]="eStyledRadio">
                Toggle radio button
            </fui-radio-button>
        </div>
    </div>
</div>
`;

@Component({
    selector: 'demo-page-checkbox',
    templateUrl: './checkbox.page.html',
    standalone: false
})
export class CheckboxPage {
    public api: ApiDefinition = [
        {
            selector: '<fui-checkbox>',
            properties: [
                {
                    name: 'name',
                    type: 'string',
                    description: 'Sets the name on the internal <code>&lt;input&gt;</code> element.'
                },
                {
                    name: 'ngModel',
                    type: 'boolean',
                    description: 'Bind the checkbox value to the value of the provided variable.'
                },
                {
                    name: 'isDisabled',
                    type: 'boolean',
                    description: 'Sets whether or not the checkbox is disabled (UI only).',
                    defaultValue: 'false'
                },
                {
                    name: 'isReadonly',
                    type: 'boolean',
                    description: 'Sets whether or not the checkbox is read-only (UI only).',
                    defaultValue: 'false'
                }
            ],
            events: [
                {
                    name: 'ngModelChange',
                    type: 'boolean',
                    description: 'Fires whenever the checkbox check is changed. <code>[(ngModel)]</code> syntax is supported.'
                },
                {
                    name: 'checkChange',
                    type: 'boolean',
                    description: 'Fires whenever the checkbox check is changed.'
                }
            ]
        },
        {
            selector: '<fui-radio-button>',
            properties: [
                {
                    name: 'name',
                    type: 'string',
                    description: 'Sets the name on the internal <code>&lt;input&gt;</code> component.',
                    required: true
                },
                {
                    name: 'value',
                    type: 'T',
                    description: 'Sets the value that selecting this radio button returns. Supports binding any object.',
                    required: true
                },
                {
                    name: 'ngModel',
                    type: 'T',
                    description: 'Bind the radio button value to the value of the provided variable.'
                },
                {
                    name: 'isDisabled',
                    type: 'boolean',
                    description: ' Sets whether or not the radio button is disabled (UI only).',
                    defaultValue: 'false'
                },
                {
                    name: 'isReadonly',
                    type: 'boolean',
                    description: 'Sets whether or not the radio button is read-only (UI only).',
                    defaultValue: 'false'
                }
            ],
            events: [
                {
                    name: 'ngModelChange',
                    type: 'T',
                    description: 'Fires whenever the radio button check is changed. <code>[(ngModel)]</code> syntax is supported.'
                },
                {
                    name: 'currentValueChange',
                    type: 'T',
                    description: 'Fires whenever the radio button check is changed.'
                }
            ]
        }
    ];
    public exampleStandardTemplate: string = exampleStandardTemplate;
    public exampleRadioButtonTemplate: string = exampleRadioButtonTemplate;
    public exampleStyledTemplate: string = exampleStyledTemplate;
}

@Component({
    selector: 'example-checkbox-standard',
    template: exampleStandardTemplate,
    standalone: false
})
export class CheckboxExampleStandard {
    public eCheck = true;
    public eCheckReadonly: boolean;
    public eCheckDisabled: boolean;
}

@Component({
    selector: 'example-checkbox-radio-button',
    template: exampleRadioButtonTemplate,
    standalone: false
})
export class CheckboxExampleRadioButton {
    public eRadio: any = 'world';
}

@Component({
    selector: 'example-checkbox-styled',
    template: exampleStyledTemplate,
    standalone: false
})
export class CheckboxExampleStyled {
    public eStyledRadio: any;
}

export const CheckboxPageComponents = [CheckboxPage, CheckboxExampleStandard, CheckboxExampleRadioButton, CheckboxExampleStyled];
