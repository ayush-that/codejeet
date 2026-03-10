---
title: "How to Solve Defuse the Bomb — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Defuse the Bomb. Easy difficulty, 79.3% acceptance rate. Topics: Array, Sliding Window."
date: "2028-08-08"
category: "dsa-patterns"
tags: ["defuse-the-bomb", "array", "sliding-window", "easy"]
---

# How to Solve Defuse the Bomb

You're given a circular array `code` and an integer `k`. For each element, you need to replace it with the sum of the next `k` elements (if `k > 0`) or the previous `|k|` elements (if `k < 0`). The tricky part is handling the circular nature of the array efficiently — when you reach the end, you need to wrap around to the beginning.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `code = [5, 7, 1, 4]` and `k = 3`.

Since `k = 3 > 0`, for each element, we need to sum the next 3 elements in the circular array:

- **For index 0 (value 5)**: Next 3 elements are indices 1, 2, 3 → values 7 + 1 + 4 = **12**
- **For index 1 (value 7)**: Next 3 elements are indices 2, 3, 0 → values 1 + 4 + 5 = **10**
- **For index 2 (value 1)**: Next 3 elements are indices 3, 0, 1 → values 4 + 5 + 7 = **16**
- **For index 3 (value 4)**: Next 3 elements are indices 0, 1, 2 → values 5 + 7 + 1 = **13**

So the result is `[12, 10, 16, 13]`.

Notice the pattern: each sum is similar to the previous one, but we remove the element that's no longer in the window and add the new element that enters. This suggests a sliding window approach would be efficient.

## Brute Force Approach

The most straightforward approach is to compute each sum independently by iterating through the next/previous `|k|` elements for each position in the array.

**Algorithm:**

1. Create a result array of the same length as `code`
2. For each index `i` in `code`:
   - Initialize `sum = 0`
   - If `k > 0`: Add the next `k` elements (wrapping around using modulo)
   - If `k < 0`: Add the previous `|k|` elements (wrapping around using modulo)
   - If `k = 0`: Set all elements to 0
3. Store the sum in result[i]

**Why this is inefficient:**

- Time complexity: O(n × |k|) where n is the length of `code`
- For each of n elements, we're doing up to |k| operations
- In the worst case where |k| ≈ n, this becomes O(n²)
- We're doing redundant work — many elements are added multiple times across different windows

## Optimal Solution

The key insight is that consecutive windows overlap significantly. When `k > 0`, moving from window i to window i+1:

- We remove `code[i+1]` (the element that was at the start of window i)
- We add `code[(i+k+1) % n]` (the new element at the end of window i+1)

We can use a sliding window approach to compute each sum in O(1) time after computing the first window.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def decrypt(code, k):
    n = len(code)
    result = [0] * n

    # Edge case: if k is 0, all elements become 0
    if k == 0:
        return result

    # Initialize the first window sum
    window_sum = 0

    if k > 0:
        # For k > 0, sum the next k elements for index 0
        for i in range(1, k + 1):
            window_sum += code[i % n]
        result[0] = window_sum

        # Slide the window for the rest of the elements
        for i in range(1, n):
            # Remove the element that's no longer in the window
            window_sum -= code[i % n]
            # Add the new element that enters the window
            window_sum += code[(i + k) % n]
            result[i] = window_sum
    else:
        # For k < 0, sum the previous |k| elements for index 0
        k = abs(k)
        for i in range(1, k + 1):
            window_sum += code[-i % n]  # Negative indexing wraps around
        result[0] = window_sum

        # Slide the window for the rest of the elements
        for i in range(1, n):
            # Remove the element that's leaving the window
            window_sum -= code[(-k + i - 1) % n]
            # Add the new element that enters the window
            window_sum += code[(i - 1) % n]
            result[i] = window_sum

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function decrypt(code, k) {
  const n = code.length;
  const result = new Array(n).fill(0);

  // Edge case: if k is 0, all elements become 0
  if (k === 0) {
    return result;
  }

  let windowSum = 0;

  if (k > 0) {
    // For k > 0, sum the next k elements for index 0
    for (let i = 1; i <= k; i++) {
      windowSum += code[i % n];
    }
    result[0] = windowSum;

    // Slide the window for the rest of the elements
    for (let i = 1; i < n; i++) {
      // Remove the element that's no longer in the window
      windowSum -= code[i % n];
      // Add the new element that enters the window
      windowSum += code[(i + k) % n];
      result[i] = windowSum;
    }
  } else {
    // For k < 0, sum the previous |k| elements for index 0
    k = Math.abs(k);
    for (let i = 1; i <= k; i++) {
      // Negative indexing with modulo for circular array
      windowSum += code[(n - i) % n];
    }
    result[0] = windowSum;

    // Slide the window for the rest of the elements
    for (let i = 1; i < n; i++) {
      // Remove the element that's leaving the window
      windowSum -= code[(n - k + i - 1) % n];
      // Add the new element that enters the window
      windowSum += code[(i - 1) % n];
      result[i] = windowSum;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
class Solution {
    public int[] decrypt(int[] code, int k) {
        int n = code.length;
        int[] result = new int[n];

        // Edge case: if k is 0, all elements become 0
        if (k == 0) {
            return result;
        }

        int windowSum = 0;

        if (k > 0) {
            // For k > 0, sum the next k elements for index 0
            for (int i = 1; i <= k; i++) {
                windowSum += code[i % n];
            }
            result[0] = windowSum;

            // Slide the window for the rest of the elements
            for (int i = 1; i < n; i++) {
                // Remove the element that's no longer in the window
                windowSum -= code[i % n];
                // Add the new element that enters the window
                windowSum += code[(i + k) % n];
                result[i] = windowSum;
            }
        } else {
            // For k < 0, sum the previous |k| elements for index 0
            k = Math.abs(k);
            for (int i = 1; i <= k; i++) {
                // Handle negative indexing with modulo
                windowSum += code[(n - i) % n];
            }
            result[0] = windowSum;

            // Slide the window for the rest of the elements
            for (int i = 1; i < n; i++) {
                // Remove the element that's leaving the window
                windowSum -= code[(n - k + i - 1) % n];
                // Add the new element that enters the window
                windowSum += code[(i - 1) % n];
                result[i] = windowSum;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We compute the first window in O(|k|) time
- Then we slide the window n-1 times, each taking O(1) time
- Total: O(|k| + n) = O(n) since |k| ≤ n

**Space Complexity: O(n)**

- We need to store the result array of size n
- We use only a few extra variables (windowSum, loop counters)
- The input array is not modified

## Common Mistakes

1. **Forgetting the k = 0 edge case**: When k = 0, all elements should be replaced with 0. Candidates often miss this special case and try to compute sums anyway.

2. **Incorrect circular indexing**: The most common error is not handling wrap-around correctly. Remember that `(i + offset) % n` gives you circular behavior, but you need to be careful with negative indices. In Python, negative indexing works naturally, but in Java/JavaScript, you need to handle it manually.

3. **Off-by-one errors in window boundaries**: When k > 0, the window for index i consists of elements i+1 through i+k (inclusive). Candidates sometimes include element i itself or go one element too far.

4. **Not handling negative k properly**: For k < 0, you need to sum the previous |k| elements, not the next |k| elements. Some candidates treat negative k the same as positive k, which gives incorrect results.

## When You'll See This Pattern

The sliding window technique used here appears in many array problems:

1. **Maximum Average Subarray I (LeetCode 643)**: Find a contiguous subarray of given length with maximum average. Similar sliding window approach.

2. **Find All Anagrams in a String (LeetCode 438)**: Find starting indices of all anagrams of a pattern in a string. Uses sliding window with character frequency counts.

3. **Minimum Size Subarray Sum (LeetCode 209)**: Find the minimal length of a contiguous subarray whose sum ≥ target. Uses a variable-size sliding window.

The circular array aspect appears in problems like:

- **Circular Sentence (LeetCode 2490)**: Check if a sentence is circular (last character of each word equals first character of next word, and last character of last word equals first character of first word).
- **Shortest Distance to Target String in a Circular Array (LeetCode 2515)**: Find shortest distance to target in circular array.

## Key Takeaways

1. **Sliding window optimization**: When you need to compute overlapping sums/ranges, sliding window can often reduce O(n²) brute force to O(n) by reusing computations from previous windows.

2. **Circular array handling**: Use modulo arithmetic `(i ± offset) % n` to handle wrap-around. For negative offsets, add n before taking modulo to ensure positive indices.

3. **Separate cases for clarity**: Handling k > 0 and k < 0 separately makes the logic clearer and reduces bugs, even though the core sliding window concept is the same.

Related problems: [Circular Sentence](/problem/circular-sentence), [Shortest Distance to Target String in a Circular Array](/problem/shortest-distance-to-target-string-in-a-circular-array), [Take K of Each Character From Left and Right](/problem/take-k-of-each-character-from-left-and-right)
