import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Centralised model config — override via GEMINI_MODEL env var if needed.
// gemini-2.0-flash is the stable, widely-available default.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_FALLBACK_MODEL = 'gemini-2.0-flash';

const DOCUMENT_PROMPTS: Record<string, { title: string; sections: string }> = {
  brd: {
    title: 'Business Requirements Document (BRD)',
    sections: `1. Executive Summary
2. Business Objectives & Goals
3. Scope & Out of Scope
4. Stakeholders
5. Functional Requirements
6. Non-Functional Requirements
7. Assumptions & Constraints
8. Action Items & Next Steps`,
  },
  frd: {
    title: 'Functional Requirements Document (FRD)',
    sections: `1. Overview
2. System Context
3. Functional Requirements (use FR-001, FR-002 numbering)
4. Non-Functional Requirements
5. Data Requirements
6. Integration Points
7. Open Questions`,
  },
  mom: {
    title: 'Minutes of Meeting (MOM)',
    sections: `1. Meeting Details (Date, Attendees, Purpose)
2. Agenda Items Discussed
3. Key Decisions Made
4. Action Items (Owner, Due Date)
5. Next Steps
6. Next Meeting (if mentioned)`,
  },
  'user-stories': {
    title: 'User Stories',
    sections: `Generate user stories in the format: "As a [role], I want [feature] so that [benefit]."
Include Acceptance Criteria for each story.
Group stories by Epic/Feature area.`,
  },
  'acceptance-criteria': {
    title: 'Acceptance Criteria',
    sections: `For each feature or requirement identified:
1. Feature Name
2. Given / When / Then criteria (Gherkin format where appropriate)
3. Edge Cases & Exceptions
4. Out of Scope`,
  },
  'sprint-tasks': {
    title: 'Sprint Tasks',
    sections: `1. Sprint Goal
2. Task Breakdown (with story points or t-shirt sizing)
3. Dependencies
4. Technical Debt Items
5. Team Assignments (if mentioned)
6. Definition of Done`,
  },
  'test-scenarios': {
    title: 'Test Scenarios',
    sections: `1. Test Objectives
2. Functional Test Scenarios (TC-001, TC-002 format)
3. Integration Test Scenarios
4. Edge & Negative Test Cases
5. Performance Test Considerations`,
  },
  'action-items': {
    title: 'Action Items',
    sections: `List all action items in a table format:
| # | Action Item | Owner | Due Date | Priority | Status |

Then provide a brief summary section.`,
  },
  'risks-dependencies': {
    title: 'Risks & Dependencies',
    sections: `1. Risk Register (Risk, Probability, Impact, Mitigation)
2. External Dependencies
3. Internal Dependencies
4. Blockers
5. Assumptions`,
  },
  'grooming-questions': {
    title: 'Grooming Questions',
    sections: `Generate clarifying questions that need to be answered before development can begin.
Group by: Technical Clarifications, Business Logic, UX/Design, Integration, Edge Cases.`,
  },
  'follow-up-email': {
    title: 'Follow-up Email',
    sections: `Write a professional follow-up email including:
- Subject line
- Brief recap of meeting purpose
- Key decisions made
- Action items per person
- Next steps
- Professional closing`,
  },
  'stakeholder-summary': {
    title: 'Stakeholder Summary',
    sections: `1. Executive Summary (non-technical, 3-4 sentences)
2. Business Impact
3. Key Decisions
4. Timeline Overview
5. Risks & Concerns
6. Next Steps`,
  },
  custom: {
    title: 'Custom Document',
    sections: 'Generate a well-structured professional document from this transcript.',
  },
};

export async function POST(request: Request) {
  try {
    const { transcript, documentType, customInstructions, template, customPrompt } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const type = documentType || 'brd';
    const docConfig = DOCUMENT_PROMPTS[type] || DOCUMENT_PROMPTS.brd;

    const systemPrompt = template?.systemPrompt || `You are an expert Enterprise Business Analyst, Scrum Master, and Technical Writer.
Your task is to take a meeting transcript and generate a highly structured, professional ${docConfig.title}.
Use markdown formatting strictly. Ensure clear headers, bullet points, and actionable language.
Do not invent information not present in the transcript. If information for a section is not available, note it as "Not discussed" rather than omitting the section.`;

    const additionalInstructions = customInstructions
      ? `\n\nAdditional Instructions:\n${customInstructions}`
      : '';

    const userPrompt = customPrompt || `Please generate a ${docConfig.title} from the following transcript.

Include these sections:
${docConfig.sections}${additionalInstructions}

Transcript:
"""
${transcript}
"""`;

    let modelName = GEMINI_MODEL;
    let model = genAI.getGenerativeModel({ model: modelName });

    let result;
    try {
      console.log('[Gemini] Generating document with model: %s (type: %s)', modelName, type);
      result = await model.generateContent([systemPrompt, userPrompt]);
    } catch (primaryErr: any) {
      console.error('[Gemini] Model %s failed: %s', modelName, primaryErr.message);
      if (modelName !== GEMINI_FALLBACK_MODEL) {
        console.log('[Gemini] Falling back to model: %s', GEMINI_FALLBACK_MODEL);
        modelName = GEMINI_FALLBACK_MODEL;
        model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent([systemPrompt, userPrompt]);
        console.log('[Gemini] Fallback model %s succeeded', modelName);
      } else {
        throw primaryErr;
      }
    }

    const responseText = result.response.text();
    console.log('[Gemini] Document generated successfully (model: %s, chars: %d)', modelName, responseText.length);

    return NextResponse.json({ document: responseText, model: modelName }, { status: 200 });

  } catch (error: any) {
    console.error('[Gemini] Document generation failed:', error?.message || error);
    return NextResponse.json({ error: error.message || 'Failed to generate document' }, { status: 500 });
  }
}
