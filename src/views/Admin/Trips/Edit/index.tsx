import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
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
    Alert,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
} from '@bootstrap-styled/v4'
import Loading from '../../../../components/Loading';
import API from '../../../../service/travelingAPI';
import { Trip } from '../../../../types/trip'
import Form from '../Form'
import { ControlBar } from './styles'

const Edit: React.FC = (): React.ReactElement | null => {

  const { slug } = useParams<{ slug: string }>()
  const [ message, setMessage ] = useState<string>('')
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<null | string>(null)
  const [ trip, setTrip ] = useState<null | Trip>(null)

  const fetchTrip = async () => {
    if (slug) {
      try {
        setLoading(true);
        const response = await API.getTrip(slug);
        setTrip(response.result);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Could not fetch the trip');
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchTrip();
  }, [slug]);

  const onChange = (trip: Trip) => setTrip(trip)

  const onSave = async () => {
    if (trip && trip.id) {
      const editTripVariables: Trip = {
        ...trip,
      }

      try {
        await API.updateTrip(trip.id, editTripVariables);
        setMessage('Trip has been updated')
      } catch (error) {
        console.log(error)
      }
    }
  }

  if (loading || error || !trip) return null

  if (loading || error) return <Loading fade={false} />;

  return (
    <Container>
      <Row>
        <Col lg="12">
          <Jumbotron>
            <H1 className="display-4">Admin: Edit Trip</H1>
            <Hr className="my-4" />
          </Jumbotron>
        </Col>
      </Row>

      <Row>
        <Col>
          {message && <Alert color="success" isOpen={message} uncontrolled autoHideDuration="5000">{message}</Alert>}
          {error && <Alert color="error" isOpen={error} uncontrolled autoHideDuration="5000">{error}</Alert>}

          <Breadcrumb>
            <BreadcrumbItem><Link to={`/admin/trips`}>Home</Link></BreadcrumbItem>
            <BreadcrumbItem active>Edit Trip</BreadcrumbItem>
          </Breadcrumb>

          <ControlBar>
            <Button onClick={() => onSave()} outline="true" color="primary">Save Trip</Button>
          </ControlBar>

          <Form trip={trip} onTripChange={onChange} />
        </Col>
      </Row>
    </Container>
  )
}

export default Edit