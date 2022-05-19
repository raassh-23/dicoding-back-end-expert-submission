/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableHelper = {
  async addUser({
    id = 'users-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: `INSERT INTO users (id, username, password, fullname) 
              VALUES ($1, $2, $3, $4)`,
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUserById(id) {
    const query = {
      text: `SELECT * FROM users WHERE id = $1`,
      values: [id],
    };

    const {rows} = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users CASCADE');
  },
};

module.exports = UsersTableHelper;
