import React, { Component } from 'react';
import { Button, Container, Row, Col,Dropdown,DropdownButton, Card, Alert, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {Map, InfoWindow, Marker, GoogleApiWrapper,Polyline} from 'google-maps-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
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

class Rutaoptima extends Component {
  constructor(props){
    super(props)
    this.state = {
      fecha: new Date(),
      displayBoton:'block',
      displayRuta:'none',
      modalMapa:false,
      latitude: '',
      longitude: '',
      ultimoID:'',
      ultimoLat:0,
      ultimoLng:0,
      ordenes:[],
      coordenadasRutas:[],
      imagenEntrega:'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png'

    }
    this.changeFecha= this.changeFecha.bind(this);
    this.generar= this.generar.bind(this);
    this.cambiarPartida= this.cambiarPartida.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.cellButton = this.cellButton.bind(this);

  }
  cellButton(cell, row, enumObject, rowIndex) {
    console.log(row);
    console.log('el objeto es'+enumObject+cell+'--'+row.nombre+'--'+rowIndex);
    let url = "http://18.219.80.103/rutaap/public/consultaOd/"+row.OD_PAPEL;
     return (
        <Button
        target="_blank"
        href={url}
        variant="primary"
        >
        VER MAS
        </Button>
     )
  };
  handleClose() {
    this.setState({ modalMapa: false });
  }
  cambiarPartida(){
    this.setState({ modalMapa: true });

  }
  generar(){
    let dia=this.state.fecha.getDate()+"";
    let mes=(this.state.fecha.getMonth()+1)+"";
    let year=this.state.fecha.getFullYear();
    if(dia.length===1){
      dia='0'+dia;
    }
    if(mes.length===1){
      mes='0'+mes;
    }
    console.log(year+'-'+mes+'-'+dia);
    var fecha =year+'-'+mes+'-'+dia;
    var config = {

    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    let data = JSON.stringify({
      fecha: fecha

    });
    axios.post("http://app.cargoex.cl:5000/obtenerOrdenes",data,config)
          .then(res => {
                  var ordenes = res.data;
                  console.log(ordenes);
                  if(ordenes.length>1){
                    //codigo de distancia

                    var latitude = this.state.latitude;
                    var longitude = this.state.longitude;
                    var coordenadasRutas = [];
                    var marcadores = [];
                    var ultimaLat='';
                    var ultimaLng='';
                    for ( let i = 0; i < ordenes.length; i++) {
                      ordenes[i]["distance"] = this.calculateDistance(latitude,longitude,ordenes[i]["latitude"],ordenes[i]["longitude"],"K");
                  /*    coordenadasRutas.push({coordenadas:[{lat: parseFloat(this.state.latitude), lng: parseFloat(this.state.longitude)},
                      {lat: parseFloat(ordenes[i]["latitude"]), lng: parseFloat(ordenes[i]["longitude"])}]});  */
                      if(i===0){
                        coordenadasRutas.push({id:(i+1)+'',coordenadas:[{lat: parseFloat(this.state.latitude), lng: parseFloat(this.state.longitude)},
                        {lat: parseFloat(ordenes[i]["latitude"]), lng: parseFloat(ordenes[i]["longitude"])}]});
                      }else{
                        coordenadasRutas.push({id:(i+1)+'',coordenadas:[{lat: parseFloat(ordenes[i-1]["latitude"]), lng: parseFloat(ordenes[i-1]["longitude"])},
                        {lat: parseFloat(ordenes[i]["latitude"]), lng: parseFloat(ordenes[i]["longitude"])}]});
                        if(i===ordenes.length-1){
                          ultimaLat = parseFloat(ordenes[i]["latitude"]);
                          ultimaLng = parseFloat(ordenes[i]["longitude"]);
                        }
                      }
                    }
                    var ultimoid = ordenes.length+1;
                    ordenes.sort(function(a, b) {
                      return a.distance - b.distance;
                    });
                    for( let i = 0; i < ordenes.length; i++) {
                        ordenes[i]['id'] = (i+1)+'';
                        ordenes[i]["latitude"] = parseFloat(ordenes[i]["latitude"]);
                        ordenes[i]["longitude"] = parseFloat(ordenes[i]["longitude"]);
                    }


                    console.log(coordenadasRutas);
                    console.log('ordenes son ');
                    console.log(ordenes);
                    this.setState({
                            displayRuta: 'block',
                            coordenadasRutas:coordenadasRutas,
                            ordenes:ordenes,
                            ultimoID:ultimoid+'',
                            ultimoLat:ultimaLat,
                            ultimoLng:ultimaLng
                          });
                  }

            });

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

  changeFecha(date) {
    this.setState({
            fecha: date
          });
  }

  componentDidMount() {
  }
  componentWillMount() {
    this.getMyLocation();
  }
  getposition = (lat, lng) => {
     console.log(lat);
     console.log(lng);
    this.setState({
         latitude:lat,
         longitude:lng,
         modalMapa:false
       })
 }

 getMyLocation() {
   const location = window.navigator && window.navigator.geolocation

   if (location) {
     location.getCurrentPosition((position) => {
       this.setState({
         latitude: position.coords.latitude+'',
         longitude: position.coords.longitude+''       });
       console.log('va a mostrar posicion actual ');
       console.log(position.coords.latitude);
       console.log(position.coords.longitude);
     }, (error) => {
       this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
     })
   }

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
        <Modal show={this.state.modalMapa} size = {'lg'} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>ALERTA !</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{height:'30rem'}}>
          <Map
              initialCenter={{
                lat: this.state.latitude,
                lng: this.state.longitude
              }}
              center={{lat: this.state.latitude, lng: this.state.longitude }}
              name={'Current location'}
              google={this.props.google}
              zoom={13}
              onClick={(t, map, c) => this.getposition(c.latLng.lat(), c.latLng.lng())}
              style={{ border: '1px solid',borderColor: '#202156',borderRadius:'1rem 1rem 1rem 1em ',maxWidth:'96%'}}>

              </Map>
          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>

        <Row style={{ justifyContent: 'left', marginTop:'2rem'}}>
          <Col sm={3} style={{ justifyContent: 'left',textAlign:'left'}} >
              <p style={{textAlign:"left",marginBottom:'0.5rem', color: '#202156',
              fontSize:16, fontWeight: 'bold', justifyContent: 'left',textAlign:'left'
            }}> FECHA: </p>

              <DatePicker
                style={{width:'2rem'}}
                dateFormat="dd/MM/yyyy"
                selected={this.state.fecha}
                onChange={this.changeFecha}
                />

          </Col>
          <Col sm={3}  >
            <Button style={{ display:this.state.displayBoton,marginTop:'1.5rem'}}
              variant="primary"
              onClick={this.cambiarPartida}

              >
              Cambiar Partida
              </Button>
          </Col>
          <Col sm={3}  >
            <Button style={{ display:this.state.displayBoton,marginTop:'1.5rem'}}
              variant="primary"
              onClick={this.generar.bind(this)}

              >
              Generar Ruta
              </Button>
          </Col>
        </Row>
        <Row ref={el => (this.componentRef = el)} >
        <Col style={{ height:600,marginTop:'5%',display:this.state.displayRuta}} sm={12}>
        <Map
            initialCenter={{
              lat: this.state.latitude,
              lng: this.state.longitude
            }}
            center={{lat: this.state.latitude, lng: this.state.longitude }}
            name={'Current location'}
            google={this.props.google}
            zoom={12}
            onClick={(t, map, c) => this.getposition(c.latLng.lat(), c.latLng.lng())}
            style={{ border: '1px solid',borderColor: '#202156',borderRadius:'1rem 1rem 1rem 1em ',maxWidth:'96%'}}>
            {this.state.coordenadasRutas.map(
              variant => (
                <Marker
                  title={variant.id}
                  name={variant.id}
                  label={variant.id}
                  fecha={variant.id}
                  onClick={this.onMarkerClick}
                  icon={{
                       url: this.state.imagenEntrega
                     }}
                   position={{lat: variant.coordenadas[0].lat, lng: variant.coordenadas[0].lng}} />
                  ))
                }
                <Marker
                  title={this.state.ultimoID}
                  name={this.state.ultimoID}
                  label={this.state.ultimoID}
                  fecha={this.state.ultimoID}
                  onClick={this.onMarkerClick}
                  icon={{
                       url: this.state.imagenEntrega
                     }}
                   position={{lat: this.state.ultimoLat, lng: this.state.ultimoLng}} />
            {this.state.coordenadasRutas.map(
              variant => (
                <Polyline
                path={variant.coordenadas}
                strokeColor="#202156"
                visible={true}
                strokeOpacity={0.8}
                strokeWeight={1.5} />

                  ))
                }
            </Map>
        </Col>
        </Row>

        <Row style={{ paddingBottom:'1rem',marginTop:'2%',justifyContent: 'left',textAlign:"left",display:this.state.displayRuta}} >

          <Col sm={12} >
            <BootstrapTable
            pagination
            containerStyle={{width: '100%'}}
            data={ this.state.ordenes}
            options={ options }
            selectRow={ selectRow }
            exportCSV
            search
            >
            <TableHeaderColumn dataField='id' isKey={ true } dataSort={ true } >Id</TableHeaderColumn>
            <TableHeaderColumn dataField='OD_PAPEL' dataSort={ true }>Od</TableHeaderColumn>
            <TableHeaderColumn dataField='NOMBRE' dataSort={ true } >Nombre</TableHeaderColumn>
            <TableHeaderColumn dataField='DIRECCION' dataSort={ true }>Direccion</TableHeaderColumn>
            <TableHeaderColumn dataField='COMUNA' dataSort={ true }  >Comuna</TableHeaderColumn>

            <TableHeaderColumn
                   dataField='button'
                   dataFormat={this.cellButton.bind(this)}
                 />

            </BootstrapTable>
          </Col>
        </Row>

      </Container>

    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCnxZQw92wExvw6VWPC4nww2psARwSuy5g")
})(Rutaoptima);
