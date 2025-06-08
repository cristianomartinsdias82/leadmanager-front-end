import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialFileInputModule } from "ngx-material-file-input";

import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from "@angular/material/select";

import { ActivityIndicatorComponent } from "./ui/widgets/activity-indicator/activity-indicator.component";
import { NotificationPanelComponent } from "./ui/widgets/notification-panel/notification-panel.component";
import { CustomPromptComponent } from "./ui/widgets/prompt-dialog/custom-prompt-dialog/custom-prompt.component";
import { YesNoPromptComponent } from "./ui/widgets/prompt-dialog/yes-no-prompt-dialog/yes-no-prompt.component";
import { NavigationBarComponent } from "./ui/widgets/navigation-bar/navigation-bar.component";
import { DataExportComponent } from "./ui/widgets/data-export/data-export.component";

@NgModule({
  declarations: [
    ActivityIndicatorComponent,
    CustomPromptComponent,
    NotificationPanelComponent,
    YesNoPromptComponent,
    NavigationBarComponent,
    DataExportComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MaterialFileInputModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    ActivityIndicatorComponent,
    NavigationBarComponent,
    DataExportComponent
  ],
})
export class SharedModule {}
