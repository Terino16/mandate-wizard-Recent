import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Your Assistant ID
const ASSISTANT_ID = "asst_76Cv3n3VMsRmi49pbJigj2Qn";

// Set the runtime to edge for best streaming performance
export const runtime = 'edge';

// Function to remove source annotations from the assistant's response
function removeSourceAnnotations(text: string): string {

  return text
    .replace(/【\d+:\d+†[^】]*】/g, '') // Remove 【12:0†source】 format
    .replace(/【\d+†[^】]*】/g, '')     // Remove 【35†source】 format
    .replace(/\[\d+:\d+\]/g, '')       // Remove [12:0] format
    .replace(/\[\d+\]/g, '')           // Remove [35] format
    .replace(/\s+/g, ' ')              // Clean up extra spaces
    .trim();                           // Remove leading/trailing spaces
}

export async function POST(req: Request) {
  try {
    const { threadId: currentThreadId, message } = await req.json();

    // Deduct credits before processing the message
    const deductResponse = await fetch(`${req.headers.get('origin')}/api/chat/deduct-credits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
      },
    });

    if (!deductResponse.ok) {
      const errorData = await deductResponse.json();
      if (errorData.error === 'Insufficient credits') {
        return new Response('Insufficient credits', { status: 402 });
      }
      return new Response('Failed to deduct credits', { status: 500 });
    }

    const threadId = currentThreadId ?? (await openai.beta.threads.create({})).id;

    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });


    return AssistantResponse(
      {
        threadId: threadId,
        messageId: createdMessage.id,
      },
      async ({ forwardStream }) => {
        const runStream = openai.beta.threads.runs.stream(threadId, {
          assistant_id: ASSISTANT_ID,
        });


        await forwardStream(
          runStream.on('textCreated', () => {

              console.log('Assistant has started generating text...');

          }).on('textDelta', (delta, snapshot) => {
          }).on('textDone', (text) => {

              text.value = removeSourceAnnotations(text.value);
              console.log('Cleaned final text block.');
          })
          .on('toolCallCreated', (toolCall) => {
              console.log(`Tool call created: ${toolCall.type}`);
          })
        );
      },
    );
  } catch (error) {
    console.error('An error occurred in the chat route:', error);
    // Return a generic error response
    return new Response('An internal server error occurred.', { status: 500 });
  }
}