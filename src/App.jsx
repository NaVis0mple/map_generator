import React from 'react'
import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState ,useRef,useMemo,useCallback ,useEffect} from 'react'
import {useImmer} from 'use-immer'
import { produce } from 'immer'
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";



function App() {
  const [markerStore,setMarkerStore] = useImmer([])
  const [view,setView] = useState([23.58, 120.58])
  function putMarkerOn (markerStore,map){
    markerStore.map(marker=>{L.marker([marker.lat,marker.lng]).addTo(map)})
  }
  useEffect(() => {
    // Create the map
    const map = L.map('map').setView(view, 13);
    
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
      setMarkerStore(produce(markerStore,draft=>{draft.push(event.marker._latlng)}))
      setView([event.marker._latlng.lat,event.marker._latlng.lng])
    };
    map.on('pm:create', handleMarkerClick);
    putMarkerOn(markerStore,map)
    // Clean up function
    return () => {
      map.off('pm:create', handleMarkerClick)
      map.remove();
    };
  }, [markerStore]);

  return (
  <>
  <div id="map"></div>
  <ul> {markerStore.map((position, index) => (
      <li key={index}>
        Marker {index + 1}: Latitude: {position.lat}, Longitude: {position.lng}
      </li>
    ))}</ul>
  </>)
}

export default App;

