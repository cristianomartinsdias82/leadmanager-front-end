import { UsersActionsService } from './../../services/users-actions.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Query,
  ViewChild
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";

@Component({
  selector: 'ldm-users-actions-search',
  templateUrl: './users-actions-search.component.html',
  styleUrls: ['./users-actions-search.component.scss']
})
export class UsersActionsSearchComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private usersActionsService: UsersActionsService) {}

  @ViewChild("term", {static: true}) termFieldRef!: ElementRef;
  @Output() search = new EventEmitter<Query>();

  usersActionsForm!: FormGroup;

  ngOnInit() {
    this.configForm();

    this.termFieldRef.nativeElement.focus();
  }

  configForm() {
    this.usersActionsForm = this.formBuilder.group({      
      term: ["", [Validators.maxLength(50)]],
      user: [""],
      startDate: [""],
      endDate: [""]
    });    
  }

  onSubmit() {
    this.search.emit(this.usersActionsForm.value);

    this.usersActionsService.onSearch(this.usersActionsForm.value);
  }
}