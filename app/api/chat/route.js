export async function POST(request) {
  const body = await request.json();
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return Response.json(data);
}
