import mongoose, { Schema, Document, Model } from 'mongoose';

export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled';

export interface IEmailCampaign extends Document {
    _id: mongoose.Types.ObjectId;
    subject: string;
    content: string;
    status: CampaignStatus;
    scheduledAt?: Date;
    sentAt?: Date;
    sentCount: number;
    openCount: number;
    clickCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const EmailCampaignSchema = new Schema<IEmailCampaign>(
    {
        subject: {
            type: String,
            required: [true, 'Please provide an email subject'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Please provide email content'],
        },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'sent', 'cancelled'],
            default: 'draft',
        },
        scheduledAt: {
            type: Date,
        },
        sentAt: {
            type: Date,
        },
        sentCount: {
            type: Number,
            default: 0,
        },
        openCount: {
            type: Number,
            default: 0,
        },
        clickCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for status
EmailCampaignSchema.index({ status: 1 });
EmailCampaignSchema.index({ scheduledAt: 1 });

const EmailCampaign: Model<IEmailCampaign> = mongoose.models.EmailCampaign || mongoose.model<IEmailCampaign>('EmailCampaign', EmailCampaignSchema);

export default EmailCampaign;
