import { Component, Input } from "@angular/core";
import { DataItem } from "../../../../common/data-item";

@Component({
  selector: 'ldm-stacked-data-panel-container',
  templateUrl: './stacked-data-panel-container.component.html',
  styleUrls: ['./stacked-data-panel-container.component.scss']
})
export class StackedDataPanelContainerComponent {
  @Input() title: string = '';
  @Input() dataItems: DataItem[] = [];
}