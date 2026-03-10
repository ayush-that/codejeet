---
title: "How to Solve How Many Numbers Are Smaller Than the Current Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode How Many Numbers Are Smaller Than the Current Number. Easy difficulty, 87.4% acceptance rate. Topics: Array, Hash Table, Sorting, Counting Sort."
date: "2026-11-25"
category: "dsa-patterns"
tags:
  ["how-many-numbers-are-smaller-than-the-current-number", "array", "hash-table", "sorting", "easy"]
---

# How to Solve "How Many Numbers Are Smaller Than the Current Number"

This problem asks us to count, for each number in an array, how many other numbers in the same array are strictly smaller than it. While the problem seems straightforward, the challenge lies in finding an efficient solution that avoids repeatedly scanning the entire array for each element. The interesting part is recognizing that we can preprocess the data to answer all queries quickly.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider `nums = [8, 1, 2, 2, 3]`.

For each number:

- `8`: Smaller numbers are `[1, 2, 2, 3]` → 4 numbers
- `1`: No numbers are smaller → 0
- `2`: Only `1` is smaller → 1
- `2`: Only `1` is smaller → 1
- `3`: Smaller numbers are `[1, 2, 2]` → 3

So the answer should be `[4, 0, 1, 1, 3]`.

The brute force approach would compare each number with every other number, which takes O(n²) time. But notice something interesting: if we sort the array, we get `[1, 2, 2, 3, 8]`. For each unique number, its count of smaller numbers is simply its position in the sorted array (for the first occurrence of duplicates). However, we need to handle duplicates carefully since equal numbers shouldn't count as "smaller."

## Brute Force Approach

The most straightforward solution is to use nested loops: for each element, count how many other elements are smaller than it.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output array
def smallerNumbersThanCurrent(nums):
    n = len(nums)
    result = [0] * n

    # For each element, compare with all other elements
    for i in range(n):
        count = 0
        for j in range(n):
            # Count elements that are strictly smaller
            if j != i and nums[j] < nums[i]:
                count += 1
        result[i] = count

    return result
```

```javascript
// Time: O(n²) | Space: O(1) excluding output array
function smallerNumbersThanCurrent(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0);

  // For each element, compare with all other elements
  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < n; j++) {
      // Count elements that are strictly smaller
      if (j !== i && nums[j] < nums[i]) {
        count++;
      }
    }
    result[i] = count;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output array
public int[] smallerNumbersThanCurrent(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    // For each element, compare with all other elements
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) {
            // Count elements that are strictly smaller
            if (j != i && nums[j] < nums[i]) {
                count++;
            }
        }
        result[i] = count;
    }

    return result;
}
```

</div>

**Why this isn't optimal:** With n elements, we're doing n comparisons for each of n elements, resulting in O(n²) time complexity. For large arrays (n up to 500 in typical constraints), this could mean 250,000 operations, which is inefficient. We can do better by preprocessing the data.

## Optimal Solution

The key insight is that we don't need to compare each element with every other element. Instead, we can:

1. Sort a copy of the array to find the rank of each number
2. Use a hash map to store the first occurrence index of each number in the sorted array
3. For each original number, look up its count in the hash map

Why does this work? In a sorted array, the number of elements smaller than `nums[i]` is exactly the index of its first occurrence in the sorted array. For example, in `[1, 2, 2, 3, 8]`, the first `2` appears at index 1, meaning there's 1 element smaller than it.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def smallerNumbersThanCurrent(nums):
    # Step 1: Create a sorted copy of the array
    sorted_nums = sorted(nums)

    # Step 2: Create a hash map to store the first occurrence of each number
    # We only store the first occurrence because duplicates should have the same count
    first_occurrence = {}

    # Traverse the sorted array from left to right
    for i, num in enumerate(sorted_nums):
        # Only store the first time we see each number
        if num not in first_occurrence:
            first_occurrence[num] = i

    # Step 3: Build the result by looking up each number in the hash map
    result = []
    for num in nums:
        # The count of smaller numbers is the index of first occurrence
        result.append(first_occurrence[num])

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function smallerNumbersThanCurrent(nums) {
  // Step 1: Create a sorted copy of the array
  const sortedNums = [...nums].sort((a, b) => a - b);

  // Step 2: Create a hash map to store the first occurrence of each number
  // We only store the first occurrence because duplicates should have the same count
  const firstOccurrence = new Map();

  // Traverse the sorted array from left to right
  for (let i = 0; i < sortedNums.length; i++) {
    const num = sortedNums[i];
    // Only store the first time we see each number
    if (!firstOccurrence.has(num)) {
      firstOccurrence.set(num, i);
    }
  }

  // Step 3: Build the result by looking up each number in the hash map
  const result = [];
  for (const num of nums) {
    // The count of smaller numbers is the index of first occurrence
    result.push(firstOccurrence.get(num));
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int[] smallerNumbersThanCurrent(int[] nums) {
    // Step 1: Create a sorted copy of the array
    int[] sortedNums = nums.clone();
    Arrays.sort(sortedNums);

    // Step 2: Create a hash map to store the first occurrence of each number
    // We only store the first occurrence because duplicates should have the same count
    Map<Integer, Integer> firstOccurrence = new HashMap<>();

    // Traverse the sorted array from left to right
    for (int i = 0; i < sortedNums.length; i++) {
        int num = sortedNums[i];
        // Only store the first time we see each number
        if (!firstOccurrence.containsKey(num)) {
            firstOccurrence.put(num, i);
        }
    }

    // Step 3: Build the result by looking up each number in the hash map
    int[] result = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        // The count of smaller numbers is the index of first occurrence
        result[i] = firstOccurrence.get(nums[i]);
    }

    return result;
}
```

</div>

**Alternative counting sort approach:** Since the problem constraints often limit numbers to 0-100, we can use counting sort for O(n + k) time where k is the range of values:

<div class="code-group">

```python
# Time: O(n + k) where k is the range of values (0-100) | Space: O(k)
def smallerNumbersThanCurrent(nums):
    # Since nums[i] is between 0 and 100
    count = [0] * 101

    # Count frequency of each number
    for num in nums:
        count[num] += 1

    # Compute running sum: count[i] = number of elements <= i
    running_sum = 0
    for i in range(101):
        temp = count[i]
        count[i] = running_sum  # Store count of numbers < i
        running_sum += temp     # Update for next iteration

    # Build result: for each num, count[num] gives numbers smaller than it
    result = []
    for num in nums:
        result.append(count[num])

    return result
```

```javascript
// Time: O(n + k) where k is the range of values (0-100) | Space: O(k)
function smallerNumbersThanCurrent(nums) {
  // Since nums[i] is between 0 and 100
  const count = new Array(101).fill(0);

  // Count frequency of each number
  for (const num of nums) {
    count[num]++;
  }

  // Compute running sum: count[i] = number of elements <= i
  let runningSum = 0;
  for (let i = 0; i <= 100; i++) {
    const temp = count[i];
    count[i] = runningSum; // Store count of numbers < i
    runningSum += temp; // Update for next iteration
  }

  // Build result: for each num, count[num] gives numbers smaller than it
  const result = [];
  for (const num of nums) {
    result.push(count[num]);
  }

  return result;
}
```

```java
// Time: O(n + k) where k is the range of values (0-100) | Space: O(k)
public int[] smallerNumbersThanCurrent(int[] nums) {
    // Since nums[i] is between 0 and 100
    int[] count = new int[101];

    // Count frequency of each number
    for (int num : nums) {
        count[num]++;
    }

    // Compute running sum: count[i] = number of elements <= i
    int runningSum = 0;
    for (int i = 0; i <= 100; i++) {
        int temp = count[i];
        count[i] = runningSum;  // Store count of numbers < i
        runningSum += temp;     // Update for next iteration
    }

    // Build result: for each num, count[num] gives numbers smaller than it
    int[] result = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        result[i] = count[nums[i]];
    }

    return result;
}
```

</div>

## Complexity Analysis

**Sorting + Hash Map Approach:**

- **Time Complexity:** O(n log n) for sorting + O(n) for building the hash map + O(n) for building the result = O(n log n) overall
- **Space Complexity:** O(n) for the sorted copy + O(n) for the hash map + O(n) for the output = O(n) overall

**Counting Sort Approach (when values are limited to a small range):**

- **Time Complexity:** O(n + k) where n is array length and k is the range of values (e.g., 101 for 0-100)
- **Space Complexity:** O(k) for the count array + O(n) for the output = O(n + k) overall

The counting sort approach is technically better when k is small, but the sorting approach is more general and works for any range of values.

## Common Mistakes

1. **Not handling duplicates correctly:** If you simply use binary search to find a number's position in the sorted array, you might get the wrong index for duplicates. For example, in `[1, 2, 2, 3]`, both `2`s should have count 1, but binary search might return index 2 for the second `2`. Always store the first occurrence.

2. **Off-by-one errors with indices:** When using the counting sort approach, remember that `count[num]` should store the count of numbers **strictly less than** `num`, not less than or equal to. That's why we store the running sum before adding the current count.

3. **Modifying the original array:** Always work with a copy when sorting. Modifying the original array would destroy the order needed to build the final result.

4. **Assuming sorted indices map directly:** Don't assume the index in the sorted array directly gives the answer for the original position. You need to map back using the original values through a hash map.

## When You'll See This Pattern

This problem teaches the **"preprocessing for quick lookup"** pattern, which appears in many coding problems:

1. **Count of Smaller Numbers After Self (Hard):** A more complex version where you need counts for elements to the right only. This requires advanced data structures like Fenwick trees or merge sort modifications.

2. **How Many Numbers Are Smaller Than the Current Number (this problem):** The basic version that introduces the preprocessing concept.

3. **Longest Subsequence With Limited Sum (Easy):** Uses sorting and prefix sums to answer multiple queries efficiently.

4. **Rank Transform of an Array (Easy):** Very similar to this problem - you're essentially computing ranks.

The core idea is to avoid repeated work by preprocessing the data into a form that allows O(1) or O(log n) lookups for each query.

## Key Takeaways

1. **Preprocess once, query many times:** When you need to answer the same type of question for each element, it's often more efficient to preprocess the data once rather than recompute for each element.

2. **Sorting reveals positional information:** Sorting transforms the problem from "compare each with all others" to "find position in sorted order," which is easier to compute.

3. **Hash maps bridge between original and processed data:** After sorting, you lose the original order. A hash map lets you map from original values to their precomputed answers.

4. **Consider value ranges for optimization:** When values are limited to a small range, counting sort can give you O(n) time instead of O(n log n).

Related problems: [Count of Smaller Numbers After Self](/problem/count-of-smaller-numbers-after-self), [Longest Subsequence With Limited Sum](/problem/longest-subsequence-with-limited-sum)
