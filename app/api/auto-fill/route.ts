import { NextResponse } from "next/server";
import OpenAI from "openai";

// Make OpenAI client initialization conditional
let openai: OpenAI | null = null;
let initError: string | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("✅ OpenAI client initialized successfully");
  } else {
    initError = "OPENAI_API_KEY environment variable is not set";
    console.warn("❌ OpenAI client initialization failed:", initError);
  }
} catch (error) {
  initError = error instanceof Error ? error.message : String(error);
  console.warn("❌ OpenAI client could not be initialized:", error);
}

export async function POST(req: Request) {
  console.log("🔄 Auto-fill API called");
  try {
    // Check if OpenAI is available
    if (!openai) {
      const errorMessage = initError || "OpenAI client is not available";
      console.error("❌ Auto-fill request failed:", errorMessage);
      return NextResponse.json(
        { 
          error: "OpenAI service is not available", 
          details: errorMessage,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    const { courseTitle } = await req.json();

    if (!courseTitle) {
      return NextResponse.json(
        { error: "courseTitle is required" },
        { status: 400 } 
      );
    }

    const prompt = `
For a course named "${courseTitle}", please generate course details in Mongolian language:

1. subtitle: A concise subtitle (e.g., "HSK 4 түвшин")
2. description: A brief appealing description (1-2 sentences)
3. price: A realistic price in Mongolian Tugrik (e.g., "450,000₮")
4. duration: Course duration (e.g., "40 цаг", "6 сар")
5. slug: URL-friendly slug (lowercase, hyphens, no spaces, e.g., "hsk-4-course")
6. features: Array of 4-5 key features/benefits in Mongolian
7. fullTitle: A comprehensive course title in Mongolian
8. startDate: A realistic start date (e.g., "9 сарын 4")
9. schedule: Class schedule (e.g., "Даваа – Баасан 10:00 – 12:00")
10. frequency: How often classes occur (e.g., "Долоо хоногт 5 удаа 2 цагаар хичээллэх болно")
11. classSize: Number of students (e.g., "5 сурагч", "10 сурагч")
12. teacher: Teacher description (e.g., "Хятад багш, Монгол багш, Солонгос багш, Америк багш")

Return the output as a JSON object with these exact keys: "subtitle", "description", "price", "duration", "slug", "features", "fullTitle", "startDate", "schedule", "frequency", "classSize", "teacher".

Example format:
{
  "subtitle": "HSK 4 түвшин",
  "description": "Хятад хэлний үндсийг эзэмших",
  "price": "450,000₮",
  "duration": "40 цаг",
  "slug": "hsk-4-course",
  "features": ["Мэргэжлийн Хятад багш", "Бага хүний тоо", "Түргэвчилсэн хөтөлбөр", "HSK 4 түвшинд бэлтгэх"],
  "fullTitle": "HSK 4-ын ТҮРГЭВЧИЛСЭН АНГИ",
  "startDate": "9 сарын 4",
  "schedule": "Даваа – Баасан 10:00 – 12:00",
  "frequency": "Долоо хоногт 5 удаа 2 цагаар хичээллэх болно",
  "classSize": "5 сурагч",
  "teacher": "Хятад багш хичээл заах болно"
}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates course details in Mongolian language. Focus on creating realistic, appealing course information for MBG Education Center.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" }, // Request JSON output
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Failed to get content from OpenAI" },
        { status: 500 }
      );
    }

    // Attempt to parse the content, as OpenAI should return a JSON string
    // when response_format: { type: "json_object" } is used.
    try {
      const parsedContent = JSON.parse(content);
      console.log("✅ Auto-fill completed successfully for course:", courseTitle);
      return NextResponse.json(parsedContent);
    } catch (parseError) {
      console.error("❌ Error parsing OpenAI response:", parseError);
      console.error("Raw OpenAI response content:", content);
      return NextResponse.json(
        { 
          error: "Failed to parse AI-generated content", 
          details: "Invalid JSON response from AI service",
          rawContent: content,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("❌ Error in auto-fill API route:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { 
        error: "Auto-fill service error",
        details: error.message || "An unknown error occurred",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}