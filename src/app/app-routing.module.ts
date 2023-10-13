import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { checkAuthenticated } from "./shared/authentication/checkAuthenticated.guard.fn";
import { NotFoundComponent } from "./views/components/not-found/not-found.component";
import { HomeComponent } from "./views/components/home/home.component";

//https://medium.com/ngconf/functional-route-guards-in-angular-8829f0e4ca5c
//https://angular.io/guide/lazy-loading-ngmodules
//Regarding CanLoad, please refer to one of your threads inside ChatGPT ("Condition Lazy Load") for further details
const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  {
    path: "leads",
    canLoad: [checkAuthenticated()],
    canActivate: [checkAuthenticated()],
    loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule)
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: "**", redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
