const NewReply = require('../NewReply');

describe('A NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'test title',
      threadId: 'threads-123',
      commentId: 'comments-123',
    };

    expect(() => new NewReply(payload))
        .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      content: 123,
      threadId: {},
      commentId: [],
      owner: true,
    };

    expect(() => new NewReply(payload))
        .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    const payload = {
      content: 'test title',
      threadId: 'threads-123',
      commentId: 'comments-123',
      owner: 'users-123',
    };

    const {content, threadId, commentId, owner} = new NewReply(payload);

    expect(content).toBe(payload.content);
    expect(threadId).toBe(payload.threadId);
    expect(commentId).toBe(payload.commentId);
    expect(owner).toBe(payload.owner);
  });
});
