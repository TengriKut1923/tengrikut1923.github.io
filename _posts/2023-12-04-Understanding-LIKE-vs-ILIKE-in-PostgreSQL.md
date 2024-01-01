---
layout: post
title: "Understanding LIKE vs ILIKE in PostgreSQL"
categories:
- programming
tags:
- PostgreSQL
- SQL
- Operators
- Comparison
- Pattern Matching
- Wildcard
- Regular Expression
- Case Sensitive
- Case Insensitive
- Array
- LIKE operator
- ILIKE operator
---

PostgreSQL is a popular open-source relational database management system that supports various types of data manipulation and querying. One of the common tasks in PostgreSQL is to perform pattern matching, which is the process of finding strings that match a certain pattern. Pattern matching can be useful for filtering, searching, validating, or transforming data.

PostgreSQL provides three different ways to perform pattern matching: the LIKE operator, the ILIKE operator, and the regular expression operator (~). In this article, we will focus on the differences between the LIKE and ILIKE operators, and how to use them effectively.

## What is the LIKE operator?

The LIKE operator is a standard SQL operator that allows you to match a string value against a simple pattern. The pattern can contain two special characters: the underscore (_) and the percent sign (%). The underscore matches any single character, while the percent sign matches any sequence of zero or more characters. For example, the pattern 'a%' matches any string that starts with 'a', while the pattern '_b_' matches any string that has 'b' as the second character.

The syntax of the LIKE operator is as follows:

```sql
string LIKE pattern [ ESCAPE escape-character ]
```

The string is the value to be matched, and the pattern is the pattern to match against. Optionally, you can specify an escape character that allows you to use the underscore and the percent sign as literal characters in the pattern. The default escape character is the backslash (\), but you can choose a different one by using the ESCAPE clause. For example, the pattern 'a\%b' matches the string 'a%b', while the pattern 'a\\b' matches the string 'a\b'.

The LIKE operator returns true if the string matches the pattern, and false otherwise. Here are some examples of using the LIKE operator:

```sql
-- Find all products whose name starts with 'Pen'
SELECT * FROM products WHERE name LIKE 'Pen%';

-- Find all customers whose email contains 'gmail'
SELECT * FROM customers WHERE email LIKE '%gmail%';

-- Find all books whose title ends with a digit
SELECT * FROM books WHERE title LIKE '%[0-9]';
```

Note that the LIKE operator is case sensitive, meaning that it distinguishes between uppercase and lowercase letters. For example, the pattern 'A%' does not match the string 'apple', but it does match the string 'Apple'.

## What is the ILIKE operator?

The ILIKE operator is a PostgreSQL extension that works exactly like the LIKE operator, except that it is case insensitive. This means that it does not matter whether the string and the pattern have the same case or not. For example, the pattern 'A%' matches both 'apple' and 'Apple' when using the ILIKE operator.

The syntax of the ILIKE operator is the same as the LIKE operator:

```sql
string ILIKE pattern [ ESCAPE escape-character ]
```

The string is the value to be matched, and the pattern is the pattern to match against. Optionally, you can specify an escape character that allows you to use the underscore and the percent sign as literal characters in the pattern. The default escape character is the backslash (\), but you can choose a different one by using the ESCAPE clause.

The ILIKE operator returns true if the string matches the pattern, and false otherwise. Here are some examples of using the ILIKE operator:

```sql
-- Find all products whose name starts with 'pen' (case insensitive)
SELECT * FROM products WHERE name ILIKE 'pen%';

-- Find all customers whose email contains 'GMAIL' (case insensitive)
SELECT * FROM customers WHERE email ILIKE '%gmail%';

-- Find all books whose title ends with a digit (case insensitive)
SELECT * FROM books WHERE title ILIKE '%[0-9]';
```

Note that the ILIKE operator is not a standard SQL operator, and it may not be supported by other database systems. If you want to write portable SQL code, you should use the LIKE operator and convert the string and the pattern to the same case using the UPPER or LOWER functions. For example, the following query is equivalent to using the ILIKE operator:

```sql
-- Find all products whose name starts with 'pen' (case insensitive)
SELECT * FROM products WHERE UPPER(name) LIKE UPPER('pen%');
```

## When to use LIKE vs ILIKE?

The choice between the LIKE and ILIKE operators depends on your use case and preference. Generally, you should use the LIKE operator if you want to perform a case sensitive pattern matching, and the ILIKE operator if you want to perform a case insensitive pattern matching. However, there are some factors to consider before making the decision:

- **Performance**: The ILIKE operator may be slower than the LIKE operator, because it has to perform an extra case conversion step before comparing the string and the pattern. If you have a large amount of data to match, or if you need to optimize the query speed, you may want to use the LIKE operator and avoid the ILIKE operator.
- **Portability**: The ILIKE operator is a PostgreSQL specific extension, and it may not work in other database systems. If you want to write SQL code that can run on different platforms, you may want to use the LIKE operator and apply the UPPER or LOWER functions to the string and the pattern. This way, you can achieve the same result as the ILIKE operator, but with a standard SQL syntax.
- **Consistency**: The ILIKE operator may produce different results depending on the locale settings of the database. The locale determines how the case conversion is performed, and it may vary from system to system. For example, in some languages, there are characters that have different uppercase and lowercase forms, such as 'ß' and 'SS' in German. If you use the ILIKE operator, you may get different matches depending on the locale. If you want to ensure consistent results, you may want to use the LIKE operator and specify the exact case of the string and the pattern.

## Conclusion

In this article, we have learned about the differences between the LIKE and ILIKE operators in PostgreSQL, and how to use them for pattern matching. We have seen that the LIKE operator is a standard SQL operator that performs a case sensitive pattern matching, while the ILIKE operator is a PostgreSQL extension that performs a case insensitive pattern matching. We have also discussed some factors to consider when choosing between the LIKE and ILIKE operators, such as performance, portability, and consistency.

Thank you for reading.
