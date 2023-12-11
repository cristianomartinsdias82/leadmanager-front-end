import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { ListLeadsDataSource } from "./list-leads.datasource";
import { LeadsService } from "src/app/leads/shared/services/leads.service";
import { NotificationStickerService } from "src/app/shared/ui/widgets/notification-sticker/notification-sticker.service";
import { Lead } from "src/app/leads/shared/models/lead";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";
import { Subscription } from "rxjs";

@Component({
  selector: "ldm-list-leads",
  templateUrl: "./list-leads.component.html",
  styleUrls: ["./list-leads.component.scss"],
})
export class ListLeadsComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private leadsService: LeadsService,
    private promptService: PromptService,
    private notificationStickerService: NotificationStickerService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;

  displayedColumns = ["cnpj", "razaoSocial", "cep", "estado", "acoes"];
  listLeadsDataSource: ListLeadsDataSource = null!;
  onLeadRemoveSuccessfulSubsc!: Subscription;

  ngOnInit() {
    
    this.onLeadRemoveSuccessfulSubsc = this.leadsService
          .onLeadRemoveSuccessful$
          .subscribe({ next: () => {
              this.notificationStickerService.show("Lead removido com sucesso.");  
              setTimeout(() => this.reloadView(), 700);
            }
          });
  }

  ngOnDestroy(): void {
    this.onLeadRemoveSuccessfulSubsc.unsubscribe();
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

  reloadView() {
    window.location.reload();
  }
}
