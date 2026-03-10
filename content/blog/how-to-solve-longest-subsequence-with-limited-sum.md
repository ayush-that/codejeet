---
title: "How to Solve Longest Subsequence With Limited Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Subsequence With Limited Sum. Easy difficulty, 73.4% acceptance rate. Topics: Array, Binary Search, Greedy, Sorting, Prefix Sum."
date: "2026-07-13"
category: "dsa-patterns"
tags: ["longest-subsequence-with-limited-sum", "array", "binary-search", "greedy", "easy"]
---

# How to Solve Longest Subsequence With Limited Sum

You're given an array of numbers and several budget constraints (queries). For each budget, you need to find the maximum number of elements you can select from the array such that their total sum doesn't exceed that budget. The tricky part is that you can pick elements in any order (it's a subsequence, not a subarray), which gives you flexibility to choose the smallest elements first to maximize your count.

What makes this problem interesting is the combination of greedy selection with efficient query processing. While the greedy approach is intuitive, implementing it efficiently for multiple queries requires careful preprocessing.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
nums = [4, 5, 2, 1]
queries = [3, 10, 21]
```

**Step 1: Sort the numbers**
Since we want to maximize the count of elements we can take within a budget, we should always pick the smallest elements first. Sorting gives us:

```
sorted_nums = [1, 2, 4, 5]
```

**Step 2: Build prefix sums**
Calculate the running total of the sorted array:

```
prefix_sums = [1, 3, 7, 12]
```

- Position 0: 1
- Position 1: 1 + 2 = 3
- Position 2: 3 + 4 = 7
- Position 3: 7 + 5 = 12

**Step 3: Answer each query using binary search**
For each query, we find how many prefix sums are ≤ the query value:

- **Query 3**: Find the rightmost position where prefix_sum ≤ 3
  - prefix_sums = [1, 3, 7, 12]
  - 3 is at position 1 → answer = 2 (indices 0 and 1, which is 2 elements)
- **Query 10**: Find the rightmost position where prefix_sum ≤ 10
  - 7 ≤ 10, 12 > 10 → position 2 → answer = 3 elements
- **Query 21**: Find the rightmost position where prefix_sum ≤ 21
  - All prefix sums ≤ 21 → position 3 → answer = 4 elements

**Final answer:** `[2, 3, 4]`

## Brute Force Approach

A naive approach would be to generate all possible subsequences for each query, calculate their sums, and find the longest one within budget. For each query, we'd need to check 2^n possible subsequences (where n is the length of nums).

**Why this fails:**

- Time complexity: O(m \* 2^n) where m is number of queries
- Even for modest n=20, that's over 1 million operations per query
- The problem constraints (n, m up to 1000) make this completely infeasible

Another naive approach might try to answer each query independently by sorting nums each time and greedily picking elements until the budget is exceeded. This would be O(m \* n log n), which is better but still inefficient for the upper bounds.

## Optimal Solution

The key insight is that we can preprocess the array once and then answer all queries efficiently. By sorting the array and computing prefix sums, we transform the problem into finding the rightmost prefix sum ≤ each query. This can be done with binary search for O(log n) per query.

<div class="code-group">

```python
# Time: O(n log n + m log n) | Space: O(n)
def answerQueries(nums, queries):
    """
    Returns an array where answer[i] is the maximum size of a subsequence
    from nums whose sum ≤ queries[i].

    Approach:
    1. Sort nums to always pick smallest elements first (greedy)
    2. Compute prefix sums of sorted array
    3. For each query, binary search to find how many prefix sums ≤ query
    """
    # Step 1: Sort the array - O(n log n)
    # We sort because to maximize count with limited sum,
    # we should always pick the smallest elements first
    nums.sort()

    # Step 2: Compute prefix sums - O(n)
    # prefix[i] = sum of first i+1 smallest elements
    prefix_sums = []
    current_sum = 0
    for num in nums:
        current_sum += num
        prefix_sums.append(current_sum)

    # Step 3: Answer each query using binary search - O(m log n)
    answer = []
    for query in queries:
        # Binary search to find rightmost index where prefix_sum ≤ query
        left, right = 0, len(prefix_sums) - 1
        result = -1  # Will store the index of last valid prefix sum

        while left <= right:
            mid = left + (right - left) // 2  # Avoid overflow, though not needed in Python

            if prefix_sums[mid] <= query:
                # This prefix sum is valid, try to find a larger one
                result = mid
                left = mid + 1
            else:
                # Prefix sum too large, look left
                right = mid - 1

        # result is the index of last valid prefix sum
        # Number of elements = index + 1 (or 0 if no valid prefix sum)
        answer.append(result + 1 if result != -1 else 0)

    return answer
```

```javascript
// Time: O(n log n + m log n) | Space: O(n)
function answerQueries(nums, queries) {
  /**
   * Returns an array where answer[i] is the maximum size of a subsequence
   * from nums whose sum ≤ queries[i].
   *
   * Approach:
   * 1. Sort nums to always pick smallest elements first (greedy)
   * 2. Compute prefix sums of sorted array
   * 3. For each query, binary search to find how many prefix sums ≤ query
   */

  // Step 1: Sort the array - O(n log n)
  // We sort because to maximize count with limited sum,
  // we should always pick the smallest elements first
  nums.sort((a, b) => a - b);

  // Step 2: Compute prefix sums - O(n)
  // prefix[i] = sum of first i+1 smallest elements
  const prefixSums = [];
  let currentSum = 0;
  for (const num of nums) {
    currentSum += num;
    prefixSums.push(currentSum);
  }

  // Step 3: Answer each query using binary search - O(m log n)
  const answer = [];
  for (const query of queries) {
    // Binary search to find rightmost index where prefixSum ≤ query
    let left = 0;
    let right = prefixSums.length - 1;
    let result = -1; // Will store the index of last valid prefix sum

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (prefixSums[mid] <= query) {
        // This prefix sum is valid, try to find a larger one
        result = mid;
        left = mid + 1;
      } else {
        // Prefix sum too large, look left
        right = mid - 1;
      }
    }

    // result is the index of last valid prefix sum
    // Number of elements = index + 1 (or 0 if no valid prefix sum)
    answer.push(result !== -1 ? result + 1 : 0);
  }

  return answer;
}
```

```java
// Time: O(n log n + m log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int[] answerQueries(int[] nums, int[] queries) {
        /**
         * Returns an array where answer[i] is the maximum size of a subsequence
         * from nums whose sum ≤ queries[i].
         *
         * Approach:
         * 1. Sort nums to always pick smallest elements first (greedy)
         * 2. Compute prefix sums of sorted array
         * 3. For each query, binary search to find how many prefix sums ≤ query
         */

        // Step 1: Sort the array - O(n log n)
        // We sort because to maximize count with limited sum,
        // we should always pick the smallest elements first
        Arrays.sort(nums);

        // Step 2: Compute prefix sums - O(n)
        // prefix[i] = sum of first i+1 smallest elements
        int[] prefixSums = new int[nums.length];
        int currentSum = 0;
        for (int i = 0; i < nums.length; i++) {
            currentSum += nums[i];
            prefixSums[i] = currentSum;
        }

        // Step 3: Answer each query using binary search - O(m log n)
        int[] answer = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int query = queries[i];

            // Binary search to find rightmost index where prefixSum ≤ query
            int left = 0;
            int right = prefixSums.length - 1;
            int result = -1;  // Will store the index of last valid prefix sum

            while (left <= right) {
                int mid = left + (right - left) / 2;  // Avoid overflow

                if (prefixSums[mid] <= query) {
                    // This prefix sum is valid, try to find a larger one
                    result = mid;
                    left = mid + 1;
                } else {
                    // Prefix sum too large, look left
                    right = mid - 1;
                }
            }

            // result is the index of last valid prefix sum
            // Number of elements = index + 1 (or 0 if no valid prefix sum)
            answer[i] = result != -1 ? result + 1 : 0;
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + m log n)**

- Sorting the array: O(n log n)
- Building prefix sums: O(n)
- For each of m queries, binary search on n elements: O(m log n)
- Dominated by O(n log n + m log n)

**Space Complexity: O(n)**

- Storing the prefix sums array: O(n)
- Output array: O(m), but this is required by the problem
- Additional space: O(1) beyond input/output (excluding the prefix sums)

The sorting step is crucial because it enables the greedy approach of always picking the smallest available elements. The prefix sums allow us to quickly determine the sum of any prefix of the sorted array. Binary search lets us efficiently find the maximum prefix that fits within each query budget.

## Common Mistakes

1. **Forgetting to sort the array**: This is the most common mistake. Without sorting, you can't use the greedy approach of picking smallest elements first. Always remember: to maximize count with limited sum, sort first.

2. **Off-by-one errors in binary search**: When finding the rightmost valid prefix sum, candidates often:
   - Return `mid` instead of `result` (which tracks the last valid position)
   - Forget to handle the case where no prefix sum fits (result = -1)
   - Use `while (left < right)` instead of `while (left <= right)` for finding rightmost position

3. **Using linear search instead of binary search**: Some candidates iterate through prefix sums for each query, resulting in O(m \* n) time. With n, m up to 1000, this is 1,000,000 operations vs. ~10,000 with binary search.

4. **Not handling empty array or zero queries**: Always consider edge cases:
   - If nums is empty, all answers should be 0
   - If queries is empty, return empty array
   - If all elements are larger than query, answer should be 0

## When You'll See This Pattern

This problem combines three fundamental patterns that appear frequently in coding interviews:

1. **Greedy + Sorting**: When you need to maximize/minimize count with constraints, sorting often enables a greedy solution. Similar problems:
   - [Maximum Units on a Truck](https://leetcode.com/problems/maximum-units-on-a-truck/) - Sort by units per box to maximize total units
   - [Assign Cookies](https://leetcode.com/problems/assign-cookies/) - Sort both arrays to maximize satisfied children

2. **Prefix Sum + Binary Search**: When you need to answer range sum queries or find boundaries in cumulative sums:
   - [Successful Pairs of Spells and Potions](https://leetcode.com/problems/successful-pairs-of-spells-and-potions/) - Sort potions, use prefix-like thinking with binary search
   - [How Many Numbers Are Smaller Than the Current Number](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/) - Sort and use binary search to count smaller elements

3. **Query Optimization with Preprocessing**: When you have multiple queries on the same data, preprocess once to answer all queries efficiently:
   - [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) - Precompute prefix sums
   - [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) - Precompute prefix and suffix products

## Key Takeaways

1. **When maximizing count with sum constraint, sort first**: This greedy insight—pick the smallest elements first—is counterintuitive to some but essential for problems like this. The sorted order ensures you can take as many elements as possible before exceeding the budget.

2. **Prefix sums transform range queries into point lookups**: Instead of summing elements repeatedly, compute cumulative sums once. Then answering "sum of first k elements" becomes O(1) instead of O(k).

3. **Binary search finds boundaries in sorted data**: When you have a sorted array and need to find the last position where a condition holds (like sum ≤ budget), binary search is your tool. Remember the pattern: track `result` when condition is met, move `left` to search right, move `right` to search left.

This problem beautifully demonstrates how combining simple concepts (sorting, prefix sums, binary search) creates an efficient solution to what seems like a complex multi-query problem.

Related problems: [How Many Numbers Are Smaller Than the Current Number](/problem/how-many-numbers-are-smaller-than-the-current-number), [Successful Pairs of Spells and Potions](/problem/successful-pairs-of-spells-and-potions)
