.PHONY: build

NODE 	  = babel-node
BASEDIR   = $(realpath .)
SAMPLEIDR = $(BASEDIR)/examples

build:
	npm run build

clean:
	

sample:
	$(NODE) $(SAMPLEIDR)/hello-world