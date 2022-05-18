const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper =
    require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const {
  registerAndLogin,
  addThreadWithToken,
} = require('../../../../tests/TestHelper');
const CommentsTableTestHelper =
    require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 400 when request payload ' +
      'not contain needed property', async () => {
      const server = await createServer(container);

      const accessToken = await registerAndLogin(server);
      const threadId = await addThreadWithToken(server, accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
          .toEqual('can not create comment because needed property is missing');
    });

    it('should response 400 when request payload ' +
        'not meet data specification', async () => {
      const server = await createServer(container);

      const accessToken = await registerAndLogin(server);
      const threadId = await addThreadWithToken(server, accessToken);

      const requestPayload = {
        content: ['test content'],
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
          .toEqual('can not create comment ' +
              'because data specification is not met');
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const accessToken = await registerAndLogin(server);

      const requestPayload = {
        content: 'test content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread is not found');
    });

    it('should response 201 and persisted comments', async () => {
      const server = await createServer(container);

      const accessToken = await registerAndLogin(server);
      const threadId = await addThreadWithToken(server, accessToken);

      const requestPayload = {
        content: 'test content',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
});
