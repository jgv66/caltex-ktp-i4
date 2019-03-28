import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabinicio',
  templateUrl: './tabinicio.page.html',
  styleUrls: ['./tabinicio.page.scss'],
})
export class TabinicioPage implements OnInit {

  lScrollInfinito = false;
  listaProductos  = [];
  offset          = 0;  // primer registro codigo+sucursal
  codproducto     ;
  descripcion     ;
  usuario         ;
  Carro           = [];
  results         = {};
  config:         any;         // Configuracion;
  firstcall       = false;
  filtrosVarios   = false;
  codMarcas       ;
  marcas          = [];
  codRubros       ;
  codSuperFam     ;
  superfamilias   = [];
  Importados      = [];
  nombreEmpresa   ;
  scrollSize      = 20;
  cliente         = undefined;
  config_precio   = undefined;
  config_stock    = undefined;
  config_occ      = undefined;
  config_orden    = undefined;
  config_imagenes = true;

  constructor( private datos: DatosService,
               private funciones: FuncionesService,
               private alertCtrl: AlertController ) {
    this.filtrosVarios      = false;
    this.codproducto        = '';
    this.descripcion        = '';
    this.codRubros          = '';
    this.codMarcas          = '';
    this.codSuperFam        = '';
    this.firstcall          = true;
  }

  ionViewWillEnter() {
    this.firstcall = false;
  }

  ngOnInit() {
    this.datos.getDataMarcas().subscribe( data => this.marcas = data['marcas'] );
    this.datos.getDataSuperFamilias().subscribe( data => this.superfamilias = data['superfamilias'] );
    this.getVariablesLocales();
    // this.datos.readDatoLocal( 'KTP_usuario').then( dato => { this.usuario = dato;
    //                                                          this.nombreEmpresa = dato.RAZONSOCIAL; } );
  }

  inicializa() {}

  async scanBarcode() {
    // try {
    //   await this.barcode.scan()
    //             .then( barcodeData => {
    //                   this.codproducto = barcodeData.text.trim();
    //                   this.descripcion = '';
    //                   this.aBuscarProductos( 1 );
    //             }, (err) => {
    //                 // An error occurred
    //             });
    // } catch(error) {
    //   console.error(error);
    // } 
  }

  aBuscarProductos( xdesde?, infiniteScroll? ) {
    if (  this.codproducto  === '' &&
          this.descripcion === '' &&
          this.codRubros === '' &&
          this.codMarcas === '' &&
          this.codSuperFam === '' &&
          this.codSuperFam === '' ) {
      this.funciones.msgAlert( 'DATOS VACIOS', 'Debe indicar algún dato para buscar.');
    } else {
      //
      if ( xdesde === 1 ) {
          this.funciones.cargaEspera(5000);
          this.offset          = 0 ;
          this.listaProductos  = [];
          this.lScrollInfinito = true;
      } else {
          this.offset += 20 ;
      }
      //
      this.datos.getDataSp( '/ktp_buscarProductos', 
                            true,
                            {
                              codigo:        this.codproducto,
                              descripcion:   this.descripcion,
                              superfamilias: this.codSuperFam,
                              rubros:        this.codRubros,
                              marcas:        this.codMarcas,
                              listap:        ( this.usuario.LISTACLIENTE !== ''
                                            && this.usuario.LISTACLIENTE !== this.usuario.LISTAMODALIDAD )
                                                ? this.usuario.LISTACLIENTE : this.usuario.LISTAMODALIDAD,
                              bodega:        this.usuario.BODEGA,
                              empresa:       this.usuario.EMPRESA,
                              kofu:          this.usuario.KOFU,
                              ordenar:       this.config_orden,
                              soloconstock:  ( this.config_stock  === 'no'      ) ? 'false' : 'true',
                              soloconprecio: ( this.config_precio === 'no'      ) ? 'false' : 'true',
                              soloconocc:    ( this.config_occ    === 'no'      ) ? 'false' : 'true',
                              cliente:       ( this.cliente       === undefined ) ? ''      : this.cliente.codigo ,
                              offset:        this.offset,
                            } )
          .subscribe( data => { if ( xdesde === 1 ) { this.funciones.descargaEspera(); }
                                this.revisaExitooFracaso( data, xdesde, infiniteScroll ); },
                      err  => { this.funciones.descargaEspera();
                                this.funciones.msgAlert( 'ATENCION', err );  }
                    )
    }
  }

  revisaExitooFracaso( data, xdesde, infiniteScroll ) {
    const rs = data['data'];

    if ( rs === undefined || rs.data === 'error en la consulta' ) {
      this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');

    } else {
      //
      this.listaProductos = ( this.offset === 0 ) ? rs : this.listaProductos.concat(rs);
      console.log( this.listaProductos );

      // aqui detengo el scroll
      if ( infiniteScroll ) {
        infiniteScroll.complete();
      }
      //
      if ( rs.length < 20  )  {
        this.lScrollInfinito = false;
      } else if ( xdesde === 1 ) {
        this.lScrollInfinito = true ;
      }
      // revisar ecuaciones
      // console.log(this.baseLocal.varCliente.length);
      //
      let i = 0;
      this.listaProductos.forEach( fila => {
        // console.log("ecu_max1",fila.ecu_max1,( fila.ecu_max1 != '' ) );
        if ( fila.ecu_max1 !== '' ) {
            // try {
            //   // console.log( "adentro", this.baseLocal.varCliente[0][fila.ecu_max1] );
            //   if ( this.baseLocal.varCliente[0][fila.ecu_max1] != undefined ) {
            //     let x = parseFloat( this.baseLocal.varCliente[0][fila.ecu_max1] );
            //     // primera unidad
            //     this.listaProductos[i].descuentomax = x;
            //     this.listaProductos[i].preciomayor  = Math.round( this.listaProductos[i].precio-( this.listaProductos[i].precio*(x/100) ) );
            //     this.listaProductos[i].dsctovalor   = Math.round( this.listaProductos[i].precio*(x/100) );
            //     // segunda unidad
            //     this.listaProductos[i].descuentomax2 = x;
            //     this.listaProductos[i].preciomayor2  = Math.round( this.listaProductos[i].precio2-( this.listaProductos[i].precio2*(x/100) ) );
            //     this.listaProductos[i].dsctovalor2   = Math.round( this.listaProductos[i].precio2*(x/100) );
            //     // ecuacion a vacio !!
            //     this.listaProductos[i].ecu_max1 = '';
            //   }
            // } catch {
            //   // console.log( "de salida", fila.codigo );
            // }
        }
        i++;
      } );
    }
  }

  imagenGrande( producto ) {
    // this.navCtrl.push( ImagenProductoPage, { codigo: producto.codigosincolor } );
  }

  infoDelProducto( producto, tipocon ) {
    // this.navCtrl.push( InfoproductoPage, { producto: producto, tipocon: tipocon, usuario: this.usuario } );
  }

  agregarAlCarro( producto, cliente ) {
    // this.funciones.pideCantidad( producto, cliente, this.usuario );
  }

  ConfiguracionLocal(){
    // this.navCtrl.push( MenuSeteoPage, { usuario: this.usuario } ) ;
  }

  masDatos( infiniteScroll: any ) {
    this.aBuscarProductos( 0, infiniteScroll );
  }

  imagenOnOff() {
    this.config_imagenes = !this.config_imagenes;
    this.datos.saveDatoLocal( 'KTP_imagenes', this.config_imagenes );
  }
  masOpciones() {
    this.filtrosVarios = !this.filtrosVarios ;
    if ( !this.filtrosVarios ) {
      this.codMarcas   = '';
      this.codRubros   = '';
      this.codSuperFam = '';
    }
  }

  largoListaProductos() {
    return this.listaProductos.length;
  }

  limpiarCliente() {
    // const confirm = this.alertCtrl.create({
    //   title: 'Limpiar datos',
    //   message: 'Iniciará búsquedas sin mencionar a cliente y no podrá agregar al carro sin este dato. Desea limpiar los datos del cliente activo?',
    //   buttons: [
    //               { text: 'No, gracias', handler: () => { null } },
    //               { text: 'Sí, limpiar', handler: () => { this.cliente = this.funciones.initCliente(); 
    //                                                       this.funciones.guardaUltimoCliente( this.cliente ); } }
    //            ]
    // });
    // confirm.present();
  }

  limpiarTextos( caso: number ) {
    if ( caso === 1 ) {
      this.codproducto = '';
    } else if ( caso === 2 ) {
      this.descripcion = '';
    }
  }

  scrollToTop() {
    // this.content.scrollToTop();
  }

  cambiaDescuento( producto ) {
    // let dvend   = producto.dsctovend;
    // let prompt  = this.alertCtrl.create({
    //   title:   "Descto. Máximo : "+producto.descuentomax.toString()+"%",
    //   message: "Ingrese el nuevo descuento a utilizar.",
    //   inputs:  [ { name: "dvend", placeholder: dvend } ],
    //   buttons: [
    //     { text: 'Salir',   handler: data => { null } },
    //     { text: 'Cambiar', handler: data => { 
    //       if ( data.dvend < 0 ) {
    //         this.funciones.msgAlert('ATENCION','Descuento digitado está incorrecto. Intente con otro valor.');
    //       } else if ( data.dvend > producto.descuentomax && this.usuario.puedemodifdscto != true ) {
    //           this.funciones.msgAlert('ATENCION','Descuento digitado está incorrecto. Intente con otro valor.');
    //       } else {
    //         producto.dsctovend    = data.dvend;
    //         producto.preciomayor  = Math.round((producto.precio-(producto.precio*data.dvend/100)));
    //         producto.dsctovalor   = producto.precio - producto.preciomayor;
    //       }
    //     } }
    //   ]
    // });
    // prompt.present();
  }

  PresionaryCopiar( event, producto ) {
    // //
    // let texto = '';
    // // 
    // texto += 'Código : '+producto.codigo+'\n';
    // texto += 'Descripcion : '+producto.descripcion+'\n' ;
    // texto += 'Bodega ('+producto.bodega.trim()+') : '+producto.nombrebodega+'\n' ;
    // //
    // if ( producto.preciomayor > 0 ) {
    //     texto += 'Precio '+producto.tipolista+' : '+producto.preciomayor.toLocaleString()+'\n\n' ;
    // }
    // texto +="http://www.grupocaltex.cl/imagenes/fotos18/"+producto.codigosincolor.trim()+".jpg"+'\n' ;
    // //
    // this.clipboard.copy( texto );
    // //
    // this.funciones.muestraySale("Copiado al porta-papeles...",1,'middle');
    // //
  }

  async filtros() {
    this.getVariablesLocales();
    const alert = await this.alertCtrl.create({
      header: 'Filtros para búsquedas',
      inputs: [
        { name: 'CON-STOCK',
          type: 'checkbox',
          label: 'Productos con Stock',
          value: 'CON-STOCK',
          checked: ( this.config_stock === 'si' ) ? true : false },
        { name: 'CON-PRECIO',
          type: 'checkbox',
          label: 'Productos con Precio',
          value: 'CON-PRECIO',
          checked: ( this.config_precio === 'si' ) ? true : false  },
        { name: 'CON-OCC',
          type: 'checkbox',
          label: 'Con OCC futuras',
          value: 'CON-OCC',
          checked: ( this.config_occ === 'si' ) ? true : false  },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Ok',
          handler: (data) => {
            this.guardaDatos( data );
            this.getVariablesLocales();
          }
        }
      ]
    });

    await alert.present();
  }

  guardaDatos( data ) {
    if ( data.filter( (e) => e === 'CON-STOCK' ).length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_stock',  'si' );
    } else {
      this.datos.saveDatoLocal( 'KTP_stock',  'no' );
    }
    if ( data.filter( (e) => e === 'CON-PRECIO' ).length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_precio',  'si' );
    } else {
      this.datos.saveDatoLocal( 'KTP_precio',  'no' );
    }
    if ( data.filter( (e) => e === 'CON-OCC' ).length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_occ',  'si' );
    } else {
      this.datos.saveDatoLocal( 'KTP_occ',  'no' );
    }
  }

  async orden() {
    this.getVariablesLocales();
    const alert = await this.alertCtrl.create({
      header: 'Orden del Reporte',
      inputs: [
        { name: 'CODIGO',
          type: 'radio',
          label: 'Codigo',
          value: 'CODIGO',
          checked: ( this.config_orden === 'CODIGO' ) ? true : false },
        { name: 'DESCRIPCION',
          type: 'radio',
          label: 'Descripción',
          value: 'DESCRIPCION',
          checked: ( this.config_orden === 'DESCRIPCION' ) ? true : false  },
        { name: 'MARCA',
          type: 'radio',
          label: 'Marca',
          value: 'MARCA',
          checked: ( this.config_orden === 'MARCA' ) ? true : false  },
        { name: 'SUPERFAM',
          type: 'radio',
          label: 'Super-Fam.',
          value: 'SUPERFAM',
          checked: ( this.config_orden === 'SUPERFAM' ) ? true : false  },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Ok',
          handler: (data) => {
            this.guardaOrdenamiento( data );
            this.getVariablesLocales();
          }
        }
      ]
    });

    await alert.present();
  }

  guardaOrdenamiento( data ) {
    if ( data.length > 0 ) {
      this.datos.saveDatoLocal( 'KTP_orden', data );
    } else {
      this.datos.saveDatoLocal( 'KTP_orden', 'CODIGO' );
    }
  }

  getVariablesLocales() {
    this.datos.readDatoLocal( 'KTP_empresa' ).then( dato => { this.nombreEmpresa   = dato; } );
    this.datos.readDatoLocal( 'KTP_usuario' ).then( dato => { this.usuario         = dato; } );
    this.datos.readDatoLocal( 'KTP_precio'  ).then( dato => { this.config_precio   = ( dato === undefined ) ? 'no' : dato ; } );
    this.datos.readDatoLocal( 'KTP_stock'   ).then( dato => { this.config_stock    = ( dato === undefined ) ? 'no' : dato ; } );
    this.datos.readDatoLocal( 'KTP_occ'     ).then( dato => { this.config_occ      = ( dato === undefined ) ? 'no' : dato ; } );
    this.datos.readDatoLocal( 'KTP_orden'   ).then( dato => { this.config_orden    = ( dato === undefined ) ? 'CODIGO' : dato ; } );
    this.datos.readDatoLocal( 'KTP_imagenes').then( dato => { this.config_imagenes = ( dato === undefined ) ? true : dato ; } );
  }

}
