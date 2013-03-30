build: components
	@component build

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: build clean
