
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  cualquierDato: any;
  xDato:    any;
  loading:  any;
  params:   any;
  headers:  any;
  options:  any;

  // puerto: CALTEX
  url    = 'https://api.kinetik.cl/caltex-inf' ;
  puerto = '' ;

  constructor( private http: HttpClient,
               private loadingCtrl: LoadingController,
               private storage: Storage ) {
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
                      message: 'Rescatando',
                      duration: 7000
                    });
    return await this.loading.present();
  }

  /* FUNCIONES LOCALES */
  saveDatoLocal( token: any, dato: any ) {
    this.storage.set( token, JSON.stringify(dato) );
  }

  async readDatoLocal(token: any) {
    const dato = await this.storage.get(token).then( data => data );
    this.cualquierDato = !dato ? undefined : JSON.parse( dato );
    return this.cualquierDato;
  }

  async __readDatoLocal(token: any) {
    const dato = await this.storage.get(token)
      .then( data => { this.cualquierDato = !dato ? undefined : JSON.parse( dato );
                       return this.cualquierDato; } );
  }

  guardaMientras( dato ) {
    this.cualquierDato = dato;
  }

  rescataMientras() {
    return this.cualquierDato ;
  }

  deleteDatoLocal( token: any ) {
    this.storage.remove( token ).then( () => console.log( 'DatosService.deleteDatoLocal EXISTE y REMOVIDO->', token ) );
  }

  /* FUNCIONES REMOTAS */
  getNewId() {
    return this.http.get( this.url + '/ktp_newid' );
  }
  getDataEmpresas() {   /* debo cambiarlo por GET */
    return this.http.get( this.url + '/ktp_empresas_get' );
  }
  getDataRubros() {
    return this.http.get( this.url + '/ktp_rubros_get' );
  }
  getDataMarcas() {
    return this.http.get( this.url + '/ktp_marcas_get' );
  }
  getDataSuperFamilias() {   /* debo cambiarlo por GET */
    return this.http.get( this.url + '/ktp_superfam_get' );
  }

  getDataUser( proceso: any, email: any, clave: any, empresa: any, uuid: any, sistema: string ) {
    this.showLoading();
    const datos = { rutocorreo: email, clave: clave, empresa: empresa, uuid: uuid, sistema: sistema };
    const body  = { sp: 'ksp_buscarUsuario', datos: datos };
    return this.http.post( this.url + this.puerto + '/' + proceso, body )
      .pipe( tap( value =>  { if ( this.loading ) { this.loading.dismiss(); } }) );
  }

  getDataSp( xsp: string, mostrar: boolean, datos: {}  ) {
    if ( mostrar ) { this.showLoading(); }
    const body = datos;
    return this.http.post( this.url + this.puerto + xsp, body )
      .pipe( tap( value =>  { if ( this.loading && mostrar ) { this.loading.dismiss(); } }) );
  }

  getDataSt( filtros: any, mostrar: any ) {
    if ( mostrar ) { this.showLoading(); }
    const body = { datos: filtros };
    return this.http.post( this.url + this.puerto + '/ktp_stock', body )
      .pipe( tap( value =>  { if ( this.loading && mostrar ) { this.loading.dismiss(); } }) );
  }

  getDataProd( dato: any ) {
    const body = dato;
    return this.http.post( this.url + this.puerto + '/ktp_prod', body );
  }

}
