import { DownloadFormat } from './../../../data-access/download-format';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface ExportFormatOption {
  text: string,
  value: DownloadFormat,
  icon: string,
  hasOutlinedClass: boolean
}

const exportFormatOptions = [
    { text: 'Pdf', value: 'pdf' as DownloadFormat, icon: 'picture_as_pdf', hasOutlinedClass: false },
    { text: 'Csv', value: 'csv' as DownloadFormat, icon: 'csv', hasOutlinedClass: true },
    { text: 'Parquet', value: 'parquet' as DownloadFormat, icon: 'azm', hasOutlinedClass: true },
    { text: 'All', value: 'all' as DownloadFormat, icon: 'check_box', hasOutlinedClass: false }
  ]

@Component({
  selector: 'ldm-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {

  @Output() dataExportRequest = new EventEmitter<DownloadFormat>();
  @Input() exportFormats?: DownloadFormat[] = ['pdf', 'csv', 'parquet', 'all'];

  availableFormats:ExportFormatOption[] = [];

  ngOnInit() {
    this.exportFormats?.forEach(fmt => {
      this.availableFormats.push(exportFormatOptions.find(it => it.value === fmt)!);
    });
  }

  onClick(format: DownloadFormat) {
    this.dataExportRequest?.emit(format);
  }

}
