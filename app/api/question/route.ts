import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { Question } from '@/models/question';

const MONGO_DB_URI = process.env.MONGO_DB_KEY || '';

// MongoDB Client Singleton
const client = new MongoClient(MONGO_DB_URI);
const db = client.db('leetcode_clone');
const questionsCollection = db.collection<Question>('questions');

// Handle API Requests
export async function GET() {
    try {
        const questions = await questionsCollection.find({}).toArray();
        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
