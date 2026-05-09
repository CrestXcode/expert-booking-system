require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const connectDB = require('./config/db');

const generateSlots = () => {
  const slots = [];
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
  for (let d = 1; d <= 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    times.forEach((time) => slots.push({ date: dateStr, time, isBooked: false }));
  }
  return slots;
};

const experts = [
  { name: 'Arjun Mehta', category: 'Technology', experience: 8, rating: 4.8, bio: 'Full-stack engineer and system design expert.', hourlyRate: 2500 },
  { name: 'Priya Sharma', category: 'Finance', experience: 12, rating: 4.9, bio: 'Certified financial planner with expertise in investments.', hourlyRate: 3000 },
  { name: 'Dr. Kavya Nair', category: 'Health', experience: 15, rating: 4.7, bio: 'General physician and wellness consultant.', hourlyRate: 2000 },
  { name: 'Rohit Verma', category: 'Legal', experience: 10, rating: 4.6, bio: 'Corporate lawyer specializing in startup law.', hourlyRate: 3500 },
  { name: 'Sneha Patel', category: 'Business', experience: 7, rating: 4.5, bio: 'Business strategist and startup mentor.', hourlyRate: 2800 },
  { name: 'Vikram Singh', category: 'Education', experience: 6, rating: 4.4, bio: 'IIT graduate and competitive exam coach.', hourlyRate: 1500 },
  { name: 'Anika Joshi', category: 'Design', experience: 5, rating: 4.7, bio: 'UI/UX designer with Fortune 500 experience.', hourlyRate: 2200 },
  { name: 'Karan Malhotra', category: 'Marketing', experience: 9, rating: 4.3, bio: 'Growth hacker and digital marketing expert.', hourlyRate: 2600 },
];

const seed = async () => {
  await connectDB();
  await Expert.deleteMany();
  const expertsWithSlots = experts.map((e) => ({ ...e, availableSlots: generateSlots() }));
  await Expert.insertMany(expertsWithSlots);
  console.log('Seeded successfully!');
  process.exit();
};

seed();