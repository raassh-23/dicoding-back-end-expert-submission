class LikeCommentUseCase {
  constructor({threadRepository, commentRepository, likeRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyThreadExistsById(threadId);
    await this._commentRepository.verifyCommentExistsById(commentId);
    const haveLiked = await this._likeRepository
        .verifyLikeExists(commentId, owner);

    return haveLiked ?
        this._likeRepository.removeLikeFromComment(commentId, owner) :
        this._likeRepository.addLike(commentId, owner);
  }
}

module.exports = LikeCommentUseCase;
