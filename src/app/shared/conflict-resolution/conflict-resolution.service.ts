import { Injectable } from "@angular/core";
import { ConflictResolutionData } from "./conflict-resolution-data";
import { HttpEvent, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export abstract class ConflictResolutionService<T> {
    abstract resolve(
        data: ConflictResolutionData<T>,
        request: HttpRequest<any>,
        serverMessage?: string) : Observable<HttpEvent<any>>;
}
