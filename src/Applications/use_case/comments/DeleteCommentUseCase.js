class DeleteCommentUseCase {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }

  async execute(payload, userId, threadId) {
    await this._commentRepository.verifyComment(payload, userId, threadId);
    await this._commentRepository.deleteCommentById(payload);
  }
}

module.exports = DeleteCommentUseCase;
