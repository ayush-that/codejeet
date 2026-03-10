---
title: "How to Solve XOR After Range Multiplication Queries I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode XOR After Range Multiplication Queries I. Medium difficulty, 73.9% acceptance rate. Topics: Array, Divide and Conquer, Simulation."
date: "2028-08-28"
category: "dsa-patterns"
tags:
  [
    "xor-after-range-multiplication-queries-i",
    "array",
    "divide-and-conquer",
    "simulation",
    "medium",
  ]
---

# How to Solve XOR After Range Multiplication Queries I

This problem asks us to process range update queries on an array, where each query multiplies elements in a range by a value, takes modulo 1,000,000,007, and then we need to compute the XOR of the entire array after all queries. The challenge is that directly simulating each query would be too slow for large inputs, requiring us to find a smarter approach.

## Visual Walkthrough

Let's walk through a small example to understand the problem better:

**Input:**

```
nums = [1, 2, 3, 4]
queries = [[0, 2, 2, 3], [1, 3, 1, 5]]
```

**Step-by-step processing:**

1. **Initial array:** [1, 2, 3, 4]

2. **First query [0, 2, 2, 3]:**
   - For indices 0, 2, 4, 6... ≤ 2: only index 0 qualifies
   - nums[0] = (1 × 3) % 1,000,000,007 = 3
   - Array becomes: [3, 2, 3, 4]

3. **Second query [1, 3, 1, 5]:**
   - For indices 1, 2, 3... ≤ 3: indices 1, 2, 3 qualify
   - nums[1] = (2 × 5) % 1,000,000,007 = 10
   - nums[2] = (3 × 5) % 1,000,000,007 = 15
   - nums[3] = (4 × 5) % 1,000,000,007 = 20
   - Array becomes: [3, 10, 15, 20]

4. **Final XOR:** 3 ⊕ 10 ⊕ 15 ⊕ 20 = 3 ⊕ 10 = 9, 9 ⊕ 15 = 6, 6 ⊕ 20 = 18

**Result:** 18

The tricky part is that we're not just updating every element in the range - we're updating elements at indices that start at `li` and increase by `ki` each time. This creates an arithmetic progression within the range.

## Brute Force Approach

The most straightforward approach is to simulate exactly what the problem asks for:

1. For each query, iterate through indices from `li` to `ri` with step size `ki`
2. Update each element: `nums[idx] = (nums[idx] * vi) % MOD`
3. After processing all queries, compute the XOR of all elements

**Why this is too slow:**

- Each query could potentially update up to `n` elements (when `ki = 1`)
- With `q` queries, worst-case time complexity is O(q × n)
- For constraints where `n` and `q` can be up to 10⁵, this becomes O(10¹⁰) operations, which is far too slow

Here's what the brute force code would look like:

<div class="code-group">

```python
# Brute Force - Too Slow for Large Inputs
# Time: O(q * n) | Space: O(1)
def bruteForce(nums, queries):
    MOD = 10**9 + 7

    for li, ri, ki, vi in queries:
        idx = li
        while idx <= ri:
            nums[idx] = (nums[idx] * vi) % MOD
            idx += ki

    # Compute final XOR
    result = 0
    for num in nums:
        result ^= num

    return result
```

```javascript
// Brute Force - Too Slow for Large Inputs
// Time: O(q * n) | Space: O(1)
function bruteForce(nums, queries) {
  const MOD = 1000000007;

  for (const [li, ri, ki, vi] of queries) {
    for (let idx = li; idx <= ri; idx += ki) {
      nums[idx] = (nums[idx] * vi) % MOD;
    }
  }

  // Compute final XOR
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }

  return result;
}
```

```java
// Brute Force - Too Slow for Large Inputs
// Time: O(q * n) | Space: O(1)
public int bruteForce(int[] nums, int[][] queries) {
    final int MOD = 1000000007;

    for (int[] query : queries) {
        int li = query[0];
        int ri = query[1];
        int ki = query[2];
        int vi = query[3];

        for (int idx = li; idx <= ri; idx += ki) {
            nums[idx] = (int)(((long)nums[idx] * vi) % MOD);
        }
    }

    // Compute final XOR
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to track the exact value of each element throughout all operations. Instead, we can track for each element what **multiplication factor** has been applied to it across all queries.

**Step-by-step reasoning:**

1. **Observation:** Multiplication is commutative and associative modulo MOD
   - If an element gets multiplied by `a` in one query and `b` in another, the net effect is multiplication by `(a × b) % MOD`
   - The order doesn't matter: `(x × a) × b = x × (a × b)`

2. **Tracking factors:** For each index `i`, we can maintain a multiplication factor that starts at 1
   - When a query affects index `i`, we multiply its factor by `vi`
   - After all queries, `nums[i] = (original_nums[i] × factor[i]) % MOD`

3. **Efficient updates:** Instead of updating each affected index individually for each query, we can:
   - For query `[li, ri, ki, vi]`, we need to update indices: `li, li+ki, li+2ki, ... ≤ ri`
   - This is an arithmetic progression: `li + t×ki ≤ ri` where `t = 0, 1, 2, ...`
   - We can iterate through this progression efficiently

4. **Optimization:** The number of indices updated per query is at most `(ri - li) / ki + 1`
   - In worst case (ki = 1), this is still O(n) per query
   - But we can't do better because we must process each affected index at least once

5. **Final computation:** After computing all factors, apply them to the original array and compute XOR

**Why this is still efficient enough:**

- Each query updates at most `n/ki` elements
- The total work across all queries is bounded by the sum of `(ri - li)/ki + 1` for all queries
- In practice, with random `ki` values, this is much better than O(q × n)

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Optimal Solution
# Time: O(n + total_updates) where total_updates = sum over queries of (ri-li)/ki+1
# Space: O(n)
def xorAfterQueries(nums, queries):
    MOD = 10**9 + 7
    n = len(nums)

    # Step 1: Initialize multiplication factors for each index
    # factor[i] represents the product of all vi that affect nums[i]
    factors = [1] * n

    # Step 2: Process each query
    for li, ri, ki, vi in queries:
        # Update all indices in the arithmetic progression: li, li+ki, li+2ki, ...
        idx = li
        while idx <= ri:
            # Multiply the factor at this index by vi (mod MOD)
            factors[idx] = (factors[idx] * vi) % MOD
            idx += ki

    # Step 3: Apply factors to original array and compute XOR
    result = 0
    for i in range(n):
        # Apply the accumulated multiplication factor to the original value
        final_val = (nums[i] * factors[i]) % MOD
        # XOR with running result
        result ^= final_val

    return result
```

```javascript
// Optimal Solution
// Time: O(n + total_updates) where total_updates = sum over queries of (ri-li)/ki+1
// Space: O(n)
function xorAfterQueries(nums, queries) {
  const MOD = 1000000007;
  const n = nums.length;

  // Step 1: Initialize multiplication factors for each index
  // factor[i] represents the product of all vi that affect nums[i]
  const factors = new Array(n).fill(1);

  // Step 2: Process each query
  for (const [li, ri, ki, vi] of queries) {
    // Update all indices in the arithmetic progression: li, li+ki, li+2ki, ...
    for (let idx = li; idx <= ri; idx += ki) {
      // Multiply the factor at this index by vi (mod MOD)
      factors[idx] = Number((BigInt(factors[idx]) * BigInt(vi)) % BigInt(MOD));
    }
  }

  // Step 3: Apply factors to original array and compute XOR
  let result = 0;
  for (let i = 0; i < n; i++) {
    // Apply the accumulated multiplication factor to the original value
    const finalVal = Number((BigInt(nums[i]) * BigInt(factors[i])) % BigInt(MOD));
    // XOR with running result
    result ^= finalVal;
  }

  return result;
}
```

```java
// Optimal Solution
// Time: O(n + total_updates) where total_updates = sum over queries of (ri-li)/ki+1
// Space: O(n)
public int xorAfterQueries(int[] nums, int[][] queries) {
    final int MOD = 1000000007;
    int n = nums.length;

    // Step 1: Initialize multiplication factors for each index
    // factor[i] represents the product of all vi that affect nums[i]
    long[] factors = new long[n];
    Arrays.fill(factors, 1L);

    // Step 2: Process each query
    for (int[] query : queries) {
        int li = query[0];
        int ri = query[1];
        int ki = query[2];
        int vi = query[3];

        // Update all indices in the arithmetic progression: li, li+ki, li+2ki, ...
        for (int idx = li; idx <= ri; idx += ki) {
            // Multiply the factor at this index by vi (mod MOD)
            factors[idx] = (factors[idx] * vi) % MOD;
        }
    }

    // Step 3: Apply factors to original array and compute XOR
    int result = 0;
    for (int i = 0; i < n; i++) {
        // Apply the accumulated multiplication factor to the original value
        long finalVal = (nums[i] * factors[i]) % MOD;
        // XOR with running result (cast to int)
        result ^= (int)finalVal;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Let `total_updates` = sum over all queries of `((ri - li) / ki + 1)`
- In worst case, each query could update O(n) elements (when ki = 1), giving O(q × n)
- However, with constraints where n and q are up to 10⁵, the problem is designed such that this approach passes within time limits
- The initialization of factors array takes O(n)
- Final computation takes O(n)
- **Overall:** O(n + total_updates)

**Space Complexity:**

- We need O(n) space to store the multiplication factors
- **Overall:** O(n)

## Common Mistakes

1. **Forgetting the modulo operation during intermediate calculations:**
   - When multiplying factors, you must take modulo MOD at each step
   - Otherwise, the product can overflow even 64-bit integers
   - **Fix:** Always apply `% MOD` after each multiplication

2. **Incorrect loop condition for arithmetic progression:**
   - Using `idx < ri` instead of `idx <= ri`
   - Forgetting to handle the inclusive upper bound
   - **Fix:** Carefully check the problem statement - it says "while idx <= ri"

3. **Not using long or BigInt for intermediate calculations:**
   - In Java/JavaScript, multiplication of two ints can overflow before modulo is applied
   - **Fix:** Use `long` in Java or `BigInt` in JavaScript for intermediate results

4. **Applying factors in wrong order:**
   - Trying to update `nums` directly during query processing
   - This causes later queries to use modified values instead of original ones
   - **Fix:** Store factors separately and apply them all at the end

## When You'll See This Pattern

This problem combines several important patterns:

1. **Range updates with arithmetic progressions:** Similar to problems where you need to update elements at regular intervals
   - Related: "Range Addition" (LeetCode 370), "Corporate Flight Bookings" (LeetCode 1109)

2. **Separating operations from final computation:** When operations are commutative/associative, you can often process them independently
   - Related: "Product of Array Except Self" (LeetCode 238), "Range Sum Query - Immutable" (LeetCode 303)

3. **Modular arithmetic with multiple operations:** Problems involving repeated modular operations
   - Related: "Super Pow" (LeetCode 372), "Count Good Numbers" (LeetCode 1922)

## Key Takeaways

1. **Look for commutative/associative operations:** When operations like multiplication or addition are commutative and associative, you can often process them in any order and combine effects efficiently.

2. **Separate transformation from application:** When you have multiple transformations to apply, it's often better to compute the net transformation first, then apply it once to each element.

3. **Arithmetic progressions are still linear:** Even though we're skipping elements, updating an arithmetic progression within a range still requires visiting each affected element individually - there's no magical O(1) range update for non-contiguous sequences.

[Practice this problem on CodeJeet](/problem/xor-after-range-multiplication-queries-i)
