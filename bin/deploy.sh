#!/bin/sh

aws deploy push --application-name OneMoney \
    --s3-location s3://wanliu/oneMoney \
    --source build