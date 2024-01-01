---
layout: post
title: "Collection Expressions in C# 12.0"
categories:
- programming
tags:
- C#
- .NET
- C# 12
- Collection
- Expressions
- Collection Expressions
---

C# 12.0 introduces a new feature known as **collection expressions**, which aims to simplify the syntax for creating and initializing collections. This feature is part of the ongoing evolution of the C# language, providing developers with more concise and readable code.

### Overview
Collection expressions offer a new, terse syntax for creating common collection types without the need for verbose initialization patterns previously required in C#. The syntax `[e1, e2, e3, ...]` allows for the direct creation of arrays, lists, and other collection types.

### Syntax and Usage
The basic syntax for a collection expression is as follows:

```csharp
var numbers = [1, 2, 3, 4, 5]; // Creates an int array
```

This expression creates an array of integers. The type of the collection is inferred from the context, eliminating the need for explicit type declarations in many cases.

### Spread Operator
A significant addition to the syntax is the **spread operator** `..`, which allows for the inclusion of other collections within a new collection expression:

```csharp
var moreNumbers = [0, ..numbers, 6]; // Spreads 'numbers' between 0 and 6
```

Here, `moreNumbers` will be an array containing `[0, 1, 2, 3, 4, 5, 6]`.

### Supported Types
Collection expressions can be used to create several collection-like types, including:

- **Array types**: Such as `int[]`.
- **Span<T> and ReadOnlySpan<T>**: Useful for memory-efficient collections.
- **Types with collection initializers**: Like `List<T>`, where the type `T` can be inferred.

### Advantages
The advantages of using collection expressions are manifold:

- **Conciseness**: Reduces the boilerplate code required to instantiate collections.
- **Readability**: Makes the code more intuitive and easier to understand at a glance.
- **Performance**: Avoids multiple reallocations of memory that can occur with collection initializers due to the use of `.Add` invocations without an initial capacity.

### Conclusion
Collection expressions in C# 12.0 represent a significant step forward in the language's design, offering developers a more streamlined and efficient way to work with collections.

Thank you for reading.
