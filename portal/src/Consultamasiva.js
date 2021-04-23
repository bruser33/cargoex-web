import React, { Component } from 'react';
import { Button, Container, Row, Col,Dropdown,DropdownButton, Card, Alert } from 'react-bootstrap';
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

class Consultamasiva extends Component {

  constructor(props){
    super(props)
    this.state = {
        value:'',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        clientes:[],
        gestiones:[],
        idcliente:'',
        loading:false,
        displayTabla:'none',
        displayBuscar:'none',
        displayFechas:'none'

    }
    this.changeTituloClientes = this.changeTituloClientes.bind(this);
    this.buscar = this.buscar.bind(this);
    this.changeFechaInicio = this.changeFechaInicio.bind(this);
    this.changeFechaFin = this.changeFechaFin.bind(this);
  }

  buscar(event){
    this.setState({ loading: true });
    let dia=this.state.fechaInicio.getDate()+"";
    let mes=(this.state.fechaInicio.getMonth()+1)+"";
    if(dia.length===1){
      dia='0'+dia;
    }
    if(mes.length===1){
      mes='0'+mes;
    }
    let diaf = this.state.fechaFin.getDate()+"";
    let mesf=(this.state.fechaFin.getMonth()+1)+"";
    if(diaf.length===1){
      diaf='0'+diaf;
    }
    if(mesf.length===1){
      mesf='0'+mesf;
    }
    var fechai= this.state.fechaInicio.getFullYear()+"-"+mes+'-'+ dia;
    var fechaf=this.state.fechaFin.getFullYear()+"-"+ mesf+'-'+diaf;

    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    let data = JSON.stringify({
      fechai:fechai,
      fechaf:fechaf,
      idcliente:this.state.idcliente
    });
    console.log('va a llamar al servicio');
    axios.post("http://app.cargoex.cl:5000/gestiones",data,config)
      .then(res => {
        console.log('respondio servicio');
        var gestiones= res.data;
        console.log(gestiones);
        this.setState({ gestiones:gestiones,
                        displayTabla:'block',
                        loading:false });

      });
  }
  changeTituloClientes(item,value) {
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    console.log(value.id);
    this.setState({
      value:item,
      idcliente:value.id,
      displayTabla:'none',
      displayFechas:'block',
      displayBuscar:'block'
    });
  }
  componentWillMount() {
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    var url = document.URL ;
    console.log('va a mostrar url');
    console.log(url);
    var urlseparada = url.split('tipo_usuario=');
    var tipo_usuario=urlseparada[urlseparada.length-1];
    tipo_usuario=tipo_usuario.replace('#','');
    console.log(tipo_usuario);
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

  }
  matchStocks(state, value) {
    return (

      state.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 );
  }
  cambiarCliente(value){
    this.setState({
      displayTabla:'none',
      displayFechas:'none',
      displayBuscar:'none',
      value:value
    });
  }
  changeFechaInicio(date) {
      if(date <= this.state.fechaFin ){
          this.setState({
            fechaInicio: date,
            displayBuscar:'block',
            displayTabla:'none'
          });
        }else{
          this.setState({

            displayBuscar:'none',
            displayTabla:'none'
          });
        }
  }
  changeFechaFin(date) {

  if(date >= this.state.fechaInicio ){
    console.log('sisas');
    this.setState({
      fechaFin: date,
      displayBuscar:'block',
      displayTabla:'none'
    });
  }else{
    this.setState({
      displayBuscar:'none',
      displayTabla:'none'
    });
    }
  }
  cellButton(cell, row, enumObject, rowIndex) {
    console.log(row);
    //console.log('el objeto es'+enumObject+cell+'--'+row.nombre+'--'+rowIndex);
    //  let url = "consultaOd/"+row.OD_PAPEL;
    var url1 = document.URL ;
    console.log('va a mostrar url');
    console.log(url1);
    var urlseparada = url1.split('componentes/');
    let url = urlseparada[0]+"consultaOd/"+row.OD_PAPEL;
// let url = "http://app.cargoex.cl/clientes/public/consultaOd/"+row.OD_PAPEL;
     return (
        <Button
        target="_blank"
        href={url}
        variant="primary"
        style={{witdh:'70%',fontSize:12}}
        >
        VER MAS
        </Button>
     )
  };
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

        <Row style={{ justifyContent: 'left', marginTop:'2rem',textAlign:"left"}}>
          <Col sm={3} style={{height:40}}>
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
          <Col sm={3} style={{ justifyContent: 'left',textAlign:'left',display:this.state.displayFechas}} >
              <p style={{textAlign:"center",marginBottom:'0.5rem', color: '#202156',
              fontSize:16, fontWeight: 'bold', justifyContent: 'left',textAlign:'left'
            }}> FECHA INICIO </p>
              <DatePicker
                style={{width:'2rem'}}
                dateFormat="dd/MM/yyyy"
                selected={this.state.fechaInicio}
                onChange={this.changeFechaInicio}
                />
          </Col>
          <Col sm={3} style={{ justifyContent: 'left',textAlign:'left',display:this.state.displayFechas}} >
              <p style={{textAlign:"center",marginBottom:'0.5rem', color: '#202156',
              fontSize:16, fontWeight: 'bold', justifyContent: 'left',textAlign:'left'
            }}> FECHA FIN</p>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={this.state.fechaFin}
                onChange={this.changeFechaFin}
                />
          </Col>
          <Col sm={3}  >
          <Button style={{ display:this.state.displayBuscar,textAlign:'center', border: '1px solid',marginLeft:'40%', marginTop:'10%' }}
            variant="primary"
            onClick={this.buscar.bind(this)}
            >
            Buscar
            </Button>
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

        <Col sm={12}  style={{marginTop:'5%'}} >
          <p style={{
          color: '#202156',fontSize:20, fontWeight: 'bold',
          justifyContent: 'left',textAlign:'left',display:this.state.displayTabla
        }}> Gestiones : {this.state.cantidad_ordenes}
          </p>
        </Col>
        </Row>
        <Row style={{ paddingBottom:'1rem',marginTop:'2%',justifyContent: 'left',textAlign:"left",display:this.state.displayTabla}} >
          <Col sm={12} >
            <BootstrapTable
            pagination
            containerStyle={{width: '600%',fontSize:14}}
            data={ this.state.gestiones}
            options={ options }
            selectRow={ selectRow }
            exportCSV
            search
            >
            <TableHeaderColumn
                    width={'3%'}
                   dataField='button'
                   dataFormat={this.cellButton.bind(this)}
                 />
            <TableHeaderColumn dataField='OD_PAPEL' isKey={ true } dataSort={ true } width={'3%'}>OD</TableHeaderColumn>
            <TableHeaderColumn dataField='NOMBRE' dataSort={ true } width={'8%'}>NOMBRE</TableHeaderColumn>
            <TableHeaderColumn dataField='AGENTE_RESPONSABLE' dataSort={ true } width={'3%'}>AGENTE</TableHeaderColumn>
            <TableHeaderColumn dataField='CLIENTE' dataSort={ true } width={'7%'}>CLIENTE</TableHeaderColumn>
            <TableHeaderColumn dataField='MAIL' dataSort={ true } width={'6%'}>MAIL</TableHeaderColumn>
            <TableHeaderColumn dataField='DIRECCION' dataSort={ true } width={'8%'} >DIRECCION</TableHeaderColumn>
            <TableHeaderColumn dataField='CUIDAD_DESTINO' dataSort={ true }  width={'4%'} >DESTINO</TableHeaderColumn>
            <TableHeaderColumn dataField='CUIDAD_ORIGEN' dataSort={ true }  width={'4%'} >ORIGEN</TableHeaderColumn>
            <TableHeaderColumn dataField='FECHA_CREACION' dataSort={ true } width={'5%'}>FECHA CREACION</TableHeaderColumn>
            <TableHeaderColumn dataField='FECHA_EN_TERRENO' dataSort={ true } width={'5%'}>FECHA EN TERRENO</TableHeaderColumn>
            <TableHeaderColumn dataField='FECHA_TRANSMISION' dataSort={ true } width={'5%'}>FECHA TRANSMISION</TableHeaderColumn>
            <TableHeaderColumn dataField='NOMBRE_RECEPTOR' dataSort={ true } width={'4%'}>RECEPTOR</TableHeaderColumn>
            <TableHeaderColumn dataField='RUT_RECEPTOR' dataSort={ true } width={'4%'}>RUT RECEPTOR</TableHeaderColumn>
            <TableHeaderColumn dataField='CENTRO_COSTO' dataSort={ true } width={'4%'}>CENTRO DE COSTO</TableHeaderColumn>
            <TableHeaderColumn dataField='ESTADO' dataSort={ true } width={'5%'}>ESTADO</TableHeaderColumn>
            <TableHeaderColumn dataField='CANAL' dataSort={ true } width={'3%'}>CANAL</TableHeaderColumn>
            <TableHeaderColumn dataField='GUIA' dataSort={ true } width={'5%'}>GUIA</TableHeaderColumn>
            <TableHeaderColumn dataField='ID_MANIFIESTO' dataSort={ true } width={'4%'}>MANIFIESTO</TableHeaderColumn>
            <TableHeaderColumn dataField='PESO' dataSort={ true } width={'2%'}>PESO</TableHeaderColumn>
            <TableHeaderColumn dataField='BULTOS' dataSort={ true } width={'2%'}>BULTOS</TableHeaderColumn>
            <TableHeaderColumn dataField='ALTO' dataSort={ true } width={'2%'}>ALTO</TableHeaderColumn>
            <TableHeaderColumn dataField='ANCHO' dataSort={ true } width={'2%'}>ANCHO</TableHeaderColumn>
            <TableHeaderColumn dataField='LARGO' dataSort={ true } width={'2%'}>LARGO</TableHeaderColumn>
            <TableHeaderColumn dataField='NOTA' dataSort={ true } width={'4%'}>NOTA</TableHeaderColumn>
            <TableHeaderColumn dataField='NUM_BOLETA' dataSort={ true } width={'4%'}>NUMERO DE BOLETA</TableHeaderColumn>
            <TableHeaderColumn dataField='TELEFONO' dataSort={ true } width={'4%'}>TELEFONO</TableHeaderColumn>
            <TableHeaderColumn dataField='TIPO_CARGA' dataSort={ true } width={'5%'}>TIPO CARGA</TableHeaderColumn>
            <TableHeaderColumn dataField='TIPO_CERTIFICACION' dataSort={ true } width={'5%'}>TIPO CERTIFICACION</TableHeaderColumn>
            <TableHeaderColumn dataField='TIPO_NEGOCIO' dataSort={ true }  width={'5%'}>TIPO DE NEGOCIO</TableHeaderColumn>
                    <TableHeaderColumn dataField='LAT_TERRENO' dataSort={ true }  width={'5%'}>LATITUD</TableHeaderColumn>
                <TableHeaderColumn dataField='LONG_TERRENO' dataSort={ true }  width={'5%'}>LONGITUD</TableHeaderColumn>


            </BootstrapTable>
          </Col>
        </Row>

      </Container>

    );
  }
}


export default Consultamasiva;
