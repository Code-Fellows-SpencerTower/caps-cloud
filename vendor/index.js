'use strict';

// Vendor: publishes 

const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
AWS.config.update({ region: 'us-west-2' });
const { nanoid } = require('nanoid');

const sns = new AWS.SNS();

//-------Publish Message to SNS pickup.fifo topic------//

const targetArn = 'arn:aws:sns:us-west-2:079094089790:pickup.fifo';

const payload = {
  Message: 'Hello from Node Vendor! Pickup Ready!',
  TargetArn: targetArn,
  MessageGroupId: 'delivery-2',
  MessageDeduplicationId: nanoid(),
};

sns.publish(payload).promise()
  .then(data => console.log('Pickup Published: ', data))
  .catch(err => console.log(err));


//-------Poll SQS deliveries queue------//

const pollDeliveries = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/079094089790/delivered-vendors.fifo',
  handleMessage: (message) => {
    console.log('Delivery Confirmation: ', message);
  }
});

pollDeliveries.start();