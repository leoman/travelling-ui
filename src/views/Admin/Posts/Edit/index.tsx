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
} from '@bootstrap-styled/v4'
import Loading from '../../../../components/Loading';
import API from '../../../../service/travelingAPI';
import { Post } from '../../../../types/post'
import Form from '../Form'
import { ControlBar } from './styles'
import { Photo } from '../../../../types/photo'

const Edit: React.FC = (): React.ReactElement | null => {

  const { tripSlug } = useParams<{ tripSlug: string }>();
  const { slug } = useParams<{ slug: string }>()
  const [ message, setMessage ] = useState<string>('')
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<null | string>(null)
  const [ post, setPost ] = useState<null | Post>(null)

  const fetchPost = async () => {
    if (slug) {
      try {
        setLoading(true);
        const response = await API.getPost(slug);
        setPost(response.result);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Bad things happened');
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const onChange = (post: Post) => setPost(post)

  const onSave = async () => {
    if (post && post.id) {
      console.log('post.order', post.order);
      const editPostVariables: Post = {
        ...post,
        location: {
          ...post.location,
        },
        order: new Date(post.order)
      }

      try {
        await API.updatePost(post.id, editPostVariables);
        setMessage('Post has been updated')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const onSaveImage = async (currentPhoto: string) => {
    if (!post || !post.id) return false;
    try {
      const response = await API.savePhoto({ postId: post.id, url: currentPhoto });

      if (post.photos) {
        setPost({
          ...post,
          photos: post.photos.concat([{ id: response.result.id, url: currentPhoto}])
        })
      }

      setMessage('Post has been updated')
      return response
    } catch (error) {
      setError('An error occurred when saving the photo')
      console.log(error)
      return false
    }
  }

  const onDeleteImage = async (id: number) => {
    try {
      await API.deletePhoto(id);

      if (post && post.photos) {
        setPost({
          ...post,
          photos: post.photos.filter((photo: Photo) => photo.id !== id),
        })
      }
    } catch (error) {
      setError('An error occurred when deleting the photo')
      console.log(error)
    }
  }

  if (loading || error || !post) return null

  if (loading || error) return <Loading fade={false} />;

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
          {error && <Alert color="error" isOpen={error} uncontrolled autoHideDuration="5000">{error}</Alert>}

          <Breadcrumb>
            <BreadcrumbItem><Link to={`/admin/trips`}>Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/admin/trips/${tripSlug}/posts`}>{tripSlug} Posts</Link></BreadcrumbItem>
            <BreadcrumbItem active>Edit Post</BreadcrumbItem>
          </Breadcrumb>

          <ControlBar>
            <Button onClick={() => onSave()} outline="true" color="primary">Save Post</Button>
          </ControlBar>

          <Form post={post} onPostChange={onChange} onSaveImage={onSaveImage} onDeleteImage={onDeleteImage} />
        </Col>
      </Row>
    </Container>
  )
}

export default Edit