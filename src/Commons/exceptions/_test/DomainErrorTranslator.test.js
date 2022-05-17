const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator
        .translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
        .toStrictEqual(new InvariantError(
            'can not create user because needed property is missing',
        ));
    expect(DomainErrorTranslator
        .translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
        .toStrictEqual(new InvariantError(
            'can not create user because data specification is not met',
        ));
    expect(DomainErrorTranslator
        .translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
        .toStrictEqual(new InvariantError(
            'can not create user because username exceed 50 characters',
        ));
    expect(DomainErrorTranslator
        .translate(new Error(
            'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
        )))
        .toStrictEqual(new InvariantError(
            'can not create user because ' +
            'username have restricted characters',
        ));
  });

  it('should return original error when translation was not needed', () => {
    const errpr = new Error('random_error_message');

    const translatedError = DomainErrorTranslator.translate(errpr);

    expect(translatedError).toStrictEqual(errpr);
  });
});
