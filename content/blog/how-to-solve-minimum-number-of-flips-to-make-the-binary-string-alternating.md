---
title: "How to Solve Minimum Number of Flips to Make the Binary String Alternating — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Flips to Make the Binary String Alternating. Medium difficulty, 41.1% acceptance rate. Topics: String, Dynamic Programming, Sliding Window."
date: "2029-01-11"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-flips-to-make-the-binary-string-alternating",
    "string",
    "dynamic-programming",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Minimum Number of Flips to Make the Binary String Alternating

This problem asks us to find the minimum number of flips (changing `0` to `1` or `1` to `0`) needed to make a binary string alternating, where we can also rotate the string by moving the first character to the end. The challenge is that we need to consider all possible rotations efficiently — a brute force approach would be too slow for strings up to length 10⁵.

## Visual Walkthrough

Let's trace through an example: `s = "111000"`

We want to make the string alternating (either `"010101"` or `"101010"`) with minimal flips. We can also rotate the string.

**Without rotation:**

- Target pattern 1: `"101010"` → Compare with `"111000"`: mismatches at positions 0,2,3,5 = 4 flips
- Target pattern 2: `"010101"` → Compare with `"111000"`: mismatches at positions 1,4 = 2 flips
  So without rotation, minimum is 2 flips.

**But rotation might help!** Let's try rotating once: `s = "110001"`

- Compare with `"101010"`: mismatches at positions 0,1,3,5 = 4 flips
- Compare with `"010101"`: mismatches at positions 2,4 = 2 flips

Rotate again: `s = "100011"`

- `"101010"`: mismatches at positions 0,2,3,4,5 = 5 flips
- `"010101"`: mismatches at position 1 = 1 flip! This is better.

The key insight: we need to check **all rotations** against **both alternating patterns** and find the minimum flips. But checking each rotation separately would be O(n²), which is too slow for n=10⁵.

## Brute Force Approach

The brute force approach would be:

1. Generate all rotations of the string (n rotations)
2. For each rotation, compare it to both alternating patterns
3. Count mismatches for each comparison
4. Track the minimum mismatches found

This would be O(n²) time since each rotation check takes O(n) time and we have n rotations. For n=10⁵, this is 10¹⁰ operations — far too slow.

Even a slightly better brute force that only generates rotations as needed would still be O(n²) in worst case.

## Optimized Approach

The key optimization is realizing that when we rotate, we're not starting from scratch. We can use a **sliding window** approach:

1. **Double the string**: Create `s + s` to handle rotations seamlessly
2. **Precompute alternating patterns**: Generate what the string should look like if it starts with 0 (`"0101..."`) or starts with 1 (`"1010..."`)
3. **Use sliding window**: Maintain counts of mismatches against both patterns as we slide through the doubled string
4. **Only check windows of length n**: Each window represents a rotation

**Why this works:**

- When we rotate by k, the new string is `s[k:] + s[:k]`
- In `s + s`, the substring starting at position k of length n is exactly the k-th rotation
- We can track mismatches incrementally: when sliding the window, we remove the leftmost character's mismatch and add the new rightmost character's mismatch

**The algorithm:**

1. Create the two target patterns for length n
2. Initialize mismatch counts for the first window (rotation 0)
3. Slide through positions 1 to n-1 (all other rotations)
4. For each position, update mismatch counts efficiently
5. Track the minimum mismatches found

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minFlips(s: str) -> int:
    n = len(s)

    # Create doubled string to handle rotations
    doubled = s + s

    # Build the two alternating patterns for the full doubled length
    # Pattern 1: starts with '0' -> "010101..."
    # Pattern 2: starts with '1' -> "101010..."
    pattern1 = []
    pattern2 = []

    for i in range(2 * n):
        # Pattern 1 alternates starting with '0'
        pattern1.append('0' if i % 2 == 0 else '1')
        # Pattern 2 alternates starting with '1'
        pattern2.append('1' if i % 2 == 0 else '0')

    # Convert to strings for easier comparison
    pattern1 = ''.join(pattern1)
    pattern2 = ''.join(pattern2)

    # Count mismatches for initial window (first n characters, rotation 0)
    diff1 = diff2 = 0
    for i in range(n):
        if doubled[i] != pattern1[i]:
            diff1 += 1
        if doubled[i] != pattern2[i]:
            diff2 += 1

    # Initialize result with minimum of initial window
    result = min(diff1, diff2)

    # Slide through all other rotations (windows starting at positions 1 to n-1)
    for start in range(1, n):
        # The character leaving the window (leftmost of previous window)
        left_char = doubled[start - 1]

        # Update diff1: remove mismatch from leaving character
        if left_char != pattern1[start - 1]:
            diff1 -= 1
        # Update diff1: add mismatch from new character (rightmost of current window)
        new_char = doubled[start + n - 1]
        if new_char != pattern1[start + n - 1]:
            diff1 += 1

        # Update diff2 similarly
        if left_char != pattern2[start - 1]:
            diff2 -= 1
        if new_char != pattern2[start + n - 1]:
            diff2 += 1

        # Update result with minimum of current window
        result = min(result, diff1, diff2)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function minFlips(s) {
  const n = s.length;

  // Create doubled string to handle rotations
  const doubled = s + s;

  // Build the two alternating patterns
  let pattern1 = "";
  let pattern2 = "";

  for (let i = 0; i < 2 * n; i++) {
    // Pattern 1: starts with '0', alternates
    pattern1 += i % 2 === 0 ? "0" : "1";
    // Pattern 2: starts with '1', alternates
    pattern2 += i % 2 === 0 ? "1" : "0";
  }

  // Count mismatches for initial window (rotation 0)
  let diff1 = 0,
    diff2 = 0;
  for (let i = 0; i < n; i++) {
    if (doubled[i] !== pattern1[i]) diff1++;
    if (doubled[i] !== pattern2[i]) diff2++;
  }

  // Initialize result with minimum of initial window
  let result = Math.min(diff1, diff2);

  // Slide through all other rotations
  for (let start = 1; start < n; start++) {
    // Character leaving the window
    const leftChar = doubled[start - 1];

    // Update diff1
    if (leftChar !== pattern1[start - 1]) diff1--;
    const newChar1 = doubled[start + n - 1];
    if (newChar1 !== pattern1[start + n - 1]) diff1++;

    // Update diff2
    if (leftChar !== pattern2[start - 1]) diff2--;
    const newChar2 = doubled[start + n - 1];
    if (newChar2 !== pattern2[start + n - 1]) diff2++;

    // Update result
    result = Math.min(result, diff1, diff2);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minFlips(String s) {
        int n = s.length();

        // Create doubled string to handle rotations
        String doubled = s + s;

        // Build the two alternating patterns
        StringBuilder pattern1 = new StringBuilder();
        StringBuilder pattern2 = new StringBuilder();

        for (int i = 0; i < 2 * n; i++) {
            // Pattern 1: starts with '0', alternates
            pattern1.append(i % 2 == 0 ? '0' : '1');
            // Pattern 2: starts with '1', alternates
            pattern2.append(i % 2 == 0 ? '1' : '0');
        }

        String p1 = pattern1.toString();
        String p2 = pattern2.toString();

        // Count mismatches for initial window (rotation 0)
        int diff1 = 0, diff2 = 0;
        for (int i = 0; i < n; i++) {
            if (doubled.charAt(i) != p1.charAt(i)) diff1++;
            if (doubled.charAt(i) != p2.charAt(i)) diff2++;
        }

        // Initialize result with minimum of initial window
        int result = Math.min(diff1, diff2);

        // Slide through all other rotations
        for (int start = 1; start < n; start++) {
            // Character leaving the window
            char leftChar = doubled.charAt(start - 1);

            // Update diff1
            if (leftChar != p1.charAt(start - 1)) diff1--;
            char newChar1 = doubled.charAt(start + n - 1);
            if (newChar1 != p1.charAt(start + n - 1)) diff1++;

            // Update diff2
            if (leftChar != p2.charAt(start - 1)) diff2--;
            char newChar2 = doubled.charAt(start + n - 1);
            if (newChar2 != p2.charAt(start + n - 1)) diff2++;

            // Update result
            result = Math.min(result, Math.min(diff1, diff2));
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the doubled string: O(n)
- Building the two patterns: O(2n) = O(n)
- Initial mismatch counting: O(n)
- Sliding through n-1 rotations: O(n)
- Total: O(n) + O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Doubled string: O(2n) = O(n)
- Two patterns: O(4n) = O(n) (each is 2n long)
- A few integer variables: O(1)
- Total: O(n)

## Common Mistakes

1. **Not considering both alternating patterns**: Some candidates only check against `"0101..."` pattern. You must check both `"0101..."` and `"1010..."` since either could require fewer flips.

2. **Inefficient rotation handling**: Trying to actually rotate the string or generate each rotation separately leads to O(n²) time. The doubled string trick is essential.

3. **Off-by-one errors in sliding window**: When updating mismatch counts, it's easy to mess up indices. Remember:
   - The character leaving is at `start - 1` (previous window's first character)
   - The character entering is at `start + n - 1` (current window's last character)

4. **Forgetting to initialize with the first window**: The loop starts at rotation 1, so you must handle rotation 0 separately. Don't forget to include it in the minimum calculation.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window with Precomputation**: Problems where you need to examine all subarrays/windows of a certain length and compute something that can be updated incrementally.
   - Related: [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) - sliding window with character counts
   - Related: [Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/) - sliding window on circular array

2. **Circular Array Problems**: Problems where the array/string is treated as circular.
   - Related: [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) - uses doubled array for circular traversal
   - Related: [House Robber II](https://leetcode.com/problems/house-robber-ii/) - circular version of a linear problem

3. **Pattern Matching with Mismatch Counting**: Problems where you compare against a target pattern.
   - Related: [Minimum Operations to Make the Array Alternating](https://leetcode.com/problems/minimum-operations-to-make-the-array-alternating/) - very similar but for arrays instead of strings

## Key Takeaways

1. **When dealing with rotations/circular structures, consider doubling the array/string** to linearize the problem. This transforms circular rotations into linear subarrays.

2. **Sliding window is powerful when you can update results incrementally** rather than recomputing from scratch. Look for operations where adding/removing one element has predictable effect on the result.

3. **Always check for multiple target patterns** when the problem doesn't specify which alternating pattern to use. The minimum might come from an unexpected pattern.

Related problems: [Minimum Operations to Make the Array Alternating](/problem/minimum-operations-to-make-the-array-alternating)
