/**
 * SquadCraft Database Seed Script
 * Run: npx ts-node src/scripts/seed.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Player } from "../models/player";
import { User } from "../models/user";
import { Notice } from "../models/notice";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

const players = [
  { name: "Marcus Hargreaves",   position: "Goalkeeper", goals: 0, rating: 8.2, jerseyNumber: 1,  nationality: "England" },
  { name: "Carlos Mendez",       position: "Defender",   goals: 2, rating: 7.8, jerseyNumber: 5,  nationality: "Spain" },
  { name: "Kwame Asante",        position: "Defender",   goals: 1, rating: 7.5, jerseyNumber: 4,  nationality: "Ghana" },
  { name: "Luca Bianchi",        position: "Defender",   goals: 3, rating: 7.9, jerseyNumber: 6,  nationality: "Italy" },
  { name: "Hamid Sultani",       position: "Defender",   goals: 0, rating: 7.3, jerseyNumber: 2,  nationality: "Morocco" },
  { name: "Ryo Tanaka",          position: "Midfielder", goals: 5, rating: 8.4, jerseyNumber: 8,  nationality: "Japan" },
  { name: "Dante Silva",         position: "Midfielder", goals: 7, rating: 8.7, jerseyNumber: 10, nationality: "Brazil" },
  { name: "Erik Lindström",      position: "Midfielder", goals: 4, rating: 8.1, jerseyNumber: 7,  nationality: "Sweden" },
  { name: "Youssef El Amine",    position: "Midfielder", goals: 6, rating: 8.5, jerseyNumber: 11, nationality: "Algeria" },
  { name: "Cian O'Sullivan",     position: "Forward",    goals: 14, rating: 9.1, jerseyNumber: 9, nationality: "Ireland" },
  { name: "Marko Petrović",      position: "Forward",    goals: 11, rating: 8.9, jerseyNumber: 12, nationality: "Serbia" },
  { name: "Adama Traoré",        position: "Forward",    goals: 9,  rating: 8.6, jerseyNumber: 19, nationality: "Ivory Coast" },
];

const notices = [
  {
    title: "Community Shield Preparation",
    content: "All first-team players must report to St. James Training Ground by 08:30 on Thursday. Tactical briefing followed by set-piece drills.",
    category: "Match",
  },
  {
    title: "Pre-Season Fitness Protocols",
    content: "New conditioning standards roll out Monday. All players are required to submit weekly biometric data via the squad app. Gym sessions extended to 90 minutes.",
    category: "Training",
  },
  {
    title: "Club Awards Night — Saturday 26th",
    content: "Annual awards ceremony and end-of-season dinner at the Grand Stadium Club Room. All staff and registered players are invited. Smart dress required.",
    category: "General",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB Atlas");

    // Clear old data
    await Player.deleteMany({});
    await User.deleteMany({});
    await Notice.deleteMany({});
    console.log("✓ Cleared existing collections");

    // Insert players
    const insertedPlayers = await Player.insertMany(players);
    console.log(`✓ Inserted ${insertedPlayers.length} players`);

    // Insert notices
    await Notice.insertMany(notices);
    console.log(`✓ Inserted ${notices.length} notices`);

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash("admin1234", salt);
    await User.create({
      username: "coach_silva",
      password: adminHash,
      role: "Admin",
    });

    // Create a player user linked to Cian O'Sullivan
    const cian = insertedPlayers.find((p) => p.name === "Cian O'Sullivan");
    const playerHash = await bcrypt.hash("player1234", salt);
    await User.create({
      username: "cian_osullivan",
      password: playerHash,
      role: "Player",
      playerId: cian?._id || null,
    });

    console.log("✓ Created users:");
    console.log("  Admin  → username: coach_silva  / password: admin1234");
    console.log("  Player → username: cian_osullivan / password: player1234");

    await mongoose.disconnect();
    console.log("\n✓ Seed complete. Database is ready.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
