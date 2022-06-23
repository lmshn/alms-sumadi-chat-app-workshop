#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CopChatAppStack } from '../lib/cop-chat-app-stack';

const app = new cdk.App();
 new CopChatAppStack(app, 'CopChatAppStack',{
    env: {account: '871027411396',
          region: 'us-east-1'
    }
});


