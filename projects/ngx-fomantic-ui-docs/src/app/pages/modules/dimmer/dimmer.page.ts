import { Component } from '@angular/core';
import { ApiDefinition } from '../../../components/api/api.component';

const exampleStandardTemplate = `
<div class="ui segment">
    <h4 class="ui header">Example segment</h4>
    <fui-dimmer [(isDimmed)]="isDimmed" [isClickable]="isClickable">
        <h4 class="ui inverted header">I can have content too!</h4>
    </fui-dimmer>
    <p>Some random content for the example segment.</p>
    <p>Some more content!.</p>
</div>
<button class="ui primary button" (click)="isDimmed = !isDimmed">Toggle Dimmer</button>
<fui-checkbox [(ngModel)]="isClickable">Click to close?</fui-checkbox>
`;

const exampleVariationsTemplate = `
<div class="ui segment">
    <fui-dimmer class="page" [(isDimmed)]="pageDimmed">
        <h2 class="ui inverted icon header">
            <i class="heart icon"></i>
            The page has been dimmed!
        </h2>
    </fui-dimmer>
    <fui-dimmer class="inverted" [(isDimmed)]="segmentDimmed">
        <div class="ui text loader" style="display:block;">Enables loading screens!</div>
    </fui-dimmer>
    <p>Page dimmers and inverted dimmers are possible!</p>
    <button class="ui primary button" (click)="pageDimmed = !pageDimmed">Dim Page</button>
    <button class="ui primary button" (click)="segmentDimmed = !segmentDimmed">Dim Segment</button>
</div>
`;

@Component({
    selector: 'demo-page-dimmer',
    templateUrl: './dimmer.page.html',
    standalone: false
})
export class DimmerPage {
    public api: ApiDefinition = [
        {
            selector: '<fui-dimmer>',
            properties: [
                {
                    name: 'isDimmed',
                    type: 'boolean',
                    description: 'Sets whether or not the dimmer is active.',
                    defaultValue: 'false'
                },
                {
                    name: 'isClickable',
                    type: 'boolean',
                    description: 'Sets whether or not clicking the dimmer will dismiss it.',
                    defaultValue: 'true'
                },
                {
                    name: 'transition',
                    type: 'string',
                    description: 'Sets the transition used when displaying the dimmer.',
                    defaultValue: 'fade'
                },
                {
                    name: 'transitionDuration',
                    type: 'number',
                    description: 'Sets the duration for the dimmer transition.',
                    defaultValue: '300'
                }
            ],
            events: [
                {
                    name: 'isDimmedChange',
                    type: 'boolean',
                    description: 'Fires whenever the dimmer is toggled. ' +
                                 'Use the <code>[(isDimmed)]</code> syntax to update when the user clicks out of the dimmer.'
                }
            ]
        }
    ];
    public exampleStandardTemplate: string = exampleStandardTemplate;
    public exampleVariationsTemplate: string = exampleVariationsTemplate;
}

@Component({
    selector: 'example-dimmer-standard',
    template: exampleStandardTemplate,
    standalone: false
})
export class DimmerExampleStandard {
    public isClickable = true;
    public isDimmed: boolean;
}

@Component({
    selector: 'example-dimmer-variations',
    template: exampleVariationsTemplate,
    standalone: false
})
export class DimmerExampleVariations {
    public isClickable = true;
    public pageDimmed: boolean;
    public segmentDimmed: boolean;
}

export const DimmerPageComponents = [DimmerPage, DimmerExampleStandard, DimmerExampleVariations];
