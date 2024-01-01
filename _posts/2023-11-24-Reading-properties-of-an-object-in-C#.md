---
layout: post
title: "Reading properties of an object in C#"
categories:
- programming
tags:
- C#
- Programming
- Reflection
- Dynamic
- Properties
- Object-oriented programming
- Runtime
- Compile-time
- .NET
- Visual Studio
- Software Development
- Coding
- Learning
- Tutorial
---

Properties are a way of exposing data fields of a class or an object to the outside world. They allow us to control the access and the validation of the data, as well as to implement logic when getting or setting the values. Properties are declared in the class block by specifying the access level of the field, followed by the type of the property, followed by the name of the property, and followed by a code block that declares a `get`-accessor and/or a `set`-accessor. For example:

```csharp
public class Person
{
    private string name;  // the name field
    public string Name    // the Name property
    {
        get
        {
            return name;
        }
        set
        {
            name = value;
        }
    }
}
```

In this example, the `Name` property exposes the `name` field of the `Person` class. The `get` accessor returns the value of the field, and the `set` accessor assigns a value to the field. The `value` keyword represents the value that the property is assigned.

Sometimes, we may want to read the properties of an object without knowing its actual type at compile time. For example, we may have a method that returns an object of any type, and we want to access a specific property of that object. In this case, we can use either reflection or dynamic keyword to achieve this.

## Reflection

Reflection is a feature of C# that allows us to inspect and manipulate the metadata of types and objects at run time. We can use reflection to get the type of an object, and then use the `GetProperty` and `GetValue` methods to get the property name and value of that object. For example:

```csharp
object item = AnyFunction(...); // returns an object of any type
System.Reflection.PropertyInfo pi = item.GetType().GetProperty("name"); // get the property info of "name"
string name = (string)(pi.GetValue(item, null)); // get the value of "name" as a string
```

In this example, we use the `GetType` method to get the type of the `item` object, and then use the `GetProperty` method to get the `PropertyInfo` object of the `name` property. Then, we use the `GetValue` method to get the value of the `name` property, and cast it to a string.

Reflection is a powerful feature, but it also has some drawbacks. It is relatively slow, as it involves a lot of run-time operations. It also requires us to know the exact name and type of the property we want to access, otherwise it may throw an exception or return null.

## Dynamic

Dynamic is a keyword in C# that allows us to bypass the static type checking of the compiler and resolve the type of an object at run time. We can use dynamic to declare a variable that can hold any type of object, and then use the dot notation to access its properties without any compile-time errors. For example:

```csharp
dynamic item = AnyFunction(...); // returns an object of any type
string name = item.name; // get the value of "name" as a string
```

In this example, we use the `dynamic` keyword to declare a variable that can hold any type of object, and then use the dot notation to access the `name` property of that object. The compiler does not check the existence or the type of the `name` property, and leaves it to the run time to resolve it.

Dynamic is a convenient feature, but it also has some drawbacks. It is less safe, as it may throw a run-time exception if the property does not exist or has a different type. It also relies on the Dynamic Language Runtime (DLR) to perform the run-time operations, which may have some performance overhead.

## Conclusion

In this article, we have learned how to read the properties of an object in C# without knowing its actual type at compile time. We have seen two ways of doing this: reflection and dynamic. Both have their advantages and disadvantages, and we should choose the one that suits our needs and scenarios.
