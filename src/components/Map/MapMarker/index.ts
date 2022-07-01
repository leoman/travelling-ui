/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Post } from '../../../types/post'
import createHTMLMapMarker from './createHTMLMapMarker';

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


export default Marker;