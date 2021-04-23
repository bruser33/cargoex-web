import React, {Component} from 'react';
import {
    Button,
    Container,
    Row,
    Col,
    Dropdown,
    DropdownButton,
    Card,
    Alert,
    InputGroup,
    FormControl,
    Modal
} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polyline} from 'google-maps-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {css} from '@emotion/core';
import {ClipLoader} from 'react-spinners';
import Autocomplete from 'react-autocomplete';
import ReactToPrint from "react-to-print";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Sector,
    Cell,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import cors from 'cors';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import jsPDF from 'jspdf';
import Autocompleteg from "./Autocompleteg";

/* global google */
class ComponentToPrint extends React.Component {
    render() {
        return (
            <Container>
                {this.props.impresion.map(
                    variant => (
                        <Row style={{marginTop: '0rem'}}>
                            <Col style={{height: 630}} sm={12}>
                                <div style={{
                                    height: 630,
                                    border: '3px solid',
                                    borderRadius: '1rem 1rem 1rem 1em ',
                                    borderColor: '#202156',
                                    maxWidth: '93%',
                                    marginLeft: '3rem'
                                }}>
                                    <div style={{height: 400}}>
                                        <img style={{
                                            textAlign: 'right',
                                            justifyContent: 'center',
                                            marginLeft: '69%',
                                            height: 100,
                                            marginTop: '-0.5rem'
                                        }} src={'http://www.cargoex.cl/cargoex.png'}/>
                                        <p style={{
                                            color: '#202156',
                                            textAlign: 'left',
                                            paddingLeft: '1rem',
                                            fontSize: 30,
                                            marginTop: '-5.5rem',
                                            fontWeight: 600
                                        }}>FH IMPRESION : {variant.fecha}</p>
                                        <p style={{
                                            color: '#202156',
                                            textAlign: 'left',
                                            marginTop: '-1rem',
                                            paddingLeft: '1rem',
                                            maxWidth: '70%',
                                            fontSize: 30,
                                            fontWeight: 600
                                        }}>DESTINO :</p>
                                        <p style={{
                                            color: '#202156',
                                            textAlign: 'left',
                                            marginTop: '-2rem',
                                            paddingLeft: '1rem',
                                            maxWidth: '100%',
                                            fontSize: 52,
                                            fontWeight: 'bold'
                                        }}>   {variant.destino} <strong style={{
                                            color: '#202156',
                                            fontSize: 30,
                                            fontWeight: 600
                                        }}> ({variant.padre}) </strong></p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            marginTop: '-2rem',
                                            fontSize: 30,
                                            fontWeight: 600
                                        }}>GUIA : {variant.guia} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            marginTop: '-1rem',
                                            fontSize: 30,
                                            fontWeight: 600
                                        }}>DIRECCION : {variant.direccion} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            maxWidth: '70%',
                                            fontSize: 30,
                                            marginTop: '-1rem',
                                            fontWeight: 600
                                        }}>DESTINATARIO : {variant.destinatario} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            maxWidth: '70%',
                                            marginTop: '-1rem',
                                            fontSize: 30,
                                            fontWeight: 600
                                        }}>TELEFONO : {variant.telefono}  </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            maxWidth: '70%',
                                            marginTop: '-1rem',
                                            fontSize: 36,
                                            fontWeight: 'bold'
                                        }}>CLIENTE ORIGEN : {variant.cliente} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            maxWidth: '70%',
                                            marginTop: '-1rem',
                                            fontSize: 30,
                                            fontWeight: 600
                                        }}>ORIGEN : {variant.origen} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            maxWidth: '80%',
                                            marginTop: '-1rem',
                                            fontSize: 30,
                                            fontWeight: 600
                                        }}>NOTA : {variant.nota} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            marginTop: '-19rem',
                                            fontSize: 42,
                                            marginLeft: '68%',
                                            fontWeight: 'bold'
                                        }}> OD : {variant.od} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            marginTop: '-2rem',
                                            fontSize: 42,
                                            marginLeft: '68%',
                                            fontWeight: 'bold'
                                        }}> BULTOS : {variant.id}/{variant.bultos} </p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            marginTop: '-1.5rem',
                                            fontSize: 30,
                                            marginLeft: '68%',
                                            fontWeight: 600
                                        }}>PESO : {variant.peso} kg</p>
                                        <p style={{
                                            color: '#202156',
                                            paddingLeft: '1rem',
                                            textAlign: 'left',
                                            marginTop: '-1.5rem',
                                            fontSize: 30,
                                            marginLeft: '68%',
                                            fontWeight: 600
                                        }}>TIPO : {variant.tipo} </p>

                                    </div>
                                    <div>
                                        <p className="barcode" style={{
                                            fontSize: '1000%',
                                            marginTop: '2rem',
                                            textAlign: 'center'
                                        }}>*{variant.tn}*</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    ))}


            </Container>
        );
    }
}

class Etiqueta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            place: {},
            clientes: [],
            tns: [],
            regiones: [],
            impresion: [],
            ramales: [],
            costos: [],
            tipoOrden: [{nombre: 'Caja'}, {nombre: 'Sobre'}],
            tipoOrdenEscogido: 'Caja',
            tipoCostoEscogido: 'Selecciona Centro de Costo',
            idCostoEscodigo: '',
            ramalEscogido: 'Busca Ramal',
            iataRamalEscogido: '',
            displayod: 'none',
            displayManifiesto: 'none',
            correoCliente: '',
            value: '',
            od: '',
            manifiesto: '',
            destino: '',
            direccion: '',
            destinatario: '',
            telefono: '',
            portal: '',
            origen: '',
            bultos: '',
            largo: '',
            ancho: '',
            peso: '',
            alto: '',
            idcliente: '',
            mensaje: '',
            modal: false,
            modalCorreo: false,
            modalCambiarCorreo: false,
            modalMensaje: false,
            modalCreacionod: false,
            modalFinalizado: false,
            modalpickeado: false,
            displaycorreonovalido: 'none',
            loading: false,
            displayFormulario: 'none',
            checkPrint: false

        };
        this.validarOd = this.validarOd.bind(this);
        this.setCorreoCliente = this.setCorreoCliente.bind(this);
        this.changeTituloClientes = this.changeTituloClientes.bind(this);
        this.cerrarManifiesto = this.cerrarManifiesto.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseMensaje = this.handleCloseMensaje.bind(this);
        this.handleCloseCreacionod = this.handleCloseCreacionod.bind(this);
        this.handleCloseFinalizado = this.handleCloseFinalizado.bind(this);
        this.handleClosePickeado = this.handleClosePickeado.bind(this);
        this.handleClose2 = this.handleClose2.bind(this);
        this.seleccionaRamal = this.seleccionaRamal.bind(this);
        this.seleccionaTipoOrden = this.seleccionaTipoOrden.bind(this);
        this.seleccionaTipoCosto = this.seleccionaTipoCosto.bind(this);
        this.focusInput = this.focusInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.crearod = this.crearod.bind(this);
        this.changePrinted = this.changePrinted.bind(this);
        //  this.crearPdf = this.crearPdf.bind(this);
    }

    crearod() {
        var od = this.state.od;
        this.setState({
            displayFormulario: 'flex',
            modalCreacionod: false
        });
    }

    changePrinted(event) {
        const printaux = this.state.checkPrint;
        this.setState({
            checkPrint: !printaux
        });

    }

    handleKeyDown(event) {
        console.log('llego al key down');
        var ode = this.state.od;
        var idcliente = this.state.idcliente;
        console.log('va a buscar');
        console.log(ode);
        console.log(idcliente);
        if (event.key === 'Enter') {
            this.setState({loading: true});
            var config = {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                    "Access-Control-Allow-Origin": "*"
                }
            };
            let data = JSON.stringify({
                od: ode,
                idcliente: idcliente
            });
            axios.post("http://localhost:5000/validarOd", data, config)
                .then(res => {
                    const od = res.data;
                    if (od[0] !== 'false') {
                        this.setState({
                            od: ''
                        });
                        const tns = this.state.tns;
                        const regiones = this.state.regiones;
                        const impresion = [];
                        const id = od[0].ID;
                        let data2 = JSON.stringify({
                            od: ode,
                            idcliente: idcliente,
                            bultos: od[0].BULTOS
                        });
                        var manifiestoCarga = this.state.manifiesto;
                        let data3 = JSON.stringify({
                            od: od[0].OD,
                            idcliente: idcliente,
                            bultos: od[0].BULTOS,
                            manifiesto: manifiestoCarga
                        });
                        console.log('od es ');
                        console.log(od);
                        console.log("data 3 es "+data3);
                        axios.post("http://localhost:5000/getTn", data3, config)
                            .then(res => {
                                const respuestaTns = res.data;
                                console.log("llego a mostrar ",respuestaTns);
                                for (let region of regiones) {
                                    if (od[0].DESTINO === region.iata) {
                                        od[0].DESTINO = region.name;
                                        od[0].PADRE = region.padre + '';
                                    }
                                    if (od[0].COMUNA_ORIGEN === region.iata) {
                                        od[0].COMUNA_ORIGEN = region.name;
                                    }
                                }
                                for (let region of regiones) {
                                    if (od[0].PADRE === region.iata) {
                                        od[0].PADRE = region.name.substring(0, 13);
                                    }
                                }
                                var indice = 1;
                                var datetime = new Date();
                                var dia = this.agregarUnidad(datetime.getDate());
                                var mes = this.agregarUnidad(datetime.getMonth() + 1);
                                var hora = this.agregarUnidad(datetime.getHours());
                                var minutos = this.agregarUnidad(datetime.getMinutes());
                                var segundos = this.agregarUnidad(datetime.getSeconds());
                                var diaActual = datetime.getFullYear() + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos;
                                for (let tn of respuestaTns) {
                                    var aux = true;
                                    impresion.push(
                                        {
                                            id: indice,
                                            nota: od[0].NOTA.substring(0, 27),
                                            od: od[0].OD,
                                            padre: od[0].PADRE,
                                            destino: od[0].DESTINO.substring(0, 23),
                                            direccion: od[0].DIRECCION.substring(0, 26),
                                            destinatario: od[0].DESTINATARIO.substring(0, 23),
                                            telefono: od[0].TELEFONO.substring(0, 23),
                                            origen: od[0].COMUNA_ORIGEN.substring(0, 23),
                                            bultos: od[0].BULTOS,
                                            largo: od[0].LARGO,
                                            ancho: od[0].ANCHO,
                                            peso: od[0].PESO,
                                            alto: od[0].ALTO,
                                            tipo: od[0].TIPO_ORDEN,
                                            guia: od[0].ID_REFERENCIA.substring(0, 23),
                                            tn: tn.tn,
                                            fecha: diaActual,
                                            cliente: this.state.value.substring(0, 17),
                                            manifiesto: tn.manifiesto
                                        }
                                    );
                                    for (let tnaux of tns) {
                                        if (tnaux.tn === tn.tn) {
                                            aux = false;
                                            this.setState({modalpickeado: true});

                                        }
                                    }
                                    if (aux) {
                                        tns.push({
                                            id: indice,
                                            od: od[0].OD,
                                            destino: od[0].DESTINO,
                                            direccion: od[0].DIRECCION,
                                            destinatario: od[0].DESTINATARIO,
                                            telefono: od[0].TELEFONO,
                                            origen: od[0].COMUNA_ORIGEN,
                                            bultos: od[0].BULTOS,
                                            largo: od[0].LARGO,
                                            ancho: od[0].ANCHO,
                                            peso: od[0].PESO,
                                            alto: od[0].ALTO,
                                            tn: tn.tn,
                                            manifiesto: tn.manifiesto,
                                            guia: od[0].ID_REFERENCIA,
                                            cliente: this.state.value,
                                            BULTOS: indice + '/' + od[0].BULTOS
                                        });
                                    }
                                    indice++;
                                }
                                var manifest = tns[0].manifiesto;
                                if (tns.length > 0) {
                                    this.setState({
                                        tns: tns,
                                        impresion: impresion,
                                        displayManifiesto: 'block',
                                        manifiesto: manifest,
                                        loading: false
                                    });
                                }
                                if(this.state.checkPrint){
                                    document.getElementById("print").click();
                                }
                            });
                    } else {
                        console.log('respondio falso');
                        console.log(od);
                        console.log(od[1]);
                        if (od[1] === 'No se encuentra informado numero de guia o numero de od') {
                            console.log('se cumplio igualdad');
                            this.setState({
                                modalCreacionod: true,
                                mensaje: od[1],
                                loading: false
                            });
                        } else {
                            this.setState({
                                modalMensaje: true,
                                mensaje: od[1],
                                loading: false
                            });
                        }
                    }
                });
        }
    }

    setCorreoCliente(event) {
        var correo = event.target.value;
        console.log(correo);
        this.setState({correoCliente: correo});
    }

    showPlaceDetails(place) {
        this.setState({place});
    }


    focusInput(event) {
        console.log('llego al focus input');
        document.getElementById('numero').focus();

    }

    seleccionaTipoOrden(orden) {

        this.setState({tipoOrdenEscogido: orden});
    }

    seleccionaTipoCosto(idcosto, nombrecosto) {

        this.setState({
            tipoCostoEscogido: nombrecosto,
            idCostoEscodigo: idcosto
        });
    }

    seleccionaRamal(iata, nombre, padre) {
        console.log(iata);
        console.log(nombre);
        console.log(padre);
        this.setState({ramalEscogido: nombre, iataRamalEscogido: iata});
    }

    handleClose() {
        this.setState({modal: false});
    }

    handleCloseCreacionod() {
        this.setState({
            modalCreacionod: false,
            displayFormulario: 'none',
            od: ''
        });
    }

    handleCloseMensaje() {
        this.setState({modalMensaje: false});
    }

    handleCloseFinalizado() {
        this.setState({modalFinalizado: false});
    }

    handleClosePickeado() {
        this.setState({modalpickeado: false});
    }

    handleClose2() {
        const correo = this.state.correoCliente;
        var idcliente = this.state.idcliente;
        var manifest = this.state.manifiesto;
        var nombrecliente = this.state.value;
        var datetime = new Date();
        var dia = this.agregarUnidad(datetime.getDate());
        var mes = this.agregarUnidad(datetime.getMonth() + 1);
        var hora = this.agregarUnidad(datetime.getHours());
        var minutos = this.agregarUnidad(datetime.getMinutes());
        var segundos = this.agregarUnidad(datetime.getSeconds());
        var diaActual = datetime.getFullYear() + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos;
        console.log('id cliente es al cerrar');
        console.log(idcliente);
        console.log('nombrecliente es');
        console.log(nombrecliente);
        if (correo.includes("@") && correo.includes(".")) {
            console.log('sisas');
            var config = {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                    "Access-Control-Allow-Origin": "*"
                }
            };
            let data = JSON.stringify({
                correo: correo,
                idcliente: idcliente
            });
            axios.post("http://localhost:5000/registrarCorreo", data, config)
                .then(res => {
                    console.log('react respondio el registro de correo');
                    this.setState({modalCorreo: false});
                    var manifest = this.state.manifiesto;
                    let data2 = JSON.stringify({
                        idmanifiesto: manifest,
                        correocliente: correo,
                        tns: this.state.tns,
                        nombrecliente: nombrecliente,
                        idcliente: idcliente,
                        dia: diaActual

                    });
                    axios.post("http://localhost:5000/cerrarManifiesto", data2, config)
                        .then(res => {
                            console.log('react respondio el cierre de manifiesto');
                            var arrayVacio = [];
                            this.setState({
                                tns: arrayVacio,
                                impresion: arrayVacio,
                                displayManifiesto: 'none',
                                value: '',
                                idcliente: '',
                                displayod: 'none',
                                displaycorreonovalido: 'none',
                                correoCliente: correo,
                                modalCorreo: false,
                                modalCambiarCorreo: false
                            });
                            window.location.reload();

                        });
                });
        } else {
            this.setState({
                displaycorreonovalido: 'block'
            });
        }
    }

    handleShow() {
        this.setState({modal: true});
    }

    agregarUnidad(num) {
        console.log('tamaño es' + num.toString().length);
        if (num.toString().length === 1) {
            return ('0' + num);
        } else {
            return num;
        }
    }

    cerrarManifiesto(item, value) {
        var manifest = this.state.manifiesto;

        var config = {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                "Access-Control-Allow-Origin": "*"
            }
        };

        const correoCliente = this.state.correoCliente;
        console.log('correo cliente es');
        console.log(correoCliente);
        if (correoCliente === '0' || correoCliente === '') {
            console.log('igual a cero el correo');
            this.setState({
                correoCliente: '',
                modalCorreo: true,
                displaycorreonovalido: 'none'
            });
        } else {
            this.setState({
                modalCambiarCorreo: true,
                displaycorreonovalido: 'none'
            });
            /*  var nombrecliente = this.state.value;
              console.log('tns a cerrar son ');
              console.log(this.state.tns);
              let data = JSON.stringify({
                idmanifiesto: manifest,
                correocliente:correoCliente,
                tns:this.state.tns,
                nombrecliente:nombrecliente
              });
              console.log(this.state.tns);
                axios.post("http://localhost:5000/cerrarManifiesto",data,config)
                    .then(res => {
                        console.log('react respondio el cierre de manifiesto');
                        var arrayVacio= [];
                        this.setState({
                          tns:arrayVacio,
                          impresion:arrayVacio,
                          displayManifiesto:'none',
                          value:'',
                          idcliente:'',
                          displayod:'none',
                          displaycorreonovalido:'none',
                          modalFinalizado:true
                        });
              });
              */
        }
    }

    validarOd(event) {
        var ode = event.target.value;
        var idcliente = this.state.idcliente;

        this.setState({
            od: event.target.value
        });
    }

    changeTituloClientes(item, value) {
        console.log('cambio cliente');
        console.log(value.correo);
        var config = {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                "Access-Control-Allow-Origin": "*"
            }
        };
        let data2 = JSON.stringify({
            od: this.state.portal,
            idcliente: value.id
        });

        axios.post("http://localhost:5000/getManifiesto", data2, config)
            .then(res => {
                var manifiestoCarga = res.data[0].MANIFIESTO;
                console.log(value);

                this.setState({
                    value: item,
                    idcliente: value.id,
                    correoCliente: value.correo,
                    displayod: 'block',
                    manifiesto: manifiestoCarga
                });
            });
    }

    componentDidMount() {

        var url = document.URL;
        var urlseparada = url.split('tipo_usuario=');
        var urlseparacion2 = urlseparada[1].split('&portal=');
        var idclientebusqueda = urlseparacion2[0];
        var portal = urlseparacion2[1].replace('#', '');
        idclientebusqueda = idclientebusqueda.replace('#', '');
        console.log(idclientebusqueda);
        console.log(portal);
        var config = {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                "Access-Control-Allow-Origin": "*"
            }
        };
        axios.post("http://localhost:5000/clientes", config)
            .then(res => {
                var clientes = res.data;
                console.log('cliente de bd');
                console.log(clientes);
                const clientesBd = [];
                for (let cliente of clientes) {

                    if (idclientebusqueda === 'admin') {
                        clientesBd.push({id: cliente.ID, name: cliente.NOMBRE, correo: cliente.CORREO});

                    } else {
                        if (cliente.ID + '' === idclientebusqueda + '') {
                            clientesBd.push({id: cliente.ID, name: cliente.NOMBRE, correo: cliente.CORREO});
                        }
                    }


                }
                console.log(clientesBd);
                this.setState({clientes: clientesBd, portal: portal});
                //
                /*
                    for(let city of ciudades.datos){
                      regionesBd.push({iata: city.IATA,name: city.NOMBRE.toUpperCase()});
                    }
                    regionesBd.push({iata:'todos',name:'TODOS'});

                    */
            });
        axios.get("http://app.cargoex.cl/app/cargoex/app/ciudades", config)
            .then(res => {
                const ciudades = res.data;
                const regionesBd = [];
                const ramales = [];
                console.log('ciudades son');
                console.log(ciudades);
                for (let city of ciudades.datos) {

                    regionesBd.push({iata: city.IATA, name: city.NOMBRE.toUpperCase(), padre: city.IATA_PADRE});
                    if (city.TIPO_DESCRIPCION === 'RAMAL') {
                        ramales.push({iata: city.IATA, name: city.NOMBRE.toUpperCase(), padre: city.IATA_PADRE});
                    }
                }
                this.setState({regiones: regionesBd, ramales: ramales});
            });
        /*
            let data = JSON.stringify({
              idcliente: idclientebusqueda
            });
            axios.post("http://localhost:5000/getCentroCosto",data,config)
              .then(res => {
                const costos = res.data;
                console.log('costos son');
                console.log(costos);
                this.setState({ costos:costos});
            });
            */
    }

    matchStocks(state, value) {
        return (

            state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    cambiarCliente(value) {
        this.setState({
            displayod: 'none',
            value: value
        });
    }

    render() {
        const AddressDetails = props => {
            return (
                <div>
                    <pre>{JSON.stringify(props.place, null, 2)}</pre>
                </div>
            )
        };
        return (

            <Container>
                <Row style={{justifyContent: 'left', marginTop: '2rem', marginBottom: '1rem'}}>
                    <Col sm={3} style={{zIndex: 2, height: 70, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> Selecciona Cliente:
                        </p>
                        <Autocomplete
                            value={this.state.value}
                            inputProps={{id: 'states-autocomplete'}}
                            wrapperStyle={{position: 'relative', display: 'inline-block'}}
                            items={this.state.clientes}
                            getItemValue={item => item.name}
                            shouldItemRender={this.matchStocks}
                            onChange={(event, value) => this.cambiarCliente(value)}
                            onSelect={this.changeTituloClientes}
                            renderMenu={children => (
                                <div className="menu">
                                    {children}
                                </div>
                            )}
                            renderItem={(item, isHighlighted) => (
                                <div
                                    className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                                    key={item.id}>
                                    {item.name}
                                </div>
                            )}
                        />
                    </Col>
                    <Col sm={3} style={{height: 70, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayod
                        }}> ¿Deseas imprimir?
                        </p>
                        <input
                            name="isGoing"
                            type="checkbox"
                            checked={this.state.checkPrint}
                            onChange={this.changePrinted}
                            style={{
                                color: '#202156', fontWeight: 'bold', width: '20px', height: '20px', zoom: 1.1,
                                marginLeft: '25%', marginBottom: '5rem', display: this.state.displayod
                            }}/>
                    </Col>
                    <Col sm={3} style={{height: 70, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayod
                        }}> Pickea Numero:
                        </p>
                        <input
                            id="numero"
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            onKeyDown={this.handleKeyDown}
                            style={{display: this.state.displayod}}
                        />
                    </Col>
                </Row>
                <Modal show={this.state.modalpickeado} onHide={this.handleClosePickeado}>
                    <Modal.Header closeButton>
                        <Modal.Title>OD REPETIDA</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> od {this.state.od} o numero de guia ya fue pickeado</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClosePickeado}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.modalFinalizado} onHide={this.handleCloseFinalizado}>
                    <Modal.Header closeButton>
                        <Modal.Title>Manifiesto terminado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><h3>Has terminado el manifiesto, se ha enviado un respaldo al
                        correo {this.state.correoCliente} </h3></Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleCloseFinalizado}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.modalMensaje} onHide={this.handleCloseMensaje}>
                    <Modal.Header closeButton>
                        <Modal.Title>Alerta !</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><h1>{this.state.mensaje} </h1></Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleCloseMensaje}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalCreacionod} onHide={this.handleCloseCreacionod}>
                    <Modal.Header closeButton>
                        <Modal.Title>Alerta !</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><h1> No se encuentra informado numero de guia o numero de od</h1></Modal.Body>
                    <Modal.Footer style={{textAlign: "left", justifyContent: 'left'}}>
                        {/*}  <Button variant="primary" onClick={this.crearod} style={{textAlign:"left",justifyContent: 'left',marginLeft:'25%'}}>
                            SI
                      </Button>
                      <Button variant="danger" onClick={this.handleCloseCreacionod}  style={{marginLeft:'30%'}}>
                            NO
                      </Button>  */}
                    </Modal.Footer>
                </Modal>
                {/*
        <Modal show={this.state.modal} onHide={this.handleClose}>
              <Modal.Header closeButton>
                    <Modal.Title>Numero no encontrado</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>¿ Posee la orden de transporte impresa ? </Modal.Body>
                  <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                            Si
                          </Button>
                          <Button variant="primary" onClick={this.handleClose}>
                            No
                          </Button>
                        </Modal.Footer>
        </Modal>
        */}
                <Row style={{justifyContent: 'center', marginTop: '3rem', display: 'none'}}>

                    <Col sm={12} style={{height: 40, justifyContent: 'left', textAlign: "left"}}>
                        <Modal show={this.state.modalCorreo}>
                            <Modal.Header>
                                <Modal.Title>Tu correo no esta registrado, por favor ingrésalo</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input
                                    type="text"
                                    name="name"
                                    value={this.state.correoCliente}
                                    onChange={this.setCorreoCliente}
                                    style={{width: '100%'}}
                                />
                                <p style={{color: '#ff0000', display: this.state.displaycorreonovalido}}>ESTE CORREO NO
                                    ES VALIDO</p>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" autocomplete='off' onClick={this.handleClose2}>
                                    Aceptar
                                </Button>

                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col sm={12} style={{height: 40, justifyContent: 'left', textAlign: "left"}}>
                        <Modal show={this.state.modalCambiarCorreo}>
                            <Modal.Header>
                                <Modal.Title>Tenemos este correo registrado, puedes cambiarlo si lo
                                    deseas </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input
                                    type="text"
                                    name="name"
                                    value={this.state.correoCliente}
                                    onChange={this.setCorreoCliente}
                                    style={{width: '100%'}}
                                />
                                <p style={{color: '#ff0000', display: this.state.displaycorreonovalido}}>ESTE CORREO NO
                                    ES VALIDO</p>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" autocomplete='off' onClick={this.handleClose2}>
                                    Aceptar
                                </Button>

                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>

                <Row style={{justifyContent: 'center', display: this.state.displayFormulario}}>

                    <Col sm={12} style={{height: 120, justifyContent: 'center', textAlign: "center"}}>
                        <p style={{
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'center', textAlign: 'center'
                        }}> CAMPOS MARCADOS EN (*) SON OBLIGATORIO, PARA LOS DEMAS DE LLENARSE HARA MAS EFICIENTE LA
                            GESTION EN TERRENO
                        </p>


                    </Col>

                </Row>

                <Row style={{justifyContent: 'center', display: this.state.displayFormulario}}>

                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> ORDEN DE TRANSPORTE: (*)
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> NOMBRE:(*)
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> RUT: (*)
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> DIRECCION: (*)
                        </p>
                        <Autocompleteg onPlaceChanged={this.showPlaceDetails.bind(this)}/>

                    </Col>

                </Row>
                <Row style={{justifyContent: 'center', display: this.state.displayFormulario}}>

                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> COMUNA: (*)
                        </p>
                        <DropdownButton
                            title={this.state.ramalEscogido}
                        >
                            {this.state.ramales.map(
                                variant => (
                                    <Dropdown.Item
                                        onClick={this.seleccionaRamal.bind(this, variant.iata, variant.name, variant.padre)}>{variant.name}</Dropdown.Item>
                                ))}
                        </DropdownButton>
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> TIPO DE ORDEN:
                        </p>
                        <DropdownButton
                            title={this.state.tipoOrdenEscogido}
                        >
                            {this.state.tipoOrden.map(
                                variant => (
                                    <Dropdown.Item
                                        onClick={this.seleccionaTipoOrden.bind(this, variant.nombre)}>{variant.nombre}</Dropdown.Item>
                                ))}
                        </DropdownButton>
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> TELEFONO:
                        </p>
                        <input
                            type="number"
                            name="name"
                            autocomplete="off"

                            style={{width: '100%', marginTop: '0.5rem'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> MAIL:
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%', marginTop: '0.5rem'}}
                        />
                    </Col>

                </Row>
                <Row style={{justifyContent: 'center', display: this.state.displayFormulario}}>

                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> GUIA: (*)
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> LARGO(cm):
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 15, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> ALTO(cm):
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> ANCHO(cm):
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>

                </Row>
                <Row style={{justifyContent: 'center', display: this.state.displayFormulario}}>

                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> PESO(KG):
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left", height: 100}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> CODIGO DE BARRA :
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left", height: 100}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> NUMERO DE BOLETA:
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left", height: 100}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> COMUNA DE ORIGEN :
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%'}}
                        />
                    </Col>

                </Row>
                <Row style={{display: this.state.displayFormulario, paddingBottom: '1.5rem'}}>
                    <Col sm={3} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> CENTRO DE COSTO:
                        </p>
                        <DropdownButton
                            title={this.state.tipoCostoEscogido}
                        >
                            {this.state.costos.map(
                                variant => (
                                    <Dropdown.Item
                                        onClick={this.seleccionaTipoCosto.bind(this, variant.ID, variant.DESCRIPCION)}>{variant.DESCRIPCION}</Dropdown.Item>
                                ))}
                        </DropdownButton>
                    </Col>
                    <Col sm={9} style={{height: 90, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 17, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> NOTA:
                        </p>
                        <input
                            type="text"
                            name="name"
                            autocomplete="off"
                            value={this.state.od}
                            onChange={this.validarOd}
                            style={{width: '100%', marginTop: '0.5rem'}}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <div style={{justifyContent: 'center', textAlign: "center"}}>
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
                    <Col sm={3} style={{
                        height: 70,
                        justifyContent: 'left',
                        textAlign: "left",
                        display: this.state.displayManifiesto
                    }}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayManifiesto
                        }}> BULTOS: {this.state.tns.length}
                        </p>

                    </Col>
                </Row>
                {this.state.tns.map(
                    variant => (
                        <Row style={{display: 'block', border: '1px solid', borderColor: '#202156'}}>
                            <Col sm={12} style={{justifyContent: 'left', textAlign: "left"}}>
                                <p style={{marginTop: '1rem', color: '#202156'}}> OD :&nbsp;&nbsp;&nbsp; <b
                                    style={{fontSize: 20}}> {variant.od}</b> &nbsp;&nbsp;&nbsp; TN :  &nbsp;&nbsp;&nbsp;
                                    <b style={{fontSize: 20}}>{variant.tn} </b>  &nbsp;&nbsp;&nbsp;  DESTINO
                                    : {variant.destino} ORIGEN : {variant.origen}</p>

                            </Col>

                        </Row>
                    ))}


                <Row style={{
                    justifyContent: 'center',
                    marginTop: '1rem',
                    display: this.state.displayManifiesto,
                    textAlign: "center"
                }}>
                    <Button
                        variant="primary"
                        onClick={this.cerrarManifiesto.bind(this)}
                    >
                        Terminar Manifiesto
                    </Button>
                </Row>

                <Row style={{justifyContent: 'center', marginTop: '3rem', display: 'none'}}>
                    <Col sm={12} style={{height: 40, justifyContent: 'center', textAlign: "center"}}>
                        <ReactToPrint
                            onAfterPrint={this.focusInput}
                            trigger={() => <a href="#" id="print">Print this out!</a>}
                            content={() => this.componentRef}
                        />
                        <div>
                            <ComponentToPrint impresion={this.state.impresion} ref={el => (this.componentRef = el)}/>
                        </div>
                    </Col>
                </Row>
            </Container>

        );
    }
}


export default Etiqueta;
