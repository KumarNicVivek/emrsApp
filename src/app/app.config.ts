import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
              provideZoneChangeDetection({ eventCoalescing: true }),
              provideRouter(routes),
              provideAnimations(),
              provideToastr(
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-center',
                  preventDuplicates: true,
                  progressBar: true,
                  progressAnimation: 'increasing',
                }
              ),
              provideHttpClient(withInterceptors([jwtInterceptor]))
            ]
};
