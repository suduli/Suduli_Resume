module.exports = {
  // Import settings from .prettierrc.json
  ...require('./.prettierrc.json'),
  
  // Additional settings
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
};
