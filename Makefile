TSC=./node_modules/.bin/tsc

ZIP_OUT_FILENAME=flowkey-keyboard-shortcuts.zip

setup:
	npm install

build: clean
	${TSC}

watch:
	${TSC} -w

clean:
	rm -rf build/

zip-for-publishing: ${ZIP_OUT_FILENAME}
	zip ${ZIP_OUT_FILENAME} -FSr build assets/ manifest.json
