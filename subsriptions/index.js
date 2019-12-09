import { PubSub } from 'apollo-server';

import * as PUBSUB_EVENTS from './topics';
export const EVENTS = {
  TOPIC: PUBSUB_EVENTS
};

export default new PubSub();
