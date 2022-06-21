import HTTPClient from './client';

export interface Options {
  live?: boolean
  trip?: string
  status?: string
}

export interface Param { 
  key: string
  value: string | boolean | undefined
}
export interface Params { [key: string]: string | boolean | undefined }

export const BASE_URL = 'http://localhost:4003/dev';
export const EMPTY_PARAMS = '';

class API {

  protected client = HTTPClient;
  protected tripsURL = 'trips';
  protected postsURL = 'posts';
  protected photosURL = 'photos';
  protected loginURL = 'login';
  protected params: Params = {};

  protected getURLParams(params: Params) {
    this.setParams(params)
    return this.getParams();
  }

  protected clearParams(): void {
    this.params = {};
  }

  protected setParam({ key, value }: Param): void {
    this.params = {
      ...this.params,
      [key]: value,
    }
  }

  protected setParams(params: Params) {
    this.clearParams();
    Object.entries(params).forEach(([key, value]) => {
      this.setParam({ key, value });
    });
  }

  protected getParams(): string {
    const params = Object.entries(this.params);
    if (params.length) {
      return `?${params.map(([key, value]) => `${key}=${value}`).join('&')}`
    }
    return EMPTY_PARAMS;
  }

}

export default API;