const ThreadsTableTestHelper =
    require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper =
    require('../../../../tests/UsersTableTestHelper');
const CommentsTableHelper =
    require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewComment =
    require('../../../Domains/comments/entities/NewComment');
const AddedComment =
    require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist new comment', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });

      const newComment = new NewComment({
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository =
          new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepository.addComment(newComment);

      const thread = await CommentsTableHelper.findCommentById('comments-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added comment', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });

      const newComment = new NewComment({
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository =
          new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepository.addComment(newComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comments-123',
        content: 'test content',
        owner: 'users-123',
      }));
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return empty array if no comments', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepository
          .getCommentsByThreadId('threads-123');

      expect(comments).toHaveLength(0);
    });

    it('should return comments if there are comments', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-1',
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-2',
        content: 'test content',
        threadId: 'threads-123',
        owner: 'users-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // sorted by cration time desc
      const expectedFirstComment = new AddedComment({
        id: 'comments-2',
        content: 'test content',
        owner: 'users-123',
      });

      const expectedSecondComment = new AddedComment({
        id: 'comments-1',
        content: 'test content',
        owner: 'users-123',
      });

      const comments = await commentRepositoryPostgres
          .getCommentsByThreadId('threads-123');

      expect(comments).toHaveLength(2);
      expect(comments[0]).toStrictEqual(expectedFirstComment);
      expect(comments[1]).toStrictEqual(expectedSecondComment);
    });
  });

  describe('deleteCommentById', () => {
    it('should throw NotFoundError if comment not found', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepository.deleteCommentById('comments-123'))
          .rejects.toThrow(NotFoundError);
    });

    it('should delete comment if found', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-123',
        threadId: 'threads-123',
        owner: 'users-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById('comments-123');

      const comments = await CommentsTableHelper
          .findCommentById('comments-123');
      expect(comments).toHaveLength(0);
    });
  });
});
