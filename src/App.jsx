import React, { useState, useEffect } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


function App () {
  const [featureGroup,setF] = useState(null)
  
  const queryParams = new URLSearchParams(window.location.search)
  const geojsonTextData = queryParams.get('text')
  const geojsonNonTextData = queryParams.get('nontext')

  const [url,setUrl] = useState('need generate')
  useEffect(() => {
    const map = L.map('map').setView([23.58, 120.58], 13)
    L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
    }).addTo(map) 
    
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})
//feature layer    
    const fg = L.featureGroup().addTo(map)
    setF(fg)
//bar
    map.pm.addControls({
      position: 'topleft',
      drawCircleMarker: false,
      rotateMode: false,
      drawCircle:false
    })
    map.pm.setGlobalOptions({layerGroup: fg})

//add json to the feature layer
    if(geojsonNonTextData){

      const decodeGeoJSON = JSON.parse(decodeURIComponent(geojsonNonTextData))

      const newJ = L.geoJSON(decodeGeoJSON)
      newJ.addTo(fg)
    }
    if(geojsonTextData){
      const decodeGeoJSON = JSON.parse(decodeURIComponent(geojsonTextData))
      for(const text of decodeGeoJSON){
        L.marker([text.pos.lat,text.pos.lng], {
          textMarker: true,
          text: text.text,
        }).addTo(map);
      }
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
    //devide text and nontext
    const getlayer = featureGroup.pm.getLayers()
    let textObjectArray =[]
    let featureGroupWithoutText = []
    for (const layer of getlayer){
      if(layer.options.textMarker){
        const text =layer.options.text
        const pos = layer._latlng
        textObjectArray.push({text:text,pos:pos})
      }else{
        featureGroupWithoutText.push(layer.toGeoJSON())
      }
    }
    let jsonFormateOfNontext = {
      type:'FeatureCollection',
      features:featureGroupWithoutText
    }
 
    const encodeTextData = encodeURIComponent(JSON.stringify(textObjectArray))
    const encodeNonTextData = encodeURIComponent(JSON.stringify(jsonFormateOfNontext))

    setUrl(`https://map-generator.pages.dev/?text=${encodeTextData}&nontext=${encodeNonTextData}`)
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
