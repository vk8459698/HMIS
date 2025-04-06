import express from 'express';
import { Ambulance } from '../models/facility.js';
const router = express.Router();

// TODO: Add routes for facility
//  add ambulance
router.post('/ambulance', async (req, res) => {
    try {
      const { vehicle_number, driver, status, nurse_id } = req.body;
  
      // Find the driver object by driverId and get its ObjectId
      const driverObject = await Driver.findOne({ driverId: driver }); // Adjust 'driverId' field name as per your schema
      if (!driverObject) {
        return res.status(404).json({ message: 'Driver not found' });
      }
  
      // Create the ambulance with the driver's ObjectId
      const newAmbulance = new Ambulance({
        vehicle_number,
        driver: driverObject._id, // Assign ObjectId
        status,
        nurse_id
      });
  
      await newAmbulance.save();
      res.status(201).json({ message: 'Ambulance added successfully', ambulance: newAmbulance });
    } catch (error) {
      res.status(500).json({ message: 'Error adding ambulance', error });
    }
  });

// get ambulance by vehicle_numebr
  router.get('/ambulance/:vehicle_number', async (req, res) => {
    try {
      const { vehicle_number } = req.params;
      const ambulance = await Ambulance.findOne({ vehicle_number })
      if (!ambulance) {
        return res.status(404).json({ message: 'Ambulance not found' });
      }
      res.status(200).json(ambulance);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving ambulance', error });
    }
  });

// decommision ambulance
router.patch('/ambulance/:vehicle_number/decommission', async (req, res) => {
    try {
      const { vehicle_number } = req.params;
      const ambulance = await Ambulance.findOne({ vehicle_number }); // Find by vehicle_number
      if (!ambulance) {
        return res.status(404).json({ message: 'Ambulance not found' });
      }
      ambulance.status = 'inactive'; // Update status to inactive
      await ambulance.save();
      res.status(200).json({ message: 'Ambulance decommissioned successfully', ambulance });
    } catch (error) {
      res.status(500).json({ message: 'Error decommissioning ambulance', error });
    }
  });

export default router;