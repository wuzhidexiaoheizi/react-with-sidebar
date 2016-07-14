TARGET := release/${NAME}
TMP := /tmp/deploy/BirthdayCake
LOG :=$(TMP)-$(shell date +'%s')
PROFILE=
S3_STORAGE=s3://wxtest

ifdef profile
	PROFILE:=--profile $(profile)
endif

ifdef online
	S3_STORAGE:=s3://wxapps
endif

.PHONY: clean build release
clean: cleanbuild cleanprepare cleanrelease
	@echo 'clean all'
	
cleanprepare: 
	@rm -rf $(TMP)

cleanbuild: 
	@rm -f build/*

cleanrelease:
	@rm -f release/*

build: 
	npm run deploy

release: build
	#mkdir $(TARGET)
	@mkdir -p $(TARGET)
	$(eval FILES:=$(wildcard build/*))
	# staring copy files to $(TARGET)
	@cp $(FILES) $(TARGET)

deploy: cleanprepare release
	@mkdir -p $(TMP)
	@echo 'package to $(LOG).tar.gz'
	@tar  --exclude .git --exclude node_modules --exclude build -czf $(LOG).tar.gz .
	aws s3 cp $(LOG).tar.gz $(S3_STORAGE) $(PROFILE)
	# aws deploy push --application-name OneMoney --description "This is OneMoney deployment" --s3-location s3://wanliu/OneMoney/deploy.zip --source $(TMP)
	# aws deploy create-deployment --application-name OneMoney --s3-location bucket=wanliu,key=OneMoney/deploy.zip,bundleType=zip --deployment-group-name test



