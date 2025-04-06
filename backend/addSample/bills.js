import express from 'express';
import Bill from '../models/bill.js';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

const router = express.Router();

// Utility to generate one bill item
function generateBillItem() {
  const itemTypes = ["consultation", "medication", "procedure", "room_charge", "test", "other"];
  return {
    item_type: faker.helpers.arrayElement(itemTypes),
    consult_id: new mongoose.Types.ObjectId(),
    report_id: new mongoose.Types.ObjectId(),
    prescription_id: faker.number.int({ min: 1000, max: 9999 }),
    room_id: new mongoose.Types.ObjectId(),
    item_description: faker.commerce.productDescription(),
    item_amount: faker.number.float({ min: 100, max: 10000 }),
    quantity: faker.number.int({ min: 1, max: 5 })
  };
}

// Utility to generate one payment
function generatePayment() {
  const statusOptions = ["success", "failed"];
  const methodOptions = ["cash", "card", "bank_transfer", "insurance"];
  return {
    amount: faker.number.float({ min: 500, max: 10000 }),
    insurance_id: new mongoose.Types.ObjectId(),
    payment_date: faker.date.recent(),
    payment_gateway_id: new mongoose.Types.ObjectId(),
    transaction_id: faker.string.alphanumeric(12).toUpperCase(),
    status: faker.helpers.arrayElement(statusOptions),
    payment_method: faker.helpers.arrayElement(methodOptions)
  };
}

// Generate a dummy bill
function generateBill() {
  const numItems = faker.number.int({ min: 1, max: 5 });
  const numPayments = faker.number.int({ min: 1, max: 3 });

  const items = Array.from({ length: numItems }, generateBillItem);
  const payments = Array.from({ length: numPayments }, generatePayment);
  const totalAmount = items.reduce((sum, item) => sum + item.item_amount * item.quantity, 0);

  return {
    patient_id: faker.number.int({ min: 1000, max: 9999 }),
    generation_date: faker.date.recent(),
    total_amount: totalAmount,
    payment_status: faker.helpers.arrayElement(["paid", "pending", "partially_paid"]),
    items,
    payments
  };
}

// POST generate dummy bills
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 5;
    const bills = [];

    for (let i = 0; i < count; i++) {
      const billData = generateBill();
      const bill = new Bill(billData);
      const savedBill = await bill.save();
      bills.push(savedBill);
    }

    res.status(201).json({
      message: `Successfully generated ${bills.length} bills`,
      bills
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
