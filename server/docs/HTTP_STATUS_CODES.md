# HTTP Status Codes - Complete Reference Guide

## Table of Contents
1. [Success Responses (2xx)](#success-responses-2xx)
2. [Client Error Responses (4xx)](#client-error-responses-4xx)
3. [Server Error Responses (5xx)](#server-error-responses-5xx)
4. [Your Application Usage](#your-application-usage)
5. [Interview Questions](#interview-questions)
6. [Best Practices](#best-practices)

---

## Success Responses (2xx)

### 200 OK
**Meaning**: Request succeeded
**Use Case**: GET, PUT, DELETE operations
```javascript
return res.status(200).json({
  success: true,
  data: result,
  message: "Operation completed successfully"
});
```

### 201 Created
**Meaning**: Resource created successfully
**Use Case**: POST operations
```javascript
return res.status(201).json({
  success: true,
  data: newResource,
  message: "Resource created successfully"
});
```

### 202 Accepted
**Meaning**: Request accepted for processing
**Use Case**: Async operations, background tasks
```javascript
return res.status(202).json({
  success: true,
  message: "Request accepted for processing",
  jobId: "job_123"
});
```

### 204 No Content
**Meaning**: Success but no content to return
**Use Case**: DELETE operations, successful operations with no data
```javascript
return res.status(204).send();
```

### 206 Partial Content
**Meaning**: Partial content returned
**Use Case**: Range requests, pagination
```javascript
return res.status(206).json({
  data: partialData,
  range: "bytes 0-999/5000"
});
```

---

## Client Error Responses (4xx)

### 400 Bad Request
**Meaning**: Invalid request syntax or parameters
**Use Case**: Missing required fields, malformed data
```javascript
return res.status(400).json({
  success: false,
  error: "Missing required fields",
  details: "Email and password are required"
});
```

### 401 Unauthorized
**Meaning**: Authentication required or failed
**Use Case**: No valid credentials, invalid token
```javascript
return res.status(401).json({
  success: false,
  error: "Authentication required",
  message: "Please login to access this resource"
});
```

### 402 Payment Required
**Meaning**: Payment required for access
**Use Case**: Premium features, subscription required
```javascript
return res.status(402).json({
  success: false,
  error: "Payment required",
  message: "Upgrade to premium to access this feature"
});
```

### 403 Forbidden
**Meaning**: Authenticated but insufficient permissions
**Use Case**: Role-based access control, insufficient privileges
```javascript
return res.status(403).json({
  success: false,
  error: "Access denied",
  message: "Insufficient permissions to access this resource"
});
```

### 404 Not Found
**Meaning**: Resource not found
**Use Case**: Invalid URLs, non-existent resources
```javascript
return res.status(404).json({
  success: false,
  error: "Resource not found",
  message: "The requested resource does not exist"
});
```

### 405 Method Not Allowed
**Meaning**: HTTP method not allowed for this resource
**Use Case**: Wrong HTTP method used
```javascript
return res.status(405).json({
  success: false,
  error: "Method not allowed",
  message: "GET method is not allowed for this endpoint"
});
```

### 406 Not Acceptable
**Meaning**: Content not acceptable based on Accept headers
**Use Case**: Unsupported content type requested
```javascript
return res.status(406).json({
  success: false,
  error: "Content not acceptable",
  message: "Requested content type is not supported"
});
```

### 409 Conflict
**Meaning**: Resource conflict, already exists
**Use Case**: Duplicate resources, concurrent modifications
```javascript
return res.status(409).json({
  success: false,
  error: "Resource conflict",
  message: "An account with this email already exists"
});
```

### 410 Gone
**Meaning**: Resource permanently deleted
**Use Case**: Deleted resources, deprecated endpoints
```javascript
return res.status(410).json({
  success: false,
  error: "Resource no longer available",
  message: "This resource has been permanently deleted"
});
```

### 422 Unprocessable Entity
**Meaning**: Request syntax correct but semantic errors
**Use Case**: Validation failures, business logic errors
```javascript
return res.status(422).json({
  success: false,
  error: "Validation failed",
  details: {
    email: "Invalid email format",
    password: "Password must be at least 8 characters"
  }
});
```

### 429 Too Many Requests
**Meaning**: Rate limit exceeded
**Use Case**: API rate limiting, spam prevention
```javascript
return res.status(429).json({
  success: false,
  error: "Rate limit exceeded",
  message: "Too many requests, please try again later",
  retryAfter: 60
});
```

---

## Server Error Responses (5xx)

### 500 Internal Server Error
**Meaning**: Unexpected server error
**Use Case**: Unhandled exceptions, database errors
```javascript
return res.status(500).json({
  success: false,
  error: "Internal server error",
  message: "Something went wrong on our end"
});
```

### 501 Not Implemented
**Meaning**: Feature not implemented
**Use Case**: Unsupported operations, future features
```javascript
return res.status(501).json({
  success: false,
  error: "Not implemented",
  message: "This feature is not yet available"
});
```

### 502 Bad Gateway
**Meaning**: Gateway error, upstream service failed
**Use Case**: Third-party service failures, proxy errors
```javascript
return res.status(502).json({
  success: false,
  error: "Bad gateway",
  message: "External service is currently unavailable"
});
```

### 503 Service Unavailable
**Meaning**: Service temporarily unavailable
**Use Case**: Maintenance, overload, dependency issues
```javascript
return res.status(503).json({
  success: false,
  error: "Service unavailable",
  message: "Service is temporarily unavailable"
});
```

### 504 Gateway Timeout
**Meaning**: Gateway timeout
**Use Case**: Upstream service timeout, slow responses
```javascript
return res.status(504).json({
  success: false,
  error: "Gateway timeout",
  message: "Request timed out"
});
```

---

## Your Application Usage

### Current Status Codes in Your App
```javascript
// Success Codes
200 - GET operations, updates, successful operations
201 - User creation, course creation, notification creation

// Client Error Codes
400 - Missing required fields, invalid input
401 - No token, invalid token
403 - Insufficient permissions (admin/instructor required)
404 - User not found, course not found

// Server Error Codes
500 - Database errors, unexpected exceptions
503 - Firebase service not configured
```

### Example Usage in Your Controllers
```javascript
// Authentication
if (!adminAuth) {
  return res.status(503).json({
    success: false,
    message: "Firebase authentication service is not configured."
  });
}

if (!idToken) {
  return res.status(400).json({
    success: false,
    message: "Firebase ID token is required"
  });
}

// User not found
if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found"
  });
}

// Permission denied
if (req.user.role !== "admin") {
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin role required."
  });
}
```

---

## Interview Questions

### Q1: What's the difference between 401 and 403?
**A**: 
- **401 Unauthorized**: User is not authenticated (no valid credentials)
- **403 Forbidden**: User is authenticated but doesn't have permission to access the resource

### Q2: When would you use 201 vs 200?
**A**:
- **201 Created**: When a new resource is successfully created (POST requests)
- **200 OK**: When an existing resource is retrieved, updated, or deleted successfully

### Q3: What's the difference between 400 and 422?
**A**:
- **400 Bad Request**: Malformed request syntax, invalid request
- **422 Unprocessable Entity**: Request syntax is correct but semantic errors (validation failures)

### Q4: When would you use 409 Conflict?
**A**: When trying to create a resource that already exists (e.g., duplicate email during signup)

### Q5: What's the purpose of 204 No Content?
**A**: Success response when the server processed the request but there's no content to return (e.g., successful DELETE operations)

### Q6: How do you handle rate limiting?
**A**: Use 429 Too Many Requests with appropriate headers:
```javascript
return res.status(429).json({
  error: "Rate limit exceeded",
  retryAfter: 60 // seconds
});
```

### Q7: What's the difference between 500 and 503?
**A**:
- **500 Internal Server Error**: Unexpected server error, something went wrong
- **503 Service Unavailable**: Service is temporarily unavailable (maintenance, overload)

### Q8: When would you use 202 Accepted?
**A**: For asynchronous operations where the request is accepted but processing happens later (e.g., email sending, file processing)

---

## Best Practices

### 1. Consistent Error Response Format
```javascript
// Success Response
{
  success: true,
  data: result,
  message: "Operation successful"
}

// Error Response
{
  success: false,
  error: "Error message",
  details: "Additional details if needed"
}
```

### 2. Proper Error Handling
```javascript
try {
  // Your logic here
  return res.status(200).json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({ 
    success: false, 
    error: "Internal server error" 
  });
}
```

### 3. Validation Errors
```javascript
// Use 400 for missing required fields
if (!email || !password) {
  return res.status(400).json({
    success: false,
    error: "Email and password are required"
  });
}

// Use 422 for validation failures
if (!isValidEmail(email)) {
  return res.status(422).json({
    success: false,
    error: "Invalid email format"
  });
}
```

### 4. Authentication & Authorization
```javascript
// 401 for no authentication
if (!token) {
  return res.status(401).json({
    success: false,
    error: "Authentication required"
  });
}

// 403 for insufficient permissions
if (user.role !== 'admin') {
  return res.status(403).json({
    success: false,
    error: "Insufficient permissions"
  });
}
```

### 5. Resource Not Found
```javascript
// 404 for missing resources
if (!user) {
  return res.status(404).json({
    success: false,
    error: "User not found"
  });
}
```

### 6. Rate Limiting
```javascript
// 429 for rate limiting
if (requestCount > limit) {
  return res.status(429).json({
    success: false,
    error: "Rate limit exceeded",
    retryAfter: 60
  });
}
```

---

## Quick Reference

| Code | Category | Use Case |
|------|----------|----------|
| 200 | Success | GET, PUT, DELETE operations |
| 201 | Success | Resource created (POST) |
| 204 | Success | No content to return |
| 400 | Client Error | Bad request, missing fields |
| 401 | Client Error | Authentication required |
| 403 | Client Error | Insufficient permissions |
| 404 | Client Error | Resource not found |
| 409 | Client Error | Resource conflict |
| 422 | Client Error | Validation failed |
| 429 | Client Error | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Server Error | Service unavailable |

---

*Last Updated: [Current Date]*
*For: SkillHive E-Learning Platform*