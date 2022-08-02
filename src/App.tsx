import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppWrapper } from './styles'
import PostView from './views/Post'
import TripView from './views/Trip'

import PostListView from './views/Admin/Posts/View'
import Preview from './views/Admin/Posts/Preview'
import PostCreate from './views/Admin/Posts/Create'
import PostEdit from './views/Admin/Posts/Edit'

import TripListView from './views/Admin/Trips/View'
import TripCreate from './views/Admin/Trips/Create'
import TripEdit from './views/Admin/Trips/Edit'

import Login from './views/Admin/Login'
import Loading from './components/Loading';
import API from './service/travelingAPI';
import { Trip } from './types/trip';

const App = () => {

  const [ fade, setFade ] = useState<boolean>(false)
  const [ show, setShow ] = useState<boolean>(false)
  const [ trips, setTrips ] = useState<null | Trip[]>(null)

  const { isLoading, error, data } = useQuery('tripsLiveData', () => API.getTrips({ live: true }), {
    staleTime: 3600000, 
  });

  useEffect(() => {
    if (data?.result) {
      setTrips(data?.result);
    }
  }, [data]);

  useEffect(() => {
    if (!isLoading) {
      setFade(true)
    }
    if (fade && !error) {
      setTimeout(() => setShow(true), 500)
    }
  }, [isLoading, fade, error])

  if (isLoading || !show || error) return <Loading fade={fade} />;

  if (!trips) return null;

  return (
      <AppWrapper>
          <Router>
            <Routes>
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/trips/:tripSlug/posts/preview/:slug" element={<Preview />} />
              <Route path="/admin/trips/:tripSlug/posts/edit/:slug" element={<PostEdit />} />
              <Route path="/admin/trips/:tripSlug/posts/add" element={<PostCreate />} />
              <Route path="/admin/trips/:tripSlug/posts" element={<PostListView />} />
              <Route path="/admin/trips/:tripSlug" element={<PostListView />} />
              <Route path="/admin/posts" element={<PostListView />} />

              <Route path="/admin/trips/edit/:slug" element={<TripEdit />} />
              <Route path="/admin/trips/add" element={<TripCreate />} />
              <Route path="/admin/trips" element={<TripListView />} />
              <Route path="/posts/:slug" element={<PostView />} />
              <Route path="/:slug/*" element={<TripView trips={trips} />} />
              <Route path="*" element={<TripView trips={trips} />} />
            </Routes>
          </Router>
      </AppWrapper>
  )

}

export default App