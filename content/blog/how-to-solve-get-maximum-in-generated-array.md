---
title: "How to Solve Get Maximum in Generated Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Get Maximum in Generated Array. Easy difficulty, 51.4% acceptance rate. Topics: Array, Simulation."
date: "2027-01-23"
category: "dsa-patterns"
tags: ["get-maximum-in-generated-array", "array", "simulation", "easy"]
---

# How to Solve Get Maximum in Generated Array

This problem asks us to generate a special sequence based on given recurrence rules and find its maximum value. While the rules look complex at first glance, they're actually straightforward to implement once you understand the pattern. The tricky part is recognizing that we need to generate the entire array up to index `n` before we can find the maximum — there's no shortcut formula. This makes it a classic simulation problem where careful implementation beats clever math.

## Visual Walkthrough

Let's trace through the generation process for `n = 7` to build intuition:

We need to generate `nums[0]` through `nums[7]` (8 elements total).

**Step-by-step generation:**

1. `nums[0] = 0` (given)
2. `nums[1] = 1` (given)
3. For `i = 1`:
   - `2 * i = 2`, so `nums[2] = nums[1] = 1`
   - `2 * i + 1 = 3`, so `nums[3] = nums[1] + nums[2] = 1 + 1 = 2`
4. For `i = 2`:
   - `2 * i = 4`, so `nums[4] = nums[2] = 1`
   - `2 * i + 1 = 5`, so `nums[5] = nums[2] + nums[3] = 1 + 2 = 3`
5. For `i = 3`:
   - `2 * i = 6`, so `nums[6] = nums[3] = 2`
   - `2 * i + 1 = 7`, so `nums[7] = nums[3] + nums[4] = 2 + 1 = 3`

Our array becomes: `[0, 1, 1, 2, 1, 3, 2, 3]`
Maximum value is `3`.

Notice the pattern: even indices (`2*i`) copy from `nums[i]`, while odd indices (`2*i+1`) sum `nums[i]` and `nums[i+1]`. This creates a tree-like structure where values propagate downward.

## Brute Force Approach

The problem definition itself gives us the brute force approach: we must generate every element from index 0 to `n` according to the rules. There's no way to skip elements because each depends on previously computed values. Any "optimization" would still need to compute all values to find the maximum.

However, a naive candidate might try to compute values on-demand without storing the array, but this would lead to redundant calculations. For example, to compute `nums[5] = nums[2] + nums[3]`, we'd need to compute `nums[2]` and `nums[3]`, which themselves depend on other values. This could lead to exponential time complexity if implemented recursively without memoization.

The proper brute force is simply to follow the rules exactly as given, generating the array sequentially.

## Optimal Solution

Since we must generate all values anyway, the optimal solution is straightforward simulation with O(n) time and O(n) space. We'll:

1. Handle edge cases (`n = 0` and `n = 1`)
2. Initialize array with base cases
3. Iterate through indices, applying the rules
4. Track maximum as we go

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def getMaximumGenerated(n):
    """
    Generate the array according to given rules and return the maximum value.

    Rules:
    - nums[0] = 0
    - nums[1] = 1
    - nums[2*i] = nums[i] for 2 <= 2*i <= n
    - nums[2*i+1] = nums[i] + nums[i+1] for 2 <= 2*i+1 <= n
    """

    # Edge cases: n = 0 or n = 1
    if n == 0:
        return 0
    if n == 1:
        return 1

    # Initialize array with base cases
    nums = [0] * (n + 1)
    nums[0] = 0
    nums[1] = 1

    # Track maximum as we generate values
    max_val = 1  # Starting with nums[1] = 1

    # Generate values from index 2 to n
    for i in range(1, n + 1):
        # Rule for even indices: nums[2*i] = nums[i]
        if 2 * i <= n:
            nums[2 * i] = nums[i]
            max_val = max(max_val, nums[2 * i])

        # Rule for odd indices: nums[2*i+1] = nums[i] + nums[i+1]
        if 2 * i + 1 <= n:
            nums[2 * i + 1] = nums[i] + nums[i + 1]
            max_val = max(max_val, nums[2 * i + 1])

    return max_val
```

```javascript
// Time: O(n) | Space: O(n)
function getMaximumGenerated(n) {
  /**
   * Generate the array according to given rules and return the maximum value.
   *
   * Rules:
   * - nums[0] = 0
   * - nums[1] = 1
   * - nums[2*i] = nums[i] for 2 <= 2*i <= n
   * - nums[2*i+1] = nums[i] + nums[i+1] for 2 <= 2*i+1 <= n
   */

  // Edge cases: n = 0 or n = 1
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Initialize array with base cases
  const nums = new Array(n + 1).fill(0);
  nums[0] = 0;
  nums[1] = 1;

  // Track maximum as we generate values
  let maxVal = 1; // Starting with nums[1] = 1

  // Generate values from index 2 to n
  for (let i = 1; i <= n; i++) {
    // Rule for even indices: nums[2*i] = nums[i]
    if (2 * i <= n) {
      nums[2 * i] = nums[i];
      maxVal = Math.max(maxVal, nums[2 * i]);
    }

    // Rule for odd indices: nums[2*i+1] = nums[i] + nums[i+1]
    if (2 * i + 1 <= n) {
      nums[2 * i + 1] = nums[i] + nums[i + 1];
      maxVal = Math.max(maxVal, nums[2 * i + 1]);
    }
  }

  return maxVal;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int getMaximumGenerated(int n) {
        /**
         * Generate the array according to given rules and return the maximum value.
         *
         * Rules:
         * - nums[0] = 0
         * - nums[1] = 1
         * - nums[2*i] = nums[i] for 2 <= 2*i <= n
         * - nums[2*i+1] = nums[i] + nums[i+1] for 2 <= 2*i+1 <= n
         */

        // Edge cases: n = 0 or n = 1
        if (n == 0) return 0;
        if (n == 1) return 1;

        // Initialize array with base cases
        int[] nums = new int[n + 1];
        nums[0] = 0;
        nums[1] = 1;

        // Track maximum as we generate values
        int maxVal = 1;  // Starting with nums[1] = 1

        // Generate values from index 2 to n
        for (int i = 1; i <= n; i++) {
            // Rule for even indices: nums[2*i] = nums[i]
            if (2 * i <= n) {
                nums[2 * i] = nums[i];
                maxVal = Math.max(maxVal, nums[2 * i]);
            }

            // Rule for odd indices: nums[2*i+1] = nums[i] + nums[i+1]
            if (2 * i + 1 <= n) {
                nums[2 * i + 1] = nums[i] + nums[i + 1];
                maxVal = Math.max(maxVal, nums[2 * i + 1]);
            }
        }

        return maxVal;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through indices from 1 to `n`, performing constant-time operations for each
- Each index `i` generates at most two new values (at indices `2*i` and `2*i+1`)
- Even though we might visit some indices multiple times (when they're generated by smaller `i`), the total operations are bounded by O(n) because we only generate each index once

**Space Complexity: O(n)**

- We store the entire array of size `n+1`
- The maximum tracking uses only O(1) extra space

## Common Mistakes

1. **Forgetting edge cases for n = 0 and n = 1**: The rules only apply when `2 <= 2*i <= n` and `2 <= 2*i+1 <= n`. For `n=0`, we only have `nums[0]=0`. For `n=1`, we have `nums[0]=0` and `nums[1]=1`. Always test these small cases.

2. **Incorrect loop bounds**: Starting the loop at `i=0` instead of `i=1` can cause issues because `nums[i+1]` would be undefined when `i=0`. The rules specify `2 <= 2*i` and `2 <= 2*i+1`, which implies `i >= 1`.

3. **Not checking array bounds before assignment**: Always check `2*i <= n` and `2*i+1 <= n` before assigning values. Without these checks, you'll get index out of bounds errors.

4. **Computing maximum after full generation instead of during**: While both approaches work, computing the maximum as you generate values is more efficient and cleaner. It also makes the intention clearer to the interviewer.

## When You'll See This Pattern

This problem exemplifies **simulation with recurrence relations** — a common pattern where you build up a sequence step by step according to fixed rules. Similar problems include:

1. **Fibonacci Number (LeetCode 509)**: The classic recurrence relation `F(n) = F(n-1) + F(n-2)`. Like our problem, it requires building up values sequentially.

2. **N-th Tribonacci Number (LeetCode 1137)**: Extension of Fibonacci with three terms: `T(n) = T(n-1) + T(n-2) + T(n-3)`.

3. **Count Sorted Vowel Strings (LeetCode 1641)**: While not identical, it also involves building up counts based on previous values in a systematic way.

The key insight is recognizing when a problem requires **complete generation** versus when you can find shortcuts. When each element depends on previously computed elements in a predictable way, simulation is often the only/best approach.

## Key Takeaways

1. **Some problems require full simulation**: When elements depend on previously computed values according to fixed rules, you often need to generate the entire sequence. Don't waste time looking for mathematical shortcuts unless the problem strongly suggests one exists.

2. **Track auxiliary results as you go**: When you need both the sequence and some derived value (like maximum), compute the derived value during generation rather than in a separate pass. This is cleaner and more efficient.

3. **Pay attention to index boundaries**: Recurrence relations often have different rules for different parity (even/odd indices) or different ranges. Carefully check the conditions before applying each rule.

Related problems: [Largest Element in an Array after Merge Operations](/problem/largest-element-in-an-array-after-merge-operations)
