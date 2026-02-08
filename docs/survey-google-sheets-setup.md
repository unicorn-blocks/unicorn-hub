# Survey Google Sheets 设置指南

## 步骤 1: 创建新的 Google Sheet

1. 访问 [Google Sheets](https://sheets.google.com)
2. 创建新的空白表格，命名为 **"Unicorn Blocks Survey Responses"**
3. 在第一行添加以下列标题 (从 A1 开始):

| 列 | 标题名称 | 说明 |
|----|----------|------|
| A | Timestamp | 提交时间 |
| B | Source | 触发来源 (bottom / pop-modal) |
| C | Q1_StopReason | 什么阻止了购买 |
| D | Q1_Other | Q1 Other选项的详细说明 |
| E | Q1B_MissingInfo | 缺少什么信息 |
| F | Q1D_TrustConcerns | 信任/安全顾虑 |
| G | Q2_Likes | 喜欢什么 |
| H | Q3_Dislikes | 不喜欢什么 |
| I | Q4_GreatPrice | 认为划算的价格 |
| J | Q4_Other | Q4 Other选项详情 |
| K | Q5_HesitatePrice | 开始犹豫的价格 |
| L | Q5_Other | Q5 Other选项详情 |
| M | Q6_ProblemSolve | 解决什么问题 |
| N | Q7_Suggestions | 改进建议 |
| O | Q8_ChildAge | 孩子年龄 |
| P | Q9_Gender | 性别 |
| Q | Q9_Other | Q9 Other选项详情 |
| R | Q10_UserAge | 用户年龄 |
| S | Q11_Occupation | 职业 |
| T | Q12_Income | 收入范围 |
| U | Q13_Innovation | 创新采纳倾向 (1-5) |
| V | Q14_Email | 邮箱 |
| W | Q15_NPS | 推荐意愿 (0-10) |

---

## 步骤 2: 创建 Google Apps Script

1. 在 Google Sheet 中，点击 **扩展程序** > **Apps Script**
2. 删除默认代码，粘贴以下代码:

```javascript
// ========================================
// Unicorn Blocks Survey Collection Script
// ========================================

// 🔐 安全 Token - 必须与 lib/googleSheets.js 中的 SURVEY_TOKEN 一致
const TOKEN = "UB_SURVEY_2024_SECURE_TOKEN";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Survey Responses");
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet("Survey Responses");
      // Add headers
      const headers = [
        "Timestamp",
        "Source",
        "Q1_StopReason",
        "Q1_Other",
        "Q1B_MissingInfo", 
        "Q1D_TrustConcerns",
        "Q2_Likes",
        "Q3_Dislikes",
        "Q4_GreatPrice",
        "Q4_Other",
        "Q5_HesitatePrice",
        "Q5_Other",
        "Q6_ProblemSolve",
        "Q7_Suggestions",
        "Q8_ChildAge",
        "Q9_Gender",
        "Q9_Other",
        "Q10_UserAge",
        "Q11_Occupation",
        "Q12_Income",
        "Q13_Innovation",
        "Q14_Email",
        "Q15_NPS"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }
    
    // Parse incoming data
    let data;
    if (e.postData) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "No data received"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 🔐 Token 验证 - 防止未授权访问
    if (data.token !== TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Unauthorized"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Map Q1 value to readable text
    const q1Map = {
      'A': 'Price',
      'B': 'Not enough information',
      'C': 'Product availability',
      'D': 'Security/Trust',
      'E': 'Other'
    };
    
    // Map Q4/Q5 price values
    const priceMap = {
      'A': '$229+',
      'B': '$199-229',
      'C': '$179-199',
      'D': '$159-179',
      'E': '$139-159',
      'F': 'Other'
    };
    
    // Map Q9 gender values
    const genderMap = {
      'A': 'Male',
      'B': 'Female',
      'C': 'Prefer Not to Mention',
      'D': 'Other'
    };
    
    // Map Q10 age values
    const ageMap = {
      'A': 'Under 24',
      'B': '25-34',
      'C': '35-44',
      'D': '45-54',
      'E': '55-64',
      'F': '65+'
    };
    
    // Map Q12 income values
    const incomeMap = {
      'A': '$0-$49K',
      'B': '$50K-$99K',
      'C': '$100K-$199K',
      'D': '$200K+',
      'E': 'Rather not share'
    };
    
    // Map Q8 child age (array to string)
    function mapChildAge(val) {
      if (!val) return '';
      const childAgeMap = {
        'A': '3-4',
        'B': '5-6', 
        'C': '7-8',
        'D': 'Gift for others'
      };
      if (Array.isArray(val)) {
        return val.map(v => childAgeMap[v] || v).join(', ');
      }
      return childAgeMap[val] || val;
    }
    
    // Prepare row data
    const timestamp = data.timestamp || new Date().toISOString();
    const row = [
      timestamp,
      data.source || '',
      q1Map[data.q1] || data.q1 || '',
      data.q1_other_text || '',
      data.q1_b_followup || '',
      data.q1_d_followup || '',
      data.q2 || '',
      data.q3 || '',
      priceMap[data.q4] || data.q4 || '',
      data.q4_other_text || '',
      priceMap[data.q5] || data.q5 || '',
      data.q5_other_text || '',
      data.q6 || '',
      data.q7 || '',
      mapChildAge(data.q8),
      genderMap[data.q9] || data.q9 || '',
      data.q9_other_text || '',
      ageMap[data.q10] || data.q10 || '',
      data.q11 || '',
      incomeMap[data.q12] || data.q12 || '',
      data.q13 || '',
      data.q14_email || '',
      data.q15_nps || ''
    ];
    
    // Append row
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Survey response saved"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function testSurvey() {
  const testData = {
    token: TOKEN,  // 必须包含 token
    source: 'bottom',
    q1: 'A',
    q2: 'I like the concept',
    q3: 'Price is a bit high',
    q4: 'C',
    q5: 'B',
    q6: 'Educational play',
    q7: 'More colors',
    q8: ['A', 'B'],
    q9: 'A',
    q10: 'C',
    q11: 'Engineer',
    q12: 'C',
    q13: 4,
    q14_email: 'test@example.com',
    q15_nps: 8,
    timestamp: new Date().toISOString()
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = handleRequest(e);
  Logger.log(result.getContent());
}
```

---

## 步骤 3: 部署 Web 应用

1. 点击右上角 **部署** > **新建部署**
2. 类型选择 **Web应用**
3. 配置:
   - **描述**: Survey Collection
   - **执行身份**: 我
   - **谁可以访问**: 任何人
4. 点击 **部署**
5. **复制生成的 Web 应用 URL** (格式: `https://script.google.com/macros/s/xxx.../exec`)

---

## 步骤 4: 更新代码中的 URL

1. 打开 `lib/googleSheets.js` 文件
2. 找到第 8 行的 `SURVEY_GAS_URL` 常量
3. 将 `"YOUR_SURVEY_GAS_URL_HERE"` 替换为你的 Web 应用 URL

```javascript
// 修改前
const SURVEY_GAS_URL = "YOUR_SURVEY_GAS_URL_HERE";

// 修改后 (示例)
const SURVEY_GAS_URL = "https://script.google.com/macros/s/你的ID/exec";
```

---

## 步骤 5: 测试

1. 在 Apps Script 编辑器中，选择 `testSurvey` 函数
2. 点击 **运行** 进行测试
3. 检查 Google Sheet 是否有新数据行
