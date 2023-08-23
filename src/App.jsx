import React from 'react'
import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState ,useRef,useMemo,useCallback ,useEffect} from 'react'
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";



function App() {

  useEffect(() => {
    // Create the map
    const map = L.map('map').setView([23.58, 120.58], 13);
    
    // Add TileLayer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add Leaflet-PM controls
    map.pm.addControls({
      position: 'topleft',
      drawCircleMarker: false,
      rotateMode: false,
    });
    const handleMarkerClick = (event) => {
      console.log(event.marker._latlng)

    };
    map.on('pm:create', handleMarkerClick);
    // Clean up function
    return () => {
      map.off('pm:create', handleMarkerClick)
      map.remove();
    };
  }, []);

  return (
  <>
  <div id="map"></div>
  </>)
}

export default App;

