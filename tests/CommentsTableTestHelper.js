/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableHelper = {
  async addComment({
    id = 'comments-123',
    content = 'test content',
    threadId = 'threads-123',
    owner = 'users-123',
  }) {
    const query = {
      text: `INSERT INTO comments (id, content, thread_id, owner)
              VALUES ($1, $2, $3, $4)`,
      values: [id, content, threadId, owner],
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
