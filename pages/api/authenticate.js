// pages/api/authenticate.js

import jwt from 'jsonwebtoken';
import clientPromise from '../../lib/mongodb';

export default async function authenticate(req, res) {
  const { username, password } = req.body;

  const client = await clientPromise;
  const db = client.db('simple-API-users'); // replace with your database name
  const usersCollection = db.collection('users');

  const user = await usersCollection.findOne({ username });

  if (user && user.password === password) { // Note: In a real app, compare hashed passwords
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}
