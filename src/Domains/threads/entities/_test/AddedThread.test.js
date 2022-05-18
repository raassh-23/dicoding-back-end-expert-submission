const AddedThread = require('../AddedThread');

describe('A AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'test',
    };

    expect(() => new AddedThread(payload))
        .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      id: [],
      title: 123,
      owner: true,
    };

    expect(() => new AddedThread(payload))
        .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'test',
      owner: 'users-123',
    };

    const {id, title, owner} = new AddedThread(payload);

    expect(id).toBe(payload.id);
    expect(title).toBe(payload.title);
    expect(owner).toBe(payload.owner);
  });
});
