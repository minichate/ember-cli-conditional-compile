module.exports = {
  useYarn: true,
  useVersionCompatibility: true,
  scenarios: [
    {
      name: 'with ember-cli-uglify 3.0.x',
      npm: {
        devDependencies: {
          "ember-cli-uglify": "^3.0.0",
          "ember-source": ">3.13"
        }
      }
    }
  ]
};
