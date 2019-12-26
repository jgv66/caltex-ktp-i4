import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FilaSindescComponent } from './fila-sindesc/fila-sindesc.component';
import { FilaCondescComponent } from './fila-condesc/fila-condesc.component';

@NgModule({
  declarations: [ FilaSindescComponent, FilaCondescComponent ],
  imports: [ CommonModule, IonicModule ],
  exports: [ FilaSindescComponent, FilaCondescComponent ]
})
export class ComponentsModule { }
