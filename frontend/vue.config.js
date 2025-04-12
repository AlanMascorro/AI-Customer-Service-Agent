const { defineConfig } = require('@vue/cli-service')
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env')});

console.log(JSON.stringify(process.env.HOST_IP), JSON.stringify(process.env.HOST_PORT));

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0', // allow access from external IPs
    port: 8080,
    allowedHosts: 'all', // fix invalid host header from ngrok

    client: {
      webSocketURL: {
        hostname: process.env.WEB_URL, // no <>
        port: 443,
        protocol: 'wss'
      }
    }
  }
})
