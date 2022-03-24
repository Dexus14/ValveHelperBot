import mongoose, { Document } from 'mongoose'
const Schema = mongoose.Schema

const intervalLastNotificationSchema = new Schema<IIntervalLastNotification>({
    type: {
        type: 'string',
        required: true
    },
    id: {
        type: 'string',
        required: true,
        unique: true
    },
    lastData: {
        type: 'mixed',
        required: true
    }
}, { timestamps: true })

export interface IIntervalLastNotification extends Document {
    type: string
    id: string
    lastData: any
}

const IntervalLastNotification = mongoose.model('IntervalLastNotification', intervalLastNotificationSchema)

export default IntervalLastNotification
