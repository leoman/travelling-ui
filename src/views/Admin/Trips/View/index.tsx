import React, { useState, useEffect } from 'react'
import {
    Container,
    Row,
    Col,
    Thead,
    Tr,
    Td,
    Th,
    Tbody,
    Jumbotron,
    H1,
    P,
    Hr,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
} from '@bootstrap-styled/v4'
import { Link } from "react-router-dom"
import API from '../../../../service/travelingAPI';
import Loading from '../../../../components/Loading';
import { Table, ControlBar } from './styles';
import { Trip } from '../../../../types/trip';

const ListView: React.FC = (): React.ReactElement => {

  const [modal, setModal] = useState<boolean>(false)
  const [id, setId] = useState<number | null>(null)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<null | string>(null)
  const [ trips, setTrips ] = useState<Trip[]>([])

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await API.getTrips({});
      setTrips(response.result);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('No trips could be fetched');
    } finally {
      setLoading(false);
    }
  }

  

  useEffect(() => {
    fetchTrips();
  }, []);


  const showDeleteModal = (id?: number): void => {
    if (id) {
      setModal(true)
      setId(id)
    }
  }

  const closeDeleteModal = (): void => {
    setModal(false)
    setId(null)
  }

  const onDelete = async (id: number) => {
    try {
      await API.deleteTrip(id);
      await fetchTrips();
    } catch (error) {
      console.error(error);
      setError('Delete failed');
    }
  }

  const confirmDelete = (): null | void => {
    if(!id) return null

    onDelete(id)
    closeDeleteModal()
  }

  if (loading || error) return (<Loading fade={false} />);

  return (
    <Container>
      <Row>
        <Col lg="12">
        <Jumbotron>
          <H1 className="display-4">Admin: Trips</H1>
          <P lead>Please use the list below to administer changes to Trips.</P>
          <Hr className="my-4" />
        </Jumbotron>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={() => closeDeleteModal()}>
        <ModalHeader toggle={() => closeDeleteModal()}>Delete Trip</ModalHeader>
        <ModalBody>
          This action cannot be un done.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => confirmDelete()}>Confirm Delete</Button>
          <Button color="secondary" onClick={() => closeDeleteModal()}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Row>
        <Col lg="12">

          <Breadcrumb>
            <BreadcrumbItem to={`/admin/trips`} active>Home</BreadcrumbItem> 
          </Breadcrumb>

          <ControlBar>
            <Link to={`/admin/trips/add`}>
              <Button outline="true" color="primary">Add Trip</Button>
            </Link>
          </ControlBar>
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <Table>
            <Thead defaultBg>
              <Tr>
                <Th>
                  Title
                </Th>
                <Th>
                  Status
                </Th>
                <Th>
                  Date
                </Th>
                <Th colSpan={3}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {trips.map(({ id, slug, name, status }: Trip, i: number) => (
                <Tr key={i.toString()}>
                  <Td><Link to={`/admin/trips/${slug}/posts`}>{name}</Link></Td>
                  <Td>{status}</Td>
                  <Td>
                    <Link to={`/admin/trips/edit/${id}`}>
                      <Button outline="true" color="primary">Edit</Button>
                    </Link>
                  </Td>
                  <Td><Button onClick={() => showDeleteModal(id)} outline={true} color="danger">Delete</Button></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )

}

export default ListView