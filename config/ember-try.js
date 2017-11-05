module.exports = {
  useYarn: true,
  useVersionCompatibility: true,
  scenarios: [
    {
      name: 'with ember-cli-uglify 1.2.x',
      npm: {
        devDependencies: {
          "ember-cli-uglify": "~1.2.0",
          "ember-source": ">2.13"
        }
      }
    },
    {
      name: 'with ember-cli-uglify 2.x',
      npm: {
        devDependencies: {
          "ember-cli-uglify": "~2.0",
          "ember-source": ">2.13"
        }
      }
    }
  ]
};
