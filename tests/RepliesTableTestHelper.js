/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableHelper = {
  async addReply({
    id = 'replies-123',
    content = 'test content',
    threadId = 'threads-123',
    commentId = 'comments-123',
    owner = 'users-123',
    date = '2022-05-18T15:26:50.713Z',
    deleted = false,
  }) {
    const query = {
      text: `INSERT INTO replies (id, content, thread_id,
              comment_id, owner, date, deleted)
              VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      values: [id, content, threadId, commentId, owner, date, deleted],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: `SELECT * FROM replies WHERE id = $1`,
      values: [id],
    };

    const {rows} = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies CASCADE');
  },
};

module.exports = RepliesTableHelper;
