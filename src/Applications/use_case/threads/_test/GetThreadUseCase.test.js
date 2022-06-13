const Thread =
    require('../../../../Domains/threads/entities/Thread');
const Comment =
    require('../../../../Domains/comments/entities/Comment');
const ThreadRepository =
    require('../../../../Domains/threads/ThreadRepository');
const CommentRepository =
    require('../../../../Domains/comments/CommentRepository');
const ReplyRepository =
    require('../../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const Reply = require('../../../../Domains/replies/entities/Reply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'threads-123';

    const expected = new Thread({
      id: threadId,
      title: 'test title',
      body: 'test body',
      username: 'user',
      date: 'test date',
      comments: [
        new Comment({
          id: 'comments-123',
          content: 'test comment body',
          username: 'user1',
          date: 'test date1',
          deleted: false,
          replies: [
            new Reply({
              id: 'replies-123',
              content: 'test reply body',
              username: 'user2',
              date: 'test date2',
              deleted: false,
              comment_id: 'comments-123',
            }).toJson(),
            new Reply({
              id: 'replies-456',
              content: 'test reply body',
              username: 'user2',
              date: 'test date2',
              deleted: true,
              comment_id: 'comments-123',
            }).toJson(),
          ],
        }),
        new Comment({
          id: 'comments-456',
          content: 'test comment body 2',
          username: 'user2',
          date: 'test date2',
          deleted: true,
          replies: [
            new Reply({
              id: 'replies-123',
              content: 'test reply body',
              username: 'user2',
              date: 'test date2',
              deleted: false,
              comment_id: 'comments-456',
            }).toJson(),
            new Reply({
              id: 'replies-456',
              content: 'test reply body',
              username: 'user2',
              date: 'test date2',
              deleted: true,
              comment_id: 'comments-456',
            }).toJson(),
          ],
        }),
      ],
    });

    const mockThreadRepo = new ThreadRepository();
    const mockCommentRepo = new CommentRepository();
    const mockReplyRepo = new ReplyRepository();

    mockThreadRepo.getThreadById = jest.fn(() => Promise.resolve(
        new Thread({
          id: threadId,
          title: 'test title',
          body: 'test body',
          username: 'user',
          date: 'test date',
        }),
    ));
    mockCommentRepo.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      new Comment({
        id: 'comments-123',
        content: 'test comment body',
        username: 'user1',
        date: 'test date1',
        deleted: false,
      }),
      new Comment({
        id: 'comments-456',
        content: 'test comment body 2',
        username: 'user2',
        date: 'test date2',
        deleted: true,
      }),
    ]));
    mockReplyRepo.getRepliesByCommentsId = jest.fn(() => Promise.resolve([
      new Reply({
        id: 'replies-123',
        content: 'test reply body',
        username: 'user2',
        date: 'test date2',
        deleted: false,
        comment_id: 'comments-123',
      }),
      new Reply({
        id: 'replies-456',
        content: 'test reply body',
        username: 'user2',
        date: 'test date2',
        deleted: true,
        comment_id: 'comments-123',
      }),
      new Reply({
        id: 'replies-123',
        content: 'test reply body',
        username: 'user2',
        date: 'test date2',
        deleted: false,
        comment_id: 'comments-456',
      }),
      new Reply({
        id: 'replies-456',
        content: 'test reply body',
        username: 'user2',
        date: 'test date2',
        deleted: true,
        comment_id: 'comments-456',
      }),
    ]));


    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });

    const getThread = await getThreadUseCase
        .execute(threadId);

    expect(getThread).toStrictEqual(expected);
    expect(mockThreadRepo.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepo.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepo.getRepliesByCommentsId).toBeCalledTimes(1);
    expect(mockReplyRepo.getRepliesByCommentsId)
        .toBeCalledWith(['comments-123', 'comments-456']);
  });
});
