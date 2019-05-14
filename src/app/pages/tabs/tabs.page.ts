import { Component, ChangeDetectorRef  } from '@angular/core';
//import { Events } from '@ionic-angular';
import { FuncionesService } from '../../services/funciones.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  // @ViewChild(tabfiltros) tabs: TabsPage;

  nItemes = 0;

  constructor( public event: Events,
               public detectorRef: ChangeDetectorRef ) {

      event.subscribe('cart:updated', _badgeValue => {
        console.log( _badgeValue );
        this.nItemes = _badgeValue;
        detectorRef.detectChanges();
      });
  }
  
}
