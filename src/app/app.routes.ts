

import { Routes } from '@angular/router';
import { AdminComponent } from './shared/modules/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/default',
        pathMatch: 'full'
      },
      {
        path: 'default',
        loadComponent: () => import('./demo/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'designation',
        loadComponent: () => import('./modules/designation/designation.component').then((m) => m.DesignationComponent)
      },  
      {
        path: 'employee',
        loadComponent: () => import('./modules/employee/employee.component').then((m) => m.EmployeeComponent)
      },  
      {
        path: 'attendance',
        loadComponent: () => import('./modules/attendance/attendance.component').then((m) => m.AttendanceComponent)
      }, 
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/user-login/user-login.component').then((m) => m.UserLoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/register/register.component').then((m) => m.RegisterComponent)
  },
];
