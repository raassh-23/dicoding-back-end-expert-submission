const AddedReply = require('../AddedReply');

describe('A AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'replies-123',
      content: 'test title',
    };

    expect(() => new AddedReply(payload))
        .toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      id: ['replies-123'],
      content: 123,
      owner: true,
    };

    expect(() => new AddedReply(payload))
        .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'replies-123',
      content: 'test content',
      owner: 'users-123',
    };

    const {id, content, owner} = new AddedReply(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe(payload.content);
    expect(owner).toBe(payload.owner);
  });
});
