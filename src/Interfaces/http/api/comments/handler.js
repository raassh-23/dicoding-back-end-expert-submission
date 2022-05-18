const AddCommentUseCase =
    require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase =
    require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler({payload, auth, params}, h) {
    const {credentials: {id: owner}} = auth;
    const {threadId} = params;

    const addCommentUseCase = this._container
        .getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase
        .execute(payload, threadId, owner);

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(201);
  }

  async deleteCommentHandler({auth, params}, h) {
    const {credentials: {id: owner}} = auth;
    const {threadId, commentId} = params;

    const deleteCommentUseCase = this._container
        .getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(commentId, owner, threadId);

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = CommentsHandler;
