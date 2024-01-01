---
layout: post
title: "Dealing with Date and Time in Humanizer in C#"
categories:
- programming
tags:
- C#
- .NET
- Humanizer
- DateTime
- TimeSpan
- String Manipulation
- Date and Time Formatting
- Open Source
- Programming
- Software Development
- User Experience
- Localization
- Internationalization
---

In the [previous article](https://keyurramoliya.com/posts/Getting-Started-with-Humanizer-in-CSharp/), we learned how to use Humanizer, a free, open-source .NET library that offers a set of extension methods and utilities to format and manipulate strings, numbers, dates, times, timespans, numbers, and quantities in a human-friendly way. We saw how Humanizer can help us convert camelCase and PascalCase strings to readable text, format numbers and dates in a user-friendly way, and pluralize and singularize words.

Handling date and time is one of the most common and challenging tasks in any application. Users expect to see date and time in a format that is easy to understand and relevant to their context. For example, users might prefer to see "2 hours ago" instead of "2023-12-01 12:14:53", or "tomorrow at 10:00 AM" instead of "2023-12-02 10:00:00". Moreover, users might have different preferences for date and time formats depending on their culture, language, and location.

The purpose of this article is to show you how to use Humanizer to deal with date and time in a human-friendly way in your C# projects. We will cover how to humanize DateTime and TimeSpan objects, how to customize the humanization options, and how to combine string and date/time humanization. We will also explore some real-world use cases and examples of how Humanizer can improve the user experience with date and time.

## Humanizing DateTime Objects

A DateTime object represents a specific point in time, such as the current date and time, or a date and time in the past or future. Humanizer provides several extension methods to humanize DateTime objects in a human-readable format.

### Formatting DateTime in a human-readable format

One of the most basic ways to humanize a DateTime object is to use the Humanize extension method, which returns a string that represents the date and time in a natural language. For example:

```csharp
using Humanizer;

DateTime now = DateTime.Now;
DateTime yesterday = now.AddDays(-1);
DateTime tomorrow = now.AddDays(1);
DateTime nextWeek = now.AddDays(7);

Console.WriteLine(now.Humanize()); // now
Console.WriteLine(yesterday.Humanize()); // yesterday
Console.WriteLine(tomorrow.Humanize()); // 23 hours from now
Console.WriteLine(nextWeek.Humanize()); // 6 days from now
```

As you can see, the Humanize method returns a string that is easy to understand and relevant to the current date and time. It also handles different cases, such as today, yesterday, tomorrow, and future or past dates.

### Displaying relative time (e.g., "2 hours ago")

Another way to humanize a DateTime object is to use the Humanize extension method with a boolean parameter that indicates whether to display the relative time or not. The relative time is a string that represents how much time has passed or will pass since or until the date and time. For example:

```csharp
using Humanizer;

DateTime anHourAgo = DateTime.Now.AddHours(-1);
DateTime anHourLater = DateTime.Now.AddHours(1);

Console.WriteLine(anHourAgo.Humanize()); // an hours ago
Console.WriteLine(anHourLater.Humanize()); // 59 minutes from now
```

As you can see, the relative time is useful when you want to show how recent or distant a date and time is, while the absolute time is useful when you want to show the exact date and time.

### Customizing DateTime humanization

Humanizer also allows you to customize the humanization options for DateTime objects, such as the culture, the precision, the max unit, and the min unit. You can use the Humanize extension method with a HumanizeOptions object that specifies the desired options. For example:

```csharp
using System.Globalization;
using Humanizer;

DateTime now = DateTime.Now;
DateTime twoHoursAgo = now.AddHours(-2);

// Use a different culture
Console.WriteLine(twoHoursAgo.Humanize(culture: new CultureInfo("fr-FR"))); // il y a 2 heures
```

As you can see, the culture option allows you to use a different language and format for the humanized string.

## Humanizing TimeSpan Objects

A TimeSpan object represents a time interval, such as the duration of an event, or the difference between two dates and times. Humanizer provides several extension methods to humanize TimeSpan objects in a user-friendly format.

### Converting TimeSpan to a user-friendly format

One of the most basic ways to humanize a TimeSpan object is to use the Humanize extension method, which returns a string that represents the time interval in a natural language. For example:

```csharp
using Humanizer;

TimeSpan oneHour = TimeSpan.FromHours(1);
TimeSpan oneMinute = TimeSpan.FromMinutes(1);
TimeSpan oneSecond = TimeSpan.FromSeconds(1);
TimeSpan oneMillisecond = TimeSpan.FromMilliseconds(1);

Console.WriteLine(oneHour.Humanize()); // 1 hour
Console.WriteLine(oneMinute.Humanize()); // 1 minute
Console.WriteLine(oneSecond.Humanize()); // 1 second
Console.WriteLine(oneMillisecond.Humanize()); // 1 millisecond
```

As you can see, the Humanize method returns a string that is easy to understand and relevant to the time interval. It also handles different cases, such as singular and plural forms, and indefinite and definite articles.

### Handling durations (e.g., "2 days, 5 hours, and 30 minutes")

Another way to humanize a TimeSpan object is to use the Humanize extension method with a boolean parameter that indicates whether to display the duration or not. The duration is a string that represents the time interval in terms of multiple units of time. For example:

```csharp
using Humanizer;

TimeSpan twoDays = TimeSpan.FromDays(2);
TimeSpan twoHours = TimeSpan.FromHours(2);
TimeSpan twoMinutes = TimeSpan.FromMinutes(2);
TimeSpan twoSeconds = TimeSpan.FromSeconds(2);
TimeSpan twoMilliseconds = TimeSpan.FromMilliseconds(2);

Console.WriteLine(twoDays.Humanize()); // 2 days
Console.WriteLine(twoHours.Humanize()); // 2 hours
Console.WriteLine(twoMinutes.Humanize()); // 2 minutes
Console.WriteLine(twoSeconds.Humanize()); // 2 seconds
Console.WriteLine(twoMilliseconds.Humanize()); // 2 milliseconds
```

As you can see, the duration is useful when you want to show the time interval in terms of multiple units of time, while the single unit is useful when you want to show the time interval in terms of the largest unit of time.

### Customizing TimeSpan humanization

Humanizer also allows you to customize the humanization options for TimeSpan objects, such as the culture, the precision, the max unit, and the min unit. You can use the Humanize extension method with a HumanizeOptions object that specifies the desired options.

```csharp
using System.Globalization;
using Humanizer;
using Humanizer.Localisation;

TimeSpan twoDays = TimeSpan.FromDays(2.75);

// Use a different culture
Console.WriteLine(twoDays.Humanize(culture: new CultureInfo("fr-FR"))); // 2 jours

// Use a different precision
Console.WriteLine(twoDays.Humanize(precision: 3)); // 2 days, 18 hours

// Use a different max unit
Console.WriteLine(twoDays.Humanize(maxUnit: TimeUnit.Hour)); // 66 hours

// Use a different min unit
Console.WriteLine(twoDays.Humanize(minUnit: TimeUnit.Minute)); // 2 days
```

As you can see, the culture option allows you to use a different language and format for the humanized string. The precision option allows you to specify how many units of time to include in the humanized string. The max unit and min unit options allow you to specify the largest and smallest units of time to use in the humanized string.

## Combining String and DateTime Humanization

Humanizer not only allows you to humanize strings and date/time objects separately, but also to combine them in a seamless way. You can use the Humanize extension method with a string that contains placeholders for date/time objects, and Humanizer will automatically replace them with the humanized strings. For example:

```csharp
using Humanizer;

DateTime now = DateTime.Now;
DateTime twoHoursAgo = now.AddHours(-2);

// Use placeholders for date/time objects
Console.WriteLine("The current time is {0}", now.Humanize()); // The current time is now
Console.WriteLine("The last update was {0}", twoHoursAgo.Humanize()); // The last update was 2 hours ago
```

As you can see, the Humanize method with a string that contains placeholders for date/time objects allows you to combine string and date/time humanization in a simple and elegant way. You can use any number of placeholders and any format for the date/time objects, and Humanizer will handle them accordingly.

## Real-world Use Cases

Humanizer can help you improve the user experience with date and time in your C# projects in many ways. Here are some real-world use cases and examples of how Humanizer can make a difference:

- **Social media posts**: You can use Humanizer to display the date and time of social media posts in a relative and human-friendly way, such as "2 hours ago" or "yesterday". This can help users to quickly grasp how recent or old a post is, and to relate to it better.
- **Notifications and reminders**: You can use Humanizer to send notifications and reminders to users in a natural and user-friendly way, such as "tomorrow at 10:00 AM" or "in 15 minutes". This can help users to remember and plan their tasks better, and to avoid confusion and errors.
- **Logs and reports**: You can use Humanizer to format the date and time of logs and reports in a readable and consistent way, such as "12/1/2023 4:14:53 PM" or "2 days, 5 hours, and 30 minutes". This can help users to analyze and compare the data better, and to find and fix issues faster.
- **Calendars and schedules**: You can use Humanizer to display the date and time of calendars and schedules in a clear and concise way, such as "Monday, December 1, 2023" or "2 hours and 30 minutes". This can help users to view and manage their events better, and to avoid conflicts and overlaps.

## Conclusion

In this article, we learned how to use Humanizer to deal with date and time in a human-friendly way in our C# projects. We covered how to humanize DateTime and TimeSpan objects, how to customize the humanization options, and how to combine string and date/time humanization. We also explored some real-world use cases and examples of how Humanizer can improve the user experience with date and time.

Humanizer is a powerful and versatile library that can help you format and manipulate strings, numbers, dates, times, timespans, numbers, and quantities in a human-friendly way. It can save you time and effort, and make your code more readable and maintainable. It can also enhance the user experience, and make your applications more engaging and appealing.

I hope you enjoyed this article, and learned something new and useful. Thank you for reading.
