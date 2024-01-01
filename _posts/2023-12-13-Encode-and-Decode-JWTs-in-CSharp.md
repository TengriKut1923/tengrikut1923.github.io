---
layout: post
title: "Encode and Decode JWTs in C#"
categories:
- programming
tags:
- C#
- .NET
- JWT
---

JSON Web Tokens (JWTs) are an open standard (RFC 7519) that define a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

**JWTs are crucial in modern web applications** for carrying user identity across different services, ensuring seamless and secure user experiences. This article aims to provide a comprehensive guide on encoding and decoding JWTs in C#, highlighting their importance and practical applications.

## Understanding JWT
A JWT is a string consisting of three parts: Header, Payload, and Signature, separated by dots (.):

- **Header**: Typically consists of two parts: the type of token (JWT) and the signing algorithm.
- **Payload**: Contains the claims, which are statements about an entity (typically the user) and additional data.
- **Signature**: To create the signature part, you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.

JWTs are used for authentication, as the server can verify the token's signature and know that the payload is trustworthy, and for authorization, as a user can prove their identity and access permitted resources.

## Encoding JWTs in C#
To encode JWTs in C#, you'll need to select a library that supports JWT creation and manipulation. One such library is `System.IdentityModel.Tokens.Jwt`. Here's a step-by-step guide:

```csharp
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

var claims = new[] {
	new Claim(JwtRegisteredClaimNames.Sub, "user_id"),
	new Claim("custom_claim", "custom_value")
};

// Create the JWT and write it to a string
var key = new SymmetricSecurityKey("4df48011-3c8c-4732-b21c-a5aedb29cad5"u8.ToArray());
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

var token = new JwtSecurityToken(
	issuer: "your_issuer",
	audience: "your_audience",
	claims: claims,
	expires: DateTime.Now.AddMinutes(30),
	signingCredentials: creds);

var encodedJwt = new JwtSecurityTokenHandler().WriteToken(token);
```

Output:
```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyX2lkIiwiY3VzdG9tX2NsYWltIjoiY3VzdG9tX3ZhbHVlIiwiZXhwIjoxNzAyNDQ5Mzg0LCJpc3MiOiJ5b3VyX2lzc3VlciIsImF1ZCI6InlvdXJfYXVkaWVuY2UifQ.Avj6-pBDPSSGHs2mu-FbE7bgieKtUwqJOIqB22HzuMs
```

## Decoding JWTs in C#
Decoding and verifying JWTs in C# involves similar steps but in reverse. You'll need to:

```csharp
var tokenHandler = new JwtSecurityTokenHandler();
var validationParameters = new TokenValidationParameters {
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = key,
    ValidateIssuer = true,
    ValidIssuer = "your_issuer",
    ValidateAudience = true,
    ValidAudience = "your_audience",
    ValidateLifetime = true,
    ClockSkew = TimeSpan.Zero
};

SecurityToken validatedToken;
var principal = tokenHandler.ValidateToken(encodedJwt, validationParameters, out validatedToken);
```

## Working with JWT Claims
JWT claims are pieces of information asserted about a subject. For example, the claim "sub" (subject) might be the user's unique ID. The claims "exp" (expiration time) and "iat" (issued at) are used to define the token's lifetime.

You can add custom claims and access them in your C# code:

```csharp
var userIdClaim = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
```

## Best Practices and Security Considerations
Securing JWTs is paramount. Always use HTTPS to transmit tokens, set short expiration times, and consider token refresh strategies. Avoid storing sensitive information in JWT payloads and implement mechanisms to revoke tokens if necessary.

## Error Handling
Handle errors such as invalid or expired tokens gracefully, providing clear messages to the end-user and implementing robust error handling mechanisms in your code.

## Conclusion
JWTs are a powerful tool for managing authentication and authorization in C# applications. By following the guidelines and best practices outlined in this article, developers can ensure secure and efficient JWT implementation.

Remember, security is not an afterthought; it's an integral part of the development process. Happy coding!
