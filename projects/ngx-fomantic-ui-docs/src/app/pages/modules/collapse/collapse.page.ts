import { Component } from '@angular/core';
import { ApiDefinition } from '../../../components/api/api.component';

const exampleStandardTemplate = `
<div class="ui segments">
    <div class="ui segment">
        <button class="ui primary button" (click)="collapse = !collapse">
            Toggle Collapse
        </button>
    </div>
    <div class="ui segment">
        <div [fuiCollapse]="collapse">
            <div class="ui segment">
                <h4 class="ui header">Collapsible Panel</h4>
                <p>Content of the panel.</p>
            </div>
        </div>
    </div>
</div>
`;

@Component({
    selector: 'demo-page-collapse',
    templateUrl: './collapse.page.html',
    standalone: false
})
export class CollapsePage {
    public api: ApiDefinition = [
        {
            selector: '[fuiCollapse]',
            properties: [
                {
                    name: 'fuiCollapse',
                    type: 'boolean',
                    description: 'Sets whether or not the element is collapsed.',
                    required: true
                },
                {
                    name: 'collapseDuration',
                    type: 'number',
                    description: 'Sets the duration of the collapse animation.',
                    defaultValue: '350'
                }
            ]
        }
    ];
    public exampleStandardTemplate: string = exampleStandardTemplate;

    public polyfillInclude =
`<script src="https://rawgit.com/web-animations/web-animations-js/master/web-animations.min.js"></script>`;
}

@Component({
    selector: 'example-collapse-standard',
    template: exampleStandardTemplate,
    standalone: false
})
export class CollapseExampleStandard {
    public collapse = false;
}

export const CollapsePageComponents = [CollapsePage, CollapseExampleStandard];
