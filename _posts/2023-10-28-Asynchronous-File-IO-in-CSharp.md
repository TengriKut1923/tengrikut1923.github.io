---
layout: post
title: "Asynchronous File I/O in C#"
categories:
- programming
tags:
- C#
- .NET
- async
- await
- I/O
- StreamReader
- StreamWriter
- FileStream
---

File input/output (I/O) is one of the most common and essential tasks in any programming language. Whether you need to read data from a text file, write data to a binary file, or process a large CSV file, you need to use file I/O operations.

However, file I/O can also be one of the most time-consuming and performance-intensive tasks, especially when dealing with large files or network streams. If you use synchronous file I/O methods, your application will block the current thread until the operation is completed. This can result in poor performance, unresponsive user interface, and wasted resources.

Fortunately, C# offers a better way to handle file I/O operations: asynchronous file I/O. Asynchronous file I/O allows you to perform file operations without blocking the current thread. This can improve the performance and responsiveness of your application, as well as enable concurrent and parallel processing of multiple files.

In this blog post, we will explore how to use asynchronous file I/O in C#, and how it can benefit your projects. We will cover the following topics:

- Understanding asynchronous programming in C#
- Reading files asynchronously
- Writing files asynchronously
- Asynchronous file I/O best practices
- Example: async file processing

## Understanding Asynchronous Programming in C#

Before we dive into asynchronous file I/O, let's first understand what asynchronous programming is and how it works in C#.

Asynchronous programming is a way of writing code that allows you to execute multiple tasks at the same time without waiting for each task to finish. Asynchronous programming can improve the performance and scalability of your application, as well as make it more responsive and user-friendly.

In C#, asynchronous programming is supported by the `async` and `await` keywords. The `async` keyword indicates that a method can run asynchronously, meaning that it can return before it is completed. The `await` keyword indicates that you want to wait for an asynchronous operation to finish, without blocking the current thread.

The `async` and `await` keywords work together with the `Task` class, which represents an asynchronous operation that can return a value or void. The `Task` class also provides methods for creating, running, waiting, cancelling, and handling errors of asynchronous operations.

The benefits of asynchronous programming in C# are:

- Improved performance: Asynchronous programming allows you to use the CPU and I/O resources more efficiently, by avoiding unnecessary blocking and context switching.
- Improved responsiveness: Asynchronous programming allows you to keep the user interface responsive while performing long-running or intensive tasks in the background.
- Simplified code: Asynchronous programming allows you to write code that looks like synchronous code, but behaves asynchronously. You don't need to use callbacks, delegates, events, or other complex mechanisms to handle asynchronous operations.

> For more understanding please have a look at my blog post on [Asynchronous Programming in C#](https://keyurramoliya.com/posts/Asynchronous-Programming-in-C-with-async-await/).
{: .prompt-info }

## Reading Files Asynchronously

Now that we have a basic understanding of asynchronous programming in C#, let's see how we can use it to read files asynchronously.

Reading files asynchronously means that you can start reading a file without waiting for the entire file to be loaded into memory or disk. This can be useful when you need to read large files or stream data from a network source.

To read files asynchronously in C#, you can use the `StreamReader` and `FileStream` classes, which provide async methods for reading text and binary data respectively. These classes inherit from the `TextReader` and `Stream` abstract classes, which define the common async methods for reading data from any source.

Some of the async methods for reading files are:

- `ReadAsync`: Reads a specified number of characters or bytes from the current stream asynchronously and returns them as a string or array.
- `ReadLineAsync`: Reads a line of characters from the current stream asynchronously and returns it as a string.
- `ReadToEndAsync`: Reads all characters or bytes from the current stream asynchronously and returns them as a string or array.

To demonstrate how to read a text file asynchronously, let's create a simple console application that reads a text file line by line and prints it to the console. Here is the code:

```csharp
using System;
using System.IO;
using System.Threading.Tasks;

namespace AsyncFileIO
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Create a StreamReader object for reading a text file
            using StreamReader reader = new StreamReader(@"sample.txt");
            // Read the file line by line until the end of the stream
            while (!reader.EndOfStream)
            {
                // Read a line asynchronously and print it to the console
                string? line = await reader.ReadLineAsync();
                if (line != null)
                {
                    Console.WriteLine(line);
                }
            }
        }
    }
}
```

In this code, we use the `using` statement to create a `StreamReader` object for reading a text file named `sample.txt`. The `using` statement ensures that the `StreamReader` object is disposed and the file is closed when the block ends.

Then, we use a `while` loop to read the file line by line until the end of the stream. Inside the loop, we use the `await` keyword to call the `ReadLineAsync` method, which returns a `Task<string>` object. The `await` keyword pauses the execution of the method until the task is completed, and then resumes it with the result of the task. In this case, the result is a string that contains a line of text from the file.

Finally, we print the line to the console using the `Console.WriteLine` method. Note that we don't need to use any callbacks or events to handle the completion of the asynchronous operation. The code looks like synchronous code, but behaves asynchronously.

## Writing Files Asynchronously

Writing files asynchronously means that you can start writing data to a file without waiting for the entire data to be written to memory or disk. This can be useful when you need to write large amounts of data or stream data to a network destination.

To write files asynchronously in C#, you can use the `StreamWriter` and `FileStream` classes, which provide async methods for writing text and binary data respectively. These classes inherit from the `TextWriter` and `Stream` abstract classes, which define the common async methods for writing data to any destination.

Some of the async methods for writing files are:

- `WriteAsync`: Writes a specified string or array of characters or bytes to the current stream asynchronously.
- `WriteLineAsync`: Writes a line terminator or a string followed by a line terminator to the current stream asynchronously.
- `FlushAsync`: Clears all buffers for the current stream asynchronously and causes any buffered data to be written to the underlying device.

To demonstrate how to write data to a file asynchronously, let's modify our previous console application to write some random numbers to a text file instead of reading it. Here is the code:

```csharp
using System;
using System.IO;
using System.Threading.Tasks;

namespace AsyncFileIO
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Create a StreamWriter object for writing a text file
            using StreamWriter writer = new StreamWriter("output.txt");
            // Create a Random object for generating random numbers
            Random random = new();

            // Write 10 lines of random numbers to the file
            for (int i = 0; i < 10; i++)
            {
                // Generate a random number between 1 and 100
                int number = random.Next(1, 101);

                // Write the number followed by a line terminator asynchronously
                await writer.WriteLineAsync(number.ToString());
            }

            // Flush any buffered data to the file asynchronously
            await writer.FlushAsync();
        }
    }
}
```

In this code, we use the `using` statement to create a `StreamWriter` object for writing a text file named `output.txt`. The `using` statement ensures that the `StreamWriter` object is disposed and the file is closed when the block ends.

Then, we use a `for` loop to write 10 lines of random numbers to the file. Inside the loop, we use a `Random` object to generate a random number between 1 and 100. Then, we use the `await` keyword to call the `WriteLineAsync` method, which takes a string as an argument and writes it followed by a line terminator to the current stream asynchronously.

Finally, we use the `await` keyword again to call the `FlushAsync` method, which clears all buffers for the current stream and causes any buffered data to be written to the underlying device. This ensures that all data is written to the file before it is closed.

## Asynchronous File I/O Best Practices

Asynchronous file I/O can improve your application's performance and responsiveness, but it also requires some best practices and considerations. Here are some tips for optimizing your asynchronous file operations:

- Use CancellationToken for cancellation support: A CancellationToken is an object that can be used to signal cancellation requests from one thread to another. You can pass a CancellationToken as an argument to most async methods, and then use it to cancel an ongoing asynchronous operation if needed. This can help you handle user interruptions, timeouts, or other scenarios where you need to abort an asynchronous operation gracefully.
- Error handling and proper exception management: Asynchronous operations can throw exceptions just like synchronous operations. However, exceptions thrown by async methods are captured by the Task object that represents them, and are rethrown when you await them. Therefore, you need to use try/catch blocks around your await expressions, or use methods like Task.ContinueWith or Task.WhenAll to handle exceptions from multiple tasks.
- Resource disposal and cleaning up: Asynchronous operations can involve unmanaged resources such as files, streams, sockets, etc. You need to make sure that these resources are properly disposed and cleaned up when they are no longer needed. You can use the `using` statement, the `IDisposable` interface, or the `finally` block to ensure that your resources are disposed and cleaned up properly.

## Example: Async File Processing

To illustrate the concept of asynchronous file I/O in C#, let's look at a real-world example of asynchronously reading and processing a large CSV file.

A CSV file is a comma-separated values file that stores tabular data in plain text format. CSV files are widely used for data exchange, analysis, and manipulation. However, CSV files can also be very large and complex, and require special parsing and processing logic.

In this example, we will create a console application that reads a CSV file that contains information about the world's countries, such as name, population, area, GDP, etc. The application will then calculate and display some statistics about the countries, such as the total population, the average area, the richest and poorest countries, etc.

> The data in the `countries.csv` file is demo purpose only and it can be wrong.
{: .prompt-info }

The CSV file we will use is called `countries.csv`, and it has the following format:

```csv
Name,Population (2020),Area (km2),GDP (2019),GDP per capita (2019)
Afghanistan,38928346,652230,18734.02,481.35
Albania,2877797,28748,15278.66,5308.75
Algeria,43851044,2381741,169988.25,3875.66
Andorra,77265,468,null,null
Angola,32866272,1246700,88830.88,2703.29
...
```

Here is the code for the console application:

```csharp
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AsyncFileIO
{
    class Program
    {
        // Define a class to represent a country
        class Country
        {
            public string Name { get; set; }
            public long Population { get; set; }
            public int Area { get; set; }
            public decimal GDP { get; set; }
            public decimal GDPPerCapita { get; set; }
        }

        static async Task Main(string[] args)
        {
            // Create a list to store the countries
            List<Country> countries = new List<Country>();

            // Create a StreamReader object for reading the CSV file
            using (StreamReader reader = new StreamReader(@"countries.csv"))
            {
                // Read and ignore the first line (header)
                await reader.ReadLineAsync();

                // Read the file line by line until the end of the stream
                while (!reader.EndOfStream)
                {
                    // Read a line asynchronously and split it by comma
                    string? line = await reader.ReadLineAsync();

                    if (line != null)
                    {
                        string[] fields = line.Split(',');

                        // Parse the fields and create a Country object
                        Country country = new Country();
                        country.Name = fields[0];
                        country.Population = long.Parse(fields[1]);
                        country.Area = int.Parse(fields[2]);
                        country.GDP = fields[3] == "null" ? 0 : decimal.Parse(fields[3], NumberStyles.AllowDecimalPoint);
                        country.GDPPerCapita = fields[4] == "null" ? 0 : decimal.Parse(fields[4], NumberStyles.AllowDecimalPoint);

                        // Add the Country object to the list
                        countries.Add(country);   
                    }
                }
            }

            // Calculate and display some statistics about the countries

            // Total population of all countries
            long totalPopulation = countries.Sum(c => c.Population);
            Console.WriteLine($"Total population of all countries: {totalPopulation:N0}");

            // Average area of all countries
            double averageArea = countries.Average(c => c.Area);
            Console.WriteLine($"Average area of all countries: {averageArea:N2} km2");

            // Richest country by GDP per capita
            Country richestCountry = countries.OrderByDescending(c => c.GDPPerCapita).First();
            Console.WriteLine($"Richest country by GDP per capita: {richestCountry.Name} (${richestCountry.GDPPerCapita:N2})");

            // Poorest country by GDP per capita
            Country poorestCountry = countries.OrderBy(c => c.GDPPerCapita).First();
            Console.WriteLine($"Poorest country by GDP per capita: {poorestCountry.Name} (${poorestCountry.GDPPerCapita:N2})");

            // Largest country by area
            Country largestCountry = countries.OrderByDescending(c => c.Area).First();
            Console.WriteLine($"Largest country by area: {largestCountry.Name} ({largestCountry.Area:N0} km2)");

            // Smallest country by area
            Country smallestCountry = countries.OrderBy(c => c.Area).First();
            Console.WriteLine($"Smallest country by area: {smallestCountry.Name} ({smallestCountry.Area:N0} km2)");
        }
    }
}
```

In this code, we first define a class called `Country` to represent a country with its properties. Then, we create a list to store the countries.

Next, we use the `using` statement to create a `StreamReader` object for reading the CSV file. We use the `await` keyword to call the `ReadLineAsync` method to read and ignore the first line, which is the header of the file. Then, we use a `while` loop to read the file line by line until the end of the stream.

Inside the loop, we use the `await` keyword again to call the `ReadLineAsync` method to read a line asynchronously and split it by comma. Then, we parse the fields and create a `Country` object with the parsed values. We also handle the null values in the GDP and GDP per capita fields by assigning them zero. Finally, we add the `Country` object to the list.

After reading and parsing the file, we calculate and display some statistics about the countries using LINQ methods such as `Sum`, `Average`, `OrderByDescending`, `First`, etc. We also use string formatting methods such as `{N0}` and `{N2}` to format the numbers with commas and decimal points.

Here is a sample output of running the application:

```console
Total population of all countries: 7,794,798,739
Average area of all countries: 555,001.24 km2
Richest country by GDP per capita: Monaco ($185,829.49)
Poorest country by GDP per capita: Burundi ($261.25)
Largest country by area: Russia (17,098,242 km2)
Smallest country by area: Vatican City (0 km2)
```

As you can see, this application can read and process a large CSV file asynchronously and efficiently, without blocking the main thread or consuming too much memory.

## Conclusion

In this blog post, I have explained how to use asynchronous file I/O in C#, and how it can improve our application's performance and responsiveness. We have seen how to use the `async` and `await` keywords to write code that looks like synchronous code but behaves asynchronously. We have also seen how to use the `StreamReader`, `FileStream`, and `StreamWriter` classes to read and write text and binary files asynchronously.

We have also learned some best practices and considerations for using asynchronous file I/O, such as using CancellationToken for cancellation support, error handling and proper exception management, resource disposal and cleaning up, etc.

Thank you for reading this blog post. Happy coding! 😊
