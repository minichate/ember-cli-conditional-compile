module.exports = {
  useYarn: true,
  useVersionCompatibility: true,
  scenarios: [
    {
      name: 'with ember-cli-uglify 1.2.x',
      npm: {
        devDependencies: {
          "ember-cli-uglify": "~1.2.0"
        }
      }
    },
    {
      name: 'with ember-cli-uglify 2.x',
      npm: {
        devDependencies: {
          "ember-cli-uglify": "~2.0"
        }
      }
    },
    {
      name: 'with ember-cli-terser',
      npm: {
        devDependencies: {
          'ember-cli-terser': '4.0'
        }
      }
    }
  ]
};
