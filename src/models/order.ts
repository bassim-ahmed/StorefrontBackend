import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async create(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO orders (user_id, status)
        VALUES ($1, $2)
        RETURNING id, user_id, status`;
      const { user_id, status } = order;
      const result = await conn.query(sql, [user_id, status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order: ${err}`);
    }
  }

  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id = $1;';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error(`Could not find order with id: ${id}`);
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get order: ${err}`);
    }
  }

  async update(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = `UPDATE orders 
      SET user_id = $1, status = $2 
      WHERE id = $3 
      RETURNING *;`;
      const { user_id, status, id } = order;
      const result = await conn.query(sql, [user_id, status, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update order: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete order: ${err}`);
    }
  }

  async currentOrder(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1 AND status = 'open';`;
      const result = await conn.query(sql, [user_id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error(`Could not find open order for user: ${user_id}`);
      }
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get open orders by user id: ${err}`);
    }
  }

  async completedOrders(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1 AND status = 'completed';`;
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get completed orders by user id: ${err}`);
    }
  }

  async addProduct(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO order_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;`;
      const { order_id, product_id, quantity } = orderProduct;
      const result = await conn.query(sql, [order_id, product_id, quantity]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add product to order: ${err}`);
    }
  }

  async getProducts(order_id: number): Promise<OrderProduct[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM order_products WHERE order_id = $1;`;
      const result = await conn.query(sql, [order_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products from order: ${err}`);
    }
  }

  async updateProduct(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql = `UPDATE order_products 
      SET quantity = $1 
      WHERE id = $2 
      RETURNING *;`;
      const { quantity, id } = orderProduct;
      const result = await conn.query(sql, [quantity, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update product: ${err}`);
    }
  }

  async deleteProduct(id: number): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM order_products WHERE id = $1 RETURNING *;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete order product: ${err}`);
    }
  }
}
