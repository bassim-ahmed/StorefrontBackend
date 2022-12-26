import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const store = new UserStore();
const secret_token = process.env.SECRET_TOKEN as unknown as string;

const create = async (req: Request, res: Response) => {
  try {
    const user = req.body as User;
    const newUser = await store.create(user);
    const token = jwt.sign(newUser, secret_token);
    if (newUser) {
      res.status(201).json(token);
    } else {
      res.status(400).json({ error: 'User was not created' });
    }
  } catch (err) {
    res.status(400).json({ error: `User was not created: ${err}` });
  }
};

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: `Could not get users: ${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    if (req.params.id != res.locals.user.id) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const id = req.params.id as unknown as number;
    const user = await store.show(id);
    delete user.password_hash;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: `Could not get user: ${err}` });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    if (req.params.id != res.locals.user.id) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const user = req.body as User;
    const updatedUser = await store.update(user);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: `Could not update user: ${err}` });
  }
};

const del = async (req: Request, res: Response) => {
  try {
    if (req.params.id != res.locals.user.id) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const id = req.params.id as unknown as number;
    const deletedUser = await store.delete(id);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: `Could not delete user: ${err}` });
  }
};

const authenticatePassword = async (req: Request, res: Response) => {
  try {
    const req_user = req.body as User;
    const user = await store.authenticate(req_user);
    if (user) {
      const token = jwt.sign(user, secret_token);
      res.status(200).json(token);
    } else {
      res.status(400).json({ error: 'User was not authenticated' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not authenticate user: ${err}` });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers.authorization as string;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, secret_token) as User;

    res.locals.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: `Invalid token: ${err}` });
  }
};

const userRoutes = (app: express.Application) => {
  app.post('/users', create);
  app.get('/users', verifyToken, index);
  app.get('/users/:id', verifyToken, show);
  app.put('/users/:id', verifyToken, update);
  app.delete('/users/:id', verifyToken, del);
  app.post('/users/authenticate', authenticatePassword);
};

export default userRoutes;
