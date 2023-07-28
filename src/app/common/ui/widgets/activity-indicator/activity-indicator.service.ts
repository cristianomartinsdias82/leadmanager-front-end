import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndicatorService {

  private activityIndicatorSubject = new BehaviorSubject<boolean>(true);
  public activityIndicatorSub$ = this.activityIndicatorSubject.asObservable();

  private showProgressPercentageSubject = new BehaviorSubject<boolean>(false);
  public showProgressPercentage$ = this.showProgressPercentageSubject.asObservable();

  private progressPercentageSubject = new BehaviorSubject<number>(0.0);
  public progressPercentage$ = this.progressPercentageSubject.asObservable();

  show(displayProgressPercentage = false) {
    this.activityIndicatorSubject.next(true);

    if (displayProgressPercentage) {
      this.showProgressPercentageSubject.next(true);
    }
  }

  hide(hideProgressPercentage = false) {
    this.activityIndicatorSubject.next(false);

    if (hideProgressPercentage) {
      this.showProgressPercentageSubject.next(false);
    }
  }

  updateProgressPercentage(percentage: number) {
    this.progressPercentageSubject.next(percentage);
  }

}