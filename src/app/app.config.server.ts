import { mergeApplicationConfig, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

const serverConfig: ApplicationConfig = {
   providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    )
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
