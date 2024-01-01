---
layout: post
title: "Exploring Top Level Statements - Programs Without Main Methods in C#"
categories:
- programming
tags:
- Top Level Statements
- C#
- .NET 6
---

Top-level statements are a new feature introduced in C# 9 that allows you to write code directly at the root of a file, without having to wrap it in a class or a method. This means you can write a complete C# program with just a few lines of code, without the need for a Main method, which is the traditional entry point for C# programs. Top-level statements make it easier to write small and concise programs, such as scripts, code snippets, and one-off applications. They also improve the readability and maintainability of your code by reducing the boilerplate code and indentation levels.

## The Evolution of C# Program Structure
Before C# 9, every C# program had to have a Main method that served as the entry point for the application. The Main method had to be declared inside a class, which had to be inside a namespace. For example, the following code is the typical structure of a C# program that prints "Hello World" to the console:

```csharp
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World");
        }
    }
}
```

As you can see, this structure requires a lot of code and ceremony for a simple task. You have to import namespaces, declare classes and methods, and use curly braces and semicolons. This can sometimes be verbose and cumbersome, especially for small programs that don't need much functionality or complexity. It can also make it harder to read and understand the code at a glance.

## Introducing Top-Level Statements
Top-level statements are a compiler feature that allows you to write code directly at the root of a file, without having to put it inside a class or a method. This means you can write executable code as soon as you open a file, without any extra syntax or structure. For example, the following code is a valid C# program that prints "Hello World" to the console using top-level statements:

```csharp
Console.WriteLine("Hello World");
```

As you can see, this code is much shorter and simpler than the previous example. You don't need to import any namespaces, declare any classes or methods, or use any curly braces or semicolons. You just write the code you want to execute as if you were writing it in an interactive shell or a script file. The compiler will automatically generate a class and a Main method for you behind the scenes, so you don't have to worry about them.

Top-level statements allow you to focus on the logic and functionality of your program, rather than the structure and syntax. They also make your code more readable and understandable by eliminating unnecessary noise and clutter.

## Advantages of Top-Level Statements
Top-level statements have several benefits that make them useful for writing small and concise programs in C#. Some of these benefits are:

- Faster prototyping and experimentation: You can quickly write and run code without having to set up a project or create a class or a method. This is useful for testing ideas, exploring features, or learning new concepts.
- Easier code sharing: You can easily share your code with others by copying and pasting it into an email, a chat message, or an online editor. You don't have to worry about dependencies, namespaces, or classes.
- Improved learning curve: You can start writing C# code with minimal knowledge of the language or the environment. You don't have to learn about classes, methods, namespaces, or other advanced topics until you need them.
- Enhanced readability and maintenance: You can write clear and concise code that expresses your intent without any distractions or complications. You can also easily refactor your code by extracting methods or classes from your top-level statements as your program grows.

## Getting Started with Top-Level Statements
To use top-level statements in your C# programs, you need to have .NET 6 installed on your machine. You can download it from [here](https://dot.net). You also need an editor that supports C# 9 or higher, such as Visual Studio 2022, Visual Studio Code, or Rider.

To create a new console application project using top-level statements, you can use the dotnet new command with the console template:

```bash
dotnet new console -o MyProject
```

This will create a folder named MyProject with two files: Program.cs and MyProject.csproj. The Program.cs file will contain the following code:

```csharp
Console.WriteLine("Hello, World!");
```
See [this](https://aka.ms/new-console-template) guide for more information.

The MyProject.csproj file will contain the following XML:

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>

</Project>
```

You can now open the Program.cs file in your editor and start writing code using top-level statements. You don't need to modify the MyProject.csproj file unless you want to change some project settings or add some dependencies.

There are some requirements and limitations that you should be aware of when using top-level statements:

- You can only use top-level statements in one source file in your project. If you try to use them in more than one file, you will get a compiler error.
- You can't use the -main compiler option to specify the entry point for your application. The compiler will ignore any Main methods that you declare in your code.
- You can't use the #line or #pragma directives to change the line numbers or disable warnings in your code. The compiler will treat them as regular comments.

## Code Examples
To demonstrate how to use top-level statements in C#, let's look at some code examples that perform common tasks. For each example, we will compare the code length and clarity with an equivalent program using the traditional Main method.

### Printing to the Console
To print a message to the console, you can use the Console.WriteLine method. For example, to print "Hello World", you can write:

```csharp
Console.WriteLine("Hello World");
```

This code is one line long and very easy to read and understand. In contrast, the equivalent program using the Main method would be:

```csharp
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World");
        }
    }
}
```

This code is 11 lines long and contains a lot of unnecessary syntax and structure. It is also harder to read and understand at a glance.

### Basic Calculations
To perform basic calculations, you can use arithmetic operators and literals. For example, to calculate the area of a circle with a radius of 10, you can write:

```csharp
double radius = 10;
double area = Math.PI * radius * radius;
Console.WriteLine($"The area of the circle is {area}");
```

This code is three lines long and clearly shows the logic and the result of the calculation. In contrast, the equivalent program using the Main method would be:

```csharp
using System;

namespace CircleArea
{
    class Program
    {
        static void Main(string[] args)
        {
            double radius = 10;
            double area = Math.PI * radius * radius;
            Console.WriteLine($"The area of the circle is {area}");
        }
    }
}
```

This code is 13 lines long and contains a lot of unnecessary syntax and structure. It is also harder to read and understand at a glance.

### Reading User Input
To read user input from the console, you can use the Console.ReadLine method. For example, to ask the user for their name and greet them, you can write:

```csharp
Console.Write("What is your name? ");
string name = Console.ReadLine();
Console.WriteLine($"Hello, {name}");
```

This code is three lines long and clearly shows the interaction with the user. In contrast, the equivalent program using the Main method would be:

```csharp
using System;

namespace Greeting
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("What is your name? ");
            string name = Console.ReadLine();
            Console.WriteLine($"Hello, {name}");
        }
    }
}
```

This code is 13 lines long and contains a lot of unnecessary syntax and structure. It is also harder to read and understand at a glance.

## Interacting with Assemblies and Namespaces
Top-level statements can interact with assemblies and namespaces just like regular C# programs. You can import namespaces using using directives, reference external libraries using assembly references, and declare types and namespaces using type definitions and namespace declarations.

### Using Directives
You can use using directives to import namespaces that contain types or members that you want to use in your code. For example, to use the System.Text namespace, which contains classes for working with text, you can write:

```csharp
using System.Text;

StringBuilder builder = new();
builder.AppendLine("Hello");
builder.AppendLine("World");
Console.WriteLine(builder.ToString());
```

You have to place using directives before any top-level statements in your file. You can't place them inside or after top-level statements.

### Assembly References
You can reference external libraries that contain types or members that you want to use in your code by adding assembly references to your project file. For example, to use the Newtonsoft.Json library, which contains classes for working with JSON data, you can add the following line to your MyProject.csproj file:

```xml
<ItemGroup>
  <PackageReference Include="Newtonsoft.Json" Version="13.0.1" />
</ItemGroup>
```

This will download and install the Newtonsoft.Json library from NuGet, which is a package manager for .NET. You can then use the Newtonsoft.Json namespace in your code. For example, to parse a JSON string and print its properties, you can write:

```csharp
using Newtonsoft.Json;

string json = "{\"name\":\"John\",\"age\":30,\"pets\":[\"dog\",\"cat\"]}";
dynamic obj = JsonConvert.DeserializeObject(json);
Console.WriteLine($"Name: {obj.name}");
Console.WriteLine($"Age: {obj.age}");
Console.WriteLine($"Pets: {string.Join(", ", obj.pets)}");
```

You can also use the dotnet add package command to add a package reference from the command line. For example, to add the Newtonsoft.Json library, you can run:

```bash
dotnet add package Newtonsoft.Json
```

You can find more information about using NuGet packages in .NET 6 projects [here](https://learn.microsoft.com/en-gb/nuget/consume-packages/install-use-packages-dotnet-cli).

### Type Definitions and Namespace Declarations
You can also declare your own types and namespaces in your code using type definitions and namespace declarations. For example, to define a class named Person and a namespace named MyNamespace, you can write:

```csharp
namespace MyNamespace
{
    class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
    }
}
```

You can then use your types and namespaces in your top-level statements or in other files. For example, to create an instance of the Person class and print its properties, you can write:

```csharp
using MyNamespace;

Person person = new Person { Name = "Alice", Age = 25 };
Console.WriteLine($"Name: {person.Name}");
Console.WriteLine($"Age: {person.Age}");
```

You have to place type definitions and namespace declarations after any top-level statements in your file. You can't place them before or inside top-level statements.

## Compilation and Execution
Top-level statements are compiled and executed by the C# compiler just like regular C# programs. The compiler will generate a class named `<Program>` and a method named `<Main>` for you behind the scenes, and wrap your top-level statements inside them. For example, if your Program.cs file contains the following code:

```csharp
using System;

Console.WriteLine("Hello World");
```

The compiler will generate something like this:

```csharp
using System;

namespace <global namespace>
{
    class <Program>
    {
        static void <Main>(string[] args)
        {
            Console.WriteLine("Hello World");
        }
    }
}
```

The compiler will also generate a unique name for the assembly that contains your program, such as `MyProject.dll`. You can change this name by editing the `<AssemblyName>` element in your project file.

To compile and run your program, you can use the dotnet run command from the command line. For example, to run the program in the MyProject folder, you can run:

```bash
dotnet run --project MyProject
```

This will output:

```bash
Hello World
```

You can also use the dotnet build command to compile your program without running it. This will create a binary file in the bin folder of your project. For example, to build the program in the MyProject folder, you can run:

```bash
dotnet build --project MyProject
```

This will create a file named `MyProject.dll` in the `bin\Debug\net6.0` folder of your project.

There are no significant performance implications or differences in compilation when using top-level statements compared to traditional programs. The compiler will optimize and emit the same IL code for both cases.

However, top-level statements are not suitable for all types of projects or scenarios. They are primarily intended for small and simple programs that don't need much structure or complexity. For larger and more complex applications, you should use classes and methods to organize your code and logic.

## Best Practices and Use Cases
Top-level statements are a convenient and powerful feature that can help you write small and concise programs in C#. However, they are not a replacement for classes and methods, but rather a complement to them. You should use them wisely and appropriately depending on your context and scope.

Some best practices for when to use top-level statements versus traditional structures are:

- Use top-level statements for quick scripts, code snippets, and one-off applications that don't need much functionality or complexity.
- Use classes and methods for larger and more complex applications that need more structure, modularity, reusability, testability, and maintainability.
- Use top-level statements for prototyping and experimenting with new ideas or features, but transition to classes and methods as your codebase grows.
- Use top-level statements for learning and teaching C#, but introduce classes and methods as you progress to more advanced topics.

Some scenarios where top-level statements are particularly beneficial are:

- Writing console applications that perform simple tasks, such as printing messages, reading user input, performing calculations, or parsing data.
- Writing code snippets that demonstrate how to use a library, a feature, or a concept in C#.
- Writing scripts that automate some processes, such as file operations, web requests, or database queries.
- Writing one-off applications that solve a specific problem or challenge, such as a coding puzzle, a game, or a utility.

## Potential Drawbacks and Considerations
Top-level statements are not without their drawbacks and considerations. Some of the potential downsides of using top-level statements are:

- Limited support for more complex applications: Top-level statements are not designed for building large and complex applications that require more structure and organization. They can make your code harder to read, understand, debug, and maintain as it grows.
- Challenges in maintaining larger projects: Top-level statements can make it difficult to manage dependencies, namespaces, and references in larger projects. They can also introduce conflicts and ambiguities with existing codebases and libraries that use classes and methods.
- Interoperability with existing codebases and libraries: Top-level statements are not compatible with some existing codebases and libraries that expect a class or a method as the entry point for your application. For example, you can't use top-level statements with ASP.NET Core, which requires a Startup class to configure your web application.

## Conclusion
Top-level statements are a feature of C# 9 that allow you to write code directly at the root of a file, without having to wrap it in a class or a method. They can simplify your program structure and improve your code readability and maintainability. They are especially useful for writing small and concise programs, such as scripts, code snippets, and one-off applications. However, they are not suitable for all types of projects or scenarios. You should use them wisely and appropriately depending on your context and scope. I hope this blog post has helped you understand what top-level statements are, how they work, and what are their advantages and disadvantages. I encourage you to experiment with top-level statements in your C# projects while being mindful of their limitations and best practices.

Refer to the below articles for more information:
- [Top-level statements - programs without Main methods](https://learn.microsoft.com/en-gb/dotnet/csharp/fundamentals/program-structure/top-level-statements)
- [Top-Level Statements in C#](https://trailheadtechnology.com/top-level-statements-in-c/)
- [C# 9 - Top-Level Statements](https://www.claudiobernasconi.ch/2020/12/03/csharp-9-top-level-statements/)

Happy coding! 😊
