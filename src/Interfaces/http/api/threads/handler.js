const AddThreadUseCase =
  require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetThreadUseCase =
  require('../../../../Applications/use_case/threads/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler({payload, auth}, h) {
    const {credentials: {id: owner}} = auth;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(payload, owner);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

  async getThreadHandler({params}) {
    const {threadId} = params;

    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
