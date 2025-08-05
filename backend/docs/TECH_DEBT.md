# Technical Debt and Known Issues

This document lists current technical debts, inconsistencies, and areas for future improvement in the backend codebase.

---

## 1. Error Handling Inconsistencies

- There are multiple error handling middleware with different error response formats.
- Example:
  - Validation errors return:  
    ```json
    {
      "statusCode": 422,
      "message": "Validation failed.",
      "data": [ ... ]
    }
    ```
  - Email existence check returns:  
    ```json
    {
      "statusCode": 409,
      "message": "Email already registered",
      "data": {
        "code": "EMAIL_EXISTS",
        "email": "test@example.com"
      }
    }
    ```
- **Impact:** Inconsistent error response formats can cause confusion for API consumers.
- **Planned fix:** Refactor and unify all error responses into a consistent format.

## 2. OAuth Testing

- Manual testing only due to lack of frontend.
- Need to automate or add better integration tests.

## 3. Auth Controller

- **Consider adding strict request validation**:
  - Currently ignoring extra fields silently
  - Could add explicit validation to:
    - Improve API contract clarity
    - Provide better error messages
    - Catch client-side bugs early
  - Tradeoff: Adds some code complexity

## 4. Security Enhancement: HTML Sanitization

**Consider using sanitize-html for robust XSS protection**

### Current Implementation
- Using express-validator's `.escape()` for basic sanitization
- Works for simple text fields but has limitations

### Why Upgrade to sanitize-html?
1. **More Robust Protection**:
   - Specifically designed to clean HTML content
   - Removes/escapes unwanted tags and attributes

2. **Better Configurability**:
   - Whitelist/blacklist specific HTML tags
   - Customize allowed attributes
   - Preserve safe markup when needed

3. **Stronger Defense**:
   - Catches more XSS attack vectors
   - Essential if fields might contain HTML
   - Provides deeper security than basic escaping

### Implementation Notes
- Would need to:
  - Add `sanitize-html` package
  - Create sanitization middleware
  - Apply to all user-input fields
- Tradeoff: Adds dependency and processing overhead

*Priority: Medium - Important for security but current solution works for basic cases*

## 5. Authentication Security Enhancement

**Migrate to HTTP-only cookies with CSRF tokens**

### Current Implementation
- Using localStorage for JWT tokens in frontend
- Tokens accessible via JavaScript (XSS vulnerability)

### Why Upgrade to HTTP-only Cookies?
1. **Better Security**:
   - HTTP-only cookies can't be accessed via JavaScript
   - Eliminates XSS token theft risk
   - CSRF tokens protect against cross-site requests

2. **Recommended Practice**:
   - OWASP-recommended approach for session management
   - Widely adopted in production applications

3. **Implementation Requirements**:
   - Backend changes:
     - Set `httpOnly` and `secure` flags on cookies
     - Implement CSRF token generation/validation
   - Frontend changes:
     - Remove localStorage token handling
     - Add CSRF token to headers

*Priority: High - Important security improvement for production*

---

*Last updated: 2025-07-16*
