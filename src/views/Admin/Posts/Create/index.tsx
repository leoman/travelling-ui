import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { Post, initialState } from '../../../../types/post'
import Form from '../Form'
import {
    Container,
    Row,
    Col,
    Jumbotron,
    H1,
    Hr,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
} from '@bootstrap-styled/v4'
import API from '../../../../service/travelingAPI';
import { ControlBar } from '../Edit/styles'
import { Trip } from '../../../../types/trip';
// import { CREATE_POST, All_POSTS } from '../../../../queries'

const Create: React.FC = (): React.ReactElement => {

  const navigate = useNavigate()
  const { tripSlug } = useParams<{ tripSlug: string }>();
  const [post, setPost] = useState<Post>(initialState)
  const [ trips, setTrips ] = useState<undefined | Trip[]>(undefined)
  const [ trip, setTrip ] = useState<undefined | Trip>(undefined)
  const [ error, setError ] = useState<null | string>(null)

  const onChange = (post: Post) => setPost(post)

  const fetchTrips = async () => {
    try {
      const response = await API.getTrips({});
      const trips = response.result;
      const trip = trips.find(trip => trip.slug === tripSlug)
      setTrip(trip);
      setTrips(trips);

      setError(null);
    } catch (error) {
      console.error(error);
      setError('Could not fetch trips');
    }
  }

  useEffect(() => {
    fetchTrips();
  }, []);
  

  const onSave = async () => {
    if (!post || !trip) return null

    const createPostVariables: Post = {
      ...post,
      location: {
        ...post.location
      },
      trip: trip
    }

    try {
      await API.savePost(createPostVariables);
      navigate(`/admin/trips/${tripSlug}/posts`, { replace: false });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Row>
        <Col lg="12">
          <Jumbotron>
            <H1 className="display-4">Admin: Add Post</H1>
            <Hr className="my-4" />
          </Jumbotron>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <Breadcrumb>
              <BreadcrumbItem><Link to={`/admin/trips`}>Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={`/admin/trips/${tripSlug}/posts`}>{tripSlug} Posts</Link></BreadcrumbItem>
              <BreadcrumbItem active>Add Post</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <ControlBar>
            <Button onClick={onSave} outline="true" color="primary">Save Post</Button>
          </ControlBar>

          <Form post={post} onPostChange={onChange} />
        </Col>
      </Row>
    </Container>
  )

}

export default Create