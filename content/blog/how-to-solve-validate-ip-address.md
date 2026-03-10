---
title: "How to Solve Validate IP Address — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Validate IP Address. Medium difficulty, 28.2% acceptance rate. Topics: String."
date: "2028-10-11"
category: "dsa-patterns"
tags: ["validate-ip-address", "string", "medium"]
---

# How to Solve Validate IP Address

This problem asks you to determine whether a given string represents a valid IPv4 or IPv6 address. The challenge lies in carefully implementing all the specific validation rules for each format without missing edge cases. What makes this problem interesting is that it's not about algorithmic complexity but about meticulous attention to detail and thorough testing of string parsing logic.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the input `"192.168.1.1"`:

1. First, we check if this could be IPv4 by looking for dots (`.`). We find 3 dots, which matches the IPv4 format requirement of 4 segments separated by 3 dots.

2. We split the string by dots to get `["192", "168", "1", "1"]`.

3. For each segment:
   - `"192"`: Check if it's numeric (yes), check if it's between 0-255 (yes), check for leading zeros (none, so valid)
   - `"168"`: Same checks pass
   - `"1"`: Same checks pass
   - `"1"`: Same checks pass

4. All segments pass, so this is a valid IPv4 address.

Now let's try `"2001:0db8:85a3:0000:0000:8a2e:0370:7334"`:

1. We check for colons (`:`) and find 7 of them, which matches the IPv6 format requirement of 8 segments separated by 7 colons.

2. We split by colons to get 8 hexadecimal segments.

3. For each segment:
   - Check length is 1-4 characters (all pass)
   - Check if all characters are valid hexadecimal digits (0-9, a-f, A-F) (all pass)

4. All segments pass, so this is a valid IPv6 address.

## Brute Force Approach

A naive approach would be to try to parse the string as both IPv4 and IPv6 simultaneously, checking all conditions. However, there's no "brute force" in the traditional sense for this problem since the validation itself is the solution. The challenge is implementing all the rules correctly.

What candidates often try first is writing a single function that attempts to handle both formats, but this leads to messy code that's hard to debug. Another common naive approach is using regular expressions without understanding all the edge cases, which often misses subtle requirements like "no leading zeros" in IPv4.

The real issue isn't algorithmic complexity (both solutions are O(n)), but implementation correctness. The "brute force" mindset here means writing code without proper structure that handles all edge cases systematically.

## Optimized Approach

The key insight is to separate the validation logic for IPv4 and IPv6 into distinct functions. This makes the code cleaner and easier to debug. Here's the step-by-step reasoning:

1. **First, determine which format to check**:
   - If the string contains dots (`.`), check if it's IPv4
   - If the string contains colons (`:`), check if it's IPv6
   - If it contains both or neither, return "Neither"

2. **IPv4 validation rules**:
   - Must have exactly 4 segments when split by dots
   - Each segment must be a decimal number between 0-255
   - No leading zeros (except for the number 0 itself)
   - Must contain only digits

3. **IPv6 validation rules**:
   - Must have exactly 8 segments when split by colons
   - Each segment must be 1-4 hexadecimal characters
   - Valid characters are 0-9, a-f, A-F
   - Leading zeros are allowed (unlike IPv4)

The optimization comes from structuring the code cleanly and handling edge cases methodically rather than from algorithmic improvements.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(n) for storing the split segments
class Solution:
    def validIPAddress(self, queryIP: str) -> str:
        # Check if the string could be IPv4 (contains dots)
        if '.' in queryIP:
            return self._validateIPv4(queryIP)
        # Check if the string could be IPv6 (contains colons)
        elif ':' in queryIP:
            return self._validateIPv6(queryIP)
        # If it contains neither or both, it's neither
        else:
            return "Neither"

    def _validateIPv4(self, ip: str) -> str:
        # Split the IP by dots
        segments = ip.split('.')

        # IPv4 must have exactly 4 segments
        if len(segments) != 4:
            return "Neither"

        for segment in segments:
            # Each segment must not be empty
            if not segment:
                return "Neither"

            # Check for leading zeros: if length > 1 and first char is '0'
            if len(segment) > 1 and segment[0] == '0':
                return "Neither"

            # Check if segment contains only digits
            if not segment.isdigit():
                return "Neither"

            # Convert to integer and check range
            num = int(segment)
            if num < 0 or num > 255:
                return "Neither"

        return "IPv4"

    def _validateIPv6(self, ip: str) -> str:
        # Split the IP by colons
        segments = ip.split(':')

        # IPv6 must have exactly 8 segments
        if len(segments) != 8:
            return "Neither"

        # Valid hexadecimal characters
        hex_digits = set("0123456789abcdefABCDEF")

        for segment in segments:
            # Each segment must be between 1 and 4 characters
            if len(segment) < 1 or len(segment) > 4:
                return "Neither"

            # Check if all characters are valid hex digits
            for char in segment:
                if char not in hex_digits:
                    return "Neither"

        return "IPv6"
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(n) for storing the split segments
/**
 * @param {string} queryIP
 * @return {string}
 */
var validIPAddress = function (queryIP) {
  // Check if the string could be IPv4 (contains dots)
  if (queryIP.includes(".")) {
    return validateIPv4(queryIP);
  }
  // Check if the string could be IPv6 (contains colons)
  else if (queryIP.includes(":")) {
    return validateIPv6(queryIP);
  }
  // If it contains neither or both, it's neither
  else {
    return "Neither";
  }
};

function validateIPv4(ip) {
  // Split the IP by dots
  const segments = ip.split(".");

  // IPv4 must have exactly 4 segments
  if (segments.length !== 4) {
    return "Neither";
  }

  for (const segment of segments) {
    // Each segment must not be empty
    if (!segment) {
      return "Neither";
    }

    // Check for leading zeros: if length > 1 and first char is '0'
    if (segment.length > 1 && segment[0] === "0") {
      return "Neither";
    }

    // Check if segment contains only digits
    if (!/^\d+$/.test(segment)) {
      return "Neither";
    }

    // Convert to integer and check range
    const num = parseInt(segment, 10);
    if (num < 0 || num > 255) {
      return "Neither";
    }
  }

  return "IPv4";
}

function validateIPv6(ip) {
  // Split the IP by colons
  const segments = ip.split(":");

  // IPv6 must have exactly 8 segments
  if (segments.length !== 8) {
    return "Neither";
  }

  // Regular expression for valid hexadecimal characters
  const hexRegex = /^[0-9a-fA-F]+$/;

  for (const segment of segments) {
    // Each segment must be between 1 and 4 characters
    if (segment.length < 1 || segment.length > 4) {
      return "Neither";
    }

    // Check if all characters are valid hex digits
    if (!hexRegex.test(segment)) {
      return "Neither";
    }
  }

  return "IPv6";
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(n) for storing the split segments
class Solution {
    public String validIPAddress(String queryIP) {
        // Check if the string could be IPv4 (contains dots)
        if (queryIP.contains(".")) {
            return validateIPv4(queryIP);
        }
        // Check if the string could be IPv6 (contains colons)
        else if (queryIP.contains(":")) {
            return validateIPv6(queryIP);
        }
        // If it contains neither or both, it's neither
        else {
            return "Neither";
        }
    }

    private String validateIPv4(String ip) {
        // Split the IP by dots, using -1 limit to include empty strings
        String[] segments = ip.split("\\.", -1);

        // IPv4 must have exactly 4 segments
        if (segments.length != 4) {
            return "Neither";
        }

        for (String segment : segments) {
            // Each segment must not be empty
            if (segment.isEmpty()) {
                return "Neither";
            }

            // Check for leading zeros: if length > 1 and first char is '0'
            if (segment.length() > 1 && segment.charAt(0) == '0') {
                return "Neither";
            }

            // Check if segment contains only digits
            for (char c : segment.toCharArray()) {
                if (!Character.isDigit(c)) {
                    return "Neither";
                }
            }

            // Convert to integer and check range
            try {
                int num = Integer.parseInt(segment);
                if (num < 0 || num > 255) {
                    return "Neither";
                }
            } catch (NumberFormatException e) {
                // Handle numbers that are too large for int
                return "Neither";
            }
        }

        return "IPv4";
    }

    private String validateIPv6(String ip) {
        // Split the IP by colons, using -1 limit to include empty strings
        String[] segments = ip.split(":", -1);

        // IPv6 must have exactly 8 segments
        if (segments.length != 8) {
            return "Neither";
        }

        // Valid hexadecimal characters
        String hexDigits = "0123456789abcdefABCDEF";

        for (String segment : segments) {
            // Each segment must be between 1 and 4 characters
            if (segment.length() < 1 || segment.length() > 4) {
                return "Neither";
            }

            // Check if all characters are valid hex digits
            for (char c : segment.toCharArray()) {
                if (hexDigits.indexOf(c) == -1) {
                    return "Neither";
                }
            }
        }

        return "IPv6";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We split the string, which takes O(n) time where n is the length of the input string
- We then iterate through the segments, checking each character
- In the worst case, we examine each character once, so overall O(n)

**Space Complexity: O(n)**

- When we split the string, we create an array of segments
- In the worst case (for IPv6), we store 8 segments, each up to 4 characters
- This gives us O(n) space where n is the length of the input

## Common Mistakes

1. **Not handling empty segments**: When splitting by dots or colons, empty strings can appear (e.g., `"192.168..1"` or `"2001::1"`). Many candidates forget to check if segments are empty.

2. **Incorrect leading zero handling for IPv4**: The requirement says "cannot contain leading zeros" but `"0.0.0.0"` is valid. Candidates often reject `"0"` or accept `"01"`. Remember: a single `"0"` is valid, but `"01"` is not.

3. **Missing range checks for IPv4**: Forgetting that each segment must be between 0-255 inclusive. Numbers like `256` or `-1` should be rejected.

4. **Case sensitivity in IPv6**: Hexadecimal digits can be uppercase or lowercase (`A-F` or `a-f`). Some implementations only check one case.

5. **Using the wrong split behavior**: In Java, `split()` by default removes trailing empty strings. Use `split("\\.", -1)` and `split(":", -1)` to include them for proper validation.

## When You'll See This Pattern

This type of string validation problem appears frequently in interviews and real-world scenarios:

1. **URL Validation**: Similar to validating IP addresses, URL validation requires checking multiple components (protocol, domain, path, query parameters) against specific rules.

2. **Email Validation**: Checking if an email address follows the correct format with local part, @ symbol, and domain with specific character rules.

3. **Credit Card Number Validation**: Validating Luhn algorithm and checking card number patterns for different card types.

4. **Date/Time Parsing**: Validating date strings in various formats (MM/DD/YYYY, DD-MM-YYYY, etc.) with leap year and month-day constraints.

The core pattern is: **parse a structured string into components, then validate each component against specific rules**. This pattern teaches you to break down complex validation into smaller, manageable checks.

## Key Takeaways

1. **Separate concerns**: Write separate validation functions for different formats. This makes your code cleaner, easier to test, and simpler to debug.

2. **Check edge cases methodically**: Create a mental checklist of all validation rules before coding. For IP validation: segment count, empty segments, character validity, numeric ranges, and special rules like no leading zeros.

3. **Use the right string methods**: Know how `split()` works in your language (especially regarding empty strings). Understand string methods like `isdigit()`, `isalnum()`, and regular expressions for pattern matching.

4. **Test with corner cases**: Always test with minimum/maximum values, empty strings, strings with extra delimiters, and strings with invalid characters at different positions.

Related problems: [IP to CIDR](/problem/ip-to-cidr), [Strong Password Checker II](/problem/strong-password-checker-ii)
