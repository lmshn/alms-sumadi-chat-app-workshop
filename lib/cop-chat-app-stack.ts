import { Duration, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import {readFileSync} from 'fs';

import { Construct } from 'constructs';


interface CopChatAppStackProps extends StackProps {
  
}

export class CopChatAppStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
  
  //networking  
  const vpc = ec2.Vpc.fromLookup(this, 'imported VPC', {
  vpcId:
});
    
// ADD SECURITY GROUP FOR EC2 INSTANCE   
const securityGroupEc2 =
  
  
  const chatAppImage = ec2.MachineImage.genericLinux({
  'us-east-1': 'ami-0d5fd506b85a1c987'
});


// FOR LAUNCH TEMPLATE ADD MACHINE IMAGE, INSTANCE TYPE
// SECURTY GROUP AND SSH KEY NAME
  const ec2Template = new ec2.LaunchTemplate(this, `${props.}`, {
  
  keyName: 'cop-chat-app'
  
});

// ADD SECURITY GROUP FOR APPLICATION LOAD BALANCER, DEFINE SECURITY GROUP NAME
// VPC, DESCRIPTION AND ALLOW ALL OUTBOUND CONNECTIONS
const securityGroupAlb = 


securityGroupAlb.addIngressRule( ec2.Peer.anyIpv4() , ec2.Port.tcp(5000), 'connection for application port');

// ADD VPC, ADD INTERNET FACING, ADD SECURITY GROUP
const lb = new elbv2.ApplicationLoadBalancer(this, 'LBChatApp', {
  
});

// ADD PORT NUMBER, DEFINE IF OPEN, ADD PROTOCOL TO LISTENER
const listener = lb.addListener('ListenerChatApp',{
      
    });

// CREATE AUTOSCALING WITH VPC, LAUNCHTEMPLATE, MINIMUM CAPACITY AND MAX CAPACITY
const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  
});

listener.addTargets('default-target', {
      port: 5000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [autoScalingGroup],
      healthCheck: {
        path: '/',
        unhealthyThresholdCount: 2,
        healthyThresholdCount: 5,
        interval: Duration.seconds(30),
      },
    });

autoScalingGroup.scaleOnSchedule('PrescaleInTheMorning', {
  schedule: autoscaling.Schedule.cron({ hour: '8', minute: '0' }),
  minCapacity: 2,
});

autoScalingGroup.scaleOnSchedule('AllowDownscalingAtNight', {
  schedule: autoscaling.Schedule.cron({ hour: '20', minute: '0' }),
  minCapacity: 1
});

new CfnOutput(this, 'app dns', {
  value: lb.loadBalancerDnsName,
  description: 'loadbalancer dns',
});

  }
}
