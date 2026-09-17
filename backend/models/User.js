const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Frontend", "Backend", "DevOps", "Design", "Other"],
      default: "Other",
    },
    name: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const SocialLinksSchema = new mongoose.Schema(
  {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    name: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 280 },
    resumeUrl: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    socialLinks: { type: SocialLinksSchema, default: () => ({}) },
    skills: { type: [SkillSchema], default: [] },
    templateId: {
      type: String,
      enum: ["minimalist", "cyberpunk", "corporate"],
      default: "minimalist",
    },

    isPro: { type: Boolean, default: false },
    customDomain: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

UserSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.email;
  delete obj.contactEmail;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
