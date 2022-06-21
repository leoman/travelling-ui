import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ScrollProgress from '../../components/ScrollProgress';
import ScrollTop from '../../components/ScrollTop';
import { PostViewWrapper, ContentWrapper, FacebookComments } from './styles';
import PostHeader from '../../components/PostHeader';
import PostContent from '../../components/PostContent';
import Footer from '../../components/Footer';
import Loading from '../../components/Loading';
import API from '../../service/travelingAPI';
import { Post } from '../../types/post';

declare global {
  interface Window {
    FB: {
      XFBML: {
        parse(): void
      }
    }
  }
}


const PostView: React.FC = () => {
  const [ fade, setFade ] = useState<boolean>(false)
  const [ show, setShow ] = useState<boolean>(false)
  const { slug } = useParams<{ slug: string }>();
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<null | string>(null)
  const [ post, setPost ] = useState<null | Post>(null)

  useEffect(() => {
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
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!loading) {
      setFade(true)
      setTimeout(() => window.FB.XFBML.parse(), 2000);
    }
    if (fade && !error) {
      setTimeout(() => setShow(true), 1000)
    }
  }, [loading, fade, error])

  if (loading || !show || error) return <Loading fade={fade} />;

  if (!post || !slug) return null;

  const { content, photos = [] } = post

  return (
    <PostViewWrapper>

      <ScrollProgress />
      <ScrollTop />

      <PostHeader post={post} />

      <ContentWrapper>
        <PostContent content={content} photos={photos} title={post.title} slug={post.trip.slug} />
      </ContentWrapper>

      <FacebookComments className="fb-comments" data-href={`http://kirstyandpete.com/posts/${slug}`} data-width="100%" data-numposts="5"></FacebookComments>
      <Footer />

    </PostViewWrapper>
  );
}

export default PostView;