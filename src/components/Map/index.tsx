/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FunctionComponent, useEffect } from 'react'
import { MapI } from '../../types'
import { Post } from '../../types/post'
import { Wrapper } from "@googlemaps/react-wrapper";
import MapFC from './GoogleMap'
import Marker from './MapMarker'

const render = () => {
  return <h1></h1>;
};


export const Map: FunctionComponent<MapI> = ({ posts, hoveredLocationKey, slug }: MapI): React.ReactElement | null => {

  const GOOGLE_MAP_KEY = process.env.GOOGLE_MAP_KEY || '';

  let defaultCenter = {
    lat: 49.54580194929472,
    lng: 14.065185524286113,
  }
  const [zoom] = React.useState(posts.length > 0 ? null : 3);

  if (posts.length > 0) {
    defaultCenter = {
      lat: -6.709618,
      lng: -2.607743,
    }
  }

  const [bounds, setBounds] = React.useState<google.maps.LatLngBounds>(new google.maps.LatLngBounds());
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>(defaultCenter);

  const getDefaultMapBounds = () => {
    const bounds = new google.maps.LatLngBounds()	  
    bounds.extend(new google.maps.LatLng(	
      defaultCenter.lat,	
      defaultCenter.lng,	
    ))	

    return bounds	
  }

  const getMapBounds = () => {
    const bounds = new google.maps.LatLngBounds()	  

    posts.forEach((post: Post) => {	
      bounds.extend(new google.maps.LatLng(	
        post.location.lat,	
        post.location.lng,	
      ))	
    })

    return bounds	
  }

  useEffect(() => {
    const currentBounds = getDefaultMapBounds();
    setBounds(currentBounds);
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const currentBounds = getMapBounds();
      const centerInfo = currentBounds.getCenter();
      setBounds(currentBounds);
      setCenter({ lat: centerInfo.lat(), lng: centerInfo.lng()})
    }
  }, [slug, posts]);

  return (
    <Wrapper apiKey={GOOGLE_MAP_KEY} render={render}>
      <MapFC
        center={center}
        zoom={zoom}
        bounds={bounds}
        posts={posts}
        style={{ flexGrow: "1", height: "100%" }}
      >
        {posts.map((post, i) => (
          <Marker key={i} 
            lat={post.location.lat}
            lng={post.location.lng}
            hovered={Boolean(i === hoveredLocationKey)}
            post={post} 
            />
        ))}
      </MapFC>
    </Wrapper>
  )
}

export default Map;