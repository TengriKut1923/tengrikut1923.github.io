---
layout: post
title: "Content Negotiation in Web API with .NET 6"
categories:
- programming
tags:
- C#
- .NET
- Web API
- REST API
- REST
- Content Negotiation
---

Content Negotiation is a process that allows a client and a server to agree on the best format of data to exchange in a web request. It is an essential feature of Web API development, as it enables the creation of flexible and interoperable web services that can support multiple media types. In this blog post, we will explore how Content Negotiation works, why it is important, and how we can implement it in .NET 6, the latest version of the .NET that offers many improvements and new features for Web API development.

> You can find the source code of this blog post on [this GitHub repo](https://github.com/KeyurRamoliya/ContentNegotiationDemo).
{: .prompt-info }

## Understanding Content Negotiation
Content Negotiation is based on the principle that the client and the server should communicate their preferences and capabilities regarding the media types they can send and receive. A media type, also known as MIME type, is a standardized way of identifying the format and structure of data, such as `application/json`, `text/html`, `image/png`, etc. Content Negotiation allows the client and the server to negotiate the most suitable media type for each request and response, based on factors such as availability, quality, efficiency, and user preference.

There are two main perspectives in Content Negotiation: the client perspective and the server perspective. The client perspective involves specifying the desired media type(s) for the response, using one or more of the following HTTP headers:

- `Accept`: indicates the media type(s) that are acceptable for the response, along with optional parameters such as quality factors (e.g., `Accept: application/json;q=0.9, text/plain;q=0.8`).
- `Accept-Charset`: indicates the character set(s) that are acceptable for the response (e.g., `Accept-Charset: utf-8, iso-8859-1`).
- `Accept-Encoding`: indicates the content encoding(s) that are acceptable for the response (e.g., `Accept-Encoding: gzip, deflate`).
- `Accept-Language`: indicates the natural language(s) that are preferred for the response (e.g., `Accept-Language: en-US, fr-CA`).

The server perspective involves providing the appropriate media type for the response, using one or more of the following HTTP headers:

- `Content-Type`: indicates the media type of the entity-body sent to the client (e.g., `Content-Type: application/json`).
- `Content-Encoding`: indicates the content encoding applied to the entity-body (e.g., `Content-Encoding: gzip`).
- `Content-Language`: indicates the natural language of the entity-body (e.g., `Content-Language: en-US`).

The server can also use other HTTP headers to provide additional information about the available media types, such as:

- `Vary`: indicates which request headers were used to select the response (e.g., `Vary: Accept`).
- `Content-Disposition`: indicates how to present the response to the user (e.g., `Content-Disposition: attachment; filename="report.pdf"`).
- `Link`: provides links to alternative representations of the resource (e.g., `Link: <http://example.com/report.json>; rel="alternate"; type="application/json"`).

The supported media types depend on the implementation of the client and the server. However, some common media types for Web API development are:

- `application/json`: a lightweight and human-readable format for representing structured data, based on JavaScript Object Notation (JSON).
- `application/xml`: a widely used format for representing structured data, based on Extensible Markup Language (XML).
- `text/plain`: a simple format for representing unstructured text data.
- `text/html`: a format for representing hypertext documents, based on HyperText Markup Language (HTML).
- `text/csv`: a format for representing tabular data, based on Comma-Separated Values (CSV).
- `image/*`: a family of formats for representing image data, such as `image/png`, `image/jpeg`, `image/gif`, etc.

## Content Negotiation in Web API
Content Negotiation fits into Web API architecture by allowing the client and the server to exchange data in different formats without changing the underlying logic or functionality of the web service. This has several key benefits, such as:

- Flexibility: Content Negotiation enables the web service to support multiple media types and cater to different client needs and preferences. For example, a web service that provides product information can return data in JSON format for web applications, XML format for legacy systems, HTML format for browsers, or CSV format for spreadsheets.
- Interoperability: Content Negotiation facilitates communication between different systems and platforms that may have different capabilities and expectations regarding data formats. For example, a web service that consumes data from another web service can negotiate the best media type for both parties and avoid compatibility issues.
- Efficiency: Content Negotiation allows optimizing data transfer and processing by choosing the most suitable media type for each scenario. For example, a web service that returns large amounts of data can use compression techniques (such as gzip) to reduce the size of the response and improve network performance.

## Implementing Content Negotiation in .NET 6
.NET 6 is the latest version of the .NET that provides a unified platform for building modern applications across different domains, such as web, mobile, desktop, cloud, gaming, and IoT. .NET 6 offers many improvements and new features for Web API development, such as:

- Minimal APIs: a new way of creating lightweight and expressive web services using minimal code and configuration.
- Hot Reload: a feature that enables making changes to the code without restarting the application or losing the app state.
- Blazor: a framework that enables building interactive web UIs using C# instead of JavaScript.
- gRPC: a high-performance, cross-platform, and open-source framework for building remote procedure call (RPC) services.
- OpenAPI: a standard for describing and documenting web services using a machine-readable and human-readable format.

In this section, we will see how we can implement Content Negotiation in .NET 6 using a basic Web API project. We will use Visual Studio Code (VS Code) as our code editor and .NET Command Line Interface (CLI) as our tool for creating and running the project. We will also use Postman as our tool for testing the web service.

### Setting up a basic .NET 6 Web API project
To create a basic .NET 6 Web API project, we need to follow these steps:

- Install the latest version of [.NET 6 SDK](https://dotnet.microsoft.com/en-us/) on our machine.
- Install the latest version of [VS Code](https://code.visualstudio.com) on our machine.
- Install the [C# Dev Kit](https://keyurramoliya.com/posts/C-Dev-Kit/) for VS Code.
- Open VS Code and create a new folder for our project (e.g., `ContentNegotiationDemo`).
- Open a terminal in VS Code and run the following command to create a new Web API project using the `webapi` template:

```bash
dotnet new webapi -n ContentNegotiationDemo
```

- Run the following command to restore the dependencies of the project:

```bash
dotnet restore
```

- Run the following command to run the project:

```bash
dotnet run
```

- Open a browser and navigate to `https://localhost:5001/WeatherForecast` to see the default response of the web service in JSON format.

### Configuring Content Negotiation in Program.cs
To configure Content Negotiation in our Web API project, we need to modify the `Program.cs` file, which contains the configuration and middleware components of our web service. We need to make the following changes:

- Add the following `using` statements at the top of the file:

```csharp
using System.Buffers;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;
```

- Add the following code to configure the `AddControllers` service with custom options for Content Negotiation:

```csharp
builder.Services.AddControllers(options =>
{
    options.RespectBrowserAcceptHeader = true;
    options.ReturnHttpNotAcceptable = true;

    // Add custom media type formatter for CSV format
    options.OutputFormatters.Add(new CsvOutputFormatter());
    options.OutputFormatters.Add(new HtmlOutputFormatter());
})
.AddXmlSerializerFormatters();
```

- Save the file.

### Handling media types using MediaTypeFormatter
To handle different media types in our Web API project, we need to create custom classes that inherit from `MediaTypeFormatter`, which is an abstract class that provides functionality for serializing and deserializing data in various formats. In this section, we will create two custom classes: `CsvOutputFormatter` and `HtmlOutputFormatter`, which will handle CSV and HTML formats respectively.

#### CsvOutputFormatter
To create a custom class for handling CSV format, we need to follow these steps:

1. Create a new folder named `Formatters` in our project folder.
2. Create a new file named `CsvOutputFormatter.cs` in the `Formatters` folder.
3. Add the following code to the file:

```csharp
using System.Text;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;

namespace ContentNegotiationDemo.Formatters
{
    public class CsvOutputFormatter : TextOutputFormatter
    {
        public CsvOutputFormatter()
        {
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/csv"));
            SupportedEncodings.Add(Encoding.UTF8);
        }

        protected override bool CanWriteType(Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            return typeof(IEnumerable<WeatherForecast>).IsAssignableFrom(type);
        }

        public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            var response = context.HttpContext.Response;
            var data = context.Object as IEnumerable<WeatherForecast>;

            if (data == null)
                return;

            using (var buffer = new MemoryStream())
            using (var writer = new StreamWriter(buffer, selectedEncoding))
            {
                var csv = data.ToCsvString(',', true);
                writer.Write(csv);
                writer.Flush();

                buffer.Position = 0;
                await buffer.CopyToAsync(response.Body);
            }
        }
    }
}
```

#### CsvHelper
```csharp
using System.Text;

namespace ContentNegotiationDemo;

// Copied from https://stackoverflow.com/a/72553753
public static class CsvHelper
{
    /// <summary>
    /// Converts the given enumerable into a CSV string. Optionally, specify the delimiter or include headers.
    /// For enumerables of primitive types, it will convert them to a single-line CSV. Headers are not valid for this case.
    /// For enumerables of complex types, it will inspect the properties and convert each item into a line of the CSV.
    /// Which properties are included/excluded and the header names in the resulting CSV can be controlled.
    /// Note: Headers and values will only be double-quoted if necessary as per RFC4180.
    /// </summary>
    /// <typeparam name="T">The type of the enumerable.</typeparam>
    /// <param name="enumerable">The enumerable to turn into a CSV.</param>
    /// <param name="delimiter">The delimiter.</param>
    /// <param name="includeHeaders">Whether to include headers.</param>
    /// <param name="propertiesToInclude">Properties from the objects given to include. If left null, all properties will be included. This does not apply for enumerables of primitive types.</param>
    /// <param name="propertiesToExclude">Properties to exclude from the DataTable, if any. This does not apply for enumerables of primitive types.</param>
    /// <param name="propertyNameHeaderMap">A map that will be used to translate the property names to the headers that should appear in the CSV. This does not apply for enumerables of primitive types.</param>
    /// <returns>A CSV representation of the objects in the enumeration.</returns>
    public static string ToCsvString<T>(
        this IEnumerable<T> enumerable,
        char delimiter = ',',
        bool includeHeaders = false,
        IEnumerable<string> propertiesToInclude = null,
        IEnumerable<string> propertiesToExclude = null,
        Dictionary<string, string> propertyNameHeaderMap = null)
    {
        if (enumerable == null) throw new ArgumentNullException(nameof(enumerable));

        var type = enumerable.FirstOrDefault()?.GetType();
        if (type == null) return "";

        if (type.IsSimpleType())
            return string.Join(delimiter, enumerable.Select(i => escapeCsvValue(i?.ToString(), delimiter)));

        var csvBuilder = new StringBuilder();
        var allProperties = type.GetProperties();
        var propsToIncludeSet = (propertiesToInclude ?? allProperties.Select(p => p.Name))
            .Except(propertiesToExclude ?? Enumerable.Empty<string>())
            .ToHashSet();
        var properties = allProperties
            .Where(p => propsToIncludeSet.Contains(p.Name))
            .ToList();

        if (includeHeaders)
        {
            var headerNames = properties
                .Select(p => escapeCsvValue(propertyNameHeaderMap == null ? p.Name : propertyNameHeaderMap.GetValueOrDefault(p.Name) ?? $"{nameof(propertyNameHeaderMap)} was missing a value for property {p.Name}", delimiter));

            csvBuilder.AppendLine(string.Join(delimiter, headerNames));
        }

        foreach (var item in enumerable)
        {
            var vals = properties.Select(p => escapeCsvValue(p.GetValue(item, null)?.ToString(), delimiter));
            var line = string.Join(delimiter, vals);
            csvBuilder.AppendLine(line);
        }
        return csvBuilder.ToString();

        //Function to escape a value for use in CSV. Per RFC4180, if the delimiter, newline, or double quote is present in the value it must be double quoted. If the value contains double quotes they must be escaped.
        static string escapeCsvValue(string s, char delimiter)
        {
            return s == null ? null
                : s.Any(c => c == delimiter || c == '"' || c == '\r' || c == '\n') ? $"\"{s.Replace("\"", "\"\"")}\""
                : s;
        }
    }

    /// <summary>
    /// Whether the given type is a "simple" type. Eg, a built in CLR type to represent data.
    /// This includes all integral types, floating points types, DateTime, DateOnly, decimal, and Guid.
    /// </summary>
    /// <param name="type">The type to check.</param>
    /// <param name="unwrapNullable">Whether the type inside a nullable type should be checked.</param>
    /// <returns>Whether the type was a simple type.</returns>
    /// <exception cref="ArgumentNullException">If type was empty.</exception>
    public static bool IsSimpleType(this Type type, bool unwrapNullable = true)
    {
        if (type == null) throw new ArgumentNullException(nameof(type));

        if (unwrapNullable) type = Nullable.GetUnderlyingType(type) ?? type;
        return type.IsPrimitive
               || type == typeof(string)
               || type == typeof(DateTime)
               || type == typeof(DateOnly)
               || type == typeof(decimal)
               || type == typeof(Guid)
            ;
    }
}
```

This class inherits from `TextOutputFormatter`, which is a base class for formatters that write text data. It overrides two methods: `CanWriteType` and `WriteResponseBodyAsync`. The `CanWriteType` method checks if the type of data can be serialized to CSV format, which in this case is any type that implements `IEnumerable` interface. The `WriteResponseBodyAsync` method writes the data to the response body stream in CSV format, using a memory buffer and a stream writer. It writes a header row with the property names of the first item, and then writes data rows with the property values of each item, separated by commas. It also sets the supported media type and encoding in the constructor.

#### HtmlOutputFormatter
To create a custom class for handling HTML format, we need to follow these steps:

1. Create a new file named `HtmlOutputFormatter.cs` in the `Formatters` folder.
2. Add the following code to the file:

```csharp
using System.Text;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;

namespace ContentNegotiationDemo.Formatters
{
    public class HtmlOutputFormatter : TextOutputFormatter
    {
        public HtmlOutputFormatter()
        {
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/html"));
            SupportedEncodings.Add(Encoding.UTF8);
        }

        protected override bool CanWriteType(Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            return typeof(IEnumerable<WeatherForecast>).IsAssignableFrom(type);
        }

        public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            var response = context.HttpContext.Response;
            var data = context.Object as IEnumerable<WeatherForecast>;

            if (data == null)
                return;

            using (var buffer = new MemoryStream())
            using (var writer = new StreamWriter(buffer, selectedEncoding))
            {
                writer.WriteLine("<!DOCTYPE html>");
                writer.WriteLine("<html lang=\"en\">");
                writer.WriteLine("<head>");
                writer.WriteLine("<meta charset=\"UTF-8\">");
                writer.WriteLine("<title>Content Negotiation Demo</title>");
                writer.WriteLine("<style>");
                writer.WriteLine("table, th, td { border: 1px solid black; border-collapse: collapse; }");
                writer.WriteLine("th, td { padding: 5px; }");
                writer.WriteLine("</style>");
                writer.WriteLine("</head>");
                writer.WriteLine("<body>");

                var htmlTable = data.ToHtmlTable();

                writer.WriteLine(htmlTable);

                writer.WriteLine("</body>");
                writer.WriteLine("</html>");
                writer.Flush();

                buffer.Position = 0;
                await buffer.CopyToAsync(response.Body);
            }
        }
    }
}
```

#### HtmlHelper

```csharp
using System.Text;

namespace ContentNegotiationDemo;

// Copied from https://codereview.stackexchange.com/a/211601
public static class HtmlHelper
{
    public static string ToHtmlTable<T>(this IEnumerable<T> enums)
    {
        var type = typeof(T);
        var props = type.GetProperties();
        var html = new StringBuilder("<table>");

        //Header
        html.Append("<thead><tr>");
        foreach (var p in props)
            html.Append("<th>" + p.Name + "</th>");
        html.Append("</tr></thead>");

        //Body
        html.Append("<tbody>");
        foreach (var e in enums)
        {
            html.Append("<tr>");
            props.Select(s => s.GetValue(e)).ToList().ForEach(p => {
                html.Append("<td>" + p + "</td>");
            }); 
            html.Append("</tr>");
        }

        html.Append("</tbody>");
        html.Append("</table>");
        return html.ToString();
    }
}
```

This class inherits from `TextOutputFormatter`, which is a base class for formatters that write text data. It overrides two methods: `CanWriteType` and `WriteResponseBodyAsync`. The `CanWriteType` method checks if the type of data can be serialized to HTML format, which in this case is any type that implements `IEnumerable` interface. The `WriteResponseBodyAsync` method writes the data to the response body stream in HTML format, using a memory buffer and a stream writer. It writes an HTML document with a title and a style, and then writes an HTML table with a header row with the property names of the first item, and data rows with the property values of each item. It also sets the supported media type and encoding in the constructor.

## Best Practices for Content Negotiation
Content Negotiation is a powerful feature that can enhance the usability and functionality of our Web API. However, it also requires some careful considerations and best practices to ensure its proper implementation and avoid potential pitfalls. Here are some of the best practices that we should follow when using Content Negotiation in our Web API:

- Naming conventions for media types: We should use standard and consistent naming conventions for media types, as defined by the [IANA Media Types Registry](https://www.iana.org/assignments/media-types/media-types.xhtml). We should also avoid using vendor-specific or custom media types, unless they are well-documented and widely accepted by the community. For example, we should use `application/json` instead of `application/vnd.example+json`.
- Error handling and graceful degradation: We should handle errors and exceptions gracefully when performing Content Negotiation. We should provide meaningful and informative error messages to the client, using appropriate HTTP status codes and headers. We should also provide fallback options for the client, such as default media types or alternative representations, in case the negotiation fails or the requested media type is not supported by the server.
- Managing performance considerations: We should be aware of the performance impact of Content Negotiation on our Web API. We should avoid unnecessary or excessive negotiations that may increase the latency and overhead of our web service. We should also use caching techniques to improve the performance and scalability of our web service.

## Real-world Use Cases
Content Negotiation is a widely used feature in many real-world Web API scenarios. It enables web services to support diverse and dynamic client needs and preferences, while maintaining a consistent and coherent web service logic and functionality. Here are some examples of real-world use cases where Content Negotiation is applied:

- E-commerce Web API: An e-commerce Web API that provides product information can use Content Negotiation to return data in different formats for different clients. For example, it can return data in JSON format for web applications, XML format for legacy systems, HTML format for browsers, or CSV format for spreadsheets. It can also use Content Negotiation to return data in different languages or currencies for different regions or markets.
- News Web API: A news Web API that provides news articles can use Content Negotiation to return data in different formats and qualities for different clients. For example, it can return data in HTML format for browsers, RSS format for feed readers, or PDF format for printing. It can also use Content Negotiation to return data in different resolutions or compression levels for different network conditions or bandwidth limitations.
- Image Web API: An image Web API that provides image processing services can use Content Negotiation to return data in different formats and sizes for different clients. For example, it can return data in PNG format for lossless quality, JPEG format for lossy quality, GIF format for animation, or SVG format for vector graphics. It can also use Content Negotiation to return data in different dimensions or aspect ratios for different display devices or orientations.

## Conclusion
Content Negotiation is a process that allows a client and a server to agree on the best format of data to exchange in a web request. It is an essential feature of Web API development, as it enables the creation of flexible and interoperable web services that can support multiple media types. In this blog post, we have explored how Content Negotiation works, why it is important, and how we can implement it in .NET 6. We have also discussed some of the best practices, use cases, and optimization techniques for Content Negotiation in our Web API.

I hope that this blog post has helped you understand and appreciate the importance and benefits of Content Negotiation in Web API development.

Keep Learning...
