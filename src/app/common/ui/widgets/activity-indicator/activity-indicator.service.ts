import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndicatorService {

  public activityIndicatorSub$ = new BehaviorSubject<boolean>(true);
  //Refactor this subject to be private
  /*HINTS:
  1 - Change variable activityIndicatorSub$ name to activityIndicatorSub and make ir private!
  2 - Declare public activityIndicator$ = this.activityIndicatorSub.asObservable();
  3 - In all components that make use of it, declare a get property pointing to this public variable and append to its name a $,
  just like app.component.html
  */
  
  display(displayProgressPercentage = false) {
    this.activityIndicatorSub$.next(true);

    if (displayProgressPercentage) {
      this.showProgressPercentageSubject.next(true);
    }
  }

  hide(hideProgressPercentage = false) {
    this.activityIndicatorSub$.next(false);

    if (hideProgressPercentage) {
      this.showProgressPercentageSubject.next(false);
    }
  }

  private showProgressPercentageSubject = new BehaviorSubject<boolean>(false);
  public showProgressPercentage$ = this.showProgressPercentageSubject.asObservable();

  private progressPercentageSubject = new BehaviorSubject<number>(0.0);
  public progressPercentage$ = this.progressPercentageSubject.asObservable();

  updateProgressPercentage(percentage: number) {
    this.progressPercentageSubject.next(percentage);
  }

}