import { Component, OnInit, AfterViewInit } from '@angular/core';

import L from 'leaflet';
import {tiandituTileLayer, tiledMapLayer} from '@supermap/iclient-leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  index = 1;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log(L.CRS);
    const url = 'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World';
    const map = L.map('map', {
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.TianDiTu_WGS84
    });
    tiledMapLayer(url).addTo(map);
    tiandituTileLayer({
      layerType: 'img',
      key: '95304915c6b414cf00e4a65beca9c8da'
    }).addTo(map);
    tiandituTileLayer({
      key: '95304915c6b414cf00e4a65beca9c8da'
    }).addTo(map);
    tiandituTileLayer({
      isLabel: true,
      key: '95304915c6b414cf00e4a65beca9c8da'
    }).addTo(map);
  }

}
