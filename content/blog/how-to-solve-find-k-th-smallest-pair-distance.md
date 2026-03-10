---
title: "How to Solve Find K-th Smallest Pair Distance — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find K-th Smallest Pair Distance. Hard difficulty, 46.3% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2028-09-01"
category: "dsa-patterns"
tags: ["find-k-th-smallest-pair-distance", "array", "two-pointers", "binary-search", "hard"]
---

# How to Solve Find K-th Smallest Pair Distance

This problem asks us to find the k-th smallest distance among all possible pairs in an array, where distance is defined as the absolute difference between two numbers. The challenge comes from the combinatorial explosion: for an array of length n, there are n\*(n-1)/2 possible pairs, which grows quadratically. A brute force approach that generates all distances would be O(n²), which is too slow for typical constraints where n can be up to 10⁴.

## Visual Walkthrough

Let's walk through a concrete example: `nums = [1, 3, 1]`, `k = 1`

First, we need to sort the array: `[1, 1, 3]`

The sorted distances between all pairs (i < j):

- Pair (0,1): |1-1| = 0
- Pair (0,2): |1-3| = 2
- Pair (1,2): |1-3| = 2

Sorted distances: [0, 2, 2]

The 1st smallest distance is 0.

Now let's think about how we could find this without generating all distances. Notice that after sorting, the distances between elements are ordered in a useful way. For any distance `d`, we can count how many pairs have distance ≤ `d` using a two-pointer technique. This gives us a crucial insight: we can **binary search** over possible distances and use a **counting function** to check if we've found the k-th smallest distance.

## Brute Force Approach

The most straightforward approach is to:

1. Generate all possible pairs (i, j) where i < j
2. Calculate the absolute difference for each pair
3. Sort all the distances
4. Return the k-th smallest distance

<div class="code-group">

```python
# Time: O(n² log n) | Space: O(n²)
def smallestDistancePair(nums, k):
    n = len(nums)
    distances = []

    # Generate all pairs and their distances
    for i in range(n):
        for j in range(i + 1, n):
            distances.append(abs(nums[i] - nums[j]))

    # Sort all distances
    distances.sort()

    # Return the k-th smallest (1-indexed)
    return distances[k - 1]
```

```javascript
// Time: O(n² log n) | Space: O(n²)
function smallestDistancePair(nums, k) {
  const n = nums.length;
  const distances = [];

  // Generate all pairs and their distances
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      distances.push(Math.abs(nums[i] - nums[j]));
    }
  }

  // Sort all distances
  distances.sort((a, b) => a - b);

  // Return the k-th smallest (1-indexed)
  return distances[k - 1];
}
```

```java
// Time: O(n² log n) | Space: O(n²)
public int smallestDistancePair(int[] nums, int k) {
    int n = nums.length;
    List<Integer> distances = new ArrayList<>();

    // Generate all pairs and their distances
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            distances.add(Math.abs(nums[i] - nums[j]));
        }
    }

    // Sort all distances
    Collections.sort(distances);

    // Return the k-th smallest (1-indexed)
    return distances.get(k - 1);
}
```

</div>

**Why this fails:** With n up to 10⁴, there are about 50 million pairs. Generating and storing all distances requires O(n²) space, which is about 200MB for integers. Sorting them takes O(n² log n²) operations, which is completely infeasible. We need a solution that avoids explicitly generating all pairs.

## Optimized Approach

The key insight is that we can combine **binary search** with a **two-pointer counting technique**:

1. **Sort the array first** - This allows us to work with distances in a meaningful order
2. **Binary search over possible distances** - The minimum possible distance is 0, and the maximum is `nums[-1] - nums[0]` after sorting
3. **Count pairs with distance ≤ mid** - For each candidate distance `mid`, count how many pairs have distance ≤ `mid`
4. **Adjust search based on count** - If we have at least `k` pairs with distance ≤ `mid`, the answer is ≤ `mid`. Otherwise, it's > `mid`

The clever part is how to count pairs efficiently. For a sorted array and a given distance `d`, we can use a sliding window:

- For each element at index `i`, find the largest index `j` such that `nums[j] - nums[i] ≤ d`
- All pairs `(i, i+1), (i, i+2), ..., (i, j)` have distance ≤ `d`
- The count for index `i` is `j - i`
- We can find `j` efficiently using two pointers since the array is sorted

This counting function runs in O(n) time, making our overall solution O(n log W) where W is the range of possible distances.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log W + n log n) where W is max distance | Space: O(1)
def smallestDistancePair(nums, k):
    # Step 1: Sort the array to make distances meaningful
    nums.sort()

    # Step 2: Binary search over possible distances
    # Minimum possible distance is 0
    # Maximum possible distance is between first and last element
    left, right = 0, nums[-1] - nums[0]

    while left < right:
        mid = (left + right) // 2

        # Step 3: Count how many pairs have distance <= mid
        count = 0
        j = 0

        # Use sliding window to count pairs efficiently
        for i in range(len(nums)):
            # Move j forward while nums[j] - nums[i] <= mid
            # j will be the largest index where the condition holds
            while j < len(nums) and nums[j] - nums[i] <= mid:
                j += 1

            # All pairs (i, i+1), (i, i+2), ..., (i, j-1) have distance <= mid
            # Count is (j - 1) - i = j - i - 1
            count += j - i - 1

        # Step 4: Adjust binary search based on count
        if count >= k:
            # If we have at least k pairs with distance <= mid,
            # the answer is <= mid
            right = mid
        else:
            # Otherwise, the answer is > mid
            left = mid + 1

    return left
```

```javascript
// Time: O(n log W + n log n) where W is max distance | Space: O(1)
function smallestDistancePair(nums, k) {
  // Step 1: Sort the array to make distances meaningful
  nums.sort((a, b) => a - b);

  // Step 2: Binary search over possible distances
  let left = 0;
  let right = nums[nums.length - 1] - nums[0];

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Step 3: Count how many pairs have distance <= mid
    let count = 0;
    let j = 0;

    // Use sliding window to count pairs efficiently
    for (let i = 0; i < nums.length; i++) {
      // Move j forward while nums[j] - nums[i] <= mid
      // j will be the largest index where the condition holds
      while (j < nums.length && nums[j] - nums[i] <= mid) {
        j++;
      }

      // All pairs (i, i+1), (i, i+2), ..., (i, j-1) have distance <= mid
      // Count is (j - 1) - i = j - i - 1
      count += j - i - 1;
    }

    // Step 4: Adjust binary search based on count
    if (count >= k) {
      // If we have at least k pairs with distance <= mid,
      // the answer is <= mid
      right = mid;
    } else {
      // Otherwise, the answer is > mid
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(n log W + n log n) where W is max distance | Space: O(1)
public int smallestDistancePair(int[] nums, int k) {
    // Step 1: Sort the array to make distances meaningful
    Arrays.sort(nums);

    // Step 2: Binary search over possible distances
    int left = 0;
    int right = nums[nums.length - 1] - nums[0];

    while (left < right) {
        int mid = left + (right - left) / 2;

        // Step 3: Count how many pairs have distance <= mid
        int count = 0;
        int j = 0;

        // Use sliding window to count pairs efficiently
        for (int i = 0; i < nums.length; i++) {
            // Move j forward while nums[j] - nums[i] <= mid
            // j will be the largest index where the condition holds
            while (j < nums.length && nums[j] - nums[i] <= mid) {
                j++;
            }

            // All pairs (i, i+1), (i, i+2), ..., (i, j-1) have distance <= mid
            // Count is (j - 1) - i = j - i - 1
            count += j - i - 1;
        }

        // Step 4: Adjust binary search based on count
        if (count >= k) {
            // If we have at least k pairs with distance <= mid,
            // the answer is <= mid
            right = mid;
        } else {
            // Otherwise, the answer is > mid
            left = mid + 1;
        }
    }

    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log W + n log n)

- Sorting takes O(n log n)
- Binary search runs O(log W) times, where W is the maximum possible distance (nums[-1] - nums[0])
- Each binary search iteration uses O(n) time for the counting function
- Total: O(n log n + n log W)

**Space Complexity:** O(1) or O(n) depending on sorting implementation

- The algorithm itself uses only constant extra space
- If the sorting algorithm is in-place (like quicksort), space is O(1)
- If the sorting algorithm uses extra space (like mergesort), space is O(n)

## Common Mistakes

1. **Forgetting to sort the array first**: The two-pointer counting technique only works on sorted arrays. Without sorting, you can't guarantee that `nums[j] - nums[i]` represents the distance between elements.

2. **Incorrect binary search bounds**: Using `while left <= right` instead of `while left < right` can cause infinite loops. The standard pattern for "find first element that satisfies condition" uses `while left < right` and returns `left`.

3. **Off-by-one errors in counting**: The formula `count += j - i - 1` is subtle. Remember that `j` points to the first element where `nums[j] - nums[i] > mid`, so valid pairs are from `i+1` to `j-1`, which gives `(j-1) - i = j - i - 1` pairs.

4. **Not handling duplicate elements correctly**: The counting function correctly handles duplicates because in a sorted array, equal elements have distance 0, which will be counted when `mid >= 0`.

## When You'll See This Pattern

This problem combines two powerful patterns:

1. **Binary search on answer space**: When you need to find the k-th smallest/largest element in a space that's too large to generate explicitly, but you can efficiently count how many elements are ≤ a given value.

2. **Two-pointer counting in sorted arrays**: When you need to count pairs satisfying a condition in a sorted array, a sliding window approach often gives O(n) time instead of O(n²).

Similar problems that use these patterns:

- **Kth Smallest Element in a Sorted Matrix**: Binary search over possible values with a counting function that traverses the matrix
- **Find K Pairs with Smallest Sums**: Maintain a heap of smallest sums, similar to counting ordered pairs
- **Find K Closest Elements**: Binary search to find the starting point of k closest elements

## Key Takeaways

1. **When you see "k-th smallest/largest" with too many elements to generate, think binary search on the answer space**. If you can create a function that counts how many elements are ≤ a given value in better than O(n²) time, binary search can find the answer in logarithmic time.

2. **Sorting often enables efficient pair counting**. After sorting, many pair-related problems can be solved with two-pointer techniques in O(n) time instead of O(n²).

3. **The combination of binary search + counting function is a powerful pattern** for problems where the answer space is monotonic (if x works, then all y > x also work, or vice versa).

Related problems: [Find K Pairs with Smallest Sums](/problem/find-k-pairs-with-smallest-sums), [Kth Smallest Element in a Sorted Matrix](/problem/kth-smallest-element-in-a-sorted-matrix), [Find K Closest Elements](/problem/find-k-closest-elements)
