.PHONY: build

NODE 	  = babel-node
BASEDIR   = $(realpath .)
SAMPLEIDR = $(BASEDIR)/examples

NODEBIN   = $(BASEDIR)/node_modules/.bin

QUNIT     = $(NODEBIN)/qunit

install:
	npm install $(BASEDIR)

build:
	npm run build

sample:
	$(NODE) $(SAMPLEIDR)/hello-world

clean:
	clear

run:
	make build & make sample

test:
	$(QUNIT)

publish:
	