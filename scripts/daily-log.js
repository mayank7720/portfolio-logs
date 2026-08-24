const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n⚡ Mayank\'s GitHub Activity Logger ⚡\n');

rl.question('What coding task or concept did you work on today? ', (answer) => {
  if (!answer.trim()) {
    console.log('❌ Error: Entry cannot be empty.');
    rl.close();
    return;
  }

  // Ensure directories exist
  const logDir = './logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const logFilePath = './logs/learning_journal.md';
  const header = '# 📚 Coding & Learning Journal\n\nTrack progress, lessons learned, and daily commitments here.\n';
  
  // Create file with header if it doesn't exist
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, header);
  }

  // Append new logs
  const logEntry = `\n- **[${date}]**: ${answer}`;
  fs.appendFileSync(logFilePath, logEntry);
  console.log(`\n✅ Saved log to: ${logFilePath}`);

  try {
    console.log('🔄 Indexing changes, committing, and pushing to GitHub...');
    
    // Run git commands synchronously
    execSync('git add logs/learning_journal.md');
    execSync(`git commit -m "docs: journal update for ${date}"`);
    execSync('git push');
    
    console.log('🚀 Pushed successfully! Your contribution tile is now active.');
  } catch (error) {
    console.log('\n⚠️ Git command failed. Ensure that:');
    console.log('1. This directory is initialized as a Git repo (run: git init)');
    console.log('2. A remote github URL is linked (run: git remote add origin <url>)');
    console.log('3. You have write permissions and are authenticated.');
  }

  rl.close();
});
