---
title: "How to Solve Minimum Number of Operations to Make All Array Elements Equal to 1 — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make All Array Elements Equal to 1. Medium difficulty, 54.6% acceptance rate. Topics: Array, Math, Number Theory."
date: "2027-09-12"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-make-all-array-elements-equal-to-1",
    "array",
    "math",
    "number-theory",
    "medium",
  ]
---

# How to Solve Minimum Number of Operations to Make All Array Elements Equal to 1

This problem asks us to find the minimum number of operations needed to transform an array of positive integers so that all elements become 1. The operation allows us to replace either element in an adjacent pair with their GCD. What makes this problem interesting is that it combines array manipulation with number theory concepts, requiring us to think about how GCD operations propagate through the array.

## Visual Walkthrough

Let's trace through an example: `nums = [6, 10, 15]`

**Step 1:** Check if there's already a 1 in the array. If there is, we can spread it to other positions. Our array has no 1.

**Step 2:** We need to create a 1 somewhere. The only way to get a 1 is through GCD operations. Let's try adjacent pairs:

- GCD(6, 10) = 2
- GCD(10, 15) = 5
- GCD(6, 15) - not adjacent, can't use directly

We can't get 1 from any single operation. Let's try a sequence:

**Option A:** Start with indices 0 and 1

1. Replace nums[1] with GCD(6, 10) = 2 → [6, 2, 15]
2. Replace nums[0] with GCD(6, 2) = 2 → [2, 2, 15]
3. Replace nums[1] with GCD(2, 2) = 2 → [2, 2, 15] (no change)
4. Replace nums[2] with GCD(2, 15) = 1 → [2, 2, 1]

Now we have a 1! Total operations so far: 4

**Option B:** Try to get 1 faster

1. Replace nums[1] with GCD(6, 10) = 2 → [6, 2, 15]
2. Replace nums[2] with GCD(2, 15) = 1 → [6, 2, 1]

Now we have a 1 in just 2 operations! Then we need to spread it: 3. Replace nums[1] with GCD(2, 1) = 1 → [6, 1, 1] 4. Replace nums[0] with GCD(6, 1) = 1 → [1, 1, 1]

Total: 4 operations

**Key insight:** The fastest way is to find the shortest subarray whose GCD is 1. In our array:

- Subarray [6, 10] has GCD 2
- Subarray [10, 15] has GCD 5
- Subarray [6, 10, 15] has GCD 1

The subarray [6, 10, 15] of length 3 has GCD 1. To create a 1, we need (length - 1) = 2 operations. Then to spread it to all n elements, we need (n - 1) more operations. Total: 2 + (3 - 1) = 4 operations.

## Brute Force Approach

A naive approach would be to try all possible sequences of operations using BFS or DFS. For each state of the array, we could try all possible operations (n-1 choices of index i, and for each, 2 choices of which element to replace).

The problem with this approach:

1. **State space explosion:** The array can have values up to 10^6, and there are n positions. The number of possible states is astronomical.
2. **No termination guarantee:** We might keep applying operations without making progress.
3. **Exponential time complexity:** O(2^k) where k is the number of operations, which is completely infeasible.

Even for small arrays, this approach fails because we need to consider all possible sequences of operations. The key realization is that we don't need to track the entire array state - we only need to know if we can create a 1 and how quickly.

## Optimized Approach

The optimal solution comes from these observations:

1. **If there's already a 1 in the array:** We just need to convert all other elements to 1. Each non-1 element can be converted in 1 operation by pairing it with an adjacent 1. So the answer is `n - count_of_ones`.

2. **If no 1 exists:** We need to create one first. The operation `gcd(x, y)` replaces either x or y. To get 1, we need to find a contiguous subarray whose GCD is 1. Once we find the shortest such subarray of length `L`, we need:
   - `(L - 1)` operations to reduce that subarray to contain a 1
   - `(n - 1)` operations to spread that 1 to all elements
   - Total: `(L - 1) + (n - 1) = L + n - 2`

3. **If no subarray has GCD 1:** Then it's impossible to get a 1 (since GCD is associative and if all subarrays have GCD > 1, the overall GCD > 1). Return -1.

The challenge is finding the shortest subarray with GCD 1 efficiently. We can't check all O(n²) subarrays naively.

**Key optimization:** Use the fact that for a fixed starting point, as we extend the subarray to the right, the GCD can only decrease or stay the same. We can use a sliding window approach with a GCD segment tree or sparse table for O(1) GCD queries, but there's an even simpler O(n²) approach that works within constraints since n ≤ 50.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(1)
def minOperations(nums):
    """
    Returns minimum operations to make all elements 1, or -1 if impossible.

    Approach:
    1. Count existing 1s - if any, answer is n - count_ones
    2. Otherwise, find shortest subarray with GCD 1
    3. If found, operations = (subarray_len - 1) + (n - 1)
    4. If no such subarray, return -1
    """
    n = len(nums)

    # Step 1: Check if there's already a 1
    count_ones = nums.count(1)
    if count_ones > 0:
        # Each non-1 element needs 1 operation with adjacent 1
        return n - count_ones

    # Step 2: Find shortest subarray with GCD = 1
    min_len = float('inf')

    # Try all possible starting points
    for i in range(n):
        current_gcd = nums[i]

        # Extend subarray to the right
        for j in range(i, n):
            # Update GCD of subarray nums[i..j]
            current_gcd = gcd(current_gcd, nums[j])

            # If we found GCD 1, update minimum length
            if current_gcd == 1:
                subarray_len = j - i + 1
                min_len = min(min_len, subarray_len)
                break  # No need to extend further - GCD won't go back to >1

    # Step 3: If no subarray has GCD 1, impossible
    if min_len == float('inf'):
        return -1

    # Operations to create first 1: (min_len - 1)
    # Operations to spread 1 to all elements: (n - 1)
    return (min_len - 1) + (n - 1)

def gcd(a, b):
    """Euclidean algorithm to compute GCD."""
    while b:
        a, b = b, a % b
    return a
```

```javascript
// Time: O(n^2) | Space: O(1)
function minOperations(nums) {
  /**
   * Returns minimum operations to make all elements 1, or -1 if impossible.
   *
   * Approach:
   * 1. Count existing 1s - if any, answer is n - countOnes
   * 2. Otherwise, find shortest subarray with GCD 1
   * 3. If found, operations = (subarrayLen - 1) + (n - 1)
   * 4. If no such subarray, return -1
   */
  const n = nums.length;

  // Helper function for GCD using Euclidean algorithm
  const gcd = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  // Step 1: Check if there's already a 1
  let countOnes = 0;
  for (let num of nums) {
    if (num === 1) countOnes++;
  }
  if (countOnes > 0) {
    // Each non-1 element needs 1 operation with adjacent 1
    return n - countOnes;
  }

  // Step 2: Find shortest subarray with GCD = 1
  let minLen = Infinity;

  // Try all possible starting points
  for (let i = 0; i < n; i++) {
    let currentGcd = nums[i];

    // Extend subarray to the right
    for (let j = i; j < n; j++) {
      // Update GCD of subarray nums[i..j]
      currentGcd = gcd(currentGcd, nums[j]);

      // If we found GCD 1, update minimum length
      if (currentGcd === 1) {
        const subarrayLen = j - i + 1;
        minLen = Math.min(minLen, subarrayLen);
        break; // No need to extend further
      }
    }
  }

  // Step 3: If no subarray has GCD 1, impossible
  if (minLen === Infinity) {
    return -1;
  }

  // Operations to create first 1: (minLen - 1)
  // Operations to spread 1 to all elements: (n - 1)
  return minLen - 1 + (n - 1);
}
```

```java
// Time: O(n^2) | Space: O(1)
class Solution {
    public int minOperations(int[] nums) {
        /**
         * Returns minimum operations to make all elements 1, or -1 if impossible.
         *
         * Approach:
         * 1. Count existing 1s - if any, answer is n - countOnes
         * 2. Otherwise, find shortest subarray with GCD 1
         * 3. If found, operations = (subarrayLen - 1) + (n - 1)
         * 4. If no such subarray, return -1
         */
        int n = nums.length;

        // Step 1: Check if there's already a 1
        int countOnes = 0;
        for (int num : nums) {
            if (num == 1) countOnes++;
        }
        if (countOnes > 0) {
            // Each non-1 element needs 1 operation with adjacent 1
            return n - countOnes;
        }

        // Step 2: Find shortest subarray with GCD = 1
        int minLen = Integer.MAX_VALUE;

        // Try all possible starting points
        for (int i = 0; i < n; i++) {
            int currentGcd = nums[i];

            // Extend subarray to the right
            for (int j = i; j < n; j++) {
                // Update GCD of subarray nums[i..j]
                currentGcd = gcd(currentGcd, nums[j]);

                // If we found GCD 1, update minimum length
                if (currentGcd == 1) {
                    int subarrayLen = j - i + 1;
                    minLen = Math.min(minLen, subarrayLen);
                    break; // No need to extend further
                }
            }
        }

        // Step 3: If no subarray has GCD 1, impossible
        if (minLen == Integer.MAX_VALUE) {
            return -1;
        }

        // Operations to create first 1: (minLen - 1)
        // Operations to spread 1 to all elements: (n - 1)
        return (minLen - 1) + (n - 1);
    }

    // Euclidean algorithm to compute GCD
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We check O(n²) subarrays in the worst case
- For each subarray, we compute GCD incrementally in O(1) amortized time
- The early break when we find GCD = 1 helps in practice, but worst case is still O(n²)

**Space Complexity:** O(1)

- We only use a few variables: n, count_ones, min_len, current_gcd
- No additional data structures needed

**Why O(n²) is acceptable:**

- Constraints state n ≤ 50, so n² ≤ 2500 operations
- Each GCD computation is very fast (Euclidean algorithm)
- This is much better than the exponential brute force approach

## Common Mistakes

1. **Forgetting to check for existing 1s:** Some candidates jump straight into finding subarrays with GCD 1, missing the simple case where 1s already exist. Always check for the simplest case first.

2. **Incorrect operation counting:** The formula `(min_len - 1) + (n - 1)` has two parts:
   - `(min_len - 1)`: Operations to create the first 1 from the minimal subarray
   - `(n - 1)`: Operations to spread that 1 to all other elements
     Mixing this up leads to off-by-one errors.

3. **Not handling the impossible case:** If no subarray has GCD 1, we must return -1. This happens when all numbers share a common divisor > 1. For example, `[2, 4, 6, 8]` can never produce a 1.

4. **Inefficient GCD computation:** Recomputing GCD from scratch for each subarray would be O(n³). The key is to compute it incrementally as we extend the subarray.

## When You'll See This Pattern

This problem combines several important patterns:

1. **GCD and number theory:** Problems involving divisibility, common factors, or reducing numbers often use GCD. Similar problems:
   - **LeetCode 1497: Check If Array Pairs Are Divisible by k** - Uses remainders and pairing
   - **LeetCode 914: X of a Kind in a Deck of Cards** - Uses GCD to check for partitions

2. **Sliding window with monotonic property:** The GCD of a subarray is non-increasing as we extend it. This monotonic property allows optimization. Similar problems:
   - **LeetCode 209: Minimum Size Subarray Sum** - Find shortest subarray with sum ≥ target
   - **LeetCode 713: Subarray Product Less Than K** - Count subarrays with product < k

3. **Transformation problems:** Problems where you apply operations to transform an array. Similar problems:
   - **LeetCode 1551: Minimum Operations to Make Array Equal** - Different operation but similar reasoning
   - **LeetCode 1827: Minimum Operations to Make the Array Increasing** - Increment operations

## Key Takeaways

1. **Always check for base cases first:** In this problem, checking for existing 1s gives an immediate answer. Many problems have simple special cases that bypass complex logic.

2. **Look for monotonic properties:** When a value (like GCD) only decreases or increases as you extend a window, you can optimize searches. This often enables O(n) or O(n²) solutions instead of exponential ones.

3. **Break problems into phases:** Here we have two clear phases: (1) create the first 1, (2) spread it. Thinking in phases simplifies complex problems and helps with operation counting.

4. **GCD is associative:** `gcd(a, b, c) = gcd(gcd(a, b), c)`. This property lets us compute subarray GCDs incrementally.

[Practice this problem on CodeJeet](/problem/minimum-number-of-operations-to-make-all-array-elements-equal-to-1)
