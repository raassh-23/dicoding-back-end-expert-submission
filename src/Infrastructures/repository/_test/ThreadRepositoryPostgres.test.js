const ThreadsTableTestHelper =
    require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper =
    require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread =
    require('../../../Domains/threads/entities/NewThread');
const AddedThread =
    require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const Thread = require('../../../Domains/threads/entities/Thread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist new thread', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});

      const newThread = new NewThread({
        title: 'test title',
        body: 'test body',
        owner: 'users-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepository =
          new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepository.addThread(newThread);

      const thread = await ThreadsTableTestHelper.findThreadById('threads-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});

      const newThread = new NewThread({
        title: 'test title',
        body: 'test body',
        owner: 'users-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository =
          new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addThread = await threadRepository.addThread(newThread);

      expect(addThread).toStrictEqual(new AddedThread({
        id: 'threads-123',
        title: 'test title',
        owner: 'users-123',
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      return expect(threadRepositoryPostgres.getThreadById('threads-123'))
          .rejects.toThrowError(NotFoundError);
    });

    it('should return thread when thread is found', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123', username: 'user'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const expectedThread = new Thread({
        id: 'threads-123',
        title: 'test title',
        body: 'test body',
        username: 'user',
        date: '2022-05-18T15:26:50.713Z',
      });

      const thread = await threadRepositoryPostgres
          .getThreadById('threads-123');
      expect(thread).toStrictEqual(expectedThread);
    });
  });

  describe('verifyThreadExistsById', () => {
    it('should throw NotFoundError when id does not exists', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepository.verifyThreadExistsById('threads-123'))
          .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when id exists', async () => {
      await UsersTableTestHelper.addUser({id: 'users-123'});
      await ThreadsTableTestHelper.addThread({
        id: 'threads-123',
        owner: 'users-123',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepository.verifyThreadExistsById('threads-123'))
          .resolves.not.toThrow(NotFoundError);
    });
  });
});
