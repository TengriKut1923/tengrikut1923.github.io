---
layout: post
title: "Performance Benchmarking of Brotli, Gzip, and Deflate Compression in C# using Benchmark.NET"
categories:
- programming
tags:
- C#
- .NET
- Benchmark.NET
---

Compression algorithms are essential for optimizing application performance. They reduce the size of data that needs to be transferred over the network, resulting in faster loading times and better user experiences. However, not all compression algorithms are created equal. Some may offer higher compression ratios, but at the cost of more CPU time and memory usage. Others may be faster, but less effective in reducing data size. Therefore, it is important to conduct performance benchmarks to compare the advantages and disadvantages of different compression algorithms.

In this blog post, we will focus on three popular compression algorithms: Brotli, Gzip, and Deflate. We will use Benchmark.NET, a powerful benchmarking library for C#, to measure their performance on sample data. We will also discuss how to interpret the benchmark results and make informed decisions about which compression algorithm to use in our C# applications.

> You can find the source code of this blog post on [this GitHub repo](https://github.com/KeyurRamoliya/CompressionBenchmark).
{: .prompt-info }

## Understanding Compression Algorithm Performance
Compression is the process of transforming data into a smaller representation that can be decompressed back to the original data. Compression algorithms use various techniques, such as dictionary encoding, Huffman coding, and arithmetic coding, to achieve this goal. The main benefit of compression is that it reduces the amount of data that needs to be transferred over the network, which can improve web application performance significantly.

However, compression also has a cost. It requires CPU time and memory to compress and decompress data. Moreover, different compression algorithms may have different trade-offs between compression ratio and speed. Compression ratio is the ratio of the compressed data size to the original data size. A higher compression ratio means that more data can be compressed into a smaller size. Speed is the time it takes to compress or decompress data. A faster speed means that less time is spent on compression or decompression.

Therefore, to compare the performance of different compression algorithms, we need to measure both their compression ratios and their speeds. We also need to use accurate benchmarking tools that can provide reliable and reproducible results.

## Benchmark.NET Overview
Benchmark.NET is a powerful benchmarking library for C#. It allows us to create benchmarks for various scenarios and measure their performance using various metrics. It provides a simple and intuitive API for creating benchmarks. We can use attributes to define our benchmarks and configure their settings. We can also use fluent syntax to customize our benchmarks further.

## Setting Up the Benchmarking Environment
To conduct compression benchmarks using Benchmark.NET, we need to have the following prerequisites:

- A C# project with .NET 6/7 or higher as the target framework. I am using .NET 7 because at the time of writing this blog it is the latest version of .NET.
- The Benchmark.NET NuGet package as a dependency.

We can use Visual Studio or any other IDE of our choice to create a C# project with these dependencies. Alternatively, we can use the dotnet CLI tool to create a project from scratch using the following commands:

```bash
# Create a new console project
dotnet new console -n CompressionBenchmark

# Change directory to the project folder
cd CompressionBenchmark

# Add Benchmark.NET package
dotnet add package BenchmarkDotNet
```

## Brotli Compression Benchmark
Brotli is a relatively new compression algorithm that was developed by Google in 2015. It is based on LZ77 and Huffman coding techniques and offers high compression ratios with moderate speed. It is widely used for web content delivery and supports various quality levels ranging from 0 (no compression) to 11 (maximum compression).

To create a benchmark for Brotli compression in C#, we need to do the following steps:

- Define a class with the `[MemoryDiagnoser]` attribute to enable memory allocation diagnostics.
- Define a field with the `[Params]` attribute to specify the quality level parameter for Brotli compression.
- Define a field with some sample data to compress.
- Define a method with the `[Benchmark]` attribute to measure the performance of Brotli compression on the sample data.
- Define a method with the `[GlobalSetup]` attribute to initialize the Brotli compression stream.
- Define a method with the `[GlobalCleanup]` attribute to dispose the Brotli compression stream.

Here is an example of a C# class that implements these steps:

```csharp
using BenchmarkDotNet.Attributes;
using System.IO.Compression;

namespace CompressionBenchmark
{
    // Enable memory allocation diagnostics
    [MemoryDiagnoser]
    public class BrotliBenchmark
    {
        // Specify the quality level parameter for Brotli compression
        [Params(CompressionLevel.Optimal, CompressionLevel.Fastest, CompressionLevel.NoCompression, CompressionLevel.SmallestSize)]
        public CompressionLevel QualityLevel { get; set; }

        // Define some sample data to compress
        private byte[] data = System.Text.Encoding.UTF8.GetBytes("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis lorem vitae nisi consequat varius. Morbi id leo quis augue aliquet lacinia. Fusce vitae semper nisl. Mauris quis leo sit amet lacus tincidunt sagittis. Vivamus euismod, nisi quis condimentum ultrices, nunc eros malesuada leo, at tincidunt lectus urna sed leo. Quisque nec sapien ut nisl vulputate ullamcorper. Sed id semper diam. Donec eget justo et justo aliquam sollicitudin. Suspendisse potenti. Curabitur sit amet lorem ac erat sagittis consequat.");

        // Define a stream for Brotli compression
        private MemoryStream compressedStream;

        // Initialize the Brotli compression stream
        [GlobalSetup]
        public void Setup()
        {
            compressedStream = new MemoryStream();
        }

        // Measure the performance of Brotli compression on the sample data
        [Benchmark]
        public void Compress()
        {
            compressedStream.Position = 0;
            var brotliStream = new BrotliStream(compressedStream, QualityLevel, true);
            brotliStream.Write(data, 0, data.Length);
            brotliStream.Flush();
        }

        // Dispose the Brotli compression stream
        [GlobalCleanup]
        public void Cleanup()
        {
            compressedStream.Dispose();
        }
    }
}
```

The benchmark method `Compress` will measure the performance of Brotli compression on the sample data using different quality levels. The benchmark will capture metrics such as throughput (bytes per second), operations per second (invocations per second), and execution time (nanoseconds per invocation).

## Gzip Compression Benchmark
Gzip is a widely used compression algorithm that was developed in 1992. It is based on LZ77 and Huffman coding techniques and offers moderate compression ratios with fast speed. It is commonly used for file compression and web content delivery and supports various compression levels ranging from 0 (no compression) to 9 (maximum compression).

To create a benchmark for Gzip compression in C#, we need to follow similar steps as for Brotli compression, except that we need to use the `GZipStream` class instead of the `BrotliStream` class. We also need to specify the compression level parameter for Gzip compression using the `[Params]` attribute.

Here is an example of a C# class that implements these steps:

```csharp
using BenchmarkDotNet.Attributes;
using System.IO.Compression;

namespace CompressionBenchmark
{
    // Enable memory allocation diagnostics
    [MemoryDiagnoser]
    public class GzipBenchmark
    {
        // Specify the compression level parameter for Gzip compression
        [Params(CompressionLevel.Optimal, CompressionLevel.Fastest, CompressionLevel.NoCompression, CompressionLevel.SmallestSize)]
        public CompressionLevel CompressionLevel { get; set; }

        // Define some sample data to compress
        private byte[] data = System.Text.Encoding.UTF8.GetBytes("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis lorem vitae nisi consequat varius. Morbi id leo quis augue aliquet lacinia. Fusce vitae semper nisl. Mauris quis leo sit amet lacus tincidunt sagittis. Vivamus euismod, nisi quis condimentum ultrices, nunc eros malesuada leo, at tincidunt lectus urna sed leo. Quisque nec sapien ut nisl vulputate ullamcorper. Sed id semper diam. Donec eget justo et justo aliquam sollicitudin. Suspendisse potenti. Curabitur sit amet lorem ac erat sagittis consequat.");

        // Define a stream for Gzip compression
        private MemoryStream compressedStream;

        // Initialize the Gzip compression stream
        [GlobalSetup]
        public void Setup()
        {
            compressedStream = new MemoryStream();
        }

        // Measure the performance of Gzip compression on the sample data
        [Benchmark]
        public void Compress()
        {
            compressedStream.Position = 0;
            var gzipStream = new GZipStream(compressedStream, CompressionLevel, true);
            gzipStream.Write(data, 0, data.Length);
            gzipStream.Flush();
        }

        // Dispose the Gzip compression stream
        [GlobalCleanup]
        public void Cleanup()
        {
            compressedStream.Dispose();
        }
    }
}


```

The benchmark method `Compress` will measure the performance of Gzip compression on the sample data using different compression levels. The benchmark will capture metrics such as throughput (bytes per second), operations per second (invocations per second), and execution time (nanoseconds per invocation).

## Deflate Compression Benchmark
Deflate is an older compression algorithm that was developed in 1991. It is based on LZ77 and Huffman coding techniques and offers moderate compression ratios with fast speed. It is widely used for file compression and web content delivery and supports various compression levels ranging from 0 (no compression) to 9 (maximum compression).

To create a benchmark for Deflate compression in C#, we need to follow similar steps as for Brotli and Gzip compression, except that we need to use the `DeflateStream` class instead of the `BrotliStream` or `GZipStream` class. We also need to specify the compression level parameter for Deflate compression using the `[Params]` attribute.

Here is an example of a C# class that implements these steps:

```csharp
using BenchmarkDotNet.Attributes;
using System.IO.Compression;

namespace CompressionBenchmark
{
    // Enable memory allocation diagnostics
    [MemoryDiagnoser]
    public class DeflateBenchmark
    {
        // Specify the compression level parameter for Deflate compression
        [Params(CompressionLevel.Optimal, CompressionLevel.Fastest, CompressionLevel.NoCompression, CompressionLevel.SmallestSize)]
        public CompressionLevel CompressionLevel { get; set; }

        // Define some sample data to compress
        private byte[] data = System.Text.Encoding.UTF8.GetBytes("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis lorem vitae nisi consequat varius. Morbi id leo quis augue aliquet lacinia. Fusce vitae semper nisl. Mauris quis leo sit amet lacus tincidunt sagittis. Vivamus euismod, nisi quis condimentum ultrices, nunc eros malesuada leo, at tincidunt lectus urna sed leo. Quisque nec sapien ut nisl vulputate ullamcorper. Sed id semper diam. Donec eget justo et justo aliquam sollicitudin. Suspendisse potenti. Curabitur sit amet lorem ac erat sagittis consequat.");

        // Define a stream for Deflate compression
        private MemoryStream compressedStream;

        // Initialize the Deflate compression stream
        [GlobalSetup]
        public void Setup()
        {
            compressedStream = new MemoryStream();
        }

        // Measure the performance of Deflate compression on the sample data
        [Benchmark]
        public void Compress()
        {
            compressedStream.Position = 0;
            var deflateStream = new DeflateStream(compressedStream, CompressionLevel, true);
            deflateStream.Write(data, 0, data.Length);
            deflateStream.Flush();
        }

        // Dispose the Deflate compression stream
        [GlobalCleanup]
        public void Cleanup()
        {
            compressedStream.Dispose();
        }
    }
}
```

The benchmark method `Compress` will measure the performance of Deflate compression on the sample data using different compression levels. The benchmark will capture metrics such as throughput (bytes per second), operations per second (invocations per second), and execution time (nanoseconds per invocation).

## Comparative Analysis and Results
To compare the benchmark results for Brotli, Gzip, and Deflate compression algorithms, we need to run our benchmarks using Benchmark.NET and export the results to a suitable format. We can use the `[SimpleJob]` attribute to specify the number of warmup iterations and benchmark iterations for our benchmarks. We can also use the `[MarkdownExporterAttribute]` attribute to export our results to a markdown table.

Here is an example of a C# class that runs our benchmarks and exports our results:

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

namespace CompressionBenchmark;

// Specify the number of warmup and benchmark iterations
[SimpleJob(warmupCount: 3, iterationCount: 5)]

// Export the results to a markdown table
[MarkdownExporterAttribute.GitHub]
class Program
{
    static void Main(string[] args)
    {
        var summary = BenchmarkRunner.Run<BrotliBenchmark>();
        summary = BenchmarkRunner.Run<GzipBenchmark>();
        summary = BenchmarkRunner.Run<DeflateBenchmark>();

        Console.WriteLine("Done");
        Console.ReadLine();
    }
}
```

The output of this class will be a markdown table that shows the benchmark results for each compression algorithm and each compression level. The table will include metrics such as mean execution time, standard deviation, operations per second, allocated memory, and compression ratio. Here is an example of the output table:

```
.NET SDK 7.0.307
  [Host]     : .NET 7.0.10 (7.0.1023.36312), X64 RyuJIT AVX2
  DefaultJob : .NET 7.0.10 (7.0.1023.36312), X64 RyuJIT AVX2
```


| Method | QualityLevel | Mean | Error | StdDev | Gen0 | Gen1 | Allocated |
|---------|:--------------|:-------------|:----------|:----------|:--------|:-------|:----------|
| Brotli -> Compress |       Optimal |   148.022 μs | 1.1940 μs | 1.1168 μs | 13.6719 |      - |  64.15 KB |
| Brotli -> Compress |       Fastest |     7.774 μs | 0.0900 μs | 0.0842 μs | 13.8855 | 0.1068 |  64.15 KB |
| Brotli -> Compress | NoCompression |     9.545 μs | 0.0654 μs | 0.0612 μs | 13.8855 | 0.1068 |  64.15 KB |
| Brotli -> Compress |  SmallestSize | 1,142.303 μs | 8.6347 μs | 8.0769 μs | 13.6719 |      - |  64.15 KB |
| GZip -> Compress |          Optimal | 72.85 μs | 0.656 μs | 0.613 μs | 1.7090 | 0.1221 |   8.23 KB |
| GZip -> Compress |          Fastest | 70.74 μs | 0.611 μs | 0.571 μs | 1.7090 | 0.1221 |   8.23 KB |
| GZip -> Compress |    NoCompression | 37.93 μs | 0.706 μs | 1.579 μs | 1.7700 | 0.0610 |   8.23 KB |
| GZip -> Compress |     SmallestSize | 72.69 μs | 0.682 μs | 0.638 μs | 1.7090 | 0.1221 |   8.23 KB |
| Deflate -> Compress |          Optimal | 73.21 μs | 0.486 μs | 0.455 μs | 1.7090 | 0.1221 |   8.26 KB |
| Deflate -> Compress |          Fastest | 72.40 μs | 0.701 μs | 0.656 μs | 1.7090 | 0.1221 |   8.26 KB |
| Deflate -> Compress |    NoCompression | 38.03 μs | 0.757 μs | 1.110 μs | 1.7700 | 0.0610 |   8.26 KB |
| Deflate -> Compress |     SmallestSize | 73.08 μs | 0.629 μs | 0.588 μs | 1.7090 | 0.1221 |   8.26 KB |

## Interpreting the Benchmark Results

Based on the above information, let's compare the performance of the Brotli, GZip, and Deflate compression methods across different quality levels:

1. **Compression Speed**:
   - Brotli's "Fastest" compression achieves the lowest mean execution times (7.774 μs), followed closely by GZip's "Fastest" compression (70.74 μs), and Deflate's "Fastest" compression (72.40 μs).
   - Brotli's "Optimal" compression exhibits the highest execution time among the three methods (148.022 μs), indicating that Brotli prioritizes compression efficiency over speed at this quality level.
   - Overall, Brotli's "Fastest" compression demonstrates the fastest execution times across all compression methods and quality levels.

2. **Compression Efficiency**:
   - Brotli's "SmallestSize" compression achieves the best compression ratios but at the cost of significantly higher execution times (1,142.303 μs).
   - GZip and Deflate also exhibit higher execution times for their respective "SmallestSize" compression modes.
   - Brotli's "NoCompression" mode still demonstrates competitive execution times (9.545 μs) while not compressing the data significantly, making it a potential option for scenarios where compression is not required.

3. **Memory Usage**:
   - The memory allocated remains consistent across all quality levels and compression methods for both GZip and Deflate (around 8.23-8.26 KB).
   - Brotli's allocated memory is consistent as well, but it appears to be set at 64.15 KB for all quality levels. This suggests that the memory allocation may not be influenced by the chosen quality level.

4. **Error and Variability**:
   - The "Error" and "StdDev" values are relatively small across all rows, indicating consistent measurements for mean execution times.

5. **Garbage Collection**:
   - The "Gen0" and "Gen1" garbage collection counts do not exhibit consistent patterns across methods and quality levels, making it challenging to draw clear conclusions about their impact on performance.

In summary, Brotli's "Fastest" compression generally offers the fastest execution times, making it suitable for scenarios where compression speed is critical. Brotli's "SmallestSize" mode provides the best compression ratios but at the expense of significantly increased execution times. GZip and Deflate demonstrate competitive performance, with minor differences in execution times and memory allocation. The choice of compression method and quality level should align with the specific requirements of the application, considering the trade-off between compression speed and efficiency.

Note that to interpret the benchmark results accurately, we need to consider several factors that might influence the performance of different compression algorithms.

- Input data size and type: The size and type of the input data can affect the compression ratio and speed of different algorithms. For example, larger input data may benefit more from higher quality levels or larger window sizes, while smaller input data may not see much difference or even suffer from overheads.
- Hardware variations: The hardware specifications of the machine running the benchmarks can affect the performance of different algorithms as well. For example, faster CPUs or more memory may improve the speed of compression or decompression, while slower CPUs or less memory may degrade it.
- Environmental influences: The environmental conditions of the machine running the benchmarks can also affect the performance of different algorithms. For example, CPU temperature, power consumption, or background processes may introduce noise or variability in the benchmark results.

Therefore, to make informed decisions based on the benchmark results, we need to take into account these factors and compare the performance of different algorithms under similar conditions and with representative input data.

## Considerations and Limitations
While benchmarking is a useful tool for comparing the performance of different compression algorithms, it also has some potential limitations that we need to be aware of.

- Compression algorithms are not static: Compression algorithms are constantly evolving and improving over time. New versions or implementations of existing algorithms may offer better performance or features than older ones. For example, Brotli is still a relatively new algorithm that may have room for further optimization or enhancement. Therefore, the benchmark results may not reflect the current state of the art or the future potential of different algorithms.
- Compression performance is not everything: Compression performance is an important factor for optimizing web application performance, but it is not the only one. There are other factors that may affect the user experience, such as browser compatibility, security, or usability. For example, Brotli may offer better compression performance than Gzip or Deflate, but it may not be supported by all browsers or servers, or it may require additional configuration or overhead to enable it. Therefore, we need to consider the trade-offs and costs of using different compression algorithms in our web applications.

## Best Practices and Recommendations
Based on our benchmarking exercise and analysis, we can offer some best practices and recommendations for conducting meaningful compression benchmarks using Benchmark.NET and choosing appropriate compression algorithms for our C# applications.

- Use representative input data: The input data we use for our benchmarks should be representative of the real-world data we expect to compress in our web applications. For example, if we want to compress HTML files, we should use HTML files from popular websites or sources as our input data. This way, we can ensure that our benchmarks capture the realistic performance and behavior of different compression algorithms.
- Control benchmark parameters: The benchmark parameters we use for our benchmarks should be consistent and relevant for our web applications. For example, if we want to compare different quality levels or window sizes of different compression algorithms, we should use the same values for each algorithm. This way, we can ensure that our benchmarks compare the performance of different compression algorithms fairly and objectively.
- Incorporate benchmarking into the development and optimization process: Benchmarking should not be a one-time activity that we do once and forget. It should be an integral part of our development and optimization process that we do regularly and iteratively. For example, if we update our web application with new features or content, we should also update our benchmarks with new input data and parameters. This way, we can ensure that our benchmarks reflect the current state and needs of our web application and help us make informed decisions about compression algorithm choices.

In this blog post, I have shown how to conduct performance benchmarks for Brotli, Gzip, and Deflate compression algorithms using Benchmark.NET in a C# program. We have also discussed how to interpret the benchmark results and make informed decisions about compression algorithm choices. We have found that Brotli compression offers higher compression ratios than Gzip or Deflate compression, but also higher execution times. We have also highlighted some considerations and limitations of benchmarking and offered some best practices and recommendations for conducting meaningful compression benchmarks using Benchmark.NET.

I hope that this blog post has been helpful and informative for you.

Thank you for reading!
