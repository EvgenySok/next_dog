import mongoose from 'mongoose'

const CandidateSchema = new mongoose.Schema({
  secretLinc: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // expire_at: { type: Date, default: Date.now, expires: 300 }
})

CandidateSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 })

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema)