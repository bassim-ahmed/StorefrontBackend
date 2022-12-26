import { Product, ProductStore } from '../product';

const store = new ProductStore();

describe('- Product Model', () => {
  let product_id: number;
  const product: Product = {
    name: 'Muñeco Francella',
    price: 15.00,
    category: 'Toy',
    url: 'https://www.google.com',
    description: 'Un muñeco de Francella',
  };

  it('Should create a product with correct info', async () => {
    const newProduct = await store.create(product);
    expect(newProduct.name).toBe(product.name);
    expect(newProduct.category).toBe(product.category);
    expect(newProduct.url).toBe(product.url);
    expect(newProduct.description).toBe(product.description);
    product_id = newProduct.id as number;
  });

  it('Index should return at least 1 product (we just created 1)', async () => {
    const products = await store.index();
    expect(products[0]).toBeTruthy();
  });

  it('Show product', async () => {
    const product = await store.show(product_id);
    expect(product.id).toBe(product_id);
  });

  it('Update product', async () => {
    const updateProduct: Product = {
      id: product_id,
      name: 'Muñeco Francellita',
      price: 19.90,
      category: 'Juguete',
      url: 'https://www.google.com/search?q=Francella+muneco',
      description: 'Un nuevo muñeco de Francella',
    };
    const newProduct = (await store.update(updateProduct)) as Product;
    expect(newProduct.name).toBe('Muñeco Francellita');
    expect(newProduct.category).toBe('Juguete');
    expect(newProduct.url).toBe('https://www.google.com/search?q=Francella+muneco');
    expect(newProduct.description).toBe('Un nuevo muñeco de Francella');
  });

  it('Delete product', async () => {
    const product = await store.delete(product_id);
    expect(product.id).toEqual(product_id);
  });
});
