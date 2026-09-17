const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] }, // e.g. ["React", "Node", "MongoDB"]
    repoLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    screenshot: { type: String, default: '' }, // image URL
    order: { type: Number, default: 0 }, // lets users reorder on the public page
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
