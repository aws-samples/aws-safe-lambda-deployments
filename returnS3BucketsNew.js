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

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
	console.log("I am here! " + context.functionName  +  ":"  +  context.functionVersion);

	s3.listBuckets(function (err, data){
		if(err){
			console.log(err, err.stack);
			callback(null, {
				statusCode: 500,
				body: "Failed!"
			});
		}
		else{
			var allBuckets = data.Buckets;

			console.log("Total buckets: " + allBuckets.length);
			//callback(null, allBuckets.length);

			//  New Code begins here
			var counter=0;
			for(var i  in allBuckets){
				if(allBuckets[i].Name[0] === "a")
					counter++;
			}
			console.log("Total buckets starting with a: " + counter);

			callback(null, {
				statusCode: 200,
				body: counter
			});
			
		}
	});	
}