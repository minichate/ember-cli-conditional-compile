REMOTE=origin

# Utility target for checking required parameters
guard-%:
	@if [ "$($*)" = '' ]; then \
		echo "Missing required $* variable."; \
		exit 1; \
	fi;

release: guard-VERSION
	@if [ "$$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then \
		echo "You must be on master to update the version"; \
		exit 1; \
	fi;
	sed -i "" -e 's/version": ".*/version": "$(VERSION)",/' package.json

	git add ./package.json
	git commit ./package.json -m 'Bump version to $(VERSION)'
	git tag release/$(VERSION) -m 'ember-cli-conditional-compile $(VERSION) - $(DATE)'
	git checkout -b release/$(VERSION)
	git push $(REMOTE) --tags
	git push $(REMOTE) master
	npm publish
