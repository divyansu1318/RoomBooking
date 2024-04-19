import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CommonService } from '../Services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class HttpAPIInterceptor implements HttpInterceptor {

  constructor(private commonService: CommonService, private _snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.commonService.isShowLoader = true;
    const token: any = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        headers: request.headers.set(
            "Authorization",
            token  
        )
        });
    }

    return next.handle(request).pipe(
      
      // catchError((err: any)  => {
      //   if (err instanceof HttpErrorResponse) {
      //       if (err.status === 401) {
      //           console.log('this should print your error!', err.error);
      //       }
      //   }
      // }),
      catchError((error: HttpErrorResponse) => {
        
        this.commonService.isShowLoader = false;
        if (error?.error?.message) {
          this._snackBar.open(error.error.message, 'Close', {
            duration: 3000
          })
        }
        return throwError(error);
    }),
      map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
      if (evt instanceof HttpResponse) {
        this.commonService.isShowLoader = false;
        if (evt.body.message) {
          this._snackBar.open(evt.body.message, 'Close', {
            duration: 3000
          })
        }
        // this._loading.setLoading(false, request.url);
      }
      return evt;
    })
    );
  }

  throwError(error: any) {
    console.error(error);
  }
}
