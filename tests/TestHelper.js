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

module.exports = {registerAndLogin};
