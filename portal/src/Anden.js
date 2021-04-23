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

class Anden extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tn: '',
            idcliente: '',
            correocliente: '',
            nombrecliente: '',
            displayidmanifiesto: 'none',
            idmanifiesto: 0,
            totalbutos: 0,
            totalods: 0,
            displayresultado: 'none',
            flagmanifiestocargado: false,
            displaymanifiestoincompleto: 'none',
            tns: [],
            tnspickeados: [],
            tnsfaltantes: [],
            modalod: false,
            modalpegar: false,
            modalpickeado: false,
            modalvacio: false,
            modalAnden: false,
            operadores: [],
            choferActivo: 'none',
            motivo: '',
            motivoStatus: true,
            modalincompleto: false,
            displayManifiestoPasado: 'none',
            displayCompleto: false,
            disableTextField:false


        };
        this.validarTn = this.validarTn.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShowPegar = this.handleShowPegar.bind(this);
        this.handleClosePegar = this.handleClosePegar.bind(this);
        this.handleShowPickeado = this.handleShowPickeado.bind(this);
        this.handleClosePickeado = this.handleClosePickeado.bind(this);
        this.handleCloseVacio = this.handleCloseVacio.bind(this);
        this.handleCloseAnden = this.handleCloseAnden.bind(this);
        this.handleCloseIncompleto = this.handleCloseIncompleto.bind(this);
        this.cerrarManifiestoIncompleto = this.cerrarManifiestoIncompleto.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.ocultarvista = this.ocultarvista.bind(this);
        this.changeTituloOperadores = this.changeTituloOperadores.bind(this);
        this.handleCompleto = this.handleCompleto.bind(this);

    }

    componentDidMount() {
        var url = document.URL;
        var urlseparada = url.split('portal=');
        var portal = urlseparada[1].replace('#', '');
        this.setState({portal});
        var config = {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                "Access-Control-Allow-Origin": "*"
            }
        };
        axios.post("http://localhost:5000/getChoferes", config)
            .then(res => {
                this.setState({operadores: res.data})
            });
    }

    handleCloseIncompleto(event) {
        this.setState({modalincompleto: false});
    }
    handleCompleto(event) {
        this.setState({displayCompleto: false});
    }
    handleKeyDown(event) {
        var tn = this.state.tn;
        var flagmanifiestocargado = this.state.flagmanifiestocargado;
        if (event.key === 'Enter') {
            this.setState({disableTextField: true});
            if (flagmanifiestocargado) {
                var tns = this.state.tns;
                var tnspickeados = this.state.tnspickeados;
                var tnsfaltantes = [];
                var flag_vacio=true;
                for (let i in tns) {
                    var aux = true;
                    if (tn + '' === tns[i].TN + '') {
                        flag_vacio=false;
                        for (let i in tnspickeados) {
                            if (tnspickeados[i].TN + '' === tn + '') {
                                aux = false;
                                this.setState({modalpickeado: true});
                            }
                        }
                        if (aux) {
                            tns[i]['STATUS'] = 'true';
                            tnspickeados.push(tns[i]);
                        }
                    }
                }
                if(flag_vacio){
                    this.setState({modalvacio: true});
                }
                for (let i in tns) {
                    var aux = true;
                    for (let j in tnspickeados) {
                        if (tnspickeados[j].TN + '' === tns[i].TN + '') {
                            aux = false;
                            //  console.log('se cumplio igualdad');
                        }
                    }
                    if (aux) {
                        tns[i]['STATUS'] = 'false';
                        tnsfaltantes.push(tns[i]);
                    }
                }
                console.log('antes de if');
                console.log('pickeados',tnspickeados);
                console.log('faltante',tns.length);
                if (tnspickeados.length === tns.length) {
                    console.log('se cumplio igualdad');
                    var idcliente = this.state.idcliente;
                    var correocliente = this.state.correocliente;
                    var nombrecliente = this.state.nombrecliente;
                    this.cerrarManifiestoAccesoAnden(idcliente, tnspickeados, correocliente, nombrecliente, 'COMPLETO');
                    this.setState({displayCompleto:true});
                } else {
                    console.log('no se cumplio igualdad');
                    this.setState({
                        tn: '',
                        disableTextField:false,
                        tnsfaltantes: tnsfaltantes,
                        tnspickeados: tnspickeados,
                        displaymanifiestoincompleto: 'block',
                        displayresultado: 'block'
                    });
                }
            } else {
                console.log(tn);
                var config = {
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                        "Access-Control-Allow-Origin": "*"
                    }
                };
                let data = JSON.stringify({
                    tn: tn
                });
                // axios.post("http://192.168.170.130:5000/mantn",data,config)
                axios.post("http://localhost:5000/validarAccesoAnden", data, config)
                    .then(res => {
                        const rta = res.data;
                        console.log("valida acceso anden",rta);
                        if (rta.length > 0) {
                            this.setState({modalAnden: true});
                        } else {
                            axios.post("http://localhost:5000/traerIncompletos", data, config)
                                .then(res => {
                                    const arrayaCompletar = res.data;
                                    console.log('tns de array a completar', arrayaCompletar);

                                    axios.post("http://localhost:5000/mantn", data, config)
                                        .then(res => {
                                            console.log('react respondio validacion tn');
                                            const tnsAux = res.data;
                                            console.log('tns de array aux', tnsAux);
                                            this.setState({arrayaCompletar, tnsAux});

                                            if (arrayaCompletar.length !== tnsAux.length) {
                                                this.setState({displayManifiestoPasado: 'block'})
                                            }
                                            let tns = [];
                                            for (let i in tnsAux) {
                                                for (let j in arrayaCompletar) {
                                                    if (tnsAux[i].TN + '' === arrayaCompletar[j].TN + '') {
                                                        tns.push(tnsAux[i]);
                                                    }
                                                }
                                            }
                                            if (tns.length > 0) {
                                                console.log(tns);
                                                var tnspickeados = this.state.tnspickeados;
                                                var tnsfaltantes = [];
                                                const ods = [];
                                                const idmanifiesto = tns[0].manifiesto;
                                                const idcliente = tns[0].ID_CLIENTE;
                                                const correo = tns[0].EMAIL_CLIENTE;
                                                const nombrecliente = tns[0].NOMBRE_CLIENTE;
                                                const bultos = tns.length;
                                                for (let i in tns) {
                                                    var aux = true;
                                                    if (tn + '' === tns[i].TN + '') {
                                                        tns[i]['STATUS'] = 'true';
                                                        tnspickeados.push(tns[i]);
                                                    }
                                                    for (let j in ods) {
                                                        if (tns[i].od === ods[j].od) {
                                                            aux = false;
                                                        }
                                                    }
                                                    if (aux) {
                                                        ods.push(tns[i]);
                                                    }
                                                }
                                                //for para tns faltantes
                                                for (let i in tns) {
                                                    var aux = true;

                                                    for (let j in tnspickeados) {
                                                        if (tnspickeados[j].TN + '' === tns[i].TN + '') {
                                                            aux = false;
                                                        }
                                                    }
                                                    if (aux) {
                                                        tnsfaltantes.push(tns[i]);
                                                    }

                                                }
                                                if (tnspickeados.length === tns.length) {
                                                    this.cerrarManifiestoAccesoAnden(idcliente, tnspickeados, correo, nombrecliente, 'COMPLETO');
                                                    this.setState({displayCompleto:true});

                                                } else {
                                                    this.setState({
                                                        tn: '',
                                                        disableTextField:false,
                                                        tnsfaltantes: tnsfaltantes,
                                                        idmanifiesto: idmanifiesto,
                                                        idcliente: idcliente,
                                                        correocliente: correo,
                                                        nombrecliente: nombrecliente,
                                                        totalbutos: bultos,
                                                        totalods: ods.length,
                                                        displayresultado: 'block',
                                                        flagmanifiestocargado: true,
                                                        tns: tns,
                                                        tnspickeados: tnspickeados,
                                                        displaymanifiestoincompleto: 'block',
                                                        tnsAux
                                                    });
                                                }
                                            } else {
                                                this.setState({modalvacio: true});
                                            }
                                        });
                                });

                        }

                    });

            }
        }
    }

    handleClose() {
        this.setState({modalod: false});
    }

    handleShow() {
        this.setState({modalod: true});
    }

    handleClosePegar() {
        this.setState({modalpegar: false});
    }

    handleShowPegar() {
        this.setState({modalpegar: true});
    }

    handleClosePickeado() {
        this.setState({modalpickeado: false});
    }

    handleCloseVacio() {
        this.setState({modalvacio: false});
    }

    handleCloseAnden() {
        this.setState({modalAnden: false});
    }

    handleShowPickeado() {
        this.setState({modalpickeado: true});
    }

    agregarUnidad(num) {
        console.log('tamaño es' + num.toString().length);
        if (num.toString().length === 1) {
            return ('0' + num);
        } else {
            return num;
        }
    }

    cerrarManifiestoIncompleto() {
        var idcliente = this.state.idcliente;
        var correocliente = this.state.correocliente;
        var nombrecliente = this.state.nombrecliente;
        var tnspickeados = this.state.tnspickeados;
        this.cerrarManifiestoAccesoAnden(idcliente, tnspickeados, correocliente, nombrecliente, 'INCOMPLETO');


    }

    cerrarManifiestoAccesoAnden(idcliente, tnspickeados, correocliente, nombrecliente, estado) {
        let tnspicked = tnspickeados;
        const tnsfaltantes = this.state.tnsfaltantes;

        if (estado === 'INCOMPLETO') {
            for (let tn of tnsfaltantes) {
                tn['STATUS'] = 'false';
                tnspicked.push(tn);
            }
        }

        //para tns preview
        const tnsPreview = this.state.tnsAux;
        console.log('preview', tnsPreview);
        console.log('pickeados', tnspickeados);
        for (let i in tnsPreview) {
            var aux = true;
            for (let j in tnspickeados) {
                if (tnspickeados[j].TN + '' === tnsPreview[i].TN + '') {
                    aux = false;
                }
            }
            if (aux) {
                tnsPreview[i]['STATUS'] = 'preview';
                tnspickeados.push(tnsPreview[i]);
            }
        }

        var config = {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "55IcsddHxiy2E3q653RpYtb",
                "Access-Control-Allow-Origin": "*"
            }
        };
        var datetime = new Date();
        var dia = this.agregarUnidad(datetime.getDate());
        var mes = this.agregarUnidad(datetime.getMonth() + 1);
        var hora = this.agregarUnidad(datetime.getHours());
        var minutos = this.agregarUnidad(datetime.getMinutes());
        var segundos = this.agregarUnidad(datetime.getSeconds());
        var diaActual = datetime.getFullYear() + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos;
        console.log('chofer al cerrar', this.state.valueOperador);
        console.log('codigo chofer al cerrar', this.state.codigoChofer);
        console.log('motivo es ', this.state.motivo);
        let data = JSON.stringify({
            idcliente: idcliente,
            tns: tnspicked,
            correo: correocliente,
            nombrecliente: nombrecliente,
            estado: estado,
            dia: diaActual,
            portal: this.state.portal,
            chofer: this.state.valueOperador,
            codigoChofer: this.state.valueCodigoChofer,
            motivo: this.state.motivo
        });
        axios.post("http://localhost:5000/cerrarManifiestoAccesoAnden", data, config)
            .then(res => {
                console.log('react respondio cierre de manifiesto');
                //        const manifiestoAnden = res.data[0].MANIFIESTO;
                //      console.log(manifiestoAnden);
                this.setState({
                    tn: '',
                    disableTextField:false,
                    idcliente: idcliente,
                    nombrecliente: nombrecliente,
                    displayresultado: 'none',
                    flagmanifiestocargado: false,
                    tnspickeados: [],
                    tnsfaltantes: [],
                    tns: [],
                    displaymanifiestoincompleto: 'none',
                    displayManifiestoPasado: 'none',
                    modalincompleto: false,
                    idmanifiesto: 0,
                    totalbutos: 0,
                    totalods: 0,

                });
            });
    }

    validarTn(event) {
        var tn = event.target.value;
        this.setState({
            tn: tn
        });
    }

    matchOperadores(state, value) {

        return (
            //  state.COD_CHOFER.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            state.NOMBRE.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    changeTituloOperadores(item, value) {
        console.log("codigo de chofer es", value.COD_CHOFER);
        this.setState({
            displayresultado: 'block',
            choferActivo: 'inline-block',
            valueOperador: item,
            valueCodigoChofer: value.COD_CHOFER,

        });
        if (this.state.tnspickeados.length > 0) {
            this.setState({
                displaymanifiestoincompleto: 'block'
            });
            if (this.state.tnsAux.length !== this.state.arrayaCompletar.lengh) {

                this.setState({displayManifiestoPasado: 'block'});
            }
        }
    }

    ocultarvista(value) {
        this.setState({
            choferActivo: 'none',
            valueOperador: value,
            displayresultado: 'none',
            displaymanifiestoincompleto: 'none',
            displayManifiestoPasado: 'none'

        });
    }

    render() {

        return (

            <Container>
                <Row style={{justifyContent: 'center', marginTop: '1rem'}}>

                    <Modal show={this.state.modalpickeado} onHide={this.handleClosePickeado}>
                        <Modal.Header closeButton>
                            <Modal.Title>BULTO YA PICKEADO</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h1 style={{color: '#ff0000'}}>ESTE TN YA FUE PICKEADO </h1>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleClosePickeado}>
                                ok
                            </Button>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={this.state.modalAnden} onHide={this.handleCloseAnden}>
                        <Modal.Header closeButton>
                            <Modal.Title>BULTO YA PICKEADO EN ACCESO ANDEN</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h1 style={{color: '#ff0000'}}>ESTE TN YA FUE PICKEADO EN ACCESO ANDEN </h1>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleCloseAnden}>
                                ok
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalvacio} onHide={this.handleCloseVacio}>
                        <Modal.Header closeButton>
                            <Modal.Title>BULTO NO ENCONTRADO</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h1 style={{color: '#ff0000'}}>ESTE BULTO NO SE ENCUENTRA EN MANIFIESTO DE INHOUSE </h1>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleCloseVacio}>
                                ok
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.displayCompleto} onHide={this.handleCompleto}>
                        <Modal.Header closeButton>
                            <Modal.Title>MANIFIESTO COMPLETO</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h1 style={{color: '#ff0000'}}>ESTE MANIFIESTO FUE COMPLETADO EXITOSAMENTE </h1>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleCompleto}>
                                ok
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.modalod} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>ODS FALTANTES</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.tnsfaltantes.map(
                                variant => (
                                    <p style={{color: '#202156'}}> OD :&nbsp;&nbsp;&nbsp; <b
                                        style={{fontSize: 20}}> {variant.od}</b> &nbsp;&nbsp;&nbsp; TN
                                        :  &nbsp;&nbsp;&nbsp; <b style={{fontSize: 20}}>{variant.TN} </b></p>

                                ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleClose}>
                                ok
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalpegar} onHide={this.handleClosePegar}>
                        <Modal.Header closeButton>
                            <Modal.Title>ACCION PROHIBIDA</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <p style={{color: '#202156', textAlign: "justify"}}> PROHIBIDO COPIAR DESDE TECLADO Y MOUSE
                                !!!! </p>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleClosePegar}>
                                ok
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.modalincompleto} onHide={this.handleCloseIncompleto}>
                        <Modal.Header closeButton>
                            <Modal.Title>MANIFIESTO INCOMPLETO</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{color: '#202156', textAlign: "justify"}}> Esta apunto de generar un manifiesto
                                incompleto, debe indicar un motivo </p>
                            <textarea
                                name="name"
                                value={this.state.motivo}
                                onChange={(event) => {
                                    if (event.currentTarget.value !== '') {
                                        this.setState(
                                            {motivo: event.currentTarget.value, motivoStatus: false});
                                    }
                                }
                                }
                                style={{width: '100%'}}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.cerrarManifiestoIncompleto}
                                    disabled={this.state.motivoStatus}
                            >
                                ok
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Row>
                <Row>
                    <Col sm={12} style={{justifyContent: 'left', textAlign: "left", zIndex: 2}}>
                        <p style={{
                            textAlign: "left", marginBottom: '0.5rem', color: '#202156',
                            fontSize: 20, fontWeight: 'bold', justifyContent: 'left', textAlign: 'left'
                        }}> CHOFER</p>
                        <Autocomplete
                            value={this.state.valueOperador}
                            inputProps={{id: 'states-autocomplete'}}
                            wrapperStyle={{position: 'relative', display: 'inline-block'}}
                            items={this.state.operadores}
                            getItemValue={item => item.NOMBRE}
                            shouldItemRender={this.matchOperadores}
                            onChange={(event, value) => this.ocultarvista(value)}
                            onSelect={this.changeTituloOperadores}
                            renderMenu={children => (
                                <div className="menu">
                                    {children}
                                </div>
                            )}
                            renderItem={(item, isHighlighted) => (
                                <div
                                    className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                                    key={item.COD_CHOFER}>
                                    {item.NOMBRE}
                                </div>
                            )}
                        />
                    </Col>
                </Row>
                <Row style={{justifyContent: 'left', marginTop: '2rem', marginBottom: '1rem'}}>
                    <Col sm={3} style={{
                        zIndex: 2,
                        height: 70,
                        justifyContent: 'left',
                        textAlign: "left",
                        display: this.state.choferActivo
                    }}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left'
                        }}> Pickea Numero:
                        </p>
                        <input
                           id="numero"
                            type="text"
                            name="name"
                            autoComplete="off"
                            disabled={this.state.disableTextField}
                            onPaste={this.handleShowPegar}
                            value={this.state.tn}
                            onChange={this.validarTn}
                            onKeyDown={this.handleKeyDown}
                        />
                    </Col>
                    <Col sm={2} style={{zIndex: 2, height: 70, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayresultado
                        }}> ID de manifiesto:
                        </p>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayresultado
                        }}> {this.state.idmanifiesto}
                        </p>
                    </Col>
                    <Col sm={2} style={{zIndex: 2, height: 70, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayresultado
                        }}> Total bultos:
                        </p>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayresultado
                        }}> {this.state.totalbutos}
                        </p>
                    </Col>
                    <Col sm={2} style={{zIndex: 2, height: 70, justifyContent: 'left', textAlign: "left"}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayresultado
                        }}> Total ods:
                        </p>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayresultado
                        }}> {this.state.totalods}
                        </p>
                    </Col>
                    <Col sm={2} style={{zIndex: 2, height: 70}}>
                        <p style={{
                            marginBottom: '0.5rem',
                            color: '#202156', fontSize: 20, fontWeight: 'bold',
                            justifyContent: 'left', textAlign: 'left', display: this.state.displayresultado
                        }}> Bultos Pickeados:
                        </p>
                        <Button style={{
                            display: this.state.displayresultado,
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                                variant="primary"
                                onClick={this.handleShow}
                        >
                            {this.state.tnspickeados.length} / {this.state.tns.length}
                        </Button>

                    </Col>
                </Row>
                <Row style={{display: this.state.displayManifiestoPasado}}>
                    <Col sm={12} style={{justifyContent: 'center', textAlign: "left", zIndex: 2}}>
                        <p style={{
                            textAlign: "left", marginBottom: '0.5rem', color: '#202156',
                            fontSize: 20, fontWeight: 'bold', justifyContent: 'center', textAlign: 'center'
                        }}> PARTE DE ESTE MANIFIESTO FUE CERRADO EN EL PASADO DE FORMA INCOMPLETA</p>

                    </Col>
                </Row>
                <div style={{display: this.state.displayresultado}}>
                    {this.state.tnspickeados.map(
                        variant => (
                            <Row style={{display: 'block', border: '1px solid', borderColor: '#202156'}}>
                                <Col sm={12} style={{justifyContent: 'left', textAlign: "left"}}>
                                    <p style={{marginTop: '1rem', color: '#202156'}}> OD :&nbsp;&nbsp;&nbsp; <b
                                        style={{fontSize: 20}}> {variant.od}</b> &nbsp;&nbsp;&nbsp; TN
                                        :  &nbsp;&nbsp;&nbsp; <b
                                            style={{fontSize: 20}}>{variant.TN} </b>  &nbsp;&nbsp;&nbsp;  BULTOS
                                        : {variant.BULTOS} </p>

                                </Col>

                            </Row>
                        ))}
                </div>
                <Row>
                    <Col sm={12} style={{
                        justifyContent: 'center',
                        textAlign: "center",
                        marginTop: '1rem',
                        display: this.state.displaymanifiestoincompleto
                    }}>
                        <Button
                            variant="danger"
                            onClick={() => {
                                this.setState(
                                    {
                                        modalincompleto: true
                                    }
                                );
                            }}
                        >
                            Finalizar Manifiesto Incompleto
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Anden;
