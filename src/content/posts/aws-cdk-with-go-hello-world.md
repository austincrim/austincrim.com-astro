---
title: "AWS CDK with Go: Hello World"
lede: A quick start and some things to watch out for when using the AWS Cloud Development Kit for Go
datePublished: 2021-05-10
draft: false
---

## Background

I recently started exploring the AWS CDK using Go. The Go CDK library is currently in Developer Preview, meaning the APIs are subject to change and it should not be used in production. However, it should be used to experiment and provide feedback to AWS!\
I wanted to spin up a simple Lambda fronted by API Gateway to create an HTTP API, a very common use case. I have pasted the full source of both the CDK and the Lambda handler below.

```go
// lib/cdk.go
package main

import (
    "os"

    "github.com/aws/aws-cdk-go/awscdk"
    "github.com/aws/aws-cdk-go/awscdk/awsapigatewayv2"
    "github.com/aws/aws-cdk-go/awscdk/awsapigatewayv2integrations"
    "github.com/aws/aws-cdk-go/awscdk/awslambda"
    "github.com/aws/constructs-go/constructs/v3"
    "github.com/aws/jsii-runtime-go"
)

type GoCdkStackProps struct {
    awscdk.StackProps
}

func NewGoCdkStack(scope constructs.Construct, id string, props *GoCdkStackProps) awscdk.Stack {
    var sprops awscdk.StackProps
    if props != nil {
            sprops = props.StackProps
    }
    stack := awscdk.NewStack(scope, &id, &sprops)

    // The code that defines your stack goes here

    function := awslambda.NewFunction(stack, jsii.String("gofunction"), &awslambda.FunctionProps{
            FunctionName: jsii.String("hellogo"),
            Code:         awslambda.AssetCode_FromAsset(jsii.String("../handler"), nil),
            Handler:      jsii.String("handler"),
            Runtime:      awslambda.Runtime_GO_1_X(),
    })

    integration := awsapigatewayv2integrations.NewLambdaProxyIntegration(&awsapigatewayv2integrations.LambdaProxyIntegrationProps{
            Handler:              function,
            PayloadFormatVersion: awsapigatewayv2.PayloadFormatVersion_VERSION_1_0(),
    })

    api := awsapigatewayv2.NewHttpApi(stack, jsii.String("goapi"), &awsapigatewayv2.HttpApiProps{
            ApiName: jsii.String("hellogoapi"),
    })

    api.AddRoutes(&awsapigatewayv2.AddRoutesOptions{
            Path:        jsii.String("/"),
            Integration: integration,
    })

    return stack
}

func main() {
    app := awscdk.NewApp(nil)

    NewGoCdkStack(app, "GoCdkStack", &GoCdkStackProps{
            awscdk.StackProps{
                    StackName: jsii.String("GoCDKStack"),
                    Env:       env(),
            },
    })

    app.Synth(nil)
}

// env determines the AWS environment (account+region) in which our stack is to
// be deployed. For more information see: <https://docs.aws.amazon.com/cdk/latest/guide/environments.html>
func env() *awscdk.Environment {
    return &awscdk.Environment{
            Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
            Region:  jsii.String(os.Getenv("CDK_DEFAULT_REGION")),
    }
}
```

```go
// handler/main.go
package main

import (
    "context"
    "fmt"

    "github.com/aws/aws-lambda-go/events"
    "github.com/aws/aws-lambda-go/lambda"
)

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
    name := request.QueryStringParameters["name"]
    if name == "" {
            name = "Friend"
    }
    return events.APIGatewayProxyResponse{Body: fmt.Sprintf("Hello, %s!", name), StatusCode: 200}, nil
}

func main() {
    lambda.Start(HandleRequest)
}
```

Allow me to highlight a few concepts that tripped me up.

### Finding the Go CDK packages

Since the CDK bindings for Go are currently in developer preview, the documentation is not quite as fleshed out as the other supported languages. This made getting started a little hairy. In the end I found most of what I needed [here](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html), after selecting the v2 release candidate from the menu in the top right.\
One major benefit of CDK 2.0 is having all the various packages under a single namespace. This makes it trivial to grab more dependencies as you go, simply changing the last node of your import statements.

### jsii.String()?

Most examples of Go CDK that I found on AWS' docs included calls to `jsii.String()` or similar. This call has to wrap any literal data types that you wish to pass, such as string or integer primitives. All construct options structs take pointers, even for things like strings or integers. This is because Go does not natively support optional struct fields. `jsii.String()` will automatically provide a pointer to your string literal value, this allows for a `nil` pointer to be used for optional fields that you choose not to provide.

### Specifying a Lambda Handler

```go
awslambda.NewFunction(stack, jsii.String("gofunction"), &awslambda.FunctionProps{
  ...
  Handler:      jsii.String("handler"),
  ...
})
```

This option took me the longest to figure out and partially inspired me to write this post. When specifying the `Handler` option of a new Lambda function, you specify the **name of the executable file generated by** **`go build`**. So in my scenario, I have a folder named **handler** that contains a **main.go** file. When built, this creates a **handler** executable. This is what needs to go in the `Handler` struct field.\
Another important note, when building your executable, **you have to run** **`GOOS=linux go build`** or the Windows equivalent. This tells the Go cli to build an executable for the Linux OS which is where your Lambda will actually run. If you don't do this, you will get a runtime error when executing your lambda.

That wraps it up for this post, let me know if you run into any other common issues I could add!
