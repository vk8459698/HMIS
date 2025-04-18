import Joi from 'joi';
import {ReportJoiSchema} from "./reportValidator.js";

export const ConsultationJoiSchema = Joi.object({
    patient_id: Joi.number().integer().required(),
    doctor_id: Joi.number().integer().required(),

    booked_date_time: Joi.date().required(),

    status: Joi.string()
        .valid("scheduled", "ongoing", "completed", "cancelled")
        .required(),

    reason: Joi.string().allow('').optional(), // symptoms or chief complaint

    created_by: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'created_by must be a valid ObjectId'
        }),

    appointment_type: Joi.string()
        .valid("regular", "follow-up", "emergency", "consultation")
        .required(),

    actual_start_datetime: Joi.date().optional(),

    remark: Joi.string().allow('').optional(),

    diagnosis: Joi.array()
        .items(Joi.string()) // You could use regex if they are ObjectIds
        .optional(),

    prescription: Joi.array()
        .items(Joi.number().integer())
        .optional(),

    reports: Joi.array()
        .items(ReportJoiSchema)
        .optional(),

    bill_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional(),

    recordedAt: Joi.date().optional()
});