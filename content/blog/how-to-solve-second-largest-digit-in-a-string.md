---
title: "How to Solve Second Largest Digit in a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Second Largest Digit in a String. Easy difficulty, 53.8% acceptance rate. Topics: Hash Table, String."
date: "2027-07-07"
category: "dsa-patterns"
tags: ["second-largest-digit-in-a-string", "hash-table", "string", "easy"]
---

# How to Solve "Second Largest Digit in a String"

This problem asks us to find the **second largest numerical digit** in an alphanumeric string, returning `-1` if it doesn't exist. While conceptually simple, it's interesting because it tests your ability to filter relevant data from a mixed input and handle edge cases like duplicate digits and insufficient unique digits.

The tricky part isn't the algorithm itself but the careful handling of edge cases: what if there's only one unique digit? What if all digits are the same? What if there are no digits at all?

## Visual Walkthrough

Let's trace through an example: `s = "abc12345d3ef2"`

**Step 1: Extract all digits**

- Scan the string: `'1', '2', '3', '4', '5', '3', '2'`
- We get digits: `[1, 2, 3, 4, 5, 3, 2]`

**Step 2: Find unique digits**

- Remove duplicates: `{1, 2, 3, 4, 5}`
- We need at least 2 unique digits to have a second largest

**Step 3: Sort and find second largest**

- Sorted unique digits: `[1, 2, 3, 4, 5]`
- Second largest is `4` (second from the right end)

**Edge case example:** `s = "a1b1c1"`

- Digits: `[1, 1, 1]`
- Unique digits: `{1}`
- Only one unique digit → return `-1`

## Brute Force Approach

A naive approach would be:

1. Extract all digits from the string
2. Convert them to integers
3. Sort all digits (including duplicates)
4. Traverse from largest to find the second largest

The problem with this approach is it doesn't properly handle duplicates. If we sort `[1, 1, 2, 2, 3]`, the largest is `3`, but what's the second largest? `2` or the second `3`? We need **unique** digits for this problem.

A better brute force would be:

1. Extract digits and convert to integers
2. Store in a set to remove duplicates
3. If set has less than 2 elements, return `-1`
4. Sort the set and return the second largest

This is actually quite reasonable for this problem since strings are limited in length and digits are only 0-9. However, we can optimize by tracking the largest and second largest in a single pass.

## Optimal Solution

The optimal solution uses a single pass through the string while tracking:

- `largest`: the biggest digit seen so far
- `second_largest`: the second biggest unique digit seen so far

We initialize both to `-1` (meaning "not found yet"). For each character:

1. If it's a digit:
   - Convert to integer `d`
   - If `d > largest`: update `second_largest = largest`, then `largest = d`
   - Else if `d < largest` and `d > second_largest`: update `second_largest = d`
   - (We ignore `d == largest` to handle duplicates)

This approach runs in O(n) time with O(1) space, better than the O(n log n) sorting approach.

<div class="code-group">

```python
# Time: O(n) where n is length of string | Space: O(1)
def secondHighest(s: str) -> int:
    """
    Find the second largest unique digit in an alphanumeric string.

    Approach: Track largest and second largest digits in a single pass.
    Initialize both to -1 (not found). For each character:
    1. If it's a digit, convert to int d
    2. If d > largest: second_largest becomes largest, largest becomes d
    3. Else if d < largest and d > second_largest: update second_largest = d
    4. Ignore d == largest (handles duplicates)

    Returns second_largest (could be -1 if not found)
    """
    largest = -1      # Track the largest digit found
    second_largest = -1  # Track the second largest unique digit

    for char in s:
        if char.isdigit():  # Check if character is a digit
            d = int(char)   # Convert to integer

            # Case 1: Found new largest digit
            if d > largest:
                # Current largest becomes second largest
                second_largest = largest
                # Update largest to new digit
                largest = d
            # Case 2: Digit is between second_largest and largest
            # Must check d < largest to handle duplicates properly
            elif d < largest and d > second_largest:
                # Update second largest
                second_largest = d
            # Case 3: d == largest or d <= second_largest: ignore
            # This properly handles duplicate digits

    return second_largest
```

```javascript
// Time: O(n) where n is length of string | Space: O(1)
/**
 * Find the second largest unique digit in an alphanumeric string.
 *
 * Approach: Track largest and second largest digits in a single pass.
 * Initialize both to -1 (not found). For each character:
 * 1. If it's a digit, convert to int d
 * 2. If d > largest: second_largest becomes largest, largest becomes d
 * 3. Else if d < largest and d > second_largest: update second_largest = d
 * 4. Ignore d == largest (handles duplicates)
 *
 * Returns second_largest (could be -1 if not found)
 */
function secondHighest(s) {
  let largest = -1; // Track the largest digit found
  let secondLargest = -1; // Track the second largest unique digit

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Check if character is a digit (0-9)
    if (char >= "0" && char <= "9") {
      const d = parseInt(char, 10); // Convert to integer

      // Case 1: Found new largest digit
      if (d > largest) {
        // Current largest becomes second largest
        secondLargest = largest;
        // Update largest to new digit
        largest = d;
      }
      // Case 2: Digit is between secondLargest and largest
      // Must check d < largest to handle duplicates properly
      else if (d < largest && d > secondLargest) {
        // Update second largest
        secondLargest = d;
      }
      // Case 3: d == largest or d <= secondLargest: ignore
      // This properly handles duplicate digits
    }
  }

  return secondLargest;
}
```

```java
// Time: O(n) where n is length of string | Space: O(1)
/**
 * Find the second largest unique digit in an alphanumeric string.
 *
 * Approach: Track largest and second largest digits in a single pass.
 * Initialize both to -1 (not found). For each character:
 * 1. If it's a digit, convert to int d
 * 2. If d > largest: second_largest becomes largest, largest becomes d
 * 3. Else if d < largest and d > second_largest: update second_largest = d
 * 4. Ignore d == largest (handles duplicates)
 *
 * Returns second_largest (could be -1 if not found)
 */
public int secondHighest(String s) {
    int largest = -1;       // Track the largest digit found
    int secondLargest = -1; // Track the second largest unique digit

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        // Check if character is a digit (0-9)
        if (Character.isDigit(c)) {
            int d = c - '0';  // Convert char digit to int

            // Case 1: Found new largest digit
            if (d > largest) {
                // Current largest becomes second largest
                secondLargest = largest;
                // Update largest to new digit
                largest = d;
            }
            // Case 2: Digit is between secondLargest and largest
            // Must check d < largest to handle duplicates properly
            else if (d < largest && d > secondLargest) {
                // Update second largest
                secondLargest = d;
            }
            // Case 3: d == largest or d <= secondLargest: ignore
            // This properly handles duplicate digits
        }
    }

    return secondLargest;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, where n is the length of the string
- Each character requires O(1) operations: checking if it's a digit and comparing with current largest/second largest
- Even with the digit conversion, each operation is O(1)

**Space Complexity: O(1)**

- We only use a fixed number of integer variables (`largest`, `second_largest`)
- No additional data structures that grow with input size
- The input string is given, not counted in our space usage

## Common Mistakes

1. **Not handling duplicates properly**: The most common mistake is treating `[3, 3, 2, 1]` as having second largest = 3 (the second occurrence). The problem asks for second largest **unique** digit, so for `[3, 3, 2, 1]`, the answer should be 2. Always check `d < largest` before updating `second_largest`.

2. **Forgetting the "no digits" case**: If the string has no digits at all, both `largest` and `second_largest` remain -1, and we correctly return -1. But some implementations might initialize variables incorrectly and return wrong values.

3. **Incorrect digit conversion**: In Java, using `Integer.parseInt(String)` on a single character is inefficient. Use `c - '0'` instead. In JavaScript, `parseInt('a')` returns `NaN`, not an error, so check with `char >= '0' && char <= '9'` first.

4. **Off-by-one with initialization**: Initializing `largest = 0` fails for strings like `"abc0"` where the only digit is 0. With `largest = 0` initially, we'd never find 0 as the largest. Always initialize to -1.

## When You'll See This Pattern

This "track two extremes in one pass" pattern appears in several problems:

1. **Third Maximum Number (LeetCode 414)**: Similar concept but with three values to track instead of two. The same single-pass approach works.

2. **Maximum Product of Three Numbers (LeetCode 628)**: You need to track the two smallest and three largest numbers to find the maximum product.

3. **Find the Duplicate Number (LeetCode 287)**: While the algorithm is different, the concept of tracking specific values while iterating through data is similar.

The core pattern is: **When you need to find extreme values (largest, smallest, etc.) in a collection, consider whether you can track them in a single pass rather than sorting.**

## Key Takeaways

1. **Single-pass tracking beats sorting for fixed-size outputs**: When you only need a constant number of extreme values (largest, second largest, etc.), tracking them during iteration is O(n) vs O(n log n) for sorting.

2. **Handle duplicates explicitly**: Always check whether the problem wants unique values or allows duplicates. For "second largest," it usually means second largest unique value.

3. **Initialize sentinel values carefully**: Use values outside the valid range (like -1 for digits 0-9) to represent "not found yet." This handles edge cases cleanly.

Related problems: [Remove Digit From Number to Maximize Result](/problem/remove-digit-from-number-to-maximize-result)
