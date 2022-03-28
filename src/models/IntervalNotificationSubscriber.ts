import mongoose, { Document } from 'mongoose'
const Schema = mongoose.Schema

const intervalNotificationSubscriberSchema = new Schema<IIntervalNotificationSubscriber>({
    type: {
        type: 'string',
        required: true,
    },
    channelId: {
        type: 'string',
        required: true,
    },
    userId: {
        type: 'string',
        required: true,
    },
    info: { // TODO: Change type to string
        type: 'mixed',
        required: true,
    }
}, { timestamps: true })

export interface IIntervalNotificationSubscriber extends Document {
    type: string
    channelId: string
    userId: string
    info: any
}

const IntervalNotificationSubscriber = mongoose.model('IntervalNotificationSubscriber', intervalNotificationSubscriberSchema)

export default IntervalNotificationSubscriber
