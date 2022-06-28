interface Get_Props {
  url: string
  headers?: { [key: string]: string }
}

interface Post_Props<D,> extends Get_Props {
  data?: D
}

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

class HTTPClient {

  async request<P extends Post_Props<D>, D = undefined>(method: METHODS, { url, headers, data }: P) {
    const token = localStorage.getItem('token')

    try {

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          authorization: token ? `Bearer ${token}` : '',
          ...headers,
        },
        ...(data && {body: JSON.stringify({ ...data }) })
      });

      if (!response.ok) {
        throw response;
      }
      
      const parsedResponse = await response.json();
      return parsedResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 401) {
        localStorage.removeItem('token')
        window.location.replace(`${origin}/admin/login`);
      }
      throw new Error(error.statusText);
    }
  }

  async get<R>(props: Get_Props): Promise<R> {
    return this.request<Get_Props>(METHODS.GET, props)
  }

  async post<D, R>(props: Post_Props<D>): Promise<R> {
    return this.request<Get_Props>(METHODS.POST, props)
  }

  async put<D, R>(props: Post_Props<D>): Promise<R> {
    return this.request<Get_Props>(METHODS.PUT, props)
  }

  async delete<D, R>(props: Post_Props<D>): Promise<R> {
    return this.request<Get_Props>(METHODS.DELETE, props)
  }
}

export default new HTTPClient();