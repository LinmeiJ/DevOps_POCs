## Testing and debugging Amazon CloudWatch Synthetics canary locally

This repository contains code examples and related resources showing you how to run, test and debug Synthetics Canary locally on your computer.


## Overview

The local testing environment uses Serverless Application Model (SAM), to simulate a AWS Lambda function in a local Docker container to emulate the behavior of a Synthetics canary.

## Pre-requisites
You should have the following prerequisites:
- Set up a personal AWS account, create a user, keep your user key and secrets safe. They will be used for you to log in AWS via a local CLI. 
- Set up IAM permissions and roles
  - **Role**: <Create a Lambda execution role>
  - **Permissions** given to this role:
  ```
    {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "cloudwatch:PutMetricData",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "cloudwatch:namespace": "linmei-CWSythetics"
                }
            }
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:s3:::cw-syn-results-linmei/local-run-artifacts/*",
                "arn:aws:logs:us-east-2:339713021468:log-group:/aws/lambda/cwsyn-linmei-poc-*"
            ]
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:ListAllMyBuckets",
                "xray:PutTraceSegments"
            ],
            "Resource": "*"
        }
    ]
}
  ```
- An [Amazon S3](https://aws.amazon.com/s3/) bucket for canary artifacts.
    - **Note**: Choose or create an Amazon S3 bucket to use to store artifacts from local canary test runs, such as HAR files and screenshots. This requires you to be provisioned with IAM. If you skip setting up Amazon S3 buckets you can still test your canary locally, but you will see an error message about the missing bucket and you won't have access to canary artifacts.
      You can create a s3 bucket by uploading cloudformation template: **s3-cft.yml**.
      If you use an Amazon S3 bucket, we recommend that you set the bucket lifecycle to delete objects after a few days. For more information, see [Managing your storage lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html).
-	Set up [default AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) for the AWS account.
    ```
       [default]
            region = us-east-2
            output = aws-linmei
            ssl_verify = false

    ```
-	Set the debug environment's default AWS Region to your preferred Region, such as `us-west-2`.
-	Latest version of [AWS Serverless Application Model](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) (SAM) CLI installed.
-   Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).
-	Install [Visual Studio Code](https://code.visualstudio.com/) IDE or [JetBrains IDE](https://www.jetbrains.com/idea/).
-	Install [Docker](https://docs.docker.com/get-docker/). Make sure to start the docker daemon.
## Setting up local testing environment
Clone this repository using this cmd.
```
git clone https://github.com/LinmeiJ/DevOps_POCs.git
```


The repository contains code samples for NodeJS canary.

### NodeJS canary
1.	Go inside NodeJS canary source directory.
      ```
      cd cw-synthetic-canaries/src
      ```
2.	Run `npm install` to install canary dependencies.
3.  Install Node and set to >= v18.

Other optional fields that you can provide in payload JSON are:
- `s3EncryptionMode`: valid values: `SSE_S3` | `SSE_KMS`.
- `s3KmsKeyArn`: <KMS Key ARN>
- `activeTracing`: valid values: true | false.
- `canaryRunId`: <UUID> // required if active tracing is enabled.

## Debugging canary in JetBrains IDE
If you use [JetBrains IDE](https://www.jetbrains.com/idea/) then you will require [AWS Toolkit for IntelliJ IDEA](https://aws.amazon.com/intellij/) extension is installed and bundled **Node.js** plugin and **JavaScript Debugge**r are enabled to run and debug canary (required for NodeJS canary). Once you have the extension installed follow these steps.

1. Create **Run/Debug** configuration by choosing AWS Lambda -> Local configuration template.
2. Provide a name for the run configuration eg: [Local] LocalSyntheticsCanary.
3. Select **From template** option, click on the file browser in the template field and select the `template.yml` file from the project (either from nodejs directory or python directory).
4. Under input section, provide the payload for the canary as shown below. Other optional fields are listed in **VS Code launch configuration** section.
```
{
    "canaryName": "LocalSyntheticsCanary",
    "artifactS3Location": {
        "s3Bucket": "cw-syn-results-linmei", // Replace with your S3 bucket
        "s3Key": "local-run-artifacts" //Replace with your directory folder name
    },
    "customerCanaryHandlerName": "heartbeat-canary.handler"
}
```

![JetBrains debug mode](jetbrains-local-debug.png)


## Run canary locally with SAM CLI
1. Make sure to specify your own S3 bucket name for `s3Bucket` in `event.json`.
2. Install synthetics: `npm install @aws-sdk/client-synthetics`
3. To run NodeJS canary, go to `nodejs-canary` directory and run following commands.
    - `sam build`
    - `sam local invoke -e event.json`
    
## Caveat

Debugging visual monitoring canaries poses a challenge due to the reliance on base screenshots captured during the initial run for subsequent comparisons. In a local development environment, runs are neither stored nor tracked, treating each iteration as an independent, standalone run. Consequently, the absence of a run history makes it impractical to perform debugging for canaries relying on visual monitoring.

## Integrating local debugging environment into existing canary package

You can quickly integrate local canary debugging into your existing canary package by copying following three files:
1.	Copy the `template.yml` file into your canary package root. Be sure to modify the path for `CodeUri` to point to the directory where your canary code exists.
2.	If you're working with a Node.js canary, copy the `cw-synthetics.js` file to your canary source directory. If you're working with a Python canary, copy the `cw-synthetics.py` to your canary source directory.
3.	Put launch configuration file `.vscode/launch.json` in the package root. Make sure to put it inside `.vscode` directory; create it if it does not exist already.


## Common errors

1. Error: Running AWS SAM projects locally requires Docker. Have you got it installed and running?

   Make sure to start docker on your computer.

2. SAM local invoke failed: An error occurred (ExpiredTokenException) when calling the GetLayerVersion operation: The security token included in the request is expired

   Make sure AWS default profile is set up.
3. Unable to determine who owns S3 bucket error: set sl_verify = false in aws configure
4. ERROR_CERT_AUTHORITY_INVALID issue: Set ignoreHTTPSErrors: true (Just for local debugging purpose. not recommanded for real world application monitoring)

## More common errors

For more information about common errors with the SAM, see [AWS SAM CLI troubleshooting](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-troubleshooting.html).



## Synthetics Lambda layers for runtimes
The Lambda layer ARN for Synthetics runtimes are listed in [AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Debug_Locally.html#CloudWatch_Synthetics_Debug_DifferentRuntime)


## License
This project is licensed under the MIT-0 License. See the LICENSE file.