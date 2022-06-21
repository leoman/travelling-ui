import API, { EMPTY_PARAMS, BASE_URL, Options } from './api';
import { Response } from '../types';
import { GetTrips } from '../types/trip';
import { Post } from '../types/post';
import { LoginCredentials, LoginResponse } from '../types/login';

class TravelingAPI extends API {

  /**
   * AUTH
   */
  public login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.client.post({ url: `${BASE_URL}/${this.loginURL}`, data: credentials })
  }

  /**
   * TRIPS
   */
  public getTrips({ live = false }: Options): Promise<GetTrips> {
    let params = EMPTY_PARAMS;
    if (live) {
      params = this.getURLParams({ live })
    }
    return this.client.get({ url: `${BASE_URL}/${this.tripsURL}${params}` })
  }

  /**
   * POSTS
   */
  public getPosts({ status = undefined, trip }: Options): Promise<Response<Post[]>> {
    const params = this.getURLParams({ 
      ...(status && { status }),
      trip
    })
    return this.client.get({ url: `${BASE_URL}/${this.postsURL}${params}` })
  }

  public getPost(postSlug: string): Promise<Response<Post>> {
    return this.client.get({ url: `${BASE_URL}/${this.postsURL}/${postSlug}` })
  }

  public savePost(post: Post): Promise<Response<Post>> {
    return this.client.post({ url: `${BASE_URL}/${this.postsURL}`, data: post })
  }

  public updatePost(id: number, post: Post): Promise<Response<Post>> {
    return this.client.put({ url: `${BASE_URL}/${this.postsURL}/${id}`, data: post })
  }

  public deletePost(id: number): Promise<Response<Post>> {
    return this.client.delete({ url: `${BASE_URL}/${this.postsURL}/${id}` })
  }

}

export default new TravelingAPI();