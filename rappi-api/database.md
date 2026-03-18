# Database Schema

The following tables must be created in the DB before running the application.

## Users

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL
);
```

## Users SQL Queries

### getUsers

```sql
SELECT * FROM users;
```

### getUserById

```sql
SELECT * FROM users WHERE id = $1;
```

### authenticateUser

```sql
SELECT * FROM users WHERE email = $1 AND password = $2;
```

### createUser

```sql
INSERT INTO users (id, email, name, password, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
```

### updateUser

```sql
UPDATE users
SET
    name = $2,
WHERE id = $1
RETURNING *;
```

### deleteUser

```sql
DELETE FROM users WHERE id = $1 RETURNING *;
```

## Stores

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    isOpen BOOLEAN DEFAULT false,
    userId UUID NOT NULL REFERENCES users
    (id) ON DELETE CASCADE
);
```
## Stores SQL Queries

### getStores
```sql
SELECT * FROM stores WHERE isOpen = true;
```

### getStoresById
```sql
SELECT * FROM stores WHERE id=$1;
```

### createStore
```sql
INSERT INTO stores(name, userId) VALUES ($1, $2) RETURNING *;
```

### updateStoreStatus
```sql
UPDATE stores SET isOpen = $1 WHERE id = $2 RETURNING *;
```

# Products

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    imageUrl TEXT,
    storeId UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE
);
```
## Products SQL Queries

### getProductsByStore
```sql
SELECT * FROM products WHERE storeId = $1;
```

### createProduct
```sql
INSERT INTO products (name, description, price, imageUrl, storeId)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
```

### deleteProduct
```sql
DELETE FROM products WHERE id = $1;
```

## Orders

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consumerId UUID NOT NULL REFERENCES users(id),
    storeId UUID NOT NULL REFERENCES stores(id),
    deliveryId UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending',
    total INTEGER DEFAULT 0,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
## Orders SQL Queries

### createOrder
```sql
INSERT INTO orders (consumerId, storeId, total)
VALUES ($1, $2, $3)
RETURNING *;
```

### getAvailableOrders
```sql
SELECT * FROM orders WHERE status = 'pending' AND deliveryId IS NULL;
```

### acceptOrder
```sql
UPDATE orders SET deliveryId = $2, status = 'accepted' WHERE id = $1 RETURNING *;
```

### updateOrderStatus
```sql
UPDATE orders SET status = $2 WHERE id = $1 RETURNING *;
```

### getUserOrders
```sql
SELECT * FROM orders WHERE consumerId = $1 OR deliveryId = $1 ORDER BY createdAt DESC;
```

## Order_items

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    orderId UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    productId UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    priceAtTime INTEGER NOT NULL
);
```
## Order_items SQL Queries

### createOrderItem
```sql
INSERT INTO order_items (orderId, productId, quantity, priceAtTime)
VALUES ($1, $2, $3, $4);
```

### getOrderDetails
```sql
SELECT oi.*, p.name 
FROM order_items oi
JOIN products p ON oi.productId = p.id
WHERE oi.orderId = $1;
```