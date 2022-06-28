import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import {
  Card,
  CardText,
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from '@bootstrap-styled/v4'
import API from '../../../../service/travelingAPI';
import Loading from '../../../../components/Loading'
import ScrollProgress from '../../../../components/ScrollProgress'
import { PostViewWrapper, ContentWrapper } from '../../../Post/styles'
import PostHeader from '../../../../components/PostHeader'
import PostContent from '../../../../components/PostContent'
import { Post } from '../../../../types/post'


const PostView: React.FC = (): React.ReactElement | null => {
  const { slug } = useParams<{ slug: string }>();

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
        setError(`Could not fetch Post: ${slug}`);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const backToPosts = () => {
    if (post) {
      window.location.replace(`${origin}/admin/trips/${post.trip.slug}/posts`);
    }
  }

  if (loading || error) return <Loading fade={false} />

  if (!post) return null
  const { content, photos } = post

  return (
    <PostViewWrapper>

      <ScrollProgress />

      <Card className="text-center" block color="info" backgroundColor={"d9534f"} >
        <CardText>This is a preview! <button onClick={backToPosts}>Back to Posts</button>.</CardText>
      </Card>

      <PostHeader
        post={post}
      />

      <ContentWrapper>
        <PostContent content={content} photos={photos} title={post.title} slug={post.trip.slug} />
      </ContentWrapper>
    </PostViewWrapper>
  )
}

export default PostView