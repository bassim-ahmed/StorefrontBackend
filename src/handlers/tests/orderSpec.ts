import app from '../../server';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Order, OrderProduct } from '../../models/order';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret_token = process.env.SECRET_TOKEN as unknown as string;

const request = supertest(app);

describe('- Order Handler:', () => {
  let user_id: number;
  let product_id: number;
  let order_id: number;
  let order_product_id: number;
  let token: string;

  const order: Order = {
    user_id: 0,
    status: 'open'
  };

  const order_product: OrderProduct = {
    order_id: 0,
    product_id: 0,
    quantity: 5
  };

  beforeAll(async () => {
    const user: User = {
      username: 'ceci',
      first_name: 'Cecilia',
      last_name: 'Dopazo',
      password: 'cosocuesiton'
    };
    const new_user = await request.post('/users').send(user);
    token = new_user.body;
    const decoded = jwt.verify(token, secret_token) as User;
    user_id = decoded.id as unknown as number;
    order.user_id = user_id;

    const product: Product = {
      name: 'Cradle to cradle',
      price: 8.00,
      category: 'Book',
      url: 'https://www.google.com',
      description: 'Un libro de Cradle to cradle'
    };
    const new_product = await request
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(product);
    product_id = new_product.body.id as number;
    order_product.product_id = product_id;
  });

  it('Create an order', async () => {
    const response = await request.post('/orders').send(order);
    expect(response.status).toBe(201);
    expect(response.body.user_id).toEqual(order.user_id);
    expect(response.body.status).toEqual(order.status);
    order_id = response.body.id as number;
    order_product.order_id = order_id;
  });

  it('Get all orders', async () => {
    const response = await request.get('/orders');
    expect(response.status).toBe(200);
    const orders = response.body as Order[];
    expect(orders[0]).toBeTruthy();
  });

  it('Show order', async () => {
    const response = await request.get(`/orders/${order_id}`);
    expect(response.status).toBe(200);
    const order_1 = response.body as Order;
    expect(order_1.id).toEqual(order_id);
  });

  it('Get current open order from user', async () => {
    const response = await request
      .get(`/orders/open/user/${user_id}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    const orders = response.body as Order[];
    expect(orders[0].status).toBe('open');
  });

  it('Add product to order', async () => {
    const response = await request
      .post(`/orders/${order_id}/products`)
      .set('Authorization', 'Bearer ' + token)
      .send(order_product);
    expect(response.status).toBe(201);
    expect(response.body.order_id).toEqual(order_product.order_id);
    expect(response.body.product_id).toEqual(order_product.product_id);
    expect(response.body.quantity).toEqual(order_product.quantity);
    order_product_id = response.body.id as number;
  });

  it('Get all products of an order', async () => {
    const response = await request
      .get(`/orders/${order_id}/products`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    const order_products = response.body as OrderProduct[];
    expect(order_products[0]).toBeTruthy();
  });

  it('Update product of an order', async () => {
    const updated_order_product: OrderProduct = {
      id: order_product_id,
      order_id: order_id,
      product_id: product_id,
      quantity: 10
    };
    const response = await request
      .put(`/orders/${order_id}/products/${order_product_id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(updated_order_product);
    expect(response.status).toBe(200);
    expect(response.body.quantity).toEqual(updated_order_product.quantity);
  });

  it('Update order status', async () => {
    const update_order: Order = {
      id: order_id,
      user_id: user_id,
      status: 'completed'
    };
    const response = await request
      .put(`/orders/${update_order.id}`)
      .send(update_order);
    expect(response.status).toBe(200);
    const order_1 = response.body as Order;
    expect(order_1.status).toEqual(update_order.status);
  });

  it('Get completed orders from user', async () => {
    const response = await request
      .get(`/orders/completed/user/${user_id}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    const orders = response.body as Order[];
    expect(orders[0].status).toBe('completed');
  });

  it('Delete product of an order', async () => {
    const response = await request
      .delete(`/orders/${order_id}/products/${order_product_id}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(order_product_id);
  });

  it('Delete order', async () => {
    const response = await request
      .delete(`/orders/${order_id}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(order_id);
  });

  // afterAll(async () => {
  //   await request
  //     .delete(`/users/${user_id}`)
  //     .set('Authorization', 'Bearer ' + token);
  //   await request
  //     .delete(`/products/${product_id}`)
  //     .set('Authorization', 'Bearer ' + token);
  // });
});
