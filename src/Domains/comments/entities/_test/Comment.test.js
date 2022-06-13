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
    const payload1 = {
      id: ['comments-123'],
      content: 123,
      username: true,
      date: 321,
      deleted: 'false',
    };

    const payload2 = {
      id: 'test',
      content: 'test',
      username: 'test',
      date: 'test',
      deleted: false,
      replies: {},
    };

    const payload3 = {
      id: 'test',
      content: 'test',
      username: 'test',
      date: 'test',
      deleted: false,
      replies: ['test'],
    };

    expect(() => new Comment(payload1))
        .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload2))
        .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload3))
        .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly when ' +
      'not deleted and replies empty', () => {
    const payload = {
      id: 'comments-123',
      content: 'test title',
      username: 'test username',
      date: 'test date',
      deleted: false,
    };

    const {id, content, username, date, replies} = new Comment(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe(payload.content);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
    expect(replies).toStrictEqual([]);
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

  it('should create Comment object correctly when replies not empty', () => {
    const payload = {
      id: 'comments-123',
      content: 'test title',
      username: 'test username',
      date: 'test date',
      deleted: false,
      replies: [
        {
          id: 'reply-123',
          content: 'test reply',
          username: 'test username',
          date: 'test date',
        },
      ],
    };

    const {id, content, username, date, replies} = new Comment(payload);

    expect(id).toBe(payload.id);
    expect(content).toBe(payload.content);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
    expect(replies).toStrictEqual(payload.replies);
  });
});
