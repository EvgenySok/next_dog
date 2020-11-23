import { Schema, model, models } from 'mongoose'

const CandidateSchema = new Schema({
  secretLinc: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // expire_at: { type: Date, default: Date.now, expires: 300 }
},
  { timestamps: true }
)

CandidateSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })

export default models.Candidate || model('Candidate', CandidateSchema)