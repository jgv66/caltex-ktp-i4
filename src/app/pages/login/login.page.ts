import { Component, OnInit } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email       = '';
  clave       = '';
  empresa     = '';
  empresas    = [];
  auto_arriba = 1 ;

  constructor( private funciones: FuncionesService,
               private datos:     DatosService,
               private router:    Router ) {
    console.log('<<< LoginPage >>>');
    this.email = '';
    this.clave = '';
    this.auto_arriba = Math.trunc( (Math.random() * 7) + 1 );
  }

  ngOnInit() {
    this.datos.getDataEmpresas().subscribe( data => this.empresas = data['empresas'] );
    this.usrdata();
  }

  async usrdata() {
    const usr = await this.datos.readDatoLocal( 'KTP_usuario' )
            .then(  data => { console.log(data);
                              this.email = ( data === undefined ) ? '' : data.EMAIL; },
                    error => { console.log(error); } );
  }

  doIniciar() {
    if ( this.email === '' || this.clave === '' || this.empresa === ''  ) {
      this.funciones.msgAlert("ATENCION","Debe indicar: Email, clave y empresa para iniciar.");
    } else {
      this.datos.getDataUser( 'proalma', this.email, this.clave, this.empresa )
        .subscribe( data => {
          const rs = data['recordsets'][0];
          if ( rs[0].KOFU ) {
            //
            this.datos.saveDatoLocal( 'KTP_usuario', rs[0] );
            this.empresas.forEach( element => {
              if ( element.codigo === this.empresa ) {
                this.datos.saveDatoLocal( 'KTP_empresa', element.razonsocial );
              }
            });
            //
            this.router.navigate( ['/tabinicio'] );
          }
        },
        err => {
          this.funciones.msgAlert('ATENCION', 'Usuario/Clave no encontrados');
          console.error('ERROR Verifique credenciales', err);
        });
    }
  }

  seleccionaEmpresa( event: any ) {
    this.empresa = event;
    console.log( this.empresa );
  }

}
