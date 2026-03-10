---
title: "How to Solve Find the Score of All Prefixes of an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Score of All Prefixes of an Array. Medium difficulty, 72.8% acceptance rate. Topics: Array, Prefix Sum."
date: "2028-10-02"
category: "dsa-patterns"
tags: ["find-the-score-of-all-prefixes-of-an-array", "array", "prefix-sum", "medium"]
---

# How to Solve Find the Score of All Prefixes of an Array

This problem asks us to compute the "score" for every prefix of an input array. The score of a prefix is defined as the sum of a special "conversion array" where each element is the original value plus the maximum value seen so far. What makes this problem interesting is that we need to compute scores for all prefixes efficiently, which requires tracking both running sums and running maximums simultaneously.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [3, 1, 5, 2]`

**Prefix 1:** `[3]`

- Max so far: 3
- Conversion array: `[3 + 3] = [6]`
- Score: 6

**Prefix 2:** `[3, 1]`

- Max so far: max(3, 1) = 3
- Conversion array: `[3+3, 1+3] = [6, 4]`
- Score: 6 + 4 = 10

**Prefix 3:** `[3, 1, 5]`

- Max so far: max(3, 1, 5) = 5
- Conversion array: `[3+5, 1+5, 5+5] = [8, 6, 10]`
- Score: 8 + 6 + 10 = 24

**Prefix 4:** `[3, 1, 5, 2]`

- Max so far: max(3, 1, 5, 2) = 5
- Conversion array: `[3+5, 1+5, 5+5, 2+5] = [8, 6, 10, 7]`
- Score: 8 + 6 + 10 + 7 = 31

So the output should be: `[6, 10, 24, 31]`

Notice two patterns:

1. The maximum value only increases or stays the same as we process more elements
2. Each prefix's score builds upon the previous prefix's score

## Brute Force Approach

A naive approach would be to compute each prefix independently:

For each prefix length i from 1 to n:

1. Find the maximum in arr[0..i-1]
2. Create the conversion array by adding this maximum to each element
3. Sum the conversion array to get the score

This approach has O(n²) time complexity because for each of n prefixes, we:

- Scan up to n elements to find the maximum: O(n)
- Create and sum the conversion array: O(n)

The total becomes O(n³) if implemented literally, or O(n²) with careful implementation. Either way, it's too slow for typical constraints where n can be up to 10⁵.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for output
def findPrefixScore_brute(arr):
    n = len(arr)
    result = []

    for i in range(1, n + 1):
        # Find max in current prefix
        current_max = max(arr[:i])

        # Compute conversion array and its sum
        prefix_sum = 0
        for j in range(i):
            prefix_sum += arr[j] + current_max

        result.append(prefix_sum)

    return result
```

```javascript
// Time: O(n²) | Space: O(n) for output
function findPrefixScoreBrute(arr) {
  const n = arr.length;
  const result = [];

  for (let i = 1; i <= n; i++) {
    // Find max in current prefix
    let currentMax = Math.max(...arr.slice(0, i));

    // Compute conversion array and its sum
    let prefixSum = 0;
    for (let j = 0; j < i; j++) {
      prefixSum += arr[j] + currentMax;
    }

    result.push(prefixSum);
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(n) for output
public long[] findPrefixScoreBrute(int[] arr) {
    int n = arr.length;
    long[] result = new long[n];

    for (int i = 0; i < n; i++) {
        // Find max in prefix arr[0..i]
        int currentMax = Integer.MIN_VALUE;
        for (int j = 0; j <= i; j++) {
            currentMax = Math.max(currentMax, arr[j]);
        }

        // Compute sum of conversion array
        long prefixSum = 0;
        for (int j = 0; j <= i; j++) {
            prefixSum += arr[j] + currentMax;
        }

        result[i] = prefixSum;
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to recompute everything from scratch for each prefix. We can maintain two running values:

1. **Running maximum**: As we process each new element, update the maximum seen so far. Since we process elements left to right, the maximum can only increase or stay the same.

2. **Running sum of conversion values**: Instead of recomputing the entire conversion array sum for each prefix, we can build it incrementally. For each new element `arr[i]`, the new conversion value is `arr[i] + current_max`. The new prefix score is the previous prefix score plus this new conversion value.

This gives us an O(n) solution where we process each element exactly once.

## Optimal Solution

Here's the efficient O(n) solution that processes the array in a single pass:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for output
def findPrefixScore(arr):
    n = len(arr)
    result = [0] * n  # Initialize result array

    current_max = 0  # Track maximum value seen so far
    running_sum = 0  # Track sum of conversion values

    for i in range(n):
        # Update the maximum value seen so far
        current_max = max(current_max, arr[i])

        # The conversion value for current element is arr[i] + current_max
        conversion_value = arr[i] + current_max

        # Add this conversion value to the running sum
        running_sum += conversion_value

        # Store the running sum as the score for prefix ending at i
        result[i] = running_sum

    return result
```

```javascript
// Time: O(n) | Space: O(n) for output
function findPrefixScore(arr) {
  const n = arr.length;
  const result = new Array(n);

  let currentMax = 0; // Track maximum value seen so far
  let runningSum = 0; // Track sum of conversion values

  for (let i = 0; i < n; i++) {
    // Update the maximum value seen so far
    currentMax = Math.max(currentMax, arr[i]);

    // The conversion value for current element is arr[i] + currentMax
    const conversionValue = arr[i] + currentMax;

    // Add this conversion value to the running sum
    runningSum += conversionValue;

    // Store the running sum as the score for prefix ending at i
    result[i] = runningSum;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for output
public long[] findPrefixScore(int[] arr) {
    int n = arr.length;
    long[] result = new long[n];

    int currentMax = 0;      // Track maximum value seen so far
    long runningSum = 0;     // Track sum of conversion values

    for (int i = 0; i < n; i++) {
        // Update the maximum value seen so far
        currentMax = Math.max(currentMax, arr[i]);

        // The conversion value for current element is arr[i] + currentMax
        long conversionValue = (long)arr[i] + currentMax;

        // Add this conversion value to the running sum
        runningSum += conversionValue;

        // Store the running sum as the score for prefix ending at i
        result[i] = runningSum;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once
- Each iteration performs constant-time operations: max comparison, addition, and assignment

**Space Complexity: O(n)**

- We need to store the result array of size n
- We use only O(1) additional space for variables tracking current maximum and running sum

## Common Mistakes

1. **Recomputing the maximum from scratch for each prefix**: This turns an O(n) solution into O(n²). Always ask: "Can I update this value incrementally?"

2. **Integer overflow**: When n is large (up to 10⁵) and values can be up to 10⁵, the sum can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, no issue in Python, BigInt if needed in JavaScript).

3. **Off-by-one errors with prefix indices**: Remember that for prefix ending at index i, we include elements 0 through i. The conversion value uses the maximum of arr[0..i], not arr[0..i-1].

4. **Confusing prefix scores with conversion arrays**: The problem asks for the sum of conversion values (the score), not the conversion array itself. Read carefully!

## When You'll See This Pattern

This problem combines two common patterns:

1. **Running maximum/monotonic tracking**: Similar to problems where you need to track some extremum (max/min) as you process a sequence.
   - _Daily Temperatures_: Track temperatures and find warmer days
   - _Next Greater Element_: Find next greater element in array

2. **Prefix sums with incremental updates**: When you need to compute something for all prefixes/subarrays, think about building the answer incrementally.
   - _Range Sum Query - Immutable_: Precompute prefix sums for O(1) range queries
   - _Maximum Subarray_: Kadane's algorithm builds solution incrementally

The specific combination appears in problems like **Most Beautiful Item for Each Query**, where you need to preprocess items to answer queries about maximum beauty within price ranges efficiently.

## Key Takeaways

1. **When computing something for all prefixes, think incrementally**: Instead of recomputing from scratch, ask how each new element changes the answer from the previous prefix.

2. **Track running extremums (max/min) as you go**: If you need the maximum/minimum of all elements seen so far, maintain it as a variable that updates with each new element.

3. **Watch for overflow in cumulative sums**: When summing many values, especially in problems with large n, default to using 64-bit integers to avoid overflow issues.

Related problems: [Most Beautiful Item for Each Query](/problem/most-beautiful-item-for-each-query)
