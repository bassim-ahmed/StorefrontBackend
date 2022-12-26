import express, { Request, Response } from 'express';
import { Order, OrderProduct, OrderStore } from '../models/order';
import { verifyToken } from './user';

const store = new OrderStore();

const create = async (req: Request, res: Response) => {
  try {
    const order = req.body as Order;
    const newOrder = await store.create(order);
    if (newOrder) {
      res.status(201).json(newOrder);
    } else {
      res.status(400).json({ error: 'Could not create order' });
    }
  } catch (err) {
    res.status(500).json({ error: `Order was not created: ${err}` });
  }
};

const index = async (req: Request, res: Response) => {
  try {
    const orders = await store.index();
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(400).json({ error: 'Could not get orders' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not get orders: ${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const order = await store.show(id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(400).json({ error: 'Could not get order' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not get order: ${err}` });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const order = req.body as Order;
    const updatedOrder = await store.update(order);
    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(400).json({ error: 'Could not update order' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not update order: ${err}` });
  }
};

const del = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const deletedOrder = await store.delete(id);
    if (deletedOrder) {
      res.status(200).json(deletedOrder);
    } else {
      res.status(400).json({ error: 'Could not delete order' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not delete order: ${err}` });
  }
};

const currentOrder = async (req: Request, res: Response) => {
  try {
    if (req.params.id != res.locals.user.id) {
      res
        .status(401)
        .json({ error: 'You are not authorized to retrieve this order' });
    }
    const user_id = req.params.id as unknown as number;
    const orders = await store.currentOrder(user_id);
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(400).json({ error: 'Could not get orders' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not get orders: ${err}` });
  }
};

const completedOrders = async (req: Request, res: Response) => {
  try {
    if (req.params.id != res.locals.user.id) {
      res
        .status(401)
        .json({ error: 'You are not authorized to retrieve completed orders' });
    }
    const user_id = req.params.id as unknown as number;
    const orders = await store.completedOrders(user_id);
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(400).json({ error: 'Could not get orders' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not get orders: ${err}` });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderProduct = req.body as OrderProduct;
    const newOrderProduct = await store.addProduct(orderProduct);
    if (newOrderProduct) {
      res.status(201).json(newOrderProduct);
    } else {
      res.status(400).json({ error: 'Could not add product' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not add product: ${err}` });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const orderProducts = await store.getProducts(id);
    if (orderProducts) {
      res.status(200).json(orderProducts);
    } else {
      res.status(400).json({ error: 'Could not get order products' });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not get order products: ${err}` });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const orderProduct = req.body as OrderProduct;
    const updatedOrderProduct = await store.updateProduct(orderProduct);
    if (updatedOrderProduct) {
      res.status(200).json(updatedOrderProduct);
    } else {
      res.status(400).json({ error: 'Could not update order product' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not update order product' });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.product_id as unknown as number;
    const deletedOrderProduct = await store.deleteProduct(id);
    if (deletedOrderProduct) {
      res.status(200).json(deletedOrderProduct);
    } else {
      res.status(400).json({ error: 'Could not delete order product' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not delete order product' });
  }
};

const orderRoutes = (app: express.Application) => {
  app.post('/orders', create);
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.put('/orders/:id', update);
  app.delete('/orders/:id', del);
  app.get('/orders/open/user/:id', verifyToken, currentOrder);
  app.get('/orders/completed/user/:id', verifyToken, completedOrders);
  app.post('/orders/:id/products', verifyToken, addProduct);
  app.get('/orders/:id/products', verifyToken, getProducts);
  app.put('/orders/:order_id/products/:product_id', verifyToken, updateProduct);
  app.delete(
    '/orders/:order_id/products/:product_id',
    verifyToken,
    deleteProduct
  );
};

export default orderRoutes;
