---
layout: post
title: "Understanding Output Caching in ASP.NET Core"
categories:
- programming
tags:
- C#
- ASP.NET Core
- Caching
- Output Caching
- .NET
- .NET 7
- .NET Core
---

Output caching is an useful technique that can significantly improve the performance of your web applications. In this blog post, we will explore what output caching is, how it works in ASP.NET Core, and how to implement it in your projects.

## What is Output Caching?

Output caching is the process of storing the response of a web request in memory or on disk, and reusing it for subsequent requests that match certain criteria. The purpose of output caching is to reduce the amount of work that the web server has to do for each request, such as executing code, querying databases, or rendering views. By serving cached responses, the web server can handle more requests faster and with less resources.

There are different types of output caching, depending on where the response is stored and who can access it. The most common types are:

- **Client-side caching**: The response is stored in the browser's cache and reused by the same client. This type of caching is controlled by HTTP headers such as `Cache-Control` and `Expires`, which specify how long and under what conditions the browser can use the cached response.
- **Proxy caching**: The response is stored in an intermediate proxy server (such as a CDN) and reused by multiple clients. This type of caching is also controlled by HTTP headers, such as `ETag`, which specify how the proxy can validate and vary the cached response.
- **Server-side caching**: The response is stored in the web server's memory or disk and reused by multiple clients. This type of caching is controlled by the web application's logic, which decides what responses to cache and how to invalidate them.

## Output Caching in ASP.NET Core

ASP.NET Core is a modern web framework that supports output caching out of the box. Output Caching Middleware, which is available in ASP.NET Core 7.0 and later, caches responses based on configuration rather than HTTP headers. It works like a server-side cache and can benefit UI apps as well as API requests. With output caching, you can specify what responses to cache, how long to cache them, where to store them, and how to invalidate them. Output caching also supports cache entry dependencies, storage medium extensibility, cache profiles, and more.

## Implementing Output Caching in ASP.NET Core

To implement output caching in your ASP.NET Core app, you need to follow these steps:

### Configuring output caching in Program.cs

You need to add the output caching services to your dependency injection container by calling `AddOutputCache` in your `ConfigureServices` method. You can also define global or named cache policies that specify the default or custom settings for output caching. For example:

```csharp
builder.Services.AddOutputCache(options =>
{
	// Add a base policy that applies to all endpoints
	options.AddBasePolicy(basePolicy => basePolicy.Expire(TimeSpan.FromSeconds(120)));

	// Add a named policy that applies to selected endpoints
	options.AddPolicy("Expire20", policyBuilder => policyBuilder.Expire(TimeSpan.FromSeconds(20)));
});
```

and then add the below code to use output caching:

```csharp
app.UseOutputCache();
```

### Using attributes for action-level output caching

You need to apply the `[OutputCache]` attribute to your endpoints (such as actions or pages) that you want to enable output caching for. You can use the attribute without parameters to apply the base policy, or with a policy name or inline settings to apply a custom policy. For example:

```csharp
// Use the base policy
[OutputCache]
public IActionResult Index()
{
    return View();
}

// Use a named policy
[OutputCache("Expire20")]
public IActionResult About()
{
    return View();
}

// Use inline settings
[OutputCache(Duration = 30)]
public IActionResult Contact()
{
    return View();
}
```

## Conclusion

Output caching is an important technique that can help you improve the performance of your web applications by reducing the load on your web server and delivering faster responses to your clients. ASP.NET Core provides a built-in output caching middleware that allows you to configure and control output caching with ease and flexibility.

In this blog post, we have learned what output caching is, how it works in ASP.NET Core, and how to implement it in your projects.

Happy coding!
