import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndicatorService {

  private activityIndicatorSubject = new BehaviorSubject<boolean>(true);
  public activityIndicator$ = this.activityIndicatorSubject.asObservable();

  private reportSubject = new BehaviorSubject<string>('');
  public report$ = this.reportSubject.asObservable();

  show() {
    this.activityIndicatorSubject.next(true);
  }

  hide() {
    this.activityIndicatorSubject.next(false);
  }
  
  report(data: string) {
    this.reportSubject.next(data);
  }

}