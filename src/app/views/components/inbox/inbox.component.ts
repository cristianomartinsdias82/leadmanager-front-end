import { Component, OnInit } from '@angular/core';
import { InboxService } from './services/inbox.service';
import { ReportingService } from 'src/app/reporting/services/reporting-service';

@Component({
  selector: 'ldm-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  constructor(
    private inboxService: InboxService,
    private reportingService: ReportingService
  ) {}

  ngOnInit() {
    setTimeout(() => {
    this.inboxService.loadInboxMessages();
    }, 1);
  }

  get reportGenerationMessages() {
    return this.inboxService.reportGenerationMessages$
  }

  dismissRequestReadinessNotification(id: number) {
    this.inboxService.dismissReportReadinessMessage(id);
  }

  downloadRequestedReport(id: number) {
    this.reportingService.downloadReportFile(id);
  }

  //Removes the file and dismisses the request readiness notification
  removeRequestedReport(id: number) {
    this.reportingService.removeReportFile(id, () => this.inboxService.dismissReportReadinessMessage(id));
  }
}
