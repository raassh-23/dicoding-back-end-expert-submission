const AddReplyUseCase =
    require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase =
    require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler({payload, auth, params}, h) {
    const {credentials: {id: owner}} = auth;
    const {threadId, commentId} = params;

    const addReplyUseCase = this._container
        .getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase
        .execute(payload, threadId, commentId, owner);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(201);
  }

  async deleteReplyHandler({auth, params}) {
    const {credentials: {id: owner}} = auth;
    const {threadId, commentId, replyId} = params;

    const deleteReplyUseCase = this._container
        .getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(replyId, owner, threadId, commentId);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
