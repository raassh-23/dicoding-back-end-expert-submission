const Hapi = require('@hapi/hapi');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator =
    require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
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
  ]);

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
