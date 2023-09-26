import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestHandlerInterceptor } from "./request-handler.interceptor";

export const RequestHandlerInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestHandlerInterceptor,
    multi: true,
  };