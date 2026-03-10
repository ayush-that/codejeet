---
title: "How to Solve Non-decreasing Subsequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Non-decreasing Subsequences. Medium difficulty, 62.5% acceptance rate. Topics: Array, Hash Table, Backtracking, Bit Manipulation."
date: "2028-09-10"
category: "dsa-patterns"
tags: ["non-decreasing-subsequences", "array", "hash-table", "backtracking", "medium"]
---

# How to Solve Non-decreasing Subsequences

This problem asks us to find all distinct non-decreasing subsequences of length at least 2 from an integer array. What makes this tricky is that we need to generate all possible subsequences (which grows exponentially) while avoiding duplicates and ensuring each subsequence is non-decreasing. The challenge lies in efficiently exploring the search space without generating duplicate subsequences.

## Visual Walkthrough

Let's trace through `nums = [4, 6, 7, 7]` step by step:

We need to find all subsequences where:

1. Elements are in the same order as in `nums` (subsequence property)
2. Each element is ≥ the previous one (non-decreasing)
3. Length is at least 2
4. No duplicate subsequences in the output

**Step-by-step exploration:**

- Start with empty subsequence `[]`
- Consider index 0 (value 4):
  - Add 4: `[4]`
  - From `[4]`, consider index 1 (value 6): 6 ≥ 4, so add: `[4,6]` ✓ (valid, length ≥ 2)
  - From `[4,6]`, consider index 2 (value 7): 7 ≥ 6, so add: `[4,6,7]` ✓
  - From `[4,6,7]`, consider index 3 (value 7): 7 ≥ 7, so add: `[4,6,7,7]` ✓
  - Also from `[4]`, consider index 2 (value 7): 7 ≥ 4, so add: `[4,7]` ✓
  - From `[4,7]`, consider index 3 (value 7): 7 ≥ 7, so add: `[4,7,7]` ✓
  - Also from `[4]`, consider index 3 (value 7): 7 ≥ 4, so add: `[4,7]` (duplicate!)

- Consider index 1 (value 6):
  - Add 6: `[6]`
  - From `[6]`, consider index 2 (value 7): 7 ≥ 6, so add: `[6,7]` ✓
  - From `[6,7]`, consider index 3 (value 7): 7 ≥ 7, so add: `[6,7,7]` ✓
  - Also from `[6]`, consider index 3 (value 7): 7 ≥ 6, so add: `[6,7]` (duplicate!)

- Consider index 2 (value 7):
  - Add 7: `[7]`
  - From `[7]`, consider index 3 (value 7): 7 ≥ 7, so add: `[7,7]` ✓

- Consider index 3 (value 7):
  - Can't form subsequence of length ≥ 2 starting here

**Final result:** `[[4,6], [4,6,7], [4,6,7,7], [4,7], [4,7,7], [6,7], [6,7,7], [7,7]]`

The key insight: We need to avoid duplicates by ensuring at each position, we don't add the same value multiple times to the same subsequence state.

## Brute Force Approach

A naive approach would be to generate all possible subsequences (2^n possibilities), filter for those that are non-decreasing and have length ≥ 2, then remove duplicates. Here's what that might look like:

1. Generate all subsets using bit manipulation or recursion
2. For each subset, check if it's non-decreasing
3. If valid and length ≥ 2, add to result
4. Remove duplicates from result

**Why this fails:**

- Time complexity is O(2^n × n) for generation and validation
- With n up to 15, 2^15 = 32,768 subsets is manageable, but the problem's constraints allow n up to 20 (1,048,576 subsets)
- More importantly, we generate many invalid sequences and then filter them out
- We also generate duplicates that need to be removed separately

The brute force is inefficient because it doesn't prune invalid paths early and generates duplicates that require additional processing.

## Optimized Approach

The key insight is to use **backtracking with pruning**:

1. Build subsequences incrementally
2. At each step, only consider elements that maintain the non-decreasing property
3. Use a set at each recursion level to avoid adding the same value multiple times
4. Add valid subsequences to the result when they reach length ≥ 2

**Why this works:**

- **Backtracking** lets us explore all possibilities systematically
- **Pruning** eliminates invalid paths early (if current element < last element in subsequence, skip)
- **Level-based duplicate prevention** ensures we don't add the same value multiple times at the same position in the recursion tree
- **Early collection** adds valid subsequences as soon as they meet the length requirement

**Step-by-step reasoning:**

1. Start with an empty subsequence and index 0
2. For each position from current index to end:
   - If the element is less than the last element in our subsequence, skip (not non-decreasing)
   - If we've already used this value at the current recursion level, skip (prevents duplicates)
   - Add the element to the subsequence
   - If subsequence length ≥ 2, add to results
   - Recursively explore from the next index
   - Remove the element (backtrack)
3. Use a set to track used values at each recursion level

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^n * n) - In worst case, we explore all subsequences and copy them to result
# Space: O(n) - Recursion depth is n, current subsequence storage is n
class Solution:
    def findSubsequences(self, nums: List[int]) -> List[List[int]]:
        def backtrack(start: int, current: List[int]):
            # If we have at least 2 elements, add to results
            if len(current) >= 2:
                # Create a copy since we'll be modifying current
                result.append(current.copy())

            # Track used numbers at this recursion level to avoid duplicates
            used = set()

            # Try adding each possible next element
            for i in range(start, len(nums)):
                # Skip if current element would break non-decreasing order
                if current and nums[i] < current[-1]:
                    continue

                # Skip if we've already used this value at this level
                # This prevents duplicate subsequences like [4,7] from different 7's
                if nums[i] in used:
                    continue

                # Mark this value as used at current level
                used.add(nums[i])

                # Add current element to subsequence
                current.append(nums[i])

                # Recursively explore with next starting index
                backtrack(i + 1, current)

                # Backtrack: remove last element to try other possibilities
                current.pop()

        result = []
        backtrack(0, [])
        return result
```

```javascript
// Time: O(2^n * n) - In worst case, we explore all subsequences and copy them to result
// Space: O(n) - Recursion depth is n, current subsequence storage is n
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var findSubsequences = function (nums) {
  const result = [];

  // Helper function for backtracking
  const backtrack = (start, current) => {
    // If we have at least 2 elements, add to results
    if (current.length >= 2) {
      // Create a copy since we'll be modifying current
      result.push([...current]);
    }

    // Track used numbers at this recursion level to avoid duplicates
    const used = new Set();

    // Try adding each possible next element
    for (let i = start; i < nums.length; i++) {
      // Skip if current element would break non-decreasing order
      if (current.length > 0 && nums[i] < current[current.length - 1]) {
        continue;
      }

      // Skip if we've already used this value at this level
      // This prevents duplicate subsequences like [4,7] from different 7's
      if (used.has(nums[i])) {
        continue;
      }

      // Mark this value as used at current level
      used.add(nums[i]);

      // Add current element to subsequence
      current.push(nums[i]);

      // Recursively explore with next starting index
      backtrack(i + 1, current);

      // Backtrack: remove last element to try other possibilities
      current.pop();
    }
  };

  backtrack(0, []);
  return result;
};
```

```java
// Time: O(2^n * n) - In worst case, we explore all subsequences and copy them to result
// Space: O(n) - Recursion depth is n, current subsequence storage is n
class Solution {
    public List<List<Integer>> findSubsequences(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        // If we have at least 2 elements, add to results
        if (current.size() >= 2) {
            // Create a copy since we'll be modifying current
            result.add(new ArrayList<>(current));
        }

        // Track used numbers at this recursion level to avoid duplicates
        Set<Integer> used = new HashSet<>();

        // Try adding each possible next element
        for (int i = start; i < nums.length; i++) {
            // Skip if current element would break non-decreasing order
            if (!current.isEmpty() && nums[i] < current.get(current.size() - 1)) {
                continue;
            }

            // Skip if we've already used this value at this level
            // This prevents duplicate subsequences like [4,7] from different 7's
            if (used.contains(nums[i])) {
                continue;
            }

            // Mark this value as used at current level
            used.add(nums[i]);

            // Add current element to subsequence
            current.add(nums[i]);

            // Recursively explore with next starting index
            backtrack(nums, i + 1, current, result);

            // Backtrack: remove last element to try other possibilities
            current.remove(current.size() - 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2^n × n)

- In the worst case (strictly increasing array), we generate all 2^n subsequences
- For each valid subsequence, we copy it to the result (O(n) operation)
- The pruning helps in practice, but the upper bound is exponential

**Space Complexity:** O(n)

- The recursion depth is at most n (when we include all elements)
- The `current` list stores at most n elements
- The `used` set at each level stores at most n elements, but these are cleared between recursive calls
- The result storage is not counted in auxiliary space complexity

## Common Mistakes

1. **Forgetting to prevent duplicates at the recursion level**: Candidates often use a global set to track used values, which incorrectly prevents valid subsequences like `[4,7,7]`. The key is to track used values _per recursion level_, not globally.

2. **Not maintaining the subsequence order**: Remember that subsequences must maintain the original array order. Don't sort the array or elements when building subsequences.

3. **Incorrect backtracking**: Forgetting to remove the last element after recursion (`current.pop()`) leads to incorrect subsequences accumulating elements.

4. **Missing the length ≥ 2 requirement**: Some candidates return all subsequences including single elements or empty sequences. Always check `len(current) >= 2` before adding to results.

5. **Shallow copying issues**: Adding `current` directly to results without creating a copy (`result.append(current.copy())`) means all entries in result will reference the same list, which gets modified during backtracking.

## When You'll See This Pattern

This pattern of **backtracking with pruning and duplicate prevention** appears in several combinatorial problems:

1. **Subsets II (LeetCode 90)**: Find all possible subsets with duplicates in the input array. Similar duplicate prevention technique using sorting and skipping duplicates.

2. **Combination Sum II (LeetCode 40)**: Find all unique combinations where candidate numbers sum to target, with each number used once. Uses similar level-based duplicate skipping.

3. **Permutations II (LeetCode 47)**: Find all unique permutations of a collection of numbers that might contain duplicates. Uses visited array and sorting to prevent duplicates.

The core pattern is: when you need to generate combinations/permutations/subsequences from an array with duplicates, use backtracking with a mechanism to skip duplicate values at each decision point.

## Key Takeaways

1. **Backtracking with pruning** is powerful for generating all valid combinations while avoiding invalid paths early. Always consider what conditions let you prune the search space.

2. **Level-based duplicate prevention** is crucial when the input contains duplicates. Use a set at each recursion level to track which values have been used at that position in the decision tree.

3. **Subsequence problems** often require maintaining original order while selecting elements. This differs from subset problems where order doesn't matter.

4. **Always copy before adding to results** in backtracking solutions to avoid reference issues when the current path gets modified.

Related problems: [Maximum Length of Pair Chain](/problem/maximum-length-of-pair-chain)
