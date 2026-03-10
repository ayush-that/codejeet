---
title: "How to Solve Detect Pattern of Length M Repeated K or More Times — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Detect Pattern of Length M Repeated K or More Times. Easy difficulty, 43.8% acceptance rate. Topics: Array, Enumeration."
date: "2028-09-13"
category: "dsa-patterns"
tags: ["detect-pattern-of-length-m-repeated-k-or-more-times", "array", "enumeration", "easy"]
---

# How to Solve Detect Pattern of Length M Repeated K or More Times

This problem asks us to determine if an array contains a pattern of length `m` that repeats consecutively at least `k` times. The tricky part is understanding what constitutes a valid pattern: it must be a consecutive subarray that repeats back-to-back without overlapping. For example, if `m=2` and `k=3`, we're looking for two consecutive numbers that appear three times in a row (like `[1,2,1,2,1,2]`).

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `arr = [1,2,4,4,4,4]`, `m = 1`, `k = 3`.

We're looking for a single number that repeats at least 3 times consecutively. Let's check each position:

- Start at index 0: `arr[0] = 1`. Check if the next 2 elements (since we need 3 total) are also 1. `arr[1] = 2` ≠ 1, so pattern fails.
- Move to index 1: `arr[1] = 2`. Check `arr[2] = 4` ≠ 2, pattern fails.
- Move to index 2: `arr[2] = 4`. Check `arr[3] = 4` and `arr[4] = 4`. Both match! We found `4` repeating 3 times starting at index 2.

Now a more complex example: `arr = [1,2,1,2,1,1,1,3]`, `m = 2`, `k = 2`.

We need a 2-element pattern that repeats at least 2 times consecutively:

- Start at index 0: Pattern = `[1,2]`. Check if next 2 elements match:
  - `arr[2] = 1` matches pattern[0]
  - `arr[3] = 2` matches pattern[1]
    Success! We found `[1,2]` repeating twice starting at index 0.

The key insight: we only need to check if starting from position `i`, the next `(k-1)*m` elements follow the pattern formed by `arr[i]` to `arr[i+m-1]`.

## Brute Force Approach

A naive approach would be to check every possible starting position `i` from `0` to `n - m*k` (since we need at least `m*k` elements total). For each starting position, we would extract the pattern of length `m` starting at `i`, then verify that the next `(k-1)` blocks of size `m` all match this pattern.

The brute force would look like this in pseudocode:

```
for i from 0 to n - m*k:
    pattern = arr[i:i+m]
    valid = true
    for repeat from 1 to k-1:
        for j from 0 to m-1:
            if arr[i + repeat*m + j] != pattern[j]:
                valid = false
                break
        if not valid: break
    if valid: return true
return false
```

This approach is correct but inefficient. The triple nested loops give us O(n _ m _ k) time complexity in the worst case. While this might pass for small inputs, it's not optimal.

## Optimal Solution

The optimal solution is actually quite similar to the brute force but with careful bounds checking. We iterate through each possible starting position and check if the pattern repeats. The key optimization is in how we structure the loops and bounds checking.

<div class="code-group">

```python
# Time: O(n * m * k) in worst case, but typically much better
# Space: O(1) - we only use constant extra space
def containsPattern(arr, m, k):
    """
    Check if arr contains a pattern of length m repeated k times consecutively.

    Args:
        arr: List of integers to check
        m: Length of the pattern
        k: Minimum number of repetitions required

    Returns:
        True if pattern exists, False otherwise
    """
    n = len(arr)

    # We need at least m*k elements for a valid pattern
    # The last possible starting position is n - m*k
    for i in range(n - m * k + 1):
        # Flag to track if current position has valid pattern
        valid = True

        # Check each of the k-1 subsequent repetitions
        for j in range(1, k):
            # Check each element in the pattern
            for l in range(m):
                # Calculate index for current element in repetition j
                # i + l is the position in the first occurrence
                # j*m is the offset for repetition j
                if arr[i + l] != arr[i + j * m + l]:
                    valid = False
                    break

            # If any repetition fails, break early
            if not valid:
                break

        # If all k repetitions match, we found a valid pattern
        if valid:
            return True

    # No valid pattern found
    return False
```

```javascript
// Time: O(n * m * k) in worst case, but typically much better
// Space: O(1) - constant extra space
/**
 * Check if arr contains a pattern of length m repeated k times consecutively.
 * @param {number[]} arr - Array of integers to check
 * @param {number} m - Length of the pattern
 * @param {number} k - Minimum number of repetitions required
 * @return {boolean} True if pattern exists, False otherwise
 */
function containsPattern(arr, m, k) {
  const n = arr.length;

  // We need at least m*k elements for a valid pattern
  // The last possible starting position is n - m*k
  for (let i = 0; i <= n - m * k; i++) {
    let valid = true;

    // Check each of the k-1 subsequent repetitions
    for (let j = 1; j < k; j++) {
      // Check each element in the pattern
      for (let l = 0; l < m; l++) {
        // Calculate index for current element in repetition j
        // i + l is the position in the first occurrence
        // j*m is the offset for repetition j
        if (arr[i + l] !== arr[i + j * m + l]) {
          valid = false;
          break;
        }
      }

      // If any repetition fails, break early
      if (!valid) break;
    }

    // If all k repetitions match, we found a valid pattern
    if (valid) return true;
  }

  // No valid pattern found
  return false;
}
```

```java
// Time: O(n * m * k) in worst case, but typically much better
// Space: O(1) - constant extra space
class Solution {
    /**
     * Check if arr contains a pattern of length m repeated k times consecutively.
     * @param arr Array of integers to check
     * @param m Length of the pattern
     * @param k Minimum number of repetitions required
     * @return True if pattern exists, False otherwise
     */
    public boolean containsPattern(int[] arr, int m, int k) {
        int n = arr.length;

        // We need at least m*k elements for a valid pattern
        // The last possible starting position is n - m*k
        for (int i = 0; i <= n - m * k; i++) {
            boolean valid = true;

            // Check each of the k-1 subsequent repetitions
            for (int j = 1; j < k; j++) {
                // Check each element in the pattern
                for (int l = 0; l < m; l++) {
                    // Calculate index for current element in repetition j
                    // i + l is the position in the first occurrence
                    // j*m is the offset for repetition j
                    if (arr[i + l] != arr[i + j * m + l]) {
                        valid = false;
                        break;
                    }
                }

                // If any repetition fails, break early
                if (!valid) break;
            }

            // If all k repetitions match, we found a valid pattern
            if (valid) return true;
        }

        // No valid pattern found
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n _ m _ k) in the worst case, where:

- `n` is the length of the array
- `m` is the pattern length
- `k` is the required repetitions

However, in practice this is often much better because:

1. We stop early as soon as we find a valid pattern
2. The inner loops break as soon as a mismatch is found
3. The outer loop only goes up to `n - m*k + 1`, which is often much smaller than `n`

**Space Complexity:** O(1) - we only use a few variables for iteration and flags, no additional data structures that scale with input size.

## Common Mistakes

1. **Off-by-one errors in loop bounds:** The most common mistake is getting the upper bound wrong for the outer loop. It should be `n - m*k + 1` (inclusive), not `n - m*k`. For example, if `n=6`, `m=2`, `k=2`, we need `m*k=4` elements, so the last starting position is index `2` (6-4=2), and we need to include it.

2. **Forgetting to check array bounds:** When `m*k > n`, there can't be any valid pattern. Some implementations might try to access indices beyond array bounds. Always check this condition early or ensure your loop bounds handle it correctly.

3. **Misunderstanding what "consecutive" means:** The pattern must repeat immediately without gaps. Some candidates check for patterns with gaps between repetitions. Remember: if `m=2` and `k=3`, we need `[a,b,a,b,a,b]`, not `[a,b,x,y,a,b,z,a,b]`.

4. **Inefficient pattern extraction:** Some candidates extract the pattern array and store it, then compare. While this works, it's unnecessary - we can compare directly using indices as shown in the solution.

## When You'll See This Pattern

This pattern of checking consecutive repetitions appears in several string and array problems:

1. **Maximum Repeating Substring (LeetCode 1668)** - Very similar concept: find the maximum `k` such that `word` repeated `k` times is a substring of `sequence`. The main difference is that here we're given `k` and need to check if it exists, while in 1668 we need to find the maximum `k`.

2. **Repeated Substring Pattern (LeetCode 459)** - Check if a string can be constructed by taking a substring of it and appending multiple copies together. Similar concept of finding repeating patterns.

3. **Count and Say (LeetCode 38)** - While not exactly the same, it involves identifying consecutive repetitions of characters to generate the next sequence.

The core technique is the same: iterate through possible starting positions, then verify that subsequent segments match the pattern.

## Key Takeaways

1. **Consecutive pattern matching** problems often involve nested loops with careful index arithmetic. The formula `i + j * m + l` is key: `i` is the start, `j` tracks which repetition, `m` is pattern length, and `l` tracks position within pattern.

2. **Early termination** is crucial for efficiency. Break out of loops as soon as you find a mismatch - don't continue checking if you already know the pattern fails.

3. **Boundary checking** is critical. Always verify your loop limits handle edge cases like empty arrays, patterns longer than the array, or when `m*k` exceeds array length.

Related problems: [Maximum Repeating Substring](/problem/maximum-repeating-substring)
