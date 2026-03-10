---
title: "How to Solve Zero Array Transformation I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Zero Array Transformation I. Medium difficulty, 54.4% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-08-24"
category: "dsa-patterns"
tags: ["zero-array-transformation-i", "array", "prefix-sum", "medium"]
---

# How to Solve Zero Array Transformation I

You're given an array `nums` and a list of range queries. For each query `[l, r]`, you can select any subset of indices in that range and decrement their values by 1. The goal is to determine if you can make all elements in `nums` equal to zero. What makes this problem interesting is that you have flexibility within each query—you don't have to decrement every index in the range, just some subset of them.

The key insight is that this flexibility actually simplifies the problem: for any query `[l, r]`, you can choose to decrement only the indices that still need to be reduced. This means each query effectively gives you the ability to reduce any element in its range by 1, as long as you haven't already used up all your "decrement opportunities" for that position.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
nums = [2, 3, 2, 1]
queries = [[0, 2], [1, 3], [0, 3]]
```

**Step 1: Understanding the requirements**

- `nums[0] = 2` needs to be decremented 2 times
- `nums[1] = 3` needs to be decremented 3 times
- `nums[2] = 2` needs to be decremented 2 times
- `nums[3] = 1` needs to be decremented 1 time

**Step 2: Analyzing query coverage**

- Query `[0, 2]` covers indices 0, 1, 2
- Query `[1, 3]` covers indices 1, 2, 3
- Query `[0, 3]` covers all indices 0, 1, 2, 3

**Step 3: Thinking about decrement allocation**
For index 0: It's covered by queries `[0, 2]` and `[0, 3]`. So we have 2 opportunities to decrement it.
For index 1: Covered by all 3 queries. So we have 3 opportunities.
For index 2: Covered by all 3 queries. So we have 3 opportunities.
For index 3: Covered by queries `[1, 3]` and `[0, 3]`. So we have 2 opportunities.

**Step 4: Checking feasibility**

- Index 0 needs 2 decrements, has 2 opportunities → OK
- Index 1 needs 3 decrements, has 3 opportunities → OK
- Index 2 needs 2 decrements, has 3 opportunities → OK
- Index 3 needs 1 decrement, has 2 opportunities → OK

Since every index has at least as many covering queries as it needs decrements, we can make the array zero. The algorithm we'll develop essentially counts how many queries cover each index and compares that to the value at that index.

## Brute Force Approach

A naive approach would be to simulate the process: for each query, try to decrement as many indices as possible that still need reduction. However, this gets complicated because we need to decide which indices to decrement in each query.

An even simpler brute force would be to check all possible ways to use the queries, but with `n` up to 10^5 and queries up to 10^5, this is impossible—there are exponentially many possibilities.

What a candidate might initially try is to sort queries and greedily apply them, but this fails because:

1. We don't know which indices to decrement in each query
2. Even if we decrement the largest values first, we might run out of coverage for smaller values later

The brute force approach would have exponential time complexity, which is clearly unacceptable for the constraints.

## Optimized Approach

The key insight is that **each query `[l, r]` gives us one "decrement token" that we can apply to any index in the range `[l, r]`**. Since we can choose which indices to decrement, we don't care about the order of queries or which specific indices get decremented in each query. All that matters is:

1. For each index `i`, count how many queries cover it (call this `coverage[i]`)
2. For the array to be transformable to zero, we need `coverage[i] >= nums[i]` for every index `i`

Why does this work? If an index `i` is covered by `k` queries, we have `k` opportunities to decrement it. We need exactly `nums[i]` decrements to make it zero. If `k >= nums[i]`, we can allocate `nums[i]` of those `k` queries to decrement index `i`. Since queries are independent and we can choose different subsets of indices for each query, we can always make this allocation work.

The challenge now is to efficiently compute `coverage[i]` for all indices. A naive approach would be to, for each query, increment a counter for all indices in its range, but that would be O(n × q) time, which is too slow for n, q up to 10^5.

The solution is to use **difference array** or **prefix sum** technique:

- Create an array `diff` of size `n+1` initialized to zeros
- For each query `[l, r]`, do `diff[l] += 1` and `diff[r+1] -= 1`
- Compute prefix sum of `diff` to get `coverage` array

This works because after processing all queries, `coverage[i] = diff[0] + diff[1] + ... + diff[i]`, which counts how many queries start at or before `i` and end at or after `i`.

## Optimal Solution

Here's the complete solution using the difference array technique:

<div class="code-group">

```python
# Time: O(n + q) where n = len(nums), q = len(queries)
# Space: O(n) for the difference array
def isZeroArray(self, nums, queries):
    n = len(nums)

    # Step 1: Create difference array of size n+1
    # We need n+1 because we might need to mark r+1 which could be n
    diff = [0] * (n + 1)

    # Step 2: Process each query
    # For query [l, r], we increment diff[l] and decrement diff[r+1]
    # This marks that queries start at l and end at r
    for l, r in queries:
        diff[l] += 1
        # Only decrement if r+1 is within bounds
        if r + 1 < n:
            diff[r + 1] -= 1

    # Step 3: Compute prefix sum to get coverage count for each index
    coverage = 0  # Running prefix sum
    for i in range(n):
        coverage += diff[i]
        # Step 4: Check if coverage is sufficient for nums[i]
        # If coverage < nums[i] at any point, we can't make the array zero
        if coverage < nums[i]:
            return False

    # Step 5: All indices have sufficient coverage
    return True
```

```javascript
// Time: O(n + q) where n = nums.length, q = queries.length
// Space: O(n) for the difference array
function isZeroArray(nums, queries) {
  const n = nums.length;

  // Step 1: Create difference array of size n+1
  // We need n+1 because we might need to mark r+1 which could be n
  const diff = new Array(n + 1).fill(0);

  // Step 2: Process each query
  // For query [l, r], we increment diff[l] and decrement diff[r+1]
  // This marks that queries start at l and end at r
  for (const [l, r] of queries) {
    diff[l] += 1;
    // Only decrement if r+1 is within bounds
    if (r + 1 < n) {
      diff[r + 1] -= 1;
    }
  }

  // Step 3: Compute prefix sum to get coverage count for each index
  let coverage = 0; // Running prefix sum
  for (let i = 0; i < n; i++) {
    coverage += diff[i];
    // Step 4: Check if coverage is sufficient for nums[i]
    // If coverage < nums[i] at any point, we can't make the array zero
    if (coverage < nums[i]) {
      return false;
    }
  }

  // Step 5: All indices have sufficient coverage
  return true;
}
```

```java
// Time: O(n + q) where n = nums.length, q = queries.length
// Space: O(n) for the difference array
public boolean isZeroArray(int[] nums, int[][] queries) {
    int n = nums.length;

    // Step 1: Create difference array of size n+1
    // We need n+1 because we might need to mark r+1 which could be n
    int[] diff = new int[n + 1];

    // Step 2: Process each query
    // For query [l, r], we increment diff[l] and decrement diff[r+1]
    // This marks that queries start at l and end at r
    for (int[] query : queries) {
        int l = query[0];
        int r = query[1];
        diff[l] += 1;
        // Only decrement if r+1 is within bounds
        if (r + 1 < n) {
            diff[r + 1] -= 1;
        }
    }

    // Step 3: Compute prefix sum to get coverage count for each index
    int coverage = 0;  // Running prefix sum
    for (int i = 0; i < n; i++) {
        coverage += diff[i];
        // Step 4: Check if coverage is sufficient for nums[i]
        // If coverage < nums[i] at any point, we can't make the array zero
        if (coverage < nums[i]) {
            return false;
        }
    }

    // Step 5: All indices have sufficient coverage
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + q)**

- Processing each query takes O(1) time for the diff array updates: O(q)
- Computing prefix sums and checking conditions takes O(n) time
- Total: O(n + q)

**Space Complexity: O(n)**

- We need the diff array of size n+1: O(n)
- We use a few integer variables: O(1)
- Total: O(n)

This is optimal because we need to at least look at each element of nums and each query once.

## Common Mistakes

1. **Forgetting the r+1 bound check**: When doing `diff[r+1] -= 1`, if `r+1 == n`, we're out of bounds since arrays are 0-indexed. Always check `if r+1 < n` before accessing `diff[r+1]`.

2. **Misunderstanding the problem requirements**: Some candidates think they must decrement ALL indices in the query range, but the problem says "select a subset." This flexibility is crucial to the solution.

3. **Using the wrong data structure**: Trying to simulate the process with a heap or priority queue leads to O(n log n) or worse solutions. The difference array approach is the key insight.

4. **Off-by-one errors in range handling**: Remember that queries use inclusive ranges `[l, r]`. When we say "coverage for index i," we mean queries where `l <= i <= r`.

## When You'll See This Pattern

The difference array/prefix sum technique for range updates appears in many problems:

1. **Range Addition (LeetCode 370)**: Exactly the same pattern—multiple range updates followed by querying final values.

2. **Corporate Flight Bookings (LeetCode 1109)**: Book seats on flights between ranges—identical pattern of range updates.

3. **Car Pooling (LeetCode 1094)**: Passengers get on and off at different stops—another variation of range updates.

The pattern to recognize: when you need to apply many range operations (add, subtract, count) and then query the final state, difference array with prefix sum is often the optimal O(n + q) solution.

## Key Takeaways

1. **Flexibility simplifies**: The ability to choose a subset within each query range means we only need to count how many queries cover each index, not which specific queries affect it.

2. **Difference array for range updates**: When you need to apply many "add 1 to range [l, r]" operations, use a difference array with `diff[l] += 1` and `diff[r+1] -= 1`, then compute prefix sums.

3. **Think about coverage, not simulation**: For problems with range operations, often counting coverage or net effect is sufficient—you don't need to simulate the exact sequence of operations.

Related problems: [Zero Array Transformation IV](/problem/zero-array-transformation-iv)
