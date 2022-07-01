import React, { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
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
} from '@bootstrap-styled/v4'
import { Link, useParams } from "react-router-dom"
import API from '../../../../service/travelingAPI';
import Loading from '../../../../components/Loading';
import { Table, ControlBar } from './styles'
import { Post } from '../../../../types/post'

const ListView: React.FC = (): React.ReactElement => {

  const { tripSlug } = useParams<{ tripSlug: string }>();
  const [modal, setModal] = useState<boolean>(false)
  const [id, setId] = useState<number | null>(null)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<null | string>(null)
  const [ data, setData ] = useState<Post[]>([])

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await API.getPosts({ trip: tripSlug });
      setData(response.result);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Bad things happened');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tripSlug) {
      fetchPosts();
    }
  }, [tripSlug]);


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
      await API.deletePost(id);
      await fetchPosts();
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

  if (loading || error) return <Loading fade={false} />;

  return (
    <Container>
      <Row>
        <Col lg="12">
        <Jumbotron>
          <H1 className="display-4">Admin: Posts</H1>
          <P lead>Please use the list below to administer changes to Posts.</P>
          <Hr className="my-4" />
        </Jumbotron>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={() => closeDeleteModal()}>
        <ModalHeader toggle={() => closeDeleteModal()}>Delete Post</ModalHeader>
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
            <BreadcrumbItem><Link to={`/admin/trips`}>Home</Link></BreadcrumbItem>
            <BreadcrumbItem>{tripSlug}</BreadcrumbItem>
            <BreadcrumbItem active>View Posts</BreadcrumbItem>
          </Breadcrumb>

          <ControlBar>
            <Link to={`/admin/trips/${tripSlug}/posts/add`}>
              <Button outline="true" color="primary">Add Post</Button>
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
              {data.map(({ id, slug, title, order, status }: Post, i: number) => (
                <Tr key={i.toString()}>
                  <Td>{title}</Td>
                  <Td>{status}</Td>
                  <Td>{DateTime.fromJSDate(new Date(order)).toFormat("dd MMMM y")}</Td>
                  <Td>
                    <Link to={`/admin/trips/${tripSlug}/posts/preview/${slug}`}>
                      <Button outline="true" color="primary">Preview</Button>
                    </Link>
                  </Td>
                  <Td>
                    <Link to={`/admin/trips/${tripSlug}/posts/edit/${slug}`}>
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