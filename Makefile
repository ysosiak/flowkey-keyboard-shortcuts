TSC=./node_modules/.bin/tsc

ZIP_OUT_FILENAME=flowkey-keyboard-shortcuts.zip

setup:
	npm install

build: clean
	${TSC}

watch:
	${TSC} -w

lint:
	npx eslint .

clean:
	rm -rf build/

zip-for-publishing:
	zip ${ZIP_OUT_FILENAME} -FSr build assets/ manifest.json
