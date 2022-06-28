import API, { EMPTY_PARAMS, BASE_URL, Options } from './api';
import { Response } from '../types';
import { GetTrips, Trip } from '../types/trip';
import { Post } from '../types/post';
import { Photo, SavePhoto } from '../types/photo';
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

  public getTrip(slug: string): Promise<Response<Trip>> {
    return this.client.get({ url: `${BASE_URL}/${this.tripsURL}/${slug}` })
  }

  public saveTrip(trip: Trip): Promise<Response<Trip>> {
    return this.client.post({ url: `${BASE_URL}/${this.tripsURL}`, data: trip })
  }

  public updateTrip(id: number, trip: Trip): Promise<Response<Trip>> {
    return this.client.put({ url: `${BASE_URL}/${this.tripsURL}/${id}`, data: trip })
  }

  public deleteTrip(id: number): Promise<Response<Trip>> {
    return this.client.delete({ url: `${BASE_URL}/${this.tripsURL}/${id}` })
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

  /**
   * PHOTOS
   */
   public savePhoto(photo: SavePhoto): Promise<Response<Photo>> {
    return this.client.post({ url: `${BASE_URL}/${this.photosURL}`, data: photo })
  }

  public deletePhoto(id: number): Promise<Response<void>> {
    return this.client.delete({ url: `${BASE_URL}/${this.photosURL}/${id}` })
  }
  

}

export default new TravelingAPI();