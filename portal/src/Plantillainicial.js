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

class Cargamasiva extends Component {
  constructor(props){
    super(props)
    this.state = {
      ordenes:[],
      displayTabla:'none'
    }
    this.cargarcsv = this.cargarcsv.bind(this);
  }
  cargarcsv(event){
    var ordenes = [];
    console.log(event);
    /*
    for(let aux=1; aux<event.length;aux++){
        ordenes.push({id:event[aux][0]},)

        for(let i in ){
        }

    }*/
    this.setState({ ordenes:event  });
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

        <Row style={{ justifyContent: 'center', marginTop:'2rem'}}>
          <Col sm={3} style={{height:40, justifyContent: 'center',textAlign:"center"}}>
          <p style={{marginBottom:'0.5rem',
          color: '#202156',fontSize:20, fontWeight: 'bold',
          justifyContent: 'left',textAlign:'left'
        }}> Carga de ordenes:
          </p>
          <CSVReader
            cssClass="react-csv-input"
            onFileLoaded={this.cargarcsv}
          />
          </Col>
          <Col sm={12} style={{paddingBottom:'7rem',marginTop:'7%'}}>
            <BootstrapTable
            pagination
            data={ this.state.ordenes}
            options={ options }
            selectRow={ selectRow }
            exportCSV
            search
            >
            <TableHeaderColumn dataField='id' isKey={ true } dataSort={ true }>id</TableHeaderColumn>
            <TableHeaderColumn dataField='nombre' dataSort={ true } width={'10%'}>nombre</TableHeaderColumn>
            <TableHeaderColumn dataField='telefono' dataSort={ true } width={'7%'} >telefono</TableHeaderColumn>
            <TableHeaderColumn dataField='direccion' dataSort={ true }>direccion</TableHeaderColumn>

            </BootstrapTable>
          </Col>
        </Row>
      </Container>

    );
  }
}


export default Cargamasiva;
