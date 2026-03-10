---
title: "How to Solve Maximum Strong Pair XOR I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Strong Pair XOR I. Easy difficulty, 75.9% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Trie, Sliding Window."
date: "2028-05-13"
category: "dsa-patterns"
tags: ["maximum-strong-pair-xor-i", "array", "hash-table", "bit-manipulation", "easy"]
---

# How to Solve Maximum Strong Pair XOR I

You're given an array of integers and need to find the maximum XOR value between any two numbers that form a "strong pair" — where the absolute difference between them is less than or equal to the smaller number. What makes this problem interesting is that it combines two constraints: finding valid pairs based on a mathematical condition, then maximizing their XOR. While the problem is rated Easy, it teaches important patterns for handling multiple constraints efficiently.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 3, 4, 5]`

First, we need to understand what makes a strong pair. The condition is `|x - y| <= min(x, y)`. Let's test some pairs:

- **Pair (1, 2)**: `|1 - 2| = 1`, `min(1, 2) = 1`. Since `1 <= 1`, this is a strong pair.
- **Pair (1, 3)**: `|1 - 3| = 2`, `min(1, 3) = 1`. Since `2 > 1`, this is NOT a strong pair.
- **Pair (2, 4)**: `|2 - 4| = 2`, `min(2, 4) = 2`. Since `2 <= 2`, this IS a strong pair.
- **Pair (3, 5)**: `|3 - 5| = 2`, `min(3, 5) = 3`. Since `2 <= 3`, this IS a strong pair.

Now let's find the maximum XOR among strong pairs:

1. Check (1, 2): `1 XOR 2 = 3`
2. Check (1, 3): Not a strong pair
3. Check (1, 4): Not a strong pair (|1-4|=3 > min=1)
4. Check (1, 5): Not a strong pair
5. Check (2, 3): `|2-3|=1 <= min=2` → strong pair, `2 XOR 3 = 1`
6. Check (2, 4): `|2-4|=2 <= min=2` → strong pair, `2 XOR 4 = 6`
7. Check (2, 5): `|2-5|=3 > min=2` → not strong
8. Check (3, 4): `|3-4|=1 <= min=3` → strong pair, `3 XOR 4 = 7`
9. Check (3, 5): `|3-5|=2 <= min=3` → strong pair, `3 XOR 5 = 6`
10. Check (4, 5): `|4-5|=1 <= min=4` → strong pair, `4 XOR 5 = 1`

The maximum XOR value among strong pairs is **7** from pair (3, 4).

Notice a pattern: For a pair (x, y) where x ≤ y, the condition becomes `y - x ≤ x`, which simplifies to `y ≤ 2x`. This is a crucial insight — a strong pair requires the larger number to be at most twice the smaller number.

## Brute Force Approach

The most straightforward solution is to check every possible pair in the array. For each pair, we verify if it satisfies the strong pair condition, and if it does, we compute the XOR and track the maximum.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maximumStrongPairXor(nums):
    """
    Brute force solution: Check all possible pairs
    """
    n = len(nums)
    max_xor = 0

    # Check every possible pair (i, j)
    for i in range(n):
        for j in range(i + 1, n):
            x, y = nums[i], nums[j]

            # Check if (x, y) forms a strong pair
            # The condition: |x - y| <= min(x, y)
            if abs(x - y) <= min(x, y):
                # Compute XOR and update maximum
                current_xor = x ^ y
                max_xor = max(max_xor, current_xor)

    return max_xor
```

```javascript
// Time: O(n²) | Space: O(1)
function maximumStrongPairXor(nums) {
  /**
   * Brute force solution: Check all possible pairs
   */
  let maxXor = 0;
  const n = nums.length;

  // Check every possible pair (i, j)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const x = nums[i];
      const y = nums[j];

      // Check if (x, y) forms a strong pair
      // The condition: |x - y| <= min(x, y)
      if (Math.abs(x - y) <= Math.min(x, y)) {
        // Compute XOR and update maximum
        const currentXor = x ^ y;
        maxXor = Math.max(maxXor, currentXor);
      }
    }
  }

  return maxXor;
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    public int maximumStrongPairXor(int[] nums) {
        /**
         * Brute force solution: Check all possible pairs
         */
        int maxXor = 0;
        int n = nums.length;

        // Check every possible pair (i, j)
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int x = nums[i];
                int y = nums[j];

                // Check if (x, y) forms a strong pair
                // The condition: |x - y| <= min(x, y)
                if (Math.abs(x - y) <= Math.min(x, y)) {
                    // Compute XOR and update maximum
                    int currentXor = x ^ y;
                    maxXor = Math.max(maxXor, currentXor);
                }
            }
        }

        return maxXor;
    }
}
```

</div>

**Why this is insufficient:** With n up to 50 in this problem, O(n²) is acceptable (50² = 2500 operations). However, if n were larger (like in similar problems where n can be 10⁵), this approach would be too slow. More importantly, understanding why the brute force works and how to potentially optimize it is what interviewers look for.

## Optimal Solution

While the brute force solution is acceptable for the constraints of this specific problem (n ≤ 50), we can optimize it using the insight we discovered: for x ≤ y, the condition `y ≤ 2x` must hold. This allows us to sort the array and use a sliding window approach to reduce the number of comparisons.

However, for this problem, the brute force is actually optimal given the constraints. Let me show you a slightly optimized version that sorts first and uses the `y ≤ 2x` condition more efficiently:

<div class="code-group">

```python
# Time: O(n²) worst case, but often better in practice | Space: O(1)
def maximumStrongPairXor(nums):
    """
    Optimized brute force: Sort first, then use the y ≤ 2x condition
    to reduce comparisons
    """
    # Sort the array to easily apply the y ≤ 2x condition
    nums.sort()
    n = len(nums)
    max_xor = 0

    # For each element as the smaller number in the pair
    for i in range(n):
        x = nums[i]

        # Only check elements that could form a strong pair with x
        # Since array is sorted, we only need to check j where nums[j] ≤ 2*x
        for j in range(i + 1, n):
            y = nums[j]

            # If y > 2*x, no further elements will satisfy y ≤ 2*x
            # because the array is sorted
            if y > 2 * x:
                break

            # At this point, we know x ≤ y and y ≤ 2*x
            # So |y - x| = y - x ≤ x = min(x, y)
            # The pair is guaranteed to be strong
            current_xor = x ^ y
            max_xor = max(max_xor, current_xor)

    return max_xor
```

```javascript
// Time: O(n²) worst case, but often better in practice | Space: O(1)
function maximumStrongPairXor(nums) {
  /**
   * Optimized brute force: Sort first, then use the y ≤ 2x condition
   * to reduce comparisons
   */
  // Sort the array to easily apply the y ≤ 2x condition
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let maxXor = 0;

  // For each element as the smaller number in the pair
  for (let i = 0; i < n; i++) {
    const x = nums[i];

    // Only check elements that could form a strong pair with x
    // Since array is sorted, we only need to check j where nums[j] ≤ 2*x
    for (let j = i + 1; j < n; j++) {
      const y = nums[j];

      // If y > 2*x, no further elements will satisfy y ≤ 2*x
      // because the array is sorted
      if (y > 2 * x) {
        break;
      }

      // At this point, we know x ≤ y and y ≤ 2*x
      // So |y - x| = y - x ≤ x = min(x, y)
      // The pair is guaranteed to be strong
      const currentXor = x ^ y;
      maxXor = Math.max(maxXor, currentXor);
    }
  }

  return maxXor;
}
```

```java
// Time: O(n²) worst case, but often better in practice | Space: O(1)
class Solution {
    public int maximumStrongPairXor(int[] nums) {
        /**
         * Optimized brute force: Sort first, then use the y ≤ 2x condition
         * to reduce comparisons
         */
        // Sort the array to easily apply the y ≤ 2x condition
        Arrays.sort(nums);
        int n = nums.length;
        int maxXor = 0;

        // For each element as the smaller number in the pair
        for (int i = 0; i < n; i++) {
            int x = nums[i];

            // Only check elements that could form a strong pair with x
            // Since array is sorted, we only need to check j where nums[j] ≤ 2*x
            for (int j = i + 1; j < n; j++) {
                int y = nums[j];

                // If y > 2*x, no further elements will satisfy y ≤ 2*x
                // because the array is sorted
                if (y > 2 * x) {
                    break;
                }

                // At this point, we know x ≤ y and y ≤ 2*x
                // So |y - x| = y - x ≤ x = min(x, y)
                // The pair is guaranteed to be strong
                int currentXor = x ^ y;
                maxXor = Math.max(maxXor, currentXor);
            }
        }

        return maxXor;
    }
}
```

</div>

**Key insight in the optimized version:** After sorting, for a given `x`, we only need to check `y` values up to `2*x`. Since the array is sorted, once we encounter a `y > 2*x`, we can break out of the inner loop early. This doesn't change the worst-case time complexity (which is still O(n²) when all numbers are small), but it significantly improves performance in practice.

## Complexity Analysis

**Time Complexity:**

- **Brute force:** O(n²) — We check all n(n-1)/2 possible pairs
- **Optimized version:** O(n²) in worst case, but O(n log n + n\*k) in practice where k is the average number of elements satisfying y ≤ 2x for each x. The n log n comes from sorting.

**Space Complexity:**

- **Both approaches:** O(1) — We only use a few variables regardless of input size. The sorting is done in-place in most implementations.

**Why O(n²) is acceptable here:** The problem constraints specify n ≤ 50, so 50² = 2500 operations is trivial for modern computers. In an interview, it's important to mention that while this works for the given constraints, for larger n we would need a more sophisticated approach like using a Trie data structure (as in "Maximum XOR of Two Numbers in an Array").

## Common Mistakes

1. **Not handling the absolute value correctly:** The condition is `|x - y| <= min(x, y)`, not `x - y <= min(x, y)`. Candidates sometimes forget the absolute value, which would only check pairs where x ≥ y.

2. **Incorrect pair ordering:** When using the optimized `y ≤ 2x` condition, you must ensure x is the smaller number. If you don't sort first or don't account for which number is smaller, you might incorrectly reject valid pairs.

3. **Off-by-one in loops:** When checking all pairs, the inner loop should start from `i+1`, not `i`. Starting from `i` would compare an element with itself, and `|x - x| = 0 <= min(x, x)` is always true, but XOR of a number with itself is 0, which doesn't affect the maximum but wastes computation.

4. **Forgetting to initialize max_xor to 0:** While 0 is the minimum possible XOR (when numbers are equal), some candidates initialize to -1 or None, which requires extra handling for the case where no valid pairs exist (though in this problem, you can always pair a number with itself).

## When You'll See This Pattern

This problem combines two important patterns:

1. **Pair validation with mathematical constraints:** Problems where you need to find pairs satisfying specific conditions appear frequently. Examples include:
   - Two Sum (find pairs that sum to target)
   - Count Nice Pairs (LeetCode 1814) where you need pairs satisfying nums[i] + rev(nums[j]) = nums[j] + rev(nums[i])

2. **Maximum XOR problems:** This is a simpler version of more complex XOR maximization problems:
   - **Maximum XOR of Two Numbers in an Array (LeetCode 421):** Find maximum XOR of any two numbers without additional constraints. This requires a Trie-based solution for O(n) time.
   - **Maximum XOR With an Element From Array (LeetCode 1707):** A harder version where you need to answer multiple queries.

The key insight from this problem — transforming `|x - y| <= min(x, y)` into `y ≤ 2x` when x ≤ y — is an example of **mathematical simplification** that often appears in coding interviews. Always look for ways to simplify conditions algebraically before implementing.

## Key Takeaways

1. **Always analyze constraints mathematically:** The transformation from `|x - y| <= min(x, y)` to `y ≤ 2x` (when x ≤ y) is crucial. This kind of algebraic simplification can turn a complex conditional check into a simple comparison.

2. **Consider sorting when dealing with pairs:** Sorting often reveals patterns and allows optimizations like early termination in loops. Even when it doesn't improve worst-case complexity, it often improves practical performance.

3. **Know when brute force is acceptable:** With n ≤ 50, O(n²) is perfectly fine. Don't overcomplicate solutions when simple approaches work within constraints. However, always mention how you would optimize for larger inputs.

4. **XOR properties matter:** Remember that XOR of a number with itself is 0, and XOR is commutative (x ^ y = y ^ x). These properties simplify implementation.

Related problems: [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-an-array), [Maximum XOR With an Element From Array](/problem/maximum-xor-with-an-element-from-array)
