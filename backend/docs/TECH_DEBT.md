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

---

*Last updated: 2025-07-16*
