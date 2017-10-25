#!/usr/bin/env bash
# Deploy project to AWS (see "config/swagger.json" and "cloud-formation-template.yml" for details)
#
# USAGE
# deploy.sh <AWSAccountId> <AWSRegion>
#
# Example:
# sh ./deploy.sh 189127829100 eu-central-1


# Install production dependencies
#npm install --production

# Make output directory (if not exists)
mkdir -p build

# Compress function implementation
zip build/app.zip -r .

# Replace placerholder region and accountId in Swagger.json with supplied arguments
sed s/\<\<accountId\>\>/$1/ < config/swagger.json > swagger-replaced.json
sed -i s/\<\<region\>\>/$2/g swagger-replaced.json

# Package stack (Remove file dependencies by uploading to S3 and replacing with resulting ARNs)
aws cloudformation package --template-file cloud-formation-template.yml --output-template-file build/cloud-formation-template-packaged.yml --s3-bucket nielssj

# Deploy stack
aws cloudformation deploy --template-file build/cloud-formation-template-packaged.yml --stack-name minimal-backend --capabilities CAPABILITY_IAM --parameter-overrides DatabasePassword=john1234