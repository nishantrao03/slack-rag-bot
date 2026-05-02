// const { WebClient } = require('@slack/web-api');
import { WebClient } from '@slack/web-api';

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export default webClient;