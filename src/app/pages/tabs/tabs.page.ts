import { Component, ChangeDetectorRef  } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  nItemes = 0;

  constructor( public  event: Events,
               public  detectorRef: ChangeDetectorRef,
               private funciones: FuncionesService ) {

    event.subscribe('micarrito:actualizado', _badgeValue => {
      // console.log('dentro de TabsPage', _badgeValue);
      // nItemes comienza en 0 (definido enla declaracion de la variable)
      // el valor se debe incrementar cada vez que se recibe el evento
      this.nItemes = this.funciones.cuantosProductosEnCarroTengo();
      detectorRef.detectChanges();
    });
  }

}
