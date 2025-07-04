import { Component } from '@angular/core';
import { ApiDefinition } from '../../../components/api/api.component';

const exampleStandardTemplate = `
<div class="ui top attached demo menu">
    <a class="item" (click)="sidebar.toggle()">
        <i class="sidebar icon"></i> Menu
    </a>
</div>
<fui-sidebar-container class="ui bottom attached segment">
    <fui-sidebar class="inverted vertical" #sidebar>
        <a class="item">1</a>
        <a class="item">2</a>
    </fui-sidebar>
    <fui-sidebar-sibling [isDimmedWhenVisible]="true">
        <div class="ui basic segment">
            <h3 class="ui header">Content</h3>
            <p>Example content beside the sidebar</p>
            <button class="ui button" (click)="sidebar.open()">Open Sidebar</button>
        </div>
    </fui-sidebar-sibling>
</fui-sidebar-container>
`;

const exampleDirectionTemplate = `
<div class="ui top attached demo menu">
    <a class="item" (click)="sidebar.toggle()">
        <i class="sidebar icon"></i> Menu
    </a>
</div>
<fui-sidebar-container class="ui bottom attached segment">
    <fui-sidebar class="inverted" direction="bottom" [(isVisible)]="isVisible" #sidebar>
        <a class="item">1</a>
        <a class="item">2</a>
    </fui-sidebar>
    <fui-sidebar-sibling>
        <div class="ui basic segment">
            <h3 class="ui header">Content</h3>
            <p>Sidebar visibility: {{ isVisible }}</p>
            <button class="ui button" (click)="sidebar.open()">Open Sidebar</button>
        </div>
    </fui-sidebar-sibling>
</fui-sidebar-container>
`;

@Component({
    selector: 'demo-page-sidebar',
    templateUrl: './sidebar.page.html',
    standalone: false
})
export class SidebarPage {
    public api: ApiDefinition = [
        {
            selector: '<fui-sidebar-container>'
        },
        {
            selector: '<fui-sidebar>',
            properties: [
                {
                    name: 'isVisible',
                    type: 'boolean',
                    description: 'Sets whether or not the sidebar is displayed.',
                    defaultValue: 'false'
                },
                {
                    name: 'direction',
                    type: 'SidebarDirection',
                    description: 'Sets the direction of the sidebar relative to the <code>fui-sidebar-sibling</code> contents.',
                    defaultValue: 'left'
                },
                {
                    name: 'transition',
                    type: 'SidebarTransition',
                    description: 'Sets the transition used when displaying the sidebar. Options are ' +
                                 '<code>overlay</code>, <code>uncover</code>, <code>scale down</code>, ' +
                                 '<code>push</code>, <code>slide along</code> & <code>slide out</code>.',
                    defaultValue: 'uncover'
                }
            ],
            events: [
                {
                    name: 'isVisibleChange',
                    type: 'boolean',
                    description: 'Fires when the sidebar\'s visible state is changed. Supports <code>[(isVisible)]</code> syntax.'
                }
            ]
        },
        {
            selector: '<fui-sidebar-sibling>',
            properties: [
                {
                    name: 'canCloseSidebar',
                    type: 'boolean',
                    description: 'Sets whether the click on page content can close the sidebar.',
                    defaultValue: 'true'
                },
                {
                    name: 'isDimmedWhenVisible',
                    type: 'boolean',
                    description: 'Sets whether the page content beside the sidebar is dimmed when the sidebar is visible.',
                    defaultValue: 'false'
                }
            ]
        }
    ];
    public exampleStandardTemplate: string = exampleStandardTemplate;
    public exampleDirectionTemplate: string = exampleDirectionTemplate;
}

@Component({
    selector: 'example-sidebar-standard',
    template: exampleStandardTemplate,
    standalone: false
})
export class SidebarExampleStandard {}

@Component({
    selector: 'example-sidebar-direction',
    template: exampleDirectionTemplate,
    standalone: false
})
export class SidebarExampleDirection {
    public isVisible = false;
}

export const SidebarPageComponents = [SidebarPage, SidebarExampleStandard, SidebarExampleDirection];
