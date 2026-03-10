---
title: "How to Solve Combination Sum II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Combination Sum II. Medium difficulty, 59.0% acceptance rate. Topics: Array, Backtracking."
date: "2026-06-27"
category: "dsa-patterns"
tags: ["combination-sum-ii", "array", "backtracking", "medium"]
---

# How to Solve Combination Sum II

This problem asks us to find all unique combinations of numbers from a given array that sum to a target value, where each number can only be used once per combination. The twist that makes this problem interesting is that the input array may contain duplicate numbers, but the output combinations must be unique. This requires careful handling to avoid generating duplicate combinations while still exploring all valid possibilities.

## Visual Walkthrough

Let's trace through a concrete example: `candidates = [2,5,2,1,2]` and `target = 5`.

We'll sort the array first to help with duplicate handling: `[1,2,2,2,5]`.

**Step 1:** Start with an empty combination `[]` and sum `0`.

**Step 2:** Consider adding `1` → combination `[1]`, sum `1`. Since `1 < 5`, we continue.

**Step 3:** From `[1]`, consider adding the first `2` → `[1,2]`, sum `3`. Continue.

**Step 4:** From `[1,2]`, consider adding the second `2` → `[1,2,2]`, sum `5`. This equals target! Add `[1,2,2]` to results.

**Step 5:** Backtrack. From `[1,2]`, consider adding the third `2` → but wait! This would give us `[1,2,2]` again, which is a duplicate. We need to skip duplicates when we're at the same decision level.

**Step 6:** From `[1,2]`, consider adding `5` → `[1,2,5]`, sum `8`. Too large, stop exploring this path.

**Step 7:** Backtrack to `[1]`. Consider adding the second `2` → but we're at the same decision level as step 3, and this `2` equals the previous `2`, so skip to avoid duplicate `[1,2]` combinations.

**Step 8:** Continue this process. We'll also find `[5]` as a valid combination.

Final unique combinations: `[[1,2,2], [5]]`.

The key insight: when we skip an element at the same decision level (not when we're going deeper in recursion), we must skip all subsequent duplicates to avoid generating the same combination multiple times.

## Brute Force Approach

A naive approach would be to generate all possible subsets of the candidates, filter those that sum to the target, and then remove duplicates. This involves:

1. Generating all 2^n subsets (where n is the length of candidates)
2. For each subset, checking if its sum equals target
3. Removing duplicate combinations from the results

The problem with this approach is its exponential time complexity O(2^n \* n) for generating and checking subsets, plus additional overhead for duplicate removal. With n up to 100, this becomes computationally infeasible (2^100 is an astronomically large number).

Additionally, the duplicate removal step would require storing all valid combinations and comparing them, which uses significant memory. The brute force approach doesn't leverage the sorted nature of the problem or the ability to prune invalid paths early.

## Optimized Approach

The optimal solution uses **backtracking with pruning**:

1. **Sort the array** - This groups duplicates together, making them easier to skip
2. **Use depth-first search (DFS)** - Explore combinations recursively
3. **Prune invalid paths** - Stop exploring when the current sum exceeds target
4. **Skip duplicates at the same level** - When we're making a decision at a particular position in the recursion tree, skip any element that's the same as the previous element (unless we're including it as part of the same combination)

The key insight is that duplicates should only be skipped when we're at the same decision level in the recursion tree. When we're going deeper (including multiple copies of the same number in one combination), we should allow duplicates. But when we're making a new decision at the same level, duplicates would lead to identical combinations.

For example, with `[1,2,2,2,5]`:

- We can include `[1,2,2]` (going deeper, using two 2's)
- But we shouldn't generate `[1,2]` three different ways (skipping at the same level)

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^n) - In worst case, we explore all subsets
# Space: O(n) - For the recursion call stack and current combination
def combinationSum2(candidates, target):
    """
    Find all unique combinations where candidate numbers sum to target.
    Each number may only be used once per combination.
    """
    # Step 1: Sort the candidates to group duplicates together
    candidates.sort()

    # Step 2: Initialize results list and start backtracking
    results = []

    def backtrack(start, current_combination, current_sum):
        """
        Recursive backtracking function.

        Args:
            start: Index to start considering candidates from (avoids reusing same elements)
            current_combination: List of numbers in current combination
            current_sum: Sum of numbers in current combination
        """
        # Base case 1: Found a valid combination
        if current_sum == target:
            # Add a copy of the current combination to results
            results.append(current_combination.copy())
            return

        # Base case 2: Sum exceeds target, stop exploring this path
        if current_sum > target:
            return

        # Explore all candidates starting from 'start' index
        for i in range(start, len(candidates)):
            # Skip duplicates at the same decision level
            # i > start means we're making a new decision at this level,
            # not including another copy in the same combination
            if i > start and candidates[i] == candidates[i-1]:
                continue

            # Step 3: Include candidates[i] in current combination
            current_combination.append(candidates[i])

            # Step 4: Recurse with i+1 (not i) since each number can be used only once
            backtrack(i + 1, current_combination, current_sum + candidates[i])

            # Step 5: Backtrack - remove last element to try other possibilities
            current_combination.pop()

    # Start backtracking from index 0 with empty combination and sum 0
    backtrack(0, [], 0)

    return results
```

```javascript
// Time: O(2^n) - In worst case, we explore all subsets
// Space: O(n) - For the recursion call stack and current combination
function combinationSum2(candidates, target) {
  /**
   * Find all unique combinations where candidate numbers sum to target.
   * Each number may only be used once per combination.
   */

  // Step 1: Sort the candidates to group duplicates together
  candidates.sort((a, b) => a - b);

  // Step 2: Initialize results array and start backtracking
  const results = [];

  function backtrack(start, currentCombination, currentSum) {
    /**
     * Recursive backtracking function.
     *
     * @param {number} start - Index to start considering candidates from
     * @param {number[]} currentCombination - Numbers in current combination
     * @param {number} currentSum - Sum of numbers in current combination
     */

    // Base case 1: Found a valid combination
    if (currentSum === target) {
      // Add a copy of the current combination to results
      results.push([...currentCombination]);
      return;
    }

    // Base case 2: Sum exceeds target, stop exploring this path
    if (currentSum > target) {
      return;
    }

    // Explore all candidates starting from 'start' index
    for (let i = start; i < candidates.length; i++) {
      // Skip duplicates at the same decision level
      // i > start means we're making a new decision at this level,
      // not including another copy in the same combination
      if (i > start && candidates[i] === candidates[i - 1]) {
        continue;
      }

      // Step 3: Include candidates[i] in current combination
      currentCombination.push(candidates[i]);

      // Step 4: Recurse with i+1 (not i) since each number can be used only once
      backtrack(i + 1, currentCombination, currentSum + candidates[i]);

      // Step 5: Backtrack - remove last element to try other possibilities
      currentCombination.pop();
    }
  }

  // Start backtracking from index 0 with empty combination and sum 0
  backtrack(0, [], 0);

  return results;
}
```

```java
// Time: O(2^n) - In worst case, we explore all subsets
// Space: O(n) - For the recursion call stack and current combination
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        /**
         * Find all unique combinations where candidate numbers sum to target.
         * Each number may only be used once per combination.
         */

        // Step 1: Sort the candidates to group duplicates together
        Arrays.sort(candidates);

        // Step 2: Initialize results list and start backtracking
        List<List<Integer>> results = new ArrayList<>();

        backtrack(candidates, target, 0, new ArrayList<>(), 0, results);

        return results;
    }

    private void backtrack(int[] candidates, int target, int start,
                          List<Integer> currentCombination, int currentSum,
                          List<List<Integer>> results) {
        /**
         * Recursive backtracking function.
         *
         * @param candidates: Input array of numbers
         * @param target: Target sum to achieve
         * @param start: Index to start considering candidates from
         * @param currentCombination: Numbers in current combination
         * @param currentSum: Sum of numbers in current combination
         * @param results: List to store valid combinations
         */

        // Base case 1: Found a valid combination
        if (currentSum == target) {
            // Add a copy of the current combination to results
            results.add(new ArrayList<>(currentCombination));
            return;
        }

        // Base case 2: Sum exceeds target, stop exploring this path
        if (currentSum > target) {
            return;
        }

        // Explore all candidates starting from 'start' index
        for (int i = start; i < candidates.length; i++) {
            // Skip duplicates at the same decision level
            // i > start means we're making a new decision at this level,
            // not including another copy in the same combination
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }

            // Step 3: Include candidates[i] in current combination
            currentCombination.add(candidates[i]);

            // Step 4: Recurse with i+1 (not i) since each number can be used only once
            backtrack(candidates, target, i + 1, currentCombination,
                     currentSum + candidates[i], results);

            // Step 5: Backtrack - remove last element to try other possibilities
            currentCombination.remove(currentCombination.size() - 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2^n) in the worst case, where n is the number of candidates. This represents exploring all possible subsets. However, in practice, pruning (stopping when sum exceeds target) and skipping duplicates make it faster than the true 2^n. The sorting step adds O(n log n), but this is dominated by the exponential term.

**Space Complexity:** O(n) for the recursion call stack (which can go n levels deep in worst case) and the current combination list. The output storage is not counted in auxiliary space complexity, but if we did count it, storing all combinations could take up to O(2^n) space in the worst case.

## Common Mistakes

1. **Forgetting to sort the array first**: Without sorting, the duplicate skipping logic (`if i > start and candidates[i] == candidates[i-1]`) won't work correctly because duplicates won't be adjacent.

2. **Incorrect duplicate skipping logic**: The most common error is using `if i > 0 and candidates[i] == candidates[i-1]` instead of `if i > start and candidates[i] == candidates[i-1]`. The former skips duplicates even when going deeper in recursion, which would prevent valid combinations like `[1,2,2]`.

3. **Using `i` instead of `i+1` in recursion**: Since each number can only be used once, we must pass `i+1` to the next recursion level, not `i`. Using `i` would allow reusing the same element multiple times.

4. **Not making a copy of the current combination**: When adding a valid combination to results, you must add a copy (`list.copy()` in Python, `new ArrayList<>(current)` in Java, `[...current]` in JS). Otherwise, you're adding a reference that will continue to be modified during backtracking.

## When You'll See This Pattern

This backtracking-with-duplicate-skipping pattern appears in several combination/subset problems:

1. **Subsets II (LeetCode 90)**: Find all possible subsets of an array with duplicates. The duplicate handling logic is identical.

2. **Permutations II (LeetCode 47)**: Find all unique permutations of an array with duplicates. Uses similar duplicate skipping but with additional visited tracking.

3. **Palindrome Partitioning (LeetCode 131)**: Partition a string into palindrome substrings. Uses backtracking with a different validation condition.

The core pattern is: when you need to generate combinations/permutations/subsets from an array with duplicates, sort first, then skip duplicates at the same decision level in your backtracking.

## Key Takeaways

1. **Sorting enables efficient duplicate handling**: When dealing with duplicate elements in combination problems, always sort the input first. This groups duplicates together, allowing you to skip them with a simple equality check.

2. **Understand the difference between "same level" and "going deeper"**: Duplicates should be skipped when making a new decision at the same recursion level (`i > start`), but allowed when including multiple copies in the same combination (going deeper in recursion).

3. **Backtracking template for combination problems**: This problem follows a standard backtracking pattern: choose, explore, unchoose. Memorize this pattern as it applies to many similar problems.

Related problems: [Combination Sum](/problem/combination-sum)
