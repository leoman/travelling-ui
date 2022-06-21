import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
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
// import { CREATE_POST, All_POSTS } from '../../../../queries'

const Create: React.FC = (): React.ReactElement => {

  const navigate = useNavigate()
  const [post, setPost] = useState<Post>(initialState)
  // const [createPost] = useMutation(CREATE_POST, {
  //   update(cache, { data: { addPost } }) {
  //     const { allPosts } = cache.readQuery({ query: All_POSTS })
  //     cache.writeQuery({
  //       query: All_POSTS,
  //       data: { allPosts: allPosts.concat([addPost]) },
  //     })
  //   }
  // })

  const onChange = (post: Post) => setPost(post)

  const onSave = async () => {
    if (!post) return null

    const createPostVariables: Post = {
      ...post,
      location: {
        ...post.location
      }
    }

    try {
      await API.savePost(createPostVariables);
      navigate("/admin/posts", { replace: false });
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
              <BreadcrumbItem><Link to={'/admin/posts'}>Home</Link></BreadcrumbItem>
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