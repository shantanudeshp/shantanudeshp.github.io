const fs = require('fs');

// Test questions for model comparison
const testQuestions = [
  // Work experience questions
  "tell me about your work at quinstreet",
  "what did you do at general analysis?", 
  "describe your research experience",
  
  // Technical questions
  "what programming languages do you know?",
  "tell me about your AI/ML projects",
  "what's your tech stack?",
  
  // Personal questions
  "what do you do for fun?",
  "do you go to the gym?",
  "what are your hobbies?",
  
  // Conversational tests
  "hi there",
  "what's your name?",
  "tell me about yourself"
];

async function testModel(modelName, apiUrl) {
  console.log(`\n🤖 Testing ${modelName}...`);
  const results = [];
  
  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`[${i + 1}/${testQuestions.length}] "${question}"`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question })
      });
      
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      const result = {
        question,
        response: data.message || data.error || 'No response',
        status: response.status,
        responseTime,
        timestamp: new Date().toISOString(),
        wordCount: data.message ? data.message.split(' ').length : 0,
        charCount: data.message ? data.message.length : 0
      };
      
      results.push(result);
      console.log(`✅ ${result.wordCount} words, ${responseTime}ms`);
      
      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      const result = {
        question,
        response: `ERROR: ${error.message}`,
        status: 'error',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        wordCount: 0,
        charCount: 0
      };
      
      results.push(result);
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  return results;
}

async function compareModels() {
  const timestamp = new Date().toISOString();
  console.log(`🔬 Model Comparison Test - ${timestamp}`);
  
  // Test Scout model (current)
  const scoutResults = await testModel(
    'Llama-4-Scout', 
    'https://shantanudeshp-github-nekenwqgc-shantanus-projects-a40733a8.vercel.app/api/chat'
  );
  
  // We'll need to create a separate endpoint for 3.3-70b or modify the existing one
  console.log('\n⚠️  To test Llama 3.3 70B, we need to create a separate API endpoint or modify the existing one.');
  console.log('For now, generating Scout-only report...');
  
  // Generate comparison report
  const report = generateComparisonReport(scoutResults, null, timestamp);
  const filename = `model-comparison-${timestamp.replace(/[:.]/g, '-')}.md`;
  fs.writeFileSync(filename, report);
  
  // Save raw data
  const dataFilename = `model-comparison-data-${timestamp.replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(dataFilename, JSON.stringify({
    scout: scoutResults,
    llama33: null,
    timestamp
  }, null, 2));
  
  console.log(`\n📊 Results saved to: ${filename}`);
  console.log(`📊 Raw data saved to: ${dataFilename}`);
  
  generateStats(scoutResults);
}

function generateStats(results) {
  const successful = results.filter(r => r.status === 200);
  const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
  const avgWordCount = successful.reduce((sum, r) => sum + r.wordCount, 0) / successful.length;
  const avgCharCount = successful.reduce((sum, r) => sum + r.charCount, 0) / successful.length;
  
  console.log('\n📈 SCOUT MODEL STATS');
  console.log('==================');
  console.log(`Success rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  console.log(`Avg response time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`Avg word count: ${avgWordCount.toFixed(1)} words`);
  console.log(`Avg char count: ${avgCharCount.toFixed(0)} characters`);
  console.log(`Total questions: ${results.length}`);
}

function generateComparisonReport(scoutResults, llama33Results, timestamp) {
  let report = `# Model Comparison Report\n\n`;
  report += `**Test Date:** ${timestamp}\n`;
  report += `**Models Tested:** Llama-4-Scout${llama33Results ? ' vs Llama-3.3-70B' : ' (solo test)'}\n\n`;
  
  if (scoutResults) {
    const successful = scoutResults.filter(r => r.status === 200);
    const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
    const avgWordCount = successful.reduce((sum, r) => sum + r.wordCount, 0) / successful.length;
    
    report += `## Llama-4-Scout Results\n\n`;
    report += `- **Success Rate:** ${((successful.length / scoutResults.length) * 100).toFixed(1)}%\n`;
    report += `- **Avg Response Time:** ${avgResponseTime.toFixed(0)}ms\n`;
    report += `- **Avg Response Length:** ${avgWordCount.toFixed(1)} words\n`;
    report += `- **Total Tests:** ${scoutResults.length}\n\n`;
  }
  
  report += `## Detailed Responses\n\n`;
  
  scoutResults.forEach((result, index) => {
    report += `### ${index + 1}. "${result.question}"\n\n`;
    report += `**Scout Response:** ${result.response}\n\n`;
    report += `- Words: ${result.wordCount}\n`;
    report += `- Response Time: ${result.responseTime}ms\n`;
    report += `- Status: ${result.status}\n\n`;
    report += `---\n\n`;
  });
  
  return report;
}

if (require.main === module) {
  compareModels()
    .then(() => {
      console.log('\n✅ Model comparison completed!');
    })
    .catch(error => {
      console.error('❌ Comparison failed:', error);
      process.exit(1);
    });
}

module.exports = { compareModels, testModel };