/* eslint-env node */
module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  browser_start_timeout: 60,
  browser_disconnect_timeout: 1000,
  parallel: -1,
  browser_args: {
    Chrome: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--disable-web-security',
      '--headless',
      '--incognito',
      '--mute-audio',
      '--no-sandbox',
      '--remote-debugging-address=0.0.0.0',
      '--remote-debugging-port=9222',
      '--window-size=1440,900'
    ]
  }
};
