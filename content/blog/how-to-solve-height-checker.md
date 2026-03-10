---
title: "How to Solve Height Checker — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Height Checker. Easy difficulty, 81.6% acceptance rate. Topics: Array, Sorting, Counting Sort."
date: "2027-02-24"
category: "dsa-patterns"
tags: ["height-checker", "array", "sorting", "counting-sort", "easy"]
---

# How to Solve Height Checker

At first glance, Height Checker seems almost too simple: count how many students are standing in the wrong position compared to a sorted version of the heights. The "trick" is that while the problem appears to be about sorting, the optimal solution doesn't actually require fully sorting the array. This teaches an important interview lesson: sometimes you can solve what looks like a sorting problem more efficiently by recognizing patterns in the constraints. The heights are limited to a small range (1-100), which opens the door for a counting-based approach that's more efficient than general-purpose sorting.

## Visual Walkthrough

Let's trace through an example: `heights = [1, 1, 4, 2, 1, 3]`

**Step 1: Understand what we're comparing**
We need to compare the current arrangement with what it should be if sorted in non-decreasing order.

**Step 2: Find the expected sorted order**
If we sort the array: `[1, 1, 1, 2, 3, 4]`

**Step 3: Compare position by position**

- Position 0: Current = 1, Expected = 1 ✓ Match
- Position 1: Current = 1, Expected = 1 ✓ Match
- Position 2: Current = 4, Expected = 1 ✗ Mismatch
- Position 3: Current = 2, Expected = 2 ✓ Match
- Position 4: Current = 1, Expected = 3 ✗ Mismatch
- Position 5: Current = 3, Expected = 4 ✗ Mismatch

**Step 4: Count mismatches**
We found 3 positions where the current height doesn't match the expected height.

The key insight is that we don't actually need to create a fully sorted array to make this comparison. We can use counting sort principles to track what height should appear at each position.

## Brute Force Approach

The most straightforward approach is to:

1. Create a copy of the heights array
2. Sort the copy to get the expected order
3. Compare the original array with the sorted copy position by position
4. Count how many positions differ

While this approach is correct and easy to understand, it's not optimal because:

- Sorting takes O(n log n) time
- We're creating an entire sorted array when we only need to know how many positions are wrong
- The problem constraints (heights between 1 and 100) suggest we can do better

However, this brute force solution is a good starting point for understanding the problem before we optimize.

## Optimal Solution

The optimal solution uses counting sort principles. Since heights are limited to the range 1-100, we can:

1. Count how many students have each height
2. Use these counts to determine what height should be at each position in the sorted order
3. Compare the expected height at each position with the actual height

This approach runs in O(n) time with O(1) extra space (since the height frequency array has fixed size 101).

<div class="code-group">

```python
# Time: O(n) where n is the length of heights
# Space: O(1) since heightCount has fixed size 101
def heightChecker(heights):
    # Step 1: Count frequency of each height (1-100)
    # We use size 101 because heights can be 1-100 inclusive
    heightCount = [0] * 101

    # Count occurrences of each height
    for height in heights:
        heightCount[height] += 1

    # Step 2: Initialize pointers and mismatch counter
    currentHeight = 1  # Start checking from height 1
    mismatchCount = 0  # Count of positions that don't match expected

    # Step 3: Check each position in the original array
    for i in range(len(heights)):
        # Find the next expected height for this position
        # Skip heights that have count 0
        while heightCount[currentHeight] == 0:
            currentHeight += 1

        # At position i, the expected height should be currentHeight
        # If the actual height differs, increment mismatch count
        if heights[i] != currentHeight:
            mismatchCount += 1

        # Decrease the count for this height since we've "placed" one student
        # of this height in the expected order
        heightCount[currentHeight] -= 1

    return mismatchCount
```

```javascript
// Time: O(n) where n is the length of heights
// Space: O(1) since heightCount has fixed size 101
function heightChecker(heights) {
  // Step 1: Count frequency of each height (1-100)
  // We use size 101 because heights can be 1-100 inclusive
  const heightCount = new Array(101).fill(0);

  // Count occurrences of each height
  for (const height of heights) {
    heightCount[height]++;
  }

  // Step 2: Initialize pointers and mismatch counter
  let currentHeight = 1; // Start checking from height 1
  let mismatchCount = 0; // Count of positions that don't match expected

  // Step 3: Check each position in the original array
  for (let i = 0; i < heights.length; i++) {
    // Find the next expected height for this position
    // Skip heights that have count 0
    while (heightCount[currentHeight] === 0) {
      currentHeight++;
    }

    // At position i, the expected height should be currentHeight
    // If the actual height differs, increment mismatch count
    if (heights[i] !== currentHeight) {
      mismatchCount++;
    }

    // Decrease the count for this height since we've "placed" one student
    // of this height in the expected order
    heightCount[currentHeight]--;
  }

  return mismatchCount;
}
```

```java
// Time: O(n) where n is the length of heights
// Space: O(1) since heightCount has fixed size 101
public int heightChecker(int[] heights) {
    // Step 1: Count frequency of each height (1-100)
    // We use size 101 because heights can be 1-100 inclusive
    int[] heightCount = new int[101];

    // Count occurrences of each height
    for (int height : heights) {
        heightCount[height]++;
    }

    // Step 2: Initialize pointers and mismatch counter
    int currentHeight = 1;  // Start checking from height 1
    int mismatchCount = 0;  // Count of positions that don't match expected

    // Step 3: Check each position in the original array
    for (int i = 0; i < heights.length; i++) {
        // Find the next expected height for this position
        // Skip heights that have count 0
        while (heightCount[currentHeight] == 0) {
            currentHeight++;
        }

        // At position i, the expected height should be currentHeight
        // If the actual height differs, increment mismatch count
        if (heights[i] != currentHeight) {
            mismatchCount++;
        }

        // Decrease the count for this height since we've "placed" one student
        // of this height in the expected order
        heightCount[currentHeight]--;
    }

    return mismatchCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies: O(n) to iterate through all heights
- Finding mismatches: O(n) to check each position
- The while loop inside the for loop might seem concerning, but notice that `currentHeight` only increases from 1 to at most 100. Each height is visited at most once when its count becomes 0. So the total operations across all while loops is O(100) = O(1), which doesn't affect the overall O(n) complexity.

**Space Complexity: O(1)**

- The heightCount array has fixed size 101 regardless of input size
- We use only a few additional variables (currentHeight, mismatchCount, loop counters)

## Common Mistakes

1. **Forgetting the height range constraint**: Some candidates try to use a hash map instead of a fixed-size array, which works but is less efficient. The fixed array is optimal because we know the exact range (1-100).

2. **Off-by-one errors with array indices**: Since heights start at 1, we need an array of size 101 to index height 100 directly. Using size 100 would cause index out of bounds errors for height 100.

3. **Not handling the while loop correctly**: The while loop `while (heightCount[currentHeight] == 0)` is crucial. If you use an if statement instead, you'll skip over heights that have count 0, but you might not advance to the next height when the current one is exhausted.

4. **Comparing with a fully sorted array**: While creating a sorted copy and comparing works, it's O(n log n) time and O(n) space. Interviewers expect you to notice the small height range and optimize to O(n) time and O(1) space.

## When You'll See This Pattern

The counting sort pattern used here appears in many problems with constrained value ranges:

1. **Sort Colors (LeetCode 75)**: Similar counting approach for 3 distinct values (0, 1, 2)
2. **Maximum Product of Three Numbers (LeetCode 628)**: Can use counting when numbers have limited range
3. **Relative Sort Array (LeetCode 1122)**: Uses counting sort when arr2 provides order and values are limited
4. **Valid Anagram (LeetCode 242)**: Count character frequencies instead of sorting strings

The key insight is: when values come from a limited, known range, counting-based approaches often beat general-purpose sorting algorithms.

## Key Takeaways

1. **Look for constraints in the problem statement**: The height range 1-100 is a huge hint that counting sort will be more efficient than general sorting.

2. **You don't always need to create the full sorted array**: For comparison problems, sometimes you can simulate the sorted order without actually constructing it.

3. **Fixed-size arrays beat hash maps for known ranges**: When you know the exact range of values, a simple array is more space and time efficient than a hash map.

[Practice this problem on CodeJeet](/problem/height-checker)
