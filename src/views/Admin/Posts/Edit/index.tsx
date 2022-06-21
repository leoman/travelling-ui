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
import API from '../../../../service/travelingAPI';
import { Post } from '../../../../types/post'
import Form from '../Form'
import { ControlBar } from './styles'
// import { GET_POST, EDIT_POST, ADD_PHOTO, DELETE_PHOTO } from '../../../../queries'
import { Photo } from '../../../../types/photo'

const Edit: React.FC = (): React.ReactElement | null => {

  const { id } = useParams<{ id: string }>()
  const [ post, setPost ] = useState<Post | null>(null)
  const [ message, setMessage ] = useState<string>('')
  // const { loading, error, data } = useQuery(GET_POST, { variables: { id: id } })
  // const [ editPost ] = useMutation(EDIT_POST)
  // const [ addPhoto ] = useMutation(ADD_PHOTO, {
  //   update(cache, { data: { addPhoto } }) {
  //     const { post } = cache.readQuery({ query: GET_POST, variables: { id: id } })
  //     cache.writeQuery({
  //       query: GET_POST,
  //       data: { post: {
  //         ...post,
  //         photos: post.photos.concat([addPhoto])
  //       } },
  //     })
  //   }
  // })
  // const [ deletePhoto ] = useMutation(DELETE_PHOTO, {
  //   update(cache, { data: { deletePhoto } }) {
  //     const { post } = cache.readQuery({ query: GET_POST, variables: { id: id } })
  //     cache.writeQuery({
  //       query: GET_POST,
  //       data: { post: {
  //         ...post,
  //         photos: post.photos.filter((photo: Photo) => photo.id !== deletePhoto.id),
  //       } },
  //     })
  //   }
  // })

  // useEffect(() => {
  //   if (data && data.post) {
  //     setPost(data.post)
  //   }
  // }, [loading, data])

  const onChange = (post: Post) => setPost(post)

  const onSave = async () => {
    if (post && post.id) {
      const editPostVariables: Post = {
        ...post,
        location: {
          ...post.location,
        },
        order: new Date(Number(post.order))
      }

      try {
        await API.updatePost(post.id, editPostVariables);
        setMessage('Post has been updated')
      } catch (error) {
        console.log(error)
      }
    }
  }

  // const onSaveImage = async (currentPhoto: string) => {
  //   const response = await addPhoto({ variables: { id, url: currentPhoto } })

  //   if(response.data.addPhoto) {
  //     setMessage('Post has been updated')
  //     return response
  //   }
  //   return false
  // }

  // const onDeleteImage = async (id: number) => await deletePhoto({ variables: { id } })

  // if (loading || error || !post) return null

  return (
    <Container>
      <Row>
        <Col lg="12">
          <Jumbotron>
            <H1 className="display-4">Admin: Edit Post</H1>
            <Hr className="my-4" />
          </Jumbotron>
        </Col>
      </Row>

      <Row>
        <Col>
          {message && <Alert color="success" isOpen={message} uncontrolled autoHideDuration="5000">{message}</Alert>}

          <Breadcrumb>
            <BreadcrumbItem><Link to={'/admin/posts'}>Home</Link></BreadcrumbItem>
            <BreadcrumbItem active>Edit Post</BreadcrumbItem>
          </Breadcrumb>

          <ControlBar>
            <Button onClick={() => onSave()} outline="true" color="primary">Save Post</Button>
          </ControlBar>

          {/* <Form post={post} onPostChange={onChange} onSaveImage={onSaveImage} onDeleteImage={onDeleteImage} /> */}
        </Col>
      </Row>
    </Container>
  )
}

export default Edit