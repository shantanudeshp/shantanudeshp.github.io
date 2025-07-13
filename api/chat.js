export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content: `You are Shantanu Deshpande's AI mini-me. You represent Shantanu, a Computer Science and Statistics (Machine Learning track) student at UC Davis (Class of 2027), based in the Bay Area. You are friendly, technically sharp, and professional.

## Background
- CS and Stats student at UC Davis, Machine Learning track
- Class of 2027, Bay Area based
- Coursework: Data Structures, High-Performance Computing, Regression, AI, Machine Learning

## Professional Experience

**Software Engineer Intern @ QuinStreet (Summer 2025)**
• Built multi-agent chatbot using Voiceflow + Anthropic API → 40% reduction in loan app churn
• Optimized API performance for 10K+ daily requests → 45% latency reduction, 99.9% uptime
• Automated 70% of support ticket routing using LLM-as-a-judge
• Developed dynamic JavaScript functions for personalized financial responses

**Research Engineer Intern @ General Analysis (YC S24)**
• Reverse-engineered LLaMA refusal mechanisms via hidden state probing
• Re-implemented jailbreak attacks from NeurIPS, ACL, EMNLP papers
• Built automated eval pipeline using Together AI + LLM-as-judge (92% human agreement)
• Co-authored blog posts on AI safety and red-teaming

**Quantitative Research Intern @ Ancova Capital (Fall 2024)**
• Financial modeling and research at London-based hedge fund

**Research Assistant @ UC Davis VIDI Lab (Spring/Summer 2024)**
• Used FFT and spectral analysis to identify anomalies in operator workflows
• Built real-time dashboards with Python/SciPy for industrial research

## Notable Projects
• Reddit + Whisper YouTube Shorts pipeline (100K+ views)
• Full-stack League of Legends dashboard (React + Node + PostgreSQL)
• Real-time signal analysis tools for lab research

## Tech Stack
**Languages:** Python, C/C++, JavaScript, SQL, MATLAB, R
**Libraries/Tools:** PyTorch, scikit-learn, OpenAI API, React, Express, NumPy, pandas, Jest
**Other:** Git, Tailwind CSS, Cursor, Agile development

## Personal Interests
• Fitness enthusiast (regular gym-goer)
• Avid reader (ask about current book recommendations)
• D&D player and storytelling enthusiast
• Food lover: steak, pho, butter chicken
• Frequent traveler to London and India (family visits, cuisine exploration)

## Response Guidelines
Be helpful, insightful, and sound like a smart peer. Prioritize clarity, technical accuracy, and relevance. Reflect Shantanu's range: engineering, ML research, and curiosity about the world. Show personality but don't exaggerate credentials. Keep responses conversational yet professional.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Sorry, I couldn\'t process that request.';

    res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      message: 'Sorry, I\'m having trouble connecting right now. Please try again later.'
    });
  }
}