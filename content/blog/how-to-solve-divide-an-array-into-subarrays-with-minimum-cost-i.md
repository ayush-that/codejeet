---
title: "How to Solve Divide an Array Into Subarrays With Minimum Cost I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Divide an Array Into Subarrays With Minimum Cost I. Easy difficulty, 80.5% acceptance rate. Topics: Array, Sorting, Enumeration."
date: "2026-03-26"
category: "dsa-patterns"
tags:
  ["divide-an-array-into-subarrays-with-minimum-cost-i", "array", "sorting", "enumeration", "easy"]
---

## Brief Problem Restatement

We need to split an array into **exactly three contiguous subarrays** (non-empty, covering the entire array) such that the sum of the **first elements** of each subarray is minimized. The challenge is that the first element of a subarray depends on where we make the cuts, and we must efficiently explore all valid split positions.

---

## Visual Walkthrough

Let’s walk through an example: `nums = [4, 3, 2, 5, 1, 8]`

We need **two cut positions** `i` and `j` such that:

- Subarray 1: `nums[0..i]` → first element = `nums[0]`
- Subarray 2: `nums[i+1..j]` → first element = `nums[i+1]`
- Subarray 3: `nums[j+1..n-1]` → first element = `nums[j+1]`

**Valid splits:**

- `i` can be from `0` to `n-3` (so subarray 2 and 3 have at least 1 element)
- `j` can be from `i+1` to `n-2` (so subarray 3 has at least 1 element)

For our example `n = 6`:

- `i` can be `0, 1, 2, 3`
- For each `i`, `j` ranges from `i+1` to `4`

Let’s compute costs for a few splits:

1. `i=0, j=1`:  
   Subarrays: `[4]`, `[3]`, `[2,5,1,8]`  
   Cost = `4 + 3 + 2 = 9`

2. `i=0, j=2`:  
   Subarrays: `[4]`, `[3,2]`, `[5,1,8]`  
   Cost = `4 + 3 + 5 = 12`

3. `i=1, j=2`:  
   Subarrays: `[4,3]`, `[2]`, `[5,1,8]`  
   Cost = `4 + 2 + 5 = 11`

4. `i=2, j=3`:  
   Subarrays: `[4,3,2]`, `[5]`, `[1,8]`  
   Cost = `4 + 5 + 1 = 10`

5. `i=2, j=4`:  
   Subarrays: `[4,3,2]`, `[5,1]`, `[8]`  
   Cost = `4 + 5 + 8 = 17`

We can see the minimum so far is **9** from split `i=0, j=1`.

**Key observation:**  
The cost formula is simply:  
`cost = nums[0] + nums[i+1] + nums[j+1]`  
Since `nums[0]` is fixed, we only need to minimize `nums[i+1] + nums[j+1]` over all valid `i, j`.

---

## Brute Force Approach

A naive solution would try all possible pairs `(i, j)` where:

- `0 ≤ i ≤ n-3`
- `i+1 ≤ j ≤ n-2`

For each pair, compute `nums[0] + nums[i+1] + nums[j+1]` and track the minimum.

**Why this is inefficient:**  
We have two nested loops:

- Outer loop: `i` from `0` to `n-3` → O(n)
- Inner loop: `j` from `i+1` to `n-2` → O(n) in worst case  
  Total: **O(n²)** time, which is too slow for large `n` (though constraints here are small, we can do better).

**Brute force code (for reference):**

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def minimumCost(nums):
    n = len(nums)
    min_cost = float('inf')
    # i is end index of first subarray
    for i in range(n - 2):
        # j is end index of second subarray
        for j in range(i + 1, n - 1):
            cost = nums[0] + nums[i + 1] + nums[j + 1]
            min_cost = min(min_cost, cost)
    return min_cost
```

```javascript
// Time: O(n²) | Space: O(1)
function minimumCost(nums) {
  const n = nums.length;
  let minCost = Infinity;
  // i is end index of first subarray
  for (let i = 0; i <= n - 3; i++) {
    // j is end index of second subarray
    for (let j = i + 1; j <= n - 2; j++) {
      const cost = nums[0] + nums[i + 1] + nums[j + 1];
      minCost = Math.min(minCost, cost);
    }
  }
  return minCost;
}
```

```java
// Time: O(n²) | Space: O(1)
public int minimumCost(int[] nums) {
    int n = nums.length;
    int minCost = Integer.MAX_VALUE;
    // i is end index of first subarray
    for (int i = 0; i <= n - 3; i++) {
        // j is end index of second subarray
        for (int j = i + 1; j <= n - 2; j++) {
            int cost = nums[0] + nums[i + 1] + nums[j + 1];
            minCost = Math.min(minCost, cost);
        }
    }
    return minCost;
}
```

</div>

---

## Optimal Solution

We can optimize by noticing that `nums[0]` is fixed, so we minimize `nums[i+1] + nums[j+1]`.  
For a given `i`, the best `j` is the index after `i` that has the **minimum value** in the range `[i+2, n-1]` (since `j ≥ i+1`, so `j+1 ≥ i+2`).

Thus, we can:

1. Precompute `min_after[k]` = minimum value in `nums[k..n-1]` for each `k`.
2. For each possible `i`, compute `nums[i+1] + min_after[i+2]` (the smallest possible second term).
3. Take the minimum over all `i`.

**Why this works:**

- `min_after[i+2]` gives the smallest possible `nums[j+1]` for `j ≥ i+1`.
- We check all `i` from `0` to `n-3` to cover all splits.

**Time complexity:** O(n) for precomputation + O(n) for iteration = **O(n)**.  
**Space complexity:** O(n) for the `min_after` array (can be optimized to O(1) with careful iteration).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumCost(nums):
    n = len(nums)
    # Step 1: Precompute min_after[k] = minimum in nums[k..n-1]
    min_after = [0] * n
    min_after[n - 1] = nums[n - 1]
    # Traverse backwards to build min_after
    for i in range(n - 2, -1, -1):
        min_after[i] = min(nums[i], min_after[i + 1])

    # Step 2: Try all possible i (end index of first subarray)
    min_cost = float('inf')
    # i can be from 0 to n-3 (so i+1 ≤ n-2)
    for i in range(n - 2):
        # Cost = nums[0] + nums[i+1] + min_after[i+2]
        # min_after[i+2] is the smallest nums[j+1] for j ≥ i+1
        cost = nums[0] + nums[i + 1] + min_after[i + 2]
        min_cost = min(min_cost, cost)

    return min_cost
```

```javascript
// Time: O(n) | Space: O(n)
function minimumCost(nums) {
  const n = nums.length;
  // Step 1: Precompute minAfter[k] = minimum in nums[k..n-1]
  const minAfter = new Array(n);
  minAfter[n - 1] = nums[n - 1];
  // Build minAfter from right to left
  for (let i = n - 2; i >= 0; i--) {
    minAfter[i] = Math.min(nums[i], minAfter[i + 1]);
  }

  // Step 2: Try all possible i (end index of first subarray)
  let minCost = Infinity;
  // i from 0 to n-3
  for (let i = 0; i <= n - 3; i++) {
    // Cost = nums[0] + nums[i+1] + minAfter[i+2]
    const cost = nums[0] + nums[i + 1] + minAfter[i + 2];
    minCost = Math.min(minCost, cost);
  }

  return minCost;
}
```

```java
// Time: O(n) | Space: O(n)
public int minimumCost(int[] nums) {
    int n = nums.length;
    // Step 1: Precompute minAfter[k] = minimum in nums[k..n-1]
    int[] minAfter = new int[n];
    minAfter[n - 1] = nums[n - 1];
    // Build minAfter from right to left
    for (int i = n - 2; i >= 0; i--) {
        minAfter[i] = Math.min(nums[i], minAfter[i + 1]);
    }

    // Step 2: Try all possible i (end index of first subarray)
    int minCost = Integer.MAX_VALUE;
    // i from 0 to n-3
    for (int i = 0; i <= n - 3; i++) {
        // Cost = nums[0] + nums[i+1] + minAfter[i+2]
        int cost = nums[0] + nums[i + 1] + minAfter[i + 2];
        minCost = Math.min(minCost, cost);
    }

    return minCost;
}
```

</div>

---

## Complexity Analysis

- **Time complexity:** **O(n)**  
  We make two passes over the array:
  1. Backward pass to compute `min_after` (O(n))
  2. Forward pass to try all `i` (O(n))

- **Space complexity:** **O(n)**  
  We store the `min_after` array of length `n`.  
  _Optimization note:_ We can reduce space to O(1) by iterating `i` backwards and keeping track of the minimum seen so far, but the O(n) approach is clearer for interviews.

---

## Common Mistakes

1. **Incorrect index ranges for `i` and `j`**
   - Mistake: Allowing `i` up to `n-2`, which leaves no room for third subarray.
   - Fix: Remember `i ≤ n-3`, `j ≤ n-2`, and `j ≥ i+1`.

2. **Forgetting `nums[0]` is fixed**
   - Mistake: Trying to minimize all three terms independently.
   - Fix: Realize `nums[0]` is always included, so focus on minimizing the other two.

3. **Off-by-one in `min_after` lookup**
   - Mistake: Using `min_after[i+1]` instead of `min_after[i+2]`.
   - Fix: `j+1` starts at `i+2` because `j ≥ i+1`.

4. **Not handling small `n`**
   - Mistake: Assuming `n ≥ 3` without checking.
   - Fix: The problem guarantees `n ≥ 3`, but it’s good to mention this assumption.

---

## When You’ll See This Pattern

This problem uses **precomputation of suffix minimums** to optimize a search that would otherwise be O(n²). Similar patterns appear in:

1. **LeetCode 42: Trapping Rain Water**  
   Uses prefix/suffix maximums to compute water trapped at each index.

2. **LeetCode 135: Candy**  
   Uses left-to-right and right-to-left passes to determine candy allocations.

3. **LeetCode 238: Product of Array Except Self**  
   Uses prefix and suffix products to compute results in O(n) time.

The core idea: **When you need to repeatedly query aggregate information (min, max, sum, product) over subarrays, precompute prefix/suffix arrays to answer each query in O(1) time.**

---

## Key Takeaways

- **Break down the cost formula** to see which parts are fixed vs. variable. Here, `nums[0]` is fixed, so we only optimize the other two terms.
- **Precomputation is powerful** for turning O(n²) searches into O(n). If you find yourself nesting loops over the same array, think about what you can precompute.
- **Suffix minimums/prefix minimums** are a standard technique for problems where you need the “best future value” for each position.

---

[Practice this problem on CodeJeet](/problem/divide-an-array-into-subarrays-with-minimum-cost-i)
