import { Component,AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

import {faTrash} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private faTrash=faTrash
  private map;
  private load = true
  private names =[
   
  ]
  ngOnInit(){

  }

  // leaflet has so problems with ionic so it needs to be loaded here
  
  ionViewDidEnter(){
    this.initMap();
    this.getMarkers();
    this.deleteMarker('roach')
  
  }

  constructor(private http:HttpClient) {}

  private initMap(): void {
    // map config 
    this.map = new L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });
    // tile styles
    // https://leaflet-extras.github.io/leaflet-providers/preview/
    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // add config and style to map att 
    tiles.addTo(this.map);
    // reload tiles just in case 
    this.map.invalidateSize();
 
    this.map.on('dblclick',(e)=>this.addMarker(e))
    


    
  }

public  addMarker(e){
    // Add marker to map at click location; add popup window
    let type = prompt('Qual vai ser o tipo do marcador?\n* dog\n* google \n* barata');
    let nome = prompt('Qual vai ser o nome do marcador?');

    let resp:any =this.getMarkerType(type)
    let config={ icon: L.icon({
      iconSize: resp.iconSize, //icon size [width.height]
      iconAnchor: [ 40, 41 ], //chage popup position bind
      iconUrl: resp.url,
      // shadowUrl: 'leaflet/marker-shadow.png'   *png to make marker shadow
    })}
    let item ={name:nome.length==0?'Não informado':nome,loc:[e.latlng],type:type}
    this.insertMarker(JSON.stringify(item))
    this.names.push(item)
    var newMarker = new L.marker(e.latlng,config).addTo(this.map).bindPopup(resp.msg);
}

public getMarkerType(_type:string){
    let type

    const map = {
      dog:{url:'https://images.vexels.com/media/users/3/200104/isolated/preview/38f7814a1505c03e3a0c026e4126cc00-ilustracao-de-cachorro-basse-lateral.png',iconSize:[100,100],msg:'Cachorro Salsicha:<br>eu sou um marcador personalizado'},
      google:{url:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Google_Maps_pin.svg/1200px-Google_Maps_pin.svg.png',iconSize:[41,68],msg:'Sou um marcador do google que roubaram'},
      barata:{url:'http://pa1.narvii.com/7556/290db318026cf9d2f2bb3b9c817b06c127a873b4r1-300-300_00.gif',iconSize:[100,100],msg:'Barata:<br>eu sou uma barata'}
    }

    type = map[_type]!=null?map[_type]:{url:'leaflet/marker-icon.png',iconSize:[ 25, 41 ],msg:'Default marker'}
    return type;
}


public goTo(loc){
  this.map.panTo(loc[0])
}

 public insertMarker(jsonData){
  let table ='markers.json'
  this.http.post(
    `https://angularfirebasedemo-34201-default-rtdb.firebaseio.com/${table}`,
    jsonData
  )
  .subscribe((response)=>console.log(response))
 }

 public getMarkers(){
  let table ='markers.json'
  this.http.get(
    `https://angularfirebasedemo-34201-default-rtdb.firebaseio.com/${table}`
  )
  .subscribe((response)=>{
    console.log(response)
    Object.values(response).map((e)=>{
      console.log(e)
      this.load=false;
      let resp:any =this.getMarkerType(e.type)
      let config={ icon: L.icon({
        iconSize: resp.iconSize, //icon size [width.height]
        iconAnchor: [ 40, 41 ], //chage popup position bind
        iconUrl: resp.url,
        // shadowUrl: 'leaflet/marker-shadow.png'   *png to make marker shadow
      })}
       var newMarker = new L.marker(e.loc[0],config).addTo(this.map).bindPopup(resp.msg);
      this.names.push(e)
    })
  })
 }

 public deleteMarker(name){
  let table ='markers.json'
  this.http.get(
    `https://angularfirebasedemo-34201-default-rtdb.firebaseio.com/${table}?orderBy="name"&equalTo="Kayoken"&print=pretty`
  )
  .subscribe((response)=>{
    console.log(response)
  })
 }
 


}
