import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  ArrowRight, Briefcase, Car, Check, ChevronLeft, ChevronRight, Coffee, Dumbbell,
  Flower2, Landmark, LucideAngularModule, Menu, Snowflake, Utensils, Waves, Wifi, X,
} from 'lucide-angular';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({
      ArrowRight, Briefcase, Car, Check, ChevronLeft, ChevronRight, Coffee, Dumbbell,
      Flower2, Landmark, Menu, Snowflake, Utensils, Waves, Wifi, X,
    })),
  ]
};
