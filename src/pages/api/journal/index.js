import { getToken } from 'next-auth/jwt';
import { jwt } from 'next-auth/jwt';
import { getCollection, connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Handler for journal API requests
 * GET: Retrieves all journals for the authenticated user
 * POST: Creates a new journal
 */
export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  let session = null;
  if (token) {
    session = {
      user: {
        id: token.id,
        email: token.email,
      },
    };
    console.log('Token is available: ', token);
  } else {
    console.log('Token is not available');
  }

  // Check authentication
  if (!session || !session.user) {
    console.error('Session is null');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { db } = await connectToDatabase();
    const journalCollection = db.collection('journals');

    switch (req.method) {
      case 'GET':
        const journals = await journalCollection
          .find({ userId: new ObjectId(session.user.id) })
          .sort({ createdAt: -1 })
          .toArray();
        return res.status(200).json(journals);

      case 'POST':
        const newJournal = {
          ...req.body,
          userId: new ObjectId(session.user.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await journalCollection.insertOne(newJournal);
        return res.status(201).json({
          _id: result.insertedId,
          ...newJournal,
        });

      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in journal API: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}