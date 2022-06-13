const NewThread =
    require('../../../../Domains/threads/entities/NewThread');
const AddedThread =
    require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepository =
    require('../../../../Domains/threads/ThreadRepository');
const UserRepository =
    require('../../../../Domains/users/UserRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const newThreadPayload = {
      title: 'test title',
      body: 'test body',
    };

    const userId = 'users-123';

    const expected = new AddedThread({
      id: 'threads-123',
      title: newThreadPayload.title,
      owner: userId,
    });

    const mockThreadRepo = new ThreadRepository();
    const mockUserRepo = new UserRepository();

    mockThreadRepo.addThread = jest.fn(() => Promise.resolve(
        new AddedThread({
          id: 'threads-123',
          title: newThreadPayload.title,
          owner: userId,
        }),
    ));
    mockUserRepo.verifyUserExistsById = jest.fn(() => Promise.resolve());

    const addThreadUseCase = new AddThreadUseCase({
      userRepository: mockUserRepo,
      threadRepository: mockThreadRepo,
    });

    const addedThread = await addThreadUseCase
        .execute(newThreadPayload, userId);

    expect(addedThread).toStrictEqual(expected);
    expect(mockUserRepo.verifyUserExistsById)
        .toBeCalledWith(userId);
    expect(mockThreadRepo.addThread)
        .toBeCalledWith(new NewThread({
          title: newThreadPayload.title,
          body: newThreadPayload.body,
          owner: userId,
        }));
  });
});
