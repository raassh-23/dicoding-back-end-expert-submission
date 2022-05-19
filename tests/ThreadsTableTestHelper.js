/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableHelper = {
  async addThread({
    id = 'threads-123',
    title = 'test title',
    body = 'test body',
    owner = 'users-123',
    date = '2022-05-18T15:26:50.713Z',
  }) {
    const query = {
      text: `INSERT INTO threads (id, title, body, owner, date)
              VALUES ($1, $2, $3, $4, $5)`,
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: `SELECT * FROM threads WHERE id = $1`,
      values: [id],
    };

    const {rows} = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads CASCADE');
  },
};

module.exports = ThreadsTableHelper;
