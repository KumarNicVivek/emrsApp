import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainlayoutComponent } from './layout/mainlayout/mainlayout.component';
import { AuthlayoutComponent } from './layout/authlayout/authlayout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authguardGuard } from './Guards/authguard.guard';
import { permissionGuard } from './Guards/permissionguard.guard';
import { PubliclayoutComponent } from './layout/publiclayout/publiclayout.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path:'',
    component: PubliclayoutComponent,
    children:[
      { path:'', component:HomeComponent},
      // { path: 'about', component: AboutComponent },
      // { path: 'esse-2023', component: Esse2023Component },
      // { path: 'esse2025/notification', component: NotificationComponent },
      // { path: 'esse2025/syllabus', component: SyllabusComponent },
      // { path: 'contact', component: ContactComponent },
      // { path: 'appointment', component: AppointmentComponent }
    ]
  },
  {
    path: '',
    component: AuthlayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: '',
    component: MainlayoutComponent,
    canActivate: [authguardGuard],
    children: [
      {
        path: 'dashboard', 
        component:DashboardComponent,
        canActivate: [permissionGuard],
        data: { permission: 'DASHBOARD_VIEW' }
        
      },

      // FRA Detail Route with Lazy Loading and Permission Guard
    //   {
    //     path:'fra-detail',
    //     canActivate: [permissionGuard],
    //     data: { permission: 'IFRCLAIMS_VIEW' },
    //     loadComponent: () =>
    //       import('./pages/fra-detail/fra-detail.component')
    //     .then(m =>m.FraDetailComponent)
    //     // path:'fra-detail',component:FraDetailComponent
    //   }
    //   ,

    //   // Claim Module Routes with Lazy Loading and Permission Guard
    //   {
    //     path:'claim',
    //     children: [
    //       {
    //         //Claim Form A List Route
    //         path:'',
    //         canActivate: [permissionGuard],
    //         data: { permission: 'IFRCLAIMS_VIEW' },
    //         loadComponent: () =>
    //           import('./pages/')
    //         .then(m =>m.ClaimlistComponent)

    //       },
    //       // Create Form Claim A Route
    //       {
    //         path:'form-a',
    //         canActivate: [permissionGuard],
    //         data: { permission: 'IFRCLAIMS_CREATE' },
    //         loadComponent: () =>
    //           import('')
    //         .then(m =>m.ClaimAFormComponent)
    //       }
    //     ]
    //   }
    ]
  }
];
