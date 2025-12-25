// 邮箱本地存储工具
// 用于在用户成功提交邮箱后保存到 localStorage，并在返回时显示

const EMAIL_STORAGE_KEY = 'unicorn_blocks_user_email';

/**
 * 保存用户邮箱到 localStorage
 * @param {string} email - 用户邮箱
 */
export const saveEmail = (email) => {
  if (typeof window !== 'undefined' && email) {
    try {
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
    } catch (error) {
      console.error('保存邮箱失败:', error);
    }
  }
};

/**
 * 从 localStorage 获取已保存的邮箱
 * @returns {string|null} - 返回保存的邮箱或 null
 */
export const getSavedEmail = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(EMAIL_STORAGE_KEY);
    } catch (error) {
      console.error('读取邮箱失败:', error);
      return null;
    }
  }
  return null;
};

/**
 * 清除保存的邮箱
 */
export const clearSavedEmail = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    } catch (error) {
      console.error('清除邮箱失败:', error);
    }
  }
};
