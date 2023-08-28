import React, { useState, useEffect } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'



function App () {
  const [featureGroup,setF] = useState(null)
  
  const queryParams = new URLSearchParams(window.location.search)
  const geojsonData = queryParams.get('geojson')
  
  const [url,setUrl] = useState('need generate')
  useEffect(() => {

    const map = L.map('map').setView([23.58, 120.58], 13)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map) 
//feature layer    
    const fg = L.featureGroup().addTo(map)
    setF(fg)
//bar
    map.pm.addControls({
      position: 'topleft',
      drawCircleMarker: false,
      rotateMode: false
    })
    map.pm.setGlobalOptions({layerGroup: fg})

//add json to the feature layer
    if(geojsonData){
      const decodeGeoJSON = JSON.parse(decodeURIComponent(geojsonData))
      const newJ = L.geoJSON(decodeGeoJSON)
      newJ.addTo(fg)
    }


    return () => {  
      map.remove()
    }
  }, [])

// create new url
  const getEncodedGeoJSON = () => {
    if(!featureGroup){
      return
    }
    const GeoData = featureGroup.toGeoJSON()
    const encodeData = encodeURIComponent(JSON.stringify(GeoData))
    console.log(GeoData)
    console.log(encodeData)
    setUrl(`https://map-generator.pages.dev/?geojson=${encodeData}`)
  };
  

  return (
    <>
      <div id='map' />
      <button onClick={getEncodedGeoJSON}>generate new url</button>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </>
  )
}

export default App
