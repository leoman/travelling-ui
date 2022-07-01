/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { Post } from '../../../types/post'

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

export default MapFC;