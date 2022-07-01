import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query'
import { useNavigate } from "react-router-dom";
import Map from '../../components/Map';
import LocationList from '../../components/LocationList';
import Loading from '../../components/Loading'
import TripSelection from '../../components/TripSelection'
import { Post } from '../../types/post'
import { Trip } from '../../types/trip'
import API from '../../service/travelingAPI';
import { MapViewWrapper, MapWrapper, ListWrapper, NavigationToggle, TitleWrapper, Title } from './styles';
import ScrollTop from '../../components/ScrollTop';

interface Props {
  slug: string | undefined
  trips: Trip[]
}

const MapView: React.FC<Props> = ({ slug, trips }) => {

  const navigate = useNavigate();
  const [ hoveredLocationKey, setHoveredLocationKey ] = useState<null | number>(null)
  const [ fade, setFade ] = useState<boolean>(false)
  const [ show, setShow ] = useState<boolean>(false)
  const [ posts, setPosts ] = useState<Post[]>([])
  const [ navigationShown, setNavigationShown ] = useState<boolean>(true)
  
  const { isLoading: loading, error, data } = useQuery(['getPosts', slug], () => API.getPosts({ status: 'live', trip: slug }), {
    staleTime: 3600000, 
  });

  useEffect(() => {
    if (data?.result) {
      setPosts(data?.result);
    }
  }, [data]);

  const listItemHovered = (hoveredLocationKey: number): void => setHoveredLocationKey(hoveredLocationKey)

  const toggleNavigation = (navigationShown: boolean): void => setNavigationShown(!navigationShown)

  const changeTrip = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    navigate(`/${event.target.value}`, { replace: false });
  }

  const listRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFade(false)
    setShow(false)
    setTimeout(() => setShow(true), 1000)
  }, [data])

  if (loading || !show || error) return <Loading fade={fade} />;

  return (
      <MapViewWrapper>
          <TitleWrapper>
              <Title navigation={false}>
                  Kirsty and Pete&apos;s Travel Adventure
              </Title>
          </TitleWrapper>
          <MapWrapper navigationShown={navigationShown}>
              <NavigationToggle onClick={() => toggleNavigation(navigationShown)} />
              <Map posts={posts} hoveredLocationKey={hoveredLocationKey} slug={slug}  />
          </MapWrapper>
          <ListWrapper navigationShown={navigationShown} ref={listRef}>
            <ScrollTop ref={listRef} light={true} />
            <Title navigation>
                Kirsty and Pete&apos;s Travel Adventure
            </Title>
            <TripSelection changeTrip={changeTrip} trips={trips} slug={slug} />
            <LocationList posts={posts} listItemHovered={listItemHovered} />
          </ListWrapper>
      </MapViewWrapper>
  )
}

export default MapView;