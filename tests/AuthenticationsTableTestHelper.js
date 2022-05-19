/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableHelper = {
  async addToken(token) {
    const query = {
      text: `INSERT INTO authentications (token) VALUES ($1)`,
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: `SELECT * FROM authentications WHERE token = $1`,
      values: [token],
    };

    const {rows} = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE authentications');
  },
};

module.exports = AuthenticationsTableHelper;
