---
layout: post
title: "Exploring In-Memory Caching in ASP.NET Core"
categories:
- programming
tags:
- C#
- ASP.NET Core
- Caching
- In-Memory
- .NET
- .NET 6
- .NET Core
---

Caching is a technique that improves the performance and scalability of web applications by storing frequently accessed data in memory or other fast storage devices. Caching reduces the need to access the original data source, such as a database or an external service, which can be time-consuming and resource-intensive.

Caching is especially important for web applications that handle a large number of requests from multiple users. By caching data, web applications can respond faster to user requests and reduce the load on the server and the network.

In this blog post, we will explore how to use in-memory caching in ASP.NET Core. We will learn what in-memory caching is, how it works, how to set it up, and how to use it in our web applications.

## Understanding Caching
### What is caching?
Caching is the process of storing data in a temporary storage location, called a cache, for faster access. A cache is usually a small and fast memory device that can store a subset of data from a larger and slower data source.

The idea behind caching is that data that is accessed frequently or recently is more likely to be accessed again in the near future. Therefore, by keeping such data in the cache, we can avoid accessing the original data source every time we need the data. This can improve the performance, scalability, and user experience of our web applications.

### Benefits of caching
Some of the benefits of caching are:

- **Faster response time**: Caching can reduce the latency of accessing data by retrieving it from the cache instead of the original data source. This can improve the responsiveness and user satisfaction of our web applications.
- **Reduced server load**: Caching can reduce the number of requests that need to be handled by the server or the database. This can lower the CPU and memory usage, as well as the network bandwidth consumption, of our web applications. This can also prevent overloading or crashing of our server or database due to high traffic or heavy workload.
- **Increased availability**: Caching can increase the availability of our web applications by providing data even when the original data source is unavailable or slow. This can improve the reliability and fault tolerance of our web applications.

### Types of caching
There are different types of caching that can be used for different purposes and scenarios. Some of the common types of caching are:

- **In-memory caching**: In-memory caching stores data in the memory of the web server or application. It is fast and easy to implement, but it has limited capacity and scope. It is suitable for storing small amounts of data that are local to a single instance of an application.
- **Distributed caching**: Distributed caching stores data in a separate cache server or cluster that can be shared by multiple instances of an application. It has higher capacity and scalability, but it requires more configuration and network communication. It is suitable for storing large amounts of data that are global to an application or across multiple applications.
- **Client-side caching**: Client-side caching stores data in the browser or device of the user. It has low latency and network usage, but it depends on the user's settings and preferences. It is suitable for storing static or personalized data that are specific to a user or a session.

### When to use in-memory caching
In-memory caching is one of the simplest and most effective ways to improve the performance and scalability of our web applications. However, it is not always appropriate or sufficient for every situation. We should use in-memory caching when:

- The data we want to cache is small in size and does not change frequently.
- The data we want to cache is local to a single instance of an application or does not need to be synchronized across multiple instances.
- The data we want to cache does not need to persist beyond the lifetime of an application or a process.
- The performance gain from caching outweighs the memory cost and complexity.

## In-Memory Caching in ASP.NET Core
### What is in-memory caching?
In-memory caching is a type of caching that stores data in the memory of an ASP.NET Core application. ASP.NET Core provides built-in support for in-memory caching through the `IMemoryCache` interface and its default implementation `MemoryCache`.

The `IMemoryCache` interface exposes methods for creating, retrieving, updating, and removing cache entries. A cache entry consists of a key-value pair, where the key is a unique identifier for the cached data and the value is the actual data object.

The `MemoryCache` class implements `IMemoryCache` using a concurrent dictionary as its underlying storage mechanism. It also provides features such as cache expiration, eviction, priority, size limit, and dependency.

### Advantages of in-memory caching
Some of the advantages of using in-memory caching in ASP.NET Core are:

- **Easy to use**: ASP.NET Core provides a simple and convenient way to use in-memory caching through dependency injection and extension methods. We can easily access and manipulate the cache from any part of our application code.
- **Fast and efficient**: In-memory caching is one of the fastest and most efficient ways to cache data, as it avoids the overhead of accessing external data sources or network communication. It can significantly improve the performance and scalability of our web applications.
- **Flexible and customizable**: In-memory caching allows us to control various aspects of caching, such as expiration, eviction, priority, size limit, and dependency. We can also implement our own custom cache providers or extensions using the `IMemoryCache` interface.

### Limitations and considerations
Some of the limitations and considerations of using in-memory caching in ASP.NET Core are:

- **Limited capacity and scope**: In-memory caching has limited capacity and scope, as it depends on the available memory of the web server or application. It can also be affected by memory pressure or garbage collection. It is not suitable for storing large amounts of data or data that needs to be shared across multiple instances of an application.
- **No persistence or backup**: In-memory caching does not persist or backup the cached data, as it is stored in the volatile memory of an application. It can be lost or cleared when the application restarts, shuts down, or crashes. It is not suitable for storing critical or sensitive data that needs to be recovered or secured.
- **No consistency or invalidation**: In-memory caching does not guarantee the consistency or invalidation of the cached data, as it does not monitor or notify the changes in the original data source. It can become stale or outdated when the original data source is updated, deleted, or corrupted. It is not suitable for storing dynamic or volatile data that needs to be refreshed or synchronized.

## Setting Up In-Memory Caching
### Prerequisites
To use in-memory caching in ASP.NET Core, we need to have:

- An ASP.NET Core web application project
- The `Microsoft.Extensions.Caching.Memory` NuGet package installed

### Adding the necessary NuGet packages
To install the `Microsoft.Extensions.Caching.Memory` NuGet package, we can use one of the following methods:

- Using Visual Studio: Right-click on the project in Solution Explorer, select Manage NuGet Packages, search for `Microsoft.Extensions.Caching.Memory`, and click Install.
- Using dotnet CLI: Run the following command in the terminal: `dotnet add package Microsoft.Extensions.Caching.Memory`
- Using Package Manager Console: Run the following command in the Package Manager Console: `Install-Package Microsoft.Extensions.Caching.Memory`

### Configuring the caching service in Startup.cs
To use in-memory caching in ASP.NET Core, we need to register and configure the `IMemoryCache` service in the `Startup.cs` or `Program.cs` file(Depending on structure of your application). We can do this by adding the following code in the `ConfigureServices` method:

```csharp
// Add IMemoryCache service
services.AddMemoryCache(options =>
{
    // Set cache size limit (in bytes)
    options.SizeLimit = 1024 * 1024 * 100; // 100 MB

    // Set cache compaction percentage
    options.CompactionPercentage = 0.25; // 25%

    // Set cache expiration scan frequency
    options.ExpirationScanFrequency = TimeSpan.FromMinutes(5); // 5 minutes
});
```

The `AddMemoryCache` method adds the default implementation of `IMemoryCache`, which is `MemoryCache`, to the dependency injection container. It also registers a default set of options for `MemoryCache`. The `MemoryCacheOptions` class allows us to configure various aspects of `MemoryCache`, such as:

- **SizeLimit**: The maximum size of the cache, in bytes. If this limit is exceeded, the cache will compact itself by removing low-priority items until it falls below this limit. The default value is null, which means no size limit.
- **CompactionPercentage**: The percentage of items to be removed when the cache compacts itself due to size limit. The value must be between 0 and 1. The default value is 0.05, which means 5%.
- **ExpirationScanFrequency**: The frequency at which the cache checks for expired items. The value must be a positive time span. The default value is one minute.

### Cache expiration and eviction policies
One of the important aspects of caching is to determine when to remove or invalidate a cache entry. This can be done by using cache expiration and eviction policies.

Cache expiration policy defines how long a cache entry should remain valid in the cache. It can be based on absolute time (e.g., expire after 10 minutes) or sliding time (e.g., expire after 10 minutes of inactivity). A cache entry will be removed from the cache when it expires.

Cache eviction policy defines how to prioritize a cache entry for removal from the cache when the cache is full or under memory pressure. It can be based on priority (e.g., high, normal, low, never remove) or size (e.g., how much memory a cache entry occupies). A cache entry will be evicted from the cache when it has low priority or size.

ASP.NET Core allows us to specify the cache expiration and eviction policies for each cache entry by using the `MemoryCacheEntryOptions` class. We can create an instance of this class and pass it as a parameter when we create or update a cache entry. For example:

```csharp
// Create an instance of MemoryCacheEntryOptions
var cacheEntryOptions = new MemoryCacheEntryOptions();

// Set absolute expiration policy (expire after 10 minutes)
cacheEntryOptions.SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

// Set sliding expiration policy (expire after 10 minutes of inactivity)
cacheEntryOptions.SetSlidingExpiration(TimeSpan.FromMinutes(10));

// Set priority policy (high priority)
cacheEntryOptions.Priority = CacheItemPriority.High;

// Set size policy (occupy 1 MB of memory)
cacheEntryOptions.Size = 1024 * 1024; // 1 MB

// Create or update a cache entry with the specified options
_cache.Set("key", "value", cacheEntryOptions);
```

The `MemoryCacheEntryOptions` class provides various methods and properties for configuring the cache expiration and eviction policies, such as:

- **SetAbsoluteExpiration**: Sets the absolute expiration policy based on a time span or a date time offset. The cache entry will expire at the specified time span or date time offset from now.
- **SetSlidingExpiration**: Sets the sliding expiration policy based on a time span. The cache entry will expire if it is not accessed within the specified time span.
- **Priority**: Gets or sets the priority policy based on an enumeration value. The cache entry will have higher or lower chances of being evicted based on its priority.
- **Size**: Gets or sets the size policy based on a long value. The cache entry will occupy the specified amount of memory in bytes.
- **RegisterPostEvictionCallback**: Registers a callback method that will be invoked when the cache entry is evicted. The callback method can perform some actions or logging when the cache entry is removed from the cache.

## Basic Usage of In-Memory Cache
### Storing and retrieving data from the cache
To store and retrieve data from the in-memory cache, we can use the methods provided by the `IMemoryCache` interface. The most commonly used methods are:

- **Set**: Creates or updates a cache entry with the specified key, value, and options. If the key already exists in the cache, it will overwrite the existing value and options. If the key does not exist in the cache, it will create a new cache entry with the specified value and options.
- **Get**: Retrieves a cache entry with the specified key. If the key exists in the cache, it will return the value associated with that key. If the key does not exist in the cache, it will return null.
- **TryGetValue**: Tries to retrieve a cache entry with the specified key. If the key exists in the cache, it will return true and assign the value to an out parameter. If the key does not exist in the cache, it will return false and assign null to the out parameter.
- **Remove**: Removes a cache entry with the specified key. If the key exists in the cache, it will remove it and invoke any registered post-eviction callbacks. If the key does not exist in the cache, it will do nothing.

For example:

```csharp
// Create or update a cache entry with key "message" and value "Hello, world!"
_cache.Set("message", "Hello, world!", cacheEntryOptions);

// Retrieve a cache entry with key "message"
var message = _cache.Get<string>("message"); // "Hello, world!"

// Try to retrieve a cache entry with key "message"
if (_cache.TryGetValue("message", out message))
{
    // Key exists in the cache
    Console.WriteLine(message); // "Hello, world!"
}
else
{
    // Key does not exist in the cache
    Console.WriteLine("Key not found");
}

// Remove a cache entry with key "message"
_cache.Remove("message");
```

### Using caching with data retrieved from a database
One of the common scenarios where we can use caching is to store data that we retrieve from a database or an external service. This can reduce the number of database queries or service calls that we need to make, and improve the performance and scalability of our web applications.

To use caching with data retrieved from a database, we can use one of the following patterns:

- **Cache-aside**: In this pattern, we first check if the data we need is already in the cache. If it is, we return it from the cache. If it is not, we query it from the database, store it in the cache, and return it from the cache. This pattern is suitable for read-heavy scenarios, where the data is accessed more frequently than it is updated.

- **Cache-first**: In this pattern, we always try to return the data from the cache. If the data is not in the cache, we query it from the database, store it in the cache, and return it from the cache. If the data is in the cache, but it is expired or invalid, we remove it from the cache, query it from the database, store it in the cache, and return it from the cache. This pattern is suitable for write-heavy scenarios, where the data is updated more frequently than it is accessed.

- **Write-through**: In this pattern, we always update both the database and the cache when we modify the data. This way, we ensure that the data in the cache is always consistent with the data in the database. This pattern is suitable for scenarios where consistency is important, and where the data is updated and accessed at a similar rate.

To implement these patterns in ASP.NET Core, we can use extension methods provided by the `Microsoft.Extensions.Caching.Memory` namespace. These methods are:

- **GetOrCreate**: Gets a cache entry with the specified key or creates one using a factory method if it does not exist. This method can be used to implement the cache-aside or cache-first patterns.
- **GetOrCreateAsync**: Gets a cache entry with the specified key or creates one using an asynchronous factory method if it does not exist. This method can be used to implement the cache-aside or cache-first patterns with asynchronous operations.
- **Set**: Creates or updates a cache entry with the specified key, value, and options. This method can be used to implement the write-through pattern.

For example:

```csharp
// Using GetOrCreate to implement cache-aside pattern
var product = _cache.GetOrCreate("product_1", entry =>
{
    // Set cache entry options
    entry.SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
    entry.Priority = CacheItemPriority.High;

    // Query product from database
    var product = _dbContext.Products.Find(1);

    // Return product as cache entry value
    return product;
});

// Using GetOrCreateAsync to implement cache-first pattern
var product = await _cache.GetOrCreateAsync("product_1", async entry =>
{
    // Set cache entry options
    entry.SetSlidingExpiration(TimeSpan.FromMinutes(10));
    entry.Priority = CacheItemPriority.Normal;

    // Query product from database asynchronously
    var product = await _dbContext.Products.FindAsync(1);

    // Return product as cache entry value
    return product;
});

// Using Set to implement write-through pattern
// Update product in database
var product = _dbContext.Products.Find(1);
product.Name = "New Name";
_dbContext.SaveChanges();

// Update product in cache
_cache.Set("product_1", product);
```

### Handling cache misses
A cache miss occurs when we try to retrieve a cache entry with a key that does not exist in the cache. This can happen when:

- The cache entry has expired or been evicted due to expiration or eviction policies.
- The cache entry has been removed manually or programmatically.
- The cache entry has never been created or stored in the first place.

When a cache miss occurs, we need to handle it gracefully and appropriately. Depending on our caching strategy and application logic, we can do one of the following actions:

- Query the original data source and store the data in the cache for future use. This can be done by using the `GetOrCreate` or `GetOrCreateAsync` methods as shown above.
- Return a default or fallback value that indicates that the data is not available or not found. This can be done by using null coalescing operators or conditional expressions. For example:

```csharp
// Return null if key does not exist in cache
var product = _cache.Get<Product>("product_1") ?? null;

// Return "Not Found" if key does not exist in cache
var message = _cache.Get<string>("message") ?? "Not Found";
```

- Throw an exception or display an error message that informs that the data is not available or not found. This can be done by using exception handling mechanisms or logging frameworks. For example:

```csharp
// Throw an exception if key does not exist in cache
var product = _cache.Get<Product>("product_1") ?? throw new KeyNotFoundException("Product not found in cache");

// Log an error message if key does not exist in cache
var message = _cache.Get<string>("message");
if (message == null)
{
    _logger.LogError("Message not found in cache");
}
```

## Conclusion
In this blog post, we have explored how to use in-memory caching in ASP.NET Core. We have learned what in-memory caching is, how it works, how to set it up, and how to use it in our web applications.

In-memory caching is an useful technique that can improve the performance and scalability of our web applications by storing frequently accessed data in memory. However, it also has some limitations and considerations that we need to be aware of and handle properly.

I hope you enjoyed this blog post and learned something new. Thank you for reading and happy coding! 😊
