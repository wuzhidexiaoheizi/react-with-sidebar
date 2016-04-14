TARGET := release/${NAME}
TMP := /tmp/deploy/OneMoney
export ONE_MONEY=$(ONE_MONEY_ID)
export QRCODE=$(QR_CODE)
export HOMEIMG=$(HOME_IMG)
export LISTIMG=$(LIST_IMG)
export DEFAULTAVATAR=$(DEFAULT_AVATAR)
export SIGNURL=$(SIGN_URL)
export APIURL=$(API_URL)
export WINNERS=$(WINNERS_NUM)

build: 
	npm run deploy

deploy: cleanprepare build
	@mkdir -p $(TMP)
	@tar -c --exclude .git --exclude node_modules --exclude release --exclude build . | tar -x -C $(TMP)
	aws deploy push --application-name OneMoney --description "This is OneMoney deployment" --s3-location s3://wanliu/OneMoney/deploy.zip --source $(TMP)
	aws deploy create-deployment --application-name OneMoney --s3-location bucket=wanliu,key=OneMoney/deploy.zip,bundleType=zip --deployment-group-name test

release: build 
	#mkdir $(TARGET)
	@mkdir -p $(TARGET)
	$(eval FILES:=$(wildcard build/*))
	# staring copy files to $(TARGET)
	@cp $(FILES) $(TARGET)


.PHONY: clean
clean: cleanbuild cleanrelease cleanprepare

cleanprepare: 
	@rm -rf $(TMP)

cleanrelease: $(TARGET)
	@rm -rf $?

cleanbuild: build
	@rm -rf $<