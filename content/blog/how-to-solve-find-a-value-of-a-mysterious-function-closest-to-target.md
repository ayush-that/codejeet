---
title: "How to Solve Find a Value of a Mysterious Function Closest to Target — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find a Value of a Mysterious Function Closest to Target. Hard difficulty, 47.0% acceptance rate. Topics: Array, Binary Search, Bit Manipulation, Segment Tree."
date: "2026-03-02"
category: "dsa-patterns"
tags:
  [
    "find-a-value-of-a-mysterious-function-closest-to-target",
    "array",
    "binary-search",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve "Find a Value of a Mysterious Function Closest to Target"

This problem asks us to find the minimum possible value of `|func(arr, l, r) - target|` where `func(arr, l, r)` is defined as the bitwise AND of all elements in the subarray `arr[l...r]`. The challenge is that we need to efficiently explore all possible subarrays to find the one whose bitwise AND is closest to the target value. What makes this problem tricky is that the brute force approach would examine O(n²) subarrays, which is too slow for the constraints (arr.length ≤ 10⁵). The key insight is that for bitwise AND operations, the number of distinct values we can get from any starting position is limited by the number of bits.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [1, 2, 4, 8]` with `target = 5`.

**Understanding the function**: `func(arr, l, r)` = `arr[l] & arr[l+1] & ... & arr[r]`

- For `l=0, r=0`: `1 & 1 = 1` → `|1-5| = 4`
- For `l=0, r=1`: `1 & 2 = 0` → `|0-5| = 5`
- For `l=0, r=2`: `1 & 2 & 4 = 0` → `|0-5| = 5`
- For `l=0, r=3`: `1 & 2 & 4 & 8 = 0` → `|0-5| = 5`
- For `l=1, r=1`: `2 & 2 = 2` → `|2-5| = 3`
- For `l=1, r=2`: `2 & 4 = 0` → `|0-5| = 5`
- For `l=1, r=3`: `2 & 4 & 8 = 0` → `|0-5| = 5`
- For `l=2, r=2`: `4 & 4 = 4` → `|4-5| = 1`
- For `l=2, r=3`: `4 & 8 = 0` → `|0-5| = 5`
- For `l=3, r=3`: `8 & 8 = 8` → `|8-5| = 3`

The minimum absolute difference is `1` (from subarray `[4]` at index 2).

Notice an important pattern: as we extend a subarray to the right, the bitwise AND can only stay the same or decrease (since AND with additional bits can only clear bits, never set them). Also, for any starting index `i`, there are at most `log₂(max(arr))` distinct AND values as we extend to the right, because each time the value changes, at least one bit gets cleared.

## Brute Force Approach

The most straightforward solution is to check every possible subarray `[l, r]`:

1. For each starting index `l` from `0` to `n-1`
2. For each ending index `r` from `l` to `n-1`
3. Compute the AND of `arr[l...r]`
4. Calculate `|AND - target|` and track the minimum

This approach has O(n²) time complexity for the nested loops, plus O(r-l) time to compute each AND (which could be optimized to O(1) with prefix ANDs, but still leaves O(n²) overall). For n up to 10⁵, this would require up to 5×10⁹ operations, which is far too slow.

Even with prefix AND optimization, the O(n²) loop makes this approach infeasible. We need a smarter way to explore the possible AND values without checking every subarray explicitly.

## Optimized Approach

The key insight comes from these properties of bitwise AND:

1. **Monotonicity**: For a fixed starting index `i`, as we extend to the right (increase `r`), the AND value can only stay the same or decrease (bits can only be cleared, never set).
2. **Limited distinct values**: For any starting index `i`, there are at most `log₂(max(arr)) + 1` distinct AND values as we extend to the right. This is because each time the value changes, at least one bit gets cleared, and we only have at most 32 bits (for 32-bit integers).

Here's the efficient algorithm:

1. Initialize a set `current` to store all distinct AND values ending at the previous position
2. Initialize a set `next` to store distinct AND values ending at the current position
3. For each element `arr[i]` in the array:
   - Create a new set starting with just `arr[i]` itself
   - For each value `val` in `current`, add `val & arr[i]` to the set
   - Update `current` to be this new set (which represents all distinct AND values of subarrays ending at `i`)
   - For each value in `current`, compute `|val - target|` and track the minimum
4. Return the minimum difference found

Why does this work? At each position `i`, the set `current` contains all possible AND values of subarrays ending at `i-1`. When we process `arr[i]`, we can either:

- Start a new subarray at `i`: AND = `arr[i]`
- Extend any subarray ending at `i-1`: AND = `(previous AND) & arr[i]`

By tracking only distinct values, we avoid redundant computation. Since each AND operation can only clear bits, the number of distinct values is limited by the number of bits (≤ 32 for 32-bit integers).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(max(arr))) ≈ O(32n) = O(n)
# Space: O(log(max(arr))) ≈ O(32) = O(1)
def closestToTarget(arr, target):
    """
    Finds the minimum |func(arr, l, r) - target| where func computes
    the bitwise AND of arr[l...r].

    The key insight is that for any starting position, there are at most
    32 distinct AND values as we extend to the right (since AND can only
    clear bits, never set them).
    """
    # Initialize the minimum difference with a large value
    min_diff = float('inf')

    # Set to store all distinct AND values of subarrays ending at previous position
    prev_and_values = set()

    for num in arr:
        # Set for current position, starting with the element itself
        # (representing subarrays starting at current position)
        curr_and_values = set()
        curr_and_values.add(num)

        # Extend all subarrays ending at previous position
        for val in prev_and_values:
            curr_and_values.add(val & num)

        # Check all AND values ending at current position
        for val in curr_and_values:
            min_diff = min(min_diff, abs(val - target))

        # Update prev_and_values for next iteration
        prev_and_values = curr_and_values

    return min_diff
```

```javascript
// Time: O(n * log(max(arr))) ≈ O(32n) = O(n)
// Space: O(log(max(arr))) ≈ O(32) = O(1)
/**
 * Finds the minimum |func(arr, l, r) - target| where func computes
 * the bitwise AND of arr[l...r].
 *
 * The key insight is that for any starting position, there are at most
 * 32 distinct AND values as we extend to the right (since AND can only
 * clear bits, never set them).
 */
function closestToTarget(arr, target) {
  // Initialize the minimum difference with a large value
  let minDiff = Infinity;

  // Set to store all distinct AND values of subarrays ending at previous position
  let prevAndValues = new Set();

  for (let num of arr) {
    // Set for current position, starting with the element itself
    // (representing subarrays starting at current position)
    let currAndValues = new Set();
    currAndValues.add(num);

    // Extend all subarrays ending at previous position
    for (let val of prevAndValues) {
      currAndValues.add(val & num);
    }

    // Check all AND values ending at current position
    for (let val of currAndValues) {
      minDiff = Math.min(minDiff, Math.abs(val - target));
    }

    // Update prevAndValues for next iteration
    prevAndValues = currAndValues;
  }

  return minDiff;
}
```

```java
// Time: O(n * log(max(arr))) ≈ O(32n) = O(n)
// Space: O(log(max(arr))) ≈ O(32) = O(1)
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Finds the minimum |func(arr, l, r) - target| where func computes
     * the bitwise AND of arr[l...r].
     *
     * The key insight is that for any starting position, there are at most
     * 32 distinct AND values as we extend to the right (since AND can only
     * clear bits, never set them).
     */
    public int closestToTarget(int[] arr, int target) {
        // Initialize the minimum difference with a large value
        int minDiff = Integer.MAX_VALUE;

        // Set to store all distinct AND values of subarrays ending at previous position
        Set<Integer> prevAndValues = new HashSet<>();

        for (int num : arr) {
            // Set for current position, starting with the element itself
            // (representing subarrays starting at current position)
            Set<Integer> currAndValues = new HashSet<>();
            currAndValues.add(num);

            // Extend all subarrays ending at previous position
            for (int val : prevAndValues) {
                currAndValues.add(val & num);
            }

            // Check all AND values ending at current position
            for (int val : currAndValues) {
                minDiff = Math.min(minDiff, Math.abs(val - target));
            }

            // Update prevAndValues for next iteration
            prevAndValues = currAndValues;
        }

        return minDiff;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × B)**

- We iterate through all `n` elements of the array
- For each element, we process at most `B` distinct AND values from the previous step, where `B ≤ log₂(max(arr)) + 1`
- Since integers are typically 32-bit, `B ≤ 32`
- Therefore, time complexity is O(32n) = **O(n)**

**Space Complexity: O(B)**

- We maintain two sets (`prev_and_values` and `curr_and_values`) each storing at most `B` distinct values
- Since `B ≤ 32`, space complexity is **O(1)** (constant space)

This is a dramatic improvement over the O(n²) brute force approach, making it feasible for n up to 10⁵.

## Common Mistakes

1. **Trying to store all subarrays or their AND values**: Some candidates try to store the actual subarrays or maintain a 2D array of AND values. This uses O(n²) memory and is infeasible. Remember: we only need the AND values, not the subarray boundaries.

2. **Not recognizing the limited distinct values property**: The most common mistake is not realizing that for any starting index, there are at most 32 distinct AND values. This insight is crucial for designing an efficient solution.

3. **Incorrectly updating the set of AND values**: When processing `arr[i]`, you must:
   - Start with `arr[i]` itself (new subarray starting at `i`)
   - AND `arr[i]` with every value from the previous step (extending existing subarrays)
   - Not include values from more than one step back (those are already captured in the chain)

4. **Forgetting to check single-element subarrays**: The minimum might come from a single element. Our algorithm handles this because we always start with `arr[i]` itself in `curr_and_values`.

## When You'll See This Pattern

This problem uses the "limited distinct values for bitwise operations" pattern, which appears in several other problems:

1. **Bitwise ORs of Subarrays (LeetCode 898)**: Similar to this problem but with OR instead of AND. The same insight applies: for bitwise OR, the number of distinct values from any starting position is limited (bits can only be set, never cleared).

2. **Subarray Product Less Than K (LeetCode 713)**: While not about bitwise operations, it uses a similar sliding window approach with the insight that certain operations have monotonic properties.

3. **Maximum AND Value of Subarray (custom problem)**: Finding the maximum AND value of any subarray uses the same core insight about limited distinct AND values.

The pattern to recognize: when a bitwise operation (AND, OR, XOR) is applied over subarrays, and the operation has the property that extending a subarray can only change values in one direction (AND/OR are monotonic in different ways), then the number of distinct values is limited by the number of bits.

## Key Takeaways

1. **Bitwise operations over subarrays often have limited distinct values**: For AND and OR operations, extending a subarray can only clear bits (AND) or set bits (OR), leading to at most 32 distinct values from any starting position.

2. **Dynamic programming with sets can track distinct values efficiently**: Instead of storing all subarrays or their results, we can maintain a set of distinct values ending at each position, which grows slowly (logarithmically with input values).

3. **Look for monotonic properties**: When an operation is monotonic (always decreasing for AND, always increasing for OR), it often enables more efficient algorithms than brute force enumeration.

[Practice this problem on CodeJeet](/problem/find-a-value-of-a-mysterious-function-closest-to-target)
