import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap } from "rxjs";
import { PromptService } from "src/app/shared/ui/widgets/prompt-dialog/prompt.service";

@Injectable({ providedIn: "root" })
export class ReportingService {

  constructor(private httpClient: HttpClient, private promptService: PromptService) {}

  private static Endpoint = "reporting";

  downloadReportFile(id: number) {
    this.httpClient
      .get(
        `${environment.apiUrl}/${ReportingService.Endpoint}/${id}/download`,
        { observe: "response", responseType: "blob" }
      )
      .pipe(
        tap((response: HttpResponse<Blob>) => {
          const link = document.createElement("a") as HTMLAnchorElement;
          link.download = response.headers
            .get("Content-Disposition")
            ?.split(";")[1]
            .split("=")[1]!;
          link.href = window.URL.createObjectURL(response.body!);
          link.click();
        })
      )
      .subscribe();
  }

  removeReportFile(id: number, onRemoveReport?: (id: number) => void) {
    this.promptService.openYesNoDialog(
      "Deseja realmente excluir o arquivo informado?",
      () => {
        this.httpClient
                .delete(`${environment.apiUrl}/${ReportingService.Endpoint}/${id}`)
                .subscribe({
                    next: () => {
                        if (onRemoveReport)
                            onRemoveReport(id);
                    }
                });
      },
      () => {},
      "Confirmação"
    );
  }
}
