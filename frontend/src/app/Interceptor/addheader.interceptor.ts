import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticateService } from '../Services/authenticate.service';

export const addheaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticate = inject(AuthenticateService)
  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authenticate.user_key()),
  });
  return next(reqWithHeader);
};
