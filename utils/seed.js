const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getUsername, getEmail } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  await Thought.deleteMany({});

  await User.deleteMany({});

  // Create empty array to hold the students
  const users = [];

  // Loop 20 times -- add students to the students array
  for (let i = 0; i < 10; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data

    const username = getUsername(i);
    const email = getEmail(i);    

    users.push({
      username,
      email,
    });
  }

  await User.collection.insertMany(users);

  

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
