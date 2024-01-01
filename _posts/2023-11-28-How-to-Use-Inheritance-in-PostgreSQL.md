---
layout: post
title: "How to Use Inheritance in PostgreSQL"
categories:
- programming
tags:
- PostgreSQL
- Database
- SQL
- Date Manipulation
- Inheritance
- Database Design
- Open Source
- Data Formatting
---

PostgreSQL is a powerful and versatile database system that supports many advanced features, such as inheritance. Inheritance is a concept that allows us to create tables that share some or all of the attributes of another table, called the parent table. In this article, we will learn how to use inheritance in PostgreSQL to model hierarchical data, such as products and categories. We will also discuss some of the advantages and disadvantages of using inheritance, and how to query inherited tables.

## What is inheritance?

Inheritance is a way of organizing data into a hierarchy, where some tables are derived from other tables. A table that inherits from another table is called a child table, and the table that it inherits from is called a parent table. A child table can inherit from one or more parent tables, and a parent table can have zero or more child tables. A table that does not inherit from any other table is called a base table.

In PostgreSQL, we can use the INHERITS clause to create a table that inherits from another table. For example, suppose we want to create a data model for products and categories. We can define a base table called products, that has the following columns:

- id: a unique identifier for each product
- name: the name of the product
- price: the price of the product
- description: a brief description of the product

We can then create child tables that inherit from the products table, such as books, electronics, and clothing. Each child table can have additional columns that are specific to that category, such as:

- books: author, publisher, isbn
- electronics: brand, model, warranty
- clothing: size, color, material

The syntax for creating a child table that inherits from a parent table is:

```sql
CREATE TABLE child_table (
  -- additional columns
) INHERITS (parent_table);
```

For example, we can create the books table as follows:

```sql
CREATE TABLE books (
  author text,
  publisher text,
  isbn text
) INHERITS (products);
```

This means that the books table inherits all the columns of the products table, plus the three additional columns that are specific to books. Similarly, we can create the electronics and clothing tables that inherit from the products table.

## How to query inherited tables?

When we query an inherited table, we can use the ONLY keyword to specify whether we want to include or exclude the rows from the descendant tables. For example, the following query finds the names and prices of all products, including books, electronics, and clothing:

```sql
SELECT name, price
FROM products;
```

This returns:


| name | price |
|-------|:-------|
| Harry Potter | 9.99 |
| iPhone 12 | 999.99 |
| T-shirt | 19.99 |


On the other hand, the following query finds the names and prices of only the products that are not books, electronics, or clothing:

```sql
SELECT name, price
FROM ONLY products;
```

This returns nothing, since the products table does not have any rows of its own. The ONLY keyword indicates that the query should apply only to products, and not any tables below products in the inheritance hierarchy. Many of the commands that we have already discussed — SELECT, UPDATE and DELETE — support the ONLY keyword.

We can also use the * notation to explicitly include the descendant tables in the query. For example, the following query is equivalent to the first one:

```sql
SELECT name, price
FROM products*;
```

Writing * is not necessary, since this behavior is always the default. However, this syntax is still supported for compatibility with older releases where the default could be changed.

## What are the advantages of inheritance?

Inheritance can offer some benefits over other ways of modeling hierarchical data, such as:

- It can reduce data duplication and improve data consistency. For example, if we update the price of a product in the products table, it will automatically reflect in the books, electronics, and clothing tables as well, since they share the same row.
- It can simplify queries and improve performance. For example, if we want to find the average price of all products, we can simply query the products table, instead of joining multiple tables. Also, PostgreSQL can optimize queries that use inheritance by skipping unnecessary tables in the hierarchy.
- It can facilitate data partitioning and scalability. For example, we can distribute the rows of an inherited table across different physical storage devices or servers, based on some criteria, such as the category column. This can improve the performance and availability of the data.

## What are the disadvantages of inheritance?

Inheritance also has some drawbacks and caveats that we need to be aware of, such as:

- It does not support foreign key constraints or unique constraints across the inheritance hierarchy. For example, we cannot enforce that the id column of the products table is unique across all the descendant tables, or that the isbn column of the books table references the isbn table. We can only define these constraints within each table separately, which can lead to data inconsistency or integrity violations.
- It does not support polymorphism or dynamic dispatch. For example, we cannot define a function or a trigger that applies to all the tables in the inheritance hierarchy, or that behaves differently depending on the table type. We can only define these features within each table separately, which can lead to code duplication or maintenance issues.

## Summary

Inheritance is a powerful feature of PostgreSQL that allows us to create tables that share some or all of the attributes of another table. It can be useful for modeling hierarchical data, such as products and categories. However, it also has some limitations and caveats that we need to consider before using it. In this article, we have learned how to use inheritance in PostgreSQL and what are some of the advantages and disadvantages of using it.

Thank you for reading.
