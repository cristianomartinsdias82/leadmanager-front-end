import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime, filter, fromEvent, map } from 'rxjs';
import { LeadsService } from 'src/app/leads/shared/services/leads.service';

@Component({
  selector: 'ldm-lead-search',
  templateUrl: './lead-search.component.html'
})
export class LeadSearchComponent implements OnInit {

  @ViewChild('searchInput', {static: true}) searchInput!: ElementRef<HTMLInputElement>;
  @Output() search = new EventEmitter<string>();

  constructor(private leadsService: LeadsService) {}

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(800),
        map(_ => this.searchInput.nativeElement.value.trim()),
        filter(value => value.length === 0 || value.length >= 3)
      ).subscribe({
        next: value => {
          this.leadsService.setLeadSearch(value);
          this.search.emit(value);          
        }
      });
  }
}
