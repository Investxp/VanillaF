import mongoose from 'mongoose';



const SiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String },
  apiKey: { type: String },
  apiKeyHistory: [{ key: String, rotatedAt: Date }],
  apiEndpoint: { typ