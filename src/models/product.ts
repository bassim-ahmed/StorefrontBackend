import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
  url: string;
  description: string;
};

export class ProductStore {
  async create(product: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO products (name, price, url, description, category) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;`;
      const { name, price, url, description, category } = product;
      const result = await Client.query(sql, [name, price, url, description, category]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create product: ${err}`);
    }
  }

  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await Client.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id = $1;';
      const result = await Client.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} does not exist`);
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get product: ${err}`);
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = `UPDATE products 
      SET name = $1, price = $2, category = $3, url = $4, description = $5 
      WHERE id = $6 
      RETURNING *;`;
      const { name, price, category, url, description, id } = product;
      const result = await Client.query(sql, [name, price, category, url, description, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update product: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = `DELETE FROM products WHERE id = $1 RETURNING *;`;
      const result = await Client.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete product: ${err}`);
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM products WHERE category = $1;`;
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products by category: ${err}`);
    }
  }
}
