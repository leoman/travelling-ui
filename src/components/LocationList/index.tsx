import React from 'react'
import LocationPanel from './LocationPanel'
import { LocationListI } from '../../types'
import { Post } from '../../types/post'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LocationList = ({ posts, listItemHovered }: LocationListI): any => {
  return posts.filter((post: Post) => !post.location.hideFromBounding).map((post: Post, i: number) => (
    <LocationPanel key={i.toString()} i={i} post={post} listItemHovered={listItemHovered} />
  ))
}

export default LocationList