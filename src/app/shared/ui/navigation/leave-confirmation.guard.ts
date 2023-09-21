import { CanDeactivateFn } from '@angular/router';
import { OnLeave } from './on-leave';

export const LeaveConfirmationGuard: CanDeactivateFn<OnLeave> = (component, currentRoute, currentState, nextState) => {
  return component.onLeave(currentRoute, currentState, nextState);
};