import React, { Component } from 'react';
import { Button, Container, Row, Col,Dropdown,DropdownButton, Card, Alert, Modal  } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {Map, InfoWindow, Marker, GoogleApiWrapper,Polyline} from 'google-maps-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import CSVReader from "react-csv-reader";
import Autocomplete from  'react-autocomplete';
import ReactToPrint from "react-to-print";
import BarcodeReader from 'react-barcode-reader'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell,ResponsiveContainer} from 'recharts';
import axios from 'axios';
import cors from 'cors';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
class ComponentToPrint extends React.Component {
  render() {
    return (
      <Container >
      {this.props.impresion.map(
        variant => (
            <Row style={{ marginTop:'0rem'}}>
              <Col style={{ height:630}} sm={12} >
                  <div style={{ height:630,border: '3px solid',borderRadius:'1rem 1rem 1rem 1em ',borderColor: '#202156',maxWidth:'93%',marginLeft:'3rem'}}>
                    <div style={{ height:400}}>
                      <img style={{textAlign:'right',justifyContent:'center',marginLeft:'69%',height:100,marginTop:'-0.5rem'}} src={'http://www.cargoex.cl/cargoex.png'} />
                      <p style={{color: '#202156',textAlign:'left',marginTop:'-5.2rem',paddingLeft:'1rem',maxWidth:'70%',fontSize:30,fontWeight:600}}>DESTINO :</p>
                      <p style={{color: '#202156',textAlign:'left',marginTop:'-1rem',paddingLeft:'1rem',maxWidth:'100%',fontSize:52,fontWeight:'bold'}}>   {variant.destino} <strong style={{color: '#202156',fontSize:30,fontWeight:600}}> ({variant.padre}) </strong>  </p>
                      <p style={{color: '#202156',textAlign:'left',paddingLeft:'1rem',fontSize:30,marginTop:'-9rem',marginLeft:'33%',fontWeight:600}}>{variant.fecha}</p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',marginTop:'6rem',fontSize:30,fontWeight:600}}>DIRECCION : {variant.direccion} </p>
                      <p style={{color: '#202156',textAlign:'left',paddingLeft:'1rem',maxWidth:'70%',fontSize:30,marginTop:'-1rem',fontWeight:600}}>DESTINATARIO : {variant.destinatario} </p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',maxWidth:'70%',marginTop:'-1rem',fontSize:30,fontWeight:600}} >TELEFONO : {variant.telefono}  </p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',maxWidth:'70%',marginTop:'-1rem',fontSize:42,fontWeight:'bold'}} >CLIENTE ORIGEN : {variant.cliente} </p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',maxWidth:'70%',marginTop:'-1rem',fontSize:30,fontWeight:600}} >ORIGEN : {variant.origen} </p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',maxWidth:'80%',marginTop:'-1rem',fontSize:30,fontWeight:600}} >NOTA : {variant.nota} </p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',marginTop:'-19rem',fontSize:42,marginLeft:'68%',fontWeight:'bold'}} > OD : {variant.od} </p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',marginTop:'-2rem',fontSize:42,marginLeft:'68%',fontWeight:'bold'}} > BULTOS : {variant.BULTOS} </p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',marginTop:'-1.5rem',fontSize:30,marginLeft:'68%',fontWeight:600}}>PESO : {variant.peso} kg</p>
                      <p style={{color: '#202156',paddingLeft:'1rem',textAlign:'left',marginTop:'-1.5rem',fontSize:30,marginLeft:'68%',fontWeight:600}}>TIPO : {variant.tipo} </p>
                    </div>
                    <div>
                      <p className="barcode" style={{fontSize:'1000%',marginTop:'0rem',textAlign:'center'}}>*{variant.tn}*</p>
                    </div>
                  </div>
              </Col>
            </Row>
            ))}
      </Container>
    );
  }
}
class impresionmasiva extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientes: [],
      regiones:[],
      ramales:[],
      tns:[],
      manifiestos:[],
      fechaInicio: new Date(),
      fechaFin: new Date(),
      displayBuscar: 'none',
      displayFechas: 'none',
      correoCliente: '',
      displaycorreonovalido:'none',
      modalCambiarCorreo:false,
      modalCorreo:false,
      loading: false,
      value2:'Selecciona Manifiesto',
      displayManifiesto:'none',
      displayEleccionManifiesto:'none',
      displayCeroManifiestos:'none'
    };
    this.changeTituloClientes = this.changeTituloClientes.bind(this);
    this.changeManifiesto = this.changeManifiesto.bind(this);
    this.changeFechaInicio = this.changeFechaInicio.bind(this);
    this.changeFechaFin = this.changeFechaFin.bind(this);
    this.setCorreoCliente = this.setCorreoCliente.bind(this);
    this.buscar = this.buscar.bind(this);
    this.cerrarManifiesto = this.cerrarManifiesto.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);

  }

  componentWillMount() {
    const config = {
      headers: {'Content-Type': 'application/json',
        'X-API-KEY': '55IcsddHxiy2E3q653RpYtb',
        'Access-Control-Allow-Origin': '*'}
    };
    const url = document.URL;
    const urlseparada = url.split('tipo_usuario=');
    let tipo_usuario = urlseparada[urlseparada.length-1];
     tipo_usuario =  tipo_usuario.replace('#', '');
    axios.post('http://app.cargoex.cl:5000/clientes', config)
        .then((res) => {
          const clientes= res.data;
          console.log('cliente de bd');
          console.log(clientes);
          const clientesBd=[];
          if ( tipo_usuario==='admin') {
            for (const cliente of clientes) {
              clientesBd.push(
                  {id: cliente.ID,
                    nombre: cliente.NOMBRE.toUpperCase(),correo: cliente.CORREO});
            }
          } else {
            for (const cliente of clientes) {
              if (cliente.ID+''=== tipo_usuario+'') {
                clientesBd.push({id: cliente.ID,
                  nombre: cliente.NOMBRE.toUpperCase(),correo: cliente.CORREO});
              }
            }
          } this.setState({clientes: clientesBd});
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
              if(city.TIPO_DESCRIPCION==='RAMAL'){
                ramales.push({iata: city.IATA,name: city.NOMBRE.toUpperCase(),padre:city.IATA_PADRE});
              }
            }
            this.setState({ regiones:regionesBd,ramales:ramales });
          });
  }
  setCorreoCliente(event){
      var correo = event.target.value;
      console.log(correo);
      this.setState({ correoCliente:correo });
  }
  handleClose2() {
   const correo = this.state.correoCliente;
   var idcliente= this.state.idcliente;
   var manifest = this.state.manifiesto;
   var nombrecliente = this.state.value;
   console.log('id cliente es al cerrar');
   console.log(idcliente);
   console.log('nombrecliente es');
   console.log(nombrecliente);
   if(correo.includes("@") && correo.includes(".")){
     console.log('sisas');
     var config = {
     headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
     };
     let data = JSON.stringify({
       correo: correo,
       idcliente: idcliente
     });
     axios.post("http://app.cargoex.cl:5000/registrarCorreo",data,config)
           .then(res => {
               console.log('react respondio el registro de correo');
               this.setState({ modalCorreo: false });
               var manifest = this.state.manifiesto;
               let data2 = JSON.stringify({
                 idmanifiesto: manifest,
                 correocliente:correo,
                 tns:this.state.tns,
                 nombrecliente:nombrecliente
               });
              axios.post("http://app.cargoex.cl:5000/cerrarManifiesto",data2,config)
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
                           correoCliente:correo ,
                           modalCorreo:false,
                           modalCambiarCorreo:false
                         });
                         window.location.reload();

                       });
                     });
   }else{
     this.setState({
       displaycorreonovalido:'block'
     });
   }
}

  cerrarManifiesto(item,value) {
    var manifest = this.state.manifiesto;
    window.location.reload();
    /*
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    const correoCliente = this.state.correoCliente;
    console.log('correo cliente es');
    console.log(correoCliente);
    if(correoCliente === '0' || correoCliente === ''){
      console.log('igual a cero el correo');
      this.setState({
        correoCliente:'',
        modalCorreo:true,
        displaycorreonovalido:'none'
      });
    }else{
      this.setState({
        modalCambiarCorreo:true,
        displaycorreonovalido:'none'
      }); 
      var nombrecliente = this.state.value;
      console.log('tns a cerrar son ');
      console.log(this.state.tns);
      let data = JSON.stringify({
        idmanifiesto: manifest,
        correocliente:correoCliente,
        tns:this.state.tns,
        nombrecliente:nombrecliente
      });
      console.log(this.state.tns);
        axios.post("http://app.cargoex.cl:5000/cerrarManifiesto",data,config)
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
      
    }*/
  }

  buscar(event) {
    this.setState({
      loading:true
    });
    let dia=this.state.fechaInicio.getDate()+'';
    let mes=(this.state.fechaInicio.getMonth()+1)+'';
    if (dia.length===1) {
      dia='0'+dia;
    }
    if (mes.length===1) {
      mes='0'+mes;
    }
    let diaf = this.state.fechaFin.getDate()+'';
    let mesf=(this.state.fechaFin.getMonth()+1)+'';
    if (diaf.length===1) {
      diaf='0'+diaf;
    }
    if (mesf.length===1) {
      mesf='0'+mesf;
    }
    const fechai= this.state.fechaInicio.getFullYear()+'-'+mes+'-'+ dia;
    const fechaf=this.state.fechaFin.getFullYear()+'-'+ mesf+'-'+diaf;
    console.log(fechai);
    console.log(fechaf);
    const config = {
      headers: {'Content-Type': 'application/json',
        'X-API-KEY': '55IcsddHxiy2E3q653RpYtb',
        'Access-Control-Allow-Origin': '*'}
    };
    const data = JSON.stringify({
      fechai: fechai,
      fechaf: fechaf,
      idcliente: this.state.idcliente,
      manifiesto: this.state.manifiesto,
    });

      axios.post('http://localhost:5000/manifiestos', data, config)
        .then((res) => {
            const manifiestos= res.data;
            console.log(manifiestos);
            if(manifiestos.length>0){
              this.setState({
                manifiestos:manifiestos,
                displayEleccionManifiesto:'block',
                displayCeroManifiestos:'none',
                loading:false
              });
            }else{
              this.setState({
                displayCeroManifiestos:'block',
                displayEleccionManifiesto:'none',
                loading:false
              });
            }

    });



  }
  agregarUnidad(num){
  console.log('tamaño es'+ num.toString().length);
  if(num.toString().length ===1){
    return ('0'+num);
  }else{
    return num;
  }
}
  matchStocks(state, value) {
    return (
      state.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 );
  }
  matchStocks2(state, value) {
    console.log('state es');
    console.log(state);
    console.log('value es');
    console.log(value);
    return (
      state.ID);
  }
  cambiarCliente(value) {
    this.setState({
      displayBuscar: 'none',
      displayFechas: 'none',
      value: value,
    });
  }
  cambiarManifiesto(value) {
    this.setState({
      value2: value,
    });
  }
  changeTituloClientes(item,value) {
    const config = {
      headers: {'Content-Type': 'application/json',
        'X-API-KEY': '55IcsddHxiy2E3q653RpYtb',
        'Access-Control-Allow-Origin': '*'}
    };
    const data2 = JSON.stringify({
      od: '1111',
      idcliente: value.id
    });
    axios.post("http://app.cargoex.cl:5000/getManifiesto",data2,config)
          .then(res => {
            var manifiesto= res.data[0].MANIFIESTO;
            this.setState({
              value:item,
              idcliente:value.id,
              displayBuscar:'block',
              displayFechas:'block',
              correoCliente:value.correo,
              manifiesto:manifiesto
            });
      });
  }
  changeManifiesto(item) {

    console.log(item);
    this.setState({
      value2:item,
      loading:true

    });
    const config = {
      headers: {'Content-Type': 'application/json',
        'X-API-KEY': '55IcsddHxiy2E3q653RpYtb',
        'Access-Control-Allow-Origin': '*'}
    };
    const data = JSON.stringify({
      manifiesto: item
    });
  
    axios.post('http://localhost:5000/impresionmasiva', data, config)
        .then((res) => {
          const ods= res.data;
          const regiones = this.state.regiones;
          var datetime = new Date();
          var dia = this.agregarUnidad(datetime.getDate());
          var mes = this.agregarUnidad(datetime.getMonth()+1);
          var hora=this.agregarUnidad(datetime.getHours());
          var minutos= this.agregarUnidad(datetime.getMinutes());
          var segundos= this.agregarUnidad(datetime.getSeconds());
          var diaActual= datetime.getFullYear() +'-'+mes+'-'+dia+' '+hora+':'+minutos+':'+segundos;
          for(var i in ods){
            for (let region of regiones){
                if(ods[i].COMUNA===region.iata){
                  ods[i].COMUNA = region.name;
                  ods[i].PADRE = region.padre+'';
                }
                if(ods[i].COMUNA_ORIGEN===region.iata){
                  ods[i].COMUNA_ORIGEN = region.name;
                }
              }
              for (let region of regiones){
                    if(ods[i].PADRE===region.iata){
                    ods[i].PADRE= region.name.substring(0, 13);
                    }
                  }
          }
          console.log(ods);
          var impresion = [];
          for(var i in ods){
            if(ods[i].TNS.length>1){
              var ind=1;

              for (var j in ods[i].TNS){
                impresion.push(
                  {id: ods[i].TNS[j].id,
                  nota:ods[i].NOTA.substring(0, 27),
                  od:ods[i].OD_PAPEL,
                  padre:ods[i].PADRE,
                  destino: ods[i].COMUNA.substring(0, 23),
                  direccion: ods[i].DIRECCION.substring(0, 26),
                  destinatario: ods[i].NOMBRE.substring(0, 23),
                  telefono: ods[i].TELEFONO.substring(0, 23),
                  origen: ods[i].COMUNA_ORIGEN.substring(0, 23),
                  bultos: ods[i].BULTOS,
                  largo: ods[i].LARGO,
                  ancho: ods[i].ANCHO,
                  peso: ods[i].PESO,
                  alto: ods[i].ALTO,
                  tipo:ods[i].TIPO_ORDEN,
                  tn: ods[i].TNS[j].tn,
                  fecha:diaActual,
                  manifiesto:this.state.manifiesto,
                  BULTOS: ind+'/'+ods[i].TNS.length
                }
                );
                ind++;
              }
            }else{
              impresion.push(
                {id: ods[i].TNS[0],
                nota:ods[i].NOTA.substring(0, 27),
                od:ods[i].OD_PAPEL,
                padre:ods[i].PADRE,
                destino: ods[i].COMUNA.substring(0, 23),
                direccion: ods[i].DIRECCION.substring(0, 26),
                destinatario: ods[i].NOMBRE.substring(0, 23),
                telefono: ods[i].TELEFONO.substring(0, 23),
                origen: ods[i].COMUNA_ORIGEN.substring(0, 23),
                bultos: ods[i].BULTOS,
                largo: ods[i].LARGO,
                ancho: ods[i].ANCHO,
                peso: ods[i].PESO,
                alto: ods[i].ALTO,
                tipo:ods[i].TIPO_ORDEN,
                tn: ods[i].TNS[0].tn,
                fecha:diaActual,
                manifiesto:this.state.manifiesto,
                BULTOS: '1/1'
              }
              );
            }
          }
         console.log(impresion);

         this.setState({
           tns:impresion,
           displayManifiesto:'block',
           loading:false
         })
    document.getElementById("print").click();

      });;


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


  render() {
    const override = css`
        display: block;
        margin-top: 50px;
        border-color: red;
    `;
    return (

      <Container  >

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
      <Row style={{ justifyContent: 'center',display:this.state.displayCeroManifiestos,marginTop:'1rem'}}>

                <Col sm={12} style={{ height:120,justifyContent: 'center',textAlign:"center"}}>
                        <p style={{
                        color: '#202156',fontSize:20, fontWeight: 'bold',
                        justifyContent: 'center',textAlign:'center'
                      }}> NO EXITEN MANIFIESTOS EN ESTA FECHA
                        </p>


                </Col>

      </Row>
      <Row style={{textAlign:'center',marginTop:'1rem'}} >
      <Col style={{display:this.state.displayEleccionManifiesto}} sm={12}>
            <p style={{textAlign:"center",marginBottom:'0.5rem', color: '#202156',
            fontSize:16, fontWeight: 'bold'
          }}> Selecciona Numero de Manifiesto: </p>
             <DropdownButton
              title={this.state.value2}
            >
              {this.state.manifiestos.map(
                variant => (
                  <Dropdown.Item onClick={this.changeManifiesto.bind(this, variant.ID)} >{variant.ID}</Dropdown.Item>
                ))}
            </DropdownButton>
        {/*  <Autocomplete
              value={ this.state.value2+'' }
              inputProps={{ id: 'states-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block'}}
              items={ this.state.manifiestos}
              getItemValue={ item => item.FH_CREACION }
              shouldItemRender={ this.matchStocks2 }
              onChange={(event, value2) => this.cambiarManifiesto(value2) }
              onSelect={this.changeManifiesto}
              renderMenu={ children => (
                <div className = "menu">
                { children }
                </div>
              )}
              renderItem={ (item, isHighlighted) => (
                <div
                  className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                  key={ item.FH_CREACION } >
                  { item.ID}
                </div>
              )}
              /> */}

      </Col>
      </Row>
      <Row>
      <Col sm={3} style={{height:70, justifyContent: 'left',textAlign:"left",display:this.state.displayManifiesto,marginTop:'0.5rem'}}>
      <p style={{marginBottom:'0.5rem',
      color: '#202156',fontSize:20, fontWeight: 'bold',
      justifyContent: 'left',textAlign:'left',display:this.state.displayManifiesto
    }}> BULTOS: {this.state.tns.length}
      </p>

          </Col>
      </Row>
      <Row style={{ justifyContent: 'center', marginTop:'3rem',display:'none' }}>

                <Col sm={12} style={{height:40, justifyContent: 'left',textAlign:"left"}}>
                    <Modal show={this.state.modalCorreo} >
                      <Modal.Header>
                        <Modal.Title>Tu correo no esta registrado, por favor ingrésalo</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                            <input
                            type="text"
                            name="name"
                            value={this.state.correoCliente}
                            onChange={this.setCorreoCliente}
                            style={{ width:'100%'}}
                            />
                            <p style={{color:'#ff0000', display: this.state.displaycorreonovalido}}>ESTE CORREO NO ES VALIDO</p>

                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" autocomplete='off' onClick={this.handleClose2}>
                          Aceptar
                        </Button>

                      </Modal.Footer>
                    </Modal>
                </Col>
                <Col sm={12} style={{height:40, justifyContent: 'left',textAlign:"left"}}>
                    <Modal show={this.state.modalCambiarCorreo} >
                      <Modal.Header>
                        <Modal.Title>Tenemos este correo registrado, puedes cambiarlo si lo deseas </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                            <input
                            type="text"
                            name="name"
                            value={this.state.correoCliente}
                            onChange={this.setCorreoCliente}
                            style={{ width:'100%'}}
                            />
                            <p style={{color:'#ff0000', display: this.state.displaycorreonovalido}}>ESTE CORREO NO ES VALIDO</p>

                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" autocomplete='off' onClick={this.handleClose2}>
                          Aceptar
                        </Button>

                      </Modal.Footer>
                    </Modal>
                </Col>
      </Row>
      {this.state.tns.map(
        variant => (
              <Row style={{ display: 'block' ,border: '1px solid',borderColor: '#202156'}}>
                <Col sm={12} style={{ justifyContent: 'left',textAlign:"left"}}>
                    <p style={{ marginTop:'1rem',color:'#202156'}}>   OD :&nbsp;&nbsp;&nbsp; <b style={{fontSize:20}} > {variant.od}</b> &nbsp;&nbsp;&nbsp; TN :  &nbsp;&nbsp;&nbsp; <b style={{fontSize:20}}>{variant.tn} </b>  &nbsp;&nbsp;&nbsp;  DESTINO : {variant.destino} ORIGEN : {variant.origen}</p>

                </Col>

              </Row>
            ))}




        <Row style={{ justifyContent: 'center', marginTop:'3rem', display: 'none'}}>
          <Col sm={12} style={{height:40, justifyContent: 'center',textAlign:"center"}}>
              <ReactToPrint
                trigger={() => <a href="#" id="print">Print this out!</a> }
                content={() => this.componentRef}
                />
              <div>
                <ComponentToPrint impresion={this.state.tns} ref={el => (this.componentRef = el)}  />
              </div>
          </Col>
        </Row>
        <Row style={{ justifyContent: 'center', marginTop:'1rem', display: this.state.displayManifiesto,textAlign:"center" }}>
            <Button
              variant="primary"
              onClick={this.cerrarManifiesto.bind(this)}
              >
                Terminar Impresion
              </Button>
        </Row>

      </Container>

    );
  }
}


export default impresionmasiva;
