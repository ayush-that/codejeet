---
title: "How to Solve Find Occurrences of an Element in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Occurrences of an Element in an Array. Medium difficulty, 73.3% acceptance rate. Topics: Array, Hash Table."
date: "2028-05-15"
category: "dsa-patterns"
tags: ["find-occurrences-of-an-element-in-an-array", "array", "hash-table", "medium"]
---

# How to Solve Find Occurrences of an Element in an Array

This problem asks us to efficiently answer multiple queries about the positions of a specific element in an array. For each query asking for the k-th occurrence of element `x`, we need to return its index or -1 if it doesn't exist. The challenge comes from needing to answer many queries quickly—a brute force approach would be too slow for large inputs.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `nums = [1, 3, 1, 7, 1, 5, 1]`
- `x = 1`
- `queries = [2, 4, 1, 5]`

**Step 1:** First, let's find all occurrences of `x = 1` in `nums`:

- Index 0: value 1 ✓ (1st occurrence)
- Index 2: value 1 ✓ (2nd occurrence)
- Index 4: value 1 ✓ (3rd occurrence)
- Index 6: value 1 ✓ (4th occurrence)

**Step 2:** Now answer each query:

- Query 1: "Find the 2nd occurrence of 1" → That's at index 2
- Query 2: "Find the 4th occurrence of 1" → That's at index 6
- Query 3: "Find the 1st occurrence of 1" → That's at index 0
- Query 4: "Find the 5th occurrence of 1" → We only have 4 occurrences, so answer is -1

**Output:** `[2, 6, 0, -1]`

The key insight: if we precompute all positions where `x` appears, answering queries becomes a simple array lookup.

## Brute Force Approach

A naive approach would process each query independently by scanning through `nums` each time:

1. For each query `k` in `queries`:
   - Initialize a counter to 0
   - Scan through `nums` from left to right
   - Whenever we find `x`, increment the counter
   - When counter equals `k`, return the current index
   - If we reach the end without finding the k-th occurrence, return -1

**Why this fails:**

- Time complexity: O(m × n) where m = number of queries, n = length of nums
- For large inputs (e.g., n = 10⁵, m = 10⁵), this would be 10¹⁰ operations—far too slow
- We're doing redundant work by scanning the array repeatedly for the same information

## Optimized Approach

The optimal solution uses **preprocessing** to avoid repeated work:

**Key Insight:** We only need to find the positions of `x` once, not for every query.

**Step-by-step reasoning:**

1. **Preprocessing Phase:** Scan through `nums` once and collect all indices where `x` appears into a list.
2. **Query Answering Phase:** For each query asking for the k-th occurrence:
   - If k is greater than the number of occurrences we found, return -1
   - Otherwise, return the (k-1)th element from our list (since arrays are 0-indexed)

**Why this works:**

- Preprocessing takes O(n) time, done once
- Each query takes O(1) time—just an array access
- Total time: O(n + m) instead of O(m × n)
- The space tradeoff is minimal: we store at most n indices

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums), m = len(queries)
# Space: O(k) where k = number of occurrences of x (worst case O(n))
def occurrencesOfElement(nums, queries, x):
    """
    Finds the index of the k-th occurrence of x for each query.

    Args:
        nums: List of integers to search through
        queries: List of integers representing which occurrence to find
        x: The target element to find occurrences of

    Returns:
        List of indices or -1 for each query
    """
    # Step 1: Preprocess - find all indices where x appears
    occurrences = []
    for i, num in enumerate(nums):
        if num == x:
            occurrences.append(i)  # Store the index

    # Step 2: Answer each query using the precomputed list
    result = []
    for k in queries:
        # Check if this occurrence exists (k is 1-based, so k-1 for 0-based indexing)
        if k > len(occurrences):
            result.append(-1)  # Not enough occurrences
        else:
            result.append(occurrences[k - 1])  # k-th occurrence at index k-1

    return result
```

```javascript
// Time: O(n + m) where n = nums.length, m = queries.length
// Space: O(k) where k = number of occurrences of x (worst case O(n))
function occurrencesOfElement(nums, queries, x) {
  /**
   * Finds the index of the k-th occurrence of x for each query.
   *
   * @param {number[]} nums - Array of integers to search through
   * @param {number[]} queries - Array representing which occurrence to find
   * @param {number} x - The target element to find occurrences of
   * @return {number[]} - Array of indices or -1 for each query
   */

  // Step 1: Preprocess - find all indices where x appears
  const occurrences = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === x) {
      occurrences.push(i); // Store the index
    }
  }

  // Step 2: Answer each query using the precomputed list
  const result = [];
  for (const k of queries) {
    // Check if this occurrence exists (k is 1-based, so k-1 for 0-based indexing)
    if (k > occurrences.length) {
      result.push(-1); // Not enough occurrences
    } else {
      result.push(occurrences[k - 1]); // k-th occurrence at index k-1
    }
  }

  return result;
}
```

```java
// Time: O(n + m) where n = nums.length, m = queries.length
// Space: O(k) where k = number of occurrences of x (worst case O(n))
import java.util.ArrayList;
import java.util.List;

class Solution {
    public int[] occurrencesOfElement(int[] nums, int[] queries, int x) {
        /**
         * Finds the index of the k-th occurrence of x for each query.
         *
         * @param nums - Array of integers to search through
         * @param queries - Array representing which occurrence to find
         * @param x - The target element to find occurrences of
         * @return - Array of indices or -1 for each query
         */

        // Step 1: Preprocess - find all indices where x appears
        List<Integer> occurrences = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == x) {
                occurrences.add(i);  // Store the index
            }
        }

        // Step 2: Answer each query using the precomputed list
        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int k = queries[i];
            // Check if this occurrence exists (k is 1-based, so k-1 for 0-based indexing)
            if (k > occurrences.size()) {
                result[i] = -1;  // Not enough occurrences
            } else {
                result[i] = occurrences.get(k - 1);  // k-th occurrence at index k-1
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- **O(n):** We scan through `nums` once to find all occurrences of `x`
- **O(m):** We process each query once with O(1) operations per query
- This is optimal because we must at least look at each element in `nums` and each query

**Space Complexity: O(k) where k = number of occurrences of x**

- In the worst case, if all elements equal `x`, we store n indices → O(n)
- In the best case, if no elements equal `x`, we store nothing → O(1)
- The output array of size m is not counted in auxiliary space analysis

## Common Mistakes

1. **Off-by-one errors with 1-based vs 0-based indexing:**
   - Query asks for "k-th occurrence" (1-based)
   - Arrays are 0-based, so the k-th occurrence is at index k-1
   - **Fix:** Always subtract 1 when accessing the occurrences list

2. **Not checking bounds before accessing the occurrences list:**
   - If query asks for the 5th occurrence but we only found 3, we'll get an index error
   - **Fix:** Always check if `k > occurrences.length` before accessing

3. **Using the wrong data structure for queries:**
   - Some candidates try to use a hash map with occurrence count as key
   - This works but is unnecessary since we can use direct array access
   - **Fix:** Simple list/array is sufficient and more efficient

4. **Forgetting to handle the case where x doesn't appear at all:**
   - If `x` is not in `nums`, all queries should return -1
   - **Fix:** Our solution handles this automatically since `occurrences` will be empty

## When You'll See This Pattern

This **preprocessing + direct lookup** pattern appears in many problems where you need to answer multiple queries about the same data:

1. **Two Sum (LeetCode #1):** While not identical, it also involves preprocessing data (into a hash map) to answer "does this complement exist?" quickly.

2. **Range Sum Query - Immutable (LeetCode #303):** Uses prefix sums—precomputing cumulative sums to answer sum queries in O(1) time instead of O(n).

3. **Find All Anagrams in a String (LeetCode #438):** Often uses frequency arrays or hash maps to precompute character counts for efficient sliding window updates.

The core idea: when you have multiple questions about the same data, invest in preprocessing to make each query faster.

## Key Takeaways

1. **Preprocessing is powerful for multiple queries:** When you need to answer many questions about the same data, do the work once upfront rather than repeating it for each query.

2. **Trade space for time:** Storing intermediate results (like occurrence indices) uses extra memory but dramatically reduces time complexity—a classic space-time tradeoff.

3. **Recognize query patterns:** If a problem involves "for each query, find..." and the data doesn't change between queries, preprocessing is likely the right approach.

[Practice this problem on CodeJeet](/problem/find-occurrences-of-an-element-in-an-array)
