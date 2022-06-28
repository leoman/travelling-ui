import { Response } from './index';

export enum Status {
  live = "live",
  draft = "draft"
}

export interface Trip {
  id?: number
  name: string
  slug: string
  status: string
}

export interface GetTrips extends Response<Trip[]> {
  result: Trip[]
}

export const initialState: Trip = {
  name: '',
  slug: '',
  status: Status.draft
}