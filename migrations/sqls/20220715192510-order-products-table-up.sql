CREATE TABLE order_products(
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    CONSTRAINT order_ref FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    CONSTRAINT product_ref FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);