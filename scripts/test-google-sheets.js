// 测试Google Sheets邮箱收集功能的脚本
// 运行方式: node scripts/test-google-sheets.js

const { submitEmailToGoogleSheets, isValidEmail } = require('../lib/googleSheets');

async function testEmailSubmission() {
  console.log('🧪 开始测试Google Sheets邮箱收集功能...\n');

  // 测试用例
  const testCases = [
    {
      name: '有效邮箱测试',
      email: 'test@example.com',
      source: 'test-script',
      note: 'automated-test',
      expectedSuccess: true
    },
    {
      name: '无效邮箱测试',
      email: 'invalid-email',
      source: 'test-script',
      note: 'automated-test',
      expectedSuccess: false
    },
    {
      name: '空邮箱测试',
      email: '',
      source: 'test-script',
      note: 'automated-test',
      expectedSuccess: false
    },
    {
      name: '重复邮箱测试',
      email: 'test@example.com',
      source: 'test-script-duplicate',
      note: 'duplicate-test',
      expectedSuccess: true // Google Sheets会处理重复邮箱
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`📧 测试: ${testCase.name}`);
    console.log(`   邮箱: ${testCase.email}`);
    
    try {
      const result = await submitEmailToGoogleSheets(
        testCase.email, 
        testCase.source, 
        testCase.note
      );
      
      console.log(`   结果: ${result.success ? '✅ 成功' : '❌ 失败'}`);
      console.log(`   消息: ${result.message}`);
      
      if (result.success === testCase.expectedSuccess) {
        console.log(`   ✅ 测试通过\n`);
        passedTests++;
      } else {
        console.log(`   ❌ 测试失败 (期望: ${testCase.expectedSuccess ? '成功' : '失败'})\n`);
      }
    } catch (error) {
      console.log(`   ❌ 测试异常: ${error.message}\n`);
    }
  }

  // 测试邮箱验证函数
  console.log('📝 测试邮箱验证函数...');
  const emailValidationTests = [
    { email: 'test@example.com', expected: true },
    { email: 'user.name@domain.co.uk', expected: true },
    { email: 'invalid-email', expected: false },
    { email: '@domain.com', expected: false },
    { email: 'user@', expected: false },
    { email: '', expected: false }
  ];

  let validationPassed = 0;
  for (const test of emailValidationTests) {
    const result = isValidEmail(test.email);
    if (result === test.expected) {
      console.log(`   ✅ ${test.email} -> ${result}`);
      validationPassed++;
    } else {
      console.log(`   ❌ ${test.email} -> ${result} (期望: ${test.expected})`);
    }
  }

  // 总结
  console.log('\n📊 测试总结:');
  console.log(`   邮箱提交测试: ${passedTests}/${totalTests} 通过`);
  console.log(`   邮箱验证测试: ${validationPassed}/${emailValidationTests.length} 通过`);
  
  const allTestsPassed = passedTests === totalTests && validationPassed === emailValidationTests.length;
  console.log(`   总体结果: ${allTestsPassed ? '✅ 全部通过' : '❌ 部分失败'}`);
  
  if (!allTestsPassed) {
    console.log('\n⚠️  请检查Google Apps Script配置和网络连接');
    process.exit(1);
  } else {
    console.log('\n🎉 所有测试通过！Google Sheets邮箱收集功能正常工作');
  }
}

// 运行测试
testEmailSubmission().catch(error => {
  console.error('❌ 测试运行失败:', error);
  process.exit(1);
});