import { User, UserStore } from '../user';

const store = new UserStore();

describe('- User Model Tests', () => {
  let user_id: number;
  const user: User = {
    username: 'juanpe',
    first_name: 'Juan',
    last_name: 'Perez',
    password: 'password'
  };

  it('Should create a user with correct name', async () => {
    const newUser = await store.create(user);
    expect(newUser.username).toBe(user.username);
    expect(newUser.first_name).toBe(user.first_name);
    expect(newUser.last_name).toBe(user.last_name);
    user_id = newUser.id as number;
  });

  it('Index should return at least 1 user (we just created 1)', async () => {
    const users = await store.index();
    expect(users[0]).toBeTruthy();
  });

  it('Accept right password', async () => {
    await expectAsync(store.authenticate(user)).toBeResolved();
  });

  it('Reject wrong password', async () => {
    const log_user: User = {
      username: 'juanpe',
      first_name: 'Juan',
      last_name: 'Perez',
      password: 'pa$$word'
    };
    await expectAsync(store.authenticate(log_user)).toBeRejected();
  });

  it('Show user', async () => {
    const user = await store.show(user_id);
    expect(user.id).toBe(user_id);
  });

  it('Update user', async () => {
    const update_user: User = {
      id: user_id,
      username: 'juanpe',
      first_name: 'Victoria',
      last_name: 'Sosa'
    };
    const newUser = await store.update(update_user);
    expect([newUser.first_name, newUser.last_name]).toEqual([
      'Victoria',
      'Sosa'
    ]);
  });

  it('Delete user', async () => {
    const user = await store.delete(user_id);
    expect(user.id).toBe(user_id);
  });
});
