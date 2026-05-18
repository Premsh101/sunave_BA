import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { transcript, template, customPrompt } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    // Default template if none provided
    const systemPrompt = template?.systemPrompt || `
You are an expert Enterprise Business Analyst and Scrum Master.
Your task is to take a meeting transcript and generate a highly structured, professional document based on the requested template.
Use markdown formatting strictly. Ensure clear headers, bullet points, and actionable language.
Do not invent information not present in the transcript.
`;

    const userPrompt = customPrompt || `
Please generate a Business Requirements Document (BRD) from the following transcript.
Include these sections if applicable:
1. Executive Summary
2. Business Objectives
3. Functional Requirements
4. Non-Functional Requirements
5. Action Items & Next Steps

Transcript:
"""
${transcript}
"""
`;

    // Initialize Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent([
      systemPrompt,
      userPrompt
    ]);

    const responseText = result.response.text();

    return NextResponse.json({ document: responseText }, { status: 200 });

  } catch (error: any) {
    console.error('Document generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate document' }, { status: 500 });
  }
}
