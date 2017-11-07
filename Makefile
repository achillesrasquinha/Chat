.PHONY: build

NODE 	  = babel-node
BASEDIR   = $(realpath .)
SRCDIR    = $(BASEDIR)/src
DSTDIR    = $(BASEDIR)/dist

SAMPLEIDR = $(BASEDIR)/examples

NODEMOD   = $(BASEDIR)/node_modules
NODEBIN   = $(NODEMOD)/.bin

phantomjs = $(NODEBIN)/phantomjs
qunit     = $(NODEBIN)/qunit
QUNITRUN  = $(NODEMOD)/qunit-phantomjs-runner

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
	$(phantomjs) $(QUNITRUN)/runner.js $(SRCDIR)/js/test/index.html

publish:
	