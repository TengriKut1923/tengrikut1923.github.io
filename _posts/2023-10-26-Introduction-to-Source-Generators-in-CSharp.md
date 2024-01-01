---
layout: post
title: "Introduction to Source Generators in C#"
categories:
- programming
tags:
- C#
- .NET
- .NET 7
- Source Generators
- Roslyn
- SDK
- Compiler
---

Code generation is an essential technique in software development that can help you automate repetitive tasks, optimize performance, and reduce errors. However, writing and maintaining code generators can be challenging and time-consuming. That's why C# 9 introduced a powerful feature called Source Generators that can simplify and enhance your code generation experience.

In this blog post, We will understand what Source Generators are, and how you can write your own Source Generator to generate code based on attributes or other markers in your source code.

## What Are Source Generators?

Source Generators are a new kind of component that you can write using the .NET Compiler Platform (Roslyn) SDK. They let you do two major things:

- Retrieve a Compilation object that represents all user code that is being compiled. This object can be inspected and you can write code that works with the syntax and semantic models for the code being compiled, just like with analyzers today.
- Generate C# source files that can be added to a Compilation object during compilation. In other words, you can provide additional source code as input to a compilation while the code is being compiled.

When combined, these two things are what make Source Generators so useful. You can inspect user code with all of the rich metadata that the compiler builds up during compilation, then emit C# code back into the same compilation that is based on the data you've analyzed.

If you're familiar with Roslyn Analyzers, you can think of Source Generators as analyzers that can emit C# source code. A Source Generator is a .NET Standard 2.0 assembly that is loaded by the compiler along with any analyzers. It is usable in environments where .NET Standard components can be loaded and run.

Source Generators are different from other code generation techniques such as T4 templates or Reflection in several ways:

- Source Generators operate at compile time, not at design time or run time. This means they have no impact on the performance of your application at run time, and they can access compile-time information that is not available at design time or run time.
- Source Generators do not modify existing source files or generate new files on disk. They only add new source files to the compilation in memory. This means they do not interfere with your source control or file system, and they do not require any manual steps to invoke them or include their output in your project.
- Source Generators are fully integrated with the C# language and tooling. They support all C# language features and constructs, and they work seamlessly with Visual Studio, MSBuild, dotnet CLI, and any other tools that use Roslyn.

## Writing Your First Source Generator

To get started with Source Generators, you'll need to install the latest .NET SDK and the latest Visual Studio.

Create projects with the following structure:

```
MyGenerator(Solution)
├── MyGenerator.csproj(Class Library, netstandard2.0)
├────── MyGeneratorClass.cs
└── MyGeneratorTests.csproj(Exe, net7.0)
```

The `MyGenerator.csproj` file is a standard C# class library project that references the `Microsoft.CodeAnalysis.CSharp` and `Microsoft.CodeAnalysis.Analyzers` packages. These packages provides the APIs for working with C# syntax and semantic models.

The `MyGeneratorClass.cs` file contains a class that implements the `ISourceGenerator` interface. This interface defines two methods: `Initialize` and `Execute`. The `Initialize` method is called once when the generator is created, and it can be used to register callbacks for various events in the compilation process. The `Execute` method is called for each generation pass, and it receives a `GeneratorExecutionContext` object that provides access to the compilation object and other useful information.

```csharp
// MyGenerator.cs

using Microsoft.CodeAnalysis;

namespace MyGenerator
{
	internal class MyGeneratorClass : ISourceGenerator
	{
		public void Initialize(GeneratorInitializationContext context)
		{
			throw new NotImplementedException();
		}

		public void Execute(GeneratorExecutionContext context)
		{
			throw new NotImplementedException();
		}
	}
}
```

The `MyGeneratorTests.csproj` file is a exe project that references the `MyGenerator.csproj` project.

Let's write a simple Source Generator that generates a class with a static property that returns the current date and time as a string. To do this, we need to do three things:

- Define an attribute that we can use to mark our target classes.
- Write some code to find all classes marked with our attribute in the user code.
- Write some code to generate a new class for each target class with our property.

In `MyGenerator` project, create a file called `GenerateDateTimeAttribute.cs` with the following code:

```csharp
using System;

namespace MyGenerator.Attributes
{
	[AttributeUsage(AttributeTargets.Class, Inherited = false)]
	public class GenerateDateTimeAttribute : Attribute
	{
	}
}
```

This attribute is very simple and has no parameters. We only use it as a marker to identify our target classes.

Next, we write some code to find all classes marked with our attribute in the user code. We can do this in the `Initialize` method of our generator class by registering a callback for the `SyntaxReceiver` event. This event is fired for each syntax node in the user code, and we can use it to collect the nodes that we are interested in. We can define a nested class that implements the `ISyntaxReceiver` interface and stores the class declaration nodes that have our attribute:

```csharp
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace MyGenerator
{
	[Generator]
	internal class MyGeneratorClass : ISourceGenerator
	{
		public void Initialize(GeneratorInitializationContext context)
		{
			// Register a callback that will be invoked for each syntax node in the user code
			context.RegisterForSyntaxNotifications(() => new SyntaxReceiver());
		}

		public void Execute(GeneratorExecutionContext context)
		{
			// TODO: Generate code based on the collected nodes
		}
	}

	// A class that implements ISyntaxReceiver and stores the class declaration nodes that have our attribute
    internal class SyntaxReceiver : ISyntaxReceiver
    {
        public List<ClassDeclarationSyntax> CandidateClasses { get; } = new();

        // This method is called for each syntax node in the user code
        public void OnVisitSyntaxNode(SyntaxNode syntaxNode)
        {
            // We are only interested in class declarations that have our attribute
            if (syntaxNode is not ClassDeclarationSyntax classDeclarationSyntax ||
                classDeclarationSyntax.AttributeLists.Count <= 0) return;
            // Check if any of the attributes is our attribute
            foreach (var attributeList in classDeclarationSyntax.AttributeLists)
            {
                if (attributeList.Attributes.Select(attribute => attribute.Name.ToString()).Any(name => name is "GenerateDateTime" or "GenerateDateTimeAttribute"))
                {
                    CandidateClasses.Add(classDeclarationSyntax);
                }
            }
        }
    }
}
```

We use the `[Generator]` attribute to mark our generator class so that the compiler can discover it. We also use the `ToString` method to get the name of the attribute, since it may be qualified or unqualified.

Finally, we write some code to generate a new class for each target class with our property. We can do this in the `Execute` method of our generator class by using the `Compilation` object and the `CSharpSyntaxTree` class. We also need to add a reference to our attribute project so that we can use its namespace and type name:

```csharp
using System;
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;

namespace MyGenerator
{
    [Generator]
    public class MyGeneratorClass : ISourceGenerator
    {
        public void Initialize(GeneratorInitializationContext context)
        {
            // Register a callback that will be invoked for each syntax node in the user code
            context.RegisterForSyntaxNotifications(() => new SyntaxReceiver());
        }

        public void Execute(GeneratorExecutionContext context)
        {
            // Get the compilation object that represents all user code being compiled
            var compilation = context.Compilation;

            // Get the list of candidate classes from the syntax receiver
            var receiver = (SyntaxReceiver)context.SyntaxReceiver;
            if (receiver == null) return;
            var candidateClasses = receiver.CandidateClasses;

            // Loop through each candidate class
            foreach (var classDeclaration in candidateClasses)
            {
                // Get the semantic model for the class declaration
                var model = compilation.GetSemanticModel(classDeclaration.SyntaxTree);

                // Get the symbol for the class declaration
                var classSymbol = model.GetDeclaredSymbol(classDeclaration);

                // Generate the name of the new class
                if (classSymbol == null) continue;
                var newClassName = $"{classSymbol.Name}Generated";

                // Generate the namespace of the new class
                var namespaceName = classSymbol.ContainingNamespace.ToDisplayString();

                // Generate the source code of the new class
                var source = GenerateClassSource(newClassName, namespaceName);

                // Add the source code to the compilation
                context.AddSource($"{newClassName}.cs", SourceText.From(source, Encoding.UTF8));
            }
        }

        // A helper method that generates the source code of the new class
        private string GenerateClassSource(string className, string namespaceName)
        {
            // Use a StringBuilder to build the source code
            var sourceBuilder = new StringBuilder();

            // Add the using directives
            sourceBuilder.AppendLine("using System;");

            // Add an empty line
            sourceBuilder.AppendLine();

            // Add the namespace declaration
            sourceBuilder.AppendLine($"namespace {namespaceName}");
            sourceBuilder.AppendLine("{");

            // Add the class declaration
            sourceBuilder.AppendLine($"\tpublic partial class {className}");
            sourceBuilder.AppendLine("\t{");

            // Add the property declaration
            sourceBuilder.AppendLine("\t\tpublic static string CurrentDateTime => DateTime.Now.ToString();");

            // Close the class declaration
            sourceBuilder.AppendLine("\t}");

            // Close the namespace declaration
            sourceBuilder.AppendLine("}");

            // Return the source code as a string
            return sourceBuilder.ToString();
        }
    }

    // A nested class that implements ISyntaxReceiver and stores the class declaration nodes that have our attribute
    internal class SyntaxReceiver : ISyntaxReceiver
    {
        public List<ClassDeclarationSyntax> CandidateClasses { get; } = new();

        // This method is called for each syntax node in the user code
        public void OnVisitSyntaxNode(SyntaxNode syntaxNode)
        {
            // We are only interested in class declarations that have our attribute
            if (syntaxNode is not ClassDeclarationSyntax classDeclarationSyntax ||
                classDeclarationSyntax.AttributeLists.Count <= 0) return;
            // Check if any of the attributes is our attribute
            foreach (var attributeList in classDeclarationSyntax.AttributeLists)
            {
                if (attributeList.Attributes.Select(attribute => attribute.Name.ToString()).Any(name => name is "GenerateDateTime" or "GenerateDateTimeAttribute"))
                {
                    CandidateClasses.Add(classDeclarationSyntax);
                }
            }
        }
    }
}
```

We use a helper method to generate the source code of the new class using a `StringBuilder`. We also use string interpolation to insert the class name and namespace name into the code. The generated property simply returns the current date and time as a string using `DateTime.Now.ToString()`.

To test our generator, we can create a console application project that references both our generator project and our attribute project. We can then write some user code that uses our attribute and calls our generated property:

```csharp
using MyGenerator.Attributes;

namespace MyGeneratorTests
{
	[GenerateDateTime]
	public static class Program
	{
		static void Main()
		{
			Console.WriteLine($"Hello, world! The current date and time is {ProgramGenerated.CurrentDateTime}.");

			Console.WriteLine("Done");
			Console.ReadLine();
		}
	}
}
```

When we build and run this project, we should see something like this:

```
Hello, world! The current date and time is 10/25/2023 2:18:30 PM.
```

## Conclusion

In this blog post, we learned what Source Generators are, how they differ from other code generation techniques, and how we can write our own Source Generator to generate code based on attributes or other markers in our source code.

I hope you enjoyed this blog post and learned something new. Thank you for reading! 😊
