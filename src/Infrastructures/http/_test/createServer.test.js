const createServer = require('../createServer');

describe('HTTP Server', () => {
  it('should handle server error correctly', async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const server = await createServer({});

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message)
        .toEqual('there is something wrong with server');
  });

  it('should response 404 when request url not found', async () => {
    const server = await createServer({});

    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should response 401 when request to restricted endpoint' +
    'not contain authentications', async () => {
    const server = await createServer({});

    const requestPayload = {
      title: 'test title',
      body: 'test body',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
    });

    expect(response.statusCode).toEqual(401);
  });

  describe('GET /', () => {
    it('should response 200 and return api name and version', async () => {
      const server = await createServer({});

      const response = await server.inject({
        method: 'GET',
        url: '/',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.name).toEqual('Forum API');
      expect(responseJson.data.version).toEqual('1.0.0');
    });
  });
});
