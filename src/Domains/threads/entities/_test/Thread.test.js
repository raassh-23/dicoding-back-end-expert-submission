const Comment = require('../../../comments/entities/Comment');
const Thread = require('../Thread');

describe('A Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'test',
      body: 'test',
      username: 'test',
    };

    expect(() => new Thread(payload))
        .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload ' +
  'did not meet data type specification', () => {
    const payload1 = {
      id: [],
      title: 123,
      body: true,
      username: false,
      date: 321,
    };

    const payload2 = {
      id: 'test',
      title: 'test',
      body: 'test',
      username: 'test',
      date: 'test',
      comments: {},
    };

    const payload3 = {
      id: 'test',
      title: 'test',
      body: 'test',
      username: 'test',
      date: 'test',
      comments: ['test'],
    };

    expect(() => new Thread(payload1))
        .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload2))
        .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload3))
        .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread object correctly when comments empty', () => {
    const payload = {
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      username: 'test username',
      date: 'test date',
    };

    const {id, title, body, username, date, comments} = new Thread(payload);

    expect(id).toBe(payload.id);
    expect(title).toBe(payload.title);
    expect(body).toBe(payload.body);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
    expect(comments).toEqual([]);
  });

  it('should create Thread object correctly when comments not empty', () => {
    const payload = {
      id: 'thread-123',
      title: 'test title',
      body: 'test body',
      username: 'test username',
      date: 'test date',
      comments: [
        new Comment({
          id: 'comments-123',
          content: 'test title',
          username: 'test username',
          date: 'test date',
          deleted: false,
        }),
        new Comment({
          id: 'comments-456',
          content: 'test title',
          username: 'test username',
          date: 'test date',
          deleted: true,
        }),
      ],
    };

    const {id, title, body, username, date, comments} = new Thread(payload);

    expect(id).toBe(payload.id);
    expect(title).toBe(payload.title);
    expect(body).toBe(payload.body);
    expect(username).toBe(payload.username);
    expect(date).toBe(payload.date);
    expect(comments).toStrictEqual(payload.comments);
  });
});
