---
layout: post
title: "Exploring Pattern Matching in C#"
categories:
- programming
tags:
- C#
- .NET 5
- .NET 6
- .NET Core
- .NET Framework
---

Pattern matching is a powerful feature in C# that allows you to test an expression against various characteristics and take different actions based on the result. Pattern matching can make your code more concise, readable, and expressive. In this blog post, we will explore the basics of pattern matching, how to use switch statements and expressions for pattern matching, and what are the future possibilities for this feature.

## The Basics of Pattern Matching

Pattern matching is a technique where you check an expression to see if it has certain characteristics, such as a specific type, value, or structure. For example, you can use pattern matching to check if a variable is null, if it is an integer, or if it is a list with a certain number of elements. Depending on the outcome of the match, you can perform different actions, such as assigning a value to a variable, executing some code, or throwing an exception.

Pattern matching in C# is different from the traditional if-else statements, which rely on boolean expressions and equality operators. Pattern matching provides a more concise and expressive way to write conditional logic, as it can handle complex scenarios with less code and more clarity. For example, instead of writing multiple nested if-else statements to check the type and value of a variable, you can use a single switch expression with pattern matching.

C# supports multiple patterns that you can use to match an expression, such as:

- Constant patterns: to test if an expression equals a specified constant value, such as `null`, `true`, `false`, or a literal value.
- Type patterns: to test if an expression is compatible with a specified type, such as `int`, `string`, or `IList<T>`.
- Var patterns: to match any expression and assign its result to a declared variable.

You can use the `is` pattern expression to check if an expression matches a pattern and optionally declare a new variable to hold the result. For example, the following code checks if a variable `greeting` is a non-null string and assigns it to a new variable `message`:

```csharp
object greeting = "Hello, World!";
if (greeting is string message)
{
    Console.WriteLine(message.ToLower()); // output: hello, world!
}
```

## Switch Statements and Pattern Matching

Switch statements are a common way to write conditional logic in C#. They allow you to compare an expression against a set of possible values and execute a corresponding block of code. However, switch statements have some limitations, such as:

- They only work with integral types, enums, strings, and a few special types, such as `bool` and `char`.
- They require a `break` statement at the end of each case block, which can be error-prone and verbose.
- They do not support pattern matching, which means you cannot test an expression against different types, values, or structures.

C# 7 and later versions introduced some enhancements to switch statements, such as:

- They support pattern matching, which means you can use any of the supported patterns to match an expression.
- They allow you to declare variables in case labels, which can be used in the corresponding case block or in the `when` clause.
- They enable you to use the `when` clause to specify an additional condition for a case label, which can be any boolean expression.

For example, the following code uses a switch statement with pattern matching to check the type and value of a variable `obj` and print a different message for each case:

```csharp
object obj = 42;
switch (obj)
{
    case null:
        Console.WriteLine("The object is null");
        break;
    case int i when i > 0:
        Console.WriteLine($"The object is a positive integer: {i}");
        break;
    case int i when i < 0:
        Console.WriteLine($"The object is a negative integer: {i}");
        break;
    case int i:
        Console.WriteLine("The object is zero");
        break;
    case string s:
        Console.WriteLine($"The object is a string: {s}");
        break;
    default:
        Console.WriteLine("The object is something else");
        break;
}
```

C# 8 introduced switch expressions, which are a concise and expressive way to use pattern matching. Switch expressions are expressions that return a value based on the first matching pattern for an input expression. They have the following advantages over switch statements:

- They do not require a `break` statement or a `default` case, as they must be exhaustive and cover all possible cases.
- They can be used in any place where an expression is expected, such as in assignments, returns, or method arguments.
- They use the `=>` syntax to separate the case label from the result expression, which makes the code more readable and compact.

For example, the following code uses a switch expression to check the type and value of a variable `obj` and return a corresponding message:

```csharp
object obj = 42;
string message = obj switch
{
    null => "The object is null",
    int i when i > 0 => $"The object is a positive integer: {i}",
    int i when i < 0 => $"The object is a negative integer: {i}",
    int i => "The object is zero",
    string s => $"The object is a string: {s}",
    _ => "The object is something else"
};
Console.WriteLine(message); // output: The object is a positive integer: 42
```

You can also combine multiple patterns in switch statements and expressions using the logical patterns `and`, `or`, and `not`. These patterns allow you to test an expression against a logical combination of patterns, such as:

- `&` pattern: to match an expression when both patterns match.
- `|` pattern: to match an expression when either pattern matches.
- `!` pattern: to match an expression when the negated pattern does not match.

For example, the following code uses a switch expression with logical patterns to check if a variable `number` is an even or odd integer, a zero, or something else:

```csharp
object number = 42;
string message = number switch
{
    int i when i is not 0 & i % 2 == 0 => "The number is an even integer",
    int i when i is not 0 & i % 2 != 0 => "The number is an odd integer",
    int i when i is 0 => "The number is zero",
    _ => "The number is something else"
};
Console.WriteLine(message); // output: The number is an even integer
```

## Conclusion

Pattern matching is a powerful feature in C# that allows you to write concise and expressive code for conditional logic. You can use various patterns to test an expression against different characteristics, such as type, value, or structure. You can also use switch statements and expressions to perform different actions based on the first matching pattern for an expression. You can combine multiple patterns using logical patterns to create complex conditions.

We have covered the basics of pattern matching, how to use switch statements and expressions for pattern matching, and what are the possibilities of this feature. I encourage you to explore and experiment with pattern matching in C# and see how it can improve your code.

Thank you for reading this blog post. I hope you enjoyed it and learned something new. Happy coding!
