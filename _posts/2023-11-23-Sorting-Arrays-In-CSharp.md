---
layout: post
title: "Sorting arrays in C#"
categories:
- programming
tags:
- C# array sort
- Array
- Sorting
- Sort
- LINQ
- How to sort an array in C#
- Array.Sort() method in C#
- LINQ queries for sorting arrays in C#
- C# sorting examples
- C# programming tips
---

Arrays are one of the most basic data structures in C#, and sorting them is a frequent task for programmers. Sorting an array means rearranging its elements in a certain order, such as ascending or descending, numerical or alphabetical, etc. Sorting an array can make it easier to find, compare, or manipulate its elements.

There are two main ways to sort an array in C#: using the Array.Sort() method and using LINQ queries.

## Using the Array.Sort() method

The Array.Sort() method is a static helper method that belongs to the Array class. It takes a one-dimensional array as an input and sorts its elements in the ascending order by default. The Array.Sort() method can also take optional parameters, such as a comparison delegate, an index, a length, or a custom comparer object, to specify how the array should be sorted.

The following code snippet shows how to use the Array.Sort() method to sort an array of doubles and an array of characters in the ascending order:

```csharp
// Sort an array of doubles
double[] dblArray = new double[] { 3.14, 2.71, 1.41, 1.61, 0.57 };
Array.Sort(dblArray); // Sorts the array in ascending order
foreach (double d in dblArray)
{
    Console.Write(d + " "); // Prints 0.57 1.41 1.61 2.71 3.14
}

// Sort an array of characters
char[] charArray = new char[] { 'Z', 'A', 'C', 'B', 'Y' };
Array.Sort(charArray); // Sorts the array in ascending order
foreach (char c in charArray)
{
    Console.Write(c + " "); // Prints A B C Y Z
}
```

To sort an array in the descending order, we can use the Array.Reverse() method after sorting it in the ascending order. The Array.Reverse() method takes an array as an input and reverses the order of its elements.

The following code snippet shows how to use the Array.Reverse() method to sort an array of doubles and an array of characters in the descending order:

```csharp
// Sort an array of doubles
double[] dblArray = new double[] { 3.14, 2.71, 1.41, 1.61, 0.57 };
Array.Sort(dblArray); // Sorts the array in ascending order
Array.Reverse(dblArray); // Reverses the order of the array
foreach (double d in dblArray)
{
    Console.Write(d + " "); // Prints 3.14 2.71 1.61 1.41 0.57
}

// Sort an array of characters
char[] charArray = new char[] { 'Z', 'A', 'C', 'B', 'Y' };
Array.Sort(charArray); // Sorts the array in ascending order
Array.Reverse(charArray); // Reverses the order of the array
foreach (char c in charArray)
{
    Console.Write(c + " "); // Prints Z Y C B A
}
```

## Using LINQ queries

LINQ stands for Language Integrated Query, and it is a feature of C# that allows us to query different types of data sources, such as arrays, collections, databases, XML, etc. LINQ queries can be written using two syntaxes: query syntax and method syntax. Both syntaxes use a set of standard query operators that can perform various operations on the data source, such as filtering, ordering, grouping, joining, etc.

The following code snippet shows how to use LINQ query syntax to sort an array of doubles and an array of characters in the ascending order:

```csharp
// Sort an array of doubles
double[] dblArray = new double[] { 3.14, 2.71, 1.41, 1.61, 0.57 };
var sortedDblArray = from d in dblArray
                     orderby d ascending
                     select d;
foreach (double d in sortedDblArray)
{
    Console.Write(d + " "); // Prints 0.57 1.41 1.61 2.71 3.14
}

// Sort an array of characters
char[] charArray = new char[] { 'Z', 'A', 'C', 'B', 'Y' };
var sortedCharArray = from c in charArray
                      orderby c ascending
                      select c;
foreach (char c in sortedCharArray)
{
    Console.Write(c + " "); // Prints A B C Y Z
}
```

The following code snippet shows how to use LINQ method syntax to sort an array of doubles and an array of characters in the ascending order:

```csharp
// Sort an array of doubles
double[] dblArray = new double[] { 3.14, 2.71, 1.41, 1.61, 0.57 };
var sortedDblArray = dblArray.OrderBy(d => d);
foreach (double d in sortedDblArray)
{
    Console.Write(d + " "); // Prints 0.57 1.41 1.61 2.71 3.14
}

// Sort an array of characters
char[] charArray = new char[] { 'Z', 'A', 'C', 'B', 'Y' };
var sortedCharArray = charArray.OrderBy(c => c);
foreach (char c in sortedCharArray)
{
    Console.Write(c + " "); // Prints A B C Y Z
}
```

To sort an array in the descending order, we can use the descending keyword in the query syntax or the OrderByDescending() method in the method syntax.

The following code snippet shows how to use LINQ query syntax to sort an array of doubles and an array of characters in the descending order:

```csharp
// Sort an array of doubles
double[] dblArray = new double[] { 3.14, 2.71, 1.41, 1.61, 0.57 };
var sortedDblArray = from d in dblArray
                     orderby d descending
                     select d;
foreach (double d in sortedDblArray)
{
    Console.Write(d + " "); // Prints 3.14 2.71 1.61 1.41 0.57
}

// Sort an array of characters
char[] charArray = new char[] { 'Z', 'A', 'C', 'B', 'Y' };
var sortedCharArray = from c in charArray
                      orderby c descending
                      select c;
foreach (char c in sortedCharArray)
{
    Console.Write(c + " "); // Prints Z Y C B A
}
```

The following code snippet shows how to use LINQ method syntax to sort an array of doubles and an array of characters in the descending order:

```csharp
// Sort an array of doubles
double[] dblArray = new double[] { 3.14, 2.71, 1.41, 1.61, 0.57 };
var sortedDblArray = dblArray.OrderByDescending(d => d);
foreach (double d in sortedDblArray)
{
    Console.Write(d + " "); // Prints 3.14 2.71 1.61 1.41 0.57
}

// Sort an array of characters
char[] charArray = new char[] { 'Z', 'A', 'C', 'B', 'Y' };
var sortedCharArray = charArray.OrderByDescending(c => c);
foreach (char c in sortedCharArray)
{
    Console.Write(c + " "); // Prints Z Y C B A
}
```

## Conclusion

In this article, we have learned how to sort an array in C# using two different ways: the Array.Sort() method and the LINQ queries. We have seen how to sort an array in the ascending and descending orders.
