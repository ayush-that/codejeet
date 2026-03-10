---
title: "How to Solve Find Unique Binary String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Unique Binary String. Medium difficulty, 79.4% acceptance rate. Topics: Array, Hash Table, String, Backtracking."
date: "2028-01-04"
category: "dsa-patterns"
tags: ["find-unique-binary-string", "array", "hash-table", "string", "medium"]
---

# How to Solve Find Unique Binary String

You're given an array of `n` unique binary strings, each exactly `n` characters long. Your task is to find **any** binary string of length `n` that doesn't appear in the array. What makes this problem interesting is that while there are 2ⁿ possible binary strings of length `n`, only `n` of them are present in the input. This means there are 2ⁿ - `n` valid answers, and we just need to find one efficiently.

The challenge lies in avoiding the brute force approach of checking all 2ⁿ possibilities, which becomes impossible for larger `n`. Instead, we need a clever way to construct a missing string directly.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `nums = ["01", "10"]` (n=2).

**Step 1:** Understand what we're looking for

- We need a 2-character binary string
- The possible strings are: "00", "01", "10", "11"
- Our input contains "01" and "10"
- So valid answers are "00" or "11"

**Step 2:** The key insight
Notice something interesting about the diagonal:

- First string "01": character at index 0 is '0'
- Second string "10": character at index 1 is '0'

If we take the complement (flip) of each diagonal character:

- Flip '0' → '1' (from first string)
- Flip '0' → '1' (from second string)

We get "11", which is indeed a valid answer!

**Step 3:** Why this works
For any position `i`, we look at the `i`-th character of the `i`-th string. By flipping it, we guarantee our constructed string differs from the `i`-th string in at least the `i`-th position. Since this holds for all strings, our result can't match any string in the array.

Let's verify with another example: `nums = ["111", "011", "001"]` (n=3)

1. String 0 ("111"): char at index 0 = '1' → flip to '0'
2. String 1 ("011"): char at index 1 = '1' → flip to '0'
3. String 2 ("001"): char at index 2 = '1' → flip to '0'

Result: "000" (which isn't in the array)

## Brute Force Approach

The most straightforward approach would be:

1. Generate all possible binary strings of length `n`
2. Check each one against the strings in `nums`
3. Return the first one not found

The problem with this approach is scale. For `n=20`, there are 1,048,576 possible strings. While we only need to check until we find a missing one (and there are many missing), in the worst case we might check all 2ⁿ strings. This is exponential time complexity O(2ⁿ), which becomes impractical even for moderate `n`.

A naive implementation might look like:

```python
def findDifferentBinaryString(nums):
    n = len(nums)
    nums_set = set(nums)

    # Generate all binary strings of length n
    for i in range(2**n):
        # Convert to binary string with leading zeros
        binary_str = format(i, f'0{n}b')
        if binary_str not in nums_set:
            return binary_str
    return ""  # Should never reach here
```

This approach fails because it doesn't scale. Even with `n=16`, we're dealing with 65,536 possibilities, and the problem constraints could go higher.

## Optimized Approach

The key insight comes from the **pigeonhole principle**: There are 2ⁿ possible binary strings of length `n`, but only `n` strings in our array. Therefore, there must be many missing strings. We just need a systematic way to construct one.

**Cantor's Diagonal Argument** (simplified for this problem):

1. Consider constructing a new string where the `i`-th character differs from the `i`-th character of the `i`-th string in the array
2. For each position `i` from 0 to n-1:
   - Look at the `i`-th character of `nums[i]`
   - Flip it (0→1, 1→0)
   - Use this flipped character as the `i`-th character of our result
3. The resulting string cannot equal any string in the array because it differs from the `i`-th string at position `i`

This approach is guaranteed to work because:

- Our result has length `n` (meets the requirement)
- For any string `nums[i]` in the array, our result differs at position `i`
- Therefore, our result cannot match any string in the array

This is an O(n) time solution with O(n) space for building the result string.

## Optimal Solution

Here's the complete implementation using the diagonal construction approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string
def findDifferentBinaryString(nums):
    """
    Find a binary string of length n that doesn't appear in nums.
    Uses the diagonal construction method.
    """
    n = len(nums)
    result_chars = []

    # For each position i, look at the i-th character of nums[i]
    for i in range(n):
        # Get the i-th character of the i-th string
        current_char = nums[i][i]

        # Flip the character: '0' becomes '1', '1' becomes '0'
        flipped_char = '1' if current_char == '0' else '0'

        # Add the flipped character to our result
        result_chars.append(flipped_char)

    # Join all characters to form the final string
    return ''.join(result_chars)
```

```javascript
// Time: O(n) | Space: O(n) for the result string
function findDifferentBinaryString(nums) {
  /**
   * Find a binary string of length n that doesn't appear in nums.
   * Uses the diagonal construction method.
   */
  const n = nums.length;
  let result = "";

  // For each position i, look at the i-th character of nums[i]
  for (let i = 0; i < n; i++) {
    // Get the i-th character of the i-th string
    const currentChar = nums[i][i];

    // Flip the character: '0' becomes '1', '1' becomes '0'
    const flippedChar = currentChar === "0" ? "1" : "0";

    // Add the flipped character to our result
    result += flippedChar;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result string
class Solution {
    public String findDifferentBinaryString(String[] nums) {
        /**
         * Find a binary string of length n that doesn't appear in nums.
         * Uses the diagonal construction method.
         */
        int n = nums.length;
        StringBuilder result = new StringBuilder();

        // For each position i, look at the i-th character of nums[i]
        for (int i = 0; i < n; i++) {
            // Get the i-th character of the i-th string
            char currentChar = nums[i].charAt(i);

            // Flip the character: '0' becomes '1', '1' becomes '0'
            char flippedChar = (currentChar == '0') ? '1' : '0';

            // Add the flipped character to our result
            result.append(flippedChar);
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations for each of the `n` strings
- Each iteration involves: accessing a character (O(1)), flipping it (O(1)), and appending to the result (O(1) amortized)

**Space Complexity: O(n)**

- We need O(n) space to store the result string
- No additional data structures are required beyond the input and output
- The space used by the result string is necessary for the output

## Common Mistakes

1. **Off-by-one errors with indices**: When accessing `nums[i][i]`, it's easy to confuse rows and columns. Remember: first index selects the string, second index selects the character within that string.

2. **Forgetting to handle edge cases**: While the problem guarantees `n ≥ 1` and unique strings, candidates sometimes forget that `nums[i]` might be accessed out of bounds if they miscount. Always verify your loop boundaries.

3. **Overcomplicating the solution**: Some candidates try to use hash sets or generate all possible strings, not realizing the elegant diagonal construction exists. Look for patterns in the constraints: when you have `n` items but 2ⁿ possibilities, there's often a constructive solution.

4. **Incorrect character flipping**: Writing complex logic for flipping '0' to '1' and vice versa when a simple ternary/conditional operator suffices. Keep it simple: `'1' if char == '0' else '0'`.

## When You'll See This Pattern

This problem uses a **constructive existence proof** pattern, similar to Cantor's diagonal argument. You'll see similar patterns in:

1. **Missing Number (LeetCode 268)**: Find the missing number in a range 0..n. The optimal solution uses XOR or Gauss' formula to construct the answer directly rather than searching.

2. **Find All Duplicates in an Array (LeetCode 442)**: Find all elements that appear twice. The optimal solution modifies the array in-place to mark seen elements, constructing the answer through array indices.

3. **Random Pick with Blacklist (LeetCode 710)**: Generate random numbers excluding a blacklist. The optimal solution maps blacklisted numbers to valid ones, constructing a valid random pick directly.

The common thread: when you need to find something that satisfies constraints, sometimes you can construct it directly rather than searching through possibilities.

## Key Takeaways

1. **Look for constructive solutions when possibilities vastly outnumber constraints**: With 2ⁿ possible strings but only n present, don't search—construct a solution that's guaranteed to work by design.

2. **Diagonal arguments are powerful for uniqueness proofs**: When you need to ensure something differs from each item in a list, making it differ at a different position for each item is a reliable strategy.

3. **Simple solutions often beat complex ones**: The O(n) time, O(n) space solution with just a single loop is not only efficient but also easy to explain and implement correctly under interview pressure.

**Related problems:** [Missing Number](/problem/missing-number), [Find All Numbers Disappeared in an Array](/problem/find-all-numbers-disappeared-in-an-array), [Random Pick with Blacklist](/problem/random-pick-with-blacklist)
