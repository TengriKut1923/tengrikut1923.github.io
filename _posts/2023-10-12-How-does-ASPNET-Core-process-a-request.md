---
layout: post
title: "How does ASP.NET Core process a request?"
categories:
- programming
tags:
- .NET
- .NET 6
- ASP.NET Core
- Middleware
- Pipeline
---

ASP.NET Core is a cross-platform web framework that allows developers to create modern web applications using C#. It has a modular architecture that enables developers to customize the behavior of their applications by configuring a series of middleware components. Middleware are software components that can perform operations on the incoming HTTP requests and outgoing HTTP responses. In this post, we will explore how ASP.NET Core processes a request using its middleware pipeline.

## Request Initialization

The pipeline starts when the application receives an incoming HTTP request. The request is encapsulated in an HttpRequest object that provides access to various properties and methods, such as the request method, headers, query string, body, etc. The request also has a CancellationToken property that can be used to cancel the request processing if needed.

The HttpRequest object is part of the HttpContext object, which represents the context of the current request. The HttpContext object also contains other properties, such as the HttpResponse object, the ConnectionInfo object, the User object, etc. The HttpContext object is passed as a parameter to each middleware component in the pipeline.

## Middleware Execution

The request flows through a series of middleware components configured in the Main method of the Program class. The Main method creates a WebHostBuilder object that specifies the web server (such as Kestrel or IIS) and the startup class (such as Startup) for the application. The startup class contains a ConfigureServices method that registers the services needed by the application, such as logging, configuration, dependency injection, etc. It also contains a Configure method that defines the middleware pipeline using an IApplicationBuilder parameter.

The middleware pipeline is composed of a sequence of request delegates, which are functions that accept an HttpContext parameter and return a Task. Each middleware can perform some operations before and after invoking the next middleware in the pipeline using the next parameter. For example, a middleware can log the request details, validate the request headers, compress or encrypt the response body, handle errors or exceptions, etc.

ASP.NET Core provides several built-in middleware components that can be added to the pipeline using extension methods on the IApplicationBuilder object. For example, UseStaticFiles adds a middleware that serves static files from the wwwroot folder, UseRouting adds a middleware that matches the request URL to an endpoint (such as a controller action or a razor page), UseAuthorization adds a middleware that checks the authentication and authorization policies for the endpoint, etc.

Developers can also create their own custom middleware components by implementing a class with a public method named Invoke or InvokeAsync that matches the signature of a request delegate. Alternatively, they can use lambda expressions or anonymous methods to define inline middleware components.

## Response Generation

A response is generated once the request has traversed through all configured middleware components. The response is encapsulated in an HttpResponse object that provides access to various properties and methods, such as the status code, headers, body, etc. The response body can be written using different abstractions, such as Stream or Pipe. Stream is a simple and familiar abstraction that supports synchronous and asynchronous read and write operations. Pipe is a newer and more efficient abstraction that supports advanced scenarios such as backpressure, cancellation, memory management, etc.

The response body can be written directly by using methods such as WriteAsync or WriteAsJsonAsync on the HttpResponse object. Alternatively, it can be written indirectly by using higher-level abstractions such as MVC or Razor Pages. MVC and Razor Pages use models, views, and controllers (or pages and page models) to generate dynamic HTML content based on data and logic.

## Response Middleware

After writing to the response body, the control returns back to the previous middleware components in reverse order. Each middleware can perform some operations on the response before passing it to the next middleware. For example, a middleware can add some custom headers, modify the status code, log the response details, etc.

## Response Finalization

The pipeline ends when the response reaches the web server. The web server sends the response back to the client over the network.

## Conclusion

In this post, we have learned how ASP.NET Core processes a request using its middleware pipeline. We have seen how middleware components can intercept and manipulate the request and response at different stages of the pipeline. We have also learned how to configure and create middleware components using different approaches.

Thank you for reading.
