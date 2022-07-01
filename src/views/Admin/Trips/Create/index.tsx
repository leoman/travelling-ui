import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Trip, initialState } from '../../../../types/trip'
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
} from '@bootstrap-styled/v4'
import API from '../../../../service/travelingAPI';
import { ControlBar } from '../Edit/styles'

const Create: React.FC = (): React.ReactElement => {

  const navigate = useNavigate()
  const [ trip, setTrip] = useState<Trip>(initialState)

  const onChange = (trip: Trip) => setTrip(trip)

  const onSave = async () => {
    if (!trip || !trip) return null

    const createTripVariables: Trip = {
      ...trip,
    }

    try {
      await API.saveTrip(createTripVariables);
      navigate(`/admin/trips`, { replace: false });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Row>
        <Col lg="12">
          <Jumbotron>
            <H1 className="display-4">Admin: Add Trip</H1>
            <Hr className="my-4" />
          </Jumbotron>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <Breadcrumb>
              <BreadcrumbItem><Link to={`/admin/trips`}>Home</Link></BreadcrumbItem>
              <BreadcrumbItem active>Add Trip</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <ControlBar>
            <Button onClick={onSave} outline="true" color="primary">Save Trip</Button>
          </ControlBar>

          <Form trip={trip} onTripChange={onChange} />
        </Col>
      </Row>
    </Container>
  )

}

export default Create