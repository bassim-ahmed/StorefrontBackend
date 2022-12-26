import { Order, OrderProduct, OrderStore } from '../order';
import { User, UserStore } from '../user';
import { Product, ProductStore } from '../product';

const store = new OrderStore();
const user_store = new UserStore();
const product_store = new ProductStore();

describe('- Order Model', () => {
  let user_id: number;
  let product_id: number;
  let order_id: number;
  let order_product_id: number;

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
      username: 'd10go',
      first_name: 'Diego',
      last_name: 'Maradona',
      password: 'password'
    };
    const new_user = await user_store.create(user);
    user_id = new_user.id as number;
    order.user_id = user_id;

    const product: Product = {
      name: 'Loco Lope',
      price: 10.00,
      category: 'TV series',
      url: 'https://www.google.com',
      description: 'Un loco de Lope'
    };
    const new_product = await product_store.create(product);
    product_id = new_product.id as number;
    order_product.product_id = product_id;
  });

  it('Should create an order', async () => {
    const newOrder = await store.create(order);
    expect(newOrder.user_id).toBe(user_id);
    expect(newOrder.status).toBe(order.status);
    order_id = newOrder.id as number;
    order_product.order_id = order_id;
  });

  it('Index should return at least 1 order (we just created 1)', async () => {
    const orders = await store.index();
    expect(orders[0]).toBeTruthy();
  });

  it('Show order', async () => {
    const order = await store.show(order_id);
    expect(order.id).toBe(order_id);
  });

  it('Get current open order from user', async () => {
    const order = await store.currentOrder(user_id);
    expect(order[0].status).toBe('open');
  });

  it('Update order status to completed', async () => {
    const updateOrder: Order = {
      id: order_id,
      user_id: user_id,
      status: 'completed'
    };
    const newOrder = (await store.update(updateOrder)) as Order;
    expect(newOrder.user_id).toBe(user_id);
    expect(newOrder.status).toBe('completed');
  });

  it('Return completed orders from user', async () => {
    const orders = await store.completedOrders(user_id);
    expect(orders[0].status).toBe('completed');
  });

  it('Add product to order', async () => {
    const newOrderProduct = await store.addProduct(order_product);
    expect(newOrderProduct.order_id).toBe(order_id);
    expect(newOrderProduct.product_id).toBe(product_id);
    expect(newOrderProduct.quantity).toBe(5);
    order_product_id = newOrderProduct.id as number;
  });

  it('Get order products by order id', async () => {
    const products = await store.getProducts(order_id);
    expect(products[0].order_id).toBe(order_id);
  });

  it('Update quantity of order product', async () => {
    const updateOrderProduct: OrderProduct = {
      id: order_product_id,
      order_id: order_id,
      product_id: product_id,
      quantity: 10
    };
    const OrderProduct = await store.updateProduct(updateOrderProduct);
    expect(OrderProduct.quantity).toBe(10);
  });

  it('Delete order product', async () => {
    const OrderProduct = await store.deleteProduct(order_product_id);
    expect(OrderProduct.id).toBe(order_product_id);
  });

  it('Delete order', async () => {
    const order = await store.delete(order_id);
    expect(order.id).toEqual(order_id);
  });

  afterAll(async () => {
    await user_store.delete(user_id);
    await product_store.delete(product_id);
  });
});
