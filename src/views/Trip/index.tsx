import React from 'react'
import { useParams } from "react-router-dom"
import MapView from '../Map'
import { Trip } from '../../types/trip';

interface Props {
  trips: Trip[]
}

const TripView: React.FC<Props> = ({ trips }) => {
  const { slug } = useParams<{ slug: string }>();

  if (!trips) return null;

  return (
    <MapView slug={slug} trips={trips} />
  )

}

export default TripView