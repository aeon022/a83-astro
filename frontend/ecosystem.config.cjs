// PM2 Ecosystem Config — for Plesk Node.js / Ubuntu 24 LTS
// Usage:
//   npm run build
//   pm2 start ecosystem.config.cjs
//   pm2 save

module.exports = {
  apps: [
    {
      name: 'abteilung83',
      script: './dist/server/entry.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 4321,
      },
    },
  ],
};
