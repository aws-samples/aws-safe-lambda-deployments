## Safe Deployments with AWS Lambda

AWS Lambda and AWS CodeDeploy recently made it possible to automatically shift incoming traffic between two function versions based on a preconfigured rollout strategy. This new feature allows you to gradually shift traffic to the new function. If there are any issues with the new code, you can quickly rollback and control the impact to your application.

The sample code here supports the [Safe Deployments with AWS Lambda](https://aws.amazon.com/blogs/compute/implementing-safe-aws-lambda-deployments-with-aws-codedeploy/) Blog post. See the post for instructions and a detailed walkthrough.

template.yaml -- [Serverless Application Model/SAM](https://github.com/awslabs/serverless-application-model) template that can be used to deploy this sample.

s3.json -- sample event that can be used to test the function when running it with SAM Local.

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.
