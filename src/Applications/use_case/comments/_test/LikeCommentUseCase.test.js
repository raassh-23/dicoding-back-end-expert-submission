const ThreadRepository =
  require('../../../../Domains/threads/ThreadRepository');
const CommentRepository =
  require('../../../../Domains/comments/CommentRepository');
const LikeRepository =
  require('../../../../Domains/likes/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating add like to comment action correctly ' +
    'if user have not liked a comment', async () => {
    const threadId = 'threads-123';
    const commentId = 'comments-123';
    const owner = 'users-123';

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockLikeRepo = new LikeRepository();

    mockThreadRepo.verifyThreadExistsById = jest.fn(() => Promise.resolve());
    mockCommentRepo.verifyCommentExistsById = jest.fn(() => Promise.resolve());
    mockLikeRepo.verifyLikeExists = jest.fn(() => Promise.resolve(false));
    mockLikeRepo.addLikeToComment = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeCommentUseCase
        .execute(threadId, commentId, owner);

    expect(mockThreadRepo.verifyThreadExistsById)
        .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepo.verifyCommentExistsById)
        .toHaveBeenCalledWith(commentId);
    expect(mockLikeRepo.verifyLikeExists)
        .toHaveBeenCalledWith(commentId, owner);
    expect(mockLikeRepo.addLikeToComment)
        .toHaveBeenCalledWith(commentId, owner);
  });

  it('should orchestrating remove like from comment action correctly ' +
    'if user have liked a comment', async () => {
    const threadId = 'threads-123';
    const commentId = 'comments-123';
    const owner = 'users-123';

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockLikeRepo = new LikeRepository();

    mockThreadRepo.verifyThreadExistsById = jest.fn(() => Promise.resolve());
    mockCommentRepo.verifyCommentExistsById = jest.fn(() => Promise.resolve());
    mockLikeRepo.verifyLikeExists = jest.fn(() => Promise.resolve(true));
    mockLikeRepo.removeLikeFromComment = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeCommentUseCase
        .execute(threadId, commentId, owner);

    expect(mockThreadRepo.verifyThreadExistsById)
        .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepo.verifyCommentExistsById)
        .toHaveBeenCalledWith(commentId);
    expect(mockLikeRepo.verifyLikeExists)
        .toHaveBeenCalledWith(commentId, owner);
    expect(mockLikeRepo.removeLikeFromComment)
        .toHaveBeenCalledWith(commentId, owner);
  });
});
