const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sns = new AWS.SNS();
const { Consumer } = require('sqs-consumer');
const { nanoid } = require('nanoid');


// Poll from packages-drivers.fifo queue
const pollPackages = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/079094089790/packages-drivers.fifo',
  handleMessage: (message) => {
    // display pickup order message to terminal
    console.log('Picked up package: ', message);
    setTimeout(() => {
      // create payload to publish to SNS delivered.fifo topic
      const targetArn = 'arn:aws:sns:us-west-2:079094089790:delivered.fifo';
      const payload = {
        Message: `Package ${message.MessageId} delivered!`,
        TargetArn: targetArn,
        MessageGroupId: 'delivery-2',
        MessageDeduplicationId: nanoid(),
      };
      // publish to SNS delivered topic after 5 seconds
      sns.publish(payload).promise()
        .then(data => console.log('Package Delivered! Data: ', data))
        .catch(err => console.log(err));
    }, 5000);
  },
});

pollPackages.start();

