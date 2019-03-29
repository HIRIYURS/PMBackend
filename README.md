"# Mean FSD Final Project - Project Manager Backend" 

To run the project in Dev mode, use the following command:
npm run dev

To run the test suite, use the following command:
npm run test

For logging
set LOG_LEVEL='info'

Setting up CI with travis... I have set it up with Jenkins as well. However, since the jenkins is locally installed, github webhook is unable to connect to myjenkins instance.

Whitelisted all IPs so my MongoDB can be connected from anywhere on MongoDB Atlas cloud. The tests were failing on Travis-CI due to IP not being whitelisted.
