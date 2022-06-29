/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FunctionComponent, useState, useEffect } from 'react'
import { MapI } from '../../types'
import { Post } from '../../types/post'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { createHTMLMapMarker } from './test';

const deepCompareEqualsForMaps = createCustomEqual(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

const render = () => {
  return <h1></h1>;
};

interface MarkerProps extends google.maps.MarkerOptions {
  post: Post
  lat: number
  lng: number
  hovered: boolean
}

const Marker: React.FC<MarkerProps> = ({ post, lat, lng, hovered, ...options }) => {
  const [marker, setMarker] = useState<google.maps.Marker | any>();

  useEffect(() => {
    if (!marker) {

      const hoveredClass = hovered ? 'hovered' : '';

      const marker = createHTMLMapMarker({
        latlng: new google.maps.LatLng(lat, lng),
        html: `<div class="${hoveredClass} map-marker"><img class="${hoveredClass} map-marker-icon" src="${post.photo}"></div>`
      });

      setMarker(marker);
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, hovered]);

  useEffect(() => {
    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }
  }, [hovered]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

interface MapProps extends google.maps.MapOptions {
  children?: React.ReactNode
  bounds: google.maps.LatLngBounds
  posts: Post[]
  style: { [key: string]: string }
}

const MapFC: React.FC<MapProps> = ({ children, bounds, posts, style, ...options}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  const setFlightPath = (map: google.maps.Map) => {

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
  }

  const setProjection = (map: google.maps.Map) => {
    const Overlay = new google.maps.OverlayView()
    Overlay.setMap(map)
    Overlay.draw = function () { return }
    
    Overlay.onAdd = function () {
      setFlightPath(map)
    }
  }

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {  
    if (map && bounds && posts.length > 0) {
      setProjection(map);
      map.fitBounds(bounds)
      map.setOptions(options);
    }

    if (map && bounds && posts.length === 0) {
      setProjection(map);
      map.setOptions(options);
    }
  }, [map, options, bounds, posts]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
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
    <Wrapper apiKey={'AIzaSyAPRFsDApyws3fqycIL34P2q1CqOlfZBJU'} render={render}>
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