TSC=./node_modules/.bin/tsc

ZIP_OUT_FILENAME=flowkey-keyboard-shortcuts.zip

setup:
	npm install

build: clean
	${TSC}

build-production: clean
	${TSC} --project tsconfig.production.json

watch:
	${TSC} -w

lint:
	npx eslint .

clean:
	rm -rf build/
	rm -f ${ZIP_OUT_FILENAME}

build-and-zip-for-publishing: build-production
	zip ${ZIP_OUT_FILENAME} -FSr build/ assets/ manifest.json;
	echo "\nCreated ${ZIP_OUT_FILENAME}"
