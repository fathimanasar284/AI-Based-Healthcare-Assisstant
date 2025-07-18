import mongoose from "mongoose";

const healthTracking = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sugarLevel: {
        type: Number,
        required: true
    },
    systolic: {
        type: Number,
        required: true
    },
    diastolic: {
        type: Number,
        required: true
    },
    recordedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('HealthTracking', healthTracking);
