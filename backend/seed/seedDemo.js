require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Project = require("../models/Project");

async function upsertDemoUser(data) {
  const existing = await User.findOne({ username: data.username });
  if (existing) {
    await Project.deleteMany({ user: existing._id });
    await User.deleteOne({ _id: existing._id });
  }

  const hashed = await bcrypt.hash("demo1234", 10);
  const user = await User.create({ ...data, password: hashed });
  return user;
}

async function seed() {
  await connectDB();

  const demo1 = await upsertDemoUser({
    username: "demo1",
    email: "demo1@codefolio.dev",
    name: "Ava Chen",
    bio: "Frontend engineer who loves clean UIs and fast websites.",
    templateId: "minimalist",
    resumeUrl: "https://example.com/ava-chen-resume.pdf",
    socialLinks: {
      github: "https://github.com/avachen",
      linkedin: "https://linkedin.com/in/avachen",
      website: "https://avachen.dev",
    },
    skills: [
      { category: "Frontend", name: "React" },
      { category: "Frontend", name: "TypeScript" },
      { category: "Backend", name: "Node.js" },
      { category: "DevOps", name: "Docker" },
    ],
    contactEmail: "ava.real.inbox@example.com",
    isPro: true,
  });

  await Project.create([
    {
      user: demo1._id,
      title: "TaskFlow",
      description: "A drag-and-drop kanban board with real-time sync.",
      techStack: ["React", "Socket.io", "Express"],
      repoLink: "https://github.com/avachen/taskflow",
      liveLink: "https://taskflow.example.com",
      order: 0,
    },
    {
      user: demo1._id,
      title: "Weatherly",
      description: "A minimalist weather dashboard with 7-day forecasts.",
      techStack: ["React", "OpenWeather API"],
      repoLink: "https://github.com/avachen/weatherly",
      liveLink: "https://weatherly.example.com",
      order: 1,
    },
  ]);

  const demo2 = await upsertDemoUser({
    username: "demo2",
    email: "demo2@codefolio.dev",
    name: "Rex Okafor",
    bio: "Backend & DevOps engineer. I ship infrastructure that doesn\u2019t fall over.",
    templateId: "cyberpunk",
    resumeUrl: "https://example.com/rex-okafor-resume.pdf",
    socialLinks: {
      github: "https://github.com/rexokafor",
      twitter: "https://twitter.com/rexokafor",
    },
    skills: [
      { category: "Backend", name: "Node.js" },
      { category: "Backend", name: "Go" },
      { category: "DevOps", name: "Kubernetes" },
      { category: "DevOps", name: "AWS" },
    ],
    contactEmail: "rex.real.inbox@example.com",
    isPro: false,
  });

  await Project.create([
    {
      user: demo2._id,
      title: "ClusterWatch",
      description: "Kubernetes cluster monitoring with alerting.",
      techStack: ["Go", "Prometheus", "Grafana"],
      repoLink: "https://github.com/rexokafor/clusterwatch",
      order: 0,
    },
    {
      user: demo2._id,
      title: "AutoDeploy",
      description: "Zero-downtime CI/CD pipeline generator.",
      techStack: ["Node.js", "Docker", "GitHub Actions"],
      repoLink: "https://github.com/rexokafor/autodeploy",
      order: 1,
    },
  ]);

  console.log("Seeded demo1 (minimalist) and demo2 (cyberpunk).");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
