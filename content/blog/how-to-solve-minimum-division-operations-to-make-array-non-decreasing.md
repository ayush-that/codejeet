---
title: "How to Solve Minimum Division Operations to Make Array Non Decreasing — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Division Operations to Make Array Non Decreasing. Medium difficulty, 29.1% acceptance rate. Topics: Array, Math, Greedy, Number Theory."
date: "2029-09-01"
category: "dsa-patterns"
tags:
  ["minimum-division-operations-to-make-array-non-decreasing", "array", "math", "greedy", "medium"]
---

# How to Solve Minimum Division Operations to Make Array Non-Decreasing

This problem asks us to transform an array into a non-decreasing sequence using the minimum number of operations, where each operation replaces an element with one of its proper divisors (a positive divisor strictly less than the number itself). The challenge lies in balancing two competing goals: we need to make each element small enough to satisfy the non-decreasing constraint, but we also want to keep elements as large as possible to minimize changes needed for subsequent elements.

What makes this problem interesting is that it combines number theory (finding proper divisors) with greedy decision-making. The optimal approach requires working backwards through the array and making locally optimal choices that guarantee global optimality.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [4, 9, 12, 8]`

**Step 1: Start from the end**
We work backwards because each element's maximum allowed value depends on the element after it (to maintain non-decreasing order).

**Step 2: Process element 8 (index 3)**
This is the last element, so it has no constraint from the right. We want to keep it as large as possible (to make it easier for previous elements). The largest proper divisor of 8 is 4 (since 8 ÷ 2 = 4).

**Step 3: Process element 12 (index 2)**
Now we need 12 ≤ 4 (the value at index 3 after our operation). But 12 > 4, so we must reduce it. We need the largest proper divisor of 12 that is ≤ 4. The proper divisors of 12 are: 1, 2, 3, 4, 6. The largest one ≤ 4 is 4. So we replace 12 with 4. Operations count: 1.

**Step 4: Process element 9 (index 1)**
Now we need 9 ≤ 4 (the value at index 2). 9 > 4, so we must reduce it. Proper divisors of 9: 1, 3. The largest one ≤ 4 is 3. Replace 9 with 3. Operations count: 2.

**Step 5: Process element 4 (index 0)**
We need 4 ≤ 3 (the value at index 1). 4 > 3, so we must reduce it. Proper divisors of 4: 1, 2. The largest one ≤ 3 is 2. Replace 4 with 2. Operations count: 3.

Final array: `[2, 3, 4, 4]` which is non-decreasing. Total operations: 3.

The key insight: by working backwards and always choosing the largest proper divisor that satisfies the constraint, we minimize operations for the entire array.

## Brute Force Approach

A naive approach would try all possible sequences of operations, but this is exponential in the array length. Even for a modest array of length 20, each element could have many proper divisors, leading to a combinatorial explosion.

Another brute force idea: try to minimize each element independently from left to right. But this fails because making an element too small early on might force unnecessary operations later. For example, in `[9, 3]`, if we reduce 9 to 1 (its smallest proper divisor), we use 1 operation. But if we reduce 9 to 3 (its largest proper divisor ≤ 3), we also use 1 operation, and the array becomes `[3, 3]` which is valid. Both approaches give 1 operation here, but consider `[9, 3, 2]`: reducing 9 to 1 forces us to also reduce 3 to 1 (since 3 > 2), requiring 2 total operations. The optimal solution reduces 9 to 3, then 3 to 2, requiring 2 operations as well. The real issue arises with more complex patterns where local decisions have global consequences.

The brute force approach is impractical because:

1. The number of proper divisors can be substantial (up to √n divisors)
2. The array length can be up to 10⁵
3. We'd need to explore all combinations of divisor choices

## Optimized Approach

The optimal solution uses a **greedy backward pass** with careful divisor selection:

**Key Insight 1: Work backwards**
Since each element only needs to be ≤ the next element (not the previous one), processing from right to left lets us determine the maximum allowed value for each element based on what we've already decided for the element to its right.

**Key Insight 2: Always choose the largest valid divisor**
For element `nums[i]`, we need to find the largest proper divisor of `nums[i]` that is ≤ `nums[i+1]` (the value we've already determined for the next element). If no such divisor exists, we must repeatedly divide until we find one ≤ `nums[i+1]`.

**Key Insight 3: The optimal divisor is the largest one ≤ target**
This minimizes the reduction at each step, making it easier for previous elements to satisfy their constraints.

**Why this greedy approach works:**
By working backwards and always choosing the largest possible value at each step, we ensure that each element is as large as possible while still allowing the array to become non-decreasing. This local optimality leads to global optimality because:

1. Making `nums[i]` larger can only help `nums[i-1]` (it has a larger target to aim for)
2. There's no benefit to making `nums[i]` smaller than necessary
3. The problem has optimal substructure: the optimal solution for the suffix `nums[i:]` can be built from the optimal solution for `nums[i+1:]`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * sqrt(max(nums))) | Space: O(1)
def minOperations(nums):
    """
    Returns the minimum number of division operations needed to make
    the array non-decreasing.

    Approach: Process array from right to left. For each element,
    find the largest proper divisor <= the next element's value.
    If no such divisor exists, repeatedly divide by smallest prime
    factor until condition is satisfied.
    """
    n = len(nums)
    operations = 0

    # Start from the second last element and move backwards
    for i in range(n - 2, -1, -1):
        current = nums[i]
        next_val = nums[i + 1]

        # If current is already <= next, no operation needed
        if current <= next_val:
            continue

        # We need to reduce current to be <= next_val
        # Find the largest proper divisor of current that is <= next_val

        # Special case: if next_val is 1, current must become 1
        # (since 1 has no proper divisors, we must divide down to 1)
        if next_val == 1:
            operations += 1  # We'll need at least one operation
            # Actually, we need to count how many divisions to reach 1
            # But since we're counting operations (not divisions),
            # each element change counts as 1 operation
            nums[i] = 1
            operations += 0  # Already counted above
            continue

        # Try to find a divisor in one step
        # We need the largest divisor d where d <= next_val and d < current
        # Start from next_val and go downwards to find a divisor
        found = False
        for candidate in range(next_val, 0, -1):
            if current % candidate == 0 and candidate < current:
                nums[i] = candidate
                operations += 1
                found = True
                break

        # If no single divisor works, we need to repeatedly divide
        # by the smallest prime factor until we get <= next_val
        if not found:
            # Count this as one operation (even though we might
            # conceptually divide multiple times, each element
            # replacement counts as one operation)
            operations += 1

            # We need to reduce current to at most next_val
            # The most efficient way is to divide by smallest
            # prime factors repeatedly
            temp = current
            while temp > next_val:
                # Find smallest prime factor > 1
                for divisor in range(2, int(temp**0.5) + 1):
                    if temp % divisor == 0:
                        temp //= divisor
                        break
                else:
                    # temp is prime, can only divide by itself to get 1
                    temp = 1

            nums[i] = temp

    return operations
```

```javascript
// Time: O(n * sqrt(max(nums))) | Space: O(1)
function minOperations(nums) {
  /**
   * Returns the minimum number of division operations needed to make
   * the array non-decreasing.
   *
   * Approach: Process array from right to left. For each element,
   * find the largest proper divisor <= the next element's value.
   * If no such divisor exists, repeatedly divide by smallest prime
   * factor until condition is satisfied.
   */
  const n = nums.length;
  let operations = 0;

  // Start from the second last element and move backwards
  for (let i = n - 2; i >= 0; i--) {
    let current = nums[i];
    const nextVal = nums[i + 1];

    // If current is already <= next, no operation needed
    if (current <= nextVal) {
      continue;
    }

    // We need to reduce current to be <= nextVal
    // Find the largest proper divisor of current that is <= nextVal

    // Special case: if nextVal is 1, current must become 1
    if (nextVal === 1) {
      operations += 1;
      nums[i] = 1;
      continue;
    }

    // Try to find a divisor in one step
    // Start from nextVal and go downwards to find a divisor
    let found = false;
    for (let candidate = nextVal; candidate >= 1; candidate--) {
      if (current % candidate === 0 && candidate < current) {
        nums[i] = candidate;
        operations += 1;
        found = true;
        break;
      }
    }

    // If no single divisor works, we need to repeatedly divide
    if (!found) {
      operations += 1;

      // Reduce current to at most nextVal by dividing
      // by smallest prime factors
      let temp = current;
      while (temp > nextVal) {
        // Find smallest prime factor > 1
        let divisorFound = false;
        for (let divisor = 2; divisor <= Math.sqrt(temp); divisor++) {
          if (temp % divisor === 0) {
            temp = Math.floor(temp / divisor);
            divisorFound = true;
            break;
          }
        }
        if (!divisorFound) {
          // temp is prime, can only divide by itself to get 1
          temp = 1;
          break;
        }
      }

      nums[i] = temp;
    }
  }

  return operations;
}
```

```java
// Time: O(n * sqrt(max(nums))) | Space: O(1)
class Solution {
    public int minOperations(int[] nums) {
        /**
         * Returns the minimum number of division operations needed to make
         * the array non-decreasing.
         *
         * Approach: Process array from right to left. For each element,
         * find the largest proper divisor <= the next element's value.
         * If no such divisor exists, repeatedly divide by smallest prime
         * factor until condition is satisfied.
         */
        int n = nums.length;
        int operations = 0;

        // Start from the second last element and move backwards
        for (int i = n - 2; i >= 0; i--) {
            int current = nums[i];
            int nextVal = nums[i + 1];

            // If current is already <= next, no operation needed
            if (current <= nextVal) {
                continue;
            }

            // We need to reduce current to be <= nextVal
            // Find the largest proper divisor of current that is <= nextVal

            // Special case: if nextVal is 1, current must become 1
            if (nextVal == 1) {
                operations += 1;
                nums[i] = 1;
                continue;
            }

            // Try to find a divisor in one step
            // Start from nextVal and go downwards to find a divisor
            boolean found = false;
            for (int candidate = nextVal; candidate >= 1; candidate--) {
                if (current % candidate == 0 && candidate < current) {
                    nums[i] = candidate;
                    operations += 1;
                    found = true;
                    break;
                }
            }

            // If no single divisor works, we need to repeatedly divide
            if (!found) {
                operations += 1;

                // Reduce current to at most nextVal by dividing
                // by smallest prime factors
                int temp = current;
                while (temp > nextVal) {
                    // Find smallest prime factor > 1
                    boolean divisorFound = false;
                    for (int divisor = 2; divisor * divisor <= temp; divisor++) {
                        if (temp % divisor == 0) {
                            temp /= divisor;
                            divisorFound = true;
                            break;
                        }
                    }
                    if (!divisorFound) {
                        // temp is prime, can only divide by itself to get 1
                        temp = 1;
                        break;
                    }
                }

                nums[i] = temp;
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* √m) where n is the array length and m is the maximum value in the array.

- We iterate through the array once: O(n)
- For each element, in the worst case we:
  1. Try divisors from `nextVal` down to 1: O(nextVal) ≤ O(m)
  2. If no divisor found, factor the number by checking up to √current: O(√current) ≤ O(√m)
- The worst case occurs when we need to factor each element, giving O(n \* √m)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- We modify the input array in place (though we could work with copies if needed)

In practice, the divisor search often terminates quickly, and the √m factor is manageable since m ≤ 10⁶ in typical constraints.

## Common Mistakes

1. **Working left to right instead of right to left**: This is the most common mistake. When you process from left to right, reducing an element affects all elements to its right, potentially causing a cascade of unnecessary operations. Working backwards ensures each decision only affects previous elements, which haven't been processed yet.

2. **Not handling the "no proper divisor" case correctly**: When `next_val = 1`, the only proper divisor any number can have that's ≤ 1 is 1 itself. But 1 is not a proper divisor of 1 (since proper divisors must be strictly less than the number). Candidates often miss this edge case.

3. **Counting each division instead of each operation**: The problem counts "operations" where each operation replaces an element with a proper divisor. Even if you need to conceptually divide multiple times to get from 12 to 3 (12→6→3), that's still one operation because you're replacing 12 with 3 directly.

4. **Not optimizing divisor selection**: Simply choosing the smallest proper divisor (always 1) would work but would maximize operations. The optimal solution requires finding the largest valid divisor to minimize the reduction at each step.

## When You'll See This Pattern

This greedy backward pass pattern appears in several array transformation problems:

1. **Smallest Value After Replacing With Sum of Prime Factors (LeetCode 2507)**: Similar structure where you work backwards/forwards and make optimal local decisions about factor replacement.

2. **Non-decreasing Array (LeetCode 665)**: While the approach is different, the constraint (making array non-decreasing with minimal changes) is similar. Both require careful consideration of how changes propagate through the array.

3. **Minimum Replacements to Sort the Array (LeetCode 2366)**: Almost identical problem structure where you work backwards and break numbers into parts to satisfy non-decreasing order.

The core pattern is: **when an element's constraint comes from later elements, process backwards and make locally optimal choices that respect future constraints.**

## Key Takeaways

1. **Backward processing is key for one-way constraints**: When each element only needs to satisfy a condition relative to the next element (not the previous one), working backwards lets you determine exact requirements before making decisions.

2. **Greedy divisor selection**: Always choose the largest proper divisor that satisfies the constraint. This minimizes reduction at each step, making it easier for previous elements.

3. **Prime factorization for efficient reduction**: When you can't find a suitable divisor directly, repeatedly dividing by the smallest prime factor is the most efficient way to reduce a number while counting minimal operations.

Related problems: [Smallest Value After Replacing With Sum of Prime Factors](/problem/smallest-value-after-replacing-with-sum-of-prime-factors)
