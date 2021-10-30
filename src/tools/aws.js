
const aws  = require('aws-sdk');
const Twilio = require('twilio')
const {awsConfig} = require('../config/aws')


 class AwsLib {
   config;

  constructor() {
    this.config = awsConfig;

    aws.config.update({
      region: this.config.region,
    });
  }



  getSnsInstance = () => {
    return new aws.SNS({
      apiVersion: this.config.version,
    });
  };

  //#region SMS methods

  checkIfNumberExists = async (phoneNumber) => {
    try {
      const snsInstance = this.getSnsInstance();
      const phoneCheck = await snsInstance
        .checkIfPhoneNumberIsOptedOut({
          phoneNumber,
        })
        .promise();

      return {
        code: 100,
        data: phoneCheck,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in awslib', e);
      return {
        code: 102,
        data: e,
      };
    }
  };
   sendSmsTwilio = async (message,phoneNumber) =>{

  

    var client = new Twilio(`${process.env.ACCOUNT_SID}`, `${process.env.AUTH_TOKEN_TWILIO}`);
  
    await client.messages
      .create({
        body: message,
        to: ` ${phoneNumber}`, // Text this number
        from: `${process.env.TWILIO_PHONE}`, // From a valid Twilio number
      })
      .then((message) => console.log(message));
    
  }

  sendSMS = async (
    phoneNumber = this.config.phoneNumber,
    message = 'Mensaje de prueba'
  ) => {
    try {
      const params = {
        Message: message,
        PhoneNumber: phoneNumber,
      };

      console.log(params);
      const snsInstance = this.getSnsInstance();

      const messageResponse = await snsInstance.publish(params).promise();
      console.log(messageResponse);
      return {
        code: 100,
        data: messageResponse,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in awslib', e);
      return {
        code: 102,
        data: e,
      };
    }
  };

  //#endregion
}
module.exports = {AwsLib}