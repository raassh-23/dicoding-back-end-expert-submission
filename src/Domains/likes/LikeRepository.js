class LikeRepository {
  async verifyLikeExists(_commentId, _owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addLikeToComment(_commentId, _owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async removeLikeFromComment(_commentId, _owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
};

module.exports = LikeRepository;
