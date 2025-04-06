import express from 'express';
import Notification from '../models/notification.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

// GET all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({});
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET notifications by receiver email
router.get('/receiver/:email', async (req, res) => {
  try {
    const notifications = await Notification.find({ receiverEmail: req.params.email });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a single notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate a random notification with future schedules
function generateNotification() {
  // Common domains for healthcare staff
  const domains = ['hospital.org', 'medfacility.com', 'healthcare.net', 'clinic.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  // Generate sender and receiver emails
  const senderEmail = faker.internet.email({ provider: domain });
  const receiverEmail = faker.internet.email({ provider: domain });
  
  // Notification content templates
  const contentTemplates = [
    "Patient checkup reminder for {patientName}",
    "Lab results ready for patient #{patientId}",
    "Staff meeting in {location}",
    "Medication refill needed for patient {patientName}",
    "New policy update: {policyName}",
    "Inventory alert: {medicineType} running low",
    "Appointment scheduling change for Dr. {doctorName}",
    "System maintenance scheduled for {date}",
    "Emergency response training on {date}",
    "New patient admitted to {department}"
  ];
  
  // Select random content template and fill in placeholders
  let content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  content = content
    .replace('{patientName}', faker.person.fullName())
    .replace('{patientId}', faker.string.numeric(6))
    .replace('{location}', faker.location.buildingNumber() + ' Conference Room')
    .replace('{policyName}', faker.helpers.arrayElement(['HIPAA Compliance', 'Documentation Standards', 'Patient Safety', 'Infection Control']))
    .replace('{medicineType}', faker.helpers.arrayElement(['Antibiotics', 'Painkillers', 'Vaccines', 'Insulin', 'Blood Pressure Medication']))
    .replace('{doctorName}', 'Dr. ' + faker.person.lastName())
    .replace('{department}', faker.helpers.arrayElement(['Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Emergency']))
    .replace('{date}', faker.date.future().toLocaleDateString());
  
  // Set dates and times
  const currentDate = new Date();
  const baseDate = faker.date.soon({ days: 14, refDate: currentDate });
  const hours = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const period = Math.random() > 0.5 ? 'AM' : 'PM';
  const time = `${hours}:${minutes} ${period}`;
  
  // Determine if it's a future notification
  const future = Math.random() > 0.3; // 70% chance of being a future notification
  
  // Determine if it's recurring
  const recurring = future && Math.random() > 0.5; // 50% of future notifications are recurring
  
  // Set frequency for recurring notifications
  const frequencies = ['daily', 'weekly', 'monthly'];
  const frequency = recurring ? frequencies[Math.floor(Math.random() * frequencies.length)] : null;
  
  // Generate future schedules
  const futureSchedules = [];
  
  if (future) {
    // Generate 1-5 future schedules
    const scheduleCount = recurring ? Math.floor(Math.random() * 5) + 1 : 1;
    
    let scheduleDate = new Date(baseDate);
    
    for (let i = 0; i < scheduleCount; i++) {
      // For recurring notifications, increment the date based on frequency
      if (i > 0 && recurring) {
        if (frequency === 'daily') {
          scheduleDate.setDate(scheduleDate.getDate() + 1);
        } else if (frequency === 'weekly') {
          scheduleDate.setDate(scheduleDate.getDate() + 7);
        } else if (frequency === 'monthly') {
          scheduleDate.setMonth(scheduleDate.getMonth() + 1);
        }
      }
      
      futureSchedules.push({
        scheduledDateTime: new Date(scheduleDate),
        priority: Math.floor(Math.random() * 3), // 0-2 priority
        status: i === 0 ? faker.helpers.arrayElement(['pending', 'sent']) : 'pending'
      });
    }
  }
  
  return {
    senderEmail,
    receiverEmail,
    content,
    date: baseDate,
    time,
    future,
    recurring,
    frequency: recurring ? frequency : null,
    futureSchedules
  };
}

// POST generate and add dummy notifications
router.post('/generate/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const notifications = [];

    for (let i = 0; i < count; i++) {
      const notification = new Notification(generateNotification());
      const savedNotification = await notification.save();
      notifications.push(savedNotification);
    }

    res.status(201).json({
      message: `Successfully generated ${notifications.length} notifications`,
      count: notifications.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all notifications (useful for testing)
router.delete('/all', async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;