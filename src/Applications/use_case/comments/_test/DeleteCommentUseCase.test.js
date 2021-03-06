const CommentRepository =
    require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const threadId = 'threads-123';
    const userId = 'users-123';
    const commentId = 'comments-123';

    const mockCommentRepo = new CommentRepository();

    mockCommentRepo.deleteCommentById = jest.fn(() => Promise.resolve());
    mockCommentRepo.verifyComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepo,
    });

    await deleteCommentUseCase
        .execute(commentId, userId, threadId);

    expect(mockCommentRepo.verifyComment)
        .toBeCalledWith(commentId, userId, threadId);
    expect(mockCommentRepo.deleteCommentById)
        .toBeCalledWith(commentId);
  });
});
