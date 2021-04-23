import React,{Component} from 'react';
import { Button, Container, Row, Col,Dropdown,DropdownButton, Card, Alert } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import {Map, InfoWindow, Marker, GoogleApiWrapper,Polyline} from 'google-maps-react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import Autocomplete from  'react-autocomplete';
import ReactToPrint from "react-to-print";
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell,ResponsiveContainer} from 'recharts';
import axios from 'axios';
import cors from 'cors';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      tituloOperadores: 'Elige',
      efectividad: '',
      loading: false,
      activoOperadores: true,
      ruta: true,
      labelRuta: 'MOSTRAR RUTA',
      ningunResultado: 'none',
      itemIndex: 1,
      valueBiometria: 0,
      valueRegiones: '',
          valueOperador:'',
          valueRutChofer:'',
          ciudad:'',
          valueCodigoChofer:'',
          numeroEntregas:0,
          odDetencion1:'',
          odDetencion2:'',
          maxDetencion1:'',
          maxDetencion2:'',
          numeroNoentregas:0,
          numeroRetiros:0,
          numeroTotal:0,
          horaInicio:'',
          horaFin:'',
          duracion:'',
          activoMapa:'none',
          activoBuscar:'none',
          fecha: new Date(),
          imagenPosicion:'http://app.cargoex.cl/imagenes/posicion.png',
          imagenEntrega:'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green.png',
          imagenDevolucion:'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png',
          imagenRetiro:'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellow.png',
          imagenRepetido:'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png',
          showingInfoWindow: false,
          activeMarker: {},
          selectedPlace: {},
          regiones:[
          ],
          coordenadasUnidas:[],
          operadores : [
          ],
          posicionInicial:{lat : '-33.465783', long: '-70.617536'},
          ubicaciones2 : [
          ],
          tablaGestiones:[],
          ubicaciones : [{ nombre : 'PEDRO', lat : '-30.5997462', long: '-71.2001283'}],
          entregas7:0,
          entregas10:0,
          entregas13:0,
          entregas16:0,
          entregas19:0,
          entregas21:0,
          entregas24:0,
          noEntregas7:0,
          noEntregas10:0,
          noEntregas13:0,
          noEntregas16:0,
          noEntregas19:0,
          noEntregas21:0,
          noEntregas24:0,
          retiros7:0,
          retiros10:0,
          retiros13:0,
          retiros16:0,
          retiros19:0,
          retiros21:0,
          retiros24:0,
          triangleCoords : [
            {lat: 25.774, lng: -80.190},
            {lat: 18.466, lng: -66.118},
            {lat: 32.321, lng: -64.757},
            {lat: 25.774, lng: -80.190}
          ]
      };
      this.changeTituloRegiones = this.changeTituloRegiones.bind(this);
      this.changeTituloOperadores = this.changeTituloOperadores.bind(this);
      this.changeFecha = this.changeFecha.bind(this);
      this.cellButton = this.cellButton.bind(this);
      this.changeActivoMapa = this.changeActivoMapa.bind(this);
      this.Muestra_campos = this.Muestra_campos.bind(this);

  }


  componentDidMount() {

    console.log("va a mostrar llamado api");
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    axios.get("http://app.cargoex.cl/app/cargoex/app/ciudades",config)
      .then(res => {
        const ciudades = res.data;
        const regionesBd=[];
        for(let city of ciudades.datos){
          regionesBd.push({iata: city.IATA,name: city.NOMBRE.toUpperCase()});
        }
        this.setState({ regiones:regionesBd });
      })
  }

  cargarAgentes(value){
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    let data = JSON.stringify({
      IATA: value
    });
    console.log('harallamado a servicio '+value);
    axios.post("http://app.cargoex.cl/app/cargoex/app/choferes",data,config)
      .then(res => {
        const agentes = res.data;
        console.log(agentes);
       const agentesBd=[];
        for(let agente of agentes.datos){
          agentesBd.push({id: agente.COD_CHOFER,nombre: agente.NOMBRE.toUpperCase(),rut:agente.RUT});
        }
        this.setState({ ciudad:value,operadores:agentesBd });
      })
  }

  cargarGestiones(){
    this.setState({
      loading:true,
      ningunResultado:'none',
      activoMapa: 'none'
    });
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    let dia=this.state.fecha.getDate()+"";

    let mes=(this.state.fecha.getMonth()+1)+"";
    if(dia.length===1){
      dia='0'+dia;
    }
    if(mes.length===1){
      mes='0'+mes;
    }
    let data = JSON.stringify({
      COD_CHOFER: this.state.valueCodigoChofer,
      FECHA: this.state.fecha.getFullYear()+'-'+mes+'-'+dia
    });
    console.log('json de acciones '+data);
    axios.post('http://app.cargoex.cl/app/cargoex/app/certificacionesVer',data,config)
      .then(res => {
        const gestiones = res.data;
        console.log(gestiones);
        const gestionesBd=[];
        const tablaGestiones=[];
        const coordenadasUnidas=[];
        let biometria=0;
        let entregados=0;
        let noentregados=0;
        let retirados=0;
        let numeroGestion=0;
        let entregas7=0;
        let entregas10=0;
        let entregas13=0;
        let entregas16=0;
        let entregas19=0;
        let entregas21=0;
        let entregas24=0;
        let noEntregas7=0;
        let noEntregas10=0;
        let noEntregas13=0;
        let noEntregas16=0;
        let noEntregas19=0;
        let noEntregas21=0;
        let noEntregas24=0;
        let retiros7=0;
        let retiros10=0;
        let retiros13=0;
        let retiros16=0;
        let retiros19=0;
        let retiros21=0;
        let retiros24=0;
        let indiceAuxiliar=0;
        let indiceInicioIntervalo=false;
        let indiceInicioIntervalo2=false;
        let maxDetencion1=0;
        let maxDetencion2=0;
        let odDetencion1='';
        let odDetencion2='';
      //  accionesBd.push({nombre:'posicion',lat:'-33.047264',long:'-71.332972',fecha: '18/12/2018 07:20:47',tipo:this.state.imagenEntrega});
        for(var gestion of gestiones.datos){
          let gestionTabla=gestion.ESTADO.split("(");
          tablaGestiones.push({odpapel:gestion.OD_PAPEL,hora : gestion.HORA,lat:gestion.LAT_TERRENO,lng:gestion.LONG_TERRENO, codigo : gestionTabla[1].substring(0, gestionTabla[1].length-1), nombre: gestionTabla[0]});
          coordenadasUnidas.push({lat:Number(gestion.LAT_TERRENO),lng:Number(gestion.LONG_TERRENO)});
          numeroGestion++;
          let aux = false;
          console.log('hora de gestion es '+gestion.HORA );
          let horaGestion=gestion.HORA.split(":");
          console.log('hora es '+horaGestion[0]);
          console.log(gestion.DEC_CODE);
          if(gestion.DEC_CODE!=="FALSE"){
            biometria++;
          }
          if(indiceAuxiliar!==0){
            var horaInicial= gestiones.datos[indiceAuxiliar-1].HORA;
            var horaFinal=gestion.HORA;
            var secs1 = this.stringToSeconds(horaFinal);
            var secs2 = this.stringToSeconds(horaInicial);
            var secsDif = secs1 - secs2;
            var horaIntervalo = this.secondsToTime(secsDif);
            if(!indiceInicioIntervalo){
              maxDetencion1=horaIntervalo;
              indiceInicioIntervalo=true;
            }else{

                if(maxDetencion1>horaIntervalo){
                  maxDetencion2=horaIntervalo;
                }else{
                  maxDetencion2=maxDetencion1;
                  maxDetencion1=horaIntervalo
                }
                indiceInicioIntervalo2=true;

            }
            console.log('duracion es '+horaIntervalo);
          }
          indiceAuxiliar++;
          for(var proccess of gestionesBd){
           if(proccess.lat === gestion.LAT_TERRENO && proccess.long === gestion.LONG_TERRENO ){
             aux=true;
             proccess.fecha=proccess.fecha + " - "+gestion.OD_PAPEL;
             proccess.imagen=this.state.imagenRepetido;
             proccess.nombre='REPETIDO';
             if(gestion.TIPO_CERTIFICACION==='NORMAL' || gestion.TIPO_CERTIFICACION==='BIOMETRICA'){
               entregados=entregados+1;
                if(horaGestion[0]<7){
                  entregas7++;
                }else if(horaGestion[0]>=7 && horaGestion[0]<10){
                  entregas10++;
                }else if(horaGestion[0]>=10 && horaGestion[0]<13){
                  entregas13++;
                }else if(horaGestion[0]>=13 && horaGestion[0]<16){
                  entregas16++;
                }else if(horaGestion[0]>=16 && horaGestion[0]<19){
                  entregas19++;
                }else if(horaGestion[0]>=19 && horaGestion[0]<21){
                  entregas21++;
                }else if(horaGestion[0]>=21 && horaGestion[0]<24){
                  entregas24++;
                }
             }else if(gestion.TIPO_CERTIFICACION==='DEVOLUCION'){
               noentregados=noentregados+1;
               if(horaGestion[0]<7){
                 noEntregas7++;
               }else if(horaGestion[0]>=7 && horaGestion[0]<10){
                 noEntregas10++;
               }else if(horaGestion[0]>=10 && horaGestion[0]<13){
                 noEntregas13++;
               }else if(horaGestion[0]>=13 && horaGestion[0]<16){
                 noEntregas16++;
               }else if(horaGestion[0]>=16 && horaGestion[0]<19){
                 noEntregas19++;
               }else if(horaGestion[0]>=19 && horaGestion[0]<21){
                 noEntregas21++;
               }else if(horaGestion[0]>=21 && horaGestion[0]<24){
                 noEntregas24++;
               }
             }else if(gestion.TIPO_CERTIFICACION==='RETIRO'){
               retirados=retirados+1;
               if(horaGestion[0]<7){
                 retiros7++;
               }else if(horaGestion[0]>=7 && horaGestion[0]<10){
                 retiros10++;
               }else if(horaGestion[0]>=10 && horaGestion[0]<13){
                 retiros13++;
               }else if(horaGestion[0]>=13 && horaGestion[0]<16){
                 retiros16++;
               }else if(horaGestion[0]>=16 && horaGestion[0]<19){
                 retiros19++;
               }else if(horaGestion[0]>=19 && horaGestion[0]<21){
                 retiros21++;
               }else if(horaGestion[0]>=21 && horaGestion[0]<24){
                 retiros24++;
               }
             }
             break;
          }
          }
          if(!aux){
            if(gestion.TIPO_CERTIFICACION==='NORMAL' || gestion.TIPO_CERTIFICACION==='BIOMETRICA'){
              entregados=entregados+1;
              if(horaGestion[0]<7){
                entregas7++;
              }else if(horaGestion[0]>=7 && horaGestion[0]<10){
                entregas10++;
              }else if(horaGestion[0]>=10 && horaGestion[0]<13){
                entregas13++;
              }else if(horaGestion[0]>=13 && horaGestion[0]<16){
                entregas16++;
              }else if(horaGestion[0]>=16 && horaGestion[0]<19){
                entregas19++;
              }else if(horaGestion[0]>=19 && horaGestion[0]<21){
                entregas21++;
              }else if(horaGestion[0]>=21 && horaGestion[0]<24){
                entregas24++;
              }
              gestionesBd.push({id:numeroGestion+'',nombre : gestion.ESTADO, lat : gestion.LAT_TERRENO, long: gestion.LONG_TERRENO,fecha: gestion.OD_PAPEL,imagen:this.state.imagenEntrega,tipo:'ENTREGA',hora:gestion.HORA,tn:0});
            }else if(gestion.TIPO_CERTIFICACION==='DEVOLUCION'){
              noentregados=noentregados+1;
              if(horaGestion[0]<7){
                noEntregas7++;
              }else if(horaGestion[0]>=7 && horaGestion[0]<10){
                noEntregas10++;
              }else if(horaGestion[0]>=10 && horaGestion[0]<13){
                noEntregas13++;
              }else if(horaGestion[0]>=13 && horaGestion[0]<16){
                noEntregas16++;
              }else if(horaGestion[0]>=16 && horaGestion[0]<19){
                noEntregas19++;
              }else if(horaGestion[0]>=19 && horaGestion[0]<21){
                noEntregas21++;
              }else if(horaGestion[0]>=21 && horaGestion[0]<24){
                noEntregas24++;
              }
              gestionesBd.push({id:numeroGestion+'',nombre : gestion.ESTADO, lat : gestion.LAT_TERRENO, long: gestion.LONG_TERRENO,fecha: gestion.OD_PAPEL,imagen:this.state.imagenDevolucion,tipo:'DEVOLUCION',hora:gestion.HORA,tn:0});
            }else if(gestion.TIPO_CERTIFICACION==='RETIRO'){
              retirados=retirados+1;
              if(horaGestion[0]<7){
                retiros7++;
              }else if(horaGestion[0]>=7 && horaGestion[0]<10){
                retiros10++;
              }else if(horaGestion[0]>=10 && horaGestion[0]<13){
                retiros13++;
              }else if(horaGestion[0]>=13 && horaGestion[0]<16){
                retiros16++;
              }else if(horaGestion[0]>=16 && horaGestion[0]<19){
                retiros19++;
              }else if(horaGestion[0]>=19 && horaGestion[0]<21){
                retiros21++;
              }else if(horaGestion[0]>=21 && horaGestion[0]<24){
                retiros24++;
              }
              gestionesBd.push({id:numeroGestion+'',nombre : gestion.ESTADO, lat : gestion.LAT_TERRENO, long: gestion.LONG_TERRENO,fecha: gestion.OD_PAPEL,imagen:this.state.imagenRetiro,tipo:'RETIRO',hora:gestion.HORA,tn:0});
            }
          }
        }
        console.log('intervalo1 es '+ maxDetencion1 + 'intervalo 2 es'+maxDetencion2);
        var valorTotal=entregados+noentregados+retirados;
        console.log('el tamaño de las gestiones es'+gestionesBd.length);
        console.log('Biometria es '+biometria);

        if(gestionesBd.length > 1 ){
          var horaInicial= tablaGestiones[0].hora;
          var horaFinal=tablaGestiones[tablaGestiones.length-1].hora;
          var secs1 = this.stringToSeconds(horaFinal);
          var secs2 = this.stringToSeconds(horaInicial);
          var secsDif = secs1 - secs2;
          var horaDuracion = this.secondsToTime(secsDif);
          console.log('duracion es '+horaDuracion);
          console.log('Biometria es '+biometria);
          let porcentajeNoEntregas=this.myRound((noentregados/valorTotal)*100,1);
          let porcentajeTotal = 100-porcentajeNoEntregas;
          console.log(coordenadasUnidas);
          this.setState({ maxDetencion1:maxDetencion1,maxDetencion2:maxDetencion2,valueBiometria:biometria,coordenadasUnidas:coordenadasUnidas,loading:false,ningunResultado:'none',tablaGestiones:tablaGestiones,efectividad:porcentajeTotal,ubicaciones2:gestionesBd,activoMapa: 'block',posicionInicial:{lat:gestionesBd[0].lat,long:gestionesBd[0].long},
          numeroEntregas:entregados,numeroNoentregas:noentregados,numeroRetiros:retirados,numeroTotal:valorTotal,horaInicio:horaInicial,horaFin:horaFinal,duracion:horaDuracion,
          entregas7:entregas7,entregas10:entregas10,entregas13:entregas13,entregas16:entregas16,entregas19:entregas19,entregas21:entregas21,entregas24:entregas24,
          noEntregas7:noEntregas7,noEntregas10:noEntregas10,noEntregas13:noEntregas13,noEntregas16:noEntregas16,noEntregas19:noEntregas19,noEntregas21:noEntregas21,noEntregas24:noEntregas24,
          retiros7:retiros7,retiros10:retiros10,retiros13:retiros13,retiros16:retiros16,retiros19:retiros19,retiros21:retiros21,retiros24:retiros24
          } );
        //  this.cargarAcciones();
        }else{
          this.setState({
            loading:false,
            tablaGestiones:tablaGestiones,
            ubicaciones2:gestionesBd,
            ningunResultado:'block',
            activoMapa: 'none'
          });
        }
        })
  }
  cargarAcciones(){
    var config = {
    headers: {"Content-Type": "application/json","X-API-KEY": "55IcsddHxiy2E3q653RpYtb","Access-Control-Allow-Origin": "*"}
    };
    let dia=this.state.fecha.getDate()+"";

    let mes=(this.state.fecha.getMonth()+1)+"";
    if(dia.length===1){
      dia='0'+dia;
    }
    if(mes.length===1){
      mes='0'+mes;
    }
    let data = JSON.stringify({
      COD_CHOFER: this.state.valueCodigoChofer,
      FECHA: this.state.fecha.getFullYear()+'-'+mes+'-'+dia
    });
    console.log('json de acciones '+data);
    axios.post("http://app.cargoex.cl/app/cargoex/app/accionesVer",data,config)
      .then(res => {
        const acciones = res.data;
        console.log(acciones);
        const accionesBd=this.state.ubicaciones2;
      //  accionesBd.push({nombre:'posicion',lat:'-33.047264',long:'-71.332972',fecha: '18/12/2018 07:20:47',tipo:this.state.imagenEntrega});
        for(var accion of acciones.datos){
          let aux = false;
          for(var action of accionesBd){
           if(action.lat === accion.LATITUD && action.long === accion.LONGITUD && action.tipo==='ACCION'){
             aux=true;
             let horaMemoria= action.fecha.replace(' ','');
             horaMemoria= horaMemoria.replace('-',':');
             let horaBd = accion.FECHA_INGRESO.split(" ");
             let horaMemoriaLimpia=horaMemoria.split(":");
             let horaBdLimpia=horaBd[1].split(":");
              if((horaMemoriaLimpia[horaMemoriaLimpia.length-2]!==horaBdLimpia[1]) ){
                    console.log('fecha de repetido es bd: '+action.fecha +'memoria :'+accion.FECHA_INGRESO );
                    console.log('los minutos del repetido son '+horaMemoriaLimpia[1]+"--"+horaBdLimpia[1]);
                    action.fecha=action.fecha + " - "+horaBd[1];
                break;
              }
          }
          }
          if(!aux){
            accionesBd.push({id:'',nombre : accion.ACCION, lat : accion.LATITUD, long: accion.LONGITUD,fecha: accion.FECHA_INGRESO,imagen:this.state.imagenPosicion,tipo:'ACCION'});
          }
        }

      console.log('el tamaño de las gestiones con acciones es'+accionesBd.length);

      if(accionesBd.length > 1 ){
        this.setState({ ubicaciones2:accionesBd,activoMapa: 'block',posicionInicial:{lat:accionesBd[0].lat,long:accionesBd[0].long}
        } );
      }else{
        this.setState({
          ubicaciones2:accionesBd,
          activoMapa: 'none'
        });
      }
      })
  }
    /*
  mostrarRuta(){
    let valorRuta=this.state.activoMapa;
   console.log('el valor de ruta es '+valorRuta);

    if(this.state.ruta){
      this.setState({
        ruta:false,
        labelRuta:'MOSTRAR RUTA'
      });
    }else{
    this.setState({
      ruta:true,
      labelRuta:'OCULTAR RUTA'
    });
    }

  }    */
  matchStocks(state, value) {
    return (
      state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.iata.toLowerCase().indexOf(value.toLowerCase()) !== -1 );
}
  matchOperadores(state, value) {
  return (
    state.id.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
    state.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 );
  }
  createCustomToolBar = props => {
   return (
     <div  style={{paddingLeft:'1rem'}}>
       { props.components.searchPanel }
       <div style={{marginTop:'1rem'}}>
       { props.components.btnGroup }
       </div>
      </div>
      );
 };

  onMarkerClick = (props, marker, e) =>
   this.setState({
     selectedPlace: props,
     activeMarker: marker,
     showingInfoWindow: true,
     posicionInicial:{lat:e.lat,long:e.long}
   });

 onMapClicked = (props) => {

   if (this.state.showingInfoWindow) {
     this.setState({
       showingInfoWindow: false,
       activeMarker: null
     })
   }
 };
 getposition = (lat, lng) => {
    console.log(lat);
    console.log(lng);
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
};
 ocultarvista(value){
   this.setState({
     activoMapa: 'none',
     activoBuscar:'none',
     activoOperadores:true,
     value:value
   });
 }
 ocultarMapa(value){
   this.setState({
     activoMapa: 'none',
     activoBuscar:'none',
     valueOperador:value
   });
 }

  cargarMapa() {
//    console.log(this.state.ubicaciones2.length);
   this.setState({
     itemIndex:this.state.itemIndex+1,
      ubicaciones: this.state.ubicaciones.concat(this.state.ubicaciones2[this.state.itemIndex+1])
    }
    );
  }
       renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
       	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x  = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy  + radius * Math.sin(-midAngle * (Math.PI / 180));
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
              {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };
  changeActivoMapa(event) {
    console.log(this.state.iata+'operador'+this.state.valueOperador+'  '+this.state.valueCodigoChofer+' fecha '+this.state.fecha.getMonth()+'--'+this.state.fecha.getDate()+'--'+this.state.fecha.getFullYear());
  //  this.cargarAcciones();
    this.cargarGestiones();
/*
    Array.from(Array(3), (e, i) => {
      setTimeout(() => {
        this.cargarMapa();
  }, i*1000);
  }
  );
*/
  }
  changeTituloRegiones(item,value) {
    console.log('nombre es '+item+'iata es '+value.iata);
    this.setState({
      activoOperadores:false,
      value:item,
      iata:value.iata
    });
    this.cargarAgentes(value.iata);
  }
  changeTituloOperadores(item,value) {
    this.setState({
      valueOperador:item,
      valueCodigoChofer:value.id,
      valueRutChofer:value.rut,
      activoBuscar:'block'
    });
  }
  Muestra_campos(nombre){
  console.log('campo es '+nombre);
 }
 cellButton(cell, row, enumObject, rowIndex) {
   console.log(row);
   console.log('el objeto es'+enumObject+cell+'--'+row.nombre+'--'+rowIndex);
  let url = "http://18.219.80.103/rutaap/public/consultaOd/"+row.odpapel;

    return (
       <Button
       target="_blank"
     //  href={url}
       onClick={ this.Muestra_campos.bind(this,row.odpapel ) } 
       variant="primary"
       >
       VER MAS
       </Button>
    )
 };
  changeFecha(date) {
  this.setState({
    fecha: date
  });
  }
  padNmb(nStr, nLen) {
               var sRes = String(nStr);
               var sCeros = "0000000000";
               return sCeros.substr(0, nLen - sRes.length) + sRes;
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
 myRound(num, dec) {
  var exp = Math.pow(10, dec || 2); // 2 decimales por defecto
  return parseInt(num * exp, 10) / exp;
}
  render() {
    //const coords = { lat: this.state.ubicaciones2[0].lat, lng: this.state.ubicaciones2[0].long };
    const selectRow = {
     mode: 'checkbox',
     showOnlySelected: true
   };
   const options = {
     toolBar: this.createCustomToolBar
   };
   function buttonFormatter(cell, row){
     return " <div> <Button style={{ textAlign:'center' }}variant='primary'>  Ver Mas   </Button> </div>";
   };

   var products = [{
      odpapel: 1,
      tn: 12312,
      estado: 120,
      tipo:'NO ENTREGA'
  }, {
      odpapel: 2,
      tn: 123,
      estado: 80,
      tipo:'ENTREGA'
  }, {
      odpapel: 2,
      tn: 123,
      estado: 80,
      tipo:'ENTREGA'
  }, {
      odpapel: 2,
      tn: 123,
      estado: 80,
      tipo:'ENTREGA'
  }, {
      odpapel: 2,
      tn: 123,
      estado: 80,
      tipo:'ENTREGA'
  }, {
      odpapel: 2,
      tn: 123,
      estado: 80,
      tipo:'ENTREGA'
  }, {
      odpapel: 2,
      tn: 123,
      estado: 80,
      tipo:'ENTREGA'
  }, {
      odpapel: 2,
      tn: 123,
      estado: 80,
      tipo:'ENTREGA'
  }
  ];
  const data = [
        {name: '07:00', E: this.state.entregas7, NE: this.state.noEntregas7, R: this.state.retiros7},
        {name: '10:00', E: this.state.entregas10, NE: this.state.noEntregas10, R: this.state.retiros10},
        {name: '13:00', E: this.state.entregas13, NE: this.state.noEntregas13, R: this.state.retiros13},
        {name: '16:00', E: this.state.entregas16, NE: this.state.noEntregas16, R: this.state.retiros16},
        {name: '19:00', E: this.state.entregas19, NE: this.state.noEntregas19, R: this.state.retiros19},
        {name: '21:00', E: this.state.entregas21, NE: this.state.noEntregas21, R: this.state.retiros21},
        {name: '24:00', E: this.state.entregas24, NE: this.state.noEntregas24, R: this.state.retiros24}
  ];


  const data2 = [{name: 'Group A', value: this.state.numeroEntregas}, {name: 'Group B', value: this.state.numeroNoentregas},
                  {name: 'Group C', value: this.state.numeroRetiros}];
  const COLORS = ['#00C49F','#FF0000','#FFBB28'];

  const RADIAN = Math.PI / 180;
  const override = css`
      display: block;
      margin-top: 50px;
      border-color: red;
  `;
  const triangleCoords =  [
    {lat: 25.774, lng: -80.190},
    {lat: 18.466, lng: -66.118},
    {lat: 32.321, lng: -64.757},
    {lat: 25.774, lng: -80.190}
  ];

    return (
      <div>

      <Container  >

        <Row style={{ justifyContent: 'center',marginTop: '2rem'  }}>
              <Col style={{zIndex:2}} sm={3} >
                  <p style={{marginBottom:'0.5rem',
                  color: '#202156',fontSize:20, fontWeight: 'bold',
                  justifyContent: 'left',textAlign:'left'
                          }}> REGIONES
                  </p>
                  <Autocomplete
                      value={ this.state.value }
                      inputProps={{ id: 'states-autocomplete' }}
                      wrapperStyle={{ position: 'relative', display: 'inline-block'}}
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
              {/*   <DropdownButton variant="danger" style={{ justifyContent: 'left',textAlign:'left'}}
                  title={this.state.tituloRegiones}>
                  {this.state.regiones.map(
                    variant => (
                          <Dropdown.Item as="button" id={variant.Nombre} onClick={this.changeTituloRegiones.bind(this)} >{variant.Nombre}</Dropdown.Item>
                        ))}
                  </DropdownButton>
                  */}
                  </Col>
              <Col sm={3} style={{ justifyContent: 'left',textAlign:'left',zIndex:1}} >
                  <p style={{textAlign:"center",marginBottom:'0.5rem', color: '#202156',
                  fontSize:20, fontWeight: 'bold', justifyContent: 'left',textAlign:'left'
                  }}> OPERADOR</p>
                  <Autocomplete
                      value={ this.state.valueOperador }
                      disabled={this.state.activoOperadores}
                      inputProps={{ id: 'states-autocomplete' }}
                      wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                      items={ this.state.operadores}
                      getItemValue={ item => item.nombre}
                      shouldItemRender={ this.matchOperadores }
                      onChange={(event, value) => this.ocultarMapa(value) }
                      onSelect={this.changeTituloOperadores }
                      renderMenu={ children => (
                        <div className = "menu">
                        { children }
                        </div>
                      )}
                      renderItem={ (item, isHighlighted) => (
                        <div
                          className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                          key={ item.id } >
                          { item.nombre }
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
              <Col sm={3} style={{ justifyContent: 'left',textAlign:'left'}} >
                  <p style={{textAlign:"center",marginBottom:'0.5rem', color: '#202156',
                  fontSize:20, fontWeight: 'bold', justifyContent: 'left',textAlign:'left'
                  }}> FECHA</p>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={this.state.fecha}
                    onChange={this.changeFecha}
                    />
              </Col>
              <Col sm={3} style={{ justifyContent: 'left',textAlign:'left'}} >
              <Button style={{ justifyContent: 'center',marginTop: '2rem', display:this.state.activoBuscar }}
                variant="primary"
                onClick={this.changeActivoMapa.bind(this)}
                >
                Buscar
                </Button>
              </Col>
        </Row>
        </Container>


        <Container  >
        <Row style={{zIndex:99999 }}>
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
        <Row style={{marginTop: '2rem',zIndex:99999,display: this.state.ningunResultado }}>
        <Col style={{ textAlign:'center'}} sm={12}>
          <h1 style={{color: '#202156',fontSize:30,paddingTop:'0.5rem', fontWeight: 'bold'}} >NO SE ENCUENTRAN MOVIMIENTOS EN ESTA FECHA </h1>
        </Col>
        </Row>
        </Container>

        <Container  style={{marginTop: '1rem',display: this.state.activoMapa}}>

        <Row ref={el => (this.componentRef = el)} style={{zIndex:99999 }} >
        <Col style={{ height:70,textAlign:'center'}} sm={1}>
          <img src={this.state.imagenEntrega} />
          <p style={{color: '#202156',fontSize:12,paddingTop:'0.5rem'}} >Entregas </p>
        </Col>
        <Col style={{ height:70,textAlign:'center'}} sm={1}>
          <img src={this.state.imagenDevolucion} />
          <p style={{color: '#202156',fontSize:12,paddingTop:'0.5rem'}} >No entregas </p>
        </Col>
        <Col style={{ height:70,textAlign:'center'}} sm={1}>
          <img src={this.state.imagenRetiro} />
          <p style={{color: '#202156',fontSize:12,paddingTop:'0.5rem'}} >Retiros </p>
        </Col>
        <Col style={{ height:70,textAlign:'center'}} sm={1}>
          <img src={this.state.imagenRepetido} />
          <p style={{color: '#202156',fontSize:12,paddingTop:'0.5rem'}} >Mas de 1 gestion </p>

        </Col>
        <Col style={{ height:70,textAlign:'center'}} sm={1}>
          <img style={{paddingTop:10}} src={this.state.imagenPosicion} />
          <p style={{color: '#202156',fontSize:12,paddingTop:'0.5rem'}} >Posicion de chofer </p>
        </Col>
        <Col style={{ textAlign:'center'}} sm={1}>

        </Col>
        <Col style={{ textAlign:'center'}} sm={1}>

        </Col>
        <Col style={{ textAlign:'center'}} sm={1}>

        </Col>
        <Col style={{ textAlign:'center'}} sm={1}>

        </Col>

        <Col style={{ height:60 }} sm={3} >

        <ReactToPrint
          trigger={() => <Button style={{ justifyContent: 'center',marginTop: '2rem', display:this.state.activoBuscar }}
         variant="primary"
         >
         Imprimir
         </Button>}
          content={() => this.componentRef}
          />


        </Col>

        </Row>
        <Row ref={(el) => (this.componentRef = el)} style={{ paddingTop:'2rem',zIndex:99999 }} >
        <Col style={{ height: 600}} sm={7}>
        <Map
            center={{lat: this.state.posicionInicial.lat, lng: this.state.posicionInicial.long }}
            name={'Current location'}
            google={this.props.google}
            zoom={11}
            onClick={(t, map, c) => this.getposition(c.latLng.lat(), c.latLng.lng())}
            style={{ border: '1px solid',borderColor: '#202156',borderRadius:'1rem 1rem 1rem 1em ',maxWidth:'96%'}}>
                  {this.state.ubicaciones2.map(
                    variant => (
                      <Marker
                        title={variant.nombre}
                        name={variant.nombre}
                        label={variant.id}
                        fecha={variant.fecha}
                        onClick={this.onMarkerClick}
                        icon={{
                             url: variant.imagen
                           }}
                         position={{lat: variant.lat, lng: variant.long}} />
                        ))
                      }
                      <InfoWindow
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}>
                      <div style={{fontFamily: 'Titillium Web', color: '#202156',justifyContent: 'left'}}>
                      <h5 style={{fontFamily: 'Titillium Web',textAlign:"left", color: '#202156',justifyContent: 'left',paddingRight:'1rem'}}>{this.state.selectedPlace.name}</h5>
                      <h5 style={{fontFamily: 'Titillium Web',textAlign:"left", color: '#202156',justifyContent: 'left',paddingRight:'1rem'}}>{this.state.selectedPlace.fecha}</h5>
                      </div>
                      </InfoWindow>
                      <Polyline
                      path={this.state.triangleCoords}
                      strokeColor="#202156"
                      visible={true}
                      strokeOpacity={0.8}
                      strokeWeight={1.5} />
            </Map>
        </Col>

        <Col style={{ height:600 }} sm={5} >
            <div style={{ height:600,border: '1px solid',borderRadius:'1rem 1rem 1rem 1em ',borderColor: '#202156',maxWidth:'98%',marginLeft:'2rem'}}>
            <h5 style={{color: '#202156',textAlign:'center',fontWeight:200}}> RESUMEN DE RUTA  </h5>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}} >Codigo De Chofer: {this.state.valueCodigoChofer} </p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}} >Nombre: {this.state.valueOperador} - {this.state.value} </p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}} >Rut: {this.state.valueRutChofer} </p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}} >Primera Gestion: {this.state.horaInicio} horas</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Ultima Gestion: {this.state.horaFin} horas</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Duracion: {this.state.duracion} horas </p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Entregas: {this.state.numeroEntregas}</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>No entregas: {this.state.numeroNoentregas}</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Retiros: {this.state.numeroRetiros}</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Total: {this.state.numeroTotal}</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Biometria: {this.state.valueBiometria}</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Detenciones: {this.state.ubicaciones2.length}</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Máxima Detención #1: {this.state.maxDetencion1} horas</p>
            <p style={{color: '#202156',paddingLeft:'1rem',fontWeight:200}}>Máxima Detención #2: {this.state.maxDetencion2} horas</p>

            </div>
        </Col>

        </Row>

        <Row style={{ justifyContent: 'center', marginTop:'3rem'}}>
          <Col sm={12} style={{height:40, justifyContent: 'center',textAlign:"center"}}>
          <h1 style={{textAlign:"center", color: '#202156',  fontWeight: 700
        }}> ESTADISTICAS </h1>
          </Col>
        </Row>
        <Row style={{marginTop:'1rem'}} >
          <Col sm={2} style={{height:30}}>
              <p> </p>
          </Col>
          <Col sm={1} style={{height:30}}>
          <div style={{border: '1px solid',width:30,height:30,backgroundColor:'#00C49F',marginLeft:'70%'}}></div>
          </Col>
          <Col sm={1} style={{height:30}}>
          <p style={{color: '#202156',fontSize:12,paddingTop:8}}> Entregas</p>
          </Col>
          <Col sm={1} style={{height:30}}>
          <p style={{border: '1px solid',width:30,height:30,border: '1px solid',backgroundColor:'#FF0000',marginLeft:'70%'}}></p>
          </Col>
          <Col sm={1} style={{height:30}}>
          <p style={{color: '#202156',fontSize:12,paddingTop:8,width:'100%'}}> No entregas</p>
          </Col>
          <Col sm={1} style={{height:30}}>
          <p style={{border: '1px solid',width:30,height:30,backgroundColor:'#FFBB28',marginLeft:'70%'}}></p>
          </Col>
          <Col sm={1} style={{height:30}}>
          <p style={{color: '#202156',fontSize:12,paddingTop:8}}> Retiros</p>
          </Col>
          <Col sm={3} style={{height:30}}>
              <p> </p>
          </Col>
        </Row>
        <Row style={{ marginTop: '2rem' }}>
              <Col sm={3}  style={{minWidth:'33%',height:300}} >
              <ResponsiveContainer>

              <AreaChart  width={420} height={360} data={data}
          margin={{top: 0, right: 50, left: 0, bottom: 0}}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="name"/>
      <YAxis/>
      <Tooltip/>
      <Area type='monotone' dataKey='E' stackId="1" stroke='#00C49F' fill='#00C49F' />
      <Area type='monotone' dataKey='NE' stackId="1" stroke='#FF0000' fill='#FF0000' />
      <Area type='monotone' dataKey='R' stackId="1" stroke='#FFBB28' fill='#FFBB28' />
    </AreaChart>
    </ResponsiveContainer>

              </Col>

              <Col sm={3} style={{minWidth:'33%',height:300
              }} >
              <ResponsiveContainer>

              <PieChart width={410} height={360} onMouseEnter={this.onPieEnter}>
        <Pie
          data={data2}
          cx={160}
          cy={160}
          labelLine={false}
          dataKey="value"
          label={this.renderCustomizedLabel}
          outerRadius={90}
          fill="#8884d8"
        >
        	{
          	data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
      </PieChart>
      </ResponsiveContainer>
              </Col>
              <Col sm={3} style={{minWidth:'33%',height:300}} >
                  <h2 style={{ color: '#202156'}}> Efectividad </h2>
                  <h2 style={{fontSize:'9rem', color: '#202156',paddingTop:'10%'}}> {this.state.efectividad}%</h2>
              </Col>

        </Row>

        <Row style={{ marginTop:'2rem'}}>
            <Col sm={12} style={{paddingBottom:'7rem'}}>
              <BootstrapTable
              pagination
              data={ this.state.tablaGestiones }
              options={ options }
              selectRow={ selectRow }
              exportCSV
              search
              >
              <TableHeaderColumn dataField='odpapel' isKey={ true } dataSort={ true }>OD PAPEL</TableHeaderColumn>
              <TableHeaderColumn dataField='hora' dataSort={ true } width={'10%'}>HORA</TableHeaderColumn>
              <TableHeaderColumn dataField='codigo' dataSort={ true } width={'7%'} >COD</TableHeaderColumn>
              <TableHeaderColumn dataField='nombre' dataSort={ true }>NOMBRE DE CODIGO</TableHeaderColumn>
              <TableHeaderColumn
                     dataField='button'
                     dataFormat={this.cellButton.bind(this)}
                   />
              </BootstrapTable>
            </Col>

        </Row>

      </Container>

</div>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: ("AIzaSyCnxZQw92wExvw6VWPC4nww2psARwSuy5g")
})(App)
