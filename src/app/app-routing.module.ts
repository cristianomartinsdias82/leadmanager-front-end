import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./views/components/not-found/not-found.component";
import { AutoLoginPartialRoutesGuard } from "angular-auth-oidc-client";
import { AuthCallbackComponent } from "./core/security/authentication/components/auth-callback/auth-callback.component";
import { UserLoggedOutComponent } from "./views/components/user-logged-out/user-logged-out.component";
import { AdminRoleMembersOnlyGuard } from "./admin/core/security/admin-role-members-only.guard";
import { AccessDeniedComponent } from "./views/components/access-denied/access-denied.component";

//https://angular.io/guide/lazy-loading-ngmodules
//Regarding CanLoad, please refer to one of your threads inside ChatGPT ("Condition Lazy Load") for further details
//https://github.com/damienbod/angular-auth-oidc-client
//https://angular-auth-oidc-client.com/docs/documentation/auto-login
const routes: Routes = [
  { path: "", redirectTo: 'leads', pathMatch: "full" },
  {
    path: "leads",
    canLoad: [AutoLoginPartialRoutesGuard],
    canActivate: [AutoLoginPartialRoutesGuard],
    loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule)
  },
  {
    path: "admin",
    canLoad: [AutoLoginPartialRoutesGuard, AdminRoleMembersOnlyGuard],
    canActivate: [AutoLoginPartialRoutesGuard],
    loadChildren: () => import('./admin/core/module/admin.module').then(m => m.AdminModule)
  },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'user-logged-out', component: UserLoggedOutComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: "**", redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
