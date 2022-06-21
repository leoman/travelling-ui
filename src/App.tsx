import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppWrapper } from './styles'
import PostView from './views/Post'
import TripView from './views/Trip'
import ListView from './views/Admin/Posts/View'
import Preview from './views/Admin/Posts/Preview'
import Login from './views/Admin/Login'
import Loading from './components/Loading';
import API from './service/travelingAPI';
import { Trip } from './types/trip';


const App = () => {

  const [ fade, setFade ] = useState<boolean>(false)
  const [ show, setShow ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<null | string>(null)
  const [ trips, setTrips ] = useState<null | Trip[]>(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await API.getTrips({ live: true });
        console.log('response', response);
        setTrips(response.result);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Could not fetch trips');
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  useEffect(() => {
    if (!loading) {
      setFade(true)
    }
    if (fade && !error) {
      setTimeout(() => setShow(true), 1000)
    }
  }, [loading, fade, error])

  if (loading || !show || error) return <Loading fade={fade} />;

  if (!trips) return null;

  return (
    <AppWrapper>
        <Router>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/posts/preview/:slug" element={<Preview />} />
            <Route path="/admin/posts" element={<ListView />} />
            <Route path="/posts/:slug" element={<PostView />} />
            <Route path="/:slug/*" element={<TripView trips={trips} />} />
            <Route path="*" element={<TripView trips={trips} />} />
          </Routes>
        </Router>
    </AppWrapper>
  )

}

export default App