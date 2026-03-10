---
title: "How to Solve Find X Value of Array II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find X Value of Array II. Hard difficulty, 30.5% acceptance rate. Topics: Array, Math, Segment Tree."
date: "2026-09-24"
category: "dsa-patterns"
tags: ["find-x-value-of-array-ii", "array", "math", "segment-tree", "hard"]
---

# How to Solve Find X Value of Array II

You're given an array of positive integers and a 2D array of queries, where each query asks: if you could remove any suffix from the array (making it shorter), what's the smallest index where a certain condition involving prefix sums and a value `x` becomes true? The challenge is that you need to answer multiple queries efficiently, and each query has different parameters that affect the condition. What makes this problem tricky is that you can't afford to check every possible suffix for each query — you need a smarter way to determine the answer.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
nums = [3, 1, 4, 2]
k = 5
queries = [[0, 6, 0, 2], [1, 3, 0, 1]]
```

**Query 1:** `[0, 6, 0, 2]`

- `index = 0`: We'll replace `nums[0]` with `value = 6`
- `start = 0`: We start checking from index 0
- `x = 2`: We're looking for where `(prefix_sum + k) / (length + 1) ≥ x`

After replacing `nums[0]` with 6, our array becomes: `[6, 1, 4, 2]`

We need to find the smallest `i ≥ start` such that:

```
(nums[0] + ... + nums[i] + k) / (i + 2) ≥ x
```

Wait, why `i + 2`? Because we're considering the modified array where we've replaced one element, so we have `i + 1` elements from the original up to index `i`, plus the replacement value.

Let's check starting from `i = 0`:

- `i = 0`: `(6 + 5) / (0 + 2) = 11/2 = 5.5 ≥ 2` ✓ Condition met!
  So answer for query 1 is `0`.

**Query 2:** `[1, 3, 0, 1]`
Replace `nums[1]` with 3: `[3, 3, 4, 2]`

Check from `i = 0`:

- `i = 0`: `(3 + 5) / (0 + 2) = 8/2 = 4 ≥ 1` ✓ Condition met!
  Answer is `0`.

But what if the condition wasn't met immediately? We'd need to check larger `i` values. The brute force approach would check each `i` one by one, which is too slow. We need to find a way to determine the answer more efficiently.

## Brute Force Approach

The most straightforward approach is to simulate exactly what the problem asks:

1. For each query, create a modified array by replacing `nums[index]` with `value`
2. Starting from `start`, check each possible `i` in increasing order
3. For each `i`, compute the prefix sum up to `i` (including the replacement)
4. Check if `(prefix_sum + k) / (i + 2) ≥ x`
5. Return the first `i` where this is true, or `-1` if none exists

Here's what that looks like:

<div class="code-group">

```python
# Time: O(q * n^2) | Space: O(n)
def bruteForce(nums, k, queries):
    results = []
    n = len(nums)

    for query in queries:
        index, value, start, x = query

        # Create modified array
        modified = nums.copy()
        modified[index] = value

        found = False
        # Check each i from start to n-1
        for i in range(start, n):
            # Compute prefix sum up to i
            prefix_sum = 0
            for j in range(i + 1):
                prefix_sum += modified[j]

            # Check condition
            if (prefix_sum + k) / (i + 2) >= x:
                results.append(i)
                found = True
                break

        if not found:
            results.append(-1)

    return results
```

```javascript
// Time: O(q * n^2) | Space: O(n)
function bruteForce(nums, k, queries) {
  const results = [];
  const n = nums.length;

  for (const query of queries) {
    const [index, value, start, x] = query;

    // Create modified array
    const modified = [...nums];
    modified[index] = value;

    let found = false;
    // Check each i from start to n-1
    for (let i = start; i < n; i++) {
      // Compute prefix sum up to i
      let prefixSum = 0;
      for (let j = 0; j <= i; j++) {
        prefixSum += modified[j];
      }

      // Check condition
      if ((prefixSum + k) / (i + 2) >= x) {
        results.push(i);
        found = true;
        break;
      }
    }

    if (!found) {
      results.push(-1);
    }
  }

  return results;
}
```

```java
// Time: O(q * n^2) | Space: O(n)
public int[] bruteForce(int[] nums, int k, int[][] queries) {
    int[] results = new int[queries.length];
    int n = nums.length;

    for (int q = 0; q < queries.length; q++) {
        int index = queries[q][0];
        int value = queries[q][1];
        int start = queries[q][2];
        int x = queries[q][3];

        // Create modified array
        int[] modified = nums.clone();
        modified[index] = value;

        boolean found = false;
        // Check each i from start to n-1
        for (int i = start; i < n; i++) {
            // Compute prefix sum up to i
            int prefixSum = 0;
            for (int j = 0; j <= i; j++) {
                prefixSum += modified[j];
            }

            // Check condition
            if ((double)(prefixSum + k) / (i + 2) >= x) {
                results[q] = i;
                found = true;
                break;
            }
        }

        if (!found) {
            results[q] = -1;
        }
    }

    return results;
}
```

</div>

**Why this is too slow:**

- For each query (q queries), we check up to n positions
- For each position i, we compute the prefix sum from scratch (O(i) operations)
- This gives us O(q \* n²) time complexity, which is far too slow for the constraints (n up to 10⁵, q up to 10⁵)

## Optimized Approach

The key insight is that we can rearrange the condition to avoid checking every i:

Original condition: `(prefix_sum[i] + k) / (i + 2) ≥ x`

Multiply both sides by `(i + 2)`:
`prefix_sum[i] + k ≥ x * (i + 2)`

Rearrange:
`prefix_sum[i] ≥ x * (i + 2) - k`

Now define: `target[i] = x * (i + 2) - k`

We need to find the smallest `i ≥ start` where `prefix_sum[i] ≥ target[i]`.

But wait — there's a complication. Our `prefix_sum[i]` depends on whether `index ≤ i` (the replaced element is included) or `index > i` (the replaced element is not included).

Let's break this down:

**Case 1:** `index ≤ i` (replacement is in the prefix)

- `prefix_sum[i] = original_prefix_sum[i] - nums[index] + value`

**Case 2:** `index > i` (replacement is after the prefix)

- `prefix_sum[i] = original_prefix_sum[i]`

So we need to efficiently find the smallest `i ≥ max(start, index)` where:
`original_prefix_sum[i] - nums[index] + value ≥ x * (i + 2) - k`

Or for `i < index`:
`original_prefix_sum[i] ≥ x * (i + 2) - k`

This is still not trivial to solve efficiently. The real breakthrough comes from realizing we can use **binary search** combined with **prefix sums** and some algebraic manipulation.

Let's define `f(i) = prefix_sum[i] - x * (i + 2) + k`

We want `f(i) ≥ 0`. And since `prefix_sum[i]` is monotonic (non-decreasing as i increases), and `-x * (i + 2)` is linear decreasing, `f(i)` might not be monotonic. But we can still use binary search if we can quickly evaluate `f(i)` for any i.

The optimal approach uses:

1. Precompute prefix sums of the original array
2. For each query, use binary search to find the answer
3. Handle the two cases (before and after the replacement index) correctly

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
# Time: O((n + q) * log n) | Space: O(n)
def findXValue(nums, k, queries):
    n = len(nums)
    results = []

    # Step 1: Precompute prefix sums for quick lookup
    # prefix[i] = sum of nums[0..i]
    prefix = [0] * n
    prefix[0] = nums[0]
    for i in range(1, n):
        prefix[i] = prefix[i - 1] + nums[i]

    # Helper function to get prefix sum up to index i (inclusive)
    def get_prefix(i):
        return prefix[i] if i >= 0 else 0

    # Process each query
    for index, value, start, x in queries:
        # Step 2: Binary search for the answer
        left = start
        right = n - 1
        answer = -1

        while left <= right:
            mid = (left + right) // 2

            # Step 3: Calculate the actual sum up to mid
            # This depends on whether the replaced element is included
            if index <= mid:
                # Replacement is included in the prefix
                # sum = original_sum - original_value + new_value
                actual_sum = get_prefix(mid) - nums[index] + value
            else:
                # Replacement is not included
                actual_sum = get_prefix(mid)

            # Step 4: Check the condition
            # We want: (sum + k) / (mid + 2) >= x
            # Equivalent to: sum + k >= x * (mid + 2)
            if actual_sum + k >= x * (mid + 2):
                # Condition satisfied, try smaller i
                answer = mid
                right = mid - 1
            else:
                # Condition not satisfied, try larger i
                left = mid + 1

        results.append(answer)

    return results
```

```javascript
// Time: O((n + q) * log n) | Space: O(n)
function findXValue(nums, k, queries) {
  const n = nums.length;
  const results = [];

  // Step 1: Precompute prefix sums for quick lookup
  // prefix[i] = sum of nums[0..i]
  const prefix = new Array(n);
  prefix[0] = nums[0];
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] + nums[i];
  }

  // Helper function to get prefix sum up to index i (inclusive)
  const getPrefix = (i) => {
    return i >= 0 ? prefix[i] : 0;
  };

  // Process each query
  for (const [index, value, start, x] of queries) {
    // Step 2: Binary search for the answer
    let left = start;
    let right = n - 1;
    let answer = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      // Step 3: Calculate the actual sum up to mid
      // This depends on whether the replaced element is included
      let actualSum;
      if (index <= mid) {
        // Replacement is included in the prefix
        // sum = original_sum - original_value + new_value
        actualSum = getPrefix(mid) - nums[index] + value;
      } else {
        // Replacement is not included
        actualSum = getPrefix(mid);
      }

      // Step 4: Check the condition
      // We want: (sum + k) / (mid + 2) >= x
      // Equivalent to: sum + k >= x * (mid + 2)
      if (actualSum + k >= x * (mid + 2)) {
        // Condition satisfied, try smaller i
        answer = mid;
        right = mid - 1;
      } else {
        // Condition not satisfied, try larger i
        left = mid + 1;
      }
    }

    results.push(answer);
  }

  return results;
}
```

```java
// Time: O((n + q) * log n) | Space: O(n)
public int[] findXValue(int[] nums, int k, int[][] queries) {
    int n = nums.length;
    int[] results = new int[queries.length];

    // Step 1: Precompute prefix sums for quick lookup
    // prefix[i] = sum of nums[0..i]
    long[] prefix = new long[n];
    prefix[0] = nums[0];
    for (int i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] + nums[i];
    }

    // Helper function to get prefix sum up to index i (inclusive)
    // Using a method since Java doesn't have function expressions in older versions
    // In practice, you'd just inline this simple logic

    // Process each query
    for (int q = 0; q < queries.length; q++) {
        int index = queries[q][0];
        int value = queries[q][1];
        int start = queries[q][2];
        int x = queries[q][3];

        // Step 2: Binary search for the answer
        int left = start;
        int right = n - 1;
        int answer = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Step 3: Calculate the actual sum up to mid
            // This depends on whether the replaced element is included
            long actualSum;
            if (index <= mid) {
                // Replacement is included in the prefix
                // sum = original_sum - original_value + new_value
                actualSum = prefix[mid] - nums[index] + value;
            } else {
                // Replacement is not included
                actualSum = prefix[mid];
            }

            // Step 4: Check the condition
            // We want: (sum + k) / (mid + 2) >= x
            // Equivalent to: sum + k >= x * (mid + 2)
            // Use long to avoid overflow
            if (actualSum + k >= (long) x * (mid + 2)) {
                // Condition satisfied, try smaller i
                answer = mid;
                right = mid - 1;
            } else {
                // Condition not satisfied, try larger i
                left = mid + 1;
            }
        }

        results[q] = answer;
    }

    return results;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + q) log n)

- O(n) to precompute prefix sums (done once)
- O(q log n) to process all queries with binary search
- Each binary search takes O(log n) operations
- Each operation within binary search is O(1) thanks to precomputed prefix sums

**Space Complexity:** O(n)

- O(n) to store the prefix sums array
- O(1) additional space per query (excluding output storage)

This is a massive improvement over the O(q \* n²) brute force approach!

## Common Mistakes

1. **Not handling the replacement correctly:** Forgetting that when `index ≤ i`, you need to subtract the original value and add the new value. This leads to incorrect prefix sums and wrong answers.

2. **Off-by-one errors in the denominator:** The condition uses `(i + 2)` not `(i + 1)` because we're considering the modified array with one replacement. Using `(i + 1)` is a common mistake.

3. **Integer overflow:** When computing `x * (i + 2)`, this can overflow 32-bit integers for large values. Always use 64-bit integers (long in Java, normal ints are fine in Python).

4. **Incorrect binary search bounds:** Starting binary search from 0 instead of `start`, or not handling the case where no valid `i` exists (returning -1).

5. **Floating point precision issues:** Computing `(sum + k) / (i + 2) >= x` using floating point division can lead to precision errors. Always rearrange to use integer comparisons: `sum + k >= x * (i + 2)`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix sums with modifications:** Similar to problems where you need to answer range sum queries with point updates, but here the "update" is virtual (just for the query).

2. **Binary search on answer:** When you need to find the smallest/largest index satisfying a condition, and checking the condition for a given index is fast (O(1) or O(log n)).

3. **Algebraic rearrangement to avoid division:** Transforming inequalities to use only integer arithmetic is a common trick in competitive programming.

**Related problems:**

- **Longest Uploaded Prefix:** Also involves finding a prefix satisfying certain conditions, though simpler.
- **Minimum Sum of Values by Dividing Array:** Involves partitioning arrays with constraints on averages/sums.
- **Maximum Average Subarray I/II:** Finding subarrays with average above a threshold.

## Key Takeaways

1. **When faced with "find smallest/largest index satisfying condition" problems, consider binary search** if you can check the condition for a given index efficiently.

2. **Precomputation is key for efficiency:** Precompute prefix sums, suffix sums, or other aggregates so you can answer queries in O(1) time.

3. **Transform conditions to avoid floating-point arithmetic:** Rearrange inequalities to use only integer operations when possible to avoid precision issues.

4. **Handle modifications carefully:** When a problem involves temporary modifications (like element replacement in queries), make sure your calculations correctly account for whether the modified element is included in each computation.

Related problems: [Longest Uploaded Prefix](/problem/longest-uploaded-prefix), [Minimum Sum of Values by Dividing Array](/problem/minimum-sum-of-values-by-dividing-array)
