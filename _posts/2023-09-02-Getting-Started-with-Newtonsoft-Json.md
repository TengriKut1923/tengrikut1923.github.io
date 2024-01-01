---
layout: post
title: "Getting Started with Newtonsoft.Json"
categories:
- programming
tags:
- C#
- .NET
- Newtonsoft.Json
- JSON
---

JSON (JavaScript Object Notation) is a widely used format for exchanging and storing data in modern software development. It is lightweight, human-readable, and easy to parse by various programming languages. However, working with JSON data in C# can be challenging, especially for beginners who are not familiar with the syntax and structure of JSON.

Fortunately, there is a popular library that can make your life easier: `Newtonsoft.Json`. `Newtonsoft.Json` is a high-performance, flexible, and powerful library that allows you to handle JSON data in C# applications with ease. It provides features such as serialization, deserialization, validation, manipulation, and more.

In this blog post, I will provide you with a solid foundation for using `Newtonsoft.Json` in your projects. We will cover the following topics:

- Understanding JSON basics
- Setting up `Newtonsoft.Json`
- Serializing objects to JSON
- Deserializing JSON to objects
- Handling nested objects and arrays
- Dealing with null values and default values
- Error handling and exception management
- Practical scenarios and use cases

By the end of this guide, you will be able to confidently work with JSON data in your C# applications using `Newtonsoft.Json`.

## Understanding JSON Basics

Before we dive into `Newtonsoft.Json`, let's first understand what JSON is and how it works. JSON stands for JavaScript Object Notation, and it is a text-based format for representing structured data. It is derived from the JavaScript language, but it is independent of any programming language.

JSON data consists of two main components: objects and arrays. An object is a collection of key-value pairs, where each key is a string and each value can be any valid JSON data type. An array is an ordered list of values, where each value can be any valid JSON data type. A value can be one of the following types:

- A string enclosed in double quotes
- A number (integer or floating-point)
- A boolean (`true` or `false`)
- An object enclosed in curly braces
- An array enclosed in square brackets
- `null`

Here is an example of a JSON object that represents a person:

```json
{
  "name": "John Doe",
  "age": 25,
  "gender": "male",
  "hobbies": ["reading", "gaming", "coding"],
  "address": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "married": false,
  "children": null
}
```

As you can see, the object has six key-value pairs, where the values are of different types: string, number, boolean, array, object, and null. The object also has a nested object as the value of the `address` key, which contains four key-value pairs of its own.

JSON data can be easily converted to and from other data structures in various programming languages. For example, in C#, a JSON object can be mapped to a `Dictionary<string, object>` or a custom class, and a JSON array can be mapped to a `List<object>` or an array.

## Setting Up `Newtonsoft.Json`

To use `Newtonsoft.Json` in your C# project, you need to add it as a dependency using NuGet. NuGet is a package manager that helps you install and manage libraries and frameworks for your .NET applications.

There are two ways to add `Newtonsoft.Json` to your project using NuGet: via Visual Studio or via the .NET CLI.

### Via Visual Studio

If you are using Visual Studio as your IDE, you can follow these steps to add `Newtonsoft.Json` to your project:

1. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**.
2. In the **Browse** tab, search for **Newtonsoft.Json** and select it from the list.
3. Click on the **Install** button and accept the license agreement.
4. Wait for the installation to complete.

### Via the .NET CLI

If you are using the .NET CLI (Command Line Interface) as your toolchain, you can follow these steps to add `Newtonsoft.Json` to your project:

1. Open a terminal window and navigate to your project folder.
2. Run the following command: `dotnet add package Newtonsoft.Json`
3. Wait for the installation to complete.

After adding `Newtonsoft.Json` to your project, you need to reference it in your code using the appropriate using directive:

```csharp
using Newtonsoft.Json;
```

This will allow you to access the classes and methods provided by the library.

## Serializing Objects to JSON

One of the most common tasks when working with JSON data is serialization. Serialization is the process of converting C# objects into JSON format. This can be useful when you want to save your data to a file, send it over a network, or display it on a user interface.

`Newtonsoft.Json` provides a simple and convenient way to serialize C# objects into JSON using the `JsonConvert.SerializeObject()` method. This method takes an object as a parameter and returns a string containing the JSON representation of the object.

For example, suppose we have a class called `Person` that represents a person:

```csharp
public class Person
{
  public string Name { get; set; }
  public int Age { get; set; }
  public string Gender { get; set; }
  public List<string> Hobbies { get; set; }
  public Address Address { get; set; }
  public bool Married { get; set; }
  public object Children { get; set; }
}

public class Address
{
  public string Street { get; set; }
  public string City { get; set; }
  public string State { get; set; }
  public string Zip { get; set; }
}
```

And we have an instance of this class called `john`:

```csharp
Person john = new Person()
{
  Name = "John Doe",
  Age = 25,
  Gender = "male",
  Hobbies = new List<string>() { "reading", "gaming", "coding" },
  Address = new Address()
  {
    Street = "123 Main Street",
    City = "New York",
    State = "NY",
    Zip = "10001"
  },
  Married = false,
  Children = null
};
```

To serialize this object into JSON, we can simply call the `JsonConvert.SerializeObject()` method and pass the object as an argument:

```csharp
string json = JsonConvert.SerializeObject(john);
Console.WriteLine(json);
```

The output will be:

```json
{
  "Name": "John Doe",
  "Age": 25,
  "Gender": "male",
  "Hobbies": [
    "reading",
    "gaming",
    "coding"
  ],
  "Address": {
    "Street": "123 Main Street",
    "City": "New York",
    "State": "NY",
    "Zip": "10001"
  },
  "Married": false,
  "Children": null
}
```

As you can see, the method automatically converts the properties and values of the object into JSON key-value pairs, respecting the data types and nested structures. The result is a valid JSON string that can be used for various purposes.

## Deserializing JSON to Objects

The opposite of serialization is deserialization. Deserialization is the process of converting JSON data back into C# objects. This can be useful when you want to load your data from a file, receive it from a network, or parse it from a user input.

`Newtonsoft.Json` provides an easy and flexible way to deserialize JSON data into C# objects using the `JsonConvert.DeserializeObject()` method. This method takes a string containing the JSON data as a parameter and returns an object of the specified type.

For example, suppose we have the same `Person` class and `json` string as before. To deserialize the JSON string into a `Person` object, we can simply call the `JsonConvert.DeserializeObject()` method and pass the string and the type as arguments:

```csharp
Person john = JsonConvert.DeserializeObject<Person>(json);
Console.WriteLine(john.Name);
Console.WriteLine(john.Age);
Console.WriteLine(john.Gender);
Console.WriteLine(john.Hobbies[0]);
Console.WriteLine(john.Address.City);
Console.WriteLine(john.Married);
Console.WriteLine(john.Children);
```

The output will be:

```text
John Doe
25
male
reading
New York
False
null
```

As you can see, the method automatically converts the JSON key-value pairs into properties and values of the object, respecting the data types and nested structures. The result is a valid C# object that can be used for various purposes.

## Handling Nested Objects and Arrays

As we have seen in the previous examples, `Newtonsoft.Json` can handle nested objects and arrays within JSON data with ease. However, there are some scenarios where you may encounter some challenges or need some customization when dealing with nested data.

One scenario is when you have a JSON array that contains objects of different types. For example, suppose you have a JSON array that represents a list of animals:

```json
[
  {
    "type": "dog",
    "name": "Spot",
    "age": 3,
    "breed": "Labrador"
  },
  {
    "type": "cat",
    "name": "Fluffy",
    "age": 2,
    "color": "white"
  },
  {
    "type": "bird",
    "name": "Tweety",
    "age": 1,
    "species": "canary"
  }
]
```

As you can see, each object in the array has a different set of properties depending on its type. If you want to deserialize this array into a C# list of animals, you need to define an abstract base class called `Animal` and a derived class for each animal type, such as `Dog`, `Cat`, and `Bird`. Each derived class should have a property called `Type` that indicates the animal type, and other properties that correspond to the JSON data. For example:

```csharp
public abstract class Animal
{
  public string Type { get; set; }
  public string Name { get; set; }
  public int Age { get; set; }
}

public class Dog : Animal
{
  public string Breed { get; set; }
}

public class Cat : Animal
{
  public string Color { get; set; }
}

public class Bird : Animal
{
  public string Species { get; set; }
}
```

Then, you need to use a custom `JsonConverter` that can handle the polymorphic deserialization of the array. A `JsonConverter` is a class that can override the default behavior of `Newtonsoft.Json` and provide custom logic for serialization and deserialization. You can create a custom `JsonConverter` by inheriting from the `JsonConverter` base class and implementing the abstract methods: `CanConvert`, `ReadJson`, and `WriteJson`.

For example, here is a possible implementation of a custom `JsonConverter` for the animal array:

```csharp
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class AnimalConverter : JsonConverter
{
  // This method determines whether the converter can handle the given type
  public override bool CanConvert(Type objectType)
  {
    return objectType == typeof(Animal) || objectType.IsSubclassOf(typeof(Animal));
  }

  // This method reads the JSON data and converts it into an object of the specified type
  public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
  {
    // Read the JSON data as a JObject
    JObject jObject = JObject.Load(reader);

    // Get the value of the "type" property
    string type = jObject["type"].Value<string>();

    // Create an instance of the appropriate animal type based on the "type" value
    Animal animal = null;
    switch (type)
    {
      case "dog":
        animal = new Dog();
        break;
      case "cat":
        animal = new Cat();
        break;
      case "bird":
        animal = new Bird();
        break;
      default:
        throw new JsonException("Invalid animal type");
    }

    // Populate the properties of the animal instance using the serializer
    serializer.Populate(jObject.CreateReader(), animal);

    // Return the animal instance
    return animal;
  }

  // This method writes the object as JSON data
  public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
  {
    // Cast the value as an Animal instance
    Animal animal = value as Animal;

    // Write the start of the object
    writer.WriteStartObject();

    // Write the "type" property using the Type property of the animal instance
    writer.WritePropertyName("type");
    writer.WriteValue(animal.Type);

    // Write the other properties of the animal instance using reflection
    foreach (var prop in animal.GetType().GetProperties())
    {
      // Skip the Type property as it is already written
      if (prop.Name == "Type") continue;

      // Write the property name and value using the serializer
      writer.WritePropertyName(prop.Name);
      serializer.Serialize(writer, prop.GetValue(animal));
    }

    // Write the end of the object
    writer.WriteEndObject();
  }
}
```

To use this custom converter, you need to pass an instance of it to the `JsonConvert.DeserializeObject()` method as an additional parameter. For example:

```csharp
List<Animal> animals = JsonConvert.DeserializeObject<List<Animal>>(json, new AnimalConverter());
foreach (var animal in animals)
{
  Console.WriteLine(animal.Name + " is a " + animal.Type);
}
```

The output will be:

```text
Spot is a dog
Fluffy is a cat
Tweety is a bird
```

As you can see, this custom converter allows you to deserialize a JSON array that contains objects of different types into a C# list of animals.

Another scenario is when you want to customize how nested objects and arrays are serialized or deserialized. For example, suppose you want to omit some properties or change their names during serialization or deserialization. You can achieve this by using attributes provided by `Newtonsoft.Json`, such as `[JsonIgnore]`, `[JsonProperty]`, `[JsonArray]`, `[JsonObject]`, etc.

For example, suppose we have a class called `Book` that represents a book:

```csharp
public class Book
{
  public string Title { get; set; }
  public string Author { get; set; }
  public int Year { get; set; }
  public List<string> Genres { get; set; }
}
```

And we have an instance of this class called `book`:

```csharp
Book book = new Book()
{
  Title = "The Hitchhiker's Guide to the Galaxy",
  Author = "Douglas Adams",
  Year = 1979,
  Genres = new List<string>() { "Science fiction", "Comedy" }
};
```

To serialize this object into JSON, we can simply call the `JsonConvert.SerializeObject()` method and pass the object as an argument:

```csharp
string json = JsonConvert.SerializeObject(book, Formatting.Indented);
Console.WriteLine(json);
```

The output will be:

```json
{
  "Title": "The Hitchhiker's Guide to the Galaxy",
  "Author": "Douglas Adams",
  "Year": 1979,
  "Genres": [
    "Science fiction",
    "Comedy"
  ]
}
```

However, suppose we want to omit the `Year` property and change the name of the `Genres` property to `Categories` during serialization. We can achieve this by using the `[JsonIgnore]` and `[JsonProperty]` attributes on the properties of the `Book` class. For example:

```csharp
public class Book
{
  public string Title { get; set; }
  public string Author { get; set; }

  [JsonIgnore]
  public int Year { get; set; }

  [JsonProperty("Categories")]
  public List<string> Genres { get; set; }
}
```

Now, if we serialize the same `book` object, we will get a different output:

```json
{
  "Title": "The Hitchhiker's Guide to the Galaxy",
  "Author": "Douglas Adams",
  "Categories": [
    "Science fiction",
    "Comedy"
  ]
}
```

As you can see, the `Year` property is omitted and the `Genres` property is renamed to `Categories` in the JSON output.

Similarly, we can use attributes to customize how nested objects and arrays are deserialized. For example, suppose we have a JSON string that represents a person:

```json
{
  "name": "Alice",
  "age": 20,
  "friends": [
    {
      "name": "Bob",
      "age": 21
    },
    {
      "name": "Charlie",
      "age": 22
    }
  ]
}
```

And we want to deserialize this string into a C# object of type `Person`, which has a property called `Friends` of type `Friend[]`. We can achieve this by using the `[JsonObject]` attribute on the classes of `Person` and `Friend`. For example:

```csharp
[JsonObject]
public class Person
{
  public string Name { get; set; }
  public int Age { get; set; }

  public Friend[] Friends { get; set; }
}

[JsonObject]
public class Friend
{
  public string Name { get; set; }
  public int Age { get; set; }
}
```

Now, if we deserialize the JSON string, we will get a valid C# object of type `Person`:

```csharp
Person alice = JsonConvert.DeserializeObject<Person>(json);
Console.WriteLine(alice.Name);
Console.WriteLine(alice.Age);
Console.WriteLine(alice.Friends[0].Name);
Console.WriteLine(alice.Friends[1].Name);
```

The output will be:

```text
Alice
20
Bob
Charlie
```

As you can see, the `[JsonObject]` attribute allow us to deserialize a JSON object that contains a nested array into a C# object that has an array property.

## Dealing with Null Values and Default Values

Another common challenge when working with JSON data is handling null values and default values. Null values are values that are explicitly set to null in JSON data, while default values are values that are implicitly set to their default value in C# objects.

`Newtonsoft.Json` provides various options for dealing with null values and default values during serialization and deserialization. You can use these options to customize how null values and default values are handled in your application.

One option is to use the `NullValueHandling` setting, which controls how null values are handled during serialization and deserialization. The possible values for this setting are:

- `NullValueHandling.Include`: This is the default value. It means that null values are included in JSON data during serialization, and null values are assigned to properties during deserialization.
- `NullValueHandling.Ignore`: This means that null values are ignored in JSON data during serialization, and properties are left unchanged during deserialization.

For example, suppose we have a class called `Product` that represents a product:

```csharp
public class Product
{
  public string Name { get; set; }
  public decimal Price { get; set; }
  public string Description { get; set; }
}
```

And we have an instance of this class called `product`:

```csharp
Product product = new Product()
{
  Name = "Laptop",
  Price = 999.99m,
  Description = null
};
```
To serialize this object into JSON, we can simply call the `JsonConvert.SerializeObject()` method and pass the object as an argument:

```csharp
string json = JsonConvert.SerializeObject(product, Formatting.Indented);
Console.WriteLine(json);
```

The output will be:

```json
{
  "Name": "Laptop",
  "Price": 999.99,
  "Description": null
}
```

However, suppose we want to ignore the `Description` property if it is null during serialization. We can achieve this by using the `NullValueHandling` setting and setting it to `NullValueHandling.Ignore`. We can pass this setting as an additional parameter to the `JsonConvert.SerializeObject()` method. For example:

```csharp
string json = JsonConvert.SerializeObject(product, Formatting.Indented, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
Console.WriteLine(json);
```

The output will be:

```json
{
  "Name": "Laptop",
  "Price": 999.99
}
```

As you can see, the `Description` property is omitted in the JSON output because it is null.

Similarly, we can use the `NullValueHandling` setting to control how null values are handled during deserialization. For example, suppose we have a JSON string that represents a product:

```json
{
  "Name": "Laptop",
  "Price": 999.99
}
```

And we want to deserialize this string into a C# object of type `Product`, which has a property called `Description` of type `string`. We can achieve this by using the `NullValueHandling` setting and setting it to `NullValueHandling.Include`. We can pass this setting as an additional parameter to the `JsonConvert.DeserializeObject()` method. For example:

```csharp
Product product = JsonConvert.DeserializeObject<Product>(json, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Include });
Console.WriteLine(product.Name);
Console.WriteLine(product.Price);
Console.WriteLine(product.Description);
```

The output will be:

```text
Laptop
999.99
null //(blank on console when you print)
```

As you can see, the `Description` property is assigned to null in the C# object because it is missing in the JSON data.

Another option is to use the `DefaultValueHandling` setting, which controls how default values are handled during serialization and deserialization. The possible values for this setting are:

- `DefaultValueHandling.Include`: This is the default value. It means that default values are included in JSON data during serialization, and default values are assigned to properties during deserialization.
- `DefaultValueHandling.Ignore`: This means that default values are ignored in JSON data during serialization, and properties are left unchanged during deserialization.
- `DefaultValueHandling.Populate`: This means that default values are ignored in JSON data during serialization, and properties are populated with default values during deserialization.
- `DefaultValueHandling.IgnoreAndPopulate`: This means that default values are ignored in JSON data during serialization, and properties are populated with default values during deserialization if they have a `[DefaultValue]` attribute.

For example, suppose we have a class called `Customer` that represents a customer:

```csharp
public class Customer
{
  public string Name { get; set; }

  [DefaultValue(0)]
  public int Age { get; set; }

  [DefaultValue(true)]
  public bool IsActive { get; set; }
}
```

And we have an instance of this class called `customer`:

```csharp
Customer customer = new Customer()
{
  Name = "Alice",
  Age = 0,
  IsActive = true
};
```

To serialize this object into JSON, we can simply call the `JsonConvert.SerializeObject()` method and pass the object as an argument:

```csharp
string json = JsonConvert.SerializeObject(customer, Formatting.Indented);
Console.WriteLine(json);
```

The output will be:

```json
{
  "Name": "Alice",
  "Age": 0,
  "IsActive": true
}
```

However, suppose we want to ignore the `Age` and `IsActive` properties if they have their default values during serialization. We can achieve this by using the `DefaultValueHandling` setting and setting it to `DefaultValueHandling.Ignore`. We can pass this setting as an additional parameter to the `JsonConvert.SerializeObject()` method. For example:

```csharp
string json = JsonConvert.SerializeObject(customer, Formatting.Indented, new JsonSerializerSettings { DefaultValueHandling = DefaultValueHandling.Ignore });
Console.WriteLine(json);
```

The output will be:

```json
{
  "Name": "Alice"
}
```

As you can see, the `Age` and `IsActive` properties are omitted in the JSON output because they have their default values.

Similarly, we can use the `DefaultValueHandling` setting to control how default values are handled during deserialization. For example, suppose we have a JSON string that represents a customer:

```json
{
  "Name": "Alice"
}
```

And we want to deserialize this string into a C# object of type `Customer`, which has properties called `Age` and `IsActive` with default values of 0 and true respectively. We can achieve this by using the `DefaultValueHandling` setting and setting it to `DefaultValueHandling.Populate`. We can pass this setting as an additional parameter to the `JsonConvert.DeserializeObject()` method. For example:

```csharp
Customer customer = JsonConvert.DeserializeObject<Customer>(json, new JsonSerializerSettings { DefaultValueHandling = DefaultValueHandling.Populate });
Console.WriteLine(customer.Name);
Console.WriteLine(customer.Age);
Console.WriteLine(customer.IsActive);
```

The output will be:

```text
Alice
0
True
```

As you can see, the `Age` and `IsActive` properties are populated with their default values in the C# object because they are missing in the JSON data.

## Error Handling and Exception Management

Another important aspect of working with JSON data is error handling and exception management. Errors and exceptions can occur during JSON processing for various reasons, such as invalid JSON syntax, mismatched data types, missing or extra properties, etc.

`Newtonsoft.Json` provides several options for handling errors and exceptions gracefully and offering informative error messages to users. You can use these options to customize how errors and exceptions are handled in your application.

One option is to use the `Error` event, which is raised when an error occurs during serialization or deserialization. You can subscribe to this event and provide a custom handler that can perform actions such as logging the error, ignoring the error, or throwing an exception.

For example, suppose we have a class called `Student` that represents a student:

```csharp
public class Student
{
  public string Name { get; set; }
  public int Age { get; set; }
  public double GPA { get; set; }
}
```

And we have a JSON string that represents a list of students:

```json
[
  {
    "Name": "Alice",
    "Age": 20,
    "GPA": 3.5
  },
  {
    "Name": "Bob",
    "Age": 21,
    "GPA": 3.2
  },
  {
    "Name": "Charlie",
    "Age": 22,
    "GPA": null
  }
]
```

As you can see, the JSON string has some errors: the third student has a null value for the `GPA` property instead of a double.

To handle these errors, we can create a custom handler for the `Error` event and attach it to a `JsonSerializer` instance. For example:

```csharp
// Create a custom handler for the Error event
void HandleError(object sender, Newtonsoft.Json.Serialization.ErrorEventArgs args)
{
  // Get the current error context
  var context = args.ErrorContext;

  // Get the current error message
  var message = context.Error.Message;

  // Get the current error path
  var path = context.Path;

  // Log the error message and path
  Console.WriteLine($"Error: {message} at {path}");

  // Ignore the error and continue deserialization
  context.Handled = true;
}

// Create a JsonSerializer instance
var serializer = new JsonSerializer();

// Subscribe to the Error event with the custom handler
serializer.Error += HandleError;

// Deserialize the JSON string into a list of students
var students = serializer.Deserialize<List<Student>>(new JsonTextReader(new StringReader(json)));

// Print the list of students
foreach (var student in students)
{
  Console.WriteLine($"{student.Name}, {student.Age}, {student.GPA}");
}
```

The output will be:

```text
Error: Error converting value {null} to type 'System.Double'. Path '[2].GPA', line 15, position 15. at [2].GPA
Alice, 20, 3.5
Bob, 21, 3.2
Charlie, 22, 0
```

As you can see, the custom handler logs the error message and path for each error that occurs during deserialization. It also ignores the error and continues deserialization by assigning default values to the properties that have errors.

Another option is to use the `MissingMemberHandling` setting, which controls how missing or extra properties are handled during serialization or deserialization. The possible values for this setting are:

- `MissingMemberHandling.Ignore`: This is the default value. It means that missing or extra properties are ignored during serialization or deserialization.
- `MissingMemberHandling.Error`: This means that missing or extra properties cause an exception to be thrown during serialization or deserialization.

For example, suppose we have a class called `Employee` that represents an employee:

```csharp
public class Employee
{
  public string Name { get; set; }
  public string Department { get; set; }
}
```

And we have a JSON string that represents an employee:

```json
{
  "Name": "David",
  "Department": "Sales",
  "Salary": 50000
}
```

As you can see, the JSON string has an extra property called `Salary` that is not present in the `Employee` class.

To handle this error, we can use the `MissingMemberHandling` setting and set it to `MissingMemberHandling.Error`. We can pass this setting as an additional parameter to the `JsonConvert.DeserializeObject()` method. For example:

```csharp
try
{
  Employee employee = JsonConvert.DeserializeObject<Employee>(json, new JsonSerializerSettings { MissingMemberHandling = MissingMemberHandling.Error });
  Console.WriteLine(employee.Name);
  Console.WriteLine(employee.Department);
}
catch (JsonSerializationException ex)
{
  Console.WriteLine(ex.Message);
}
```

The output will be:

```text
Could not find member 'Salary' on object of type 'Employee'. Path 'Salary', line 4, position 11.
```

As you can see, the `MissingMemberHandling` setting causes an exception to be thrown during deserialization when an extra property is encountered in the JSON data.

I hope this helps you understand how to use Newtonsoft.Json for various scenarios involving JSON data.

Happy Coding...😊
