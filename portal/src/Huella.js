import React, { Component } from 'react';
import { Button, Container, Row, Col,Dropdown,DropdownButton, Card, Alert } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {Map, InfoWindow, Marker, GoogleApiWrapper,Polyline} from 'google-maps-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import Autocomplete from  'react-autocomplete';
import BarcodeReader from 'react-barcode-reader'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell,ResponsiveContainer} from 'recharts';
import axios from 'axios';
import cors from 'cors';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';





class BSTable extends React.Component {
  render() {
    if (this.props.data) {
      return (
        <BootstrapTable
          data = { this.props.data }
        >
          <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'25%'}  >AGENTE</TableHeaderColumn>
          <TableHeaderColumn dataField='total' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
          <TableHeaderColumn dataField='bio' dataSort={ true } width={'10%'}>H</TableHeaderColumn>
          <TableHeaderColumn dataField='normal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
          <TableHeaderColumn dataField='intentos' width={'12%'}>INTS</TableHeaderColumn>
          <TableHeaderColumn dataField='efectividad'>EFEC (H)</TableHeaderColumn>
          <TableHeaderColumn dataField='efectividadhi'>EFEC (H+I)</TableHeaderColumn>

        </BootstrapTable>);
    } else {
      return (<p>?</p>);
    }
  }
}
class BSTable2 extends React.Component {
  render() {
    if (this.props.data) {
      return (
        <BootstrapTable data={ this.props.data }>
          <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'25%'}>AGENTE</TableHeaderColumn>
          <TableHeaderColumn dataField='cargoex' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
          <TableHeaderColumn dataField='cargoexbio' dataSort={ true } width={'8%'}>H</TableHeaderColumn>
          <TableHeaderColumn dataField='cargoexnormal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
          <TableHeaderColumn dataField='cargoexi' width={'9%'}>INTS</TableHeaderColumn>
          <TableHeaderColumn dataField='efectividadcargoex' width={'12%'}>EFECT (H)</TableHeaderColumn>
          <TableHeaderColumn dataField='efectividadcargoexhi' width={'13%'}>EFECT (H+I)</TableHeaderColumn>


        </BootstrapTable>);
    } else {
      return (<p>?</p>);
    }
  }
}
class BSTable3 extends React.Component {
  render() {
    if (this.props.data) {
      return (
        <BootstrapTable data={ this.props.data }>
          <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'25%'}>AGENTE</TableHeaderColumn>
          <TableHeaderColumn dataField='b2c' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
          <TableHeaderColumn dataField='b2cbio' dataSort={ true } width={'8%'}>H</TableHeaderColumn>
          <TableHeaderColumn dataField='b2cnormal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
          <TableHeaderColumn dataField='b2ci' width={'9%'}>INTS</TableHeaderColumn>
          <TableHeaderColumn dataField='efectividadb2c' width={'12%'}>EFECT (H)</TableHeaderColumn>
          <TableHeaderColumn dataField='efectividadb2chi' width={'13%'}>EFECT (H+I)</TableHeaderColumn>


        </BootstrapTable>);
    } else {
      return (<p>?</p>);
    }
  }
}
class Huella extends Component {

  constructor(props){
    super(props)
    this.state = {
      fechaInicio: new Date(),
      fechaFin: new Date(),
      products : [],
      malRango:'none',
      checkApertura:false,
      checkCargoex:true,
      checkB2c:true,
      sinResultados:'none',
      displayBuscar:'none',
      displayRegion:'block',
      displayTablaTodos:'none',
      displayTablaAperturada:'none',
      displayTablaIndividual:'none',
      displayTablaIndividualCargoex:'none',
      displayTablaIndividualB2c:'none',
      displayTablaTodosCargoex:'none',
      displayTablaTodosB2c:'none',
      displayTablaTodosAperturaCargoex:'none',
      displayTablaTodosAperturaB2c:'none',
      displayApertura:'none',
      loading: false,
      regiones:[
      ],
      datosIndividual:[
      ],
      datosTodos:[
      ],
      datosTablaAperturada:[
      ],
      datosTablaTodosAperturaCargoex:[
      ],
      datosTablaTodosAperturaB2c:[
      ],
      ciudades:[
	{
		"ID_IATA" : 6,
		"IATA" : "ALH",
		"NOMBRE" : "ALTO HOSPICIO",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 7,
		"IATA" : "CGN",
		"NOMBRE" : "Cholguan",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 8,
		"IATA" : "IPC",
		"NOMBRE" : "ISLA DE PASCUA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "IPC"
	},
	{
		"ID_IATA" : 9,
		"IATA" : "VTR",
		"NOMBRE" : "VICTORIA",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 10,
		"IATA" : "CQK",
		"NOMBRE" : "TIRUA",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 11,
		"IATA" : "CHI",
		"NOMBRE" : "Chipra",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 12,
		"IATA" : "C",
		"NOMBRE" : "CONCHALI",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 13,
		"IATA" : "CERR",
		"NOMBRE" : "CERRILLOS",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 14,
		"IATA" : "CN",
		"NOMBRE" : "CERRO NAVIA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 15,
		"IATA" : "EB",
		"NOMBRE" : "EL BOSQUE",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 16,
		"IATA" : "EC",
		"NOMBRE" : "ESTACION CENTRAL",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 17,
		"IATA" : "H",
		"NOMBRE" : "HUECHURABA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 18,
		"IATA" : "I",
		"NOMBRE" : "INDEPENDENCIA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 19,
		"IATA" : "LB",
		"NOMBRE" : "LO BARNECHEA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 20,
		"IATA" : "LC",
		"NOMBRE" : "LAS CONDES",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 21,
		"IATA" : "LCIS",
		"NOMBRE" : "LA CISTERNA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 22,
		"IATA" : "LE",
		"NOMBRE" : "LO ESPEJO",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 23,
		"IATA" : "LF",
		"NOMBRE" : "LA FLORIDA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 24,
		"IATA" : "LG",
		"NOMBRE" : "LA GRANJA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 25,
		"IATA" : "LP",
		"NOMBRE" : "LO PRADO",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 26,
		"IATA" : "LPINT",
		"NOMBRE" : "LA PINTANA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 27,
		"IATA" : "LR",
		"NOMBRE" : "LA REINA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 28,
		"IATA" : "M",
		"NOMBRE" : "MAIPU",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 29,
		"IATA" : "MAC",
		"NOMBRE" : "MACUL",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 30,
		"IATA" : "Ñ",
		"NOMBRE" : "ÑUÑOA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 31,
		"IATA" : "P",
		"NOMBRE" : "PROVIDENCIA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 32,
		"IATA" : "PA",
		"NOMBRE" : "PUENTE ALTO",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 33,
		"IATA" : "PAC",
		"NOMBRE" : "PEDRO AGUIRRE CERDA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 34,
		"IATA" : "PEÑ",
		"NOMBRE" : "PEÑALOLEN",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 35,
		"IATA" : "PUD",
		"NOMBRE" : "PUDAHUEL",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 36,
		"IATA" : "Q",
		"NOMBRE" : "QUILICURA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 37,
		"IATA" : "QN",
		"NOMBRE" : "QUINTA NORMAL",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 38,
		"IATA" : "R",
		"NOMBRE" : "RENCA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 39,
		"IATA" : "REC",
		"NOMBRE" : "RECOLETA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 40,
		"IATA" : "SBDO",
		"NOMBRE" : "SAN BERNARDO",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 41,
		"IATA" : "SJ",
		"NOMBRE" : "SAN JOAQUIN",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 42,
		"IATA" : "SM",
		"NOMBRE" : "SAN MIGUEL",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 43,
		"IATA" : "SR",
		"NOMBRE" : "SAN RAMON",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 44,
		"IATA" : "V",
		"NOMBRE" : "VITACURA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 45,
		"IATA" : "LAM",
		"NOMBRE" : "LAMPA",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 46,
		"IATA" : "PIRQ",
		"NOMBRE" : "PIRQUE",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 47,
		"IATA" : "ARI",
		"NOMBRE" : "ARICA",
		"REGION" : 15,
		"SECTOR" : "NG",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "ARI"
	},
	{
		"ID_IATA" : 48,
		"IATA" : "IQQ",
		"NOMBRE" : "IQUIQUE",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 49,
		"IATA" : "AZA",
		"NOMBRE" : "AZAPA",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ARI"
	},
	{
		"ID_IATA" : 50,
		"IATA" : "CCE",
		"NOMBRE" : "COLCHANE",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 51,
		"IATA" : "CMÑ",
		"NOMBRE" : "CAMIÑA",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 52,
		"IATA" : "CMS",
		"NOMBRE" : "CAMARONES",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ARI"
	},
	{
		"ID_IATA" : 53,
		"IATA" : "GRL",
		"NOMBRE" : "GRAL LAGOS",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ARI"
	},
	{
		"ID_IATA" : 54,
		"IATA" : "HRA",
		"NOMBRE" : "HUALPEN",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 55,
		"IATA" : "LGC",
		"NOMBRE" : "LA HUAICA",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 56,
		"IATA" : "LTI",
		"NOMBRE" : "LA TIRANA",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 57,
		"IATA" : "MTA",
		"NOMBRE" : "MATILLA",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 58,
		"IATA" : "OPC",
		"NOMBRE" : "PICA",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 59,
		"IATA" : "POC",
		"NOMBRE" : "POCONCHILE",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ARI"
	},
	{
		"ID_IATA" : 60,
		"IATA" : "ZAL",
		"NOMBRE" : "VALDIVIA",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 61,
		"IATA" : "ZOS",
		"NOMBRE" : "OSORNO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 62,
		"IATA" : "ALE",
		"NOMBRE" : "ALERCE",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 63,
		"IATA" : "CBU",
		"NOMBRE" : "CALBUCO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 64,
		"IATA" : "COH",
		"NOMBRE" : "COCHAMO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 65,
		"IATA" : "CTR",
		"NOMBRE" : "CASTRO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 66,
		"IATA" : "CVE",
		"NOMBRE" : "CURACO DE VELEZ",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 67,
		"IATA" : "DLE",
		"NOMBRE" : "DALCAHUE",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 68,
		"IATA" : "FRT",
		"NOMBRE" : "FRUTILLAR",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 69,
		"IATA" : "FSA",
		"NOMBRE" : "FRESIA",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 70,
		"IATA" : "FTF",
		"NOMBRE" : "FUTALEUFU",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 71,
		"IATA" : "HUA",
		"NOMBRE" : "HUALAIHUE",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 72,
		"IATA" : "LAG",
		"NOMBRE" : "LOS LAGOS",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 73,
		"IATA" : "LLQ",
		"NOMBRE" : "LLANQUIHUE",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 74,
		"IATA" : "LNC",
		"NOMBRE" : "LANCO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 75,
		"IATA" : "LON",
		"NOMBRE" : "LONCOCHE",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 76,
		"IATA" : "LRO",
		"NOMBRE" : "LAGO RANCO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 77,
		"IATA" : "MFL",
		"NOMBRE" : "MAFIL",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 78,
		"IATA" : "MQA",
		"NOMBRE" : "MARIQUINA",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 79,
		"IATA" : "PAI",
		"NOMBRE" : "PAILLACO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 80,
		"IATA" : "PCY",
		"NOMBRE" : "PUERTO OCTAY",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 81,
		"IATA" : "PGP",
		"NOMBRE" : "PANGUIPULLI",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 82,
		"IATA" : "PQU",
		"NOMBRE" : "PUQUELDON",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 83,
		"IATA" : "PUA",
		"NOMBRE" : "PUAUCHO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 84,
		"IATA" : "PUY",
		"NOMBRE" : "PUYEHUE",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 85,
		"IATA" : "QHO",
		"NOMBRE" : "QUINCHAO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 86,
		"IATA" : "QLN",
		"NOMBRE" : "QUELLON",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 87,
		"IATA" : "QUE",
		"NOMBRE" : "QUEMCHI",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 88,
		"IATA" : "RBN",
		"NOMBRE" : "RIO BUENO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 89,
		"IATA" : "SJC",
		"NOMBRE" : "SAN JUAN DE LA COSTA",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 90,
		"IATA" : "SPA",
		"NOMBRE" : "SAN PABLO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 91,
		"IATA" : "ZAO",
		"NOMBRE" : "MALLOCO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 92,
		"IATA" : "ZCN",
		"NOMBRE" : "CHAITEN",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 93,
		"IATA" : "ZLU",
		"NOMBRE" : "LA UNION",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 94,
		"IATA" : "ZPV",
		"NOMBRE" : "PUERTO VARAS",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 95,
		"IATA" : "BBA",
		"NOMBRE" : "BALMACEDA",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 96,
		"IATA" : "CCH",
		"NOMBRE" : "CHILE CHICO",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 97,
		"IATA" : "CCL",
		"NOMBRE" : "COCHRANE",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 98,
		"IATA" : "GUA",
		"NOMBRE" : "GUAITECAS",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 99,
		"IATA" : "LVE",
		"NOMBRE" : "LAGO VERDE",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 100,
		"IATA" : "RIB",
		"NOMBRE" : "RIO IBAÑEZ",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 101,
		"IATA" : "WPA",
		"NOMBRE" : "PUERTO AYSEN",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 102,
		"IATA" : "LBL",
		"NOMBRE" : "LAGUNA BLANCA",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 103,
		"IATA" : "NVA",
		"NOMBRE" : "NAVARINO",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 104,
		"IATA" : "PWL",
		"NOMBRE" : "PUERTO WILLIAMS",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 105,
		"IATA" : "RVE",
		"NOMBRE" : "RIO VERDE",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 106,
		"IATA" : "TIM",
		"NOMBRE" : "TIMAUKEL",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 107,
		"IATA" : "SCL",
		"NOMBRE" : "SANTIAGO",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 108,
		"IATA" : "BQO",
		"NOMBRE" : "BAQUEDANO",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 109,
		"IATA" : "OLG",
		"NOMBRE" : "OLLAGUE",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CJC"
	},
	{
		"ID_IATA" : 110,
		"IATA" : "SPX",
		"NOMBRE" : "SAN PEDRO DE ATACAMA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CJC"
	},
	{
		"ID_IATA" : 111,
		"IATA" : "CHN",
		"NOMBRE" : "CHAÑARAL",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 112,
		"IATA" : "IRO",
		"NOMBRE" : "INCA DE ORO",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 113,
		"IATA" : "PTS",
		"NOMBRE" : "POTRERILLOS",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 114,
		"IATA" : "ACO",
		"NOMBRE" : "ANDACOLLO",
		"REGION" : 4,
		"SECTOR" : "NG",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 115,
		"IATA" : "COQ",
		"NOMBRE" : "COQUIMBO",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 116,
		"IATA" : "LHC",
		"NOMBRE" : "LA HIGUERA",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 117,
		"IATA" : "PHO",
		"NOMBRE" : "PAIHUANO",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 118,
		"IATA" : "TGY",
		"NOMBRE" : "TONGOY",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 119,
		"IATA" : "ABO",
		"NOMBRE" : "ALGARROBO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 120,
		"IATA" : "CDO",
		"NOMBRE" : "CABILDO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 121,
		"IATA" : "COL",
		"NOMBRE" : "COLINA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 122,
		"IATA" : "EBT",
		"NOMBRE" : "EL BELLOTO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "KNA"
	},
	{
		"ID_IATA" : 123,
		"IATA" : "ETB",
		"NOMBRE" : "EL TABO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 124,
		"IATA" : "INE",
		"NOMBRE" : "ISLA NEGRA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 125,
		"IATA" : "LHE",
		"NOMBRE" : "LITUECHE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 126,
		"IATA" : "LLY",
		"NOMBRE" : "LLAY LLAY",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 127,
		"IATA" : "ACD",
		"NOMBRE" : "ANCUD",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ACD"
	},
	{
		"ID_IATA" : 128,
		"IATA" : "CRC",
		"NOMBRE" : "CORRAL",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 129,
		"IATA" : "ENL",
		"NOMBRE" : "ENTRE LAGOS",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 130,
		"IATA" : "FTR",
		"NOMBRE" : "FUTRONO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZAL"
	},
	{
		"ID_IATA" : 131,
		"IATA" : "LMU",
		"NOMBRE" : "LOS MUERMOS",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 132,
		"IATA" : "MAU",
		"NOMBRE" : "MAULLIN",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 133,
		"IATA" : "PAL",
		"NOMBRE" : "PALENA",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 134,
		"IATA" : "PRE",
		"NOMBRE" : "PURRANQUE",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 135,
		"IATA" : "QLE",
		"NOMBRE" : "QUEILEN",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 136,
		"IATA" : "RNC",
		"NOMBRE" : "RIO NEGRO",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZOS"
	},
	{
		"ID_IATA" : 137,
		"IATA" : "ZCH",
		"NOMBRE" : "CHONCHI",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 138,
		"IATA" : "GXQ",
		"NOMBRE" : "COYHAIQUE",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 139,
		"IATA" : "CIS",
		"NOMBRE" : "PUERTO CISNES",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 140,
		"IATA" : "OHG",
		"NOMBRE" : "OHIGGINS",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 141,
		"IATA" : "TOR",
		"NOMBRE" : "TORTEL",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 142,
		"IATA" : "CJC",
		"NOMBRE" : "CALAMA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "CJC"
	},
	{
		"ID_IATA" : 143,
		"IATA" : "MJS",
		"NOMBRE" : "MEJILLONES",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 144,
		"IATA" : "SGO",
		"NOMBRE" : "SIERRA GORDA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CJC"
	},
	{
		"ID_IATA" : 145,
		"IATA" : "CPO",
		"NOMBRE" : "COPIAPO",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 146,
		"IATA" : "ESR",
		"NOMBRE" : "EL SALVADOR",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 147,
		"IATA" : "PPE",
		"NOMBRE" : "PAIPOTE",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 148,
		"IATA" : "VAL",
		"NOMBRE" : "VALLENAR",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "VAL"
	},
	{
		"ID_IATA" : 149,
		"IATA" : "COB",
		"NOMBRE" : "COMBARBALA",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "OVL"
	},
	{
		"ID_IATA" : 150,
		"IATA" : "HCO",
		"NOMBRE" : "HUASCO",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "VAL"
	},
	{
		"ID_IATA" : 151,
		"IATA" : "OVL",
		"NOMBRE" : "OVALLE",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "OVL"
	},
	{
		"ID_IATA" : 152,
		"IATA" : "SOZ",
		"NOMBRE" : "SOTAQUI",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 153,
		"IATA" : "ZLC",
		"NOMBRE" : "LA CALERA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 154,
		"IATA" : "CBC",
		"NOMBRE" : "CASABLANCA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 155,
		"IATA" : "CNA",
		"NOMBRE" : "CANELA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LVL"
	},
	{
		"ID_IATA" : 156,
		"IATA" : "CVI",
		"NOMBRE" : "CURACAVI",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 157,
		"IATA" : "EQO",
		"NOMBRE" : "EL QUISCO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 158,
		"IATA" : "ILL",
		"NOMBRE" : "ILLAPEL",
		"REGION" : 4,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LVL"
	},
	{
		"ID_IATA" : 159,
		"IATA" : "LET",
		"NOMBRE" : "LA ESTRELLA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 160,
		"IATA" : "LLO",
		"NOMBRE" : "LLO-LLEO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 161,
		"IATA" : "LVL",
		"NOMBRE" : "LOS VILOS",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LVL"
	},
	{
		"ID_IATA" : 162,
		"IATA" : "MPO",
		"NOMBRE" : "MARIA PINTO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 163,
		"IATA" : "NOG",
		"NOMBRE" : "NOGALES",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 164,
		"IATA" : "OLM",
		"NOMBRE" : "OLMUE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 165,
		"IATA" : "PHT",
		"NOMBRE" : "PADRE HURTADO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 166,
		"IATA" : "PPO",
		"NOMBRE" : "PAPUDO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 167,
		"IATA" : "PUT",
		"NOMBRE" : "PUTAENDO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 168,
		"IATA" : "QPE",
		"NOMBRE" : "QUILPUE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "KNA"
	},
	{
		"ID_IATA" : 169,
		"IATA" : "RCA",
		"NOMBRE" : "REÑACA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "KNA"
	},
	{
		"ID_IATA" : 170,
		"IATA" : "SCA",
		"NOMBRE" : "SALAMANCA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LVL"
	},
	{
		"ID_IATA" : 171,
		"IATA" : "SFP",
		"NOMBRE" : "SAN FELIPE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 172,
		"IATA" : "SJS",
		"NOMBRE" : "SAN JOSE DE MAIPO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 173,
		"IATA" : "TJL",
		"NOMBRE" : "TERMAS DE JAHUEL",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 174,
		"IATA" : "TNT",
		"NOMBRE" : "TALAGANTE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 175,
		"IATA" : "VTA",
		"NOMBRE" : "VENTANAS",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZLC"
	},
	{
		"ID_IATA" : 176,
		"IATA" : "ZAR",
		"NOMBRE" : "ZAPALLAR",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 177,
		"IATA" : "ZMP",
		"NOMBRE" : "MELIPILLA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 178,
		"IATA" : "ZPN",
		"NOMBRE" : "PAINE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 179,
		"IATA" : "CHB",
		"NOMBRE" : "CHIMBARONGO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 180,
		"IATA" : "CHE",
		"NOMBRE" : "CHEPICA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 181,
		"IATA" : "CTS",
		"NOMBRE" : "CALETONES",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 182,
		"IATA" : "DNE",
		"NOMBRE" : "DOÑIHUE",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 183,
		"IATA" : "LOL",
		"NOMBRE" : "LOLOL",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 184,
		"IATA" : "MCG",
		"NOMBRE" : "MARCHIGUE",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 185,
		"IATA" : "OAL",
		"NOMBRE" : "OLIVAR ALTO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 186,
		"IATA" : "PDS",
		"NOMBRE" : "PAREDONES",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 187,
		"IATA" : "PLA",
		"NOMBRE" : "PALMILLA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 188,
		"IATA" : "PLL",
		"NOMBRE" : "PLACILLA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 189,
		"IATA" : "QCC",
		"NOMBRE" : "QUINTA TILCOCO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 190,
		"IATA" : "REQ",
		"NOMBRE" : "REQUINOA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 191,
		"IATA" : "SVT",
		"NOMBRE" : "SAN VICENTE DE T.T.",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 192,
		"IATA" : "ZCD",
		"NOMBRE" : "CODEGUA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 193,
		"IATA" : "ZRG",
		"NOMBRE" : "RENGO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 194,
		"IATA" : "ZSC",
		"NOMBRE" : "SANTA CRUZ",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 195,
		"IATA" : "BLN",
		"NOMBRE" : "BULNES",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 196,
		"IATA" : "CBQ",
		"NOMBRE" : "COBQUECURA",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 197,
		"IATA" : "CLB",
		"NOMBRE" : "COLBUN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 198,
		"IATA" : "CQE",
		"NOMBRE" : "CAUQUENES",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 199,
		"IATA" : "CUP",
		"NOMBRE" : "CUREPTO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 200,
		"IATA" : "CVJ",
		"NOMBRE" : "CHILLAN VIEJO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 201,
		"IATA" : "HNE",
		"NOMBRE" : "HUALAÑE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 202,
		"IATA" : "LCT",
		"NOMBRE" : "LICANTEN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 203,
		"IATA" : "LTE",
		"NOMBRE" : "LONTUE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 204,
		"IATA" : "NHE",
		"NOMBRE" : "NINHUE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 205,
		"IATA" : "PLC",
		"NOMBRE" : "PELARCO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 206,
		"IATA" : "PMO",
		"NOMBRE" : "PEMUCO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 207,
		"IATA" : "PZO",
		"NOMBRE" : "PORTEZUELO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 208,
		"IATA" : "QLL",
		"NOMBRE" : "QUILLON",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 209,
		"IATA" : "RCO",
		"NOMBRE" : "RIO CLARO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 210,
		"IATA" : "RML",
		"NOMBRE" : "ROMERAL",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 211,
		"IATA" : "SCM",
		"NOMBRE" : "SAN CLEMENTE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 212,
		"IATA" : "SCS",
		"NOMBRE" : "SAN CARLOS",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 213,
		"IATA" : "SGÑ",
		"NOMBRE" : "SAN GREGORIO DE ÑIQUEN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 214,
		"IATA" : "SIG",
		"NOMBRE" : "SAN IGNACIO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 215,
		"IATA" : "SRA",
		"NOMBRE" : "SAN RAFAEL",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 216,
		"IATA" : "TEN",
		"NOMBRE" : "TENO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 217,
		"IATA" : "YBB",
		"NOMBRE" : "YERBAS BUENAS",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LNR"
	},
	{
		"ID_IATA" : 218,
		"IATA" : "YGY",
		"NOMBRE" : "YUNGAY",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 219,
		"IATA" : "CCP",
		"NOMBRE" : "CONCEPCION",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 220,
		"IATA" : "LSQ",
		"NOMBRE" : "LOS ANGELES",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 221,
		"IATA" : "CPI",
		"NOMBRE" : "COLLIPULLI",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 222,
		"IATA" : "CRN",
		"NOMBRE" : "CORONEL",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 223,
		"IATA" : "CYE",
		"NOMBRE" : "CHIGUAYANTE",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 224,
		"IATA" : "DTO",
		"NOMBRE" : "DICHATO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 225,
		"IATA" : "LAS",
		"NOMBRE" : "LOS ALAMOS",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 226,
		"IATA" : "LLJ",
		"NOMBRE" : "LAJA",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 227,
		"IATA" : "MUL",
		"NOMBRE" : "MULCHEN",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 228,
		"IATA" : "NAC",
		"NOMBRE" : "NACIMIENTO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 229,
		"IATA" : "QCO",
		"NOMBRE" : "QUILACO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 230,
		"IATA" : "QLO",
		"NOMBRE" : "QUILLECO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 231,
		"IATA" : "STJ",
		"NOMBRE" : "SANTA JUANA",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 232,
		"IATA" : "TCP",
		"NOMBRE" : "TUCAPEL",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 233,
		"IATA" : "TMC",
		"NOMBRE" : "TOME",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 234,
		"IATA" : "ZHE",
		"NOMBRE" : "CURANILAHUE",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 235,
		"IATA" : "ZLB",
		"NOMBRE" : "LEBU",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 236,
		"IATA" : "ZOU",
		"NOMBRE" : "COELEMU",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 237,
		"IATA" : "ZTO",
		"NOMBRE" : "TALCAHUANO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 238,
		"IATA" : "ZYU",
		"NOMBRE" : "YUMBEL",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 239,
		"IATA" : "CCC",
		"NOMBRE" : "CURACAUTIN",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 240,
		"IATA" : "CRH",
		"NOMBRE" : "CARAHUE",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 241,
		"IATA" : "CUR",
		"NOMBRE" : "CURARREHUE",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 242,
		"IATA" : "FRE",
		"NOMBRE" : "FREIRE",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 243,
		"IATA" : "GAL",
		"NOMBRE" : "GALVARINO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 244,
		"IATA" : "GEA",
		"NOMBRE" : "GORBEA",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 245,
		"IATA" : "LQY",
		"NOMBRE" : "LONQUIMAY",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 246,
		"IATA" : "LTR",
		"NOMBRE" : "LAUTARO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 247,
		"IATA" : "LUM",
		"NOMBRE" : "LUMACO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 248,
		"IATA" : "NCO",
		"NOMBRE" : "CUNCO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 249,
		"IATA" : "NIP",
		"NOMBRE" : "NUEVA IMPERIAL",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 250,
		"IATA" : "PCA",
		"NOMBRE" : "PADRE LAS CASAS",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 251,
		"IATA" : "PQO",
		"NOMBRE" : "PERQUENCO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 252,
		"IATA" : "PUR",
		"NOMBRE" : "PUREN",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 253,
		"IATA" : "SUS",
		"NOMBRE" : "LOS SAUCES",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 254,
		"IATA" : "TSC",
		"NOMBRE" : "TEODORO SCHMIDT",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 255,
		"IATA" : "PBL",
		"NOMBRE" : "Peñablanca",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 256,
		"IATA" : "VIL",
		"NOMBRE" : "VILCUN",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 257,
		"IATA" : "ZEN",
		"NOMBRE" : "TRAIGUEN",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 258,
		"IATA" : "ZPS",
		"NOMBRE" : "PUERTO SAAVEDRA",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 259,
		"IATA" : "ZPU",
		"NOMBRE" : "PUCON",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 260,
		"IATA" : "PAM",
		"NOMBRE" : "POZO AL MONTE",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 261,
		"IATA" : "PTR",
		"NOMBRE" : "PUTRE",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ARI"
	},
	{
		"ID_IATA" : 262,
		"IATA" : "PUQ",
		"NOMBRE" : "PUNTA ARENAS",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 263,
		"IATA" : "PNT",
		"NOMBRE" : "PUERTO NATALES",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 264,
		"IATA" : "PRI",
		"NOMBRE" : "PRIMAVERA",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 265,
		"IATA" : "SGR",
		"NOMBRE" : "SAN GREGORIO",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 266,
		"IATA" : "TDP",
		"NOMBRE" : "TORRES DEL PAINE",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 267,
		"IATA" : "ZPR",
		"NOMBRE" : "PORVENIR",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 268,
		"IATA" : "ANF",
		"NOMBRE" : "ANTOFAGASTA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 269,
		"IATA" : "MAE",
		"NOMBRE" : "MARIA ELENA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 270,
		"IATA" : "QUI",
		"NOMBRE" : "CHUQUICAMATA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CJC"
	},
	{
		"ID_IATA" : 271,
		"IATA" : "TTL",
		"NOMBRE" : "TALTAL",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 272,
		"IATA" : "DAG",
		"NOMBRE" : "DIEGO DE ALMAGRO",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 273,
		"IATA" : "MNN",
		"NOMBRE" : "MONTANDON",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 274,
		"IATA" : "LSC",
		"NOMBRE" : "LA SERENA",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 275,
		"IATA" : "CHZ",
		"NOMBRE" : "CHAÑARAL ALTO",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 276,
		"IATA" : "FRN",
		"NOMBRE" : "FREIRINA",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "VAL"
	},
	{
		"ID_IATA" : 277,
		"IATA" : "MPC",
		"NOMBRE" : "MONTE PATRIA",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "OVL"
	},
	{
		"ID_IATA" : 278,
		"IATA" : "RHT",
		"NOMBRE" : "RIO HURTADO",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "OVL"
	},
	{
		"ID_IATA" : 279,
		"IATA" : "KNA",
		"NOMBRE" : "VIÑA DEL MAR",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "KNA"
	},
	{
		"ID_IATA" : 280,
		"IATA" : "CAT",
		"NOMBRE" : "CATEMU",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 281,
		"IATA" : "CLG",
		"NOMBRE" : "CALLE LARGA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 282,
		"IATA" : "CRT",
		"NOMBRE" : "CARTAGENA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 283,
		"IATA" : "EPC",
		"NOMBRE" : "EL PAICO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 284,
		"IATA" : "IDM",
		"NOMBRE" : "ISLA DE MAIPO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 285,
		"IATA" : "LCZ",
		"NOMBRE" : "LA CRUZ",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 286,
		"IATA" : "LLC",
		"NOMBRE" : "LA LIGUA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 287,
		"IATA" : "EAR",
		"NOMBRE" : "El Arenal",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 288,
		"IATA" : "NAV",
		"NOMBRE" : "NAVIDAD",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 289,
		"IATA" : "PFL",
		"NOMBRE" : "PEÑAFLOR",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 290,
		"IATA" : "PTK",
		"NOMBRE" : "PETORCA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 291,
		"IATA" : "QTO",
		"NOMBRE" : "QUINTERO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 292,
		"IATA" : "SDO",
		"NOMBRE" : "SALADILLO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 293,
		"IATA" : "TIL",
		"NOMBRE" : "TILTIL",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 294,
		"IATA" : "VIA",
		"NOMBRE" : "VILLA ALEMANA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 295,
		"IATA" : "ZBU",
		"NOMBRE" : "BUIN",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 296,
		"IATA" : "RCG",
		"NOMBRE" : "RANCAGUA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 297,
		"IATA" : "CTO",
		"NOMBRE" : "COLTAUCO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 298,
		"IATA" : "LCB",
		"NOMBRE" : "LAS CABRAS",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 299,
		"IATA" : "NGA",
		"NOMBRE" : "NANCAGUA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 300,
		"IATA" : "PHA",
		"NOMBRE" : "PICHIDEGUA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 301,
		"IATA" : "PMU",
		"NOMBRE" : "PICHILEMU",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 302,
		"IATA" : "SFR",
		"NOMBRE" : "SAN FERNANDO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 303,
		"IATA" : "ZPE",
		"NOMBRE" : "PERALILLO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 304,
		"IATA" : "ZCA",
		"NOMBRE" : "TALCA",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 305,
		"IATA" : "CHA",
		"NOMBRE" : "CHANCO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 306,
		"IATA" : "CUH",
		"NOMBRE" : "COIHUECO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 307,
		"IATA" : "EPD",
		"NOMBRE" : "EMPEDRADO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 308,
		"IATA" : "LNR",
		"NOMBRE" : "LINARES",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "LNR"
	},
	{
		"ID_IATA" : 309,
		"IATA" : "PIN",
		"NOMBRE" : "PINTO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 310,
		"IATA" : "PUH",
		"NOMBRE" : "PELLUHUE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 311,
		"IATA" : "RAU",
		"NOMBRE" : "RAUCO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 312,
		"IATA" : "RTI",
		"NOMBRE" : "RETIRO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 313,
		"IATA" : "SFN",
		"NOMBRE" : "SAN FABIAN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 314,
		"IATA" : "SNL",
		"NOMBRE" : "SAN NICOLAS",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 315,
		"IATA" : "VGE",
		"NOMBRE" : "VILLA ALEGRE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 316,
		"IATA" : "ZMO",
		"NOMBRE" : "MOLINA",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 317,
		"IATA" : "ARA",
		"NOMBRE" : "ARAUCO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 318,
		"IATA" : "CTE",
		"NOMBRE" : "CAÑETE",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 319,
		"IATA" : "HLQ",
		"NOMBRE" : "HUALQUI",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 320,
		"IATA" : "LRQ",
		"NOMBRE" : "LIRQUEN",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 321,
		"IATA" : "PCO",
		"NOMBRE" : "PENCO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 322,
		"IATA" : "SBB",
		"NOMBRE" : "SANTA BARBARA",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 323,
		"IATA" : "SRO",
		"NOMBRE" : "SAN ROSENDO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 324,
		"IATA" : "AUE",
		"NOMBRE" : "Alhue",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 325,
		"IATA" : "THO",
		"NOMBRE" : "TREHUACO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 326,
		"IATA" : "ZOL",
		"NOMBRE" : "ANGOL",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 327,
		"IATA" : "ZCO",
		"NOMBRE" : "TEMUCO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 328,
		"IATA" : "ERC",
		"NOMBRE" : "ERCILLA",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 329,
		"IATA" : "ENC",
		"NOMBRE" : "Encenada",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 330,
		"IATA" : "MEL",
		"NOMBRE" : "MELIPEUCO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 331,
		"IATA" : "PQN",
		"NOMBRE" : "PITRUFQUEN",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 332,
		"IATA" : "TOL",
		"NOMBRE" : "TOLTEN",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 333,
		"IATA" : "VRR",
		"NOMBRE" : "VILLARRICA",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 334,
		"IATA" : "PMC",
		"NOMBRE" : "PUERTO MONTT",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "PMC"
	},
	{
		"ID_IATA" : 335,
		"IATA" : "LNA",
		"NOMBRE" : "LA NEGRA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 336,
		"IATA" : "OVR",
		"NOMBRE" : "VERGARA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 337,
		"IATA" : "TOC",
		"NOMBRE" : "TOCOPILLA",
		"REGION" : 2,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ANF"
	},
	{
		"ID_IATA" : 338,
		"IATA" : "CLR",
		"NOMBRE" : "CALDERA",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 339,
		"IATA" : "LLT",
		"NOMBRE" : "LLANTA",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 340,
		"IATA" : "TRM",
		"NOMBRE" : "TIERRA AMARILLA",
		"REGION" : 3,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CPO"
	},
	{
		"ID_IATA" : 341,
		"IATA" : "ADC",
		"NOMBRE" : "ALTO DEL CARMEN",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "VAL"
	},
	{
		"ID_IATA" : 342,
		"IATA" : "EPI",
		"NOMBRE" : "EL PALQUI",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 343,
		"IATA" : "LRR",
		"NOMBRE" : "LA HERRADURA",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 344,
		"IATA" : "PTQ",
		"NOMBRE" : "PUNITAQUI",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "OVL"
	},
	{
		"ID_IATA" : 345,
		"IATA" : "VCA",
		"NOMBRE" : "VICUÑA",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 346,
		"IATA" : "BUU",
		"NOMBRE" : "BUCALEMU",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 347,
		"IATA" : "CDT",
		"NOMBRE" : "CALERA DE TANGO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 348,
		"IATA" : "CON",
		"NOMBRE" : "CONCON",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "KNA"
	},
	{
		"ID_IATA" : 349,
		"IATA" : "EML",
		"NOMBRE" : "EL MELON",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZLC"
	},
	{
		"ID_IATA" : 350,
		"IATA" : "HJS",
		"NOMBRE" : "HIJUELAS",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 351,
		"IATA" : "LAV",
		"NOMBRE" : "LAGUNA VERDE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "KNA"
	},
	{
		"ID_IATA" : 352,
		"IATA" : "LIC",
		"NOMBRE" : "LIMACHE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 353,
		"IATA" : "LOB",
		"NOMBRE" : "LOS ANDES",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 354,
		"IATA" : "MTC",
		"NOMBRE" : "MAITENCILLO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 355,
		"IATA" : "PCV",
		"NOMBRE" : "PUCHUNCAVI",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 356,
		"IATA" : "PRT",
		"NOMBRE" : "PORTILLO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 357,
		"IATA" : "QTA",
		"NOMBRE" : "QUILLOTA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 358,
		"IATA" : "SDC",
		"NOMBRE" : "SANTO DOMINGO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 359,
		"IATA" : "SNT",
		"NOMBRE" : "SAN ANTONIO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 360,
		"IATA" : "VAP",
		"NOMBRE" : "VALPARAISO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "KNA"
	},
	{
		"ID_IATA" : 361,
		"IATA" : "ZBA",
		"NOMBRE" : "BATUCO",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 362,
		"IATA" : "ZTE",
		"NOMBRE" : "EL MONTE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SCL"
	},
	{
		"ID_IATA" : 363,
		"IATA" : "CNO",
		"NOMBRE" : "COINCO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 364,
		"IATA" : "GRA",
		"NOMBRE" : "GRANEROS",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 365,
		"IATA" : "MCH",
		"NOMBRE" : "MACHALI",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 366,
		"IATA" : "PEO",
		"NOMBRE" : "PEUMO",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 367,
		"IATA" : "PMQ",
		"NOMBRE" : "PEÑUELAS",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 368,
		"IATA" : "SFM",
		"NOMBRE" : "SAN FCO. DE MOSTAZAL",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 369,
		"IATA" : "ZML",
		"NOMBRE" : "MALLOA",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 370,
		"IATA" : "YAI",
		"NOMBRE" : "CHILLAN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 371,
		"IATA" : "CCO",
		"NOMBRE" : "CURICO",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 1,
		"TIPO_DESCRIPCION" : "PRINCIPAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 372,
		"IATA" : "CTT",
		"NOMBRE" : "CONSTITUCION",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 373,
		"IATA" : "ECN",
		"NOMBRE" : "EL CARMEN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 374,
		"IATA" : "LGV",
		"NOMBRE" : "LONGAVI",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LNR"
	},
	{
		"ID_IATA" : 375,
		"IATA" : "PCH",
		"NOMBRE" : "PENCAHUE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 376,
		"IATA" : "PRR",
		"NOMBRE" : "PARRAL",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LNR"
	},
	{
		"ID_IATA" : 377,
		"IATA" : "QRH",
		"NOMBRE" : "QUIRIHUE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 378,
		"IATA" : "RQL",
		"NOMBRE" : "RANQUIL",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 379,
		"IATA" : "SFA",
		"NOMBRE" : "SAGRADA FAMILIA",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 380,
		"IATA" : "SJA",
		"NOMBRE" : "SAN JAVIER",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 381,
		"IATA" : "VCQ",
		"NOMBRE" : "VICHUEQUEN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCO"
	},
	{
		"ID_IATA" : 382,
		"IATA" : "ZMA",
		"NOMBRE" : "MAULE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 383,
		"IATA" : "ANT",
		"NOMBRE" : "ANTUCO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 384,
		"IATA" : "CRO",
		"NOMBRE" : "CABRERO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 385,
		"IATA" : "FLD",
		"NOMBRE" : "FLORIDA",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 386,
		"IATA" : "LOT",
		"NOMBRE" : "LOTA",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 387,
		"IATA" : "NRE",
		"NOMBRE" : "NEGRETE",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 388,
		"IATA" : "RNA",
		"NOMBRE" : "RENAICO",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 389,
		"IATA" : "SPP",
		"NOMBRE" : "SAN PEDRO DE LA PAZ",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 390,
		"IATA" : "WPC",
		"NOMBRE" : "PUERTO CHACABUCO",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	},
	{
		"ID_IATA" : 391,
		"IATA" : "ZCT",
		"NOMBRE" : "CONTULMO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CCP"
	},
	{
		"ID_IATA" : 392,
		"IATA" : "CHQ",
		"NOMBRE" : "Chinquihue",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 393,
		"IATA" : "CAR",
		"NOMBRE" : "Carelmapu",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 394,
		"IATA" : "HUE",
		"NOMBRE" : "HUEPIL",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 395,
		"IATA" : "LLA",
		"NOMBRE" : "Llara",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 396,
		"IATA" : "MON",
		"NOMBRE" : "Monte Aguila",
		"REGION" : 8,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 397,
		"IATA" : "NAH",
		"NOMBRE" : "Nahueltoro",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 398,
		"IATA" : "PEL",
		"NOMBRE" : "Pelicano",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSC"
	},
	{
		"ID_IATA" : 399,
		"IATA" : "PIA",
		"NOMBRE" : "Piedra Azul",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 400,
		"IATA" : "PUS",
		"NOMBRE" : "Puerto Seco",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 401,
		"IATA" : "PZL",
		"NOMBRE" : "Pelluco",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 402,
		"IATA" : "CRP",
		"NOMBRE" : "CURANIPE",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCA"
	},
	{
		"ID_IATA" : 403,
		"IATA" : "SPE",
		"NOMBRE" : "San Pedro de Melipilla",
		"REGION" : 13,
		"SECTOR" : "ST",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SNT"
	},
	{
		"ID_IATA" : 404,
		"IATA" : "PAR",
		"NOMBRE" : "PARGUA",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZPV"
	},
	{
		"ID_IATA" : 405,
		"IATA" : "LIR",
		"NOMBRE" : "LICAN RAY",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 406,
		"IATA" : "STM",
		"NOMBRE" : "SANTA MARIA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 407,
		"IATA" : "HAA",
		"NOMBRE" : "HUARA",
		"REGION" : 1,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "IQQ"
	},
	{
		"ID_IATA" : 408,
		"IATA" : "GNQ",
		"NOMBRE" : "GUANAQUEROS",
		"REGION" : 4,
		"SECTOR" : "NC",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "COQ"
	},
	{
		"ID_IATA" : 409,
		"IATA" : "SEA",
		"NOMBRE" : "SAN ESTEBAN DE LOS ANDES",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 410,
		"IATA" : "CPT",
		"NOMBRE" : "CAPITAN PASTENES",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 411,
		"IATA" : "PHI",
		"NOMBRE" : "PICHIDANGUI",
		"REGION" : 4,
		"SECTOR" : "NG",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LVL"
	},
	{
		"ID_IATA" : 412,
		"IATA" : "JUA",
		"NOMBRE" : "JUAN FERNANDEZ",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "VAP"
	},
	{
		"ID_IATA" : 413,
		"IATA" : "NAL",
		"NOMBRE" : "NUEVA ALDEA",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 414,
		"IATA" : "AYS",
		"NOMBRE" : "AYSEN",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "WPA"
	},
	{
		"ID_IATA" : 415,
		"IATA" : "PUM",
		"NOMBRE" : "PUMANQUE",
		"REGION" : 6,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "RCG"
	},
	{
		"ID_IATA" : 416,
		"IATA" : "WPU",
		"NOMBRE" : "CABO DE HORNOS",
		"REGION" : 12,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "PUQ"
	},
	{
		"ID_IATA" : 417,
		"IATA" : "ABB",
		"NOMBRE" : "ALTO BIO BIO",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "LSQ"
	},
	{
		"ID_IATA" : 418,
		"IATA" : "CHO",
		"NOMBRE" : "CHOLCHOL",
		"REGION" : 9,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "ZCO"
	},
	{
		"ID_IATA" : 419,
		"IATA" : "ACH",
		"NOMBRE" : "Achao",
		"REGION" : 10,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "CTR"
	},
	{
		"ID_IATA" : 420,
		"IATA" : "PAQ",
		"NOMBRE" : "PANQUEHUE",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 421,
		"IATA" : "RIN",
		"NOMBRE" : "RINCONADA",
		"REGION" : 5,
		"SECTOR" : "CE",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "SFP"
	},
	{
		"ID_IATA" : 422,
		"IATA" : "ÑIQ",
		"NOMBRE" : "ÑIQUEN",
		"REGION" : 7,
		"SECTOR" : "SU",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "YAI"
	},
	{
		"ID_IATA" : 423,
		"IATA" : "CIN",
		"NOMBRE" : "CISNES",
		"REGION" : 11,
		"SECTOR" : "PA",
		"TIPO" : 2,
		"TIPO_DESCRIPCION" : "RAMAL",
		"IATA_PADRE" : "GXQ"
	}
]
    }
    this.changeFechaInicio = this.changeFechaInicio.bind(this);
    this.changeFechaFin = this.changeFechaFin.bind(this);
    this.changeTituloRegiones = this.changeTituloRegiones.bind(this);
    this.buscar = this.buscar.bind(this);
    this.isExpandableRow=this.isExpandableRow.bind(this);
    this.changeApertura=this.changeApertura.bind(this);
    this.changeCargoex=this.changeCargoex.bind(this);
    this.changeB2c=this.changeB2c.bind(this);
  }
  changeCargoex(event){
    var state = this.state.checkCargoex;
    var stateB2c = this.state.checkB2c;
    if (state===true){
      if(stateB2c===true){
        this.setState({
          checkCargoex:false,
          displayBuscar:'block'
        });
      }else{
        this.setState({
          checkCargoex:false,
          displayBuscar:'none'
        });
      }
    }else{
        this.setState({
          checkCargoex:true,
          displayBuscar:'block'
        });
    }
  }
  changeB2c(event){
    var state = this.state.checkB2c;
    var stateCargoex = this.state.checkCargoex;
    if (state===true){
      if(stateCargoex===true){
        this.setState({
          checkB2c:false,
          displayBuscar:'block'
        });
      }else{
        this.setState({
          checkB2c:false,
          displayBuscar:'none'
        });
      }

    }else{
      this.setState({
        checkB2c:true,
        displayBuscar:'block'
      });
    }
  }
  changeApertura(event){
    var state = this.state.checkApertura;
    if (state===true){
      this.setState({
        checkApertura:false
      });
    }else{
      this.setState({
        checkApertura:true
      });
    }
  }
  busquedaTodos(datos){
    var regionesBd=[];
    var regiones=datos;
    for(let region of regiones){
      var index = this.isRegion(regionesBd,region.CIUDAD);
      var total = region.TOTAL;
      var bio = region.BIO;
      var normal = total-bio;
      var intentos=region.INTENTOS;
      var porcentajeEfectividadHI=this.myRound(((bio+intentos)*100)/total,1);
      var porcentajeEfectividad=this.myRound((bio*100)/total,1);
      var b2c = region.B2C;
      var cargoex= total-b2c;
      var b2cbio= region.B2CBIO;
      var cargoexbio=bio-b2cbio;
      var cargoexnormal=cargoex-cargoexbio;
      var b2cnormal=b2c-b2cbio;
      var b2ci=region.B2CBIOI;
      var cargoexi=intentos-b2ci;
      var efectividadb2c=this.myRound((b2cbio*100)/b2c,1);
      var efectividadcargoex=this.myRound((cargoexbio*100)/cargoex,1);
      var efectividadb2chi=this.myRound(((b2cbio+b2ci)*100)/b2c,1);
      var efectividadcargoexhi=this.myRound(((cargoexbio+cargoexi)*100)/cargoex,1);
      if(b2c===0){
     efectividadb2c='0';
     efectividadb2chi='0';
      }
      if(index===-1){
          regionesBd.push({
          id:regionesBd.length,
          region: region.CIUDAD,
          total: 21,
          bio:20,
          normal:30,
          efectividad:30,
          intentos:20,
          efectividadhi:20,
          b2c:0,
          cargoex:0,
          b2cbio:0,
          cargoexbio:0,
          cargoexnormal:0,
          b2cnormal:0,
          b2ci:0,
          cargoexi:0,
          efectividadb2c:0,
          efectividadcargoex:0,
          efectividadb2chi:0,
          efectividadcargoexhi:0,
          expand: [{agente: region.NOMBRE.toUpperCase(),total: region.TOTAL,bio:region.BIO,normal:normal,efectividad:porcentajeEfectividad+'%',intentos:region.INTENTOS,efectividadhi:porcentajeEfectividadHI+'%',b2c:b2c,cargoex:cargoex,b2cbio:b2cbio,cargoexbio:cargoexbio,b2ci:b2ci,cargoexi:cargoexi,efectividadb2c:efectividadb2c+'%',efectividadcargoex:efectividadcargoex+'%',efectividadb2chi:efectividadb2chi+'%',efectividadcargoexhi:efectividadcargoexhi+'%',cargoexnormal:cargoexnormal,b2cnormal:b2cnormal}]
        });
      }else{
        regionesBd[index].expand.push({agente: region.NOMBRE.toUpperCase(),total: region.TOTAL,bio:region.BIO,normal:normal,efectividad:porcentajeEfectividad+'%',intentos:region.INTENTOS,efectividadhi:porcentajeEfectividadHI+'%',b2c:b2c,cargoex:cargoex,b2cbio:b2cbio,cargoexbio:cargoexbio,b2ci:b2ci,cargoexi:cargoexi,efectividadb2c:efectividadb2c+'%',efectividadcargoex:efectividadcargoex+'%',efectividadb2chi:efectividadb2chi+'%',efectividadcargoexhi:efectividadcargoexhi+'%',cargoexnormal:cargoexnormal,b2cnormal:b2cnormal});
      }
    }
    var ciudades = this.state.ciudades;
    for(let region of regionesBd){
       var total=0;
       var bio=0;
       var intentos=0;
       var b2c = 0;
       var cargoex= 0;
       var b2cbio= 0;
       var cargoexbio=0;
       var b2ci=0;
       var cargoexi=0;
       for(let agente of region.expand){
         total+=agente.total;
         bio+=agente.bio;
         intentos+=agente.intentos;
         b2c+=agente.b2c;
         cargoex+=agente.cargoex;
         b2cbio+=agente.b2cbio;
         cargoexbio+=agente.cargoexbio;
         b2ci+=agente.b2ci;
         cargoexi+=agente.cargoexi;
       }
       var normal = total-bio;
       var porcentajeEfectividad=this.myRound((bio*100)/total,1);
       var porcentajeEfectividadHI=this.myRound(((bio+intentos)*100)/total,1);
       var efectividadb2c=this.myRound((b2cbio*100)/b2c,1);
       var efectividadcargoex=this.myRound((cargoexbio*100)/cargoex,1);
       var efectividadb2chi=this.myRound(((b2cbio+b2ci)*100)/b2c,1);
       var efectividadcargoexhi=this.myRound(((cargoexbio+cargoexi)*100)/cargoex,1);
       var cargoexnormal=cargoex-cargoexbio;
       var b2cnormal=b2c-b2cbio;
       region.total=total;
       region.bio=bio;
       region.normal=normal;
       region.intentos=intentos;
       region.b2c=b2c;
       region.cargoex=cargoex;
       region.b2cbio=b2cbio;
       region.cargoexbio=cargoexbio;
       region.b2ci=b2ci;
       region.cargoexi=cargoexi;
       region.cargoexnormal=cargoexnormal;
       region.b2cnormal=b2cnormal;
       if(total===0){
         region.efectividad='0%';
         region.efectividadhi='0%';
         region.efectividadb2c='0%';
         region.efectividadcargoex='0%';
         region.efectividadb2chi='0%';
         region.efectividadcargoexhi='0%';
       }else{
         region.efectividad=porcentajeEfectividad+'%';
         region.efectividadhi=porcentajeEfectividadHI+'%';
         region.efectividadb2c=efectividadb2c+'%';
         region.efectividadcargoex=efectividadcargoex+'%';
         region.efectividadb2chi=efectividadb2chi+'%';
         region.efectividadcargoexhi=efectividadcargoexhi+'%';
         if(b2c===0){
        region.efectividadb2c='0%';
        region.efectividadb2chi='0%';
         }

     }
     for(let ciudad of ciudades){
       if(ciudad.IATA === region.region){
         region.region=ciudad.NOMBRE;
       }
     }
    }
    regionesBd.sort(function(a, b) {
        return parseFloat(b.bio) - parseFloat(a.bio);
    });
    return regionesBd;
  }
  buscar(event) {
    this.setState({
      loading:true,
      displayTablaIndividual:'none',
      displayTablaTodos:'none',
      displayTablaTodosAperturaCargoex:'none',
      displayTablaAperturada:'none',
      displayTablaTodosCargoex:'none',
      displayTablaTodosB2c:'none',
      displayTablaIndividualCargoex:'none',
      displayTablaIndividualB2c:'none',
      displayTablaTodosAperturaB2c:'none'
    });
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
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    let data = JSON.stringify({
      region: this.state.iata,
      fechai: dia+"/"+mes+'/'+this.state.fechaInicio.getFullYear(),
      fechaf: diaf+"/"+mesf+'/'+this.state.fechaFin.getFullYear()
    });
    console.log(data);
    var apertura = this.state.checkApertura;
    var cargoex = this.state.checkCargoex;
    var b2c = this.state.checkB2c;
    if(this.state.value==='TODOS'){
        if(apertura===false && cargoex === true && b2c === true){

      //    axios.post("http://localhost:5000/regionesHuella",data,config)
          axios.post("http://localhost:5000/regionesHuella",data,config)
                .then(res => {
                    const regiones = res.data;
                    if(regiones.length>0){
                    const regionesBd=this.busquedaTodos(regiones);
                    console.log('imprimira arreglo listo');
                    console.log(regionesBd);
                    this.setState({
                        displayTablaTodos:'block',
                        displayTablaIndividual:'none',
                        displayTablaAperturada:'none',
                        displayTablaTodosAperturaB2c:'none',
                        displayTablaTodosCargoex:'none',
                        displayTablaTodosB2c:'none',
                        displayTablaIndividualCargoex:'none',
                        displayTablaIndividualB2c:'none',
                        displayTablaTodosAperturaCargoex:'none',
                        loading:false,
                        sinResultados:'none',
                        datosTodos:regionesBd
                      });
                }else{
                    this.setState({
                      displayTablaTodos:'none',
                      displayTablaIndividual:'none',
                      displayTablaAperturada:'none',
                      displayTablaTodosAperturaB2c:'none',
                      displayTablaTodosCargoex:'none',
                      displayTablaTodosB2c:'none',
                      displayTablaIndividualCargoex:'none',
                      displayTablaIndividualB2c:'none',
                      displayTablaTodosAperturaCargoex:'none',
                      loading:false,
                      displayApertura:'none',
                      sinResultados:'block'
                  });
                }
                });
        }else if (apertura===true && cargoex === true && b2c === true){
        //  axios.post("http://localhost:5000/regionesHuella",data,config)
          axios.post("http://localhost:5000/regionesHuella",data,config)
                .then(res => {
                    console.log('react respondio en todos');
                    const regiones = res.data;
                    if(regiones.length>0){
                    const regionesBd=this.busquedaTodos(regiones);
                    var datosTablaAperturada=[];
                    for(let region of regionesBd){
                        for(let agente of region.expand){
                          var aux = agente;
                          aux['region']=region.region;
                          datosTablaAperturada.push(aux);
                        }
                    }
                    console.log(datosTablaAperturada);
                    this.setState({
                        displayTablaTodos:'none',
                        displayTablaIndividual:'none',
                        displayTablaAperturada:'block',
                        loading:false,
                        displayTablaTodosAperturaB2c:'none',
                        displayTablaTodosCargoex:'none',
                        displayTablaTodosB2c:'none',
                        displayTablaIndividualCargoex:'none',
                        displayTablaIndividualB2c:'none',
                        displayTablaTodosAperturaCargoex:'none',
                        sinResultados:'none',
                        datosTablaAperturada:datosTablaAperturada
                      });

                }else{
                  this.setState({
                    displayTablaTodos:'none',
                    displayTablaIndividual:'none',
                    displayTablaTodosAperturaB2c:'none',
                    displayTablaTodosAperturaCargoex:'none',
                    displayTablaTodosCargoex:'none',
                    displayTablaTodosB2c:'none',
                    displayTablaIndividualB2c:'none',
                    displayTablaIndividualCargoex:'none',
                    loading:false,
                    displayApertura:'none',
                    sinResultados:'block'
                  });
                }
                });
        }else if (apertura===true && cargoex === true && b2c === false){
          //  axios.post("http://localhost:5000/regionesHuella",data,config)
          axios.post("http://localhost:5000/regionesHuella",data,config)
                .then(res => {
                    console.log('react respondio en todos');
                    const regiones = res.data;
                    if(regiones.length>0){
                    const regionesBd=this.busquedaTodos(regiones);
                    var datosTablaAperturada=[];
                    for(let region of regionesBd){
                        for(let agente of region.expand){
                          var aux = agente;
                          aux['region']=region.region;
                          datosTablaAperturada.push(aux);
                        }
                    }
                    console.log(datosTablaAperturada);
                    this.setState({
                        displayTablaTodos:'none',
                        displayTablaIndividual:'none',
                        displayTablaAperturada:'none',
                        displayTablaTodosAperturaB2c:'none',
                        displayTablaTodosAperturaCargoex:'block',
                        displayTablaTodosCargoex:'none',
                        displayTablaTodosB2c:'none',
                        displayTablaIndividualCargoex:'none',
                        displayTablaIndividualB2c:'none',
                        loading:false,
                        sinResultados:'none',
                        datosTablaTodosAperturaCargoex:datosTablaAperturada
                      });

                }else{
                  this.setState({
                    displayTablaTodos:'none',
                    displayTablaIndividual:'none',
                    displayTablaAperturada:'none',
                    displayTablaTodosAperturaB2c:'none',
                    displayTablaTodosAperturaCargoex:'none',
                    displayTablaTodosCargoex:'none',
                    displayTablaTodosB2c:'none',
                    displayTablaIndividualCargoex:'none',
                    displayTablaIndividualB2c:'none',
                    loading:false,
                    displayApertura:'none',
                    sinResultados:'block'
                  });
                }
                });
        }else if (apertura===true && cargoex === false && b2c === true){
      //       axios.post("http://localhost:5000/regionesHuella",data,config)

                axios.post("http://localhost:5000/regionesHuella",data,config)
                .then(res => {
                    console.log('react respondio en todos');
                    const regiones = res.data;
                    if(regiones.length>0){
                    const regionesBd=this.busquedaTodos(regiones);
                    var datosTablaAperturada=[];
                    for(let region of regionesBd){
                        for(let agente of region.expand){
                          var aux = agente;
                          aux['region']=region.region;
                          datosTablaAperturada.push(aux);
                        }
                    }
                    console.log(datosTablaAperturada);
                    this.setState({
                        displayTablaTodos:'none',
                        displayTablaIndividual:'none',
                        displayTablaAperturada:'none',
                        displayTablaTodosAperturaCargoex:'none',
                        displayTablaTodosCargoex:'none',
                        displayTablaTodosB2c:'none',
                        displayTablaIndividualCargoex:'none',
                        displayTablaIndividualB2c:'none',
                        displayTablaTodosAperturaB2c:'block',
                        loading:false,
                        sinResultados:'none',
                        datosTablaTodosAperturaB2c:datosTablaAperturada
                      });

                }else{
                  this.setState({
                    displayTablaTodos:'none',
                    displayTablaIndividual:'none',
                    displayTablaAperturada:'none',
                    displayTablaTodosAperturaB2c:'none',
                    displayTablaTodosAperturaCargoex:'none',
                    displayTablaTodosCargoex:'none',
                    displayTablaTodosB2c:'none',
                    displayTablaIndividualCargoex:'none',
                    displayTablaIndividualB2c:'none',
                    loading:false,
                    displayApertura:'none',
                    sinResultados:'block'
                  });
                }
                });
        }else if(apertura===false && cargoex === true && b2c === false){
          //  axios.post("http://localhost:5000/regionesHuella",data,config)
          axios.post("http://localhost:5000/regionesHuella",data,config)
                .then(res => {
                    const regiones = res.data;
                    if(regiones.length>0){
                    const regionesBd=this.busquedaTodos(regiones);
                    console.log('imprimira arreglo listo');
                    console.log(regionesBd);
                    this.setState({
                        displayTablaTodos:'none',
                        displayTablaIndividual:'none',
                        displayTablaAperturada:'none',
                        displayTablaTodosAperturaCargoex:'none',
                        displayTablaTodosCargoex:'block',
                        displayTablaTodosB2c:'none',
                        displayTablaIndividualCargoex:'none',
                        displayTablaIndividualB2c:'none',
                        displayTablaTodosAperturaB2c:'none',
                        loading:false,
                        sinResultados:'none',
                        datosTodos:regionesBd
                      });
                }else{
                    this.setState({
                      displayTablaTodos:'none',
                      displayTablaIndividual:'none',
                      displayTablaAperturada:'none',
                      displayTablaTodosAperturaCargoex:'none',
                      displayTablaTodosAperturaB2c:'none',
                      displayTablaTodosCargoex:'none',
                      displayTablaIndividualCargoex:'none',
                      displayTablaIndividualB2c:'none',
                      displayTablaTodosB2c:'none',
                      loading:false,
                      displayApertura:'none',
                      sinResultados:'block'
                  });
                }
                });
        }else if(apertura===false && cargoex === false && b2c === true){
            // axios.post("http://localhost:5000/regionesHuella",data,config)

            axios.post("http://localhost:5000/regionesHuella",data,config)
                .then(res => {
                    const regiones = res.data;
                    if(regiones.length>0){
                    const regionesBd=this.busquedaTodos(regiones);
                    console.log('imprimira arreglo listo');
                    console.log(regionesBd);
                    this.setState({
                        displayTablaTodos:'none',
                        displayTablaIndividual:'none',
                        displayTablaAperturada:'none',
                        displayTablaTodosAperturaCargoex:'none',
                        displayTablaTodosCargoex:'none',
                        displayTablaIndividualCargoex:'none',
                        displayTablaIndividualB2c:'none',
                        displayTablaTodosB2c:'block',
                        displayTablaTodosAperturaB2c:'none',
                        loading:false,
                        sinResultados:'none',
                        datosTodos:regionesBd
                      });
                }else{
                    this.setState({
                      displayTablaTodos:'none',
                      displayTablaIndividual:'none',
                      displayTablaAperturada:'none',
                      displayTablaTodosAperturaCargoex:'none',
                      displayTablaTodosAperturaB2c:'none',
                      displayTablaTodosCargoex:'none',
                      displayTablaTodosB2c:'none',
                      displayTablaIndividualCargoex:'none',
                      displayTablaIndividualB2c:'none',
                      loading:false,
                      displayApertura:'none',
                      sinResultados:'block'
                  });
                }
                });
        }
    }else{
      console.log('respondio en uno');
      if(cargoex === true && b2c === true){
      //  axios.post("http://localhost:5000/regionesHuella",data,config)
      axios.post("http://localhost:5000/regionesHuella",data,config)
          .then(res => {
              const agentes = res.data;
              if(agentes.length>0){
              const agentesBd=[];
              for(let agente of agentes){
                var total = agente.TOTAL;
                var bio = agente.BIO;
                var intentos=agente.INTENTOS;
                var normal = total-bio;
                var porcentajeEfectividad=this.myRound((bio*100)/total,1);
                var porcentajeEfectividadHI=this.myRound(((bio+intentos)*100)/total,1);
                agentesBd.push({agente: agente.NOMBRE.toUpperCase(),total: agente.TOTAL,bio:agente.BIO,normal:normal,efectividad:porcentajeEfectividad+'%',intentos:agente.INTENTOS,efectividadhi:porcentajeEfectividadHI+'%'});
              }
              this.setState({
                displayTablaIndividual:'block',
                displayTablaTodos:'none',
                datosIndividual:agentesBd,
                sinResultados:'none',
                displayTablaAperturada:'none',
                displayTablaTodosAperturaCargoex:'none',
                displayTablaTodosAperturaB2c:'none',
                displayTablaTodosCargoex:'none',
                displayTablaTodosB2c:'none',
                displayTablaIndividualCargoex:'none',
                displayTablaIndividualB2c:'none',
                loading:false,
                displayApertura:'none'
              });
            }else{
              this.setState({
                displayTablaIndividual:'none',
                displayTablaTodos:'none',
                sinResultados:'block',
                displayTablaAperturada:'none',
                displayTablaTodosAperturaCargoex:'none',
                displayTablaTodosAperturaB2c:'none',
                displayTablaTodosCargoex:'none',
                displayTablaTodosB2c:'none',
                displayTablaIndividualCargoex:'none',
                displayTablaIndividualB2c:'none',
                loading:false,
                displayApertura:'none'
              });
            }
          });
      } else if(cargoex === true && b2c === false){
    //    axios.post("http://localhost:5000/regionesHuella",data,config)
        axios.post("http://localhost:5000/regionesHuella",data,config)
          .then(res => {
              const agentes = res.data;
              if(agentes.length>0){
              const agentesBd=[];
              for(let agente of agentes){
                var total = agente.TOTAL;
                var bio = agente.BIO;
                var intentos=agente.INTENTOS;
                var normal = total-bio;
                var porcentajeEfectividad=this.myRound((bio*100)/total,1);
                var porcentajeEfectividadHI=this.myRound(((bio+intentos)*100)/total,1);
                var b2c = agente.B2C;
                var cargoex= total-b2c;
                var b2cbio= agente.B2CBIO;
                var cargoexbio=bio-b2cbio;
                var cargoexnormal=cargoex-cargoexbio;
                var b2cnormal=b2c-b2cbio;
                var b2ci=agente.B2CBIOI;
                var cargoexi=intentos-b2ci;
                var efectividadb2c=this.myRound((b2cbio*100)/b2c,1);
                var efectividadcargoex=this.myRound((cargoexbio*100)/cargoex,1);
                var efectividadb2chi=this.myRound(((b2cbio+b2ci)*100)/b2c,1);
                var efectividadcargoexhi=this.myRound(((cargoexbio+cargoexi)*100)/cargoex,1);
                if(b2c===0){
               efectividadb2c='0';
               efectividadb2chi='0';
                }
                agentesBd.push({agente: agente.NOMBRE.toUpperCase(),total: agente.TOTAL,bio:agente.BIO,normal:normal,efectividad:porcentajeEfectividad+'%',intentos:agente.INTENTOS,efectividadhi:porcentajeEfectividadHI+'%',b2c:b2c,cargoex:cargoex,b2cbio:b2cbio,cargoexbio:cargoexbio,b2ci:b2ci,cargoexi:cargoexi,efectividadb2c:efectividadb2c+'%',efectividadcargoex:efectividadcargoex+'%',efectividadb2chi:efectividadb2chi+'%',efectividadcargoexhi:efectividadcargoexhi+'%',cargoexnormal:cargoexnormal,b2cnormal:b2cnormal});
              }
              this.setState({
                displayTablaIndividual:'none',
                displayTablaTodos:'none',
                datosIndividual:agentesBd,
                sinResultados:'none',
                displayTablaAperturada:'none',
                displayTablaTodosAperturaCargoex:'none',
                displayTablaTodosAperturaB2c:'none',
                displayTablaTodosCargoex:'none',
                displayTablaTodosB2c:'none',
                displayTablaIndividualCargoex:'block',
                displayTablaIndividualB2c:'none',
                loading:false,
                displayApertura:'none'
              });
            }else{
              this.setState({
                displayTablaIndividual:'none',
                displayTablaTodos:'none',
                sinResultados:'block',
                displayTablaAperturada:'none',
                displayTablaTodosAperturaCargoex:'none',
                displayTablaTodosAperturaB2c:'none',
                displayTablaTodosCargoex:'none',
                displayTablaTodosB2c:'none',
                displayTablaIndividualCargoex:'none',
                displayTablaIndividualB2c:'none',
                loading:false,
                displayApertura:'none'
              });
            }
          });
      }else if(cargoex === false && b2c === true){
    //    axios.post("http://localhost:5000/regionesHuella",data,config)
        axios.post("http://localhost:5000/regionesHuella",data,config)
          .then(res => {
              const agentes = res.data;
              if(agentes.length>0){
              const agentesBd=[];
              for(let agente of agentes){
                var total = agente.TOTAL;
                var bio = agente.BIO;
                var intentos=agente.INTENTOS;
                var normal = total-bio;
                var porcentajeEfectividad=this.myRound((bio*100)/total,1);
                var porcentajeEfectividadHI=this.myRound(((bio+intentos)*100)/total,1);
                var b2c = agente.B2C;
                var cargoex= total-b2c;
                var b2cbio= agente.B2CBIO;
                var cargoexbio=bio-b2cbio;
                var cargoexnormal=cargoex-cargoexbio;
                var b2cnormal=b2c-b2cbio;
                var b2ci=agente.B2CBIOI;
                var cargoexi=intentos-b2ci;
                var efectividadb2c=this.myRound((b2cbio*100)/b2c,1);
                var efectividadcargoex=this.myRound((cargoexbio*100)/cargoex,1);
                var efectividadb2chi=this.myRound(((b2cbio+b2ci)*100)/b2c,1);
                var efectividadcargoexhi=this.myRound(((cargoexbio+cargoexi)*100)/cargoex,1);
                if(b2c===0){
               efectividadb2c='0';
               efectividadb2chi='0';
                }
                agentesBd.push({agente: agente.NOMBRE.toUpperCase(),total: agente.TOTAL,bio:agente.BIO,normal:normal,efectividad:porcentajeEfectividad+'%',intentos:agente.INTENTOS,efectividadhi:porcentajeEfectividadHI+'%',b2c:b2c,cargoex:cargoex,b2cbio:b2cbio,cargoexbio:cargoexbio,b2ci:b2ci,cargoexi:cargoexi,efectividadb2c:efectividadb2c+'%',efectividadcargoex:efectividadcargoex+'%',efectividadb2chi:efectividadb2chi+'%',efectividadcargoexhi:efectividadcargoexhi+'%',cargoexnormal:cargoexnormal,b2cnormal:b2cnormal});
              }
              this.setState({
                displayTablaIndividual:'none',
                displayTablaTodos:'none',
                datosIndividual:agentesBd,
                sinResultados:'none',
                displayTablaAperturada:'none',
                displayTablaTodosAperturaCargoex:'none',
                displayTablaTodosAperturaB2c:'none',
                displayTablaTodosCargoex:'none',
                displayTablaTodosB2c:'none',
                displayTablaIndividualCargoex:'none',
                displayTablaIndividualB2c:'block',
                loading:false,
                displayApertura:'none'
              });
            }else{
              this.setState({
                displayTablaIndividual:'none',
                displayTablaTodos:'none',
                sinResultados:'block',
                displayTablaAperturada:'none',
                displayTablaTodosAperturaCargoex:'none',
                displayTablaTodosAperturaB2c:'none',
                displayTablaTodosCargoex:'none',
                displayTablaTodosB2c:'none',
                displayTablaIndividualCargoex:'none',
                displayTablaIndividualB2c:'none',
                loading:false,
                displayApertura:'none'
              });
            }
          });
      }

    }

  }

  isRegion(regiones,seleccion){
    var aux = 0;
    for(let region of regiones){
        if(region.region===seleccion){
          return aux;
        }
      aux++;
    }
    return -1;
  }
  myRound(num, dec) {
   var exp = Math.pow(10, dec || 2); // 2 decimales por defecto
   return parseInt(num * exp, 10) / exp;
 }
  changeFechaInicio(date) {
      if(date <= this.state.fechaFin ){
          this.setState({
            fechaInicio: date,
            displayTablaTodos:'none',
            malRango:'none',
            sinResultados:'none',
            displayRegion:'block',
            displayTablaIndividual:'none'
          });
        }else{
          this.setState({
            malRango:'block',
            displayRegion:'none',
            displayBuscar:'none',
            displayTablaTodos:'none',
            displayTablaIndividual:'none'
          });
        }
  }
  changeFechaFin(date) {

  if(date >= this.state.fechaInicio ){
    console.log('sisas');
    this.setState({
      fechaFin: date,
      displayRegion:'block',
      malRango:'none',
      sinResultados:'none',
      displayTablaTodos:'none',
      displayTablaIndividual:'none'
    });
  }else{
    this.setState({
      malRango:'block',
      displayRegion:'none',
      displayBuscar:'none',
      displayTablaTodos:'none',
      displayTablaIndividual:'none'
    });
  }
  //console.log('hora inicio-'+this.state.fechaInicio+'hora fin -'+date);
  }
  handleError(err){
    console.error(err)
  }
  matchStocks(state, value) {
    return (
      state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.iata.toLowerCase().indexOf(value.toLowerCase()) !== -1 );
}
  ocultarvista(value){
    this.setState({
      displayBuscar:'none',
      displayApertura:'none',
      checkApertura:false,
      value:value
    });
  }
  changeTituloRegiones(item,value) {
    console.log('nombre es '+item+'iata es '+value.iata);
    if(value.iata==='todos'){
      this.setState({
        value:item,
        iata:value.iata,
        displayApertura:'block',
        displayBuscar:'block'
      });
    }else{
      this.setState({
        value:item,
        iata:value.iata,
        displayApertura:'none',
        checkApertura:false,
        displayBuscar:'block'
      });
    }


  }
  componentDidMount() {
    var inicio = new Date();
    var fin = new Date();

    console.log("va a mostrar llamado api");
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    axios.get("http://app.cargoex.cl/app/cargoex/app/ciudades",config)
      .then(res => {
        console.log('respondio');
        const ciudades = res.data;
        const regionesBd=[];
        for(let city of ciudades.datos){
          regionesBd.push({iata: city.IATA,name: city.NOMBRE.toUpperCase()});
        }
        regionesBd.push({iata:'todos',name:'TODOS'});
        this.setState({ regiones:regionesBd,fechaInicio:inicio,fechaFin:fin,displayRegion:'block' });
      });
//    this.addProducts(5);
  }
  stringToSeconds(tiempo) {
               var sep1 = tiempo.indexOf(":");
               var sep2 = tiempo.lastIndexOf(":");
               var hor = tiempo.substr(0, sep1);
               var min = tiempo.substr(sep1 + 1, sep2 - sep1 - 1);
               var sec = tiempo.substr(sep2 + 1);
               return (Number(sec) + (Number(min) * 60) + (Number(hor) * 3600));
   }
   secondsToTime(secs) {
     var hor = Math.floor(secs / 3600);
     var min = Math.floor((secs - (hor * 3600)) / 60);
     var sec = secs - (hor * 3600) - (min * 60);
     return this.padNmb(hor, 2) + ":" + this.padNmb(min, 2) + ":" + this.padNmb(sec, 2);
 }
 isExpandableRow(row) {
//   console.log('region de expandable es'+row.region);
   var datos =this.state.datosTodos;
   for(let dato of datos){
     if(dato.region===row.region){
  //     console.log('entro primer igual');
       if(dato.expand.length>0){
         return true;
       }
     }
   }
   return false;

  }

  expandComponent(row) {
    return (
      <BSTable data={ row.expand } />
    );
  }
  expandComponent2(row) {
    return (
      <BSTable2 data={ row.expand } />
    );
  }
  expandComponent3(row) {
    return (
      <BSTable3 data={ row.expand } />
    );
  }
  expandColumnComponent({ isExpandableRow, isExpanded }) {
    let content = '';

    if (isExpandableRow) {
      content = (isExpanded ? '(-)' : '(+)' );
    } else {
      content = ' ';
    }
    return (
      <div> { content } </div>
    );
  }
  render() {
    const options = {
      expandRowBgColor: '#202156'
    };
    const options2 = {
      toolBar: this.createCustomToolBar
    };
    const selectRow = {
     mode: 'checkbox',
     showOnlySelected: true
   };
   const override = css`
       display: block;
       margin-top: 50px;
       border-color: red;
   `;

    return (
      <Container >

        <Row style={{ justifyContent: 'center', marginTop:'1rem'}}>
        <Col sm={3} style={{ justifyContent: 'left',textAlign:'left'}} >
            <p style={{textAlign:"center",marginBottom:'0.5rem', color: '#202156',
            fontSize:16, fontWeight: 'bold', justifyContent: 'left',textAlign:'left'
          }}> FECHA INI </p>
            <DatePicker
              style={{width:'2rem'}}
              dateFormat="dd/MM/yyyy"
              selected={this.state.fechaInicio}
              onChange={this.changeFechaInicio}
              />
        </Col>
        <Col sm={3} style={{ justifyContent: 'left',textAlign:'left'}} >
            <p style={{textAlign:"center",marginBottom:'0.5rem', color: '#202156',
            fontSize:16, fontWeight: 'bold', justifyContent: 'left',textAlign:'left'
          }}> FECHA FIN</p>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={this.state.fechaFin}
              onChange={this.changeFechaFin}
              />
        </Col>
        <Col style={{zIndex:2}} sm={2} >
            <p style={{marginBottom:'0.5rem',
            color: '#202156',fontSize:16, fontWeight: 'bold',
            justifyContent: 'left',textAlign:'left',display:this.state.displayRegion
                    }}> REGIONES
            </p>
            <Autocomplete
                value={ this.state.value }
                inputProps={{ id: 'states-autocomplete' }}
                wrapperStyle={{ position: 'relative', display: this.state.displayRegion,width:'200%'}}
                items={ this.state.regiones}
                getItemValue={ item => item.name }
                shouldItemRender={ this.matchStocks }
                onChange={(event, value) => this.ocultarvista(value) }
                onSelect={this.changeTituloRegiones }
                renderMenu={ children => (
                  <div className = "menu">
                  { children }
                  </div>
                )}
                renderItem={ (item, isHighlighted) => (
                  <div
                    className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                    key={ item.iata } >
                    { item.name }
                  </div>
                )}
                />

            </Col>
        <Col sm={2} style={{ justifyContent: 'center',textAlign:'center',height:'4.5rem'}} >
        <p style={{
        color: '#202156',fontSize:16, fontWeight: 'bold',
        justifyContent: 'center',textAlign:'center',display:this.state.displayApertura,marginLeft:'50%'
      }}> AP
        </p>
          <form>
            <input
                name="isGoing"
                type="checkbox"
                checked={this.state.checkApertura}
                onChange={this.changeApertura}
                style={{
                color: '#202156', fontWeight: 'bold',width:'20px',height:'20px',zoom:1.1,
                marginLeft:'60%',marginBottom:'5rem',display:this.state.displayApertura
              }}/>

            </form>
        </Col>
        <Col sm={1} style={{ justifyContent: 'left',textAlign:'left',height:'4.5rem'}} >
        <p style={{
        color: '#202156',fontSize:16, fontWeight: 'bold',
        justifyContent: 'left',textAlign:'left',display:this.state.displayRegion
      }}> PRINCP
        </p>
          <form>
            <input
                name="isGoing"
                type="checkbox"
                checked={this.state.checkCargoex}
                onChange={this.changeCargoex}
                style={{
                color: '#202156', fontWeight: 'bold',width:'20px',height:'20px',zoom:1.1,
                marginLeft:'25%',marginBottom:'5rem',display:this.state.displayRegion
              }}/>

            </form>
        </Col>
        <Col sm={1} style={{ justifyContent: 'left',textAlign:'left',height:'4.5rem'}} >
        <p style={{
        color: '#202156',fontSize:16, fontWeight: 'bold',
        justifyContent: 'left',textAlign:'left',display:this.state.displayRegion
      }}> B2C
        </p>
          <form>
            <input
                name="isGoing"
                type="checkbox"
                checked={this.state.checkB2c}
                onChange={this.changeB2c}
                style={{
                color: '#202156', fontWeight: 'bold',width:'20px',height:'20px',zoom:1.1,
                marginLeft:'25%',marginBottom:'5rem',display:this.state.displayRegion
              }}/>

            </form>
        </Col>
        </Row>
        <Row>
        <Col sm={12}  >
        <Button style={{ display:this.state.displayBuscar,textAlign:'center', border: '1px solid',marginLeft:'40%' }}
          variant="primary"
          onClick={this.buscar.bind(this)}
          >
          Buscar
          </Button>
        </Col>
        </Row>
        <Row >
        <Col style={{textAlign:'center'}} sm={12}>
              <div className='sweet-loading'>
                <ClipLoader
                  css={override}
                  sizeUnit={"px"}
                  size={150}
                  color={'#202156'}
                  loading={this.state.loading}
                  />
              </div>
        </Col>
        </Row>
        <Row style={{marginTop: '2rem',zIndex:99999,display: this.state.sinResultados }}>
        <Col style={{ textAlign:'center'}} sm={12}>
          <h1 style={{color: '#202156',fontSize:30,paddingTop:'0.5rem', fontWeight: 'bold'}} >NO SE ENCUENTRAN MOVIMIENTOS EN ESTA FECHA </h1>
        </Col>
        </Row>
        <Row style={{marginTop: '2rem',zIndex:99999,display: this.state.malRango }}>
        <Col style={{ textAlign:'center'}} sm={12}>
          <h1 style={{color: '#202156',fontSize:30,paddingTop:'0.5rem', fontWeight: 'bold'}} >FECHA FINAL NO PUEDE SER MENOR A FECHA INICIO </h1>
        </Col>
        </Row>
        <Row style={{ marginTop:'2rem'}}>
            <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaTodos}}>
            <BootstrapTable
            pagination
            exportCSV
            search
            data={ this.state.datosTodos}
            options={ options }
            expandableRow={ this.isExpandableRow }
            expandComponent={ this.expandComponent }
            expandColumnOptions={ {
              expandColumnVisible: true,
              expandColumnComponent: this.expandColumnComponent,
              columnWidth: 50
            } }>
            <TableHeaderColumn dataField='region' isKey={ true } width={'25%'}>REGION</TableHeaderColumn>
            <TableHeaderColumn dataField='total' width={'7%'}>TOTAL</TableHeaderColumn>
            <TableHeaderColumn dataField='bio' width={'10%'}>H</TableHeaderColumn>
            <TableHeaderColumn dataField='normal' width={'10%'}>N</TableHeaderColumn>
            <TableHeaderColumn dataField='intentos' width={'12%'}>INTS</TableHeaderColumn>
            <TableHeaderColumn dataField='efectividad' dataSort={ true }>EFECT (H)</TableHeaderColumn>
            <TableHeaderColumn dataField='efectividadhi' dataSort={ true }>EFECT (H+I)</TableHeaderColumn>

            </BootstrapTable>
            </Col>
            <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaIndividual}}>
              <BootstrapTable
              pagination
              data={ this.state.datosIndividual }
              options={ options2 }
              selectRow={ selectRow }
              exportCSV
              search
              >
              <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'25%'}>AGENTE</TableHeaderColumn>
              <TableHeaderColumn dataField='total' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
              <TableHeaderColumn dataField='bio' dataSort={ true } width={'10%'}>H</TableHeaderColumn>
              <TableHeaderColumn dataField='normal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
              <TableHeaderColumn dataField='intentos' width={'12%'}>INTS</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividad' dataSort={ true }>EFECT (H)</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividadhi' dataSort={ true }>EFECT (H+I)</TableHeaderColumn>

              </BootstrapTable>
            </Col>
            <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaAperturada}}>
              <BootstrapTable
              pagination
              data={ this.state.datosTablaAperturada }
              options={ options2 }
              selectRow={ selectRow }
              exportCSV
              search
              >
              <TableHeaderColumn dataField='region' dataSort={ true } width={'12%'}>REGION</TableHeaderColumn>
              <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'15%'}>NOMBRE</TableHeaderColumn>
              <TableHeaderColumn dataField='total' dataSort={ true } width={'7%'}>TOTAL</TableHeaderColumn>
              <TableHeaderColumn dataField='bio' dataSort={ true } width={'8%'}>H</TableHeaderColumn>
              <TableHeaderColumn dataField='normal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
              <TableHeaderColumn dataField='intentos' width={'9%'}>INTS</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividad' width={'12%'} dataSort={ true }>EFECT (H)</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividadhi' width={'13%'} dataSort={ true }>EFECT (H+I)</TableHeaderColumn>

              </BootstrapTable>
                </Col>
              <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaTodosAperturaCargoex}}>
                <BootstrapTable
                pagination
                data={ this.state.datosTablaTodosAperturaCargoex }
                options={ options2 }
                selectRow={ selectRow }
                exportCSV
                search
                >
                <TableHeaderColumn dataField='region' dataSort={ true } width={'12%'}>REGION</TableHeaderColumn>
                <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'15%'}>NOMBRE</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoex' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoexbio' dataSort={ true } width={'8%'}>H</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoexnormal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoexi' width={'9%'}>INTS</TableHeaderColumn>
                <TableHeaderColumn dataField='efectividadcargoex' width={'12%'} dataSort={ true }>EFECT (H)</TableHeaderColumn>
                <TableHeaderColumn dataField='efectividadcargoexhi' width={'13%'} dataSort={ true }>EFECT (H+I)</TableHeaderColumn>

                </BootstrapTable>
            </Col>
            <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaTodosAperturaB2c}}>
              <BootstrapTable
              pagination
              data={ this.state.datosTablaTodosAperturaB2c }
              options={ options2 }
              selectRow={ selectRow }
              exportCSV
              search
              >
              <TableHeaderColumn dataField='region' dataSort={ true } width={'12%'}>REGION</TableHeaderColumn>
              <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'15%'}>NOMBRE</TableHeaderColumn>
              <TableHeaderColumn dataField='b2c' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
              <TableHeaderColumn dataField='b2cbio' dataSort={ true } width={'8%'}>H</TableHeaderColumn>
              <TableHeaderColumn dataField='b2cnormal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
              <TableHeaderColumn dataField='b2ci' width={'9%'}>INTS</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividadb2c' width={'12%'} dataSort={ true }>EFECT (H)</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividadb2chi' width={'13%'} dataSort={ true }>EFECT (H+I)</TableHeaderColumn>

              </BootstrapTable>
          </Col>

          <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaTodosCargoex}}>
            <BootstrapTable
              pagination
              exportCSV
              search
              data={ this.state.datosTodos}
              options={ options }
              expandableRow={ this.isExpandableRow }
              expandComponent={ this.expandComponent2 }
              expandColumnOptions={ {
                expandColumnVisible: true,
                expandColumnComponent: this.expandColumnComponent,
                columnWidth: 50
              } }>
            <TableHeaderColumn dataField='region' isKey={ true } width={'25%'}>REGION</TableHeaderColumn>
            <TableHeaderColumn dataField='cargoex' width={'7%'}>T</TableHeaderColumn>
            <TableHeaderColumn dataField='cargoexbio' width={'10%'}>H</TableHeaderColumn>
            <TableHeaderColumn dataField='cargoexnormal' width={'10%'}>NORMAL</TableHeaderColumn>
            <TableHeaderColumn dataField='cargoexi' width={'12%'}>INTS</TableHeaderColumn>
            <TableHeaderColumn dataField='efectividadcargoex' dataSort={ true }>EFECT (H)</TableHeaderColumn>
            <TableHeaderColumn dataField='efectividadcargoexhi' dataSort={ true }>EFECT (H+I)</TableHeaderColumn>
            </BootstrapTable>
            </Col>
            <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaTodosB2c}}>
              <BootstrapTable
                pagination
                exportCSV
                search
                data={ this.state.datosTodos}
                options={ options }
                expandableRow={ this.isExpandableRow }
                expandComponent={ this.expandComponent3 }
                expandColumnOptions={ {
                  expandColumnVisible: true,
                  expandColumnComponent: this.expandColumnComponent,
                  columnWidth: 50
                } }>
              <TableHeaderColumn dataField='region' isKey={ true } width={'25%'}>REGION</TableHeaderColumn>
              <TableHeaderColumn dataField='b2c' width={'7%'}>T</TableHeaderColumn>
              <TableHeaderColumn dataField='b2cbio' width={'10%'}>H</TableHeaderColumn>
              <TableHeaderColumn dataField='b2cnormal' width={'10%'}>NORMAL</TableHeaderColumn>
              <TableHeaderColumn dataField='b2ci' width={'12%'}>INTS</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividadb2c' dataSort={ true }>EFECT (H)</TableHeaderColumn>
              <TableHeaderColumn dataField='efectividadb2chi' dataSort={ true }>EFECT (H+I)</TableHeaderColumn>
              </BootstrapTable>
              </Col>
              <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaIndividualCargoex}}>
                <BootstrapTable
                pagination
                data={ this.state.datosIndividual }
                options={ options2 }
                selectRow={ selectRow }
                exportCSV
                search
                >
                <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'25%'}>AGENTE</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoex' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoexbio' dataSort={ true } width={'10%'}>H</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoexnormal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
                <TableHeaderColumn dataField='cargoexi' width={'12%'}>INTS</TableHeaderColumn>
                <TableHeaderColumn dataField='efectividadcargoex' dataSort={ true }>EFECT (H)</TableHeaderColumn>
                <TableHeaderColumn dataField='efectividadcargoexhi' dataSort={ true }>EFECT (H+I)</TableHeaderColumn>
                </BootstrapTable>
              </Col>
              <Col sm={12} style={{paddingBottom:'7rem',display:this.state.displayTablaIndividualB2c}}>
                <BootstrapTable
                pagination
                data={ this.state.datosIndividual }
                options={ options2 }
                selectRow={ selectRow }
                exportCSV
                search
                >
                <TableHeaderColumn dataField='agente' isKey={ true } dataSort={ true } width={'25%'}>AGENTE</TableHeaderColumn>
                <TableHeaderColumn dataField='b2c' dataSort={ true } width={'7%'}>T</TableHeaderColumn>
                <TableHeaderColumn dataField='b2cbio' dataSort={ true } width={'10%'}>H</TableHeaderColumn>
                <TableHeaderColumn dataField='b2cnormal' dataSort={ true } width={'10%'}>NORMAL</TableHeaderColumn>
                <TableHeaderColumn dataField='b2ci' width={'12%'}>INTS</TableHeaderColumn>
                <TableHeaderColumn dataField='efectividadb2c' dataSort={ true }>EFECT (H)</TableHeaderColumn>
                <TableHeaderColumn dataField='efectividadb2chi' dataSort={ true }>EFECT (H+I)</TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
      </Container>

    );
  }
}


export default Huella;
