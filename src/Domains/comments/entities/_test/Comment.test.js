const Comment = require('../Comment');

describe('A Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comments-123',
      content: 'test title',
      username: 'test username',
    };

    expect(() => new Comment(payload))
        .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload = {
      id: ['comments-123'],
      content: 123,
      username: true,
      date: 321,
      deleted: 'false',
    };

    expect(() => new Comment(payload))
        .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly when not deleted', () => {
    const payload = {
      id: 'comments-123',
      content: 'test title',
      username: 'test username',
      date: 'test date',
      deleted: false,
    };

    const {id, content, username, date} = new Comment(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe(payload.content);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
  });

  it('should create Comment object correctly when deleted', () => {
    const payload = {
      id: 'comments-123',
      content: 'test title',
      username: 'test username',
      date: 'test date',
      deleted: true,
    };

    const {id, content, username, date} = new Comment(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe('**komentar telah dihapus**');
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
  });
});
