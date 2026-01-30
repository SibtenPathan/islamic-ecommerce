import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    image: string;
    date: Date;
    endDate?: Date;
    link?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Please provide an event title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide an event description'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please provide an event image'],
        },
        date: {
            type: Date,
            required: [true, 'Please provide an event date'],
        },
        endDate: {
            type: Date,
        },
        link: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for active events
EventSchema.index({ isActive: 1, date: 1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
