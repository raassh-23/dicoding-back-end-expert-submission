const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper =
  require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const {
  registerAndLogin,
  addThreadWithToken,
} = require('../../../../tests/FunctionalTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 400 when request payload ' +
      'not contain needed property', async () => {
      const server = await createServer(container);

      const accessToken = await registerAndLogin(server);

      const requestPayload = {
        title: 'test title',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
          .toEqual('can not create thread because needed property is missing');
    });

    it('should response 400 when request payload ' +
        'not meet data specification', async () => {
      const server = await createServer(container);

      const accessToken = await registerAndLogin(server);

      const requestPayload = {
        title: 'test title',
        body: ['test body'],
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
          .toEqual('can not create thread ' +
              'because data specification is not met');
    });

    it('should response 201 and persisted thread', async () => {
      const server = await createServer(container);

      const accessToken = await registerAndLogin(server);

      const requestPayload = {
        title: 'test title',
        body: 'test body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/threads-123',
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread is not found');
    });
  });

  it('should response 200 and thread', async () => {
    const server = await createServer(container);

    const accessToken = await registerAndLogin(server);
    const threadId = await addThreadWithToken(server, accessToken);

    const response = await server.inject({
      method: 'GET',
      url: `/threads/${threadId}`,
    });

    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.thread).toBeDefined();
  });
});
