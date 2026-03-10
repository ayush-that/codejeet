---
title: "How to Solve Masking Personal Information — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Masking Personal Information. Medium difficulty, 54.1% acceptance rate. Topics: String."
date: "2029-03-20"
category: "dsa-patterns"
tags: ["masking-personal-information", "string", "medium"]
---

# How to Solve Masking Personal Information

This problem asks us to mask personal information strings that could be either email addresses or phone numbers. The tricky part is that we need to first determine which type of string we're dealing with, then apply different masking rules for each case. What makes this interesting is that it's not just about applying string transformations, but about correctly identifying the pattern and handling edge cases in both formats.

## Visual Walkthrough

Let's trace through two examples to build intuition:

**Example 1: Email Address**

```
Input: "LeetCode@LeetCode.com"
```

1. We see the string contains '@', so it's an email address
2. Split at '@': name = "LeetCode", domain = "LeetCode.com"
3. Convert name to lowercase: "leetcode"
4. Mask name: keep first and last character, replace middle with "**\***"
   - First char: 'l'
   - Last char: 'e' (from "leetcode")
   - Middle: "**\***"
   - Result: "l**\***e"
5. Domain stays as "leetcode.com" (lowercase)
6. Final: "l**\***e@leetcode.com"

**Example 2: Phone Number**

```
Input: "+1(234)567-890"
```

1. No '@' found, so it's a phone number
2. Remove all non-digit characters: "1234567890"
3. Count digits: 10 digits (US phone number)
4. Last 4 digits: "7890"
5. Based on digit count:
   - 10 digits: local number format
   - Mask: "**_-_**-7890"
6. Final: "**_-_**-7890"

## Brute Force Approach

A naive approach would be to try to handle both cases without proper validation or with overly complex conditional logic. For example:

1. Check if string contains '@' - if yes, treat as email
2. For email: manually find first and last characters by scanning
3. For phone: try to extract digits with multiple passes
4. Handle edge cases with ad-hoc fixes

The problem with this approach isn't time complexity (string operations are O(n)), but rather code complexity and error-proneness. Without clear separation of concerns and proper validation, we might:

- Misidentify strings with '@' in phone numbers (though per problem constraints, this won't happen)
- Incorrectly handle international phone numbers
- Make mistakes with index calculations for name masking
- Forget to handle case sensitivity properly

## Optimized Approach

The key insight is that we can cleanly separate the two cases and handle each with straightforward string operations:

1. **Email Detection**: Simply check if the string contains '@'. If yes, it's an email.
2. **Email Masking**:
   - Convert everything to lowercase first
   - Split at '@' to get name and domain
   - Mask name by keeping only first and last character, replacing middle with "**\***"
   - Recombine with '@'
3. **Phone Number Detection**: No '@' means it's a phone number
4. **Phone Number Masking**:
   - Extract all digits using a single pass or regex
   - Count digits to determine if it's local (10 digits) or international (more than 10)
   - Keep last 4 digits visible
   - Format with appropriate country code and dashes

The optimization comes from:

- Processing each character at most once
- Using simple boolean checks instead of complex pattern matching
- Building the result incrementally rather than with multiple full-string transformations

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is length of string | Space: O(n) for the result string
class Solution:
    def maskPII(self, s: str) -> str:
        # Step 1: Check if it's an email by looking for '@'
        if '@' in s:
            return self.mask_email(s)
        else:
            return self.mask_phone(s)

    def mask_email(self, s: str) -> str:
        # Convert entire email to lowercase as per requirements
        s = s.lower()

        # Find the position of '@' to split name and domain
        at_index = s.find('@')

        # Extract name (before '@') and domain (after '@')
        name = s[:at_index]
        domain = s[at_index + 1:]

        # Mask the name: first character + "*****" + last character
        masked_name = name[0] + "*****" + name[-1]

        # Combine masked name with domain
        return masked_name + "@" + domain

    def mask_phone(self, s: str) -> str:
        # Step 1: Extract only digits from the phone number
        digits = []
        for char in s:
            if char.isdigit():
                digits.append(char)

        # Convert list of digits to string for easier manipulation
        digits_str = ''.join(digits)
        n = len(digits_str)

        # Get the last 4 digits that will be visible
        last_four = digits_str[-4:]

        # Step 2: Determine format based on number of digits
        if n == 10:
            # Local number: ***-***-XXXX
            return "***-***-" + last_four
        else:
            # International number: +XXX-***-***-XXXX
            # Country code is first (n-10) digits
            country_code = digits_str[:n-10]
            return "+" + "*" * len(country_code) + "-***-***-" + last_four
```

```javascript
// Time: O(n) where n is length of string | Space: O(n) for the result string
/**
 * @param {string} s
 * @return {string}
 */
var maskPII = function (s) {
  // Step 1: Check if it's an email by looking for '@'
  if (s.includes("@")) {
    return maskEmail(s);
  } else {
    return maskPhone(s);
  }
};

function maskEmail(s) {
  // Convert entire email to lowercase
  s = s.toLowerCase();

  // Find the position of '@' to split name and domain
  const atIndex = s.indexOf("@");

  // Extract name (before '@') and domain (after '@')
  const name = s.substring(0, atIndex);
  const domain = s.substring(atIndex + 1);

  // Mask the name: first character + "*****" + last character
  const maskedName = name[0] + "*****" + name[name.length - 1];

  // Combine masked name with domain
  return maskedName + "@" + domain;
}

function maskPhone(s) {
  // Step 1: Extract only digits from the phone number
  let digits = "";
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char >= "0" && char <= "9") {
      digits += char;
    }
  }

  const n = digits.length;
  // Get the last 4 digits that will be visible
  const lastFour = digits.substring(n - 4);

  // Step 2: Determine format based on number of digits
  if (n === 10) {
    // Local number: ***-***-XXXX
    return "***-***-" + lastFour;
  } else {
    // International number: +XXX-***-***-XXXX
    // Country code is first (n-10) digits
    const countryCodeLength = n - 10;
    return "+" + "*".repeat(countryCodeLength) + "-***-***-" + lastFour;
  }
}
```

```java
// Time: O(n) where n is length of string | Space: O(n) for the result string
class Solution {
    public String maskPII(String s) {
        // Step 1: Check if it's an email by looking for '@'
        if (s.contains("@")) {
            return maskEmail(s);
        } else {
            return maskPhone(s);
        }
    }

    private String maskEmail(String s) {
        // Convert entire email to lowercase
        s = s.toLowerCase();

        // Find the position of '@' to split name and domain
        int atIndex = s.indexOf('@');

        // Extract name (before '@') and domain (after '@')
        String name = s.substring(0, atIndex);
        String domain = s.substring(atIndex + 1);

        // Mask the name: first character + "*****" + last character
        String maskedName = name.charAt(0) + "*****" + name.charAt(name.length() - 1);

        // Combine masked name with domain
        return maskedName + "@" + domain;
    }

    private String maskPhone(String s) {
        // Step 1: Extract only digits from the phone number
        StringBuilder digits = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                digits.append(c);
            }
        }

        String digitsStr = digits.toString();
        int n = digitsStr.length();

        // Get the last 4 digits that will be visible
        String lastFour = digitsStr.substring(n - 4);

        // Step 2: Determine format based on number of digits
        if (n == 10) {
            // Local number: ***-***-XXXX
            return "***-***-" + lastFour;
        } else {
            // International number: +XXX-***-***-XXXX
            // Country code is first (n-10) digits
            int countryCodeLength = n - 10;
            StringBuilder countryCodeMask = new StringBuilder();
            for (int i = 0; i < countryCodeLength; i++) {
                countryCodeMask.append('*');
            }
            return "+" + countryCodeMask.toString() + "-***-***-" + lastFour;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string to check for '@' (O(n))
- For emails: We process the string once to convert to lowercase and find '@', then constant time operations
- For phones: We make one pass to extract digits (O(n)), then constant time operations for formatting
- Overall linear time relative to input size

**Space Complexity: O(n)**

- We create new strings for the result (O(n))
- For emails: We store lowercase version, name, domain, and result
- For phones: We store extracted digits and result
- In all cases, the space used is proportional to input size

## Common Mistakes

1. **Forgetting to handle case sensitivity for emails**: The problem requires emails to be output in lowercase. A common mistake is to mask the name while preserving its original case, or forgetting to lowercase the domain.

2. **Incorrect name masking for very short names**: While the problem guarantees names have at least 2 characters, candidates sometimes write code that would fail if name length was 2. For "ab@example.com", the masked version should be "a**\***b" (not "ab" or "a**\***").

3. **Mishandling phone number digit extraction**: Using complex regex or multiple string replacements instead of a simple digit check. Also, forgetting that phone numbers can have various separators (parentheses, spaces, dashes, plus signs).

4. **Wrong country code calculation for international numbers**: The formula is `n - 10` where n is total digits. Some candidates mistakenly use fixed lengths or miscalculate when n < 10 (which shouldn't happen per constraints).

## When You'll See This Pattern

This problem combines string processing with conditional logic based on pattern detection. You'll see similar patterns in:

1. **Valid Phone Number (LeetCode 1694)**: Also involves parsing and formatting phone numbers with specific rules.

2. **Reformat Date (LeetCode 1507)**: Requires parsing different date formats and converting to a standard format.

3. **Goat Latin (LeetCode 824)**: Applies different transformation rules based on whether a word starts with a vowel or consonant.

The common thread is: "Identify the pattern, then apply the appropriate transformation." These problems test your ability to handle edge cases and write clean, maintainable string manipulation code.

## Key Takeaways

1. **Separate concerns with helper functions**: Breaking the problem into `maskEmail` and `maskPhone` functions makes the code cleaner, more readable, and easier to debug.

2. **Process strings efficiently**: Use single passes when possible. For phone numbers, extract digits in one pass rather than multiple replace operations.

3. **Validate your assumptions**: While the problem guarantees valid inputs, thinking about edge cases (very short names, various phone formats) helps write more robust code.

[Practice this problem on CodeJeet](/problem/masking-personal-information)
