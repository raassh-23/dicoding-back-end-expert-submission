class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.deleted === true ?
        '**komentar telah dihapus**' : payload.content;
    this.username = payload.username;
    this.date = payload.date;
    this.replies = payload.replies || [];
    this.likeCount = Number(payload.like_count);
  }

  _verifyPayload(payload) {
    const {
      id, content, username, date,
      deleted, replies, like_count: likeCount,
    } = payload;

    if (id == null || content == null || username == null ||
        date == null || deleted == null || likeCount == null) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' ||
        typeof username !== 'string' || typeof date !== 'string' ||
        typeof deleted !== 'boolean' ||
        (Array.isArray(likeCount) || Number.isNaN(likeCount))) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (replies != null) {
      if (!Array.isArray(replies)) {
        throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }

      replies.forEach((reply) => {
        if (reply.id == null || reply.content == null ||
            reply.username == null || reply.date == null) {
          throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
      });
    }
  }
}

module.exports = Comment;
