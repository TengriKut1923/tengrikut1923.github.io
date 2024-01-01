---
layout: post
title: "Exploring the Null-Coalescing Operators in C#"
categories:
- programming
tags:
- C#
- Null-Coalescing
- Operators
---

One of the common challenges in programming is handling null values. A null value represents the absence of a variable or expression value. Sometimes, null values are expected and useful, such as when they indicate that an optional parameter is not provided or that a query returned no results. However, sometimes null values can cause errors and exceptions, such as when they are dereferenced or used in arithmetic operations. For example, in C#, accessing a property or a method of a null reference will throw a `NullReferenceException`, one of the most frequent and annoying exceptions developers encounter.

To avoid such errors and exceptions, programmers must check for null values and handle them appropriately. For example, they can use conditional statements (if-else) to test for null values and provide alternative values or actions. However, this can make the code verbose and cluttered, especially when there are multiple potential null values to handle.

Fortunately, C# provides a powerful tool for handling null values in a concise and elegant way: the **null-coalescing operator**. The null-coalescing operator (`??`) allows programmers to specify a default value when an expression evaluates to null. It also has a shorthand assignment version (`??=`) that assigns a default value to a variable only if it is null.

This blog post aims to provide an in-depth understanding of the null-coalescing operators in C#. I will cover the following topics:

- Understanding the basics of the null-coalescing operator
- Syntax and usage of the null-coalescing operator
- Chaining null-coalescing operators
- Null-coalescing operator vs. conditional statements
- Combining with default values
- Null-coalescing operator with function calls
- Handling nullable booleans
- Best practices and considerations

By the end of this blog post, you will be able to use the null-coalescing operators effectively and confidently in your C# projects.

## Understanding the Basics

The null-coalescing operator (`??`) is a binary operator that takes two operands: `expression1 ?? expression2`. The behavior of the operator is as follows:

- If `expression1` is not null, it is returned as the result of the operation.
- If `expression1` is null, `expression2` is evaluated and returned as the result of the operation.

The null-coalescing operator does not evaluate `expression2` if `expression1` is not null. This means that it can avoid unnecessary computations or side effects.

The purpose of the null-coalescing operator is to provide a concise way to handle null values. It allows programmers to specify a default value when an expression evaluates to null without writing verbose conditional statements.

Let's look at a simple example to demonstrate the need for the null-coalescing operator. Suppose we have a class that represents a person:

```csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}
```

Now, suppose we have a method that takes a person object as an argument and prints its name and age:

```csharp
void PrintPerson(Person person)
{
    Console.WriteLine($"Name: {person.Name}, Age: {person.Age}");
}
```

What happens if we pass a null value to this method? We will get a `NullReferenceException` because we are trying to access the properties of a null reference:

```csharp
Person person = null;
PrintPerson(person); // NullReferenceException
```

To avoid this exception, we need to check for null values before accessing properties:

```csharp
void PrintPerson(Person person)
{
    if (person != null)
    {
        Console.WriteLine($"Name: {person.Name}, Age: {person.Age}");
    }
    else
    {
        Console.WriteLine("Person is null");
    }
}
```

This works, but it makes the code longer and less readable. Moreover, if we have multiple potential null values to handle, we will need to write nested if-else statements, which can make the code even more complex and messy.

This is where the null-coalescing operator comes in handy. We can use it to provide default values for properties that might be null:

```csharp
void PrintPerson(Person person)
{
    string name = person?.Name ?? "Unknown"; // Use "Unknown" if name is null
    int age = person?.Age ?? 0; // Use 0 if age is null
    Console.WriteLine($"Name: {name}, Age: {age}");
}
```

The `?.` operator is called the **null-conditional operator**, which returns null if its left-hand operand is null, and otherwise evaluates its right-hand operand. We will discuss it in more detail later. For now, note that we use it to avoid dereferencing a null reference.

The code above is much shorter and clearer than the previous version. It also handles null values gracefully without throwing exceptions. If we pass a null value to the method, we will get the following output:

```csharp
Person person = null;
PrintPerson(person); // Name: Unknown, Age: 0
```

If we pass a non-null value, we will get the expected output:

```csharp
Person person = new Person { Name = "Alice", Age = 25 };
PrintPerson(person); // Name: Alice, Age: 25
```

As you can see, the null-coalescing operator makes the code more concise and robust. In the next section, we will learn more about the syntax and usage of the operator.

## Syntax and Usage

The syntax of the null-coalescing operator is as follows:

```csharp
expression1 ?? expression2
```

The operands of the operator can be of any type as long as they are compatible or implicitly convertible to each other. The result of the operation is also of the same type as the operands.

The operator can be used with different data types, such as nullable value types, reference types, strings, etc. Let's look at some examples.

### Nullable Value Types

A nullable value type is a value type that can also hold a null value. For example, `int?` is a nullable version of `int.` To declare a nullable value type, we can use the `?` suffix or the `Nullable<T>` generic type.

We can use the null-coalescing operator to provide a default value for a nullable value type when it is null. For example:

```csharp
int? x = null; // Declare a nullable int with null value
int y = x ?? 10; // Use 10 as default value if x is null
Console.WriteLine(y); // 10
```

We can also use the `GetValueOrDefault()` method of the nullable value type to achieve the same effect:

```csharp
int? x = null; // Declare a nullable int with null value
int y = x.GetValueOrDefault(10); // Use 10 as default value if x is null
Console.WriteLine(y); // 10
```

The difference between the two approaches is that the `GetValueOrDefault()` method takes an argument that specifies the default value to use. In contrast, the null-coalescing operator uses its right-hand operand as the default value. The `GetValueOrDefault()` method also has an overload that takes no arguments and returns the default value of the underlying value type (such as 0 for int).

### Reference Types

A reference type is a type that holds a reference to an object in memory, such as a class or an interface. A reference type can also hold a null value, which means that it does not refer to any object.

We can use the null-coalescing operator to provide a default value for a reference type when it is null. For example:

```csharp
string s = null; // Declare a string with null value
string t = s ?? "Hello"; // Use "Hello" as the default value if s is null
Console.WriteLine(t); // Hello
```

We can also use the `??=` operator to assign a default value to a reference type variable only if it is null. For example:

```csharp
string s = null; // Declare a string with null value
s ??= "Hello"; // Assign "Hello" to s if s is null
Console.WriteLine(s); // Hello
```

The `??=` operator is equivalent to writing:

```csharp
string s = null; // Declare a string with null value
if (s == null)
{
    s = "Hello"; // Assign "Hello" to s if s is null
}
Console.WriteLine(s); // Hello
```

But it is much shorter and clearer.

### Strings

Strings are reference types in C#, but they have some special features and behaviors. One of them is that they can be empty (`""`) or whitespace (`" "`), in addition to being null.

We can use the null-coalescing operator to provide a default value for a string when it is null. For example:

```csharp
string s = null; // Declare a string with null value
string t = s ?? "Hello"; // Use "Hello" as default value if s is null
Console.WriteLine(t); // Hello
```

However, if we want to provide a default value for a string when it is empty or whitespace, we need to use another method: `string.IsNullOrEmpty()` or `string.IsNullOrWhiteSpace()`. These methods return true if the string is null, empty, or whitespace, respectively.

For example:

```csharp
string s = ""; // Declare an empty string
string t = string.IsNullOrEmpty(s) ? "Hello" : s; // Use "Hello" as default value if s is null or empty
Console.WriteLine(t); // Hello
```

Similarly:

```csharp
string s = " "; // Declare a whitespace string
string t = string.IsNullOrWhiteSpace(s) ? "Hello" : s; // Use "Hello" as default value if s is null, empty, or whitespace
Console.WriteLine(t); // Hello
```

Note that the null-coalescing operator does not check for empty or whitespace strings, so it will return them as they are:

```csharp
string s = ""; // Declare an empty string
string t = s ?? "Hello"; // Use "Hello" as default value if s is null
Console.WriteLine(t); // (empty string)
```

Therefore, we need to use the appropriate methods to handle different scenarios for strings.

## Chaining Null-Coalescing Operators

One of the powerful features of the null-coalescing operator is that it can be chained with multiple operands. This allows us to handle various potential null values concisely.

The syntax of chaining null-coalescing operators is as follows:

```csharp
expression1 ?? expression2 ?? expression3 ?? ... ?? expressionN
```

The behavior of chaining null-coalescing operators is as follows:

- If `expression1` is not null, it is returned as the result of the operation.
- If `expression1` is null, `expression2` is evaluated and returned if it is not null.
- If `expression2` is also null, `expression3` is evaluated and returned if it is not null.
- And so on, until a non-null value is found or all expressions are evaluated.
- If all expressions are null, the last expression (`expressionN`) is returned as the result of the operation.

The chaining of null-coalescing operators can be seen as a series of nested null-coalescing operations. For example:

```csharp
expression1 ?? expression2 ?? expression3 ?? expression4
```

It is equivalent to:

```csharp
(expression1 ?? (expression2 ?? (expression3 ?? expression4)))
```

Let's look at some examples of chaining null-coalescing operators.

### Nested Null-Coalescing Operations

Suppose we have a class that represents a product:

```csharp
class Product
{
    public string Name { get; set; }
    public decimal? Price { get; set; }
}
```

Now, suppose we have a method that takes a product object as an argument and prints its name and price:

```csharp
void PrintProduct(Product product)
{
    Console.WriteLine($"Name: {product.Name}, Price: {product.Price}");
}
```

What happens if we pass a null value to this method? We will get a `NullReferenceException` because we are trying to access the properties of a null reference:

```csharp
Product product = null;
PrintProduct(product); // NullReferenceException
```

We need to check for null values before accessing properties to avoid this exception. We can use the null-coalescing operator to provide default values for properties that might be null. However, we also need to consider the possibility that the product object itself might be null. In that case, we also need to provide a default value for the product object.

We can use chaining null-coalescing operators to handle both scenarios concisely:

```csharp
void PrintProduct(Product product)
{
    Product defaultProduct = new Product { Name = "Unknown", Price = 0 }; // Create a default product object
    string name = (product ?? defaultProduct).Name; // Use the default product name if product is null
    decimal price = (product ?? defaultProduct).Price ?? 0; // Use the default product price if product or product.Price is null
    Console.WriteLine($"Name: {name}, Price: {price}");
}
```

The code above uses nested null-coalescing operations to handle multiple potential null values. The parentheses are used to group the expressions and ensure the correct order of evaluation.

If we pass a null value to the method, we will get the following output:

```csharp
Product product = null;
PrintProduct(product); // Name: Unknown, Price: 0
```

If we pass a non-null value with non-null properties, we will get the expected output:

```csharp
Product product = new Product { Name = "Apple", Price = 1.99m };
PrintProduct(product); // Name: Apple, Price: 1.99
```

If we pass a non-null value with a null property, we will get the default value for that property:

```csharp
Product product = new Product { Name = "Orange", Price = null };
PrintProduct(product); // Name: Orange, Price: 0
```

As you can see, chaining null-coalescing operators allows us to handle multiple potential null values concisely. However, it can also make the code less readable and harder to understand, especially when many operands are involved. Therefore, we should use this feature with caution and moderation.

### Chaining with Default Values

We can also chain null-coalescing operators with default values to provide a fallback value for an expression that might be null. For example:

```csharp
string s = null; // Declare a string with null value
string t = s ?? "Hello" ?? "World"; // Use "Hello" as the default value if s is null, and "World" as the default value if "Hello" is null
Console.WriteLine(t); // Hello
```

In this example, the first null-coalescing operator (`??`) checks if `s` is null and returns "Hello" if it is. The second null-coalescing operator (`??`) checks if "Hello" is null and returns "World" if it is. Since "Hello" is not null, it is returned as the result of the operation.

This might seem redundant since we know that "Hello" is not null. However, this can be useful when we use variables or expressions that might be null instead of literal values. For example:

```csharp
string s = GetGreeting(); // Get a greeting from a function that might return null
string t = s ?? GetDefaultGreeting() ?? "Hello"; // Use the default greeting from another function if s is null, and "Hello" if both functions return null
Console.WriteLine(t); // Depends on the return values of the functions
```

In this example, the first null-coalescing operator (`??`) checks if `s` is null and returns the result of `GetDefaultGreeting()` if it is. The second null-coalescing operator (`??`) checks if the result of `GetDefaultGreeting()` is null and returns "Hello" if it is. This way, we can provide a fallback value for an expression that might be null.

## Null-Coalescing Operator vs. Conditional Statements

The null-coalescing operator can be seen as a shorthand for writing conditional statements (if-else) for handling null values. For example:

```csharp
expression1 ?? expression2
```

Is equivalent to:

```csharp
if (expression1 != null)
{
    expression1;
}
else
{
    expression2;
}
```

However, using the null-coalescing operator over conditional statements for handling null values has some advantages. Let's look at some of them.

### Code Brevity

The null-coalescing operator allows us to write less code than conditional statements for handling null values. This makes the code more concise and compact, improving readability and maintainability.

For example, compare the following two versions of code that handle a nullable int value:

```csharp
// Using conditional statements
int? x = GetNumber(); // Get a number from a function that might return null
int y;
if (x != null)
{
    y = x.Value; // Use x.Value to access the underlying value of x
}
else
{
    y = 10; // Use 10 as default value if x is null
}
Console.WriteLine(y);
```

```csharp
// Using null-coalescing operator
int? x = GetNumber(); // Get a number from a function that might return null
int y = x ?? 10; // Use 10 as default value if x is null
Console.WriteLine(y);
```

The second version of the code is much shorter and clearer than the first one. It also avoids using the `x.Value` property, which can throw an exception if `x` is null.

### Code Clarity

The null-coalescing operator makes the code clearer and more expressive than conditional statements for handling null values. It explicitly intends to provide a default value for a potentially null expression without using keywords or brackets.

For example, compare the following two versions of code that handle a string value:

```csharp
// Using conditional statements
string s = GetName(); // Get a name from a function that might return null
string t;
if (s == null)
{
    t = "Unknown"; // Use "Unknown" as default value if s is null
}
else
{
    t = s;
}
Console.WriteLine(t);
```

```csharp
// Using null-coalescing operator
string s = GetName(); // Get a name from a function that might return null
string t = s ?? "Unknown"; // Use "Unknown" as default value if s is null
Console.WriteLine(t);
```

The second version of the code is more expressive than the first one. It shows that we want to use `s` if it is not null; otherwise, use "Unknown". It also avoids repeating `s` in both branches of the conditional statement.

### Code Simplicity

The null-coalescing operator also simplifies the code by avoiding unnecessary keywords, brackets, and indentation. It also reduces the chances of making mistakes or typos in the code.

For example, compare the following two versions of code that handle a product object:

```csharp
// Using conditional statements
Product product = GetProduct(); // Get a product from a function that might return null
string name;
decimal price;
if (product == null)
{
    name = "Unknown"; // Use "Unknown" as default name if product is null
    price = 0; // Use 0 as default price if product is null
}
else
{
    name = product.Name ?? "Unknown"; // Use "Unknown" as default name if product.Name is null
    price = product.Price ?? 0; // Use 0 as default price if product.Price is null
}
Console.WriteLine($"Name: {name}, Price: {price}");
```

```csharp
// Using null-coalescing operator
Product product = GetProduct(); // Get a product from a function that might return null
string name = (product ?? new Product { Name = "Unknown", Price = 0 }).Name; // Use "Unknown" as the default name if product or product.Name is null
decimal price = (product ?? new Product { Name = "Unknown", Price = 0 }).Price ?? 0; // Use 0 as default price if product, product.Price, or new Product.Price is null
Console.WriteLine($"Name: {name}, Price: {price}");
```

The second version of the code is simpler and more elegant than the first one. It also avoids creating unnecessary variables and assigning values to them.

As you can see, the null-coalescing operator has many advantages over conditional statements for handling null values. However, it is only sometimes the best choice for some scenarios. In the next section, we will discuss some situations where conditional statements might be more appropriate than the null-coalescing operator.

### Situations Where Conditional Statements Might Be Better

Although the null-coalescing operator is a helpful tool for handling null values, there are some cases where using conditional statements might be better. Here are some examples:

- When you need to perform some actions or logic based on whether an expression is null or not rather than just providing a default value. For example, you might want to log an error message or throw an exception if an expression is null.
- When you need to use different types of operands that are not compatible or implicitly convertible to each other. For example, you cannot use the null-coalescing operator with a `bool` and a `string` because they are not compatible types.
- When using multiple conditions or expressions unrelated to null values. For example, check for other values or ranges besides null.
- When you need to improve the readability and clarity of your code. Sometimes, using conditional statements can make your code more explicit and understandable, especially when many operands or complex expressions are involved.

In these situations, conditional statements might be more appropriate than the null-coalescing operator. It would be best to always consider your code's context and purpose before choosing which technique to use.

## Conclusion

This blog post taught us about the null-coalescing operators in C#. We have covered the following topics:

- Understanding the basics of the null-coalescing operator
- Syntax and usage of the null-coalescing operator
- Chaining null-coalescing operators
- Null-coalescing operator vs. conditional statements
- Combining with default values
- Null-coalescing operator with function calls
- Handling nullable booleans
- Best practices and considerations

We have seen how the null-coalescing operators can help us handle null values concisely and elegantly. They can also improve the simplicity and robustness of our code. However, we should also be aware of their limitations and drawbacks and use them wisely and moderately.

This blog post has given you some understanding of the null-coalescing operators in C#. I encourage you to apply your newfound knowledge in your C# projects to write more robust and concise code.

Happy coding! 😊

## References

- [?? and ??= operators - the null-coalescing operators](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/null-coalescing-operator)
- [Null-Coalescing Operator in C#](https://www.geeksforgeeks.org/null-coalescing-operator-in-c-sharp/)
- [Null Coalescing Operator (??) in C#](https://thedotnetguide.com/csharp-null-coalescing-operator/)
- [Null Coalescing Operator in C#: Full Guide](https://www.bytehide.com/blog/null-coalescing-operator-csharp)
- [Null-Conditional Operators in C#](https://code-maze.com/csharp-null-conditional-operators/)
- [Using the Conditional and Null-coalescing Operators](https://www.pluralsight.com/guides/using-conditional-and-null-coalescing-operators)
