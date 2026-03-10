---
title: "How to Solve Range Sum Query - Immutable — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Range Sum Query - Immutable. Easy difficulty, 71.4% acceptance rate. Topics: Array, Design, Prefix Sum."
date: "2026-11-14"
category: "dsa-patterns"
tags: ["range-sum-query-immutable", "array", "design", "prefix-sum", "easy"]
---

# How to Solve Range Sum Query - Immutable

This problem asks us to design a class that can efficiently answer multiple range sum queries on a static array. The challenge is that while computing a single sum is trivial, doing it repeatedly for many queries using the naive approach becomes inefficient. This problem introduces the fundamental **prefix sum** technique, which is crucial for optimizing range queries in countless algorithmic problems.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [2, 7, 11, 15, 1, 3]` and we need to answer these queries:

1. `sumRange(0, 2)` → sum of indices 0 through 2
2. `sumRange(2, 5)` → sum of indices 2 through 5
3. `sumRange(0, 5)` → sum of all elements

**Naive approach:** For each query, we iterate from `left` to `right` and sum the elements:

- Query 1: `2 + 7 + 11 = 20`
- Query 2: `11 + 15 + 1 + 3 = 30`
- Query 3: `2 + 7 + 11 + 15 + 1 + 3 = 39`

This works, but if we have `Q` queries and each range could be up to `n` elements, we're doing `O(Q × n)` operations.

**Prefix sum insight:** What if we precompute cumulative sums? Let's create a `prefix` array where `prefix[i]` = sum of first `i` elements (elements 0 through i-1):

- `prefix[0] = 0` (sum of first 0 elements)
- `prefix[1] = nums[0] = 2`
- `prefix[2] = nums[0] + nums[1] = 2 + 7 = 9`
- `prefix[3] = 9 + 11 = 20`
- `prefix[4] = 20 + 15 = 35`
- `prefix[5] = 35 + 1 = 36`
- `prefix[6] = 36 + 3 = 39`

Now to compute `sumRange(left, right)`:

- We want sum from `left` to `right` inclusive
- That's `(sum of first right+1 elements) - (sum of first left elements)`
- Which equals `prefix[right+1] - prefix[left]`

Let's verify:

- Query 1: `sumRange(0, 2)` = `prefix[3] - prefix[0]` = `20 - 0 = 20` ✓
- Query 2: `sumRange(2, 5)` = `prefix[6] - prefix[2]` = `39 - 9 = 30` ✓
- Query 3: `sumRange(0, 5)` = `prefix[6] - prefix[0]` = `39 - 0 = 39` ✓

Each query now takes O(1) time after O(n) preprocessing!

## Brute Force Approach

The brute force solution simply stores the array and computes each query by iterating from `left` to `right`:

<div class="code-group">

```python
class NumArray:
    def __init__(self, nums: List[int]):
        # Simply store the array
        self.nums = nums

    def sumRange(self, left: int, right: int) -> int:
        # Iterate through the range and sum elements
        total = 0
        for i in range(left, right + 1):
            total += self.nums[i]
        return total
```

```javascript
class NumArray {
  constructor(nums) {
    // Simply store the array
    this.nums = nums;
  }

  sumRange(left, right) {
    // Iterate through the range and sum elements
    let total = 0;
    for (let i = left; i <= right; i++) {
      total += this.nums[i];
    }
    return total;
  }
}
```

```java
class NumArray {
    private int[] nums;

    public NumArray(int[] nums) {
        // Simply store the array
        this.nums = nums;
    }

    public int sumRange(int left, int right) {
        // Iterate through the range and sum elements
        int total = 0;
        for (int i = left; i <= right; i++) {
            total += nums[i];
        }
        return total;
    }
}
```

</div>

**Why this is insufficient:**

- **Time Complexity:** Each query takes O(k) time where k = right - left + 1. For Q queries, this becomes O(Q × n) in the worst case.
- **Problem Constraints:** The problem states we'll handle "multiple queries," which implies we need an efficient solution. In interviews, if a problem mentions handling multiple queries on static data, prefix sums should immediately come to mind.

## Optimal Solution

The optimal solution uses the prefix sum technique. We precompute cumulative sums once during initialization, then answer each query in constant time.

<div class="code-group">

```python
class NumArray:
    def __init__(self, nums: List[int]):
        """
        Initialize the prefix sum array.
        prefix[i] will store the sum of elements from index 0 to i-1.
        This makes prefix[0] = 0 (sum of first 0 elements).
        """
        n = len(nums)
        # Create prefix array with n+1 elements to handle edge cases
        self.prefix = [0] * (n + 1)

        # Build prefix sum array
        # prefix[i+1] = sum of first i+1 elements = prefix[i] + nums[i]
        for i in range(n):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def sumRange(self, left: int, right: int) -> int:
        """
        Compute sum from left to right inclusive using prefix sums.
        Sum(left, right) = sum of first (right+1) elements - sum of first left elements
        = prefix[right+1] - prefix[left]
        """
        # prefix[right+1] gives sum from index 0 to right
        # prefix[left] gives sum from index 0 to left-1
        # Their difference gives sum from left to right
        return self.prefix[right + 1] - self.prefix[left]
```

```javascript
class NumArray {
  constructor(nums) {
    /**
     * Initialize the prefix sum array.
     * prefix[i] will store the sum of elements from index 0 to i-1.
     * This makes prefix[0] = 0 (sum of first 0 elements).
     */
    const n = nums.length;
    // Create prefix array with n+1 elements to handle edge cases
    this.prefix = new Array(n + 1).fill(0);

    // Build prefix sum array
    // prefix[i+1] = sum of first i+1 elements = prefix[i] + nums[i]
    for (let i = 0; i < n; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  sumRange(left, right) {
    /**
     * Compute sum from left to right inclusive using prefix sums.
     * Sum(left, right) = sum of first (right+1) elements - sum of first left elements
     * = prefix[right+1] - prefix[left]
     */
    // prefix[right+1] gives sum from index 0 to right
    // prefix[left] gives sum from index 0 to left-1
    // Their difference gives sum from left to right
    return this.prefix[right + 1] - this.prefix[left];
  }
}
```

```java
class NumArray {
    private int[] prefix;

    public NumArray(int[] nums) {
        /**
         * Initialize the prefix sum array.
         * prefix[i] will store the sum of elements from index 0 to i-1.
         * This makes prefix[0] = 0 (sum of first 0 elements).
         */
        int n = nums.length;
        // Create prefix array with n+1 elements to handle edge cases
        prefix = new int[n + 1];

        // Build prefix sum array
        // prefix[i+1] = sum of first i+1 elements = prefix[i] + nums[i]
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public int sumRange(int left, int right) {
        /**
         * Compute sum from left to right inclusive using prefix sums.
         * Sum(left, right) = sum of first (right+1) elements - sum of first left elements
         * = prefix[right+1] - prefix[left]
         */
        // prefix[right+1] gives sum from index 0 to right
        // prefix[left] gives sum from index 0 to left-1
        // Their difference gives sum from left to right
        return prefix[right + 1] - prefix[left];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization (constructor):** O(n) where n is the length of the input array. We iterate through the array once to build the prefix sum array.
- **Query (sumRange):** O(1) per query. We simply perform two array lookups and one subtraction.

**Space Complexity:** O(n) for storing the prefix sum array. We need n+1 integers to store all prefix sums.

**Why this matters:** If we have Q queries, the brute force would take O(Q × n) time, while the prefix sum approach takes O(n + Q) time. For large Q, this is a massive improvement.

## Common Mistakes

1. **Off-by-one errors in prefix array indexing:** The most common mistake is making the prefix array the same size as nums instead of n+1. Remember: `prefix[i]` = sum of first i elements, so `prefix[0]` must exist (sum of first 0 elements = 0). If you use an n-sized array, you'll need special handling for `left = 0`.

2. **Forgetting to handle empty array:** Always check if nums could be empty. Our solution handles this correctly because if n=0, we create a prefix array of size 1 containing just 0, and no queries can be made (since there are no valid indices).

3. **Confusing inclusive vs exclusive ranges:** The problem specifies "between indices left and right inclusive." Some candidates mistakenly use `right` instead of `right+1` in the formula. Remember: to get sum from 0 to right inclusive, we need `prefix[right+1]`.

4. **Modifying the original array after initialization:** The problem states the array is "immutable," meaning it won't change after initialization. If the array could change, we'd need a different data structure like a Fenwick Tree (Binary Indexed Tree).

## When You'll See This Pattern

The prefix sum pattern appears whenever you need to:

1. Answer multiple range sum queries on static data
2. Find subarrays with a specific sum
3. Convert range updates to point updates (difference array technique)

**Related LeetCode problems:**

1. **Range Sum Query 2D - Immutable (LeetCode 304):** The 2D version where you need to compute sums of rectangular submatrices. The solution extends the prefix sum concept to two dimensions.

2. **Maximum Size Subarray Sum Equals k (LeetCode 325):** Uses prefix sums with a hash map to find the longest subarray summing to k. The insight: if `prefix[j] - prefix[i] = k`, then the subarray from i to j-1 sums to k.

3. **Subarray Sum Equals K (LeetCode 560):** Counts the number of subarrays summing to k. Again uses prefix sums with a hash map to track how many times each prefix sum has occurred.

4. **Product of Array Except Self (LeetCode 238):** While not about sums, it uses a similar cumulative computation approach, building prefix and suffix products.

## Key Takeaways

1. **Prefix sums transform O(n) range queries into O(1) lookups** by precomputing cumulative sums. This is a classic space-time tradeoff: we use O(n) extra space to achieve O(1) query time.

2. **The formula `sum(left, right) = prefix[right+1] - prefix[left]`** is fundamental. The +1 in `right+1` is crucial because `prefix[i]` represents the sum of elements before index i (exclusive), not including i.

3. **When you see "multiple queries on static data," think prefix sums.** This pattern is so common that it should be in your mental toolkit alongside hash maps and two pointers.

4. **Always test edge cases:** empty array, single element, full range (0 to n-1), and adjacent indices. These often reveal off-by-one errors.

Remember: The prefix sum technique is not just for sums—it can be adapted for any associative operation where you want to answer range queries quickly on immutable data.

Related problems: [Range Sum Query 2D - Immutable](/problem/range-sum-query-2d-immutable), [Range Sum Query - Mutable](/problem/range-sum-query-mutable), [Maximum Size Subarray Sum Equals k](/problem/maximum-size-subarray-sum-equals-k)
