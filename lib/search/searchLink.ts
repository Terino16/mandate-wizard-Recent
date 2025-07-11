export async function searchLink(query: string) {
  try {
    const serpApiKey = process.env.SERP_API_KEY;
    
    const response = await fetch(`https://serpapi.com/search?engine=google&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=5`);
    
    const data = await response.json();
    //eslint-disable-next-line
    return data.organic_results?.slice(0, 5).map((result: any) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet
    })) || [];
    
  } catch (error) {
    throw new Error(`Search failed: ${error}`);
  }
}

export async function searchLink2(query: string) {
  try {
    const serperApiKey = process.env.SERPER_API_KEY;
    
    if (!serperApiKey) {
      throw new Error('SERPER_API_KEY environment variable is not set');
    }
    
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 5
      })
    });
    
    const data = await response.json();
    
    return data.organic?.slice(0, 5).map((result: any) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet
    })) || [];
    
  } catch (error) {
    throw new Error(`Search failed: ${error}`);
  }
}


