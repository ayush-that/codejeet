---
title: "How to Solve Maximum Value of a String in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Value of a String in an Array. Easy difficulty, 74.1% acceptance rate. Topics: Array, String."
date: "2028-03-26"
category: "dsa-patterns"
tags: ["maximum-value-of-a-string-in-an-array", "array", "string", "easy"]
---

# How to Solve Maximum Value of a String in an Array

This problem asks us to find the maximum "value" in an array of alphanumeric strings, where a string's value is either its numeric representation (if it contains only digits) or its length (if it contains any letters). While conceptually straightforward, this problem tests your ability to handle string validation, type conversion, and edge cases efficiently.

What makes this interesting is the dual definition of "value" — you can't simply convert every string to a number, and you can't just take lengths. You need to first determine whether a string is purely numeric before deciding how to evaluate it.

## Visual Walkthrough

Let's trace through an example: `["alic3", "bob", "3", "4", "00000"]`

1. **"alic3"**: Contains letters, so we use its length → value = 5
2. **"bob"**: Contains letters, so we use its length → value = 3
3. **"3"**: Only digits, so we convert to integer → value = 3
4. **"4"**: Only digits, so we convert to integer → value = 4
5. **"00000"**: Only digits, so we convert to integer → value = 0 (leading zeros don't matter)

Now we compare: 5, 3, 3, 4, 0 → maximum is 5

Notice that "00000" has length 5 but numeric value 0 — this is a key edge case! The problem says to use the numeric representation for digit-only strings, not their length.

## Brute Force Approach

The most straightforward approach would be to:

1. Initialize a variable to track the maximum value
2. For each string in the array:
   - Check if it contains only digits
   - If yes, convert to integer and compare with current max
   - If no, use the length and compare with current max
3. Return the maximum value

This is actually already optimal for this problem! The "brute force" here would be any approach that examines every string, which we must do anyway. However, some candidates might try unnecessary optimizations or make the solution more complex than needed.

The key insight is that we need to examine each string exactly once, and for each string we need to determine if it's numeric. Any solution that does this is essentially optimal.

## Optimal Solution

The optimal solution follows the brute force logic but implements it cleanly. We iterate through each string, check if it's numeric using string methods (not regex, which would be slower), and calculate its value accordingly.

<div class="code-group">

```python
# Time: O(n * m) where n = number of strings, m = average string length
# Space: O(1) - we only use a constant amount of extra space
def maximumValue(strs):
    """
    Returns the maximum value from an array of strings.
    Value is either the integer representation (if all digits) or length.
    """
    max_val = 0  # Initialize maximum value

    for s in strs:
        # Check if string contains only digits
        if s.isdigit():
            # Convert to integer for numeric value
            val = int(s)
        else:
            # Use length for strings with letters
            val = len(s)

        # Update maximum if current value is larger
        if val > max_val:
            max_val = val

    return max_val
```

```javascript
// Time: O(n * m) where n = number of strings, m = average string length
// Space: O(1) - constant extra space
function maximumValue(strs) {
  /**
   * Returns the maximum value from an array of strings.
   * Value is either the integer representation (if all digits) or length.
   */
  let maxVal = 0; // Initialize maximum value

  for (let s of strs) {
    let val;

    // Check if string contains only digits using regex
    // ^ matches start, $ matches end, \d+ matches one or more digits
    if (/^\d+$/.test(s)) {
      // Convert to integer for numeric value
      // parseInt handles leading zeros correctly
      val = parseInt(s, 10);
    } else {
      // Use length for strings with letters
      val = s.length;
    }

    // Update maximum if current value is larger
    if (val > maxVal) {
      maxVal = val;
    }
  }

  return maxVal;
}
```

```java
// Time: O(n * m) where n = number of strings, m = average string length
// Space: O(1) - constant extra space
class Solution {
    public int maximumValue(String[] strs) {
        /**
         * Returns the maximum value from an array of strings.
         * Value is either the integer representation (if all digits) or length.
         */
        int maxVal = 0;  // Initialize maximum value

        for (String s : strs) {
            int val;

            // Check if string contains only digits
            if (isNumeric(s)) {
                // Convert to integer for numeric value
                // Integer.parseInt handles leading zeros correctly
                val = Integer.parseInt(s);
            } else {
                // Use length for strings with letters
                val = s.length();
            }

            // Update maximum if current value is larger
            if (val > maxVal) {
                maxVal = val;
            }
        }

        return maxVal;
    }

    // Helper method to check if a string contains only digits
    private boolean isNumeric(String s) {
        for (char c : s.toCharArray()) {
            if (!Character.isDigit(c)) {
                return false;
            }
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- `n` is the number of strings in the input array
- `m` is the average length of the strings
- We examine each character of each string once to check if it's numeric
- In the worst case (all strings are numeric), we examine every character twice: once to check if numeric, once during conversion

**Space Complexity: O(1)**

- We only use a few integer variables (`max_val`, `val`)
- No additional data structures that grow with input size
- Even the string conversion operations typically create temporary objects, but these don't accumulate

## Common Mistakes

1. **Using the wrong check for numeric strings**: Some candidates use `int(s)` with try-catch or check only the first character. You must verify ALL characters are digits. In Python, `s.isdigit()` is correct; in Java, you need to check each character.

2. **Forgetting about leading zeros**: Strings like "000123" or "00000" should be converted to their integer values (123 and 0 respectively), not their lengths. The integer conversion handles leading zeros automatically.

3. **Not handling empty strings**: While the problem doesn't specify, an empty string "" would have value 0 (length 0). Make sure your solution handles this edge case gracefully.

4. **Overcomplicating with regex**: While regex works, a simple character-by-character check is often clearer and more efficient. In JavaScript, regex is reasonable, but in Python and Java, built-in methods are better.

5. **Starting with max value as -1 instead of 0**: Since all values are non-negative (lengths are ≥ 0, numeric values are ≥ 0), starting at 0 is safe and simpler.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **String validation with conditional logic**: Similar to problems like "Valid Palindrome" or "Valid Number" where you need to check string properties before processing.

2. **Array scanning with max tracking**: The core pattern of iterating through an array while tracking a maximum appears in many problems like "Maximum Subarray", "Best Time to Buy and Sell Stock", and "Maximum Product Subarray".

3. **Dual interpretation based on content**: Problems like "String to Integer (atoi)" or "Decode String" also require interpreting strings differently based on their content.

Specific related problems:

- **Maximum Subarray (53)**: Similar scanning with max tracking, but with more complex value calculation
- **Valid Palindrome (125)**: Similar string validation with character-by-character checking
- **String to Integer (atoi) (8)**: Similar concept of converting strings to numbers with validation rules

## Key Takeaways

1. **Read the problem definition carefully**: The dual definition of "value" is the core challenge. Many candidates miss that digit-only strings use their numeric value, not length.

2. **Use appropriate string methods**: Each language has optimized methods for checking string properties (`isdigit()` in Python, regex or manual checking in JavaScript/Java).

3. **Keep it simple**: This is an Easy problem for a reason — the optimal solution is straightforward. Don't overengineer with unnecessary data structures or complex logic.

4. **Test edge cases**: Always test with strings containing only zeros, mixed characters, single characters, and empty strings to ensure your solution handles all cases.

Related problems: [Maximum Subarray](/problem/maximum-subarray)
