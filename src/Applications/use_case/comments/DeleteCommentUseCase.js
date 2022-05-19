class DeleteCommentUseCase {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, userId, threadId) {
    await this._commentRepository.verifyComment(commentId, userId, threadId);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
