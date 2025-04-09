require('dotenv').config();
const AWS = require('aws-sdk');

console.log("Region:",'process.env.AWS_REGION'); 
console.log("AccessKeyId:",'process.env.AWS_ACCESS_KEY_ID'); 
console.log("SecretAccessKey:",'process.env.AWS_SECRET_ACCESS_KEY'); 

AWS.config.update({
  region:process.env.AWS_REGION || 'ap-south-1',
  accessKeyId:'process.env.AWS_ACCESS_KEY_ID',
  secretAccessKey:'process.env.AWS_SECRET_ACCESS_KEY'
});

const athena = new AWS.Athena();


