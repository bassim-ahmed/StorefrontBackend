import app from '../../server';
import { User } from '../../models/user';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret_token = process.env.SECRET_TOKEN as unknown as string;

const request = supertest(app);

describe('- User Handler:', () => {
  let user_id: number;
  let token: string;
  const user: User = {
    username: 'mari',
    first_name: 'Mariela',
    last_name: 'Del Barrio',
    password: 'oculto'
  };

  it('Create a user', async () => {
    const response = await request.post('/users').send(user);
    expect(response.status).toBe(201);
    token = response.body;

    const decoded = jwt.verify(token, secret_token) as User;
    user_id = decoded.id as unknown as number;
  });

  it('Get all users', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    const users = response.body as User[];
    expect(users[0]).toBeTruthy();
  });

  it('Show user by id', async () => {
    const response = await request
      .get(`/users/${user_id}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    const user_1 = response.body as User;
    expect(user_1.id).toEqual(user_id);
  });

  it('Update user with id', async () => {
    const update_user: User = {
      id: user_id,
      username: 'mari',
      first_name: 'Mariela',
      last_name: 'Del Barrio Fernandez'
    };
    const response = await request
      .put(`/users/${update_user.id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(update_user);
    expect(response.status).toBe(200);
    const user_1 = response.body as User;
    expect(user_1.last_name).toEqual('Del Barrio Fernandez');
  });

  it('Block update if id does not match token', async () => {
    const update_user: User = {
      id: user_id + 1,
      username: 'mari',
      first_name: 'Mariela',
      last_name: 'Del Barrio Fernandez'
    };
    const response = await request
      .put(`/users/${update_user.id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(update_user);
    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('Unauthorized');
  });

  it('Authenticate password and verify token', async () => {
    const response = await request.post('/users/authenticate').send(user);
    expect(response.status).toBe(200);
    const res_token = response.body;
    const decoded = jwt.verify(res_token, secret_token) as User;
    expect(decoded.username).toBe(user.username);
  });

  it('Delete user by id', async () => {
    const response = await request
      .delete(`/users/${user_id}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    const user_1 = response.body as User;
    expect(user_1.id).toEqual(user_id);
  });
});
