/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableHelper = {
  async addLike({
    commentId = 'comment-123',
    owner = 'users-123',
  }) {
    const query = {
      text: `INSERT INTO likes (comment_id, owner)
              VALUES ($1, $2)`,
      values: [commentId, owner],
    };

    await pool.query(query);
  },

  async findLikeByCommentAndOwner(commentId, owner) {
    const query = {
      text: `SELECT * FROM likes WHERE comment_id = $1 AND owner = $2`,
      values: [commentId, owner],
    };

    const {rows} = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE likes CASCADE');
  },
};

module.exports = CommentsTableHelper;
