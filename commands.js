const commands = {
    "awesomebuilder": {
        "update-vpc-stack": `. ~/workplace/awesomebuilder/infra/vpc/update-vpc-stack.sh`,
        "create-vpc-stack": `. ~/workplace/awesomebuilder/infra/vpc/create-vpc-stack.sh`,
        "create-webserver-stack": `. ~/workplace/awesomebuilder/infra/webserver/create-webserver-stack.sh`,
        "update-webserver-stack": `. ~/workplace/awesomebuilder/infra/webserver/update-webserver-stack.sh`,
        "get-webserver-url": `aws cloudformation describe-stacks --stack-name Webserver | jq ".Stacks[].Outputs[] | {Url: .OutputValue}"`,
        "load-test-url": `artillery quick --count 50 --num 1000 -d 120 http://Webse-Appli-WVDU5RB0SIT7-1557819975.ap-southeast-1.elb.amazonaws.com`
    },
    "aws-services": {
        "get-total-number-of-services": `curl -s https://raw.githubusercontent.com/boto/botocore/develop/botocore/data/endpoints.json | jq -r '.partitions[0].services | keys[]' | wc -l`
    },
    "cost-exploration": {
        "get-service-usage": `aws ce get-cost-and-usage --time-period Start=$(date -v-1m "+%Y-%m-01" ),End=$(date -v-1d "+%Y-%m-%d") --granularity MONTHLY --metrics UsageQuantity --group-by Type=DIMENSION,Key=SERVICE | jq ".ResultsByTime[].Groups[] | select(.Metrics.UsageQuantity.Amount > 0) | .Keys[0]"`,
        "get-cost-usage": `aws ce get-cost-and-usage --time-period Start=$(date -v-1m "+%Y-%m-01" ),End=$(date -v-1d "+%Y-%m-%d") --granularity MONTHLY --metrics USAGE_QUANTITY BLENDED_COST  --group-by Type=DIMENSION,Key=SERVICE | jq '[ .ResultsByTime[].Groups[] | select(.Metrics.BlendedCost.Amount > "0") | { (.Keys[0]): .Metrics.BlendedCost } ] | sort_by(.Amount) | add'`
    },
    "cloudformation": {
        "get-number-of-stacks": `aws cloudformation list-stacks | jq  '.StackSummaries | [ group_by(.StackStatus)[] | { "status": .[0].StackStatus, "count": (. | length) }]'`
    },
    "ec2": {
        "get-all-instances": `aws ec2 describe-instances | jq -r "[[.Reservations[].Instances[]|{ state: .State.Name, type: .InstanceType }]|group_by(.state)|.[]|{state: .[0].state, types: [.[].type]|[group_by(.)|.[]|{type: .[0], count: ([.[]]|length)}] }]"`,
        "get-security-group-with-ingress-access-to-ports": `aws ec2 describe-security-groups | jq '[ .SecurityGroups[].IpPermissions[] as $a | { "ports": [($a.FromPort|tostring),($a.ToPort|tostring)]|unique, "cidr": $a.IpRanges[].CidrIp } ] | [group_by(.cidr)[] | { (.[0].cidr): [.[].ports|join("-")]|unique }] | add'`
    },
    "lambda": {
        "get-all-runtime-env": `aws lambda list-functions | jq ".Functions | group_by(.Runtime)|[.[]|{ runtime:.[0].Runtime, functions:[.[]|.FunctionName] }]"`,
        "get-all-memory-and-timeout": `aws lambda list-functions | jq ".Functions | group_by(.Runtime)|[.[]|{ (.[0].Runtime): [.[]|{ name: .FunctionName, timeout: .Timeout, memory: .MemorySize }] }]"`
    },
    "rds": {
        "get-endpoints": `aws rds describe-db-instances | jq -r '.DBInstances[] | { (.DBInstanceIdentifier):(.Endpoint.Address + ":" + (.Endpoint.Port|tostring))}'`
    },
    "security-token-service": {
        "get-user-identity": `{ aws sts get-caller-identity & aws iam list-account-aliases; } | jq -s ".|add"`
    },
}

module.exports = commands