import { UsersListingService } from './../../services/users-listing.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { UsersActionsSearchParams } from './users-actions-search-params';

@Component({
  selector: 'ldm-users-actions-search',
  templateUrl: './users-actions-search.component.html',
  styleUrls: ['./users-actions-search.component.scss']
})
export class UsersActionsSearchComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private usersListingService: UsersListingService
  ) {}

  @ViewChild("term", {static: true}) termFieldRef!: ElementRef;
  @Output() search = new EventEmitter<UsersActionsSearchParams>();

  usersActionsForm!: FormGroup;

  get usersList() {
    return this.usersListingService.usersList$;
  }

  ngOnInit() {
    this.configForm();

    this.termFieldRef.nativeElement.focus();
  }

  configForm() {
    this.usersActionsForm = this.formBuilder.group({
      term: ["", [Validators.maxLength(50)]],
      userId: [""],
      startDate: [""],
      endDate: [""]
    });
  }

  onSubmit() {
    this.search.emit(this.usersActionsForm.value);
  }
}