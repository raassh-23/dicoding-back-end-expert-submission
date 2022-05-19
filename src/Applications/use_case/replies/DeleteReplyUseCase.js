class DeleteReplyUseCase {
  constructor({replyRepository}) {
    this._replyRepository = replyRepository;
  }

  async execute(replyId, userId, threadId, commentId) {
    await this._replyRepository
        .verifyReply(replyId, userId, threadId, commentId);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
