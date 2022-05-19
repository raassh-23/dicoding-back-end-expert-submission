/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableHelper = {
  async addComment({
    id = 'comments-123',
    content = 'test content',
    threadId = 'threads-123',
    owner = 'users-123',
    date = '2022-05-18T15:26:50.713Z',
    deleted = false,
  }) {
    const query = {
      text: `INSERT INTO comments (id, content, thread_id, owner, date, deleted)
              VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [id, content, threadId, owner, date, deleted],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments CASCADE');
  },
};

module.exports = CommentsTableHelper;
