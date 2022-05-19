class GetThreadUseCase {
  constructor({threadRepository, commentRepository, replyRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.comments = await this._commentRepository
        .getCommentsByThreadId(threadId);
    await Promise.all(thread.comments.map(async (comment) => {
      comment.replies = await this._replyRepository
          .getRepliesByCommentId(comment.id);
    }));

    return thread;
  }
}

module.exports = GetThreadUseCase;
