// const { App } = require('@slack/bolt');
import { App } from '@slack/bolt';

// const dotenv = require('dotenv');
import dotenv from 'dotenv';
dotenv.config();

const boltApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

export default boltApp;