import { Component } from '@angular/core';
import { ActivityIndicatorService } from './activity-indicator.service';

@Component({
  selector: 'ldm-activity-indicator',
  templateUrl: './activity-indicator.component.html',
  styleUrls: ['./activity-indicator.component.scss']
})
export class ActivityIndicatorComponent {

  constructor (public activityIndicatorService: ActivityIndicatorService) {}

  public get report$() {
    return this.activityIndicatorService.report$;
  }

}