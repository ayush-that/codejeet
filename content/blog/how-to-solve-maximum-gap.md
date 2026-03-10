---
title: "How to Solve Maximum Gap — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Gap. Medium difficulty, 51.4% acceptance rate. Topics: Array, Sorting, Bucket Sort, Radix Sort."
date: "2027-11-10"
category: "dsa-patterns"
tags: ["maximum-gap", "array", "sorting", "bucket-sort", "medium"]
---

# How to Solve Maximum Gap

This problem asks us to find the largest difference between any two consecutive numbers when the array is sorted. The challenge is that we must do this in **O(n)** time and **O(n)** space, which means we cannot use standard comparison-based sorting (which would be O(n log n)). This constraint forces us to think beyond conventional sorting algorithms and consider distribution-based approaches like bucket sort or radix sort.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 6, 9, 1]`.

**Step 1: Understanding the goal**
If we sort the array: `[1, 3, 6, 9]`
The consecutive differences are:

- Between 1 and 3: difference = 2
- Between 3 and 6: difference = 3
- Between 6 and 9: difference = 3

The maximum gap is 3.

**Step 2: Why can't we just sort?**
If we use standard sorting (like quicksort or mergesort), we get O(n log n) time. The problem explicitly requires linear time, so we need a different approach.

**Step 3: The bucket sort insight**
The key observation is that for `n` numbers with minimum value `min_val` and maximum value `max_val`, the **maximum possible gap** is at least `(max_val - min_val) / (n - 1)`. Why? Because if we distribute `n` numbers evenly across the range, that would be the spacing.

Let's apply this to our example:

- `min_val = 1`, `max_val = 9`, `n = 4`
- Minimum possible maximum gap = `(9 - 1) / (4 - 1) = 8 / 3 ≈ 2.67`

This tells us that the maximum gap will be at least 3 (since it must be an integer ≥ 2.67).

**Step 4: Bucket distribution**
We can create `n-1` buckets (3 buckets in our case), each with width = `(max_val - min_val) / (n - 1) = 8/3 ≈ 2.67`.

Bucket ranges would be:

- Bucket 0: [1, 3.67)
- Bucket 1: [3.67, 6.34)
- Bucket 2: [6.34, 9]

Now distribute the numbers:

- 1 → Bucket 0
- 3 → Bucket 0
- 6 → Bucket 1
- 9 → Bucket 2

**Step 5: Finding the maximum gap**
The maximum gap cannot occur within a bucket — it must occur between buckets. We only need to track the minimum and maximum value in each bucket, then check gaps between consecutive non-empty buckets.

In our case:

- Bucket 0: min=1, max=3
- Bucket 1: min=6, max=6
- Bucket 2: min=9, max=9

Gaps between buckets:

- Between Bucket 0 and Bucket 1: 6 - 3 = 3
- Between Bucket 1 and Bucket 2: 9 - 6 = 3

Maximum gap = 3.

## Brute Force Approach

The most straightforward approach is to sort the array and then scan through it to find the maximum difference between consecutive elements.

**Why this doesn't work:**
Standard comparison-based sorting algorithms (quicksort, mergesort, heapsort) have O(n log n) time complexity. The problem explicitly requires an O(n) time solution, so this approach fails the time complexity requirement.

However, let's see what it would look like:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def maximumGap_brute(nums):
    if len(nums) < 2:
        return 0

    # Sort the array - this is O(n log n)
    nums.sort()

    # Find maximum difference between consecutive elements
    max_gap = 0
    for i in range(1, len(nums)):
        max_gap = max(max_gap, nums[i] - nums[i-1])

    return max_gap
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function maximumGapBrute(nums) {
  if (nums.length < 2) return 0;

  // Sort the array - this is O(n log n)
  nums.sort((a, b) => a - b);

  // Find maximum difference between consecutive elements
  let maxGap = 0;
  for (let i = 1; i < nums.length; i++) {
    maxGap = Math.max(maxGap, nums[i] - nums[i - 1]);
  }

  return maxGap;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public int maximumGapBrute(int[] nums) {
    if (nums.length < 2) return 0;

    // Sort the array - this is O(n log n)
    Arrays.sort(nums);

    // Find maximum difference between consecutive elements
    int maxGap = 0;
    for (int i = 1; i < nums.length; i++) {
        maxGap = Math.max(maxGap, nums[i] - nums[i-1]);
    }

    return maxGap;
}
```

</div>

While this solution is correct in terms of output, it violates the linear time requirement specified in the problem statement.

## Optimized Approach

The key insight comes from the **Pigeonhole Principle**. For `n` numbers, if we want to find the maximum gap between consecutive numbers in sorted order, we can use buckets to distribute the numbers such that:

1. **Bucket size calculation**: The minimum possible maximum gap is `(max_val - min_val) / (n - 1)`. This is the theoretical lower bound.
2. **Bucket creation**: We create `n-1` buckets (or `n` buckets, both work), each with width equal to this minimum possible gap.
3. **Number distribution**: We put each number into its appropriate bucket based on its value.
4. **Gap calculation**: The maximum gap cannot occur within a bucket (by design of bucket width), so it must occur between buckets. We only need to track the minimum and maximum value in each bucket, then check the gaps between consecutive non-empty buckets.

**Why this works in O(n) time:**

- Finding min and max: O(n)
- Distributing numbers into buckets: O(n)
- Checking gaps between buckets: O(n)

All operations are linear, giving us O(n) total time complexity.

**Step-by-step reasoning:**

1. Handle edge cases (array with fewer than 2 elements).
2. Find the minimum and maximum values in the array.
3. If all elements are the same (min == max), the maximum gap is 0.
4. Calculate bucket size: `(max_val - min_val) / (n - 1)`. Use floating point, then convert to integer bucket index.
5. Create buckets to store min and max values for each bucket.
6. Distribute numbers into buckets.
7. Scan through buckets to find the maximum gap between consecutive non-empty buckets.

## Optimal Solution

Here's the complete bucket sort solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumGap(nums):
    # Edge case: if fewer than 2 elements, gap is 0
    if len(nums) < 2:
        return 0

    n = len(nums)

    # Step 1: Find min and max values in the array
    min_val, max_val = min(nums), max(nums)

    # If all elements are the same, maximum gap is 0
    if min_val == max_val:
        return 0

    # Step 2: Calculate bucket size and number of buckets
    # The minimum possible maximum gap is (max_val - min_val) / (n - 1)
    # We'll create n-1 buckets of this size
    bucket_size = max(1, (max_val - min_val) // (n - 1))
    bucket_count = (max_val - min_val) // bucket_size + 1

    # Step 3: Initialize buckets
    # Each bucket stores [min_value_in_bucket, max_value_in_bucket]
    # We use None to indicate empty buckets
    buckets_min = [float('inf')] * bucket_count
    buckets_max = [float('-inf')] * bucket_count

    # Step 4: Distribute numbers into buckets
    for num in nums:
        # Calculate which bucket this number belongs to
        bucket_idx = (num - min_val) // bucket_size

        # Update bucket min and max
        buckets_min[bucket_idx] = min(buckets_min[bucket_idx], num)
        buckets_max[bucket_idx] = max(buckets_max[bucket_idx], num)

    # Step 5: Find maximum gap by comparing consecutive non-empty buckets
    max_gap = 0
    prev_max = min_val  # The first bucket starts at min_val

    for i in range(bucket_count):
        # Skip empty buckets
        if buckets_min[i] == float('inf'):
            continue

        # Gap is current bucket's min minus previous bucket's max
        max_gap = max(max_gap, buckets_min[i] - prev_max)

        # Update previous max to current bucket's max
        prev_max = buckets_max[i]

    return max_gap
```

```javascript
// Time: O(n) | Space: O(n)
function maximumGap(nums) {
  // Edge case: if fewer than 2 elements, gap is 0
  if (nums.length < 2) return 0;

  const n = nums.length;

  // Step 1: Find min and max values in the array
  let minVal = Math.min(...nums);
  let maxVal = Math.max(...nums);

  // If all elements are the same, maximum gap is 0
  if (minVal === maxVal) return 0;

  // Step 2: Calculate bucket size and number of buckets
  // The minimum possible maximum gap is (maxVal - minVal) / (n - 1)
  // We'll create n-1 buckets of this size
  const bucketSize = Math.max(1, Math.floor((maxVal - minVal) / (n - 1)));
  const bucketCount = Math.floor((maxVal - minVal) / bucketSize) + 1;

  // Step 3: Initialize buckets
  // Each bucket stores [min_value_in_bucket, max_value_in_bucket]
  // We use Infinity and -Infinity to indicate uninitialized buckets
  const bucketsMin = new Array(bucketCount).fill(Infinity);
  const bucketsMax = new Array(bucketCount).fill(-Infinity);

  // Step 4: Distribute numbers into buckets
  for (const num of nums) {
    // Calculate which bucket this number belongs to
    const bucketIdx = Math.floor((num - minVal) / bucketSize);

    // Update bucket min and max
    bucketsMin[bucketIdx] = Math.min(bucketsMin[bucketIdx], num);
    bucketsMax[bucketIdx] = Math.max(bucketsMax[bucketIdx], num);
  }

  // Step 5: Find maximum gap by comparing consecutive non-empty buckets
  let maxGap = 0;
  let prevMax = minVal; // The first bucket starts at minVal

  for (let i = 0; i < bucketCount; i++) {
    // Skip empty buckets
    if (bucketsMin[i] === Infinity) continue;

    // Gap is current bucket's min minus previous bucket's max
    maxGap = Math.max(maxGap, bucketsMin[i] - prevMax);

    // Update previous max to current bucket's max
    prevMax = bucketsMax[i];
  }

  return maxGap;
}
```

```java
// Time: O(n) | Space: O(n)
public int maximumGap(int[] nums) {
    // Edge case: if fewer than 2 elements, gap is 0
    if (nums.length < 2) return 0;

    int n = nums.length;

    // Step 1: Find min and max values in the array
    int minVal = Integer.MAX_VALUE;
    int maxVal = Integer.MIN_VALUE;
    for (int num : nums) {
        minVal = Math.min(minVal, num);
        maxVal = Math.max(maxVal, num);
    }

    // If all elements are the same, maximum gap is 0
    if (minVal == maxVal) return 0;

    // Step 2: Calculate bucket size and number of buckets
    // The minimum possible maximum gap is (maxVal - minVal) / (n - 1)
    // We'll create n-1 buckets of this size
    int bucketSize = Math.max(1, (maxVal - minVal) / (n - 1));
    int bucketCount = (maxVal - minVal) / bucketSize + 1;

    // Step 3: Initialize buckets
    // Each bucket stores [min_value_in_bucket, max_value_in_bucket]
    // We use Integer.MAX_VALUE and Integer.MIN_VALUE to indicate uninitialized buckets
    int[] bucketsMin = new int[bucketCount];
    int[] bucketsMax = new int[bucketCount];
    Arrays.fill(bucketsMin, Integer.MAX_VALUE);
    Arrays.fill(bucketsMax, Integer.MIN_VALUE);

    // Step 4: Distribute numbers into buckets
    for (int num : nums) {
        // Calculate which bucket this number belongs to
        int bucketIdx = (num - minVal) / bucketSize;

        // Update bucket min and max
        bucketsMin[bucketIdx] = Math.min(bucketsMin[bucketIdx], num);
        bucketsMax[bucketIdx] = Math.max(bucketsMax[bucketIdx], num);
    }

    // Step 5: Find maximum gap by comparing consecutive non-empty buckets
    int maxGap = 0;
    int prevMax = minVal;  // The first bucket starts at minVal

    for (int i = 0; i < bucketCount; i++) {
        // Skip empty buckets
        if (bucketsMin[i] == Integer.MAX_VALUE) continue;

        // Gap is current bucket's min minus previous bucket's max
        maxGap = Math.max(maxGap, bucketsMin[i] - prevMax);

        // Update previous max to current bucket's max
        prevMax = bucketsMax[i];
    }

    return maxGap;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding min and max: O(n)
- Distributing `n` numbers into buckets: O(n)
- Scanning through buckets to find maximum gap: O(number of buckets) = O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We create two arrays of size `bucket_count` to store min and max values for each bucket.
- In the worst case, `bucket_count` can be up to `n` (when all numbers are distinct and spread out).
- Therefore, space complexity is O(n).

## Common Mistakes

1. **Forgetting edge cases**: Not handling arrays with 0 or 1 elements, or arrays where all elements are equal. Always check for these cases first.

2. **Integer division errors**: When calculating bucket size, using integer division without considering the ceiling. The bucket size should be at least 1, and we need to use `Math.ceil` or adjust the formula to ensure buckets cover the entire range.

3. **Incorrect bucket indexing**: Using the wrong formula to calculate which bucket a number belongs to. The correct formula is `(num - min_val) // bucket_size`.

4. **Not tracking bucket min and max separately**: Some candidates try to store all numbers in buckets, which uses O(n²) space in worst case. We only need the min and max of each bucket.

5. **Assuming maximum gap is within a bucket**: The key insight is that the maximum gap cannot be within a bucket (by design of bucket width), so we only need to check gaps between buckets.

## When You'll See This Pattern

The bucket sort approach used here is a specific application of the **Pigeonhole Principle**, which states that if you have more items than containers, at least one container must hold multiple items. This pattern appears in problems where:

1. **You need linear time sorting**: When O(n log n) is too slow but you have constraints that allow distribution-based sorting.
2. **You're finding gaps or distances**: Problems involving finding maximum/minimum distances between points or values.
3. **The input has known bounds**: When you know the range of possible values.

**Related problems:**

- **Contains Duplicate III**: Uses a similar bucket approach to find elements within a certain range.
- **H-Index**: Can be solved with bucket sort in linear time.
- **First Missing Positive**: Uses array indices as buckets to track presence of numbers.

## Key Takeaways

1. **Bucket sort enables linear time sorting** when you know the range of values and can distribute them into buckets. The key insight is that by choosing appropriate bucket sizes, you can guarantee that the answer lies between buckets, not within them.

2. **The Pigeonhole Principle is powerful** for optimization problems. If you have `n` items and `k` containers with `n > k`, you can deduce properties about the distribution that help avoid checking all pairs.

3. **When a problem requires O(n) time for what seems like a sorting problem**, consider if you can use non-comparison-based sorting (bucket sort, radix sort, counting sort) or if there's a mathematical property that lets you avoid full sorting.

Related problems: [Widest Vertical Area Between Two Points Containing No Points](/problem/widest-vertical-area-between-two-points-containing-no-points), [Maximum Consecutive Floors Without Special Floors](/problem/maximum-consecutive-floors-without-special-floors)
