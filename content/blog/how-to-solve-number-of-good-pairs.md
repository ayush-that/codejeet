---
title: "How to Solve Number of Good Pairs — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Good Pairs. Easy difficulty, 89.8% acceptance rate. Topics: Array, Hash Table, Math, Counting."
date: "2026-10-11"
category: "dsa-patterns"
tags: ["number-of-good-pairs", "array", "hash-table", "math", "easy"]
---

# How to Solve Number of Good Pairs

The problem asks us to count all index pairs `(i, j)` where `i < j` and `nums[i] == nums[j]`. While this seems straightforward, the interesting part is recognizing that we don't actually need to compare every possible pair. The key insight is that if we have `k` occurrences of a particular value, the number of good pairs formed between those occurrences is `k * (k-1) / 2` (the number of ways to choose 2 items from k). This transforms the problem from O(n²) to O(n).

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 1, 1, 3]`

**Step-by-step counting approach:**

1. Initialize a frequency map: `{}`
2. Process `nums[0] = 1`: frequency becomes `{1: 1}`
   - No pairs yet (need at least 2 of the same value)
3. Process `nums[1] = 2`: frequency becomes `{1: 1, 2: 1}`
   - No pairs
4. Process `nums[2] = 3`: frequency becomes `{1: 1, 2: 1, 3: 1}`
   - No pairs
5. Process `nums[3] = 1`: frequency becomes `{1: 2, 2: 1, 3: 1}`
   - Now we have 2 ones. The new `1` can pair with the previous `1` at index 0.
   - Add 1 pair: total = 1
6. Process `nums[4] = 1`: frequency becomes `{1: 3, 2: 1, 3: 1}`
   - Now we have 3 ones. The new `1` can pair with both previous `1`s at indices 0 and 3.
   - Add 2 pairs: total = 3
7. Process `nums[5] = 3`: frequency becomes `{1: 3, 2: 1, 3: 2}`
   - Now we have 2 threes. The new `3` can pair with the previous `3` at index 2.
   - Add 1 pair: total = 4

Final answer: 4 good pairs.

**Why this works:** Each time we see a value that already appears `count` times, we can form `count` new good pairs by pairing the current occurrence with each previous occurrence.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numIdenticalPairs(nums):
    count = 0
    n = len(nums)

    # Check every possible pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] == nums[j]:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numIdenticalPairs(nums) {
  let count = 0;
  const n = nums.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numIdenticalPairs(int[] nums) {
    int count = 0;
    int n = nums.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] == nums[j]) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With n up to 100 (as per typical constraints), O(n²) means up to 10,000 operations, which is acceptable. However, if n were larger (say 10⁵), this would be too slow. More importantly, the brute force approach doesn't demonstrate the optimal pattern recognition that interviewers look for.

## Optimal Solution

The optimal approach uses a hash map to count frequencies. As we iterate through the array, for each element, we check how many times we've seen it before. Each previous occurrence forms a new good pair with the current element.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numIdenticalPairs(nums):
    """
    Counts the number of good pairs in the array.
    A pair (i, j) is good if nums[i] == nums[j] and i < j.

    Approach: Use a frequency map to track occurrences.
    For each element, the number of new pairs it forms equals
    the number of times we've seen that value before.
    """
    count = 0
    freq = {}  # Dictionary to store frequency of each number

    # Iterate through each number in the array
    for num in nums:
        # If we've seen this number before, each previous occurrence
        # forms a new good pair with the current element
        if num in freq:
            count += freq[num]  # Add all pairs formed with previous occurrences
            freq[num] += 1      # Increment frequency for future pairs
        else:
            # First time seeing this number, no pairs yet
            freq[num] = 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function numIdenticalPairs(nums) {
  /**
   * Counts the number of good pairs in the array.
   * A pair (i, j) is good if nums[i] == nums[j] and i < j.
   *
   * Approach: Use a frequency map to track occurrences.
   * For each element, the number of new pairs it forms equals
   * the number of times we've seen that value before.
   */
  let count = 0;
  const freq = {}; // Object to store frequency of each number

  // Iterate through each number in the array
  for (const num of nums) {
    // If we've seen this number before, each previous occurrence
    // forms a new good pair with the current element
    if (freq[num] !== undefined) {
      count += freq[num]; // Add all pairs formed with previous occurrences
      freq[num] += 1; // Increment frequency for future pairs
    } else {
      // First time seeing this number, no pairs yet
      freq[num] = 1;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int numIdenticalPairs(int[] nums) {
    /**
     * Counts the number of good pairs in the array.
     * A pair (i, j) is good if nums[i] == nums[j] and i < j.
     *
     * Approach: Use a frequency map to track occurrences.
     * For each element, the number of new pairs it forms equals
     * the number of times we've seen that value before.
     */
    int count = 0;
    Map<Integer, Integer> freq = new HashMap<>();

    // Iterate through each number in the array
    for (int num : nums) {
        // If we've seen this number before, each previous occurrence
        // forms a new good pair with the current element
        if (freq.containsKey(num)) {
            count += freq.get(num);  // Add all pairs formed with previous occurrences
            freq.put(num, freq.get(num) + 1);  // Increment frequency for future pairs
        } else {
            // First time seeing this number, no pairs yet
            freq.put(num, 1);
        }
    }

    return count;
}
```

</div>

**Alternative mathematical approach:** We could first count all frequencies, then for each frequency `f`, add `f * (f-1) / 2` to the total. This gives the same result but requires two passes through the data.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing O(1) operations for each element (hash map lookups and updates).
- The number of operations grows linearly with the input size.

**Space Complexity: O(n)**

- In the worst case, all elements are distinct, so the hash map stores n entries.
- Even if elements repeat, we still need space proportional to the number of distinct values.

## Common Mistakes

1. **Off-by-one in brute force loops:** Writing `for j in range(i, n)` instead of `for j in range(i + 1, n)` would count pairs where `i = j`, which violates the `i < j` condition.

2. **Incorrect frequency counting:** Some candidates try to use the combination formula `n * (n-1) / 2` but apply it incorrectly. They might calculate it for the entire array instead of for each distinct value's frequency.

3. **Forgetting to handle first occurrence:** When a number appears for the first time, we shouldn't add to the count (no previous occurrences to pair with). The code must handle this case separately.

4. **Using inefficient data structures:** While an array could work if values have a limited range, a hash map is the most general solution. Avoid using nested loops or sorting unless you can justify why they're appropriate.

## When You'll See This Pattern

This "frequency counting" pattern appears in many problems where you need to count pairs, groups, or relationships based on equality or some other property:

1. **Number of Pairs of Interchangeable Rectangles (Medium):** Count pairs of rectangles with the same width/height ratio. Instead of comparing every pair, count frequencies of ratios and use the combination formula.

2. **Substrings That Begin and End With the Same Letter (Medium):** Count substrings where first and last characters are equal. Similar to good pairs, each occurrence of a character can pair with previous occurrences.

3. **Two Sum (Easy):** While not identical, it uses a similar hash map approach to avoid O(n²) comparisons by storing what we've seen so far.

4. **Count Number of Nice Subarrays (Medium):** Uses prefix sums and frequency counting to find subarrays with a specific property.

The core idea is to transform a problem that seems to require comparing all pairs (O(n²)) into one where we can process elements sequentially while maintaining some state (O(n)).

## Key Takeaways

1. **Frequency maps are powerful:** When you need to count relationships based on equality, a hash map to track frequencies often leads to O(n) solutions instead of O(n²).

2. **Think incrementally:** Instead of counting all pairs at once, consider how each new element contributes to the total count based on what you've seen before.

3. **Mathematical insight helps:** Recognizing that `k` occurrences create `k*(k-1)/2` pairs is valuable, but the incremental counting approach (adding `freq[num]` to count) is often more intuitive to implement.

4. **This is a building block:** Master this pattern because it's a fundamental technique that appears in more complex problems involving counting, grouping, or finding relationships in data.

Related problems: [Number of Pairs of Interchangeable Rectangles](/problem/number-of-pairs-of-interchangeable-rectangles), [Substrings That Begin and End With the Same Letter](/problem/substrings-that-begin-and-end-with-the-same-letter)
