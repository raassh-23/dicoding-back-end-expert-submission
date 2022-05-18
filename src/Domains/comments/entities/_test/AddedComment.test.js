const AddedComment = require('../AddedComment');

describe('A AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comments-123',
      content: 'test title',
    };

    expect(() => new AddedComment(payload))
        .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      id: ['comments-123'],
      content: 123,
      owner: true,
    };

    expect(() => new AddedComment(payload))
        .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    const payload = {
      id: 'comments-123',
      content: 'test title',
      owner: 'users-123',
    };

    const {id, content, owner} = new AddedComment(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe(payload.content);
    expect(owner).toBe(payload.owner);
  });
});
