const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const events = [
  {
    title: "Global Tech Summit 2026",
    description: "Join industry leaders from Apple, Google, and NVIDIA for a deep dive into the future of Agentic AI and Spatial Computing.",
    date: "2026-05-15",
    time: "10:00 AM",
    location: "Innovation Hub, Main Campus",
    category: "tech",
    totalSeats: 500,
    availableSeats: 500,
    imageUrl: "/images/tech_summit.png"
  },
  {
    title: "Design Masters Workshop",
    description: "A hands-on workshop on crafting world-class user experiences with a focus on minimalism and high-performance branding.",
    date: "2026-06-12",
    time: "02:00 PM",
    location: "D-Block Creative Studio",
    category: "design",
    totalSeats: 50,
    availableSeats: 50,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Campus Hackathon: Zero to One",
    description: "48 hours of pure coding, networking, and innovation. Build the next big thing and win exciting prizes from our sponsors.",
    date: "2026-04-20",
    time: "09:00 AM",
    location: "Engineering Hall B",
    category: "hackathon",
    totalSeats: 200,
    availableSeats: 200,
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Cultural Night: Rhythms & Roots",
    description: "An electrifying evening of dance, music, and drama performances by student clubs. Food stalls and live DJ after the show!",
    date: "2026-04-28",
    time: "06:00 PM",
    location: "Open Air Theatre",
    category: "cultural",
    totalSeats: 1000,
    availableSeats: 850,
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "AI/ML Workshop: Build Your First Agent",
    description: "Learn to build intelligent AI agents using LangChain and OpenAI APIs. No prior ML experience required — just bring your laptop!",
    date: "2026-05-03",
    time: "11:00 AM",
    location: "Computer Science Lab 3",
    category: "workshop",
    totalSeats: 60,
    availableSeats: 42,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Startup Pitch Day",
    description: "Present your startup idea to a panel of VCs and angel investors. Top 3 teams win seed funding and mentorship opportunities.",
    date: "2026-05-22",
    time: "01:00 PM",
    location: "Business School Auditorium",
    category: "seminar",
    totalSeats: 150,
    availableSeats: 120,
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2000&auto=format&fit=crop"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");
    
    await Event.deleteMany({});
    console.log("Cleared existing events.");
    
    await Event.insertMany(events);
    console.log(`Successfully seeded ${events.length} events!`);
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
