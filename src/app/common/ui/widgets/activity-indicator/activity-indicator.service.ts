import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndicatorService {

  public activityIndicatorSub$ = new BehaviorSubject<boolean>(false);

  display() {
    this.activityIndicatorSub$.next(true);
  }

  hide() {
    this.activityIndicatorSub$.next(false);
  }
}