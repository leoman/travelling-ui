import { Response } from './index';

export interface Trip {
  name: string
  slug: string
  status: string
}

export interface GetTrips extends Response<Trip[]> {
  result: Trip[]
}