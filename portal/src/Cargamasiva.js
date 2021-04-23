import React, { Component } from 'react';
import { Button, Container, Row, Col,Dropdown,DropdownButton, Card, Alert, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { InfoWindow, Marker, GoogleApiWrapper,Polyline,withScriptjs} from 'google-maps-react';
import Map from './Map';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Geocode from "react-geocode";
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import CSVReader from "react-csv-reader";
import Autocomplete from  'react-autocomplete';
import BarcodeReader from 'react-barcode-reader'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell,ResponsiveContainer} from 'recharts';
import axios from 'axios';
import cors from 'cors';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import {ciudades} from "./constants/json";


class Cargamasiva extends Component {
  constructor(props){
    super(props)
    this.state = {
      ordenes:[],
      displayTabla:'none',
      cantidad_ordenes:0,
      modaldatos:false,
      modalfinalizado:false,
      modalruta:true,
      datoerror:'',
      loading: false,
      displayAprobar:'none',
      displayCarga:'none',
      latitude: '',
      longitude: '',
      idcliente:'',
      clientes:[],
      regiones:[]
    }
    this.cargarcsv = this.cargarcsv.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);
    this.cargarOrdenes = this.cargarOrdenes.bind(this);
    this.changeTituloClientes = this.changeTituloClientes.bind(this);


  }
  changeTituloClientes(item,value) {

    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };

    this.setState({
      value:item,
      idcliente:value.id,
      displayCarga:'block'
    });

  }
  componentWillMount() {
    this.getMyLocation();
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };

    var url = document.URL ;
    var urlseparada = url.split('tipo_usuario=');
    var tipo_usuario=urlseparada[urlseparada.length-1];
    tipo_usuario=tipo_usuario.replace('#','');
    axios.post("http://app.cargoex.cl:5000/clientes",config)
      .then(res => {
        var clientes= res.data;
        console.log('cliente de bd');
        console.log(clientes);
        const clientesBd=[];

        if(tipo_usuario==='admin'){
          for(let cliente of clientes){
            clientesBd.push({id: cliente.ID,nombre: cliente.NOMBRE.toUpperCase()});
          }
        }else{
        for(let cliente of clientes){
          if(cliente.ID+''===tipo_usuario+''){
            console.log('escocgio cliente');
            console.log(cliente);
            clientesBd.push({id: cliente.ID,nombre: cliente.NOMBRE.toUpperCase()});
          }
        }
        }
        console.log(clientesBd);
        this.setState({ clientes:clientesBd });
      });
      axios.get("http://app.cargoex.cl/app/cargoex/app/ciudades",config)
        .then(res => {
          const ciudades = res.data;
          const regionesBd=[];
          const ramales = [];
          console.log('ciudades son');
          console.log(ciudades);
          for(let city of ciudades.datos){

            regionesBd.push({iata: city.IATA,name: city.NOMBRE.toUpperCase(),padre:city.IATA_PADRE});

          }
          this.setState({ regiones:regionesBd});
        });
    /*
        var config2 = {
        headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
        };
        let data = JSON.stringify([{
            "COD_CLIENTE" : 2222,
            "ID_REFERENCIA" : "223422",
            "NOMBRE" : "LUIS ESPINOZA",
            "RUT" : "1111111-1",
            "DIRECCION" : "los alerces 232",
            "GUIA" : "123-456-789",
            "COMUNA" : "SCL",
            "LONG_ORIGEN" : "0",
            "LAT_ORIGEN" : "0",
            "NOTA" : "ENTREGAR CON CUIDADO",
            "TELEFONO" : "+56922554788",
            "MAIL" : "TUMAI@mail.com",
            "BULTOS" : "1",
            "ALTO" : "1.2",
            "ANCHO" : "1.6",
            "LARGO" : "4.2",
            "PESO" : "1.6",
            "TIPO_CARGA" : "CAJA",
            "CENTRO_COSTO" : "ECOMMERCE",
            "TIPO_NEGOCIO" : "PRINCIPAL",
            "CANAL" : "AUTOSERVICIO",
            "COD_BARRA" : "54159116564",
            "NUM_BOLETA" : "1111574414",
            "VALOR" : "22990",
            "TIPO_ORDEN" : "ENTREGA",
            "COMUNA_ORIGEN" : "SCL"
                    }]);
                    console.log('va a llamar metodo a probar');
        axios.post("http://app.cargoex.cl/app/cargoex/app/despacho",data,config2)
                      .then(res => {
                        var clientes= res.data;
                        console.log(clientes);
                      });
*/
  }
  getMyLocation() {
    const location = window.navigator && window.navigator.geolocation

    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log('va a mostrar posicion actual ');
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
      }, (error) => {
        this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
      })
    }

  }
  handleClose() {
    this.setState({ modaldatos: false });
  }
  handleClose2() {
    this.setState({ modalfinalizado: false });
  }
  agregarUnidad(num){
    console.log('tamaño es'+ num.toString().length);
    if(num.toString().length ===1){
      return ('0'+num);
    }else{
      return num;
    }
  }
  calculateDistance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}
verificarCiudad(city){
  for ( let i = 0; i < ciudades.length; i++) {
    if(ciudades[i].IATA.toUpperCase() === city.toUpperCase() || ciudades[i].NOMBRE.toUpperCase() === city.toUpperCase()){
      return true;
    }
  }
  return false;
}
obtenerIata(city){
        for ( let i = 0; i < ciudades.length; i++) {
            if(ciudades[i].IATA.toUpperCase() === city.toUpperCase() || ciudades[i].NOMBRE.toUpperCase() === city.toUpperCase()){
                return ciudades[i].IATA;
            }
        }
        return false;
}
  cargarOrdenes(){
    console.log('llego a cargar ordenes');
    this.setState({
      loading:true,
      displayTabla:'none',
      displayAprobar:'none'
    });
    var idcliente=this.state.idcliente;
    console.log(idcliente);
    var ordenes = this.state.ordenes;
  //  console.log(ordenes);
    var datetime = new Date();
    var dia = this.agregarUnidad(datetime.getDate());
    var mes = this.agregarUnidad(datetime.getMonth()+1);
    var hora=this.agregarUnidad(datetime.getHours());
    var minutos= this.agregarUnidad(datetime.getMinutes());
    var segundos= this.agregarUnidad(datetime.getSeconds());
  var diaActual= datetime.getFullYear() +'-'+mes+'-'+dia+' '+hora+':'+minutos+':'+segundos;
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    let data = JSON.stringify({
      idcliente: idcliente,
      ordenes:ordenes,
      dia:diaActual
    });
    
    console.log('harallamado a servicio ');
    axios.post("http://app.cargoex.cl:5000/insertarOrdenes",data,config)
      .then(res => {
        this.setState({
          loading:false,
          modalfinalizado: true
        });
        //codigo de distancia
        /*
        var latitude = this.state.latitude;
        var longitude = this.state.longitude;

        for ( let i = 0; i < ordenes.length; i++) {
          ordenes[i]["distance"] = this.calculateDistance(latitude,longitude,ordenes[i]["lat_comuna"],ordenes[i]["lng_comuna"],"K");
        }

        ordenes.sort(function(a, b) {
          return a.distance - b.distance;
        });
        console.log(ordenes);
        */
        /*
        const agentes = res.data;
        console.log(agentes);
       const agentesBd=[];
        for(let agente of agentes.datos){
          agentesBd.push({id: agente.COD_CHOFER,nombre: agente.NOMBRE.toUpperCase(),rut:agente.RUT});
        }
        this.setState({ ciudad:value,operadores:agentesBd });
        */
      })
  }
  cargarcsv(event){
    console.log('llego a cargar csv');
    var ordenes = [];
    Geocode.setApiKey("AIzaSyCnxZQw92wExvw6VWPC4nww2psARwSuy5g");
    Geocode.enableDebug();
    var bandera =true;
    var error='Faltan datos obligatorios (nombre, direccion, guia, comuna, bultos o tipo de orden) o ciudad y origen no son codigos iata en fila';
    var erraux='';
    console.log(event);
    console.log('mostrara ultima posicion');
    if(event[event.length-1].length <2){
      console.log('paso validacion de ultima posicion vacia');
      event.splice(event.length-1, 1);
    }
    console.log(event[event.length-1]);
    this.setState({
                    cantidad_ordenes:event.length-1});
    if(event[0].length !== 24 ){
      var error2 = 'La cantidad de columnas no son las apropiadas o esta seleccionando un tipo de archivo incorrecto';
      bandera = false;

      this.setState({ modaldatos: true,
                      datoerror: error2,
                      displayTabla:'none',
                      displayApertura:'none'});

    }else{
    for(let aux=1; aux<event.length;aux++){
        if(event[aux][0]==='' || event[aux][2]==='' || event[aux][3]==='' || event[aux][4]==='' || event[aux][5]==='' || event[aux][9]===''){
            if(erraux.length<20){
              erraux += ' Nº'+(aux+1);
            }else{
              erraux += '...';
            }
            console.log('mostrara equivocado');
            console.log(event[aux]);
            bandera = false;

        }else if( !this.verificarCiudad(event[aux][4]) || !this.verificarCiudad(event[aux][5])){
          if(erraux.length<20  ){
            erraux += ' Nº'+(aux+1);
          }else{
            erraux += '...';
          }
          console.log('mostrara equivocado');
          console.log(event[aux]);
          bandera = false;
        }
        else{
          let bultosOrden = event[aux][9]+'';
          if (bultosOrden==='0'){
            bultosOrden = '1';
          }
          ordenes.push({id:aux,nombre:event[aux][0].toUpperCase(),rut:event[aux][1],direccion:event[aux][2],guia:event[aux][3],
                        comuna:this.obtenerIata(event[aux][4].toUpperCase()),origen:this.obtenerIata(event[aux][5].toUpperCase()),lat_comuna:" ",lng_comuna:" ",nota:event[aux][6].toUpperCase(),
                        telefono:event[aux][7],mail:event[aux][8],
                        bultos:bultosOrden,alto:event[aux][10],ancho:event[aux][11],largo:event[aux][12],
                        peso:event[aux][13],tipo_carga:event[aux][14].toUpperCase(),centro_costo:event[aux][15].toUpperCase(),
                        cod_barra:event[aux][16],
                        num_boleta:event[aux][17],valor:event[aux][18],tipo_orden:event[aux][19].toUpperCase(),tipo_negocio:event[aux][20].toUpperCase(),
                        canal:event[aux][21].toUpperCase(),refrigerado:event[aux][22].toUpperCase(),papel:event[aux][23].toUpperCase()
                      });
                        console.log('bandera es');
                        console.log(bandera);
              /*          if(aux===event.length-1 ){
                          console.log('ordenes son');
                          console.log(ordenes);

                        }  */
                      }
                    }
                    ordenes.sort(function(a, b) {
                        return parseFloat(a.id) - parseFloat(b.id);
                      });
                    if(bandera){
                      this.setState({ ordenes:ordenes,
                                      displayTabla:'block',
                                      displayAprobar:'block' });
                    }else{
                      this.setState({ modaldatos: true,
                                      datoerror: error+' '+erraux,
                                      displayTabla:'none',
                                      displayApertura:'none',
                                      displayAprobar:'none'});


                    }
    /*   Geocode.fromAddress(event[aux][4]).then(
            response => {
              const { lat, lng } = response.results[0].geometry.location;
              console.log(lat, lng);
              ordenes.push({id:aux+1,nombre:event[aux][0].toUpperCase(),rut:event[aux][1],direccion:event[aux][2],guia:event[aux][3],
                            comuna:event[aux][4].toUpperCase(),lat_comuna:lat+"",lng_comuna:lng+"",nota:event[aux][5].toUpperCase(),
                            telefono:event[aux][6],mail:event[aux][7],
                            bultos:event[aux][8],alto:event[aux][9],ancho:event[aux][10],largo:event[aux][11],
                            peso:event[aux][12],tipo_carga:event[aux][13].toUpperCase(),centro_costo:event[aux][14].toUpperCase(),
                            cod_barra:event[aux][15],
                            num_boleta:event[aux][16],valor:event[aux][17],tipo_orden:event[aux][18].toUpperCase()
                          });
              console.log('bandera es');
              console.log(bandera);
              if(aux===event.length-1 ){
                console.log('ordenes son');
                console.log(ordenes);
                ordenes.sort(function(a, b) {
                    return parseFloat(a.id) - parseFloat(b.id);
                  });
                if(bandera){
                  this.setState({ ordenes:ordenes,
                                  displayTabla:'block',
                                  displayAprobar:'block'})
                }else{
                  this.setState({ ordenes:ordenes,
                                  displayTabla:'none',
                                  displayAprobar:'none'});
                }
              }
            },
            error => {
              var error2 = 'la direccion en fila Nº'+aux+' no puede ser verificada ';

            ordenes.push({id:aux+1,nombre:event[aux][0].toUpperCase(),rut:event[aux][1],direccion:event[aux][2],guia:event[aux][3],
                          comuna:event[aux][4].toUpperCase(),lat_comuna:" ",lng_comuna:" ",nota:event[aux][5].toUpperCase(),
                          telefono:event[aux][6],mail:event[aux][7],
                          bultos:event[aux][8],alto:event[aux][9],ancho:event[aux][10],largo:event[aux][11],
                          peso:event[aux][12],tipo_carga:event[aux][13].toUpperCase(),centro_costo:event[aux][14].toUpperCase(),
                          cod_barra:event[aux][15],
                          num_boleta:event[aux][16],valor:event[aux][17],tipo_orden:event[aux][18].toUpperCase()
                        });
                          console.log('bandera es');
                          console.log(bandera);
                          if(aux===event.length-1 ){
                            console.log('ordenes son');
                            console.log(ordenes);
                            ordenes.sort(function(a, b) {
                                return parseFloat(b.id) - parseFloat(a.id);
                              });
                            if(bandera){
                              this.setState({ ordenes:ordenes,
                                              displayTabla:'block',
                                              displayAprobar:'block' });
                            }else{
                              this.setState({ ordenes:ordenes,
                                              displayTabla:'none',
                                              displayAprobar:'none'});
                            }
                          }


            }


          );
*/

 }

  }
  matchStocks(state, value) {
    return (

      state.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 );
  }
  cambiarCliente(value){
    this.setState({
      displayCarga:'none',
      value:value
    });
  }
  componentDidMount() {
  }

  render() {
    const selectRow = {
     mode: 'checkbox',
     showOnlySelected: true
   };
   const options = {
     toolBar: this.createCustomToolBar
   };
    return (

      <Container  >

          <Modal show={this.state.modaldatos} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>ALERTA !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h3 style={{color:'#ff0000'}}>{this.state.datoerror}</h3>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={this.handleClose}>
                ok
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.modalfinalizado} onHide={this.handleClose2}>
            <Modal.Header closeButton>
              <Modal.Title>Ordenes Registradas !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1 style={{color:'#202156'}}> {this.state.cantidad_ordenes} ordenes han sido subidas con exito </h1>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={this.handleClose2}>
                ok
              </Button>
            </Modal.Footer>
          </Modal>


        <Row style={{marginTop:'1%'}}>
        <Col sm={3} style={{zIndex:2,height:70, justifyContent: 'left',textAlign:"left"}}>
        <p style={{marginBottom:'0.5rem',
        color: '#202156',fontSize:20, fontWeight: 'bold',
        justifyContent: 'left',textAlign:'left'
        }}> Selecciona Cliente:
        </p>

        <Autocomplete
            value={ this.state.value }
            inputProps={{ id: 'states-autocomplete' }}
            wrapperStyle={{ position: 'relative', display: 'inline-block'}}
            items={ this.state.clientes}
            getItemValue={ item => item.nombre }
            shouldItemRender={ this.matchStocks }
            onChange={(event, value) => this.cambiarCliente(value) }
            onSelect={this.changeTituloClientes}
            renderMenu={ children => (
              <div className = "menu">
              { children }
              </div>
            )}
            renderItem={ (item, isHighlighted) => (
              <div
                className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                key={ item.id } >
                { item.nombre}
              </div>
            )}
            />

        </Col>
        <Col sm={3} style={{display:this.state.displayCarga,marginTop:'3%'}} >
              <CSVReader
                cssClass="react-csv-input"
                onFileLoaded={this.cargarcsv}
                parserOptions={{
                    encoding: "ISO-8859-1"
                }}
              />
        </Col>
        </Row>
        <Row>
        <Col sm={12}  >
            <div style={{justifyContent: 'center',textAlign:"center"}} >
              <ClipLoader
                style={{border: '1px solid'}}
                sizeUnit={"px"}
                size={150}
                color={'#202156'}
                loading={this.state.loading}
                />
            </div>
        </Col>
        </Row>
        <Row>
        <Col sm={12}  >
          <p style={{
          color: '#202156',fontSize:20, fontWeight: 'bold',
          justifyContent: 'left',textAlign:'left',display:this.state.displayTabla
        }}> Cantidad de ordenes : {this.state.cantidad_ordenes}
          </p>
        </Col>
        </Row>
        <Row style={{ paddingBottom:'1rem',marginTop:'2%',justifyContent: 'left',textAlign:"left",display:this.state.displayTabla}} >
          <Col sm={12} >
            <BootstrapTable
            pagination
            containerStyle={{width: '370%',fontSize:14}}
            data={ this.state.ordenes}
            options={ options }
            selectRow={ selectRow }
            exportCSV
            search
            >
            <TableHeaderColumn dataField='id' isKey={ true } dataSort={ true } width={'2%'}>Id</TableHeaderColumn>
            <TableHeaderColumn dataField='nombre' dataSort={ true } width={'12%'}>Nombre</TableHeaderColumn>
            <TableHeaderColumn dataField='rut' dataSort={ true } width={'8%'}>Rut</TableHeaderColumn>
            <TableHeaderColumn dataField='direccion' dataSort={ true } width={'13%'} >Direccion</TableHeaderColumn>
            <TableHeaderColumn dataField='guia' dataSort={ true }  width={'9%'}>Guia</TableHeaderColumn>
            <TableHeaderColumn dataField='comuna' dataSort={ true }  width={'4%'} >Comuna</TableHeaderColumn>
            <TableHeaderColumn dataField='origen' dataSort={ true } width={'3%'}>Origen</TableHeaderColumn>
            <TableHeaderColumn dataField='nota' dataSort={ true }>Nota</TableHeaderColumn>
            <TableHeaderColumn dataField='telefono' dataSort={ true } width={'4%'}>Telefono</TableHeaderColumn>
            <TableHeaderColumn dataField='mail' dataSort={ true }>Mail</TableHeaderColumn>
            <TableHeaderColumn dataField='bultos' dataSort={ true } width={'3%'}>Bultos</TableHeaderColumn>
            <TableHeaderColumn dataField='alto' dataSort={ true }  width={'3%'}>Alto</TableHeaderColumn>
            <TableHeaderColumn dataField='ancho' dataSort={ true }  width={'3%'}>Ancho</TableHeaderColumn>
            <TableHeaderColumn dataField='largo' dataSort={ true }  width={'3%'}>Largo</TableHeaderColumn>
            <TableHeaderColumn dataField='peso' dataSort={ true }  width={'3%'}>Peso</TableHeaderColumn>
            <TableHeaderColumn dataField='tipo_carga' dataSort={ true } width={'4%'}>Tipo Carga</TableHeaderColumn>
            <TableHeaderColumn dataField='centro_costo' dataSort={ true }  width={'5%'}>Centro Costo</TableHeaderColumn>
            <TableHeaderColumn dataField='cod_barra' dataSort={ true }  width={'5%'}>Codigo de Barra</TableHeaderColumn>
            <TableHeaderColumn dataField='num_boleta' dataSort={ true }  width={'6%'}>Numero de Boleta</TableHeaderColumn>
            <TableHeaderColumn dataField='valor' dataSort={ true }  width={'3%'}>Valor</TableHeaderColumn>
            <TableHeaderColumn dataField='tipo_orden' dataSort={ true } width={'4%'}>Tipo de Orden</TableHeaderColumn>
            <TableHeaderColumn dataField='tipo_negocio' dataSort={ true } width={'5%'}>Tipo de Negocio</TableHeaderColumn>
            <TableHeaderColumn dataField='canal' dataSort={ true } width={'4%'}>Canal</TableHeaderColumn>
            <TableHeaderColumn dataField='refrigerado' dataSort={ true } width={'4%'}>Regriferado</TableHeaderColumn>
            <TableHeaderColumn dataField='papel' dataSort={ true } width={'4%'}>Od Papel</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>

        <Row>
          <Col sm={12}  >
          <Button style={{ display:this.state.displayAprobar,textAlign:'center', border: '1px solid',marginLeft:'40%' }}
            variant="primary"
            onClick={this.cargarOrdenes.bind(this)}
            >
            Aprobar Ordenes
            </Button>
          </Col>
        </Row>

      </Container>

    );
  }
}


export default Cargamasiva;
