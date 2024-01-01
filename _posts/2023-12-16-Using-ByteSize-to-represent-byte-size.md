---
layout: post
title: "Using ByteSize to Represent Byte Size"
categories:
- programming
tags:
- C#
- .NET
- ByteSize
- Programming
- Data Representation
- Data Conversion
- Utility Class
- NuGet
- Libraries
- IEC Standard
- NIST Standard
- Binary
- Decimal
- Byte Size Conversion
- Byte Size Formatting
- Software Development
- Coding Practices
- Code Efficiency
- Code Readability
- Software Libraries
- Data Manipulation
- Data Formatting
- Data Parsing
- Arithmetic Operations
- Overloaded Operators
- Data Units
- Kilobyte
- Megabyte
- Gigabyte
- Terabyte
- Petabyte
- Kibibyte
- Mebibyte
- Gibibyte
- Tebibyte
- Pebibyte
---

Byte size is a common concept in programming and computing, but it can also be a source of confusion and ambiguity. How do we define a kilobyte, a megabyte, or a gigabyte? How do we convert between different units of byte size? How do we display byte size in a human-readable format?

One possible solution is to use a utility class that makes byte size representation in code easier and clearer. In this article, we will introduce ByteSize, a C# library that does exactly that.

## What is ByteSize?

ByteSize is a utility class that represents a byte size value and provides methods to create and manipulate byte size values. ByteSize adheres to the IEC and NIST standard, which means it assumes:

- Decimal representation: 1 kilobyte = 1000 bytes with 2 letter abbrevations b, B, KB, MB, GB, TB, PB.
- Binary representation: 1 kibibyte = 1024 bytes with 3 letter abbrevations b, B, KiB, MiB, GiB, TiB, PiB.

ByteSize manages conversion of the values internally and provides methods to create and retrieve the values as needed. It also supports parsing byte size values from strings and formatting byte size values to strings.

## How to use ByteSize?

To use ByteSize, you need to install the ByteSize package from [NuGet](https://www.nuget.org/packages/ByteSize/). Then, you can import the ByteSize namespace in your code:

```csharp
using ByteSizeLib;
```

To create a byte size value, you can use one of the static methods of the ByteSize class, such as `ByteSize.FromBytes`, `ByteSize.FromKiloBytes`, `ByteSize.FromKibiBytes`, and so on. For example:

```csharp
var size1 = ByteSize.FromBytes(500); // 500 B
var size2 = ByteSize.FromKiloBytes(1.5); // 1.5 KB
var size3 = ByteSize.FromKibiBytes(1.5); // 1.536 KB
```

You can also use the constructor of the ByteSize class, which takes a double value representing the number of bytes:

```csharp
var size4 = new ByteSize(500); // 62.5 B
```

To retrieve the byte size value in different units, you can use the properties of the ByteSize class, such as `Bytes`, `KiloBytes`, `KibiBytes`, and so on. For example:

```csharp
var size5 = ByteSize.FromMegaBytes(10); // 10 MB
Console.WriteLine(size5.Bytes); // 10000000
Console.WriteLine(size5.KiloBytes); // 10000
Console.WriteLine(size5.KibiBytes); // 9765.625
```

To perform arithmetic operations on byte size values, you can use the overloaded operators of the ByteSize class, such as `+`, `-`, `*`, `/`, `==`, `!=`, `<`, `>`, and so on. For example:

```csharp
var size6 = ByteSize.FromGigaBytes(1); // 1 GB
var size7 = ByteSize.FromGibiBytes(1); // 1 GiB
var size8 = size6 + size7; // 2.073741824 GB
var size9 = size6 - size7; // -73.741824 MB
Console.WriteLine(size6 == size7); // False
Console.WriteLine(size6 != size7); // True
Console.WriteLine(size6 < size7); // True
Console.WriteLine(size6 > size7); // False
Console.WriteLine(size8);
Console.WriteLine(size9);
```

To parse a byte size value from a string, you can use the `Parse` or `TryParse` methods of the ByteSize class. The string can be in any of the supported formats, such as `500`, `1.5 KB`, `1.5KiB`, `3 MB`, `4 MiB`, and so on. For example:

```csharp
var size12 = ByteSize.Parse("500 B"); // 500 B
var size13 = ByteSize.Parse("1.5 KB"); // 1.5 KB
var size14 = ByteSize.Parse("1.5KiB"); // 1.536 KB
var size15 = ByteSize.Parse("3 MB"); // 3 MB
var size16 = ByteSize.Parse("4 MiB"); // 4.194304 MB
```

To format a byte size value to a string, you can use the `ToString` method of the ByteSize class. For example:

```csharp
var size17 = ByteSize.FromKibiBytes(1.5); // 1.5 KiB
Console.WriteLine(size17.ToString()); // 1.5 KB
```

You can also use the `LargestWholeNumberSymbol` and `LargestWholeNumberValue` properties of the ByteSize class to get the largest whole number symbol and value for the byte size value. For example:

```csharp
var size18 = ByteSize.FromBytes(1500); // 1500 B
Console.WriteLine(size18.LargestWholeNumberBinarySymbol); // KiB
Console.WriteLine(size18.LargestWholeNumberBinaryValue); // 1.46484375
```

## Conclusion

ByteSize is a useful library that simplifies the representation and manipulation of byte size values in C#. It supports both decimal and binary units, and provides methods to create, convert, parse, format, and operate on byte size values.

I hope this article helps you understand how to use ByteSize to represent byte size.

Thank you for reading.
