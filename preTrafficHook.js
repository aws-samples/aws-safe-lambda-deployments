/*
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

const AWS = require('aws-sdk');
const codedeploy = new AWS.CodeDeploy({apiVersion: '2014-10-06'});
var lambda = new AWS.Lambda();

exports.handler = (event, context, callback) => {

	console.log("Entering PreTraffic Hook!");
	
	// Read the DeploymentId & LifecycleEventHookExecutionId from the event payload
    var deploymentId = event.DeploymentId;
	var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

	var functionToTest = process.env.NewVersion;
	console.log("Testing new function version: " + functionToTest);

	// Perform validation of the newly deployed Lambda version
	var lambdaParams = {
		FunctionName: functionToTest,
		InvocationType: "RequestResponse"
	};

	var lambdaResult = "Failed";
	lambda.invoke(lambdaParams, function(err, data) {
		if (err){	// an error occurred
			console.log(err, err.stack);
			lambdaResult = "Failed";
		}
		else{	// successful response
			var result = JSON.parse(data.Payload);
			console.log("Result: " +  JSON.stringify(result));

			// Check the response for valid results
			// The response will be a JSON payload with statusCode and body properties. ie:
			// {
			//		"statusCode": 200,
			//		"body": 51
			// }
			if(result.body == 9){	
				lambdaResult = "Succeeded";
				console.log ("Validation testing succeeded!");
			}
			else{
				lambdaResult = "Failed";
				console.log ("Validation testing failed!");
			}

			// Complete the PreTraffic Hook by sending CodeDeploy the validation status
			var params = {
				deploymentId: deploymentId,
				lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
				status: lambdaResult // status can be 'Succeeded' or 'Failed'
			};
			
			// Pass AWS CodeDeploy the prepared validation test results.
			codedeploy.putLifecycleEventHookExecutionStatus(params, function(err, data) {
				if (err) {
					// Validation failed.
					console.log('CodeDeploy Status update failed');
					console.log(err, err.stack);
					callback("CodeDeploy Status update failed");
				} else {
					// Validation succeeded.
					console.log('Codedeploy status updated successfully');
					callback(null, 'Codedeploy status updated successfully');
				}
			});
		}  
	});
}