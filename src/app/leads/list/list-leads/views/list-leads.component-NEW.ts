// import {  Component, OnDestroy, OnInit } from "@angular/core";
// import { LeadsService } from "src/app/leads/shared/services/leads.service";
// import { NotificationStickerService } from "src/app/shared/ui/widgets/notification-sticker/notification-sticker.service";
// import { Lead } from "src/app/leads/shared/models/lead";
// import { Subscription } from "rxjs";
// import { ListLeadsDataSourceNEW } from "./list-leads.datasource-NEW";
// import { ListSortDirection } from "src/app/shared/core/pagination/list-sort-direction";
// import { Sort } from "@angular/material/sort";

// @Component({
//   selector: "ldm-list-leads",
//   templateUrl: "./list-leads.component-NEW.html",
//   styleUrls: ["./list-leads.component.scss"]
// })
// export class ListLeadsComponentNEW implements OnInit, OnDestroy {
//   constructor(
//     public leadsService: LeadsService,
//     private notificationStickerService: NotificationStickerService
//   ) {}

//   displayedColumns = ["cnpj", "razaoSocial", "cep", "estado", "acoes"];
//   pageSizeOptions = [5, 10, 20, 30, 50];
//   sort: Sort = {
//     active: 'name',
//     direction: 'asc'
//   }
//   onLeadRemoveSuccessfulSubsc!: Subscription;
//   listLeadsDataSource = new ListLeadsDataSourceNEW(
//     this.leadsService,
//     this.displayedColumns[1],
//     ListSortDirection.Ascending,
//     1,
//     this.pageSizeOptions[0]
//   );

//   ngOnInit() {

//     this.onLeadRemoveSuccessfulSubsc = this.leadsService
//           .onLeadRemoveSuccessful$
//           .subscribe({ next: () => {
//               this.notificationStickerService.show("Lead removido com sucesso.");
//               setTimeout(() => this.reloadView(), 1000);
//             }
//           });
//   }

//   onRefreshListClick() {
//     this.reloadView();
//   }

//   onDeleteItemClick(lead: Lead) {
//     this.leadsService.removeLead(lead);
//   }

//   reloadView() {
//     window.location.reload();
//   }

//   get containsLeadData$() {
//     return this.leadsService.onLeadDataRetrieve$;
//   }

//   ngOnDestroy(): void {
//     this.onLeadRemoveSuccessfulSubsc.unsubscribe();
//   }
// }