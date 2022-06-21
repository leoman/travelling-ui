import React, { FunctionComponent, useState, useEffect } from 'react'
import { MapI } from '../../types'
import { Post } from '../../types/post'
import MapMarkers from './MapMarkers'
import { MapWrapper } from './styles'

const Map: FunctionComponent<MapI> = ({ posts, hoveredLocationKey }: MapI): React.ReactElement | null => {

  if (!posts) return null;

  let gMapScript: HTMLScriptElement | null


  const [ script, setScript ] = useState<boolean>(false)
  const [ map, setMap ] = useState<null | google.maps.Map>(null)
  const [ projection, setProjection ] = useState<null | google.maps.MapCanvasProjection>(null)

  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBAo4ixGPFTjKHDEc9t-E0yGrYfK5BN6y4'

  const getMapBounds = () => {
    const bounds = new window.google.maps.LatLngBounds()	  

    posts.forEach((post: Post) => {	
      bounds.extend(new window.google.maps.LatLng(	
        post.location.lat,	
        post.location.lng,	
      ))	
    })

    return bounds	
  }

  const setFlightPath = (map: google.maps.Map, projection: google.maps.MapCanvasProjection) => {

    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 4,
    }

    const path = posts.map((post) => ({
      lat: post.location.lat,
      lng: post.location.lng,
    }))

    const flightPath = new window.google.maps.Polyline({
      path,
      geodesic: false,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px',
      }],
      strokeColor: '#FF0000',
      strokeOpacity: 0,
      strokeWeight: 2,
    })

    flightPath.setMap(map)

    setMap(map)
    setProjection(projection)
  }

  const initMap = () => {

    setTimeout(() => {
      const mapElement = document.getElementById('map');

      if (!window.google) return;
      if (!mapElement) return;

      const map = new window.google.maps.Map(mapElement, {
        zoom: 5,
        center: { lat: -6.709618, lng: -2.607743 },
      })

      const bounds = getMapBounds()
      map.fitBounds(bounds)

      // setTimeout(() => {
      //   map.setCenter({ lat: -6.709618, lng: -2.607743 })
      // }, 100)

      const Overlay = new window.google.maps.OverlayView()
      Overlay.setMap(map)
      Overlay.draw = function () { return }
      
      Overlay.onAdd = function () {
        const projection = this.getProjection()
        setFlightPath(map, projection)
      }
    }, 200)
  }

  const attachGoogleScript = () => {
    if (!window.google) {

      console.log('attachGoogleScript');
      setScript(true)
      gMapScript = document.createElement('script')
      gMapScript.type = 'text/javascript'
      gMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${key}`
      const x = document.getElementsByTagName('script')[0]
      if(x.parentNode) x.parentNode.insertBefore(gMapScript, x)
      
      gMapScript.addEventListener('load', () => {
        initMap()
      })
    }
  }

  useEffect(() => {
    if (!script) {
      attachGoogleScript()
    }
  }, [script])

  return (
    <MapWrapper>
      <div style={{ width: '100%', height: '100%', zIndex: 1 }} id="map" />
      {(map && posts && projection) && <MapMarkers map={map} posts={posts} projection={projection} hoveredLocationKey={hoveredLocationKey} />}
    </MapWrapper>
  )

}

export default Map