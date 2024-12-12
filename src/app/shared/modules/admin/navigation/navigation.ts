import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: true
      }
    ]
  },
  {
    id: 'designation',
    title: 'Designation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'designation',
        title: 'Designation',
        type: 'item',
        url: '/designation',
        classes: 'nav-item',
        icon: 'ti ti-table'
      }
    ]
  },
  {
    id: 'employee',
    title: 'Employees',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'employee',
        title: 'Employees',
        type: 'item',
        url: '/employee',
        classes: 'nav-item',
        icon: 'ti ti-table'
      }
    ]
  },
  {
    id: 'attendance',
    title: 'Attendance',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'attendance',
        title: 'Attendance',
        type: 'item',
        url: '/attendance',
        classes: 'nav-item',
        icon: 'ti ti-table'
      }
    ]
  },
  // {
  //   id: 'page',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'Authentication',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'ti ti-key',
  //       children: [
  //         {
  //           id: 'login',
  //           title: 'Login',
  //           type: 'item',
  //           url: '/guest/login',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'register',
  //           title: 'Register',
  //           type: 'item',
  //           url: '/guest/register',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     }
  //   ]
  // },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
