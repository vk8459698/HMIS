import express from 'express';
import PaymentGateway from '../models/gateway.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

// GET all payment gateways
router.get('/', async (req, res) => {
  try {
    const gateways = await PaymentGateway.find({});
    res.status(200).json(gateways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET payment gateway by ID
router.get('/:id', async (req, res) => {
  try {
    const gatewayId = req.params.id;
    const gateway = await PaymentGateway.findById(gatewayId);
    
    if (!gateway) {
      return res.status(404).json({ message: 'Payment gateway not found' });
    }
    
    res.status(200).json(gateway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single payment gateway
router.post('/', async (req, res) => {
  try {
    const gateway = new PaymentGateway(req.body);
    const savedGateway = await gateway.save();
    res.status(201).json(savedGateway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update payment gateway data
router.put('/:id', async (req, res) => {
  try {
    const gatewayId = req.params.id;
    
    const updatedGateway = await PaymentGateway.findByIdAndUpdate(
      gatewayId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedGateway) {
      return res.status(404).json({ message: 'Payment gateway not found' });
    }
    
    res.status(200).json(updatedGateway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Function to generate a random payment gateway
function generatePaymentGateway() {
  const gatewayTypes = [
    'Credit Card', 'Digital Wallet', 'Bank Transfer', 
    'Cryptocurrency', 'Mobile Payment', 'ACH', 'BNPL'
  ];
  
  const gatewayNames = [
    'Stripe', 'PayPal', 'Square', 'Razorpay', 'Authorize.net', 
    'Braintree', 'Adyen', 'Worldpay', 'Checkout.com', 'Klarna',
    'Affirm', 'PayU', 'Amazon Pay', 'Google Pay', 'Apple Pay'
  ];
  
  const randomName = faker.helpers.arrayElement(gatewayNames);
  const formattedName = `${randomName} ${faker.helpers.arrayElement(gatewayTypes)}`;
  
  return {
    gateway_name: formattedName,
    status: faker.helpers.arrayElement(['active', 'inactive']),
  };
}

// POST generate and add dummy payment gateways
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 5;
    const gateways = [];
    
    for (let i = 0; i < count; i++) {
      const gatewayData = generatePaymentGateway();
      const gateway = new PaymentGateway(gatewayData);
      const savedGateway = await gateway.save();
      gateways.push(savedGateway);
    }
    
    res.status(201).json({
      message: `Successfully generated ${gateways.length} payment gateways`,
      count: gateways.length,
      gateways: gateways
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE all payment gateways (useful for testing)
router.delete('/all', async (req, res) => {
  try {
    await PaymentGateway.deleteMany({});
    res.status(200).json({ message: 'All payment gateways deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;