const CommentRepository =
  require('../../../../Domains/comments/CommentRepository');
const LikeRepository =
  require('../../../../Domains/likes/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating add like to comment action correctly' +
    'if user have not liked a comment', async () => {
    const owner = 'users-123';
    const commentId = 'comments-123';

    const mockCommentRepo = new CommentRepository();
    const mockLikeRepo = new LikeRepository();

    mockCommentRepo.verifyCommentExistsById = jest.fn(() => Promise.resolve());
    mockLikeRepo.verifyLikeExists = jest.fn(() => Promise.resolve(false));
    mockLikeRepo.addLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeCommentUseCase
        .execute(commentId, owner);

    expect(mockCommentRepo.verifyCommentExistsById)
        .toHaveBeenCalledWith(commentId);
    expect(mockLikeRepo.verifyLikeExists)
        .toHaveBeenCalledWith(commentId, owner);
    expect(mockLikeRepo.addLike)
        .toHaveBeenCalledWith(commentId, owner);
  });

  it('should orchestrating remove like from comment action correctly' +
    'if user have liked a comment', async () => {
    const owner = 'users-123';
    const commentId = 'comments-123';

    const mockCommentRepo = new CommentRepository();
    const mockLikeRepo = new LikeRepository();

    mockCommentRepo.verifyCommentExistsById = jest.fn(() => Promise.resolve());
    mockLikeRepo.verifyLikeExists = jest.fn(() => Promise.resolve(true));
    mockLikeRepo.removeLikeFromComment = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeCommentUseCase
        .execute(commentId, owner);

    expect(mockCommentRepo.verifyCommentExistsById)
        .toHaveBeenCalledWith(commentId);
    expect(mockLikeRepo.verifyLikeExists)
        .toHaveBeenCalledWith(commentId, owner);
    expect(mockLikeRepo.removeLikeFromComment)
        .toHaveBeenCalledWith(commentId, owner);
  });
});
