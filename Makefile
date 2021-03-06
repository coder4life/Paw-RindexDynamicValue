identifier=com.coder4life.PawExtensions.RindexDynamicValue
extensions_dir=$(HOME)/Library/Containers/com.luckymarmot.Paw/Data/Library/Application Support/com.luckymarmot.Paw/Extensions/

build:
	pwd
	ls -al
	mkdir -p ./build/$(identifier)/
	npm run build
	cp README.md LICENSE ./build/$(identifier)/

clean:
	rm -Rf ./build/

install: clean build
	mkdir -p "$(extensions_dir)$(identifier)/"
	cp -r ./build/$(identifier)/* "$(extensions_dir)$(identifier)/"

test:
	npm test

archive: build
	cd ./build/; zip -r RindexDynamicValue.zip "$(identifier)/"