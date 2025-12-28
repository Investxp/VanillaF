import mongoose from 'mongoose';



const SiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String },
  apiKey: { type: String },
  apiKeyHistory: [{ key: String, rotatedAt: Date }],
  apiEndpoint: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastChecked: { type: Date },
  lastStatus: { type: String, enum: ['online', 'offline', 'unknown'], default: 'unknown' }
});

// Generate a new API key (simple random string)
SiteSchema.methods.generateApiKey = function () {
  const key = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
  this.apiKey = key;
  return key;
};

// Rotate API key (store old in history)
SiteSchema.methods.rotateApiKey = function () {
  if (this.apiKey) {
    this.apiKeyHistory = this.apiKeyHistory || [];
    this.apiKeyHistory.push({ key: this.apiKey, rotatedAt: new Date() });
  }
  return this.generateApiKey();
};

export default mongoose.model('Site', SiteSchema);
