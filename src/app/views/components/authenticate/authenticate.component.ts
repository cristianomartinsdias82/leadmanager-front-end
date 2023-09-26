import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "ldm-authenticate",
  templateUrl: "authenticate.component.html",
  styleUrls: ["authenticate.component.scss"],
})
export class AuthenticateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => this.router.navigate(['/leads']), 1);
  }
}
