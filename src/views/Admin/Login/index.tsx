import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Row,
    Col,
    Jumbotron,
    H1,
    Hr,
    Button,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Input,
    Alert,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
} from '@bootstrap-styled/v4'
import API from '../../../service/travelingAPI';

const Login: React.FC = () => {

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const navigate = useNavigate()

  const onSubmit = async () => {
    try {
      const response = await API.login({ username, password });
      localStorage.setItem('token', response.result.token)
      navigate("/admin/trips", { replace: true });
    } catch(error) {
      setMessage('Your login credentials were incorrect')
    }
  }

  return (
    <Container>
      <Row>
        <Col lg="12">
          <Jumbotron>
            <H1 className="display-4">Admin: Login</H1>
            <Hr className="my-4" />
          </Jumbotron>
        </Col>
      </Row>

        <Row>
          <Col>

            {message && <Alert color="danger" isOpen={message} uncontrolled autoHideDuration="5000">{message}</Alert>}
            
            <Form>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon>Username: </InputGroupAddon>
                  <Input onChange={(e: React.FormEvent<HTMLInputElement>) => setUsername(e.currentTarget.value)} value={username} type="text" className="form-control" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon>Password: </InputGroupAddon>
                  <Input onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)} value={password} type="password" className="form-control" />
                </InputGroup>
              </FormGroup>
            </Form>
            
            <Button onClick={() => onSubmit()} outline="true" color="primary">Login</Button>
          </Col>
        </Row>
    </Container>
  )
}

export default Login