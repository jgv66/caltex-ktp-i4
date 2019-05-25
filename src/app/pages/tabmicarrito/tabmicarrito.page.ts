import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { DatosService } from '../../services/datos.service';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tabmicarrito',
  templateUrl: './tabmicarrito.page.html',
  styleUrls: ['./tabmicarrito.page.scss'],
})
export class TabmicarritoPage implements OnInit {

  private usuario       = [];
  public  carrito       = [];
  private cliente       = [];
  public  totalCarrito  = 0;
  public  textoObs      = '';
  public  textoOcc      = '';
  public  fechaDesp:    Date;

  constructor( private funciones: FuncionesService,
    private datos: DatosService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.carrito      = this.funciones.miCarrito;
    this.totalCarrito = this.funciones.sumaCarrito( false );
  }

  ionViewDidEnter() {
    this.totalCarrito = this.funciones.sumaCarrito( false );
  }

  ionViewDidLoad() {
    this.carrito      = this.funciones.miCarrito;
    this.totalCarrito = this.funciones.sumaCarrito( false );
  }

  sumaCarrito( enBruto: boolean ) {
    return this.funciones.sumaCarrito( enBruto );
  }

  cambiarCantidad( producto ) {
      this.funciones.modificaCantidad( producto, this.cliente );
  }

  async quitarDelPedido( producto ) {
    const confirm = await this.alertCtrl.create({
      header:  'Eliminar ítem',
      message: 'Desea eliminar este ítem -> ' + producto.codigo + ' ?',
      buttons: [
                { text: 'Sí, elimine!', handler: () => { this.funciones.quitarDelCarro( producto ); } },
                { text: 'No, gracias',  handler: () => {} }
               ]
      });
      await confirm.present();
  }

  async observaciones() {
    const rescataObs = await this.modalCtrl.create( ObservacionesPage, { obs: this.textoObs } );
    rescataObs.onDidDismiss( data => {
      if ( data.obs != undefined && data.obs != '' ) {
         this.textoObs = data.obs;
         this.funciones.muestraySale("Observaciones guardadas",1);
      }
    });
    await rescataObs.present();
  }

  async ordenDeCompra() {
    const prompt = await this.alertCtrl.create({
      header:  'Orden de Compra',
      message: 'Ingrese el número de Orden de Compra del cliente',
      inputs:  [ { name: 'occ', placeholder: 'número-de-orden', value: this.textoOcc } ],
      buttons: [
        { text: 'Salir',   handler: data => {} },
        { text: 'Guardar', handler: data => {
          if ( data.occ === '' ) {
            this.funciones.msgAlert('ATENCION', 'Número de Orden de Compra está vacío.');
          } else {
            this.textoOcc = data.occ;
          }
        } }
      ]
    });
    await prompt.present();
  }

  async FechaSolicitaDespacho() {
    const rescataFech = await this.modalCtrl.create( FechadespachoPage, { fecha: this.fechaDesp } );
    rescataFech.onDidDismiss( data => {
      console.log(data );
      if ( data.fecha !== undefined && data.fecha !== '' ) {
         this.fechaDesp = data.fecha;
         this.funciones.muestraySale( 'Fecha de Despacho guardada', 1 );
      }
    });
    await rescataFech.present();
  }

}
