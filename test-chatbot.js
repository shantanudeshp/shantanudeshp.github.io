const fs = require('fs');

// Test questions to evaluate chatbot responses
const testQuestions = [
  // Work experience questions
  "tell me about your work at quinstreet",
  "what did you do at general analysis?",
  "describe your ancova capital internship",
  "what's your research experience?",
  
  // Technical questions
  "what programming languages do you know?",
  "what's your favorite tech stack?",
  "tell me about your projects",
  "what AI/ML experience do you have?",
  
  // Personal questions
  "what do you do for fun?",
  "do you go to the gym?",
  "what books do you read?",
  "tell me about your food preferences",
  "do you play any games?",
  
  // School questions
  "what do you study at uc davis?",
  "when do you graduate?",
  "what classes have you taken?",
  
  // Random/edge cases
  "hi",
  "what's your name?",
  "where are you from?",
  "what's the weather like?",
  "tell me a joke"
];

async function testChatbot(apiUrl) {
  const results = [];
  const timestamp = new Date().toISOString();
  
  console.log(`🤖 Testing chatbot at ${apiUrl}`);
  console.log(`📅 Started at: ${timestamp}\n`);
  
  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`[${i + 1}/${testQuestions.length}] Testing: "${question}"`);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question })
      });
      
      const data = await response.json();
      
      const result = {
        question,
        response: data.message || data.error || 'No response',
        status: response.status,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - Date.now() // Placeholder for timing
      };
      
      results.push(result);
      console.log(`✅ Response: "${result.response.substring(0, 100)}..."`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      const result = {
        question,
        response: `ERROR: ${error.message}`,
        status: 'error',
        timestamp: new Date().toISOString(),
        responseTime: null
      };
      
      results.push(result);
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Save results to file
  const filename = `chatbot-test-${timestamp.replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  
  // Generate summary
  const successful = results.filter(r => r.status === 200).length;
  const failed = results.length - successful;
  
  console.log('📊 TEST SUMMARY');
  console.log('================');
  console.log(`Total questions: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((successful / results.length) * 100).toFixed(1)}%`);
  console.log(`Results saved to: ${filename}`);
  
  // Generate readable report
  const reportFilename = `chatbot-report-${timestamp.replace(/[:.]/g, '-')}.md`;
  const report = generateReport(results, timestamp);
  fs.writeFileSync(reportFilename, report);
  console.log(`Report saved to: ${reportFilename}`);
  
  return results;
}

function generateReport(results, timestamp) {
  let report = `# Chatbot Test Report\n\n`;
  report += `**Test Date:** ${timestamp}\n`;
  report += `**Total Questions:** ${results.length}\n`;
  report += `**Success Rate:** ${((results.filter(r => r.status === 200).length / results.length) * 100).toFixed(1)}%\n\n`;
  
  report += `## Test Results\n\n`;
  
  results.forEach((result, index) => {
    const status = result.status === 200 ? '✅' : '❌';
    report += `### ${index + 1}. ${status} "${result.question}"\n\n`;
    report += `**Response:** ${result.response}\n\n`;
    report += `**Status:** ${result.status}\n`;
    report += `**Time:** ${result.timestamp}\n\n`;
    report += `---\n\n`;
  });
  
  return report;
}

// Usage
if (require.main === module) {
  const apiUrl = process.argv[2];
  
  if (!apiUrl) {
    console.log('Usage: node test-chatbot.js <API_URL>');
    console.log('Example: node test-chatbot.js https://your-site.vercel.app/api/chat');
    process.exit(1);
  }
  
  testChatbot(apiUrl)
    .then(() => {
      console.log('\n✅ Testing completed!');
    })
    .catch(error => {
      console.error('❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { testChatbot, testQuestions };