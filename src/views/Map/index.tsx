import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query'
import { useNavigate } from "react-router-dom";
import Map from '../../components/Map';
import LocationList from '../../components/LocationList';
import Loading from '../../components/Loading'
import { Post } from '../../types/post'
import { Trip } from '../../types/trip'
import API from '../../service/travelingAPI';
import { MapViewWrapper, MapWrapper, ListWrapper, NavigationToggle, TitleWrapper, Title } from './styles';
import {
  Form as FormWrapper,
  FormGroup,
  Input,
  Option,
  InputGroupAddon,
  InputGroup,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from '@bootstrap-styled/v4'
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

  // if (!loading) {
  //   setTimeout(() => {
  //     setFade(true)
  //   }, 1000)
  // }

  const listItemHovered = (hoveredLocationKey: number): void => setHoveredLocationKey(hoveredLocationKey)

  const toggleNavigation = (navigationShown: boolean): void => setNavigationShown(!navigationShown)

  const changeTrip = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    navigate(`/${event.target.value}`, { replace: false });
  }

  const listRef = useRef<HTMLInputElement>(null)

  // useEffect(() => {
  //   if (!loading) {
  //     setFade(true)
  //   }
  //   if (fade && !error) {
  //     setTimeout(() => setShow(true), 1000)
  //   }
  // }, [loading, fade, error])

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
            <div style={{ width: '50%', margin: '0 auto' }}>
              <FormWrapper>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon>Our Trips:</InputGroupAddon>
                    <Input onChange={changeTrip} type="select" name="trips" id="trips" value={slug}>
                      <Option key={'default'} value={''}>Please select a trip</Option>
                      {trips.map((trip) => (
                        <Option key={trip.slug} value={trip.slug}>{trip.name}</Option>
                      ))}
                    </Input>
                  </InputGroup>
                </FormGroup>
              </FormWrapper>
            </div>
            <LocationList posts={posts} listItemHovered={listItemHovered} />
          </ListWrapper>
      </MapViewWrapper>
  )
}

export default MapView;