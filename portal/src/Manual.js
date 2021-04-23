import React, { Component } from 'react';
import { Button, Container, Row, Col, Dropdown, DropdownButton, Card, Alert, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import CSVReader from "react-csv-reader";
import Autocomplete from 'react-autocomplete';
import BarcodeReader from 'react-barcode-reader'
import FileBase64 from 'react-file-base64';
import TimePicker from 'react-time-picker';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import cors from 'cors';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Autocompleteg from "./Autocompleteg";
/* global google */

class Manual extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activoOperadores: true,
      iata: '',
      nombre: '',
      rut: '',
      loading: false,
      fecha: new Date(),
      valueCodigoChofer: '',
      valueOperador: '',
      displayEstadoEntrega: 'none',
      displayEstadoNoEntrega: 'none',
      displayGestion: 'none',
      ciudad: '',
      error: '',
      modal: false,
      modalfinalizado: false,
      activoEntrega: false,
      regiones: [
      ],
      operadores: [
      ],
      clientes: [],
      estados: [],
      tipo: [{ nombre: 'ENTREGA' }, { nombre: 'NO ENTREGA' }],
      tipoEscogido: 'SELECCIONA',
      estadoEscogido: 'SELECCIONA',
      codigoEstado: '',
      files: [],
      base64: '',
      nota: '',
      time: '10:00',
      idusuario: '',
      lat: 0,
      lng: 0,
      od: ''
    }
    this.changeTituloRegiones = this.changeTituloRegiones.bind(this);
    this.changeTituloOperadores = this.changeTituloOperadores.bind(this);
    this.changeFecha = this.changeFecha.bind(this);
    this.cambiarNombre = this.cambiarNombre.bind(this);
    this.cambiarRut = this.cambiarRut.bind(this);
    this.cambiarNota = this.cambiarNota.bind(this);
    this.cambiarOd = this.cambiarOd.bind(this);
    this.seleccionaTipo = this.seleccionaTipo.bind(this);
    this.seleccionaEstado = this.seleccionaEstado.bind(this);
    this.cargarGestion = this.cargarGestion.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCloseFinalizado = this.handleCloseFinalizado.bind(this);


  }

  handleClose() {
    this.setState({ modal: false });
  }
  handleCloseFinalizado() {
    this.setState({ modalfinalizado: false });
    window.location.reload();

  }

  cargarGestion() {
    console.log('llego a cargar gestion');
    var rut = this.state.rut;
    var rut_validado = this.Valida_Rut(rut);
    console.log(rut_validado);
    var iata = this.state.iata;
    var cod_chofer = this.state.valueCodigoChofer;
    var rut = this.state.rut;
    var datetime = this.state.fecha;
    var dia = this.agregarUnidad(datetime.getDate());
    var mes = this.agregarUnidad(datetime.getMonth() + 1);
    var hora = this.state.time;
    console.log(hora);
    var diaActual = dia + '/' + mes + '/' + datetime.getFullYear() + ' ' + hora + ':00';
    console.log(diaActual);
    var nombre = this.state.nombre;
    var codigoEstado = this.state.codigoEstado;
    console.log(codigoEstado);
    var lat = this.state.lat;
    var lng = this.state.lng;
    var base64 = this.state.base64;
    var od = this.state.od;
    var nota = this.state.nota;
    if (iata === '') {
      this.setState({
        error: 'Region no seleccionada',
        modal: true
      });
    } else if (cod_chofer === '') {
      this.setState({
        error: 'Chofer no seleccionado',
        modal: true
      });
    } else if ((nombre === '' && codigoEstado === '0') || (nombre === 'FALSE' && codigoEstado === '0')) {
      this.setState({
        error: 'Nombre no indicado',
        modal: true
      });
    } else if (codigoEstado === '') {
      this.setState({
        error: 'Estado no indicado',
        modal: true
      });
    } else if (rut_validado === false && codigoEstado === '0') {
      this.setState({
        error: 'Rut invalido',
        modal: true
      });
    } else if (this.state.tipoEscogido === 'SELECCIONA') {
      this.setState({
        error: 'Estado no indicado',
        modal: true
      });
    } else if (lat === 0) {
      this.setState({
        error: 'Direccion Invalida',
        modal: true
      });
    } else if (base64 === '') {
      this.setState({
        error: 'Imagen invalida',
        modal: true
      });
    } else if (od === '') {
      this.setState({
        error: 'Od vacia',
        modal: true
      });
    } else {
      this.setState({
        modalfinalizado: true,
        loading: true
      });
      var config = {
        headers: { "Content-Type": "application/json", "X-API-KEY": "55IcsddHxiy2E3q653RpYtb", "Access-Control-Allow-Origin": "*" }
      };
      let data = JSON.stringify({
        iata: iata,
        cod_chofer: cod_chofer,
        fecha: diaActual,
        nombre: nombre,
        rut: rut,
        codigo_estado: codigoEstado,
        lat: lat,
        lng: lng,
        base64: base64,
        od: od,
        nota: nota

      });
      axios.post("http://localhost:5000/registrarGestion", data, config)
        .then(res => {
          const respuesta = res.data;
          console.log(respuesta);
          this.setState({
            displayGestion: 'block',
            loading: false
          });
        });
    }
  }
  agregarUnidad(num) {
    console.log('tamaño es' + num.toString().length);
    if (num.toString().length === 1) {
      return ('0' + num);
    } else {
      return num;
    }
  }
  seleccionaTipo(tipo) {
    if (tipo === 'ENTREGA') {
      this.setState({
        tipoEscogido: tipo,
        displayEstadoEntrega: 'block',
        displayEstadoNoEntrega: 'none',
        codigoEstado: '0',
        activoEntrega: false
      });

    } else {
      this.setState({
        tipoEscogido: tipo,
        displayEstadoEntrega: 'none',
        displayEstadoNoEntrega: 'block',
        nombre: 'FALSE',
        rut: 'FALSE',
        activoEntrega: true
      });
    }
  }

  onChange = time => this.setState({ time: time });

  getFiles(files) {
    console.log(files.base64);
    var base64 = files.base64.split('base64,');
    console.log(base64[1]);

    this.setState({ base64: base64[1] });
  }

  seleccionaEstado(nombre, id) {
    console.log(nombre);
    console.log(id);
    this.setState({
      estadoEscogido: nombre,
      codigoEstado: id
    });


  }
  cambiarNombre(event) {
    var nombre = event.target.value;
    this.setState({
      nombre: nombre
    });
  }
  cambiarRut(event) {
    var rut = event.target.value;

    this.setState({
      rut: rut
    });
  }
  cambiarNota(event) {
    var nota = event.target.value;
    this.setState({
      nota: nota
    });
  }
  cambiarOd(event) {
    var od = event.target.value;
    this.setState({
      od: od
    });
  }
  changeTituloRegiones(item, value) {
    console.log('nombre es ' + item + 'iata es ' + value.iata);
    this.setState({
      activoOperadores: false,
      value: item,
      iata: value.iata
    });
    this.cargarAgentes(value.iata);
  }
  changeTituloOperadores(item, value) {
    console.log(value.id);
    this.setState({
      valueCodigoChofer: value.id,
      valueOperador: item
    });
  }
  showPlaceDetails(place) {
    console.log(place);
    try {
      var location = JSON.stringify(place.geometry.location, null, 2);
      var json = JSON.parse(location);
      console.log(location);
      console.log(json);
      var lat = json.lat;
      var lng = json.lng;
      console.log(lat);
      console.log(lng);
      this.setState({
        place: place,
        lat: lat,
        lng: lng
      });
    }
    catch (err) {
      this.setState({
        lat: 0,
        lng: 0
      });
    }


  }

  ocultarMapa(value) {
    this.setState({

      valueOperador: value
    });
  }

  changeFecha(date) {
    this.setState({
      fecha: date
    });
  }
  componentWillMount() {
    var url = document.URL;
    var urlseparada = url.split('tipo_usuario=');
    var idclientebusqueda = urlseparada[urlseparada.length - 1];
    idclientebusqueda = idclientebusqueda.replace('#', '');
    console.log(idclientebusqueda);
    this.setState({ idusuario: idclientebusqueda });
    var config = {
      headers: { "Content-Type": "application/json", "X-API-KEY": "55IcsddHxiy2E3q653RpYtb", "Access-Control-Allow-Origin": "*" }
    };
    axios.post("http://app.cargoex.cl:5000/clientes", config)
      .then(res => {
        var clientes = res.data;
        console.log('cliente de bd');
        console.log(clientes);
        const clientesBd = [];
        for (let cliente of clientes) {
          clientesBd.push({ id: cliente.ID, nombre: cliente.NOMBRE.toUpperCase() });
        }
        this.setState({ clientes: clientesBd });
      });
    axios.post("http://app.cargoex.cl:5000/estados", config)
      .then(res => {
        var estados = res.data;

        const estadosBd = [];
        for (let estado of estados) {
          estadosBd.push({ id: estado.CODIGO, nombre: estado.DESCRIPCION });
        }
        this.setState({ estados: estadosBd });
      });
    axios.get("http://app.cargoex.cl/app/cargoex/app/ciudades", config)
      .then(res => {
        const ciudades = res.data;
        const regionesBd = [];
        for (let city of ciudades.datos) {
          regionesBd.push({ iata: city.IATA, name: city.NOMBRE.toUpperCase() });
        }
        this.setState({ regiones: regionesBd });
      })
  }
  matchStocks(state, value) {
    return (
      state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.iata.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  matchOperadores(state, value) {
    return (
      state.id.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  ocultarvista(value) {
    this.setState({
      activoOperadores: true,
      value: value
    });
  }
  cargarAgentes(value) {
    var config = {
      headers: { "Content-Type": "application/json", "X-API-KEY": "55IcsddHxiy2E3q653RpYtb", "Access-Control-Allow-Origin": "*" }
    };
    let data = JSON.stringify({
      IATA: value
    });
    console.log('harallamado a servicio ' + value);
    axios.post("http://app.cargoex.cl/app/cargoex/app/choferes", data, config)
      .then(res => {
        const agentes = res.data;
        console.log(agentes);
        const agentesBd = [];
        for (let agente of agentes.datos) {
          agentesBd.push({ id: agente.COD_CHOFER, nombre: agente.NOMBRE.toUpperCase(), rut: agente.RUT });
        }
        this.setState({ ciudad: value, operadores: agentesBd });
      });
  }

  Valida_Rut(rutSeleccionado) {
    var tmpstr = "";
    var intlargo = rutSeleccionado;
    if (intlargo.length > 0) {
      var crut = rutSeleccionado;
      var largo = crut.length;
      if (largo < 2) {
        return false;
      }
      for (let i = 0; i < crut.length; i++)
        if (crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-') {
          tmpstr = tmpstr + crut.charAt(i);
        }
      var rut = tmpstr;
      var crut = tmpstr;
      var largo = crut.length;

      if (largo > 2)
        rut = crut.substring(0, largo - 1);
      else
        rut = crut.charAt(0);

      var dv = crut.charAt(largo - 1);

      if (rut == null || dv == null)
        return 0;

      var dvr = '0';
      var suma = 0;
      var mul = 2;

      for (let i = rut.length - 1; i >= 0; i--) {
        suma = suma + rut.charAt(i) * mul;
        if (mul == 7)
          mul = 2;
        else
          mul++;
      }

      var res = suma % 11;
      if (res == 1)
        dvr = 'k';
      else if (res == 0)
        dvr = '0';
      else {
        var dvi = 11 - res;
        dvr = dvi + "";
      }

      if (dvr != dv.toLowerCase()) {
        return false;
      }

      return true;
    }
  }
  render() {

    return (

      <Container  >
        <Row style={{ justifyContent: 'left', marginTop: '2rem' }}>
          <Modal show={this.state.modal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>FALTAN DATOS</Modal.Title>
            </Modal.Header>
            <Modal.Body> {this.state.error}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleClose}>
                OK
                        </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalfinalizado} onHide={this.handleCloseFinalizado}>
            <Modal.Header closeButton>
              <Modal.Title>PROCESANDO</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ justifyContent: 'center', textAlign: 'center' }}>
              <ClipLoader
                style={{ border: '1px solid' }}
                sizeUnit={"px"}
                size={150}
                color={'#202156'}
                loading={this.state.loading}
              />
              <p style={{
                color: '#202156', fontSize: 20, fontWeight: 'bold', display: this.state.displayGestion
              }} > Gestion Registrada Correctamente </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleCloseFinalizado} style={{
                display: this.state.displayGestion
              }} >
                OK
                        </Button>
            </Modal.Footer>
          </Modal>
          <Col style={{ zIndex: 2 }} sm={3} >
            <p style={{
              marginBottom: '0.5rem',
              color: '#202156', fontSize: 20, fontWeight: 'bold',
              justifyContent: 'left', textAlign: 'left'
            }}> REGIONES
                </p>
            <Autocomplete
              value={this.state.value}
              inputProps={{ id: 'states-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.regiones}
              getItemValue={item => item.name}
              shouldItemRender={this.matchStocks}
              onChange={(event, value) => this.ocultarvista(value)}
              onSelect={this.changeTituloRegiones}
              renderMenu={children => (
                <div className="menu">
                  {children}
                </div>
              )}
              renderItem={(item, isHighlighted) => (
                <div
                  className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                  key={item.iata} >
                  {item.name}
                </div>
              )}
            />
            {/*   <DropdownButton variant="danger" style={{ justifyContent: 'left',textAlign:'left'}}
                title={this.state.tituloRegiones}>
                {this.state.regiones.map(
                  variant => (
                        <Dropdown.Item as="button" id={variant.Nombre} onClick={this.changeTituloRegiones.bind(this)} >{variant.Nombre}</Dropdown.Item>
                      ))}
                </DropdownButton>
                */}
          </Col>
          <Col sm={3} style={{ justifyContent: 'left', textAlign: 'left', zIndex: 1 }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> OPERADOR</p>
            <Autocomplete
              value={this.state.valueOperador}
              disabled={this.state.activoOperadores}
              inputProps={{ id: 'states-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.operadores}
              getItemValue={item => item.nombre}
              shouldItemRender={this.matchOperadores}
              onChange={(event, value) => this.ocultarMapa(value)}
              onSelect={this.changeTituloOperadores}
              renderMenu={children => (
                <div className="menu">
                  {children}
                </div>
              )}
              renderItem={(item, isHighlighted) => (
                <div
                  className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                  key={item.id} >
                  {item.nombre}
                </div>
              )}
            />
            {/*  <DropdownButton variant="danger"
              disabled={this.state.activoOperadores} title={this.state.tituloOperadores}>
              {this.state.operadores.map(
                variant => (
                      <Dropdown.Item  as="button" id={variant.nombre}
                      onClick={this.changeTituloOperadores.bind(this)} >
                      {variant.nombre}</Dropdown.Item>
                    ))}
              </DropdownButton>
              */}
          </Col>
          <Col sm={3} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> FECHA</p>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={this.state.fecha}
              onChange={this.changeFecha}
            />
          </Col>
          <Col sm={3} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> HORA </p>

            <TimePicker
              onChange={this.onChange}
              format="h:mm a"
              value={this.state.time}
            />
          </Col>

        </Row>
        <Row style={{ justifyContent: 'left', marginTop: '2rem' }}>

          <Col sm={3} style={{ height: 90, justifyContent: 'left', textAlign: "left" }}>
            <p style={{
              marginBottom: '0.5rem',
              color: '#202156', fontSize: 20, fontWeight: 'bold',
              justifyContent: 'left', textAlign: 'left'
            }}> TIPO
                  </p>
            <DropdownButton
              title={this.state.tipoEscogido}
            >
              {this.state.tipo.map(
                variant => (
                  <Dropdown.Item onClick={this.seleccionaTipo.bind(this, variant.nombre)} >{variant.nombre}</Dropdown.Item>
                ))}
            </DropdownButton>
          </Col>
          <Col sm={3} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> ESTADO </p>
            <input
              id="text"
              type="text"
              name="name"
              autocomplete="off"
              disabled
              value="ENTREGADO"
              style={{ width: '80%', display: this.state.displayEstadoEntrega }}
            />
            <DropdownButton
              title={this.state.estadoEscogido}
              style={{ width: '70%', display: this.state.displayEstadoNoEntrega }}

            >
              {this.state.estados.map(
                variant => (
                  <Dropdown.Item onClick={this.seleccionaEstado.bind(this, variant.nombre, variant.id)} >{variant.nombre}</Dropdown.Item>
                ))}
            </DropdownButton>
          </Col>
          <Col sm={3} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> NOMBRE</p>
            <input
              id="text"
              type="text"
              name="name"
              autocomplete="off"
              disabled={this.state.activoEntrega}
              value={this.state.nombre}
              onChange={this.cambiarNombre}
              style={{ width: '100%' }}
            />
          </Col>
          <Col sm={3} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> RUT</p>
            <input
              id="text"
              type="text"
              name="name"
              autocomplete="off"
              disabled={this.state.activoEntrega}
              value={this.state.rut}
              onChange={this.cambiarRut}
              style={{ width: '80%' }}
            />
          </Col>
        </Row>
        <Row style={{ justifyContent: 'left' }}>
          <Col sm={4} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> DIRECCION </p>

            <Autocompleteg onPlaceChanged={this.showPlaceDetails.bind(this)} />


          </Col>
          <Col sm={4} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> SUBIR IMAGEN </p>
            <FileBase64
              multiple={false}
              onDone={this.getFiles.bind(this)} />
          </Col>
          <Col sm={4} style={{ justifyContent: 'left', textAlign: 'left' }} >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> OD </p>

            <input
              id="text"
              type="number"
              name="od"
              autocomplete="off"
              value={this.state.od}
              onChange={this.cambiarOd}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} style={{ textAlign: 'center', justifyContent: 'center' }}  >
            <p style={{
              textAlign: "center", marginBottom: '0.5rem', color: '#202156',
              fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
            }}> NOTA </p>

            <input
              id="text"
              type="text"
              name="nota"
              autocomplete="off"
              value={this.state.nota}
              onChange={this.cambiarNota}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} style={{ textAlign: 'center', justifyContent: 'center', marginTop: '4%' }}  >
            <Button style={{ textAlign: 'center', border: '1px solid' }}
              variant="primary"
              onClick={this.cargarGestion.bind(this)}
            >
              Registrar Gestion
          </Button>
          </Col>
        </Row>
      </Container>

    );
  }
}


export default Manual;
