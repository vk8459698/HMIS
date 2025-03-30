import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  senderEmail: String,
  receiverEmail: String,
  content: String,
  date: Date,
  time: String,
  future: Boolean,
  recurring: Boolean,
  frequency: String,
  futureSchedules: [{
    scheduledDateTime: Date,
    priority: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ["pending", "sent", "failed"], 
      default: "pending" 
    }
  }] // Embedded future notifications
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;