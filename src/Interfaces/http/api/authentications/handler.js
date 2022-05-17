const LoginUserUseCase = require(
    '../../../../Applications/use_case/authentications/LoginUserUseCase',
);
const RefreshAuthenticationUseCase = require(
    '../../../../Applications/use_case/authentications' +
    '/RefreshAuthenticationUseCase',
);
const LogoutUserUseCase = require(
    '../../../../Applications/use_case/authentications/LogoutUserUseCase',
);

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this
        .deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler({payload}, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const {accessToken, refreshToken} = await loginUserUseCase
        .execute(payload);

    return h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthenticationHandler({payload}) {
    const refreshAuthenticationUseCase = this._container
        .getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase
        .execute(payload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler({payload}) {
    const logoutUserUseCase = this._container
        .getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
