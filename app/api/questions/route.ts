import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { Question } from '../../../lib/dabatase/models/question';

const MONGO_DB_URI = process.env.MONGO_DB_KEY || '';

// MongoDB Client Singleton
let client: MongoClient | null = null;

async function getMongoClient() {
  if (!client) {
    client = new MongoClient(MONGO_DB_URI);
    await client.connect();
  }
  return client;
}

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db('litcodedb');
    const questionsCollection = db.collection<Question>('questions');

    // Debug: Log database connection and collection names
    console.log('Connected to MongoDB:', MONGO_DB_URI);
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map((col) => col.name));

    // Fetch all questions
    const questions = await questionsCollection.find({}).toArray();

    // Debug: Log fetched questions
    console.log('Fetched questions:', questions);

    if (questions.length === 0) {
      console.warn('No questions found in the database.');
    }

    return NextResponse.json({ 
      success: true, 
      data: questions 
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
