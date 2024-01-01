---
layout: post
title: "How Does an HTTP Web Request Work?"
categories:
- programming
tags:
- HTTP
- HTTP/1.0
- HTTP/1.1
- HTTP/2
- HTTP/3
- QUIC
- Protocol
- Protocols
---

Have you ever wondered how the web works? How do you access a website from your browser? How does your browser communicate with a web server? The answer to these questions lies in the **HTTP** protocol, which is the backbone of web communication. In this blog post, we will explore what HTTP is, how it works, and what are the key components of an HTTP request and response.

## Understanding HTTP
HTTP stands for **Hypertext Transfer Protocol**. It is a set of rules that defines how messages are formatted and transmitted over the internet. HTTP also defines how servers and clients should respond to these messages.

HTTP is the foundation of the **World Wide Web**, which is a system of interlinked documents (web pages) that can be accessed via the internet. HTTP allows clients (such as browsers) to request web pages from servers (such as web servers) and display them on their devices.

HTTP has evolved over time to meet the changing needs and demands of the web. The original version of HTTP was **HTTP/1.0**, which was released in 1996. It was followed by **HTTP/1.1** in 1997, which introduced several improvements such as persistent connections, chunked transfer encoding, and caching mechanisms. In 2015, **HTTP/2** was released, which brought significant enhancements such as multiplexing, compression, and server push. The latest version of HTTP is **HTTP/3**, aims to improve performance and security by using a new transport layer protocol called **QUIC**.

## Anatomy of an HTTP Request
An HTTP request is a message that a client sends to a server to ask for a resource (such as a web page, an image, or a file). An HTTP request consists of four main parts: URL, method, headers, and body.

### URL
A URL (Uniform Resource Locator) is a string that identifies the location and name of a resource on the internet. A URL has six components:

- **Scheme**: The protocol used to access the resource (e.g., http, https, ftp)
- **Host**: The domain name or IP address of the server that hosts the resource (e.g., www.example.com, 204.79.197.200)
- **Port**: The port number on which the server listens for requests (e.g., 80 for http, 443 for https)
- **Path**: The specific path to the resource on the server (e.g., /search)
- **Query Parameters**: The optional parameters that provide additional information to the server (e.g., ?q=example)
- **Fragment**: The optional part of the resource that refers to a specific section within it (e.g., #top)

For example, the URL `https://www.example.com/search?q=example#top` has the following components:

- Scheme: https
- Host: www.example.com
- Port: 443
- Path: /search
- Query Parameters: q=example
- Fragment: top

### Method
The method is a verb that indicates the action that the client wants to perform on the resource. There are several methods defined by HTTP, such as:

- **GET**: Requests a representation of the resource (e.g., a web page or an image)
- **POST**: Sends data to the server to create or update a resource (e.g., a form submission or a file upload)
- **PUT**: Replaces or creates a resource with the data sent by the client (e.g., updating a profile or uploading a file)
- **DELETE**: Deletes a resource from the server (e.g., removing an item from a cart or deleting an account)
- **HEAD**: Requests only the headers of the resource, without the body (e.g., checking if a resource exists or has been modified)
- **OPTIONS**: Requests information about the methods and headers supported by the server for a given resource (e.g., discovering what methods are allowed for a resource or what headers are required for authentication)

The method is specified at the beginning of the request line, followed by a space and then the URL. For example, `GET /search?q=example HTTP/1.1` is an HTTP request line that uses the GET method to request the /search resource with the query parameter q=example.

### Headers
The headers are key-value pairs that provide additional information about the request and the client. There are many types of headers defined by HTTP, such as:

- **General Headers**: Apply to both requests and responses (e.g., Date, Connection, Cache-Control)
- **Request Headers**: Provide information about the request and the client (e.g., Host, User-Agent, Accept)
- **Response Headers**: Provide information about the response and the server (e.g., Server, Content-Type, Content-Length)
- **Entity Headers**: Provide information about the body of the request or response (e.g., Content-Encoding, Content-Language, ETag)

The headers are separated by a colon and a space, and each header is followed by a newline character. For example, `Host: www.example.com` is an HTTP header that specifies the host name of the server.

### Body
The body is the optional part of the request that contains the data that the client wants to send to the server. The body is usually present in requests that use methods such as POST or PUT, where the client needs to send data to create or update a resource. The body can be in various formats, such as plain text, HTML, JSON, XML, or binary. The body is separated from the headers by a blank line. For example, `name=John&age=25` is an HTTP body that contains two parameters (name and age) encoded in URL format.

## The HTTP Request Process
The HTTP request process is the sequence of steps that occurs when a client sends an HTTP request to a server and receives an HTTP response from it. The HTTP request process involves the following stages:

### DNS Resolution
DNS (Domain Name System) is a service that translates domain names (such as www.example.com) into IP addresses (such as 204.79.197.200). IP addresses are numerical identifiers that are used to locate and communicate with devices on the internet. DNS resolution is the process of finding the IP address of a domain name by querying a series of DNS servers.

When a client wants to send an HTTP request to a server, it first needs to resolve the hostname (the host component of the URL) to an IP address. To do this, the client contacts a DNS resolver, which is a server that knows how to query other DNS servers. The DNS resolver then sends queries to various DNS servers until it finds the authoritative DNS server for the domain name. The authoritative DNS server is the one that has the most accurate and up-to-date information about the domain name and its IP address. The authoritative DNS server then returns the IP address of the domain name to the DNS resolver, which in turn returns it to the client.

### TCP/IP Connection
TCP/IP (Transmission Control Protocol/Internet Protocol) is a suite of protocols that defines how devices communicate over the internet. TCP/IP consists of four layers: application, transport, internet, and network access. HTTP operates at the application layer, which provides high-level services such as web browsing, email, and file transfer. TCP operates at the transport layer, which provides reliable and ordered delivery of data between devices. IP operates at the internet layer, which provides routing and addressing of data packets across networks. The network access layer consists of various technologies that enable physical connection and transmission of data between devices.

When a client has resolved the IP address of the server, it needs to establish a TCP/IP connection with it. A TCP/IP connection is a logical link between two devices that allows them to exchange data using TCP/IP protocols. To initiate a TCP/IP connection, the client performs a three-way handshake with the server:

- The client sends a SYN (synchronize) packet to the server, which contains information such as its IP address, port number, and sequence number.
- The server responds with a SYN-ACK (synchronize-acknowledge) packet, which contains information such as its IP address, port number, sequence number, and acknowledgment number.
- The client responds with an ACK (acknowledge) packet, which contains information such as its acknowledgment number.

After completing the three-way handshake, both devices are ready to exchange data using TCP/IP protocols.

### Sending the Request
After establishing a TCP/IP connection with the server, the client can send its HTTP request to it. To do this, the client packages its HTTP request into one or more TCP segments (also called packets), which are units of data that can be transmitted over TCP/IP networks. Each TCP segment contains information such as source and destination port numbers, sequence and acknowledgment numbers, flags, checksums, and payload data.

The client then sends its TCP segments to the server using IP datagrams (also called packets), which are units of data that can be transmitted over IP networks. Each IP datagram contains information such as source and destination IP addresses, version number, header length, type of service, total length, identification number, flags, fragment offset, time to live (TTL), protocol number, checksums, and payload data.

The client's IP datagrams are then routed through various intermediate devices (such as routers and switches) on their way to the server's IP address. Each intermediate device examines the destination IP address of each datagram and forwards it to the next hop device according to its routing table.

The server's network access layer then receives the client's IP datagrams and extracts the TCP segments from them. The server's transport layer then receives the client's TCP segments and reassembles them into the original HTTP request. The server then checks the validity and integrity of the request by verifying the checksums, sequence and acknowledgment numbers, and flags. If the request is valid and complete, the server passes it to the application layer, where the HTTP protocol handles it.

### Server Processing
The server's application layer receives the client's HTTP request and parses it into its components: method, URL, headers, and body. The server then handles the request based on the method and the path specified in the URL.

The server may perform various actions depending on the request, such as:

- Retrieving a static or dynamic resource from its file system or database
- Executing a script or a program that generates a resource
- Performing a CRUD (create, read, update, delete) operation on a resource
- Redirecting the client to another URL
- Authenticating or authorizing the client
- Logging or caching the request

### Generating a Response
After processing the client's request, the server creates an HTTP response to send back to the client. An HTTP response consists of three main parts: status line, headers, and body.

#### Status Line
The status line is the first line of the response that contains information about the outcome of the request. The status line consists of three elements:

- **Protocol Version**: The version of HTTP used by the server (e.g., HTTP/1.1)
- **Status Code**: A three-digit number that indicates the result of the request (e.g., 200, 404, 500)
- **Reason Phrase**: A short text that describes the status code (e.g., OK, Not Found, Internal Server Error)

The status line is separated by spaces and followed by a newline character. For example, `HTTP/1.1 200 OK` is an HTTP status line that indicates that the request was successful.

#### Headers
The headers are key-value pairs that provide additional information about the response and the server. The headers are similar to those in the request, except that they are specific to the response. Some examples of response headers are:

- **Server**: The name and version of the server software (e.g., Apache/2.4.46)
- **Content-Type**: The media type of the resource returned in the body (e.g., text/html, image/jpeg, application/json)
- **Content-Length**: The size of the resource in bytes (e.g., 1024)
- **Set-Cookie**: The cookie data that the server wants to store on the client's device (e.g., session_id=1234567890)
- **Location**: The URL to which the client should be redirected (e.g., https://www.example.com/search?q=example)

The headers are separated by a colon and a space, and each header is followed by a newline character. For example, `Content-Type: text/html` is an HTTP header that specifies that the body contains HTML content.

#### Body
The body is the optional part of the response that contains the data that the server wants to send to the client. The body is usually present in responses that return a resource (such as a web page, an image, or a file) or some data (such as JSON or XML). The body can be in various formats, depending on
the content type header. The body is separated from
the headers by a blank line. For example,
`<html><head><title>example</title></head><body><h1>example</h1></body></html>` is an HTTP body that contains HTML content.

### Sending the Response
After creating an HTTP response,  the server packages it into one or more TCP segments and sends them to the client using IP datagrams. The process is similar to the one used by the client when sending the request, except that the source and destination addresses and ports are reversed.

The client's network access layer then receives the server's IP datagrams and extracts the TCP segments from them. The client's transport layer then receives the server's TCP segments and reassembles them into the original HTTP response. The client then checks the validity and integrity of the response by verifying the checksums, sequence and acknowledgment numbers,and flags. If the response is valid and complete, the client passes it to the application layer, where the HTTP protocol handles it.

## HTTP Status Codes
HTTP status codes are three-digit numbers that indicate the result of the request. They are divided into five categories, based on the first digit:

- **1xx**: Informational. The request was received and is being processed.
- **2xx**: Success. The request was successfully received, understood, and accepted.
- **3xx**: Redirection. The request requires further action from the client, such as following a different URL.
- **4xx**: Client Error. The request contains an error or is invalid.
- **5xx**: Server Error. The server failed to fulfill a valid request.

Some examples of common HTTP status codes and their meanings are:

- **200 OK**: The request was successful and the response contains the requested resource.
- **301 Moved Permanently**: The requested resource has been moved to a new URL and the client should use that URL from now on.
- **400 Bad Request**: The request was malformed or invalid and could not be understood by the server.
- **401 Unauthorized**: The request requires authentication and the client did not provide valid credentials.
- **403 Forbidden**: The server understood the request but refused to authorize it due to insufficient permissions or other reasons.
- **404 Not Found**: The requested resource does not exist on the server.
- **500 Internal Server Error**: The server encountered an unexpected error while processing the request and could not complete it.

## Handling HTTP Responses
The client's application layer receives the server's HTTP response and parses it into its components: status line, headers, and body. The client then handles the response based on the status code and the headers.

The client may perform various actions depending on the response, such as:

- Displaying the resource or data contained in the body (if applicable)
- Extracting information from the headers (such as cookies, content type, or location)
- Following a redirection to another URL (if indicated by a 3xx status code)
- Resending the request with authentication credentials (if required by a 401 status code)
- Showing an error message or a custom page (if indicated by a 4xx or 5xx status code)
- Logging or caching the response

## Conclusion
In this blog post, we have learned what HTTP is, how it works, and what are the key components of an HTTP request and response. We have also seen how an HTTP web request process involves various stages such as DNS resolution, TCP/IP connection, sending and receiving data, server processing, generating and handling responses, and closing connections. Understanding HTTP is essential for web development and browsing, as it is the protocol that enables communication between clients and servers on the internet.

I hope you have enjoyed this blog post and learned something new about HTTP.

Thank you for reading!
