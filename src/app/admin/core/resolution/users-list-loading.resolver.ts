import { UsersListingService } from './../../features/list-users-actions/services/users-listing.service';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UsersListLoadingResolver {
  constructor(private usersListingService: UsersListingService) {}

  resolve(): void {
    this.usersListingService.load();
  }
}