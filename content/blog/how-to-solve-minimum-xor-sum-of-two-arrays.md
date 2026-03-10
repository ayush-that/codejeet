---
title: "How to Solve Minimum XOR Sum of Two Arrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum XOR Sum of Two Arrays. Hard difficulty, 50.6% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2029-11-15"
category: "dsa-patterns"
tags: ["minimum-xor-sum-of-two-arrays", "array", "dynamic-programming", "bit-manipulation", "hard"]
---

# How to Solve Minimum XOR Sum of Two Arrays

This problem asks us to find the minimum possible XOR sum when we can permute the second array arbitrarily. Specifically, given two arrays `nums1` and `nums2` of length `n`, we need to pair each element of `nums1` with exactly one element from `nums2` (after rearranging `nums2`) to minimize the sum of their XOR values. The challenge is that we can't simply sort both arrays and pair them directly—XOR doesn't behave like addition or subtraction when sorted, so we need to consider all possible pairings.

What makes this problem interesting is that it looks like a pairing problem but has a combinatorial explosion: there are `n!` possible ways to pair the arrays. The key insight is recognizing this as an **assignment problem** that can be solved efficiently using **bitmask dynamic programming**, where each bit in the mask represents whether we've used a particular element from `nums2`.

## Visual Walkthrough

Let's walk through a small example: `nums1 = [1, 2]` and `nums2 = [2, 3]`.

We need to pair each element from `nums1` with exactly one element from `nums2`. The possible pairings are:

1. Pair `nums1[0]=1` with `nums2[0]=2`, and `nums1[1]=2` with `nums2[1]=3`:
   - XOR sum = `(1 XOR 2) + (2 XOR 3)` = `3 + 1` = `4`

2. Pair `nums1[0]=1` with `nums2[1]=3`, and `nums1[1]=2` with `nums2[0]=2`:
   - XOR sum = `(1 XOR 3) + (2 XOR 2)` = `2 + 0` = `2`

The minimum XOR sum is `2`. Notice that the optimal pairing isn't necessarily pairing elements in sorted order or by any simple heuristic—we need to consider all possibilities.

Now let's think about how to systematically explore these possibilities. For the first element of `nums1` (value 1), we have two choices from `nums2`: use `2` or `3`. Once we make that choice, we have only one remaining choice for the second element of `nums1`. This is essentially a **permutation** of `nums2`, and we need to find the permutation that minimizes the sum.

## Brute Force Approach

The brute force solution would generate all permutations of `nums2` and calculate the XOR sum for each permutation, keeping track of the minimum. For an array of length `n`, there are `n!` permutations, making this approach `O(n! * n)` time complexity, which is completely infeasible for `n` up to 14 (the problem constraints).

Even though `n=14` seems small, `14! ≈ 87 billion`, which is far too large. We need a more efficient way to explore the search space without explicitly generating all permutations.

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(n! * n) | Space: O(n) for recursion depth
def minimumXORSumBruteForce(nums1, nums2):
    n = len(nums1)
    min_sum = float('inf')

    def backtrack(used, current_sum, idx):
        nonlocal min_sum

        if idx == n:
            min_sum = min(min_sum, current_sum)
            return

        for i in range(n):
            if not used[i]:
                used[i] = True
                backtrack(used, current_sum + (nums1[idx] ^ nums2[i]), idx + 1)
                used[i] = False

    backtrack([False] * n, 0, 0)
    return min_sum
```

```javascript
// Time: O(n! * n) | Space: O(n) for recursion depth
function minimumXORSumBruteForce(nums1, nums2) {
  const n = nums1.length;
  let minSum = Infinity;

  function backtrack(used, currentSum, idx) {
    if (idx === n) {
      minSum = Math.min(minSum, currentSum);
      return;
    }

    for (let i = 0; i < n; i++) {
      if (!used[i]) {
        used[i] = true;
        backtrack(used, currentSum + (nums1[idx] ^ nums2[i]), idx + 1);
        used[i] = false;
      }
    }
  }

  backtrack(new Array(n).fill(false), 0, 0);
  return minSum;
}
```

```java
// Time: O(n! * n) | Space: O(n) for recursion depth
public int minimumXORSumBruteForce(int[] nums1, int[] nums2) {
    int n = nums1.length;
    int[] minSum = {Integer.MAX_VALUE};

    backtrack(new boolean[n], 0, 0, nums1, nums2, minSum);
    return minSum[0];
}

private void backtrack(boolean[] used, int currentSum, int idx,
                       int[] nums1, int[] nums2, int[] minSum) {
    if (idx == nums1.length) {
        minSum[0] = Math.min(minSum[0], currentSum);
        return;
    }

    for (int i = 0; i < nums2.length; i++) {
        if (!used[i]) {
            used[i] = true;
            backtrack(used, currentSum + (nums1[idx] ^ nums2[i]), idx + 1,
                     nums1, nums2, minSum);
            used[i] = false;
        }
    }
}
```

</div>

The brute force approach is too slow because it explores all `n!` permutations. We need to find overlapping subproblems to apply dynamic programming.

## Optimized Approach

The key insight is that this is an **assignment problem** that can be solved with **bitmask dynamic programming**.

**Why bitmask?**

- We need to track which elements from `nums2` have been used
- With `n ≤ 14`, we can represent the used/unused state of `nums2` elements as a bitmask of length `n`
- A `1` in position `i` means `nums2[i]` has been used, `0` means it's still available

**DP State Definition:**
Let `dp[mask]` represent the minimum XOR sum achievable when we have:

- Processed the first `k` elements of `nums1`, where `k = number of 1s in mask` (each `1` represents a used element from `nums2`)
- The used elements from `nums2` are exactly those with `1` bits in `mask`

**DP Transition:**
When we're at state `mask` with `k` ones (meaning we've paired `k` elements from `nums1`), we need to pair the next element `nums1[k]` with some available element from `nums2`. For each `i` where the `i`-th bit of `mask` is `0` (element not used), we can:

1. Set the `i`-th bit to `1` (mark `nums2[i]` as used)
2. Add `nums1[k] ^ nums2[i]` to the cost
3. Transition to the new state `mask | (1 << i)`

The recurrence relation is:

```
dp[mask] = min over all i where mask's i-th bit is 0 of {
    dp[mask ^ (1 << i)] + (nums1[count_ones(mask)-1] ^ nums2[i])
}
```

**Why this works:**
We're building the solution incrementally. At each step, we choose which element from `nums2` to pair with the next element from `nums1`. The bitmask tells us which `nums2` elements are still available. This approach has `2^n` states and `n` transitions per state, giving us `O(n * 2^n)` time complexity, which is much better than `O(n!)` for `n=14` (`14 * 2^14 ≈ 14 * 16384 ≈ 230,000` operations).

## Optimal Solution

Here's the complete solution using bitmask DP:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(2^n)
def minimumXORSum(nums1, nums2):
    n = len(nums1)
    # dp[mask] = minimum XOR sum using elements from nums2 marked by '1' bits in mask
    # mask has exactly k ones, where k is how many elements we've processed from nums1
    dp = [float('inf')] * (1 << n)
    dp[0] = 0  # Base case: no elements used, cost is 0

    # Iterate through all possible masks
    for mask in range(1 << n):
        # Count how many elements from nums1 we've processed (number of 1 bits in mask)
        k = bin(mask).count('1')

        # If we've processed all elements, continue
        if k >= n:
            continue

        # Try pairing nums1[k] with each available element from nums2
        for i in range(n):
            # Check if nums2[i] is not used (i-th bit is 0 in mask)
            if not (mask & (1 << i)):
                new_mask = mask | (1 << i)  # Mark nums2[i] as used
                # Update dp[new_mask] with the minimum cost
                dp[new_mask] = min(dp[new_mask], dp[mask] + (nums1[k] ^ nums2[i]))

    # All elements used (mask with all 1s) contains the answer
    return dp[(1 << n) - 1]
```

```javascript
// Time: O(n * 2^n) | Space: O(2^n)
function minimumXORSum(nums1, nums2) {
  const n = nums1.length;
  // dp[mask] = minimum XOR sum using elements from nums2 marked by '1' bits in mask
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0; // Base case: no elements used, cost is 0

  // Helper function to count bits in a number
  function countBits(x) {
    let count = 0;
    while (x > 0) {
      count += x & 1;
      x >>= 1;
    }
    return count;
  }

  // Iterate through all possible masks
  for (let mask = 0; mask < 1 << n; mask++) {
    // Count how many elements from nums1 we've processed
    const k = countBits(mask);

    // If we've processed all elements, continue
    if (k >= n) continue;

    // Try pairing nums1[k] with each available element from nums2
    for (let i = 0; i < n; i++) {
      // Check if nums2[i] is not used (i-th bit is 0 in mask)
      if (!(mask & (1 << i))) {
        const newMask = mask | (1 << i); // Mark nums2[i] as used
        // Update dp[newMask] with the minimum cost
        dp[newMask] = Math.min(dp[newMask], dp[mask] + (nums1[k] ^ nums2[i]));
      }
    }
  }

  // All elements used (mask with all 1s) contains the answer
  return dp[(1 << n) - 1];
}
```

```java
// Time: O(n * 2^n) | Space: O(2^n)
public int minimumXORSum(int[] nums1, int[] nums2) {
    int n = nums1.length;
    // dp[mask] = minimum XOR sum using elements from nums2 marked by '1' bits in mask
    int[] dp = new int[1 << n];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;  // Base case: no elements used, cost is 0

    // Iterate through all possible masks
    for (int mask = 0; mask < (1 << n); mask++) {
        // Count how many elements from nums1 we've processed (number of 1 bits in mask)
        int k = Integer.bitCount(mask);

        // If we've processed all elements, continue
        if (k >= n) continue;

        // Try pairing nums1[k] with each available element from nums2
        for (int i = 0; i < n; i++) {
            // Check if nums2[i] is not used (i-th bit is 0 in mask)
            if ((mask & (1 << i)) == 0) {
                int newMask = mask | (1 << i);  // Mark nums2[i] as used
                // Update dp[newMask] with the minimum cost
                int newCost = dp[mask] + (nums1[k] ^ nums2[i]);
                if (newCost < dp[newMask]) {
                    dp[newMask] = newCost;
                }
            }
        }
    }

    // All elements used (mask with all 1s) contains the answer
    return dp[(1 << n) - 1];
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * 2^n)`

- We have `2^n` possible masks (states in our DP)
- For each mask, we iterate through `n` elements to try pairing with the next `nums1` element
- Counting bits can be done in `O(1)` using built-in functions or precomputation

**Space Complexity:** `O(2^n)`

- We store a DP array of size `2^n`
- No additional significant space is used

For the maximum constraint `n = 14`, this gives us approximately `14 * 2^14 = 14 * 16,384 = 229,376` operations, which is efficient.

## Common Mistakes

1. **Trying to sort and pair:** XOR doesn't preserve order like addition or subtraction. The minimum XOR between two numbers doesn't necessarily occur between the closest numbers when sorted. For example, `1 XOR 2 = 3` but `1 XOR 3 = 2`, so smaller numbers don't always give smaller XOR results.

2. **Incorrect DP state definition:** Some candidates try to use `dp[i][j]` representing the minimum XOR sum using first `i` elements of `nums1` and first `j` elements of `nums2`. This doesn't work because we can permute `nums2` arbitrarily—we're not restricted to using elements in order.

3. **Forgetting that arrays have equal length:** The problem guarantees `nums1` and `nums2` have the same length `n`, but some candidates add unnecessary checks for different lengths. While defensive programming is good, it's important to read the problem constraints carefully.

4. **Bitmask indexing errors:** When working with bitmasks, off-by-one errors are common. Remember that `(1 << i)` creates a mask with a `1` at position `i` (0-indexed). Also, `mask & (1 << i)` checks if the `i`-th bit is set, not the `(i+1)`-th bit.

## When You'll See This Pattern

The bitmask DP pattern for assignment/permutation problems appears in several LeetCode problems:

1. **Fair Distribution of Cookies (Medium):** Distribute cookies to children to minimize the maximum cookies any child gets. Uses bitmask DP to try all distributions.

2. **Maximum AND Sum of Array (Hard):** Very similar to this problem—assign numbers to slots to maximize AND sum instead of minimizing XOR sum.

3. **Choose Numbers From Two Arrays in Range (Hard):** Another assignment problem that can be solved with bitmask DP.

4. **Campus Bikes II (Medium):** Assign bikes to workers to minimize total Manhattan distance.

The pattern to recognize: when you need to assign `n` items to `n` slots (or similar one-to-one matching) and the cost depends on which item goes to which slot, and `n` is small enough (typically ≤ 20), bitmask DP is often the right approach.

## Key Takeaways

1. **Bitmask DP is perfect for assignment problems:** When you need to track which items have been used/assigned and `n` is small (≤ 20), a bitmask can efficiently represent the state.

2. **Look for one-to-one matching:** Problems that involve pairing elements from two sets (like this one) or assigning tasks to workers often have this structure.

3. **State definition is crucial:** In bitmask DP, the state usually represents which items have been used, and the transition involves choosing the next item to use. The number of processed items is often implicit in the bitmask (count of 1 bits).

4. **Time complexity `O(n * 2^n)` is acceptable for `n ≤ 20`:** This is a good rule of thumb—if `n` is around 20 or less, `n * 2^n` operations (around 20 million for n=20) are usually acceptable within time limits.

Related problems: [Fair Distribution of Cookies](/problem/fair-distribution-of-cookies), [Choose Numbers From Two Arrays in Range](/problem/choose-numbers-from-two-arrays-in-range), [Maximum AND Sum of Array](/problem/maximum-and-sum-of-array)
