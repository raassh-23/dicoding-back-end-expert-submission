const ThreadsTableTestHelper =
    require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper =
    require('../../../../tests/UsersTableTestHelper');
const CommentsTableHelper =
    require('../../../../tests/CommentsTableTestHelper');
const RepliesTableHelper =
    require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError =
    require('../../../Commons/exceptions/AuthorizationError');
const NewReply =
    require('../../../Domains/replies/entities/NewReply');
const AddedReply =
    require('../../../Domains/replies/entities/AddedReply');
const Reply = require('../../../Domains/replies/entities/Reply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableHelper.cleanTable();
    await CommentsTableHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply', () => {
    it('should persist new reply', async () => {
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

      const newReply = new NewReply({
        content: 'test content',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepository =
          new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepository.addReply(newReply);

      const replies = await RepliesTableHelper.findReplyById('replies-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply', async () => {
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

      const newReply = new NewReply({
        content: 'test content',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepository =
          new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepository.addReply(newReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'replies-123',
        content: 'test content',
        owner: 'users-123',
      }));
    });
  });

  describe('getRepliesByCommentsId', () => {
    it('should return empty array if no replies', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepository
          .getRepliesByCommentsId(['comments-123']);

      expect(replies).toHaveLength(0);
    });

    it('should return replies with its comment id' +
    ' if there are replies', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123', username: 'user'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      await CommentsTableHelper.addComment({
        id: 'comments-123',
        threadId: 'threads-123',
        owner: 'users-123',
      });
      await RepliesTableHelper.addReply({
        id: 'replies-1',
        content: 'test content 1',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
        date: '2022-05-18T15:26:50.713Z',
      });
      await RepliesTableHelper.addReply({
        id: 'replies-2',
        content: 'test content 2',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
        date: '2022-05-18T15:27:50.713Z',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const expectedFirstReply = new Reply({
        id: 'replies-1',
        content: 'test content 1',
        username: 'user',
        date: '2022-05-18T15:26:50.713Z',
        deleted: false,
        comment_id: 'comments-123',
      });

      const expectedSecondReply = new Reply({
        id: 'replies-2',
        content: 'test content 2',
        username: 'user',
        date: '2022-05-18T15:27:50.713Z',
        deleted: false,
        comment_id: 'comments-123',
      });

      const replies = await replyRepositoryPostgres
          .getRepliesByCommentsId(['comments-123']);

      expect(replies).toHaveLength(2);
      expect(replies[0]).toStrictEqual(expectedFirstReply);
      expect(replies[1]).toStrictEqual(expectedSecondReply);
    });
  });

  describe('deleteReplyById', () => {
    it('should throw NotFoundError if reply not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository.deleteReplyById('replies-123'))
          .rejects.toThrow(NotFoundError);
    });

    it('should delete reply if found', async () => {
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
      await RepliesTableHelper.addReply({
        id: 'replies-123',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReplyById('replies-123');

      const replies = await RepliesTableHelper
          .findReplyById('replies-123');
      expect(replies[0].deleted).toEqual(true);
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw NotFoundError if reply not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository
          .verifyReply(
              'replies-123', 'users-123', 'threads-123', 'comments-123',
          ))
          .rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError if not the owner', async () => {
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
      await RepliesTableHelper.addReply({
        id: 'replies-123',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
      });

      const replyReposiotry = new ReplyRepositoryPostgres(pool, {});

      await expect(replyReposiotry
          .verifyReply(
              'replies-123', 'users-999', 'threads-123', 'comments-123',
          ))
          .rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError if thread not valid', async () => {
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
      await RepliesTableHelper.addReply({
        id: 'replies-123',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository
          .verifyReply(
              'replies-123', 'users-123', 'threads-999', 'comments-123',
          ))
          .rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if comment not valid', async () => {
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
      await RepliesTableHelper.addReply({
        id: 'replies-123',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository
          .verifyReply(
              'replies-123', 'users-123', 'threads-123', 'comments-999',
          ))
          .rejects.toThrow(NotFoundError);
    });

    it('should not throw any error ' +
        'if is the correct owner, thread, and comment', async () => {
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
      await RepliesTableHelper.addReply({
        id: 'replies-123',
        threadId: 'threads-123',
        commentId: 'comments-123',
        owner: 'users-123',
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepository
          .verifyReply(
              'replies-123', 'users-123', 'threads-123', 'comments-123',
          ))
          .resolves.not.toThrow();
    });
  });
});
