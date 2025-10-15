const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0, status } = req.query;

    // Demo mode: Return mock orders
    console.log('Fetching demo orders for user:', userId);

    const mockOrders = [
      {
        _id: 'demo_order_1',
        orderNumber: 'ORD-001',
        user: userId,
        userId,
        items: [
          {
            productId: 'demo-product-1',
            title: 'Demo Product 1',
            price: { amount: 99.99, currency: 'USD' },
            image: '/images/placeholder.jpg',
            quantity: 1,
            totalPrice: { amount: 99.99, currency: 'USD' }
          }
        ],
        shippingAddress: {
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          phone: '+1234567890',
          address: '123 Demo Street',
          city: 'Demo City',
          state: 'Demo State',
          zipCode: '12345',
          country: 'Demo Country'
        },
        payment: {
          method: 'card',
          status: 'completed',
          amount: { amount: 114.99, currency: 'USD' }
        },
        subtotal: { amount: 99.99, currency: 'USD' },
        taxAmount: { amount: 10.00, currency: 'USD' },
        shippingCost: { amount: 5.00, currency: 'USD' },
        totalAmount: { amount: 114.99, currency: 'USD' },
        status: 'confirmed',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        _id: 'demo_order_2',
        orderNumber: 'ORD-002',
        user: userId,
        userId,
        items: [
          {
            productId: 'demo-product-2',
            title: 'Demo Product 2',
            price: { amount: 49.99, currency: 'USD' },
            image: '/images/placeholder.jpg',
            quantity: 2,
            totalPrice: { amount: 99.98, currency: 'USD' }
          }
        ],
        shippingAddress: {
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          phone: '+1234567890',
          address: '123 Demo Street',
          city: 'Demo City',
          state: 'Demo State',
          zipCode: '12345',
          country: 'Demo Country'
        },
        payment: {
          method: 'paypal',
          status: 'completed',
          amount: { amount: 114.98, currency: 'USD' }
        },
        subtotal: { amount: 99.98, currency: 'USD' },
        taxAmount: { amount: 10.00, currency: 'USD' },
        shippingCost: { amount: 5.00, currency: 'USD' },
        totalAmount: { amount: 114.98, currency: 'USD' },
        status: 'shipped',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000)
      }
    ];

    // Filter by status if provided
    let filteredOrders = mockOrders;
    if (status) {
      filteredOrders = mockOrders.filter(order => order.status === status);
    }

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.json({
      orders: paginatedOrders,
      pagination: {
        total: filteredOrders.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < filteredOrders.length
      }
    });
  } catch (error) {
    console.error('Error fetching demo orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order by ID
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, userId })
      .populate('items.product', 'title images price')
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      notes,
      items // Accept items directly for demo mode
    } = req.body;

    // Validate required fields
    if (!paymentMethod) {
      return res.status(400).json({
        message: 'Payment method is required'
      });
    }

    // Demo mode: Create mock order without database
    console.log('Creating demo order for user:', userId);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create mock order items if not provided
    const orderItems = items || [
      {
        productId: 'demo-product-1',
        title: 'Demo Product',
        price: { amount: 99.99, currency: 'USD' },
        image: '/images/placeholder.jpg',
        quantity: 1,
        totalPrice: { amount: 99.99, currency: 'USD' }
      }
    ];

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice.amount, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const shippingCost = shippingMethod === 'express' ? 15 : (subtotal > 100 ? 0 : 5);
    const totalAmount = subtotal + taxAmount + shippingCost;

    // Create demo order object
    const order = {
      _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      user: userId,
      userId,
      items: orderItems,
      shippingAddress: shippingAddress || {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        phone: '+1234567890',
        address: '123 Demo Street',
        city: 'Demo City',
        state: 'Demo State',
        zipCode: '12345',
        country: 'Demo Country'
      },
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: paymentMethod,
        status: 'completed', // Demo mode - always completed
        amount: { amount: totalAmount, currency: 'USD' }
      },
      subtotal: { amount: subtotal, currency: 'USD' },
      taxAmount: { amount: taxAmount, currency: 'USD' },
      shippingCost: { amount: shippingCost, currency: 'USD' },
      totalAmount: { amount: totalAmount, currency: 'USD' },
      status: 'confirmed',
      notes: notes || 'Demo order',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Demo order created:', orderNumber);

    // Send notification to admin dashboard (in demo mode, just log it)
    console.log('🔔 NEW ORDER NOTIFICATION:', {
      orderId: orderNumber,
      customerName: shippingAddress?.firstName + ' ' + (shippingAddress?.lastName || ''),
      total: totalAmount.toFixed(2),
      paymentMethod: paymentMethod,
      timestamp: new Date().toISOString()
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating demo order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, estimatedDeliveryDate, cancelReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status using the model's method
    await order.updateStatus(status, { reason: cancelReason });

    // Add tracking info if provided
    if (trackingNumber || estimatedDeliveryDate) {
      await order.addTracking(trackingNumber, estimatedDeliveryDate);
    }

    await order.populate('items.product', 'title images');

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error.message.includes('Invalid status') || error.message.includes('Cannot')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Cancel order
    await order.updateStatus('cancelled', { reason });

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'availability.stock': item.quantity }
      });
    }

    await order.populate('items.product', 'title images');

    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

module.exports = {
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
};