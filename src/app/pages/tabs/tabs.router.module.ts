import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'tabinicio' ,   children: [ { path: '', loadChildren: '../tabinicio/tabinicio.module#TabinicioPageModule'          }] },
      { path: 'tabmicarrito', children: [ { path: '', loadChildren: '../tabmicarrito/tabmicarrito.module#TabmicarritoPageModule' }] },
      { path: 'tabsalida',    children: [ { path: '', loadChildren: '../tabsalida/tabsalida.module#TabsalidaPageModule'          }] },
      { path: '', redirectTo: '/tabs/tabinicio',  pathMatch: 'full' },
    ]
  },
  { path: '',
    redirectTo: '/tabs/tabinicio',
    pathMatch: 'full'
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}