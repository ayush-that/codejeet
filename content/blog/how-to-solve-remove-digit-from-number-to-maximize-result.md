---
title: "How to Solve Remove Digit From Number to Maximize Result — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove Digit From Number to Maximize Result. Easy difficulty, 48.2% acceptance rate. Topics: String, Greedy, Enumeration."
date: "2027-01-05"
category: "dsa-patterns"
tags: ["remove-digit-from-number-to-maximize-result", "string", "greedy", "enumeration", "easy"]
---

# How to Solve "Remove Digit From Number to Maximize Result"

You're given a string `number` representing a positive integer and a character `digit`. You need to remove exactly one occurrence of `digit` from `number` to create the largest possible resulting number. What makes this problem interesting is that removing the first occurrence of `digit` isn't always optimal—you need to strategically choose which occurrence to remove based on what digit follows it.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `number = "1231"` and `digit = "1"`.

**Step 1:** Identify all positions where `digit` appears:

- Position 0: "1" (followed by "2")
- Position 3: "1" (followed by nothing, since it's the last digit)

**Step 2:** For each occurrence, consider what happens when we remove it:

- Remove the "1" at position 0: `"231"` remains
- Remove the "1" at position 3: `"123"` remains

**Step 3:** Compare the results:

- `"231"` vs `"123"` → `231` is larger

**Why does this work?** When we remove a digit, the digits after it shift left. If the digit immediately after the removed digit is larger than the removed digit, we get a bigger number. In our example, removing the first "1" exposes "2", which is larger than "1", giving us a bigger number than keeping the "1" and removing the last one.

Let's try another: `number = "551"`, `digit = "5"`:

- Position 0: "5" (followed by "5")
- Position 1: "5" (followed by "1")

Removing each:

- Remove position 0: `"51"`
- Remove position 1: `"51"`

Both give the same result! But wait—what if we have `number = "133235"`, `digit = "3"`:

- Position 1: "3" (followed by "3")
- Position 2: "3" (followed by "2")
- Position 4: "3" (followed by "5")

Removing each:

- Position 1: `"13235"`
- Position 2: `"13235"` (same as above)
- Position 4: `"13325"`

The largest is `"13325"`! Notice the pattern: we should remove the first occurrence where the next digit is **greater** than `digit`. If no such occurrence exists (all following digits are ≤ `digit`), remove the last occurrence.

## Brute Force Approach

The brute force approach is straightforward: try removing each occurrence of `digit` one by one, compare the resulting strings, and return the largest.

**Algorithm:**

1. Initialize `max_result` as an empty string
2. For each index `i` where `number[i] == digit`:
   - Create a new string by removing character at index `i`
   - Compare this string with `max_result`
   - Update `max_result` if the new string is larger
3. Return `max_result`

**Why this works but isn't optimal:**

- It correctly finds the maximum by checking all possibilities
- However, it creates a new string for each occurrence of `digit`, which takes O(n) time per operation
- If `digit` appears k times, time complexity is O(k × n), which could be O(n²) in worst case (when all digits are the same as `digit`)

While this would technically work for the constraints (n ≤ 100), it's inefficient and doesn't demonstrate optimal problem-solving. Interviewers expect the greedy approach.

## Optimal Solution

The optimal solution uses a greedy approach: scan from left to right and remove the first occurrence where the next digit is greater than `digit`. If no such occurrence exists, remove the last occurrence.

**Why this greedy approach works:**

1. When we remove a digit, all digits to its right shift left
2. If the digit immediately after the removed one is larger, we increase the number's value at that position
3. We want to make the leftmost positions as large as possible (since they have higher place value)
4. Therefore, we should remove the leftmost digit where removing it gives us a larger digit in that position

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string
def removeDigit(number: str, digit: str) -> str:
    """
    Remove exactly one occurrence of digit from number to maximize result.

    Strategy: Scan from left to right. Remove the first occurrence where
    the next digit is greater than digit. If no such occurrence exists,
    remove the last occurrence.
    """
    last_index = -1  # Track the last occurrence of digit

    # Scan through the number from left to right
    for i in range(len(number)):
        if number[i] == digit:
            # Store this as a potential removal point (last occurrence)
            last_index = i

            # Check if this is not the last digit AND the next digit is greater
            if i + 1 < len(number) and number[i + 1] > digit:
                # Found optimal removal point: removing here exposes a larger digit
                # Build result by skipping character at index i
                return number[:i] + number[i + 1:]

    # If we get here, no digit had a larger digit after it
    # Remove the last occurrence we found
    return number[:last_index] + number[last_index + 1:]
```

```javascript
// Time: O(n) | Space: O(n) for the result string
function removeDigit(number, digit) {
  /**
   * Remove exactly one occurrence of digit from number to maximize result.
   *
   * Strategy: Scan from left to right. Remove the first occurrence where
   * the next digit is greater than digit. If no such occurrence exists,
   * remove the last occurrence.
   */
  let lastIndex = -1; // Track the last occurrence of digit

  // Scan through the number from left to right
  for (let i = 0; i < number.length; i++) {
    if (number[i] === digit) {
      // Store this as a potential removal point (last occurrence)
      lastIndex = i;

      // Check if this is not the last digit AND the next digit is greater
      if (i + 1 < number.length && number[i + 1] > digit) {
        // Found optimal removal point: removing here exposes a larger digit
        // Build result by skipping character at index i
        return number.slice(0, i) + number.slice(i + 1);
      }
    }
  }

  // If we get here, no digit had a larger digit after it
  // Remove the last occurrence we found
  return number.slice(0, lastIndex) + number.slice(lastIndex + 1);
}
```

```java
// Time: O(n) | Space: O(n) for the result string
class Solution {
    public String removeDigit(String number, char digit) {
        /**
         * Remove exactly one occurrence of digit from number to maximize result.
         *
         * Strategy: Scan from left to right. Remove the first occurrence where
         * the next digit is greater than digit. If no such occurrence exists,
         * remove the last occurrence.
         */
        int lastIndex = -1;  // Track the last occurrence of digit

        // Scan through the number from left to right
        for (int i = 0; i < number.length(); i++) {
            if (number.charAt(i) == digit) {
                // Store this as a potential removal point (last occurrence)
                lastIndex = i;

                // Check if this is not the last digit AND the next digit is greater
                if (i + 1 < number.length() && number.charAt(i + 1) > digit) {
                    // Found optimal removal point: removing here exposes a larger digit
                    // Build result by skipping character at index i
                    return number.substring(0, i) + number.substring(i + 1);
                }
            }
        }

        // If we get here, no digit had a larger digit after it
        // Remove the last occurrence we found
        return number.substring(0, lastIndex) + number.substring(lastIndex + 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string to find the optimal removal point
- Each character is examined exactly once
- String concatenation/substring operations take O(n) time, but we only do this once at the end

**Space Complexity: O(n)**

- We need to store the resulting string, which has length n-1
- The algorithm itself uses only O(1) extra space for variables
- The output requires O(n) space regardless of algorithm

## Common Mistakes

1. **Removing the first occurrence always:** This is the most common mistake. Candidates see "remove digit" and think to just find and remove the first match. Example: `"1231"` with `digit = "1"` would give `"231"` if you remove the first occurrence, but `"123"` if you remove the last—and `231 > 123`.

2. **Not handling the last digit correctly:** When the digit appears at the end of the string, there's no "next digit" to compare with. You need to handle this edge case. The algorithm handles this by only checking `i + 1 < len(number)` before comparing.

3. **Comparing characters as strings instead of digits:** In some languages, comparing `'5' > '3'` works correctly because characters are compared by their ASCII values (digits 0-9 have consecutive ASCII codes). However, being explicit about the comparison logic makes the code clearer.

4. **Forgetting to track the last occurrence:** If you only look for the first occurrence with a larger next digit and don't track the last occurrence, you'll fail when no such occurrence exists (e.g., `"551"` with `digit = "5"`).

## When You'll See This Pattern

This greedy "remove for maximum" pattern appears in several string manipulation problems:

1. **Remove K Digits (Medium):** Similar concept but with k removals instead of one. You need to maintain a monotonic stack to ensure you always remove digits that allow larger digits to move left.

2. **Create Maximum Number (Hard):** Combines this pattern with merge operations—you need to create the largest possible number by choosing k digits from two arrays.

3. **Maximum Swap (Medium):** Instead of removing, you swap digits to maximize the number. The greedy approach involves finding the rightmost largest digit and swapping it with a smaller digit to its left.

The core insight is that to maximize a number, you want larger digits in more significant (leftmost) positions. Any operation that moves a larger digit leftward (by removing a smaller digit before it or swapping) increases the number's value.

## Key Takeaways

1. **Leftmost positions matter most:** When maximizing a number, prioritize making leftmost digits as large as possible because they have higher place value.

2. **Greedy with local optimization:** This problem demonstrates a classic greedy approach where making the locally optimal choice (removing a digit when it exposes a larger digit immediately after) leads to the globally optimal solution.

3. **Edge cases matter:** Always test with the digit at the beginning, middle, and end of the string. Also test cases where all digits are the same, and cases where multiple removals give the same result.

**Related problems:** [Remove K Digits](/problem/remove-k-digits), [Remove Vowels from a String](/problem/remove-vowels-from-a-string), [Second Largest Digit in a String](/problem/second-largest-digit-in-a-string)
