const LikeRepository =
    require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async verifyLikeExists(commentId, owner) {
    const query = {
      text: `SELECT * FROM likes WHERE comment_id = $1 AND owner = $2`,
      values: [commentId, owner],
    };

    const {rows} = await this._pool.query(query);

    return rows.length > 0;
  }

  async addLikeToComment(commentId, owner) {
    const query = {
      text: `INSERT INTO likes (comment_id, owner)
              VALUES ($1, $2)`,
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async removeLikeFromComment(commentId, owner) {
    const query = {
      text: `DELETE FROM likes WHERE comment_id = $1 AND owner = $2`,
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
