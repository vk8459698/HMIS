import express from 'express';
import { DoctorSchedule, DoctorBusy } from '../models/schedule.js';
import { faker } from '@faker-js/faker';

const router = express.Router();

// ============= DOCTOR SCHEDULE ROUTES =============

// GET all doctor schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await DoctorSchedule.find({}).populate('doctor_id');
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET doctor schedules by doctor ID
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const schedules = await DoctorSchedule.find({ doctor_id: doctorId }).populate('doctor_id');
    
    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this doctor' });
    }
    
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await DoctorSchedule.findById(req.params.id).populate('doctor_id');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a doctor schedule
router.post('/', async (req, res) => {
  try {
    const schedule = new DoctorSchedule(req.body);
    const savedSchedule = await schedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a doctor schedule
router.put('/:id', async (req, res) => {
  try {
    const updatedSchedule = await DoctorSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a doctor schedule
router.delete('/:id', async (req, res) => {
  try {
    const deletedSchedule = await DoctorSchedule.findByIdAndDelete(req.params.id);
    
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to generate random doctor schedule
function generateDoctorSchedule(doctorId) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const startHours = [8, 9, 10];
  const endHours = [16, 17, 18];
  const durations = [15, 20, 30, 45, 60];
  
  const day = faker.helpers.arrayElement(days);
  const startHour = faker.helpers.arrayElement(startHours);
  const endHour = faker.helpers.arrayElement(endHours);
  
  return {
    doctor_id: doctorId,
    day_of_week: day,
    start_time: `${startHour}:00`,
    end_time: `${endHour}:00`,
    slot_duration_minutes: faker.helpers.arrayElement(durations),
    max_appointments_per_slot: faker.number.int({ min: 1, max: 3 }),
    is_active: faker.datatype.boolean(0.9) // 90% chance to be active
  };
}

// POST generate dummy schedules for doctors
router.post('/generate', async (req, res) => {
  try {
    const { doctorIds, schedulesPerDoctor } = req.body;
    
    if (!doctorIds || !Array.isArray(doctorIds) || doctorIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of doctor IDs' });
    }
    
    const numSchedules = schedulesPerDoctor || 5; // Default to 5 schedules per doctor
    const schedules = [];
    
    for (const doctorId of doctorIds) {
      // Choose a random number of days (3-7) for this doctor to work
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const shuffledDays = faker.helpers.shuffle(days);
      const workDays = shuffledDays.slice(0, faker.number.int({ min: 3, max: 7 }));
      
      for (const day of workDays) {
        const scheduleData = generateDoctorSchedule(doctorId);
        scheduleData.day_of_week = day;
        
        const schedule = new DoctorSchedule(scheduleData);
        const savedSchedule = await schedule.save();
        schedules.push(savedSchedule);
      }
    }
    
    res.status(201).json({
      message: `Successfully generated ${schedules.length} doctor schedules`,
      count: schedules.length,
      schedules: schedules
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ============= DOCTOR BUSY PERIODS ROUTES =============

// GET all doctor busy periods
router.get('/busy', async (req, res) => {
  try {
    const busyPeriods = await DoctorBusy.find({}).populate('doctor_id');
    res.status(200).json(busyPeriods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET busy periods by doctor ID
router.get('/busy/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const busyPeriods = await DoctorBusy.find({ doctor_id: doctorId }).populate('doctor_id');
    
    if (busyPeriods.length === 0) {
      return res.status(404).json({ message: 'No busy periods found for this doctor' });
    }
    
    res.status(200).json(busyPeriods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET busy period by ID
router.get('/busy/:id', async (req, res) => {
  try {
    const busyPeriod = await DoctorBusy.findById(req.params.id).populate('doctor_id');
    
    if (!busyPeriod) {
      return res.status(404).json({ message: 'Busy period not found' });
    }
    
    res.status(200).json(busyPeriod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a doctor busy period
router.post('/busy', async (req, res) => {
  try {
    const busyPeriod = new DoctorBusy(req.body);
    const savedBusyPeriod = await busyPeriod.save();
    res.status(201).json(savedBusyPeriod);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a doctor busy period
router.put('/busy/:id', async (req, res) => {
  try {
    const updatedBusyPeriod = await DoctorBusy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBusyPeriod) {
      return res.status(404).json({ message: 'Busy period not found' });
    }
    
    res.status(200).json(updatedBusyPeriod);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a doctor busy period
router.delete('/busy/:id', async (req, res) => {
  try {
    const deletedBusyPeriod = await DoctorBusy.findByIdAndDelete(req.params.id);
    
    if (!deletedBusyPeriod) {
      return res.status(404).json({ message: 'Busy period not found' });
    }
    
    res.status(200).json({ message: 'Busy period deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to generate random doctor busy period
function generateDoctorBusyPeriod(doctorId) {
  const exceptionTypes = ["time_off", "surgery", "meeting", "emergency", "other"];
  const startDate = faker.date.future({ years: 0.25 }); // Within next 3 months
  
  // Calculate end time (1-4 hours after start time)
  const durationHours = faker.number.int({ min: 1, max: 4 });
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);
  
  return {
    doctor_id: doctorId,
    exception_type: faker.helpers.arrayElement(exceptionTypes),
    start_datetime: startDate,
    end_datetime: endDate
  };
}

// POST generate dummy busy periods for doctors
router.post('/busy/generate', async (req, res) => {
  try {
    const { doctorIds, busyPeriodsPerDoctor } = req.body;
    
    if (!doctorIds || !Array.isArray(doctorIds) || doctorIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of doctor IDs' });
    }
    
    const numBusyPeriods = busyPeriodsPerDoctor || 3; // Default to 3 busy periods per doctor
    const busyPeriods = [];
    
    for (const doctorId of doctorIds) {
      for (let i = 0; i < numBusyPeriods; i++) {
        const busyPeriodData = generateDoctorBusyPeriod(doctorId);
        const busyPeriod = new DoctorBusy(busyPeriodData);
        const savedBusyPeriod = await busyPeriod.save();
        busyPeriods.push(savedBusyPeriod);
      }
    }
    
    res.status(201).json({
      message: `Successfully generated ${busyPeriods.length} doctor busy periods`,
      count: busyPeriods.length,
      busyPeriods: busyPeriods
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE all schedules and busy periods (for testing)
router.delete('/all', async (req, res) => {
  try {
    await DoctorSchedule.deleteMany({});
    await DoctorBusy.deleteMany({});
    res.status(200).json({ message: 'All doctor schedules and busy periods deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;