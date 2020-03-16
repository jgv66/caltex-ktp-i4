import { Component, OnInit, Input } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  uuid        = undefined;
  email       = '';
  clave       = '';
  empresa     = '';
  empresas    = [];
  auto_arriba = 1 ;

  constructor( private funciones: FuncionesService,
               private datos:     DatosService,
               private router:    Router ) {
    console.log('<<< LoginPage >>>' );
    this.email = '';
    this.clave = '';
    this.auto_arriba = Math.trunc( (Math.random() * 7) + 1 );
  }

  ngOnInit() {
    // uuid
    this.usrUUID();
    //
    this.datos.getDataEmpresas().subscribe( data => this.empresas = data['empresas'] );
    this.usrdata();
    // rubros
    this.datos.getDataRubros().subscribe( data => this.datos.saveDatoLocal( 'KTP_rubros', data['rubros'] ) );
    // marcas
    this.datos.getDataMarcas().subscribe( data => this.datos.saveDatoLocal( 'KTP_marcas', data['marcas'] ) );
    // superfamilias
    this.datos.getDataSuperFamilias().subscribe( data => this.datos.saveDatoLocal( 'KTP_marcas', data['marcas'] ) );
  }

  async usrdata() {
    const usr = await this.datos.readDatoLocal( 'KTP_usuario' )
            .then(  data  => { this.email = ( data === undefined ) ? '' : data.EMAIL; },
                    error => { console.log(error); } );
  }
  async usrUUID() {
    const usr = await this.datos.readDatoLocal( 'KTP_user_uuid' )
            .then(  data  => { this.uuid = ( data === undefined ) ? '' : data; },
                    error => { console.log(error); } );
  }

  doIniciar() {
    if ( this.email === '' || this.clave === '' || this.empresa === ''  ) {
      this.funciones.msgAlert('ATENCION', 'Debe indicar: Email, clave y empresa para iniciar.' );
    } else {
      this.datos.getDataUser( 'proalma', this.email, this.clave, this.empresa, this.uuid, 'ktp' )
        .subscribe( data => {
          // console.log(data);
          const rs = data['recordsets'][0];
          if ( rs[0].KOFU ) {
            //
            this.datos.saveDatoLocal( 'KTP_usuario', rs[0] );
            // empresa
            this.empresas.forEach( element => {
              if ( element.codigo === this.empresa ) {
                this.datos.saveDatoLocal( 'KTP_empresa', element.razonsocial );
              }
            });
            //
            this.router.navigate( ['/tabs'] );
          }
        },
        err => {
          this.funciones.msgAlert('ATENCION', 'Usuario/Clave/Empresa no coinciden.');
          console.error('ERROR Verifique credenciales', err);
        });
    }
  }

  seleccionaEmpresa( event: any ) {
    this.empresa = event;
  }

}
