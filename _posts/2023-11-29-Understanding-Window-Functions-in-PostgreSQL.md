---
layout: post
title: "Understanding Window Functions in PostgreSQL"
categories:
- programming
tags:
- PostgreSQL
- Database
- SQL
- Date Manipulation
- Window Functions
- Functions
- Database Design
- Open Source
- Data Formatting
---

Window functions are a special type of functions that allow you to perform calculations over a group of rows, called a window, that are related to the current row. Window functions are very useful for solving complex analytical problems, such as:

- Calculating moving averages, sums, or other aggregates over a sliding window.
- Assigning ranks or percentiles to each row within a partition or a result set.
- Retrieving the first or last value in a group.
- Comparing values between the current row and the previous or next row.

In this article, we will learn how to use window functions in PostgreSQL, what are the different types of window functions, and how to write window function queries with examples.

## Window Function Syntax

A window function call consists of two parts: the window function name and argument(s), and the OVER clause. The OVER clause defines the window that the window function operates on. The syntax of a window function call is:

```sql
window_function(arg1, arg2, ...) OVER (window_definition)
```

The window_definition can have the following components:

- PARTITION BY: This clause divides the rows into groups, or partitions, that have the same values of the PARTITION BY expression(s). The window function is computed for each row within its partition.
- ORDER BY: This clause specifies the order in which the rows are processed by the window function. The window ORDER BY does not affect the order of the output rows, unless the query also has an ORDER BY clause at the end. Some window functions, such as row_number and lead, require an ORDER BY clause to work correctly.
- frame_clause: This clause defines the subset of rows within the partition that the window function uses for the calculation. It can be one of the following forms:

    - ROWS BETWEEN start AND end
    - RANGE BETWEEN start AND end
    - GROUPS BETWEEN start AND end

    The start and end can be one of the following:

    - UNBOUNDED PRECEDING: The first row of the partition.
    - UNBOUNDED FOLLOWING: The last row of the partition.
    - CURRENT ROW: The current row.
    - expression PRECEDING: A row that is expression rows before the current row.
    - expression FOLLOWING: A row that is expression rows after the current row.

    The default frame_clause is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which means that the window function considers all the rows from the start of the partition up to the current row.

## Types of Window Functions

PostgreSQL supports various types of window functions, such as:

- Aggregate functions: These are the same functions as the regular aggregates, such as sum, count, min, max, avg, etc. However, when used as window functions, they do not group the rows into a single output row, but return a value for each row in the window.
- Ranking functions: These are functions that assign a rank or a position to each row in the window, such as rank, dense_rank, row_number, percent_rank, cume_dist, ntile, etc.
- Value functions: These are functions that return a value from a row that is at a certain offset from the current row, such as lead, lag, first_value, last_value, nth_value, etc.

## Window Function Examples

Let's look at some examples of window function queries using the following sample table of employees and their salaries:


| empid | empname | deptid | salary |
|-------|---------|--------|--------|
| 1     | Alice   | 10     | 5000   |
| 2     | Bob     | 20     | 6000   |
| 3     | Charlie | 10     | 7000   |
| 4     | David   | 30     | 8000   |
| 5     | Eve     | 20     | 9000   |
| 6     | Frank   | 30     | 10000  |


- To calculate the total salary of each department and compare it with the salary of each employee, you can use the sum window function with a PARTITION BY clause:

```sql
SELECT empname, deptid, salary, sum(salary) OVER (PARTITION BY deptid) AS dept_total
FROM employees;
```


| empname | deptid | salary | dept_total |
|---------|--------|--------|------------|
| Alice   | 10     | 5000   | 12000      |
| Charlie | 10     | 7000   | 12000      |
| Bob     | 20     | 6000   | 15000      |
| Eve     | 20     | 9000   | 15000      |
| David   | 30     | 8000   | 18000      |
| Frank   | 30     | 10000  | 18000      |


- To assign a rank to each employee within their department based on their salary in ascending order, you can use the rank window function with a PARTITION BY and an ORDER BY clause:

```sql
SELECT empname, deptid, salary, rank() OVER (PARTITION BY deptid ORDER BY salary) AS dept_rank
FROM employees;
```


| empname | deptid | salary | dept_rank |
|---------|--------|--------|-----------|
| Alice   | 10     | 5000   | 1         |
| Charlie | 10     | 7000   | 2         |
| Bob     | 20     | 6000   | 1         |
| Eve     | 20     | 9000   | 2         |
| David   | 30     | 8000   | 1         |
| Frank   | 30     | 10000  | 2         |


- To find the difference between the salary of each employee and the average salary of their department, you can use the avg window function with a PARTITION BY clause and a simple arithmetic expression:

```sql
SELECT empname, deptid, salary, salary - avg(salary) OVER (PARTITION BY deptid) AS diff_from_avg
FROM employees;
```


| empname | deptid | salary | diff_from_avg |
|---------|--------|--------|---------------|
| Alice   | 10     | 5000   | -1000         |
| Charlie | 10     | 7000   | 1000          |
| Bob     | 20     | 6000   | -1500         |
| Eve     | 20     | 9000   | 1500          |
| David   | 30     | 8000   | -1000         |
| Frank   | 30     | 10000  | 1000          |


- To calculate the moving average of the salary of each employee over the previous two rows, you can use the avg window function with an ORDER BY clause and a frame_clause that specifies the range of rows:

```sql
SELECT empname, salary, avg(salary) OVER (ORDER BY salary ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
FROM employees;
```


| empname | salary | moving_avg |
|---------|--------|------------|
| Alice   | 5000   | 5000       |
| Bob     | 6000   | 5500       |
| Charlie | 7000   | 6000       |
| David   | 8000   | 7000       |
| Eve     | 9000   | 8000       |
| Frank   | 10000  | 9000       |


## Conclusion

Window functions are a powerful feature of PostgreSQL that allow you to perform calculations over a group of rows that are related to the current row. They can be used for various analytical purposes, such as computing running totals, ranking rows, finding the first or last value in a group, or comparing values between the current row and the previous or next row.

To use window functions, you need to specify an OVER clause that defines the window that the window function operates on. The OVER clause can contain a PARTITION BY clause, an ORDER BY clause, and a frame_clause that specify the window definition.

PostgreSQL supports various types of window functions, such as aggregate functions, ranking functions, and value functions. You can use them to perform complex queries that would otherwise require multiple subqueries or joins.

Thank you for reading.
