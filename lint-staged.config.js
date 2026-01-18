/**
 * 过滤掉 src/api 下的文件，不做 ESLint 校验
 * @param {string[]} files
 * @returns {string[]}
 */
const eslintCommand = (files) => {
  const filtered = files.filter((file) => {
    const normalized = file.replace(/^\.?\//, '').replace(/\\/g, '/');
    return !normalized.startsWith('src/api/');
  });
  if (filtered.length === 0) return [];
  return [`eslint --cache --fix ${filtered.join(' ')}`];
};

module.exports = {
  'src/**/*.{ts,tsx}': eslintCommand,
  'src/**/*.{js,jsx}': eslintCommand,
  'src/**/*.{less}': ['stylelint --fix'],
  'src/**/*.{css}': ['stylelint --fix'],
}
