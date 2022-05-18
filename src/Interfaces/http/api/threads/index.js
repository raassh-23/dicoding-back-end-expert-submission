const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, {container}) => {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};
