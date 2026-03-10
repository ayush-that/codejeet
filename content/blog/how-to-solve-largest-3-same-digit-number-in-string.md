---
title: "How to Solve Largest 3-Same-Digit Number in String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest 3-Same-Digit Number in String. Easy difficulty, 72.7% acceptance rate. Topics: String."
date: "2027-11-22"
category: "dsa-patterns"
tags: ["largest-3-same-digit-number-in-string", "string", "easy"]
---

# How to Solve Largest 3-Same-Digit Number in String

This problem asks us to find the largest 3-digit substring where all three digits are identical, or return an empty string if none exists. While conceptually simple, it's interesting because it tests your ability to work with string boundaries, compare numerical strings correctly, and handle edge cases efficiently.

## Visual Walkthrough

Let's trace through an example: `num = "6777133339"`

We need to find all length-3 substrings where all digits are the same, then return the largest one.

1. Start at index 0: "677" → digits aren't all the same
2. Index 1: "777" → all same! Current best: "777"
3. Index 2: "771" → not all same
4. Index 3: "713" → not all same
5. Index 4: "133" → all same! Compare "133" vs "777" → "777" is larger
6. Index 5: "333" → all same! Compare "333" vs "777" → "777" is larger
7. Index 6: "333" → all same! Compare "333" vs "777" → "777" is larger
8. Index 7: "339" → not all same

We can't go beyond index 7 because we need 3 characters. Final answer: "777"

Notice that comparing strings like "777" > "333" works because string comparison compares character by character, and '7' > '3' in ASCII/Unicode.

## Brute Force Approach

A naive approach would be to check every possible 3-digit substring:

1. Generate all length-3 substrings
2. Check if all characters are the same
3. Keep track of the largest valid substring

While this approach would work, it's inefficient because we're checking every substring even when we could stop early or use a more direct approach. However, since the string length is at most 1000, even the brute force would be acceptable. The real issue with a true brute force would be unnecessary complexity in implementation.

What some candidates might try incorrectly:

- Converting substrings to integers for comparison (risks overflow with large numbers)
- Using complex data structures when simple iteration suffices
- Checking all possible substrings instead of just adjacent triples

## Optimal Solution

The optimal solution is straightforward: iterate through the string, checking each position where we can form a 3-character substring. For each valid position, check if all three characters are equal. If they are, compare it with our current best result.

The key insight is that we only need to check consecutive characters, and we can compare the substrings directly as strings since they're all the same length.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) - we only store a few variables
def largestGoodInteger(num: str) -> str:
    """
    Find the largest 3-digit substring where all digits are identical.

    Args:
        num: Input string representing a large integer

    Returns:
        The largest good integer as a string, or empty string if none exists
    """
    # Initialize result as empty string (default if no good integer found)
    result = ""

    # Iterate through the string, stopping 2 characters before the end
    # because we need 3 characters to form a valid substring
    for i in range(len(num) - 2):
        # Check if current character and next two are all the same
        if num[i] == num[i + 1] == num[i + 2]:
            # Extract the 3-character substring
            current = num[i:i + 3]

            # Update result if current is larger than existing result
            # String comparison works because all strings are same length
            # and we're comparing digit characters
            if current > result:
                result = current

    return result
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) - we only store a few variables
function largestGoodInteger(num) {
  /**
   * Find the largest 3-digit substring where all digits are identical.
   *
   * @param {string} num - Input string representing a large integer
   * @return {string} - The largest good integer as a string, or empty string if none exists
   */
  let result = "";

  // Iterate through the string, stopping 2 characters before the end
  // because we need 3 characters to form a valid substring
  for (let i = 0; i < num.length - 2; i++) {
    // Check if current character and next two are all the same
    if (num[i] === num[i + 1] && num[i] === num[i + 2]) {
      // Extract the 3-character substring
      const current = num.substring(i, i + 3);

      // Update result if current is larger than existing result
      // String comparison works because all strings are same length
      if (current > result) {
        result = current;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) - we only store a few variables
class Solution {
    public String largestGoodInteger(String num) {
        /**
         * Find the largest 3-digit substring where all digits are identical.
         *
         * @param num - Input string representing a large integer
         * @return The largest good integer as a string, or empty string if none exists
         */
        String result = "";

        // Iterate through the string, stopping 2 characters before the end
        // because we need 3 characters to form a valid substring
        for (int i = 0; i < num.length() - 2; i++) {
            // Check if current character and next two are all the same
            if (num.charAt(i) == num.charAt(i + 1) &&
                num.charAt(i) == num.charAt(i + 2)) {

                // Extract the 3-character substring
                String current = num.substring(i, i + 3);

                // Update result if current is larger than existing result
                // String comparison works because all strings are same length
                if (current.compareTo(result) > 0) {
                    result = current;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, checking each position where a 3-digit substring can start
- For each position, we perform constant-time operations: character comparisons and string extraction
- Even though we check up to n-2 positions, this is still O(n)

**Space Complexity: O(1)**

- We only use a few variables: `result` and `current` (or loop counter)
- No additional data structures that grow with input size
- The substring extraction creates new strings, but these are at most length 3 and we don't store all of them simultaneously

## Common Mistakes

1. **Off-by-one errors in loop bounds**: Forgetting that the loop should stop at `len(num) - 2` instead of `len(num) - 1` or `len(num)`. If you go to `len(num) - 1`, you'll try to access `num[i+2]` which could be out of bounds.

2. **Incorrect string comparison**: Trying to convert to integers for comparison. While this works for this problem, it's unnecessary and could cause issues with very large numbers in other contexts. String comparison works perfectly for equal-length digit strings.

3. **Not handling empty string input**: While the problem guarantees at least one digit, in real interviews you should consider edge cases. An empty string would cause index errors if not handled.

4. **Checking unnecessary positions**: Some candidates check every possible 3-character combination instead of just consecutive ones. The problem specifies "substring" which means consecutive characters.

5. **Forgetting to initialize result properly**: Starting with `result = "0"` instead of `result = ""` would fail for inputs like "000" where "000" should be returned, not "0".

## When You'll See This Pattern

This problem uses a **sliding window of fixed size** pattern, which appears in many string and array problems:

1. **Maximum Average Subarray I (LeetCode 643)**: Find a contiguous subarray of fixed length with maximum average value.

2. **Find All Anagrams in a String (LeetCode 438)**: Find all start indices of anagram substrings of a fixed length.

3. **Permutation in String (LeetCode 567)**: Check if one string contains a permutation of another as a substring.

The pattern involves maintaining a window of fixed size as you slide through the data structure, updating your answer based on what enters and leaves the window.

## Key Takeaways

1. **Fixed-size sliding window**: When you need to examine all contiguous subarrays/substrings of a specific length, use a single loop with careful boundary checking.

2. **String comparison for equal-length digit strings**: For comparing numbers represented as strings of equal length, you can compare them lexicographically without converting to integers.

3. **Edge case awareness**: Always check loop boundaries and consider what happens with minimum valid input sizes. Drawing out small examples helps avoid off-by-one errors.

4. **Simplicity over complexity**: Sometimes the most straightforward solution is also the optimal one. Don't overcomplicate problems that have clear, linear solutions.

Related problems: [Largest Odd Number in String](/problem/largest-odd-number-in-string)
