---
title: "How to Solve The Number of Beautiful Subsets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The Number of Beautiful Subsets. Medium difficulty, 50.9% acceptance rate. Topics: Array, Hash Table, Math, Dynamic Programming, Backtracking."
date: "2026-12-25"
category: "dsa-patterns"
tags: ["the-number-of-beautiful-subsets", "array", "hash-table", "math", "medium"]
---

# How to Solve The Number of Beautiful Subsets

This problem asks us to count all non-empty subsets of an array where no two elements have an absolute difference equal to `k`. What makes this problem interesting is that we need to count subsets, not contiguous subarrays, which means we're dealing with combinations of elements that may not be adjacent in the array. The challenge is to efficiently count these subsets without generating all 2ⁿ possibilities.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [2, 4, 6]` with `k = 2`.

We need to find all non-empty subsets where no two numbers differ by exactly 2:

1. **Single-element subsets**: All are valid since they can't contain two numbers
   - `{2}`, `{4}`, `{6}` → 3 subsets

2. **Two-element subsets**:
   - `{2, 4}`: Difference = |2-4| = 2 → **INVALID**
   - `{2, 6}`: Difference = |2-6| = 4 → valid
   - `{4, 6}`: Difference = |4-6| = 2 → **INVALID**

3. **Three-element subset**:
   - `{2, 4, 6}`: Contains both (2,4) and (4,6) with difference 2 → **INVALID**

Total beautiful subsets: `{2}`, `{4}`, `{6}`, `{2,6}` → **4 subsets**

The key insight: Numbers that differ by multiples of `k` form "conflict groups." For `k=2`, 2, 4, and 6 conflict with each other. We can't include both 2 and 4, or 4 and 6, but we could include 2 and 6 since their difference is 4 (2k).

## Brute Force Approach

The most straightforward approach is to generate all 2ⁿ subsets, check each one for conflicts, and count the valid ones. For each subset:

1. Generate the subset (using bitmask or recursion)
2. Check all pairs in the subset for absolute difference equal to `k`
3. If no conflicts found, increment the count

**Why this fails**: With n up to 20, there are 2²⁰ ≈ 1 million subsets. Checking each subset takes O(m²) where m is the subset size, leading to O(2ⁿ × n²) worst-case time. This is too slow for the constraints.

Even worse: The problem doesn't specify an upper bound for n in the description, but typical test cases go beyond 20, making exponential approaches infeasible.

## Optimized Approach

The key insight is that **conflicts only occur between numbers that differ by k**. We can group numbers by their remainder modulo k, since:

- If `a % k == b % k`, then `|a - b|` is a multiple of k
- If `|a - b| = k`, then `a % k == b % k`

Actually, a better grouping: Numbers that conflict form chains where each number differs by k from its neighbors. For example, with `k=2`:

- 2 conflicts with 4, which conflicts with 6, which conflicts with 8, etc.

We can use a frequency map to count occurrences of each number, then process numbers in sorted order. For each number `x`, we have two cases:

1. **Don't take x**: Move to next number
2. **Take x**: Can't take `x+k`, but can take `x+2k`, etc.

This leads to a dynamic programming approach: For each "chain" of numbers differing by k, we can compute the number of valid subsets independently, then multiply results from different chains.

**Why this works**: Numbers from different chains (with differences not equal to k) don't conflict with each other. For example, with `nums = [2, 4, 7, 9]` and `k=2`:

- Chain 1: 2, 4 (conflict with each other)
- Chain 2: 7, 9 (conflict with each other)
- Subsets from chain 1 and chain 2 can be combined freely

## Optimal Solution

We'll use a frequency map and process numbers in sorted order. For each value, we consider whether to include it or not, but we must skip `value + k` if we include `value`. We can use a DP approach similar to the "house robber" problem on each chain.

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for DP = O(n log n)
# Space: O(n) for frequency map and sorted unique values
class Solution:
    def beautifulSubsets(self, nums: List[int], k: int) -> int:
        from collections import defaultdict

        # Count frequency of each number
        freq = defaultdict(int)
        for num in nums:
            freq[num] += 1

        # Get unique numbers and sort them
        unique_nums = sorted(freq.keys())
        n = len(unique_nums)

        # Group numbers by their remainder modulo k for independent processing
        # Actually, we need to group numbers that differ by k, which form chains
        # We'll process using DP on sorted numbers

        # DP arrays: skip[i] = ways ending at i without taking i, take[i] = ways taking i
        skip = [0] * n
        take = [0] * n

        # Initialize: for first element
        # Ways to skip it: 1 (empty subset, but we'll subtract at the end)
        # Ways to take it: 2^freq - 1 (all non-empty combinations of this number)
        skip[0] = 1
        take[0] = (1 << freq[unique_nums[0]]) - 1  # 2^count - 1

        # Process remaining numbers
        for i in range(1, n):
            current_num = unique_nums[i]
            current_count = freq[current_num]

            # If current number doesn't conflict with previous (diff != k)
            if current_num - unique_nums[i-1] != k:
                # We can either skip or take current number freely
                # skip[i] = (skip[i-1] + take[i-1]) * 1
                # take[i] = (skip[i-1] + take[i-1]) * (2^count - 1)
                total_prev = skip[i-1] + take[i-1]
                skip[i] = total_prev
                take[i] = total_prev * ((1 << current_count) - 1)
            else:
                # Current number conflicts with previous
                # If we skip current: can come from skip[i-1] or take[i-1]
                # If we take current: can only come from skip[i-1] (can't take both)
                skip[i] = skip[i-1] + take[i-1]
                take[i] = skip[i-1] * ((1 << current_count) - 1)

        # Total subsets = skip[n-1] + take[n-1] - 1 (subtract empty subset)
        return skip[n-1] + take[n-1] - 1
```

```javascript
// Time: O(n log n) for sorting + O(n) for DP = O(n log n)
// Space: O(n) for frequency map and sorted unique values
var beautifulSubsets = function (nums, k) {
  // Count frequency of each number
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Get unique numbers and sort them
  const uniqueNums = Array.from(freq.keys()).sort((a, b) => a - b);
  const n = uniqueNums.length;

  // DP arrays: skip[i] = ways ending at i without taking i, take[i] = ways taking i
  const skip = new Array(n).fill(0);
  const take = new Array(n).fill(0);

  // Initialize for first element
  // Ways to skip it: 1 (empty subset)
  // Ways to take it: 2^freq - 1 (all non-empty combinations of this number)
  skip[0] = 1;
  take[0] = Math.pow(2, freq.get(uniqueNums[0])) - 1;

  // Process remaining numbers
  for (let i = 1; i < n; i++) {
    const currentNum = uniqueNums[i];
    const currentCount = freq.get(currentNum);
    const waysToTakeCurrent = Math.pow(2, currentCount) - 1;

    // Check if current number conflicts with previous
    if (currentNum - uniqueNums[i - 1] !== k) {
      // No conflict: can freely combine with previous results
      const totalPrev = skip[i - 1] + take[i - 1];
      skip[i] = totalPrev;
      take[i] = totalPrev * waysToTakeCurrent;
    } else {
      // Conflict: if we take current, can't take previous
      skip[i] = skip[i - 1] + take[i - 1];
      take[i] = skip[i - 1] * waysToTakeCurrent;
    }
  }

  // Total subsets = skip[n-1] + take[n-1] - 1 (subtract empty subset)
  return skip[n - 1] + take[n - 1] - 1;
};
```

```java
// Time: O(n log n) for sorting + O(n) for DP = O(n log n)
// Space: O(n) for frequency map and sorted unique values
class Solution {
    public int beautifulSubsets(int[] nums, int k) {
        // Count frequency of each number
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Get unique numbers and sort them
        List<Integer> uniqueNums = new ArrayList<>(freq.keySet());
        Collections.sort(uniqueNums);
        int n = uniqueNums.size();

        // DP arrays: skip[i] = ways ending at i without taking i, take[i] = ways taking i
        int[] skip = new int[n];
        int[] take = new int[n];

        // Initialize for first element
        // Ways to skip it: 1 (empty subset)
        // Ways to take it: 2^freq - 1 (all non-empty combinations of this number)
        skip[0] = 1;
        take[0] = (1 << freq.get(uniqueNums.get(0))) - 1;

        // Process remaining numbers
        for (int i = 1; i < n; i++) {
            int currentNum = uniqueNums.get(i);
            int currentCount = freq.get(currentNum);
            int waysToTakeCurrent = (1 << currentCount) - 1;

            // Check if current number conflicts with previous
            if (currentNum - uniqueNums.get(i-1) != k) {
                // No conflict: can freely combine with previous results
                int totalPrev = skip[i-1] + take[i-1];
                skip[i] = totalPrev;
                take[i] = totalPrev * waysToTakeCurrent;
            } else {
                // Conflict: if we take current, can't take previous
                skip[i] = skip[i-1] + take[i-1];
                take[i] = skip[i-1] * waysToTakeCurrent;
            }
        }

        // Total subsets = skip[n-1] + take[n-1] - 1 (subtract empty subset)
        return skip[n-1] + take[n-1] - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log n)

- Building frequency map: O(n)
- Sorting unique numbers: O(m log m) where m ≤ n (number of distinct values)
- DP traversal: O(m)
- Overall: O(n + m log m) = O(n log n) in worst case

**Space Complexity**: O(n)

- Frequency map: O(m) where m ≤ n
- Arrays for unique numbers and DP: O(m)
- Overall: O(n)

The key optimization is that we process each "conflict chain" independently using DP, avoiding exponential subset generation.

## Common Mistakes

1. **Forgetting to handle duplicate numbers**: If `nums` contains duplicates like `[2, 2, 4]` with `k=2`, the subset `{2}` (using either 2) is valid, but `{2, 2}` is also valid since both 2's are equal (difference 0, not k). Many solutions incorrectly count this as invalid.

2. **Not subtracting the empty subset**: The problem asks for non-empty subsets, so we need to subtract 1 from our total count. The DP naturally includes the empty subset in the "skip all" case.

3. **Incorrect conflict checking**: Some candidates check `(currentNum - prevNum) % k == 0`, but this is wrong. We need exact difference of k, not multiples of k. For example, with `k=2`, numbers 2 and 6 have difference 4 (multiple of 2) but are allowed together.

4. **Missing the optimization with frequency**: For numbers with multiple occurrences, there are `2^count - 1` ways to include that number in non-empty ways. Forgetting this leads to undercounting.

## When You'll See This Pattern

This problem combines several important patterns:

1. **DP on subsets with constraints**: Similar to "House Robber" where you can't take adjacent elements. Here, the constraint is "can't take numbers differing by k."

2. **Grouping by equivalence classes**: Problems like "Divide Array in Sets of K Consecutive Numbers" or "Split Array into Consecutive Subsequences" use similar grouping techniques.

3. **Counting subsets with constraints**: "Count Number of Maximum Bitwise-OR Subsets" and "Target Sum" (counting subsets that sum to target) use similar DP approaches for subset counting.

Specifically, you'll see this pattern in problems where:

- You need to count subsets/combinations
- There are constraints between elements
- The constraint depends on pairwise relationships

## Key Takeaways

1. **When counting subsets with pairwise constraints**, look for independent groups. Elements that don't constrain each other can be processed separately, then results multiplied.

2. **Duplicate elements matter**: When an element appears multiple times, there are `2^count - 1` ways to include it in a non-empty way. Don't treat duplicates as a single element.

3. **Sorting helps identify conflicts**: By sorting numbers, adjacent elements in the sorted list that differ by k are in direct conflict, creating a chain structure perfect for DP.

4. **The empty subset is often a base case**: In subset counting problems, remember whether the empty set should be included or excluded in the final answer.

Related problems: [Construct the Lexicographically Largest Valid Sequence](/problem/construct-the-lexicographically-largest-valid-sequence)
