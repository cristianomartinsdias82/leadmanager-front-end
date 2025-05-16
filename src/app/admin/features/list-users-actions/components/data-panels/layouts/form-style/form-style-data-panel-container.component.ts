import { Component, Input } from "@angular/core";
import { SerializedLeadData } from "../../../../models/serialized-lead-data";

@Component({
  selector: 'ldm-form-style-data-panel-container',
  templateUrl: './form-style-data-panel-container.component.html',
  styleUrls: ['./form-style-data-panel-container.component.scss']
})
export class FormStyleDataPanelContainerComponent {
  @Input() title?: string;
  @Input() leadData!: SerializedLeadData;
  @Input() displayBottomDivider? = false
}