import { NextRequest } from "next/server";
import OpenAI from "openai";
import { streamText } from "ai";
import { openai } from '@ai-sdk/openai';

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const ASSISTANT_ID = "asst_WaTcbILAYzz2NrStuFa5i3iU";

// Function to remove source annotations from assistant response
function removeSourceAnnotations(text: string): string {
  // Remove patterns like 【35†source】, 【12:0†source】, etc.
  return text
    .replace(/【\d+:\d+†[^】]*】/g, '') // Remove 【12:0†source】 format
    .replace(/【\d+†[^】]*】/g, '')     // Remove 【35†source】 format
    .replace(/\[\d+:\d+\]/g, '')      // Remove [12:0] format
    .replace(/\[\d+\]/g, '')          // Remove [35] format
    .replace(/\s+/g, ' ')             // Clean up extra spaces
    .trim();                          // Remove leading/trailing spaces
}

export async function POST(req: NextRequest) {
  // Parse the request body ONCE at the beginning
  const { messages } = await req.json();
  
  try {
    // Get the latest user message
    const latestMessage = messages[messages.length - 1];

    // 1. Create a thread
    const thread = await client.beta.threads.create();

    // 2. Add the user message to the thread
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: latestMessage.content,
    });

    // 3. Create and poll the run with better error handling
    const run = await client.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    console.log(`Run completed with status: ${run.status}`);

    if (run.status === 'completed') {
      // Get the assistant's response
      const threadMessages = await client.beta.threads.messages.list(thread.id);
      const assistantMessage = threadMessages.data.find(
        msg => msg.role === 'assistant'
      );

      if (assistantMessage && assistantMessage.content[0].type === 'text') {
        let responseText = assistantMessage.content[0].text.value;
        
        // Remove source annotations from the response
        responseText = removeSourceAnnotations(responseText);
        
        // console.log('Original response:', assistantMessage.content[0].text.value);
        // console.log('Cleaned response:', responseText);
        
        // Stream the cleaned assistant's response
        const result = streamText({
          model: openai('gpt-4o'),
          messages: [
            {
              role: 'assistant',
              content: responseText,
            },
          ],
        });

        return result.toDataStreamResponse();
      }
    }

    // Handle failed runs - get error details
    if (run.status === 'failed') {
      console.error('Assistant run failed:', {
        runId: run.id,
        lastError: run.last_error,
        failedAt: run.failed_at
      });
      
      // Log the last error if available
      if (run.last_error) {
        console.error('Failure details:', run.last_error);
      }
    }

    // For any non-completed status, fall back to direct model
    console.log(`Assistant run status: ${run.status}, falling back to direct model`);
    
  } catch (error) {
    console.error('Error with assistant:', error);
  }

  // Fallback to direct model call (using already parsed messages)
  console.log('Using fallback direct model call');
  
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}
