---
layout: post
title: "Introduction to Minimal APIs in ASP.NET Core"
categories:
- programming
tags:
- C#
- .NET
- .NET 6
- .NET Core
- API
- Minimal API
---

ASP.NET Core is a modern, cross-platform, and high-performance web framework for building web applications and services. It is designed to be modular, flexible, and extensible, allowing developers to choose the features and components they need for their projects.

One of the key features of ASP.NET Core is its support for building RESTful APIs, which are web services that follow the principles of Representational State Transfer (REST). RESTful APIs expose data and functionality through uniform resource identifiers (URIs) and use standard HTTP methods (such as `GET`, `POST`, `PUT`, and `DELETE`) to manipulate them.

However, building RESTful APIs with ASP.NET Core has traditionally required a lot of boilerplate code and configuration. For example, developers had to create controllers, actions, models, and routes for each API endpoint, as well as configure services, middleware, and dependency injection. This could result in a lot of complexity and verbosity in the codebase, making it harder to maintain and test.

To address this issue, ASP.NET Core 6 introduced a new feature called Minimal APIs, which aims to simplify and streamline the process of building APIs with ASP.NET Core. Minimal APIs allow developers to create APIs with minimal code and configuration, using a declarative and fluent syntax that focuses on the essential aspects of the API design.

## What Are Minimal APIs?
Minimal APIs are a new way of building APIs with ASP.NET Core 6 that use a single file (Program.cs) to define the application startup, configuration, routing, endpoints, request handling, response handling, middleware, error handling, and logging. Minimal APIs do not require controllers, actions, models, or routes classes; instead, they use lambda expressions and anonymous types to define the logic and data of each endpoint.

Some of the advantages of Minimal APIs are:

- They reduce the amount of code and files needed to create an API, making it easier to read and write.
- They eliminate the need for complex configuration and convention-based routing, making it easier to understand and customize.
- They enable a more functional and expressive style of programming, making it easier to implement logic and data transformations.
- They improve the performance and scalability of the API by reducing the overhead of unnecessary components and middleware.

To illustrate the difference between Minimal APIs and Traditional APIs in ASP.NET Core, let's compare how they implement a simple "Hello World" API that returns a greeting message when accessed at the root path (/).

### Traditional API
```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseHttpsRedirection();

app.Run();
```

```csharp
// GreetingController.cs
using Microsoft.AspNetCore.Mvc;

namespace TraditionalAPI.Controllers
{
    [ApiController]
    [Route("/")]
    public class GreetingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello World");
        }
    }
}
```

### Minimal API
```csharp
// Program.cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

var app = WebApplication.Create(args);

app.MapGet("/", () => "Hello World");

app.Run();
```

As you can see, the Minimal API version is much shorter and simpler than the Traditional API version. It does not require any classes or attributes; it just uses a single lambda expression to define the endpoint logic. It also does not require any explicit configuration or routing; it just uses a fluent method (MapGet) to map the HTTP method (GET) and the path (/) to the endpoint.

## Setting Up Your Environment
Before you can start creating your own Minimal APIs with ASP.NET Core 6, you need to make sure that you have the following prerequisites:

- [.NET 6 SDK](https://dotnet.microsoft.com/en-us/): The software development kit (SDK) that contains the tools and libraries for developing .NET applications.
- [Visual Studio Code](https://code.visualstudio.com/): The lightweight and cross-platform code editor that supports .NET development.
- [C# Dev Kit for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit): The extension that provides language support and debugging features for C# in Visual Studio Code. For detailed guide, take a look at my blog post on [C# Dev Kit](https://keyurramoliya.com/posts/C-Dev-Kit/).

To create a new ASP.NET Core project using Minimal APIs, you can use the following method:

- **Use the dotnet new command**: Open a terminal window in Visual Studio Code and run the following command:

```bash
dotnet new web -o MinimalAPI
```

This will create a new folder called MinimalAPI and generate a basic ASP.NET Core project with Minimal APIs in it.

To install the necessary packages for your project, you can use one of the following methods:

- **Use the dotnet restore command**: Open a terminal window in Visual Studio Code and run the following command:

```bash
dotnet restore
```

This will restore the dependencies and tools for your project.

## Creating Your First Minimal API
Now that you have set up your environment and created your project, you are ready to create your first Minimal API. In this section, we will create a simple API that returns a list of products when accessed at the `/products` path.

To create your first Minimal API, follow these steps:

1. Open the `Program.cs` file in Visual Studio Code. This is the main file where you will define your API logic and configuration.
2. Delete the existing code in the file and replace it with the following code:

```csharp
var app = WebApplication.Create(args);

app.Run();
```

This code creates a new `WebApplication` instance using the `args` parameter, which contains the command-line arguments passed to the application. The `WebApplication` class is a new class in ASP.NET Core 6 that represents a web application and provides methods for configuring and running it.

The app variable is used to access the `WebApplication` instance and its methods. The `app.Run()` method starts the web application and listens for incoming requests.

3. Add the following code before the `app.Run()` method:

```csharp
var products = new[]
{
    new { Id = 1, Name = "Laptop", Price = 999.99 },
    new { Id = 2, Name = "Smartphone", Price = 499.99 },
    new { Id = 3, Name = "Tablet", Price = 299.99 }
};
```

This code creates an array of anonymous objects that represent products. Each product has an `Id`, a `Name`, and a `Price` property. We will use this array as our data source for our API.

4. Add the following code after the products variable declaration:

```csharp
app.MapGet("/products", () => products);
```

This code uses the `app.MapGet()` method to map a GET request to the `/products` path to a lambda expression that returns the products array. The `app.MapGet()` method is one of the fluent methods provided by the `WebApplication` class that allow you to define routes and endpoints for your API. The first parameter is the path that matches the request, and the second parameter is the delegate that handles the request.

Final code will look as below:
```csharp
// Program.cs

var app = WebApplication.Create(args);

var products = new[]
{
    new { Id = 1, Name = "Laptop", Price = 999.99 },
    new { Id = 2, Name = "Smartphone", Price = 499.99 },
    new { Id = 3, Name = "Tablet", Price = 299.99 }
};

app.MapGet("/products", () => products);

app.Run();
```

5. Save the file and run the application. This will launch a browser window and navigate to `https://localhost:{port}/`, which is the default URL for your web application.
6. In the browser address bar, append `/products` to the URL and press Enter. This will send a `GET` request to `https://localhost:{port}/products` and display the response from your API, which should look something like this:

```json
[
  {
    "Id": 1,
    "Name": "Laptop",
    "Price": 999.99
  },
  {
    "Id": 2,
    "Name": "Smartphone",
    "Price": 499.99
  },
  {
    "Id": 3,
    "Name": "Tablet",
    "Price": 299.99
  }
]
```

Congratulations! You have just created your first Minimal API with ASP.NET Core 6!

## Routing and Endpoints
In this section, we will learn more about how to define routes and endpoints for your API using Minimal APIs. Routing is the process of matching an incoming request to an endpoint that can handle it. An endpoint is a delegate that executes some logic and returns a response.

### Defining Routes in Minimal APIs
As we saw in the previous section, we can use fluent methods such as `app.MapGet()` to define routes for our API. These methods take two parameters: a path and a delegate. The path can be either a literal string (such as "`/products`") or a pattern string (such as "`/products/{id}`"). A pattern string can contain placeholders (such as "`{id}`") that match segments of the request path and bind them to variables that can be used in the delegate. For example, the path "`/products/{id}`" matches requests such as "`/products/1`" or "`/products/2`" and binds the value of the id segment to a variable called `id` that can be used in the delegate.

The delegate is a lambda expression that takes one or more parameters and returns a value. The parameters can be of different types, such as `HttpContext`, `HttpRequest`, `HttpResponse`, or custom types. The return value can be of any type, such as `string`, `int`, `bool`, or custom types. The `WebApplication` class will automatically handle the serialization and deserialization of the parameters and the return value, as well as the content negotiation and status code of the response.

For example, the following code defines a route that takes an id parameter of type `int` and returns a product object of type Product:

```csharp
app.MapGet("/products/{id}", (int id) => products.FirstOrDefault(p => p.Id == id));
```

The `WebApplication` class will parse the `id` segment from the request path and convert it to an `int` value. It will then pass it to the lambda expression, which will use LINQ to query the products array and return the product that matches the `id`. The `WebApplication` class will then serialize the product object to JSON and return it as the response body with a status code of `200 OK`.

### Handling HTTP Methods
In addition to using fluent methods such as `app.MapGet()`, `app.MapPost()`, `app.MapPut()`, and `app.MapDelete()` to define routes for specific HTTP methods, you can also use `app.Map()` to define routes for any HTTP method or multiple HTTP methods. The `app.Map()` method takes three parameters: a path, an array of HTTP methods, and a delegate. The path and the delegate are the same as in the fluent methods, but the array of HTTP methods specifies which HTTP methods are allowed for the route.

For example, the following code defines a route that allows both `GET` and `POST` requests to the `/products` path:

```csharp
app.MapMethods("/products", new[] { "GET", "POST" }, () => products);
```

This route will return the products array for `GET` requests and create a new product for `POST` requests. To handle different logic for different HTTP methods, you can use conditional statements or pattern matching in the delegate.

For example, the following code defines a route that allows both `GET` and `POST` requests to the `/products` path, but uses pattern matching to handle them differently:

```csharp
app.MapMethods("/products", new[] { "GET", "POST" }, (HttpContext context) =>
{
    return context.Request.Method switch
    {
        "GET" => context.Response.WriteAsJsonAsync(products),
        "POST" => context.Response.WriteAsJsonAsync(CreateProduct(context)),
        _ => throw new NotSupportedException()
    };
});
```

This route will return the products array for `GET` requests and call a `CreateProduct` method for `POST` requests. The `CreateProduct` method is a custom method that takes a `HttpContext` parameter and creates a new product from the request body. The `HttpContext` parameter is one of the types that can be used in Minimal API delegates. It represents the context of an HTTP request and provides access to properties such as `Request`, `Response`, `User`, `Session`, etc.

The `CreateProduct` method could look something like this:

```csharp
Product CreateProduct(HttpContext context)
{
    var product = context.Request.ReadFromJsonAsync<Product>().Result;
    product.Id = products.Max(p => p.Id) + 1;
    products = products.Append(product).ToArray();
    context.Response.StatusCode = 201;
    context.Response.Headers.Location = $"/products/{product.Id}";
    return product;
}
```

This method uses the `context.Request.ReadFromJsonAsync<T>()` extension method to read and deserialize the request body as a `Product` object. It then assigns a new `Id` to the product based on the maximum `Id` in the existing products array. It then appends the new product to the products array and updates it. It also sets the response status code to `201 Created` and adds a Location header with the URL of the new product. It then returns the new product as the response body.

This is how you can define routes and endpoints for your API using Minimal APIs. You can use fluent methods such as `app.MapGet()`, `app.MapPost()`, etc. to define routes for specific HTTP methods and paths. You can use `app.Map()` to define routes for any HTTP method or multiple HTTP methods and paths. You can use `app.MapMethods()` to define routes for specific HTTP methods that are not covered by the fluent methods and paths. You can use lambda expressions and anonymous types to define the logic and data of each endpoint. You can use different types of parameters and return values in your delegates and let the `WebApplication` class handle the serialization, deserialization, content negotiation, and status code of the response.

To understand the basics of content negotiation, take a look at my blog post on [Content Negotiation in Web API with .NET 6](https://keyurramoliya.com/posts/Content-Negotiation-in-Web-API-with-NET-6/).

## Request and Response Handling
In this section, we will learn more about how to handle incoming requests and outgoing responses in Minimal APIs. Request and response handling is the process of parsing, validating, transforming, and returning data between the client and the server.

### Parsing Incoming Requests
To parse incoming requests in Minimal APIs, you can use various methods and extensions provided by the `WebApplication` class and the `HttpContext` class. These methods and extensions allow you to read and deserialize the request body, headers, cookies, form data, and files as different types of objects.

For example, to read and deserialize the request body as a JSON object, you can use the `context.Request.ReadFromJsonAsync<T>()` extension method, where `T` is the type of the object you want to deserialize. This method will automatically handle the content negotiation and validation of the request body.

For example, the following code reads and deserializes the request body as a `Product` object:

```csharp
var product = context.Request.ReadFromJsonAsync<Product>().Result;
```

Similarly, to read and deserialize the request headers as a dictionary of strings, you can use the `context.Request.Headers.ToDictionary()` extension method. This method will convert the headers collection to a dictionary that maps header names to header values.

For example, the following code reads and deserializes the request headers as a dictionary of strings:

```csharp
var headers = context.Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
```

To read and deserialize the request cookies as a dictionary of strings, you can use the `context.Request.Cookies.ToDictionary()` extension method. This method will convert the cookies collection to a dictionary that maps cookie names to cookie values.

For example, the following code reads and deserializes the request cookies as a dictionary of strings:

```csharp
var cookies = context.Request.Cookies.ToDictionary(c => c.Key, c => c.Value);
```

To read and deserialize the request form data as a dictionary of strings or files, you can use the `context.Request.ReadFormAsync()` method. This method will return a `IFormCollection` object that contains both form fields and form files. You can then access them using indexer or enumerator syntax.

For example, the following code reads and deserializes the request form data as a dictionary of strings or files:

```csharp
var form = context.Request.ReadFormAsync().Result;
var name = form["name"];
var file = form.Files["file"];
```

### Building and Returning Responses
To build and return responses in Minimal APIs, you can use various methods and extensions provided by the `WebApplication` class and the `HttpContext` class. These methods and extensions allow you to write and serialize the response body, headers, cookies, status code, and content type as different types of objects.

For example, to write and serialize the response body as a JSON object, you can use the `context.Response.WriteAsJsonAsync<T>()` extension method, where T is the type of the object you want to serialize. This method will automatically handle the content negotiation and validation of the response body.

For example, the following code writes and serializes the response body as a `Product` object:

```csharp
context.Response.WriteAsJsonAsync(product);
```

Similarly, to write and serialize the response headers as a dictionary of strings, you can use the `context.Response.Headers.Add()` extension method. This method will add a header name and value pair to the headers collection.

For example, the following code writes and serializes the response headers as a dictionary of strings:

```csharp
context.Response.Headers.Add("X-Custom-Header", "Some value");
```

To write and serialize the response cookies as a dictionary of strings, you can use the `context.Response.Cookies.Append()` extension method. This method will add a cookie name and value pair to the cookies collection.

For example, the following code writes and serializes the response cookies as a dictionary of strings:

```csharp
context.Response.Cookies.Append("X-Custom-Cookie", "Some value");
```

To write and serialize the response status code as an `int` value, you can use either the `context.Response.StatusCode` property or the `context.Response.SetStatusCode()` extension method. These methods will set the status code of the response.

For example, the following code writes and serializes the response status code as an int value:

```csharp
context.Response.StatusCode = 201;
```

To write and serialize the response content type as a string value, you can use either the `context.Response.ContentType` property or the `context.Response.SetContentType()` extension method. These methods will set the content type of the response.

For example, the following code writes and serializes the response content type as a string value:

```csharp
context.Response.ContentType = "application/json";
```

### Handling Request Parameters and Query Strings
To handle request parameters and query strings in Minimal APIs, you can use various methods and extensions provided by the `WebApplication` class and the `HttpContext` class. These methods and extensions allow you to bind, validate, and access the request parameters and query strings as different types of objects.

Request parameters are the values that are passed in the path of the request, such as `/products/{id}`. Query strings are the values that are passed in the query of the request, such as `/products?name=laptop`. Both request parameters and query strings can be used to filter, sort, paginate, or customize the data returned by the API.

To bind request parameters and query strings in Minimal APIs, you can use lambda expression parameters in your delegates. The `WebApplication` class will automatically parse and convert the request parameters and query strings to the types of your lambda expression parameters. You can also use attributes such as `[Required]`, `[Range]`, `[MinLength]`, `[MaxLength]`, etc. to add validation rules to your lambda expression parameters.

For example, the following code binds a request parameter of type int called `id` and a query string of type string called `name` in a delegate:

```csharp
app.MapGet("/products/{id}", (int id, [Required] string name) => products.FirstOrDefault(p => p.Id == id && p.Name == name));
```

This code will match requests such as `/products/1?name=laptop` or `/products/2?name=smartphone` and bind the `id` segment to an `int` parameter called `id` and the `name` query to a string parameter called `name`. It will also validate that the name query is not null or empty using the `[Required]` attribute. It will then pass them to the lambda expression, which will use LINQ to query the products array and return the product that matches both `id` and `name`.

To access request parameters and query strings in Minimal APIs, you can also use methods and extensions provided by the `HttpContext` class. These methods and extensions allow you to access the request parameters and query strings as collections of strings or custom types.

For example, to access the request parameters as a collection of strings, you can use the `context.Request.RouteValues` property. This property returns a `RouteValueDictionary` object that contains both route values and data tokens. You can then access them using indexer or enumerator syntax.

For example, the following code accesses the request parameter of type string called `id` as a collection of strings:

```csharp
var id = context.Request.RouteValues["id"].ToString();
```

Similarly, to access the query strings as a collection of strings, you can use the `context.Request.Query` property. This property returns a `QueryCollection` object that contains both keys and values. You can then access them using indexer or enumerator syntax.

For example, the following code accesses the query string of type string called `name` as a collection of strings:

```csharp
var name = context.Request.Query["name"].ToString();
```

To access the request parameters and query strings as custom types, you can use methods such as `context.Request.RouteValues.TryGetValue()` or `context.Request.Query.TryGetValue()`. These methods try to parse and convert the request parameters and query strings to custom types and return true if successful or false if not. They also output the converted value as an out parameter.

For example, the following code accesses the request parameter of type int called `id` as a custom type:

```csharp
if (context.Request.Query.TryGetValue("id", out var id))
{
    // do something with id
}
else
{
    // handle invalid id
}
```

Similarly, the following code accesses the query string of type string called `name` as a custom type:

```csharp
if (context.Request.Query.TryGetValue("name", out var name))
{
    // do something with name
}
else
{
    // handle invalid name
}
```

This is how you can handle request parameters and query strings in Minimal APIs. You can use lambda expression parameters to bind and validate them as different types of objects. You can also use methods and extensions to access them as collections of strings or custom types.

## Middleware in Minimal APIs
In this section, we will learn more about how to use middleware in Minimal APIs. Middleware is a component that sits between the client and the server and performs some logic before or after the request is handled by the endpoint. Middleware can be used to perform tasks such as authentication, authorization, caching, compression, logging, error handling, etc.

### Introduction to Middleware
Middleware is a delegate that takes a `HttpContext` parameter and returns a `Task`. The `HttpContext` parameter represents the context of an HTTP request and provides access to properties such as `Request`, `Response`, `User`, `Session`, etc. The `Task` represents an asynchronous operation that can be awaited or continued.

Middleware can be either terminal or non-terminal. Terminal middleware is middleware that does not call the next middleware in the pipeline and returns a response directly. Non-terminal middleware is middleware that calls the next middleware in the pipeline and optionally modifies the response.

Middleware can be either built-in or custom. Built-in middleware is middleware that is provided by ASP.NET Core or third-party libraries and packages. Custom middleware is middleware that is created by the developer using lambda expressions or classes.

### Using Middleware in Minimal APIs
To use middleware in Minimal APIs, you can use various methods provided by the `WebApplication` class. These methods allow you to add, remove, or configure middleware for your web application.

To add built-in middleware in Minimal APIs, you can use fluent methods such as `app.UseAuthentication()`, `app.UseAuthorization()`, `app.UseCors()`, `app.UseResponseCompression()`, `app.UseRouting()`, `app.UseEndpoints()`, etc. These methods add specific built-in middleware to your web application and optionally take parameters to configure them.

For example, the following code adds authentication, authorization, CORS, response compression, routing, and endpoint middleware to your web application:

```csharp
app.UseAuthentication();
app.UseAuthorization();
app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseResponseCompression();
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    // define your endpoints here
});
```

To add custom middleware in Minimal APIs, you can use fluent methods such as `app.Use()`, `app.Run()`, `app.Map()`, `app.MapMethods()`, etc. These methods take lambda expressions or delegates that define your custom middleware logic and optionally take parameters to configure them.

For example, the following code adds a custom middleware that logs the request path and method to the console:

```csharp
app.Use((context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Path} {context.Request.Method}");
    return next();
});
```

This code uses the `app.Use()` method to add a non-terminal custom middleware that takes two parameters: a `HttpContext` parameter called `context` and a `RequestDelegate` parameter called `next`. The context parameter represents the context of the current request and provides access to properties such as `Request`, `Response`, `User`, `Session`, etc. The next parameter represents the next middleware in the pipeline and can be invoked using the `()` operator or the `Invoke()` method.

The lambda expression uses the context parameter to access the request path and method and writes them to the console using the `Console.WriteLine()` method. It then invokes the next parameter using the `()` operator to continue the execution of the next middleware in the pipeline.

### Customizing Middleware Pipeline
To customize the middleware pipeline in Minimal APIs, you can use various methods provided by the `WebApplication` class. These methods allow you to branch, map, or filter your middleware based on certain conditions or criteria.

To branch your middleware pipeline in Minimal APIs, you can use fluent methods such as `app.Map()`, `app.MapMethods()`, `app.MapWhen()`, etc. These methods create a branch in your middleware pipeline that only executes when a certain condition or criterion is met.

For example, the following code branches your middleware pipeline based on the request path:

```csharp
app.Map("/products", productsApp =>
{
    // define your products-related middleware and endpoints here
});

app.Map("/orders", ordersApp =>
{
    // define your orders-related middleware and endpoints here
});
```

This code uses the `app.Map()` method to create two branches in your middleware pipeline: one for requests that match the /products path and one for requests that match the `/orders` path. The `app.Map()` method takes two parameters: a path and a delegate. The path is a literal string or a pattern string that matches the request path. The delegate is a lambda expression or a method that takes a `WebApplication` parameter and defines the middleware and endpoints for the branch.

The `productsApp` and `ordersApp` parameters are `WebApplication` instances that represent the branches of the middleware pipeline. They have the same methods and properties as the app parameter, but they only apply to the requests that match the branch condition.

To map your middleware pipeline in Minimal APIs, you can use fluent methods such as `app.MapGet()`, `app.MapPost()`, `app.MapPut()`, `app.MapDelete()`, etc. These methods map your middleware pipeline to specific HTTP methods and paths.

For example, the following code maps your middleware pipeline to `GET` requests to the `/products` path:

```csharp
app.MapGet("/products", () => products);
```

This code uses the `app.MapGet()` method to map your middleware pipeline to `GET` requests that match the `/products` path. The `app.MapGet()` method takes two parameters: a path and a delegate. The path is a literal string or a pattern string that matches the request path. The delegate is a lambda expression or a method that defines the endpoint logic for the request.

To filter your middleware pipeline in Minimal APIs, you can use fluent methods such as `app.UseWhen()`, `app.UseMiddleware()`, etc. These methods filter your middleware pipeline based on a predicate function that evaluates the HttpContext of the request.

For example, the following code filters your middleware pipeline based on the request scheme:

```csharp
app.UseWhen(context => context.Request.IsHttps, httpsApp =>
{
    // define your HTTPS-related middleware here
});
```

This code uses the `app.UseWhen()` method to filter your middleware pipeline based on whether the request scheme is HTTPS or not. The `app.UseWhen()` method takes two parameters: a predicate function and a delegate. The predicate function is a lambda expression or a method that takes a `HttpContext` parameter and returns a `bool` value. The delegate is a lambda expression or a method that takes a `WebApplication` parameter and defines the middleware for the filter.

The `httpsApp` parameter is a `WebApplication` instance that represents the filtered middleware pipeline. It has the same methods and properties as the app parameter, but it only applies to the requests that pass the predicate function.

This is how you can use and customize middleware in Minimal APIs. You can use fluent methods to add built-in or custom middleware to your web application and optionally configure them. You can also use fluent methods to branch, map, or filter your middleware pipeline based on certain conditions or criteria.

## Error Handling and Logging
In this section, we will learn more about how to handle errors and log diagnostics in Minimal APIs. Error handling and logging are essential tasks for any web application, as they help to identify, debug, and resolve issues that may occur during runtime.

### Handling Exceptions in Minimal APIs
To handle exceptions in Minimal APIs, you can use various methods provided by the `WebApplication` class. These methods allow you to catch, handle, or rethrow exceptions that may occur in your middleware or endpoints.

- To catch exceptions in Minimal APIs, you can use fluent methods such as `app.UseExceptionHandler()`, `app.UseStatusCodePages()`, `app.UseDeveloperExceptionPage()`, etc. These methods add built-in exception handling middleware to your web application that catch exceptions and return appropriate responses.
- To rethrow exceptions in Minimal APIs, you can use the throw keyword or the `ExceptionDispatchInfo.Throw()` method. These methods rethrow the exception to the next middleware or the caller without losing the original stack trace or context information.

For example, the following code adds a custom exception handling logic that logs the exception details and returns a JSON object with an error message:

```csharp
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Exception: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "Something went wrong" });
    }
});
```

This code uses the `app.Use()` method to add a non-terminal custom middleware that takes two parameters: a `HttpContext` parameter called `context` and a `RequestDelegate` parameter called `next`. The context parameter represents the context of the current request and provides access to properties such as `Request`, `Response`, `User`, `Session`, etc. The next parameter represents the next middleware in the pipeline and can be invoked using the `()` operator or the `Invoke()` method.

The lambda expression uses a try-catch block to execute the next middleware and catch any exceptions that may occur. It then uses the `Console.WriteLine()` method to write the exception message and stack trace to the console. It also sets the response status code to `500 Internal Server Error` and content type to `application/json`. It then uses the `context.Response.WriteAsJsonAsync<T>()` extension method to write and serialize a JSON object with an error message to the response body.

### Logging Errors and Diagnostics
To log errors and diagnostics in Minimal APIs, you can use various methods provided by the ILogger interface and its implementations. The `ILogger` interface is an abstraction for logging that supports multiple logging providers and levels. Logging providers are components that write logs to different destinations, such as console, file, database, etc. Logging levels are categories that indicate the severity or importance of logs, such as Trace, Debug, Information, Warning, Error, Critical, etc.

For example, the following code injects an `ILogger` parameter into an endpoint and logs an information message:

```csharp
app.MapGet("/hello", (ILogger logger) =>
{
    logger.LogInformation("Hello world");
    return "Hello world";
});
```

This code uses the `app.MapGet()` method to map a GET request to the `/hello` path to a lambda expression that takes an `ILogger` parameter called logger. The logger parameter is an instance of `ILogger` that is resolved by dependency injection. The lambda expression uses the `logger.LogInformation()` method to log an information message with the text "Hello world". It then returns "Hello world" as the response body.

### Best Practices for Error Handling
Error handling is a crucial aspect of any web application development, as it can affect the user experience and satisfaction. Therefore, it is important to follow some best practices for error handling in Minimal APIs:

- Use appropriate status codes and content types for your responses. Status codes indicate the result of the request processing and content types indicate the format of the response body. For example, use `200 OK` for successful requests, `400 Bad Request` for invalid requests, `404 Not Found` for missing resources, `500 Internal Server` Error for server errors, etc. Use `application/json` for JSON responses, `text/plain` for plain text responses, etc.
- Use descriptive and consistent error messages for your responses. Error messages provide more details and guidance about the errors that occurred and how to fix them. For example, use "Invalid product id" instead of "Bad request", "Product not found" instead of "Not found", "Something went wrong" instead of "Internal server error", etc.
- Use structured and standardized error formats for your responses. Error formats provide a consistent and easy-to-parse way of representing errors in your responses. For example, use JSON objects with properties such as error, message, code, details, etc. to represent errors in your responses.
- Use logging and exception handling middleware to catch and handle errors globally. Logging and exception handling middleware can help to catch unhandled exceptions and log them to different destinations. They can also return custom error pages or responses for different status codes or exceptions. For example, use `app.UseExceptionHandler()`, `app.UseStatusCodePages()`, `app.UseDeveloperExceptionPage()`, etc. to add built-in logging and exception handling middleware to your web application.
- Use try-catch blocks or exception filters to catch and handle errors locally. Try-catch blocks or exception filters can help to catch specific exceptions and handle them in a custom way. They can also rethrow the exceptions to the next middleware or the caller if needed. For example, use try-catch blocks or exception filters in your middleware or endpoints to catch and handle exceptions such as `KeyNotFoundException`, `NotSupportedException`, etc.

## Conclusion
In this blog post, we have learned about Minimal APIs in ASP.NET Core 6, a new feature that simplifies and streamlines the process of building APIs with ASP.NET Core. We have covered the following topics:

- What are Minimal APIs and what are their advantages over Traditional APIs
- How to set up your environment and create your first Minimal API
- How to define routes and endpoints for your API using fluent methods and lambda expressions
- How to handle request and response data using methods and extensions for parsing, writing, binding, validating, and accessing data
- How to use and customize middleware for your web application using fluent methods and lambda expressions
- How to handle errors and log diagnostics using methods and extensions for catching, handling, rethrowing, logging, and returning errors

Minimal APIs are a great way to create APIs with minimal code and configuration, using a declarative and fluent syntax that focuses on the essential aspects of the API design. They enable a more functional and expressive style of programming, making it easier to implement logic and data transformations. They also improve the performance and scalability of the API by reducing the overhead of unnecessary components and middleware.

I hope that you have enjoyed this blog post and learned something new about Minimal APIs in ASP.NET Core 6. I encourage you to try out Minimal APIs for yourself and see how they can help you create amazing APIs with ASP.NET Core.

Thank you for reading this blog post and happy coding! 😊
