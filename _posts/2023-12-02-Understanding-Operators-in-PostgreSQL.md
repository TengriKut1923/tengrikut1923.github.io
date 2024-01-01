---
layout: post
title: "Understanding Operators in PostgreSQL"
categories:
- programming
tags:
- PostgreSQL
- SQL
- Operators
- Comparison
- Arithmetic
- Logical
- Pattern Matching
- Wildcard
- Regular Expression
- Case Sensitive
- Case Insensitive
- Array
- Range
- JSON
- XML
- Geometric
- Network
- Intersection
- Containment
- Overlap
- Concatenation
- Indexing
- Data Type
---

PostgreSQL is a powerful and popular relational database management system that supports a large number of data types, functions, and operators. Operators are special symbols or keywords that perform some operation on one or more operands and produce a result. For example, the operator `+` performs addition on two numeric operands and returns their sum.

Operators are often used in the `WHERE` clause of SQL statements to specify conditions for filtering data. For example, the following query returns all the records from the `cars` table where the `brand` column is equal to `'Volvo'`:

```sql
SELECT * FROM cars WHERE brand = 'Volvo';
```

The operator `=` is used to check for equality between two values. PostgreSQL supports many other operators for different purposes, such as comparison, arithmetic, logical, pattern matching, and more. In this article, we will explore some of the most common and useful operators in PostgreSQL and how to use them.

## Comparison Operators

Comparison operators are used to compare two values and return a boolean value (`true`, `false`, or `null`) as the result. Comparison operators can be used with any data type that supports ordering, such as numbers, strings, dates, and enums. The following table lists the comparison operators in PostgreSQL:


| Operator | Description | Example |
| :---: | :---: | :---: |
| `=` | Equal to | `brand = 'Volvo'` |
| `<>` or `!=` | Not equal to | `brand <> 'Volvo'` |
| `<` | Less than | `model < 1975` |
| `>` | Greater than | `model > 1975` |
| `<=` | Less than or equal to | `model <= 1975` |
| `>=` | Greater than or equal to | `model >= 1975` |


Note that the comparison operators are case sensitive, meaning that `'Volvo'` and `'volvo'` are not considered equal. To perform case insensitive comparison, you can use the `ILIKE` operator, which we will discuss later.

## Arithmetic Operators

Arithmetic operators are used to perform mathematical operations on numeric operands and return a numeric result. Arithmetic operators can be used with any data type that supports arithmetic, such as integers, floats, decimals, and intervals. The following table lists the arithmetic operators in PostgreSQL:


| Operator | Description | Example |
| :---: | :---: | :---: |
| `+` | Addition | `price + 1000` |
| `-` | Subtraction | `price - 1000` |
| `*` | Multiplication | `price * 1.1` |
| `/` | Division | `price / 2` |
| `%` | Modulo (remainder) | `price % 100` |
| `^` | Exponentiation | `price ^ 2` |


Note that the arithmetic operators follow the standard order of precedence, meaning that exponentiation is performed first, followed by multiplication, division, and modulo, and then addition and subtraction. You can use parentheses to change the order of evaluation, such as `(price + 1000) / 2`.

## Logical Operators

Logical operators are used to combine two or more boolean values and return a boolean result. Logical operators can be used with any data type that can be cast to boolean, such as numbers, strings, and nulls. The following table lists the logical operators in PostgreSQL:

| Operator | Description | Example |
| :---: | :---: | :---: |
| `AND` | Logical AND (returns true if both operands are true) | `brand = 'Volvo' AND model > 1975` |
| `OR` | Logical OR (returns true if either operand is true) | `brand = 'Volvo' OR brand = 'BMW'` |
| `NOT` | Logical NOT (returns the opposite of the operand) | `NOT (brand = 'Volvo')` |

Note that the logical operators follow the standard order of precedence, meaning that `NOT` is performed first, followed by `AND`, and then `OR`. You can use parentheses to change the order of evaluation, such as `(brand = 'Volvo' OR brand = 'BMW') AND model > 1975`.

## Pattern Matching Operators

Pattern matching operators are used to check if a value matches a certain pattern, such as a substring, a regular expression, or a wildcard. Pattern matching operators are mainly used with string data types, such as text, varchar, and char. The following table lists the pattern matching operators in PostgreSQL:

| Operator | Description | Example |
| :---: | :---: | :---: |
| `LIKE` | Matches a value with a pattern using the `%` and `_` wildcards (case sensitive) | `brand LIKE 'V%'` |
| `ILIKE` | Matches a value with a pattern using the `%` and `_` wildcards (case insensitive) | `brand ILIKE 'v%'` |
| `SIMILAR TO` | Matches a value with a pattern using the SQL standard regular expression syntax (case sensitive) | `brand SIMILAR TO 'V[A-Z]%'` |
| `~` | Matches a value with a pattern using the POSIX regular expression syntax (case sensitive) | `brand ~ '^V[A-Z]'` |
| `~*` | Matches a value with a pattern using the POSIX regular expression syntax (case insensitive) | `brand ~* '^v[a-z]'` |

The `%` wildcard matches any sequence of zero or more characters, while the `_` wildcard matches any single character. For example, the pattern `'V%'` matches any value that starts with a capital `'V'`, such as `'Volvo'`, `'Volkswagen'`, and `'Viper'`. The pattern `'V_o%'` matches any value that starts with a capital `'V'`, followed by any character, followed by a lowercase `'o'`, such as `'Volvo'` and `'Voodoo'`.

The `SIMILAR TO` operator uses the SQL standard regular expression syntax, which is similar to the POSIX syntax, but with some differences. For example, the pattern `'V[A-Z]%'` matches any value that starts with a capital `'V'`, followed by any capital letter, followed by any sequence of characters, such as `'Volvo'` and `'VW'`. The pattern `'V_[A-Z]%'` matches any value that starts with a capital `'V'`, followed by any character, followed by a capital letter, followed by any sequence of characters, such as `'V8'` and `'VX4'`.

The `~` and `~*` operators use the POSIX regular expression syntax, which is more powerful and flexible than the SQL standard syntax. For example, the pattern `'^V[A-Z]'` matches any value that starts with a capital `'V'`, followed by any capital letter, such as `'Volvo'` and `'VW'`. The pattern `'^V.[A-Z]'` matches any value that starts with a capital `'V'`, followed by any character, followed by a capital letter, such as `'V8'` and `'VX4'`. The `^` symbol matches the beginning of the value, while the `.` symbol matches any single character.

Note that the pattern matching operators are case sensitive, except for `ILIKE` and `~*`, which are case insensitive. To perform case insensitive matching with the other operators, you can use the `LOWER` or `UPPER` functions to convert the values to lower or upper case before comparing them. For example, `LOWER(brand) LIKE 'v%'`.

## Other Operators

PostgreSQL also supports many other operators for specific data types, such as arrays, ranges, JSON, XML, geometric, network, and more. These operators provide various functionalities, such as indexing, concatenation, containment, overlap, intersection, and more. For example, the following query returns all the records from the `cars` table where the `features` column, which is an array of text, contains the value `'sunroof'`:

```sql
SELECT * FROM cars WHERE 'sunroof' = ANY (features);
```

The `ANY` operator checks if the value `'sunroof'` is equal to any element of the array `features`. Similarly, the following query returns all the records from the `cars` table where the `price` column, which is a range of numeric values, overlaps with the range `[10000, 20000]`:

```sql
SELECT * FROM cars WHERE price && NUMRANGE(10000, 20000);
```

The `&&` operator checks if the range `price` overlaps with the range `NUMRANGE(10000, 20000)`, meaning that they have at least one value in common.

## Conclusion

In this article, we have learned about some of the most common and useful operators in PostgreSQL and how to use them. Operators are essential tools for performing various operations on data and specifying conditions for filtering data. PostgreSQL supports a large number of operators for different data types, functions, and purposes. By understanding and using the operators in PostgreSQL, you can write more powerful and efficient SQL queries and manipulate data more easily.
