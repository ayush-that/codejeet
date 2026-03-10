---
title: "How to Solve Minimum Operations to Make All Array Elements Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make All Array Elements Equal. Medium difficulty, 38.0% acceptance rate. Topics: Array, Binary Search, Sorting, Prefix Sum."
date: "2029-05-27"
category: "dsa-patterns"
tags:
  [
    "minimum-operations-to-make-all-array-elements-equal",
    "array",
    "binary-search",
    "sorting",
    "medium",
  ]
---

# How to Solve Minimum Operations to Make All Array Elements Equal

This problem asks us to calculate, for multiple target values, the minimum number of operations needed to make all elements in an array equal to that target. Each operation allows us to either increment or decrement an array element by 1. What makes this problem interesting is that we need to answer multiple queries efficiently, which forces us to think beyond recalculating from scratch for each query.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider `nums = [3, 1, 6, 8]` and `queries = [1, 5]`.

For the first query `target = 1`:

- Elements less than or equal to 1: `[1]` → these need to be increased to 1
  - `1` → already equal, 0 operations
- Elements greater than 1: `[3, 6, 8]` → these need to be decreased to 1
  - `3` → needs 2 operations (3-1)
  - `6` → needs 5 operations (6-1)
  - `8` → needs 7 operations (8-1)
- Total operations = 0 + (2+5+7) = 14

For the second query `target = 5`:

- Elements less than or equal to 5: `[3, 1]` → these need to be increased to 5
  - `3` → needs 2 operations (5-3)
  - `1` → needs 4 operations (5-1)
- Elements greater than 5: `[6, 8]` → these need to be decreased to 5
  - `6` → needs 1 operation (6-5)
  - `8` → needs 3 operations (8-5)
- Total operations = (2+4) + (1+3) = 10

Notice the pattern: For any target value, we need to:

1. Sum up how much we need to increase all elements ≤ target
2. Sum up how much we need to decrease all elements > target

The key insight is that if we sort the array, we can use prefix sums to calculate these sums in O(1) time after O(n log n) preprocessing.

## Brute Force Approach

The most straightforward approach is to calculate the operations for each query independently:

For each query target:

1. Initialize total operations to 0
2. For each element in nums:
   - Add the absolute difference between element and target to total
3. Store the result

This approach is simple but inefficient. For each of m queries, we iterate through all n elements, giving us O(m × n) time complexity. With n and m up to 10⁵, this could mean 10¹⁰ operations, which is far too slow.

<div class="code-group">

```python
# Brute Force Solution - Too Slow!
# Time: O(m × n) | Space: O(1) excluding output
def minOperationsBruteForce(nums, queries):
    result = []
    for target in queries:
        total = 0
        for num in nums:
            total += abs(num - target)
        result.append(total)
    return result
```

```javascript
// Brute Force Solution - Too Slow!
// Time: O(m × n) | Space: O(1) excluding output
function minOperationsBruteForce(nums, queries) {
  const result = [];
  for (const target of queries) {
    let total = 0;
    for (const num of nums) {
      total += Math.abs(num - target);
    }
    result.push(total);
  }
  return result;
}
```

```java
// Brute Force Solution - Too Slow!
// Time: O(m × n) | Space: O(1) excluding output
public List<Long> minOperationsBruteForce(int[] nums, int[] queries) {
    List<Long> result = new ArrayList<>();
    for (int target : queries) {
        long total = 0;
        for (int num : nums) {
            total += Math.abs(num - target);
        }
        result.add(total);
    }
    return result;
}
```

</div>

## Optimized Approach

The key insight is that we can preprocess the array to answer each query in O(log n) time. Here's the step-by-step reasoning:

1. **Sort the array**: This allows us to quickly find which elements are ≤ target and which are > target using binary search.

2. **Calculate prefix sums**: The prefix sum array lets us compute the sum of any contiguous subarray in O(1) time.

3. **For each query**:
   - Use binary search to find the index where elements transition from ≤ target to > target
   - Calculate the sum of elements ≤ target using prefix sums
   - Calculate the sum of elements > target using total sum minus prefix sum
   - Operations = (count of elements ≤ target × target) - (sum of elements ≤ target) + (sum of elements > target) - (count of elements > target × target)

The mathematical formula works because:

- For elements ≤ target: each needs (target - element) operations to increase
  - Sum of operations = (count × target) - (sum of those elements)
- For elements > target: each needs (element - target) operations to decrease
  - Sum of operations = (sum of those elements) - (count × target)

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Optimal Solution using Sorting, Prefix Sum, and Binary Search
# Time: O((n + m) log n) | Space: O(n)
def minOperations(nums, queries):
    n = len(nums)

    # Step 1: Sort the array to enable binary search
    nums.sort()

    # Step 2: Calculate prefix sums
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    result = []

    # Step 3: Process each query
    for target in queries:
        # Binary search to find the first index where nums[index] > target
        # This gives us the count of elements ≤ target
        left, right = 0, n
        while left < right:
            mid = (left + right) // 2
            if nums[mid] <= target:
                left = mid + 1
            else:
                right = mid

        # left is now the count of elements ≤ target
        count_smaller = left

        # Calculate sum of elements ≤ target
        sum_smaller = prefix[count_smaller]

        # Calculate sum of elements > target
        sum_larger = prefix[n] - sum_smaller

        # Calculate count of elements > target
        count_larger = n - count_smaller

        # Operations for elements ≤ target: each needs (target - element)
        # Total = (count_smaller * target) - sum_smaller
        ops_smaller = count_smaller * target - sum_smaller

        # Operations for elements > target: each needs (element - target)
        # Total = sum_larger - (count_larger * target)
        ops_larger = sum_larger - count_larger * target

        # Total operations
        total_ops = ops_smaller + ops_larger

        result.append(total_ops)

    return result
```

```javascript
// Optimal Solution using Sorting, Prefix Sum, and Binary Search
// Time: O((n + m) log n) | Space: O(n)
function minOperations(nums, queries) {
  const n = nums.length;

  // Step 1: Sort the array to enable binary search
  nums.sort((a, b) => a - b);

  // Step 2: Calculate prefix sums
  // prefix[i] = sum of first i elements (prefix[0] = 0)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  const result = [];

  // Step 3: Process each query
  for (const target of queries) {
    // Binary search to find the first index where nums[index] > target
    // This gives us the count of elements ≤ target
    let left = 0,
      right = n;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // left is now the count of elements ≤ target
    const countSmaller = left;

    // Calculate sum of elements ≤ target
    const sumSmaller = prefix[countSmaller];

    // Calculate sum of elements > target
    const sumLarger = prefix[n] - sumSmaller;

    // Calculate count of elements > target
    const countLarger = n - countSmaller;

    // Operations for elements ≤ target: each needs (target - element)
    // Total = (countSmaller * target) - sumSmaller
    const opsSmaller = countSmaller * target - sumSmaller;

    // Operations for elements > target: each needs (element - target)
    // Total = sumLarger - (countLarger * target)
    const opsLarger = sumLarger - countLarger * target;

    // Total operations
    const totalOps = opsSmaller + opsLarger;

    result.push(totalOps);
  }

  return result;
}
```

```java
// Optimal Solution using Sorting, Prefix Sum, and Binary Search
// Time: O((n + m) log n) | Space: O(n)
public List<Long> minOperations(int[] nums, int[] queries) {
    int n = nums.length;

    // Step 1: Sort the array to enable binary search
    int[] sortedNums = nums.clone();
    Arrays.sort(sortedNums);

    // Step 2: Calculate prefix sums
    // prefix[i] = sum of first i elements (prefix[0] = 0)
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + sortedNums[i];
    }

    List<Long> result = new ArrayList<>();

    // Step 3: Process each query
    for (int target : queries) {
        // Binary search to find the first index where nums[index] > target
        // This gives us the count of elements ≤ target
        int left = 0, right = n;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (sortedNums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // left is now the count of elements ≤ target
        int countSmaller = left;

        // Calculate sum of elements ≤ target
        long sumSmaller = prefix[countSmaller];

        // Calculate sum of elements > target
        long sumLarger = prefix[n] - sumSmaller;

        // Calculate count of elements > target
        int countLarger = n - countSmaller;

        // Operations for elements ≤ target: each needs (target - element)
        // Total = (countSmaller * target) - sumSmaller
        long opsSmaller = (long) countSmaller * target - sumSmaller;

        // Operations for elements > target: each needs (element - target)
        // Total = sumLarger - (countLarger * target)
        long opsLarger = sumLarger - (long) countLarger * target;

        // Total operations
        long totalOps = opsSmaller + opsLarger;

        result.add(totalOps);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O((n + m) log n)**

- Sorting the array: O(n log n)
- Building prefix sums: O(n)
- Processing m queries: O(m log n) for binary search on each query
- Total: O(n log n + n + m log n) = O((n + m) log n)

**Space Complexity: O(n)**

- Storing the sorted array: O(n) if we modify input, O(n) if we copy
- Prefix sum array: O(n)
- Output array: O(m) but typically not counted in auxiliary space

## Common Mistakes

1. **Forgetting to sort the array**: The binary search and prefix sum logic depend on the array being sorted. If you skip sorting, your binary search won't correctly partition elements.

2. **Off-by-one errors in binary search**: The binary search finds the first index where `nums[index] > target`. This index equals the count of elements ≤ target. A common mistake is using `<=` instead of `<` in the binary search condition or incorrectly handling the boundaries.

3. **Integer overflow**: When n and values are large (up to 10⁹), the sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/JavaScript, int is usually 64-bit in Python) for prefix sums and results.

4. **Incorrect formula for operations**: Remember that:
   - Elements ≤ target need `(target - element)` operations (increase)
   - Elements > target need `(element - target)` operations (decrease)
   - Mixing up these formulas will give wrong results.

## When You'll See This Pattern

This pattern of "sort + prefix sum + binary search" appears in many problems where you need to efficiently compute sums of differences or distances:

1. **Minimum Moves to Equal Array Elements II (LeetCode 462)**: Very similar but with a single target (the median). This problem is essentially the multi-query version.

2. **Minimum Cost to Make Array Equal (LeetCode 2448)**: Similar concept but with weighted operations. The same sorting + prefix sum approach works with adjustments for weights.

3. **Sum of Distances (LeetCode 2615)**: Another problem where you need to compute sums of absolute differences efficiently for multiple indices.

The core pattern is: when you need to compute sums of absolute differences between elements and a target, and you have multiple targets to test, sorting and prefix sums let you answer each query in logarithmic time.

## Key Takeaways

1. **Sorting enables efficient partitioning**: When you need to separate elements into "less than or equal" and "greater than" groups for multiple queries, sorting once allows O(log n) binary search for each query instead of O(n) linear scan.

2. **Prefix sums enable O(1) range sum queries**: Once sorted, prefix sums let you compute the sum of any contiguous segment in constant time, which is crucial for calculating the total operations efficiently.

3. **Mathematical decomposition simplifies the problem**: Breaking the total operations into "increase operations" and "decrease operations" with clear formulas makes the implementation straightforward and less error-prone.

Related problems: [Minimum Moves to Equal Array Elements II](/problem/minimum-moves-to-equal-array-elements-ii), [Minimum Cost to Make Array Equal](/problem/minimum-cost-to-make-array-equal), [Sum of Distances](/problem/sum-of-distances)
