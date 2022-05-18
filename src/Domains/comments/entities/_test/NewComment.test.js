const NewComment = require('../NewComment');

describe('A NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'test title',
      threadId: 'threads-123',
    };

    expect(() => new NewComment(payload))
        .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      content: 123,
      threadId: {},
      owner: true,
    };

    expect(() => new NewComment(payload))
        .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'test title',
      threadId: 'threads-123',
      owner: 'users-123',
    };

    const {content, threadId, owner} = new NewComment(payload);

    expect(content).toBe(payload.content);
    expect(threadId).toBe(payload.threadId);
    expect(owner).toBe(payload.owner);
  });
});
