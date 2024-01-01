---
layout: post
title: "Getting Started with Humanizer in C#"
categories:
- programming
tags:
- C#
- .NET
- Humanizer
- String Manipulation
- Date Formatting
- Number Formatting
- Pluralization
- Ordinalization
- User Experience
- NuGet
- Open Source
- MIT License
- .NET Foundation
---

Have you ever wondered how to make your C# applications more user-friendly and readable? How to format strings, numbers, dates, and enums in a way that is easy for humans to understand? How to avoid writing complex and tedious code for common tasks like pluralization, ordinalization, and casing?

If you answered yes to any of these questions, then you might be interested in [**Humanizer**](https://github.com/Humanizr/Humanizer), a free, open-source .NET library that offers a set of extension methods and utilities to format and manipulate strings, numbers, dates, times, timespans, numbers, and quantities. Humanizer is part of the **.NET Foundation**, and operates under their code of conduct. It is licensed under the **MIT** (an OSI approved license).

In this article, I will show you how to install and use Humanizer in your C# projects, and demonstrate some of its basic and advanced features. By the end of this article, you will be able to enhance your user experience in C# with Humanizer.

## Installing Humanizer

The easiest way to install Humanizer is to use the **NuGet Package Manager**, which is a tool that helps you manage the dependencies of your .NET projects. You can use the NuGet Package Manager Console, the Visual Studio UI, or the dotnet CLI to install Humanizer.

To install Humanizer using the NuGet Package Manager Console, open the console in Visual Studio and type the following command:

```csharp
Install-Package Humanizer
```

To install Humanizer using the Visual Studio UI, right-click on your project in the Solution Explorer and select Manage NuGet Packages. Then search for Humanizer in the Browse tab and click Install.

To install Humanizer using the dotnet CLI, open a command prompt and navigate to your project folder. Then type the following command:

```csharp
dotnet add package Humanizer
```

After installing Humanizer, you can add it to your C# project by adding the following using statement at the top of your code file:

```csharp
using Humanizer;
```

## Basic String Humanization

One of the most common uses of Humanizer is to humanize strings, which means to convert them from a machine-readable format to a human-readable format. For example, you can use Humanizer to convert camelCase and PascalCase strings to readable text, format numbers and dates in a human-friendly way, and pluralize and singularize words.

To convert camelCase and PascalCase strings to readable text, you can use the `Humanize` extension method on any string. For example:

```csharp
string camelCase = "thisIsAString";
string pascalCase = "ThisIsAString";

Console.WriteLine(camelCase.Humanize()); // This is a string
Console.WriteLine(pascalCase.Humanize()); // This is a string
```

To format numbers and dates in a human-friendly way, you can use the `ToWords` and `Humanize` extension methods on any number or date. For example:

```csharp
int number = 42;
DateTime date = new DateTime(2023, 11, 26);

Console.WriteLine(number.ToWords()); // forty two
Console.WriteLine(date.Humanize()); // 10 hours ago
```

To pluralize and singularize words, you can use the `Pluralize` and `Singularize` extension methods on any string. For example:

```csharp
string word = "cat";

Console.WriteLine(word.Pluralize()); // cats
Console.WriteLine(word.Singularize()); // cat

word = "index";

Console.WriteLine(word.Pluralize()); // indices
Console.WriteLine(word.Singularize()); // index
```

## Advanced String Manipulation

Humanizer also provides some advanced features for string manipulation, such as abbreviations and acronyms expansion, transforming strings to Title Case, and dealing with ordinal numbers (1st, 2nd, 3rd).

To expand abbreviations and acronyms, you can use the `Dehumanize` extension method on any string. For example:

```csharp
string mr = "Mr.";
string nasa = "National Aeronautics and Space Administration";

Console.WriteLine(mr.Dehumanize()); // Mr
Console.WriteLine(nasa.Dehumanize()); // NationalAeronauticsAndSpaceAdministration
```

To transform strings to Title Case, you can use the `Transform` extension method on any string, and pass the `To.TitleCase` parameter. For example:

```csharp
string sentence = "this is a title";

Console.WriteLine(sentence.Transform(To.TitleCase)); // This Is a Title
```

To deal with ordinal numbers (1st, 2nd, 3rd), you can use the `Ordinalize` extension method on any number. For example:

```csharp
int number = 42;

Console.WriteLine(number.Ordinalize()); // 42nd
```

## Conclusion

In this article, I have shown you how to install and use Humanizer in your C# projects, and demonstrated some of its basic and advanced features. Humanizer is a powerful and versatile library that can help you format and manipulate strings and numbers in a way that is easy for humans to read and understand. It can save you a lot of time and effort by eliminating the need for complex and tedious code for common tasks like pluralization, ordinalization, and casing.

I hope you enjoyed this article and learned something new. Thank you for reading and happy coding!
