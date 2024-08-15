// pages/api/register.js

import clientPromise from '../../lib/mongodb';

export default async function register(req, res) {
  const { username, password } = req.body;

  const client = await clientPromise;
  const db = client.db('simple-API-users');
  const usersCollection = db.collection('users');

  const userExists = await usersCollection.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  await usersCollection.insertOne({ username, password });

  return res.status(200).json({ message: 'User registered successfully' });
}
