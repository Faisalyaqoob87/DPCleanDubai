import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';

export const routes: Routes = [
    {
    path: '',
    component: HomePageComponent,
    data: { sectionId: 'home' }
  },
  {
    path: 'shop',
    component: HomePageComponent,
    data: { sectionId: 'products' }
  },
  {
    path: 'story',
    component: HomePageComponent,
    data: { sectionId: 'story' }
  },
  {
    path: 'gallery',
    component: HomePageComponent,
    data: { sectionId: 'gallery' }
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];
