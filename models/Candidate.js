import mongoose from 'mongoose'

const CandidateSchema = new mongoose.Schema({
  secretLinc: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

CandidateSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 })

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema)