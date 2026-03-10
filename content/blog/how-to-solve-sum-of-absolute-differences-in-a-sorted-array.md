---
title: "How to Solve Sum of Absolute Differences in a Sorted Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Absolute Differences in a Sorted Array. Medium difficulty, 68.2% acceptance rate. Topics: Array, Math, Prefix Sum."
date: "2026-12-14"
category: "dsa-patterns"
tags: ["sum-of-absolute-differences-in-a-sorted-array", "array", "math", "prefix-sum", "medium"]
---

# How to Solve Sum of Absolute Differences in a Sorted Array

This problem asks us to compute, for each element in a sorted array, the sum of its absolute differences with every other element. While the brute force approach is straightforward, the sorted nature of the array allows for a clever mathematical optimization using prefix sums. The tricky part is recognizing how to break down the absolute difference calculation into two separate sums: differences with elements to the left and differences with elements to the right.

## Visual Walkthrough

Let's walk through the example `nums = [2, 3, 5]` step by step:

**For nums[0] = 2:**

- Differences with left elements: None (no elements to the left)
- Differences with right elements: |2-3| + |2-5| = 1 + 3 = 4
- Total: 0 + 4 = 4

**For nums[1] = 3:**

- Differences with left elements: |3-2| = 1
- Differences with right elements: |3-5| = 2
- Total: 1 + 2 = 3

**For nums[2] = 5:**

- Differences with left elements: |5-2| + |5-3| = 3 + 2 = 5
- Differences with right elements: None (no elements to the right)
- Total: 5 + 0 = 5

So `result = [4, 3, 5]`.

Now let's see the pattern. For any element at index `i`:

- All elements to the left are smaller or equal (since array is sorted)
- All elements to the right are larger or equal

This means:

- For left elements: `nums[i] - nums[j]` where `j < i`
- For right elements: `nums[k] - nums[i]` where `k > i`

We can compute these sums efficiently using prefix sums!

## Brute Force Approach

The most straightforward solution is to compute the result for each element by iterating through all other elements and summing their absolute differences:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output
def getSumAbsoluteDifferences(nums):
    n = len(nums)
    result = [0] * n

    for i in range(n):
        total = 0
        for j in range(n):
            total += abs(nums[i] - nums[j])
        result[i] = total

    return result
```

```javascript
// Time: O(n²) | Space: O(1) excluding output
function getSumAbsoluteDifferences(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let total = 0;
    for (let j = 0; j < n; j++) {
      total += Math.abs(nums[i] - nums[j]);
    }
    result[i] = total;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output
public int[] getSumAbsoluteDifferences(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        int total = 0;
        for (int j = 0; j < n; j++) {
            total += Math.abs(nums[i] - nums[j]);
        }
        result[i] = total;
    }

    return result;
}
```

</div>

**Why this is insufficient:** With constraints up to 10^5 elements, O(n²) time complexity is far too slow (potentially 10^10 operations). We need an O(n) solution.

## Optimized Approach

The key insight comes from two observations:

1. The array is sorted in non-decreasing order
2. Absolute differences can be separated based on whether the other element is smaller or larger

For element at index `i`:

- **Left sum**: `nums[i] * i - sum_of_left_elements`
  - Since all left elements are ≤ `nums[i]`, each difference is `nums[i] - nums[j]`
  - Summing all these: `i * nums[i] - (nums[0] + nums[1] + ... + nums[i-1])`
- **Right sum**: `sum_of_right_elements - nums[i] * (n-i-1)`
  - Since all right elements are ≥ `nums[i]`, each difference is `nums[k] - nums[i]`
  - Summing all these: `(nums[i+1] + ... + nums[n-1]) - (n-i-1) * nums[i]`

We can precompute prefix sums to get the sum of any subarray in O(1) time. Then for each element, we compute:

```
result[i] = (nums[i] * i - prefix[i]) + ((prefix[n] - prefix[i+1]) - nums[i] * (n-i-1))
```

Where `prefix[i]` is the sum of first `i` elements (prefix[0] = 0).

## Optimal Solution

Here's the complete implementation using prefix sums:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def getSumAbsoluteDifferences(nums):
    n = len(nums)

    # Step 1: Compute prefix sums
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    result = [0] * n

    # Step 2: Compute result for each element
    for i in range(n):
        # Left part: nums[i] appears i times, minus sum of left elements
        left_sum = nums[i] * i - prefix[i]

        # Right part: sum of right elements minus nums[i] appears (n-i-1) times
        right_sum = (prefix[n] - prefix[i + 1]) - nums[i] * (n - i - 1)

        # Total is sum of left and right parts
        result[i] = left_sum + right_sum

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function getSumAbsoluteDifferences(nums) {
  const n = nums.length;

  // Step 1: Compute prefix sums
  // prefix[i] = sum of first i elements (prefix[0] = 0)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  const result = new Array(n).fill(0);

  // Step 2: Compute result for each element
  for (let i = 0; i < n; i++) {
    // Left part: nums[i] appears i times, minus sum of left elements
    const leftSum = nums[i] * i - prefix[i];

    // Right part: sum of right elements minus nums[i] appears (n-i-1) times
    const rightSum = prefix[n] - prefix[i + 1] - nums[i] * (n - i - 1);

    // Total is sum of left and right parts
    result[i] = leftSum + rightSum;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] getSumAbsoluteDifferences(int[] nums) {
    int n = nums.length;

    // Step 1: Compute prefix sums
    // prefix[i] = sum of first i elements (prefix[0] = 0)
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    int[] result = new int[n];

    // Step 2: Compute result for each element
    for (int i = 0; i < n; i++) {
        // Left part: nums[i] appears i times, minus sum of left elements
        int leftSum = nums[i] * i - prefix[i];

        // Right part: sum of right elements minus nums[i] appears (n-i-1) times
        int rightSum = (prefix[n] - prefix[i + 1]) - nums[i] * (n - i - 1);

        // Total is sum of left and right parts
        result[i] = leftSum + rightSum;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the array: one to compute prefix sums (O(n)), and another to compute results (O(n))
- Each element's result is computed in O(1) time using the prefix sums

**Space Complexity:** O(n)

- We need O(n) space for the prefix sums array
- The output array is not counted toward space complexity in most interview settings, but if it is, total space would be O(n) for prefix + O(n) for output = O(n)

## Common Mistakes

1. **Forgetting the array is sorted:** The optimized approach relies on the sorted property to separate left and right sums. If you try to apply this to an unsorted array, it won't work.

2. **Off-by-one errors with prefix sums:** The most common mistake is incorrect indexing when accessing prefix sums. Remember:
   - `prefix[i]` = sum of elements `nums[0]` to `nums[i-1]`
   - `prefix[i+1]` = sum of elements `nums[0]` to `nums[i]`
   - `prefix[n]` = sum of all elements

3. **Integer overflow:** With large arrays and large values, the intermediate calculations (like `nums[i] * i`) can overflow. In Python this isn't an issue, but in Java/C++ you might need to use long integers.

4. **Not handling edge cases:**
   - Single element array: Should return `[0]`
   - Two element array: For `[a, b]`, should return `[|a-b|, |b-a|]`
   - All elements equal: Should return `[0, 0, ..., 0]`

## When You'll See This Pattern

This problem combines two important patterns:

1. **Prefix Sums:** Used to compute range sums efficiently. Similar problems:
   - **Range Sum Query - Immutable (LeetCode 303):** Direct prefix sum application
   - **Product of Array Except Self (LeetCode 238):** Uses prefix and suffix products
   - **Maximum Subarray (LeetCode 53):** Can be solved with prefix sums (Kadane's algorithm is better)

2. **Exploiting Sorted Property:** Many array problems become easier when the array is sorted:
   - **Two Sum II (LeetCode 167):** Uses two pointers on sorted array
   - **3Sum (LeetCode 15):** Sorts first to avoid duplicates and use two pointers

## Key Takeaways

1. **When you see "sum of absolute differences" with a sorted array**, think about separating the calculation into left and right parts. The sorted property guarantees all left elements are ≤ current element and all right elements are ≥ current element.

2. **Prefix sums are your friend** when you need to compute many range sums. If you're calculating sums of subarrays repeatedly, precomputing prefix sums can reduce O(n) queries to O(1).

3. **Always check if the problem's constraints** allow for your solution. The brute force O(n²) might work for small inputs but will fail for large ones. Recognizing when to optimize is a key interview skill.

[Practice this problem on CodeJeet](/problem/sum-of-absolute-differences-in-a-sorted-array)
