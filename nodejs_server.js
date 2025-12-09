const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();

// Configuration
const PORT = 3005; // Your assigned team port
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'team05_storefront';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let db;
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(DB_NAME);
    })
    .catch(error => console.error('MongoDB connection error:', error));

// ============================================
// GENERIC SUBMIT ENDPOINT (for backward compatibility)
// ============================================
app.post('/submit', async (req, res) => {
    try {
        const { collectionName, data } = req.body;
        
        if (!collectionName || !data) {
            return res.status(400).json({ error: 'Missing collectionName or data' });
        }

        const collection = db.collection(collectionName);
        const result = await collection.insertOne({
            ...data,
            createdAt: new Date()
        });

        res.status(201).json({
            message: 'Data inserted successfully',
            insertedId: result.insertedId,
            data: data
        });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Failed to insert data' });
    }
});

// ============================================
// SHOPPER ENDPOINTS
// ============================================

// Create shopper
app.post('/api/shoppers', async (req, res) => {
    try {
        const shopper = {
            ...req.body,
            createdAt: new Date()
        };
        
        const result = await db.collection('shoppers').insertOne(shopper);
        res.status(201).json({ 
            message: 'Shopper created successfully',
            shopperId: result.insertedId,
            shopper 
        });
    } catch (error) {
        console.error('Error creating shopper:', error);
        res.status(500).json({ error: 'Failed to create shopper' });
    }
});

// Get all shoppers
app.get('/api/shoppers', async (req, res) => {
    try {
        const shoppers = await db.collection('shoppers').find().toArray();
        res.json(shoppers);
    } catch (error) {
        console.error('Error fetching shoppers:', error);
        res.status(500).json({ error: 'Failed to fetch shoppers' });
    }
});

// Get shopper by ID
app.get('/api/shoppers/:id', async (req, res) => {
    try {
        const shopper = await db.collection('shoppers')
            .findOne({ _id: new ObjectId(req.params.id) });
        
        if (!shopper) {
            return res.status(404).json({ error: 'Shopper not found' });
        }
        res.json(shopper);
    } catch (error) {
        console.error('Error fetching shopper:', error);
        res.status(500).json({ error: 'Failed to fetch shopper' });
    }
});

// Update shopper
app.put('/api/shoppers/:id', async (req, res) => {
    try {
        const result = await db.collection('shoppers').updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    ...req.body,
                    updatedAt: new Date() 
                } 
            }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Shopper not found' });
        }
        res.json({ message: 'Shopper updated successfully' });
    } catch (error) {
        console.error('Error updating shopper:', error);
        res.status(500).json({ error: 'Failed to update shopper' });
    }
});

// Delete shopper
app.delete('/api/shoppers/:id', async (req, res) => {
    try {
        const result = await db.collection('shoppers')
            .deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Shopper not found' });
        }
        res.json({ message: 'Shopper deleted successfully' });
    } catch (error) {
        console.error('Error deleting shopper:', error);
        res.status(500).json({ error: 'Failed to delete shopper' });
    }
});

// ============================================
// PRODUCT ENDPOINTS
// ============================================

// Create product
app.post('/api/products', async (req, res) => {
    try {
        const product = {
            ...req.body,
            createdAt: new Date()
        };
        
        const result = await db.collection('products').insertOne(product);
        res.status(201).json({ 
            message: 'Product created successfully',
            productId: result.insertedId,
            product 
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.collection('products').find().toArray();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await db.collection('products')
            .findOne({ _id: new ObjectId(req.params.id) });
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Search products by name or category
app.get('/api/products/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const products = await db.collection('products').find({
            $or: [
                { productDesc: { $regex: query, $options: 'i' } },
                { productCategory: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
        
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    ...req.body,
                    updatedAt: new Date() 
                } 
            }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const result = await db.collection('products')
            .deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ============================================
// SHOPPING CART ENDPOINTS
// ============================================

// Create/Save cart
app.post('/api/cart', async (req, res) => {
    try {
        const cart = {
            items: req.body.items || req.body,
            shopperId: req.body.shopperId || null,
            createdAt: new Date()
        };
        
        const result = await db.collection('shoppingcart').insertOne(cart);
        res.status(201).json({ 
            message: 'Cart saved successfully',
            cartId: result.insertedId,
            cart 
        });
    } catch (error) {
        console.error('Error saving cart:', error);
        res.status(500).json({ error: 'Failed to save cart' });
    }
});

// Get all carts
app.get('/api/cart', async (req, res) => {
    try {
        const carts = await db.collection('shoppingcart').find().toArray();
        res.json(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ error: 'Failed to fetch carts' });
    }
});

// Get cart by shopper ID
app.get('/api/cart/shopper/:shopperId', async (req, res) => {
    try {
        const carts = await db.collection('shoppingcart')
            .find({ shopperId: req.params.shopperId })
            .sort({ createdAt: -1 })
            .toArray();
        
        res.json(carts);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// ============================================
// RETURNS ENDPOINTS
// ============================================

// Create return request
app.post('/api/returns', async (req, res) => {
    try {
        const returnRequest = {
            ...req.body,
            status: 'pending',
            createdAt: new Date()
        };
        
        const result = await db.collection('returns').insertOne(returnRequest);
        res.status(201).json({ 
            message: 'Return request created successfully',
            returnId: result.insertedId,
            return: returnRequest 
        });
    } catch (error) {
        console.error('Error creating return:', error);
        res.status(500).json({ error: 'Failed to create return request' });
    }
});

// Get all returns (with optional filters)
app.get('/api/returns', async (req, res) => {
    try {
        const { shopperEmail, status } = req.query;
        const query = {};
        
        if (shopperEmail) query.shopperEmail = shopperEmail;
        if (status) query.status = status;
        
        const returns = await db.collection('returns')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
        
        res.json(returns);
    } catch (error) {
        console.error('Error fetching returns:', error);
        res.status(500).json({ error: 'Failed to fetch returns' });
    }
});

// Get return by ID
app.get('/api/returns/:id', async (req, res) => {
    try {
        const returnRequest = await db.collection('returns')
            .findOne({ _id: new ObjectId(req.params.id) });
        
        if (!returnRequest) {
            return res.status(404).json({ error: 'Return not found' });
        }
        res.json(returnRequest);
    } catch (error) {
        console.error('Error fetching return:', error);
        res.status(500).json({ error: 'Failed to fetch return' });
    }
});

// Update return status
app.put('/api/returns/:id', async (req, res) => {
    try {
        const result = await db.collection('returns').updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    ...req.body,
                    updatedAt: new Date() 
                } 
            }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Return not found' });
        }
        res.json({ message: 'Return updated successfully' });
    } catch (error) {
        console.error('Error updating return:', error);
        res.status(500).json({ error: 'Failed to update return' });
    }
});

// Delete return
app.delete('/api/returns/:id', async (req, res) => {
    try {
        const result = await db.collection('returns')
            .deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Return not found' });
        }
        res.json({ message: 'Return deleted successfully' });
    } catch (error) {
        console.error('Error deleting return:', error);
        res.status(500).json({ error: 'Failed to delete return' });
    }
});

// ============================================
// SHIPPING ENDPOINTS
// ============================================

// Create shipping record
app.post('/api/shipping', async (req, res) => {
    try {
        const shipping = {
            ...req.body,
            createdAt: new Date()
        };
        
        const result = await db.collection('shipping').insertOne(shipping);
        res.status(201).json({ 
            message: 'Shipping record created successfully',
            shippingId: result.insertedId,
            shipping 
        });
    } catch (error) {
        console.error('Error creating shipping record:', error);
        res.status(500).json({ error: 'Failed to create shipping record' });
    }
});

// Get all shipping records
app.get('/api/shipping', async (req, res) => {
    try {
        const shipping = await db.collection('shipping').find().toArray();
        res.json(shipping);
    } catch (error) {
        console.error('Error fetching shipping records:', error);
        res.status(500).json({ error: 'Failed to fetch shipping records' });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Team 05 Storefront API',
        endpoints: {
            shoppers: '/api/shoppers',
            products: '/api/products',
            cart: '/api/cart',
            returns: '/api/returns',
            shipping: '/api/shipping',
            legacy: '/submit'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access at: http://130.203.136.203:${PORT}`);
});