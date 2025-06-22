import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchLink } from '@/lib/search/searchLink';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userMessage } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You should respond in JSON only. You will be given a large text based on entertainment industry. You should find at max 5 movies, series etc talked about in the text. You should search for the official trailer using the tool. The tool will return 5 links, select the best link and send it back. You need to make separate tool calls for each movie/series. At max only 5 links are allowed to be sent back. The response format is { results=[{title: , description , link }]} Make sure you get links using the tool only named searchLink.also link should be from youtube imdb etc only , do not put twitter/ reddit or article links You MUST make multiple tool calls for different movies/series."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "searchLink",
            description: "Search the web and return top 5 results for movie/series trailers",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query for movie or series trailer"
                }
              },
              required: ["query"]
            }
          }
        }
      ],
      tool_choice: "auto",
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    const message = completion.choices[0].message;
    
    if (message.tool_calls && message.tool_calls.length > 0) {
      // Handle multiple tool calls
      const allResults = [];
      
      // Process up to 5 tool calls
      for (const toolCall of message.tool_calls.slice(0, 5)) {
        if (toolCall.function.name === "searchLink") {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            const searchResults = await searchLink(args.query);
            
            // Take the first/best result from each search
            if (searchResults && searchResults.length > 0) {
              allResults.push({
                title: searchResults[0].title,
                description: searchResults[0].snippet || searchResults[0].description,
                link: searchResults[0].link,
                query: args.query
              });
            }
          } catch (error) {
            console.error('Error processing tool call:', error);
          }
        }
      }

      // If we have tool call results, return them
      if (allResults.length > 0) {
        return NextResponse.json({
          results: allResults.slice(0, 5), // Ensure max 5 results
          totalResults: allResults.length
        });
      }
    }

    // Fallback: try to parse the content if no tool calls
    try {
      const contentResult = JSON.parse(message.content || "{}");
      return NextResponse.json(contentResult);
    } catch {
      return NextResponse.json({
        results: [],
        error: "No valid results found"
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
