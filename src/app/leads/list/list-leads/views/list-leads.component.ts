import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { ListLeadsDataSource } from "./list-leads.datasource";
import { LeadsService } from "src/app/leads/shared/services/leads.service";
import { NotificationStickerService } from "src/app/shared/ui/widgets/notification-sticker/notification-sticker.service";
import { Lead } from "src/app/leads/shared/models/lead";
import { Subscription } from "rxjs";
import { DownloadFormat } from "src/app/shared/data-access/download-format";

@Component({
  selector: "ldm-list-leads",
  templateUrl: "./list-leads.component.html",
  styleUrls: ["./list-leads.component.scss"]
})
export class ListLeadsComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private leadsService: LeadsService,
    private notificationStickerService: NotificationStickerService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;

  displayedColumns = ["cnpj", "razaoSocial", "cep", "estado", "acoes"];
  listLeadsDataSource: ListLeadsDataSource = null!;
  onLeadRemoveSuccessfulSubsc!: Subscription;

  availableExportFormats: DownloadFormat[] = ['pdf' as DownloadFormat];

  ngOnInit() {

    this.onLeadRemoveSuccessfulSubsc = this.leadsService
          .onLeadRemoveSuccessful$
          .subscribe({ next: () => {
              this.notificationStickerService.show("Lead removido com sucesso.");
              setTimeout(() => this.reloadView(), 700);
            }
          });
  }

  ngAfterViewInit() {
    this.listLeadsDataSource = new ListLeadsDataSource(
      this.leadsService,
      this.table,
      this.paginator,
      this.sort,
      "razaoSocial"
    );
  }

  onRefreshListClick() {
    this.reloadView();
  }

  onDeleteItemClick(lead: Lead) {
    this.leadsService.removeLead(lead);
  }

  onRequestDataExportClick(format: DownloadFormat) {
    this.leadsService.downloadLeadsList(
      format,
      {
        term: this.leadsService.leadSearchSubscription.getValue()
      });
  }

  reloadView() {
    window.location.reload();
  }

  get containsLeadData$() {
    return this.leadsService.onLeadDataRetrieve$;
  }

  ngOnDestroy(): void {
    this.onLeadRemoveSuccessfulSubsc.unsubscribe();
  }
}
