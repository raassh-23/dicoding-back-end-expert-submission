const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator =
    require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: jwt,
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: [process.env.ACCESS_TOKEN_KEY],
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {container},
    },
    {
      plugin: authentications,
      options: {container},
    },
    {
      plugin: threads,
      options: {container},
    },
    {
      plugin: comments,
      options: {container},
    },
    {
      plugin: replies,
      options: {container},
    },
  ]);

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      message: 'hello world',
    }),
  });

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      let status = 'error';
      let statusCode = 500;
      let message = 'there is something wrong with server';

      if (translatedError instanceof ClientError) {
        status = 'fail';
        statusCode = translatedError.statusCode;
        message = translatedError.message;
      } else if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status,
        message,
      });
      newResponse.code(statusCode);

      return newResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
