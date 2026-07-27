try {
  const qrcode = require('qrcode-terminal');
  qrcode.generate('exp://172.27.85.183:8081', {small: true});
} catch (e) {
  try {
    const qrcode = require('./app/node_modules/@expo/cli/node_modules/qrcode-terminal');
    qrcode.generate('exp://172.27.85.183:8081', {small: true});
  } catch (e2) {
    try {
      const qrcode = require('./app/node_modules/qrcode-terminal');
      qrcode.generate('exp://172.27.85.183:8081', {small: true});
    } catch (e3) {
      console.log("Error:", e3.message);
    }
  }
}
