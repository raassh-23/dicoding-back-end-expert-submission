class LikeCommentUseCase {
  constructor({commentRepository, likeRepository}) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(commentId, owner) {
    await this._commentRepository.verifyCommentExistsById(commentId);
    const haveLiked = await this._likeRepository
        .verifyLikeExists(commentId, owner);

    return haveLiked ?
        this._likeRepository.removeLikeFromComment(commentId, owner) :
        this._likeRepository.addLike(commentId, owner);
  }
}

module.exports = LikeCommentUseCase;
