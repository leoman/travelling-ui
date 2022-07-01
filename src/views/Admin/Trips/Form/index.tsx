import React, { useState } from 'react'
import { Trip, initialState } from '../../../../types/trip'
import {
    Form as FormWrapper,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Input,
    Select,
    Option,
} from '@bootstrap-styled/v4'

interface Props {
    trip: Trip
    onTripChange(trip: Trip): void
}

export enum Fields {
  name = "title",
  status = "titleColour",
}


const Form: React.FC<Props> = ({ trip, onTripChange, }: Props): React.ReactElement => {

  const [formTrip, setTrip] = useState(trip)

  const onChange = (value: string, field: string) => {

    let newTrip: Trip = initialState
    newTrip = {
      ...trip,
      [field]: value
    }

    setTrip(newTrip)
    onTripChange(newTrip)
  }

  const { name, slug, status } = formTrip

  return (
    <FormWrapper>
      <FormGroup>
        <InputGroup>
          <InputGroupAddon>Name</InputGroupAddon>
          <Input onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e.currentTarget.value, 'name')} value={name} type="text" className="form-control" />
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <InputGroup>
          <InputGroupAddon>Slug</InputGroupAddon>
          <Input disabled value={slug} type="text" className="form-control" />
        </InputGroup>
      </FormGroup>
      
      <FormGroup>
        <InputGroup>
          <InputGroupAddon>Status</InputGroupAddon>
          <Select value={status} onChange={(e: React.FormEvent<HTMLSelectElement>) => onChange(e.currentTarget.value, 'status')} >
            <Option value="draft">Draft</Option>
            <Option value="live">Live</Option>
          </Select>
        </InputGroup>
      </FormGroup>
    </FormWrapper>
  )

}

export default Form