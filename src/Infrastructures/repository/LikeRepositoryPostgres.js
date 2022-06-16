const LikeRepository =
    require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyLikeExists(commentId, owner) {}

  async addLikeToComment(commentId, owner) {}

  async removeLikeFromComment(commentId, owner) {}
}

module.exports = LikeRepositoryPostgres;
