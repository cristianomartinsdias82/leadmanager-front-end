import { Sort } from '@angular/material/sort';
import { UploadedLeadsFilesService } from './../services/uploaded-leads-files.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListSortDirection } from 'src/app/shared/core/pagination/list-sort-direction';
import { UploadedLeadsFilesDataSource } from '../data-source/uploaded-leads-files.datasource';
import { Subscription } from 'rxjs';
import { NotificationStickerService } from 'src/app/shared/ui/widgets/notification-sticker/notification-sticker.service';
import { UploadedFileInfo } from '../models/uploaded-file-info';

@Component({
  selector: 'ldm-file-uploads-list',
  templateUrl: './file-uploads-list.component.html',
  styleUrls: ['./file-uploads-list.component.scss']
})
export class FileUploadsListComponent implements OnInit, OnDestroy {
  
  constructor(
    private uploadedLeadsFilesService: UploadedLeadsFilesService,
    private notificationStickerService: NotificationStickerService) {}

  displayedColumns = ["createdAt", "fileName", "pathOrContainerName", "userId","id"];
  pageSizeOptions = [5, 10, 20, 30, 50];
  sort: Sort = {
    active: 'name',
    direction: 'asc'
  }
  dataSource = new UploadedLeadsFilesDataSource(
    this.uploadedLeadsFilesService,
    this.displayedColumns[2],
    ListSortDirection.Ascending,
    1,
    this.pageSizeOptions[1]
  );
  onRemoveSuccessfulSubsc!: Subscription;

  ngOnInit() {

    this.onRemoveSuccessfulSubsc = this.uploadedLeadsFilesService
          .onLeadsFileRemoveSuccessful$
          .subscribe({ next: () => {
              this.notificationStickerService.show('Arquivo(s) excluído(s) com sucesso!');
              setTimeout(() => this.reloadView(), 700);
            }
          });
  }

  ngOnDestroy() {
    this.onRemoveSuccessfulSubsc.unsubscribe();
  }

  onRefreshListClick() {
    this.reloadView();
  }

  onDownloadClick(id: string) {
    this.uploadedLeadsFilesService.downloadFile(id);
  }

  onRemoveClick(file: UploadedFileInfo) {
    this.uploadedLeadsFilesService.removeFile(file);
  }

  reloadView() {
    window.location.reload();
  }

  get containsData$() {
    return this.uploadedLeadsFilesService
                .onUploadedFilesDataRetrieve$;
  }

}
