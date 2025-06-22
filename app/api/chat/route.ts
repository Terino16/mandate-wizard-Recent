import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Your Assistant ID
const ASSISTANT_ID = "asst_WaTcbILAYzz2NrStuFa5i3iU";

// Set the runtime to edge for best streaming performance
export const runtime = 'edge';

// Function to remove source annotations from the assistant's response
// This function is preserved exactly as you provided it.
function removeSourceAnnotations(text: string): string {
  // Remove patterns like 【35†source】, 【12:0†source】, etc.
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
    // Parse the request body to get the user's message and the current thread ID
    const { threadId: currentThreadId, message } = await req.json();

    // Create a new thread if one doesn't exist, otherwise use the existing one
    const threadId = currentThreadId ?? (await openai.beta.threads.create({})).id;

    // Add the user's message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Use AssistantResponse to handle the streaming interaction
    return AssistantResponse(
      {
        threadId: threadId,
        messageId: createdMessage.id,
      },
     // eslint-disable-next-line
      async ({ forwardStream, sendDataMessage }) => {
        // Create the run and begin streaming
        const runStream = openai.beta.threads.runs.stream(threadId, {
          assistant_id: ASSISTANT_ID,
        });

        // This part is key: we're intercepting the stream to process text
        // before forwarding it to the client.
        await forwardStream(
          runStream.on('textCreated', () => {
              // This event is fired when the assistant starts generating text.
              // We don't need to do anything here, but it's available.
              console.log('Assistant has started generating text...');
              // eslint-disable-next-line
          }).on('textDelta', (delta, snapshot) => {
              // This event gives us the small 'delta' of new text.
              // We could apply cleaning here, but cleaning the full text is more reliable.
          }).on('textDone', (text) => {
              // This event fires when a complete text block is available.
              // We clean the final text here before it's fully processed.
              text.value = removeSourceAnnotations(text.value);
              console.log('Cleaned final text block.');
          })
          // We can also handle other events like tool calls if needed
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
