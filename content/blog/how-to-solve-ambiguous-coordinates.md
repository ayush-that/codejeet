---
title: "How to Solve Ambiguous Coordinates — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Ambiguous Coordinates. Medium difficulty, 56.4% acceptance rate. Topics: String, Backtracking, Enumeration."
date: "2029-02-18"
category: "dsa-patterns"
tags: ["ambiguous-coordinates", "string", "backtracking", "enumeration", "medium"]
---

# How to Solve Ambiguous Coordinates

This problem asks us to reconstruct all possible valid coordinate pairs from a string where punctuation has been removed. Given a string like `"(123)"`, we need to return all possible ways to insert a comma and decimal points to create valid coordinates like `"(1, 23)"`, `"(1.2, 3)"`, etc. The challenge lies in systematically generating all valid decimal numbers from substrings while avoiding invalid formats like numbers with trailing zeros after the decimal or leading zeros in integers.

## Visual Walkthrough

Let's trace through the example `s = "(123)"`:

1. **Remove parentheses**: We work with `"123"` as our raw digits.
2. **Split for comma**: We need to decide where to place the comma separating x and y coordinates:
   - Split after 1st digit: `"1"` and `"23"`
   - Split after 2nd digit: `"12"` and `"3"`
   - Split after 3rd digit: Not allowed (y would be empty)
3. **Generate valid numbers for each part**:
   - For `"1"`: Only valid as integer `"1"`
   - For `"23"`: Can be `"23"` or `"2.3"`
   - For `"12"`: Can be `"12"` or `"1.2"`
   - For `"3"`: Only valid as integer `"3"`
4. **Combine possibilities**:
   - From split `"1"|"23"`: `"1"` × `"23"` = `"(1, 23)"`, `"1"` × `"2.3"` = `"(1, 2.3)"`
   - From split `"12"|"3"`: `"12"` × `"3"` = `"(12, 3)"`, `"1.2"` × `"3"` = `"(1.2, 3)"`
5. **Final result**: `["(1, 23)", "(1, 2.3)", "(12, 3)", "(1.2, 3)"]`

The key insight is that for each substring, we need to generate all valid decimal representations by placing the decimal point at every possible position (including no decimal point for integers).

## Brute Force Approach

A truly brute force approach would involve:

1. Generating all possible placements of comma and decimal points
2. Checking each resulting string for validity
3. Filtering out invalid coordinates

However, this would be extremely inefficient because for a string of length n, there are O(2^n) possible decimal point placements alone. Even for modest n=10, that's over 1000 combinations just for decimal points, plus comma placements.

The smarter "naive" approach that many candidates try first is to:

1. Try every possible split point for the comma
2. For each part, try placing decimal point at every position
3. Check if each resulting number is valid

This is actually close to the optimal approach! The difference is in how we validate numbers efficiently. The common mistake in a naive implementation is not properly handling edge cases like:

- `"0"` vs `"0.0"` (both valid but different)
- `"00"` (invalid as integer)
- `"1.0"` (valid) vs `"1.00"` (invalid due to trailing zero after decimal)
- `"0.1"` (valid) vs `".1"` (invalid - must have digit before decimal)

## Optimized Approach

The optimal approach follows this systematic process:

1. **Remove parentheses** from the input string to work with just the digits
2. **Iterate through all valid comma positions** - the comma must separate the string into two non-empty parts
3. **For each part, generate all valid decimal representations**:
   - If the part has only one digit OR doesn't start with '0', it's valid as an integer
   - For decimal points: try placing decimal after each position i (1 ≤ i < length)
     - Left part (before decimal) must be valid integer (no leading zero unless it's just "0")
     - Right part (after decimal) must not end with '0' (no trailing zeros in decimal part)
4. **Cross-multiply** valid x-coordinates with valid y-coordinates
5. **Format results** with parentheses and comma

The validation logic is crucial:

- Integer validation: Either length=1, or first digit ≠ '0'
- Decimal validation:
  - Integer part follows integer rules
  - Fractional part has no trailing zeros
  - Fractional part is non-empty

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n^3)
class Solution:
    def ambiguousCoordinates(self, s: str) -> List[str]:
        # Remove parentheses from input string
        s = s[1:-1]
        n = len(s)
        result = []

        # Try every possible split position for comma
        for i in range(1, n):
            left = s[:i]   # x-coordinate part
            right = s[i:]  # y-coordinate part

            # Generate all valid numbers for left part
            left_nums = self.generate_numbers(left)
            # Generate all valid numbers for right part
            right_nums = self.generate_numbers(right)

            # Cross multiply: combine every left number with every right number
            for l in left_nums:
                for r in right_nums:
                    result.append(f"({l}, {r})")

        return result

    def generate_numbers(self, s: str) -> List[str]:
        """Generate all valid decimal representations of string s"""
        n = len(s)
        valid_nums = []

        # Case 1: No decimal point (integer representation)
        # Valid if: length is 1, OR first digit is not '0'
        if n == 1 or s[0] != '0':
            valid_nums.append(s)

        # Case 2: With decimal point at various positions
        # Try placing decimal after position i (1 <= i < n)
        for i in range(1, n):
            integer_part = s[:i]
            fractional_part = s[i:]

            # Integer part must be valid:
            # - Single digit, OR first digit not '0'
            if len(integer_part) > 1 and integer_part[0] == '0':
                continue

            # Fractional part must not end with '0'
            if fractional_part[-1] == '0':
                continue

            valid_nums.append(f"{integer_part}.{fractional_part}")

        return valid_nums
```

```javascript
// Time: O(n^3) | Space: O(n^3)
/**
 * @param {string} s
 * @return {string[]}
 */
var ambiguousCoordinates = function (s) {
  // Remove parentheses from input string
  s = s.substring(1, s.length - 1);
  const n = s.length;
  const result = [];

  // Try every possible split position for comma
  for (let i = 1; i < n; i++) {
    const left = s.substring(0, i); // x-coordinate part
    const right = s.substring(i); // y-coordinate part

    // Generate all valid numbers for left part
    const leftNums = generateNumbers(left);
    // Generate all valid numbers for right part
    const rightNums = generateNumbers(right);

    // Cross multiply: combine every left number with every right number
    for (const l of leftNums) {
      for (const r of rightNums) {
        result.push(`(${l}, ${r})`);
      }
    }
  }

  return result;
};

/**
 * Generate all valid decimal representations of a string
 * @param {string} s - The digit string
 * @return {string[]} - List of valid number representations
 */
function generateNumbers(s) {
  const n = s.length;
  const validNums = [];

  // Case 1: No decimal point (integer representation)
  // Valid if: length is 1, OR first digit is not '0'
  if (n === 1 || s[0] !== "0") {
    validNums.push(s);
  }

  // Case 2: With decimal point at various positions
  // Try placing decimal after position i (1 <= i < n)
  for (let i = 1; i < n; i++) {
    const integerPart = s.substring(0, i);
    const fractionalPart = s.substring(i);

    // Integer part must be valid:
    // - Single digit, OR first digit not '0'
    if (integerPart.length > 1 && integerPart[0] === "0") {
      continue;
    }

    // Fractional part must not end with '0'
    if (fractionalPart[fractionalPart.length - 1] === "0") {
      continue;
    }

    validNums.push(`${integerPart}.${fractionalPart}`);
  }

  return validNums;
}
```

```java
// Time: O(n^3) | Space: O(n^3)
import java.util.*;

class Solution {
    public List<String> ambiguousCoordinates(String s) {
        // Remove parentheses from input string
        s = s.substring(1, s.length() - 1);
        int n = s.length();
        List<String> result = new ArrayList<>();

        // Try every possible split position for comma
        for (int i = 1; i < n; i++) {
            String left = s.substring(0, i);   // x-coordinate part
            String right = s.substring(i);     // y-coordinate part

            // Generate all valid numbers for left part
            List<String> leftNums = generateNumbers(left);
            // Generate all valid numbers for right part
            List<String> rightNums = generateNumbers(right);

            // Cross multiply: combine every left number with every right number
            for (String l : leftNums) {
                for (String r : rightNums) {
                    result.add("(" + l + ", " + r + ")");
                }
            }
        }

        return result;
    }

    private List<String> generateNumbers(String s) {
        int n = s.length();
        List<String> validNums = new ArrayList<>();

        // Case 1: No decimal point (integer representation)
        // Valid if: length is 1, OR first digit is not '0'
        if (n == 1 || s.charAt(0) != '0') {
            validNums.add(s);
        }

        // Case 2: With decimal point at various positions
        // Try placing decimal after position i (1 <= i < n)
        for (int i = 1; i < n; i++) {
            String integerPart = s.substring(0, i);
            String fractionalPart = s.substring(i);

            // Integer part must be valid:
            // - Single digit, OR first digit not '0'
            if (integerPart.length() > 1 && integerPart.charAt(0) == '0') {
                continue;
            }

            // Fractional part must not end with '0'
            if (fractionalPart.charAt(fractionalPart.length() - 1) == '0') {
                continue;
            }

            validNums.add(integerPart + "." + fractionalPart);
        }

        return validNums;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- We try O(n) split positions for the comma
- For each split, we generate numbers for both parts: O(n²) total for decimal point placements across both parts
- In worst case, each part can generate O(n) valid numbers, leading to O(n²) combinations to add to result
- Total: O(n) × O(n²) = O(n³)

**Space Complexity: O(n³)**

- We store all valid number representations: O(n²) in worst case (each substring can generate O(n) representations)
- The result contains O(n³) characters in total (each coordinate string has O(n) characters, and there are O(n²) of them)
- Auxiliary space for recursion/iteration is O(n)

## Common Mistakes

1. **Incorrect zero handling**: Forgetting that "0" is valid but "00" is not. A number like "001" is invalid as an integer but could be valid as "0.01" if the fractional part doesn't end with zero.

2. **Missing trailing zero check**: Allowing numbers like "1.0" or "2.50" which have trailing zeros in the fractional part. These are invalid because in decimal notation, trailing zeros after the decimal are not written.

3. **Wrong comma placement bounds**: Trying to place comma at position 0 or n (resulting in empty string for one coordinate). The comma must split the string into two non-empty parts.

4. **Not considering all decimal placements**: Only checking for integer representations or forgetting that the decimal point can be placed at any position (not just after the first digit).

## When You'll See This Pattern

This problem combines **string enumeration** with **constraint validation**, a pattern seen in:

1. **Restore IP Addresses (LeetCode 93)** - Similar concept of inserting dots in a string to form valid IP address segments, each with its own validation rules (0-255, no leading zeros unless it's just "0").

2. **Additive Number (LeetCode 306)** - Checking if a string can be split into a sequence of valid numbers that form an additive sequence, requiring similar validation of number representations.

3. **Split Array into Fibonacci Sequence (LeetCode 842)** - Another string splitting problem with validation rules for each segment and constraints on the sequence.

These problems all involve systematically trying split points while validating each segment according to specific rules.

## Key Takeaways

1. **Systematic enumeration with validation**: When a problem requires generating all valid combinations from a string, try all possible split points and validate each segment according to the problem's specific rules.

2. **Pay attention to number formatting rules**: Real-world constraints like "no leading zeros in integers" and "no trailing zeros in decimals" are common in interview problems and test attention to detail.

3. **Break complex validation into helper functions**: Isolating the number validation logic makes the code cleaner and easier to debug. The `generate_numbers` helper is key to managing complexity.

[Practice this problem on CodeJeet](/problem/ambiguous-coordinates)
