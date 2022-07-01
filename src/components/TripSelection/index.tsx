import React from 'react';
import {
  Form as FormWrapper,
  FormGroup,
  Input,
  Option,
  InputGroupAddon,
  InputGroup,
} from '@bootstrap-styled/v4'
import { Trip } from '../../types/trip'
import { Wrapper } from './styles';

interface Props {
  changeTrip: (value: React.ChangeEvent<HTMLSelectElement>) => void
  trips: Trip[]
  slug?: string
}

const TripSelection = ({ changeTrip, trips, slug: tripSlug }: Props) => (
    <Wrapper>
      <FormWrapper>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon>Our Trips:</InputGroupAddon>
            <Input onChange={changeTrip} type="select" name="trips" id="trips" value={tripSlug}>
              <Option key={'default'} value={''}>Please select a trip</Option>
              {trips.map(({ slug, name }: Trip) => (
                <Option key={slug} value={slug}>{name}</Option>
              ))}
            </Input>
          </InputGroup>
        </FormGroup>
      </FormWrapper>
    </Wrapper>
)

export default TripSelection;
