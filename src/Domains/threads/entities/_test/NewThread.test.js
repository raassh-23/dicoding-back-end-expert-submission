const NewThread = require('../NewThread');

describe('A NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'test title',
      body: 'test body',
    };

    expect(() => new NewThread(payload))
        .toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: true,
      owner: {},
    };

    expect(() => new NewThread(payload))
        .toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'test title',
      body: 'test body',
      owner: 'users-123',
    };

    const {title, body, owner} = new NewThread(payload);

    expect(title).toBe(payload.title);
    expect(body).toBe(payload.body);
    expect(owner).toBe(payload.owner);
  });
});
