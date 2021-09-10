import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Ivan Bitu',
      email: 'ivanbbj@gmail.com',
      password: '1234356'
    });

    const response = await authenticateUser.execute({
      email: 'ivanbbj@gmail.com',
      password: '1234356'
    })

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate with no existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'ivanbbj@gmail.com',
        password: '1234356'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Ivan Bitu',
      email: 'ivanbbj@gmail.com',
      password: '1234356'
    });

    await expect(
      authenticateUser.execute({
        email: 'ivanbbj@gmail.com',
        password: 'wrong-paassword'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});