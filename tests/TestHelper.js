/* istanbul ignore file */
const registerAndLogin = async (server) => {
  // register user
  await server.inject({
    method: 'POST',
    url: '/users',
    payload: {
      username: 'testuser',
      password: 'passpass',
      fullname: 'Test User',
    },
  });

  // login user
  const loginResponse = await server.inject({
    method: 'POST',
    url: '/authentications',
    payload: {
      username: 'testuser',
      password: 'passpass',
    },
  });

  const {data: {accessToken}} = JSON.parse(loginResponse.payload);

  return accessToken;
};

const addThreadWithToken = async (server, accessToken) => {
  const response = await server.inject({
    method: 'POST',
    url: '/threads',
    payload: {
      title: 'test title',
      body: 'test body',
    },
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const {data: {addedThread: {id}}} = JSON.parse(response.payload);

  return id;
};

module.exports = {
  registerAndLogin,
  addThreadWithToken,
};
