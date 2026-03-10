---
title: "How to Solve Permutations II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Permutations II. Medium difficulty, 63.0% acceptance rate. Topics: Array, Backtracking, Sorting."
date: "2026-08-25"
category: "dsa-patterns"
tags: ["permutations-ii", "array", "backtracking", "sorting", "medium"]
---

# How to Solve Permutations II

The problem asks us to generate all unique permutations of a collection of numbers that may contain duplicates. This is tricky because duplicates can lead to identical permutations, and we must avoid returning duplicates in our output. The challenge is to efficiently generate only the unique permutations without needing to filter duplicates afterward.

## Visual Walkthrough

Let's trace through the example `nums = [1, 1, 2]` to build intuition.

If we simply generated all permutations without considering duplicates, we'd get:

1. [1, 1, 2]
2. [1, 2, 1]
3. [1, 1, 2] ← Duplicate of #1!
4. [1, 2, 1] ← Duplicate of #2!
5. [2, 1, 1]
6. [2, 1, 1] ← Duplicate of #5!

We need a way to avoid generating these duplicates in the first place. The key insight is to sort the array first, then during backtracking, skip duplicate elements when they would create identical permutations.

Here's how the optimal approach works with `[1, 1, 2]`:

1. Sort the array: `[1, 1, 2]`
2. Start backtracking with an empty permutation `[]`
3. At the first level, we consider each element:
   - Pick first `1`: Remaining `[1, 2]`
   - Pick second `1`: Skip! Why? Because it's equal to the previous element (`1`) and the previous element wasn't used in this branch (we have a `used` array to track this)
   - Pick `2`: Remaining `[1, 1]`
4. Continue recursively, applying the same rule at each level

This ensures we only generate: `[1, 1, 2]`, `[1, 2, 1]`, and `[2, 1, 1]`.

## Brute Force Approach

A naive approach would be to generate all permutations (including duplicates) and then filter out duplicates using a set. This works but is highly inefficient.

**Why it's insufficient:**

- Generating all permutations of an array with duplicates creates many identical permutations
- The time complexity is O(n! × n) for generation plus additional overhead for duplicate removal
- For an array with many duplicates, we waste enormous time generating and storing identical permutations
- The space complexity is also high because we store all permutations (including duplicates) before filtering

The brute force approach fails on larger inputs because n! grows extremely fast. Even for n=10, 10! = 3,628,800 permutations. With duplicates, we might generate many times more than needed.

## Optimized Approach

The key insight is that we can avoid generating duplicates by carefully controlling which elements we choose at each step during backtracking. Here's the step-by-step reasoning:

1. **Sort the array first** - This groups identical elements together, making it easy to identify duplicates.

2. **Use backtracking with pruning** - As we build permutations recursively, we track which elements have been used.

3. **Skip duplicates intelligently** - When we encounter a duplicate element (nums[i] == nums[i-1]), we only include it if the previous identical element was used in the current permutation path. If the previous identical element wasn't used, that means we're at a branching point where choosing the current duplicate would create the same permutation as choosing the previous duplicate earlier.

4. **Why this works** - Consider `[1, 1, 2]`. When we're at the first level of recursion and have two `1`s available:
   - We pick the first `1` and continue
   - When we consider the second `1`, we check: is it equal to the previous element? Yes. Was the previous element used? No (because we're in a different branch now). So we skip it.

   This ensures that at any position in the permutation, we only use the first occurrence of each duplicate value when multiple identical values are available.

This approach generates each unique permutation exactly once, with no filtering needed afterward.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * n!) - We generate n! permutations and each takes O(n) time to build
# Space: O(n) - For the recursion stack and used array (excluding output space)
def permuteUnique(nums):
    """
    Generate all unique permutations of an array that may contain duplicates.

    Args:
        nums: List of integers that may contain duplicates

    Returns:
        List of lists containing all unique permutations
    """
    # Sort the array to group duplicates together
    nums.sort()

    result = []
    used = [False] * len(nums)  # Track which elements are in the current permutation

    def backtrack(current_perm):
        """
        Recursive backtracking function to build permutations.

        Args:
            current_perm: The permutation being built
        """
        # Base case: if permutation is complete, add to result
        if len(current_perm) == len(nums):
            result.append(current_perm[:])  # Make a copy since we'll modify it
            return

        # Try each element that hasn't been used yet
        for i in range(len(nums)):
            # Skip if element is already in current permutation
            if used[i]:
                continue

            # Skip duplicates: if current element equals previous AND
            # previous wasn't used in this path, skip to avoid duplicate permutations
            # The key insight: when nums[i] == nums[i-1] and not used[i-1],
            # using nums[i] would create the same permutation as using nums[i-1]
            # at an earlier point in the recursion
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue

            # Choose nums[i] for current position
            used[i] = True
            current_perm.append(nums[i])

            # Recurse to build the rest of the permutation
            backtrack(current_perm)

            # Backtrack: remove nums[i] from permutation for next iteration
            current_perm.pop()
            used[i] = False

    # Start backtracking with empty permutation
    backtrack([])
    return result
```

```javascript
// Time: O(n * n!) - We generate n! permutations and each takes O(n) time to build
// Space: O(n) - For the recursion stack and used array (excluding output space)
function permuteUnique(nums) {
  /**
   * Generate all unique permutations of an array that may contain duplicates.
   *
   * @param {number[]} nums - Array of integers that may contain duplicates
   * @return {number[][]} - All unique permutations
   */

  // Sort the array to group duplicates together
  nums.sort((a, b) => a - b);

  const result = [];
  const used = new Array(nums.length).fill(false); // Track used elements

  /**
   * Recursive backtracking function to build permutations.
   *
   * @param {number[]} currentPerm - The permutation being built
   */
  function backtrack(currentPerm) {
    // Base case: if permutation is complete, add to result
    if (currentPerm.length === nums.length) {
      result.push([...currentPerm]); // Make a copy
      return;
    }

    // Try each element that hasn't been used yet
    for (let i = 0; i < nums.length; i++) {
      // Skip if element is already in current permutation
      if (used[i]) {
        continue;
      }

      // Skip duplicates: if current equals previous AND previous wasn't used
      // This prevents generating duplicate permutations
      // When nums[i] === nums[i-1] and !used[i-1], using nums[i] would
      // create the same permutation as using nums[i-1] earlier
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
        continue;
      }

      // Choose nums[i] for current position
      used[i] = true;
      currentPerm.push(nums[i]);

      // Recurse to build the rest of the permutation
      backtrack(currentPerm);

      // Backtrack: remove nums[i] for next iteration
      currentPerm.pop();
      used[i] = false;
    }
  }

  // Start backtracking with empty permutation
  backtrack([]);
  return result;
}
```

```java
// Time: O(n * n!) - We generate n! permutations and each takes O(n) time to build
// Space: O(n) - For the recursion stack and used array (excluding output space)
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        /**
         * Generate all unique permutations of an array that may contain duplicates.
         *
         * @param nums - Array of integers that may contain duplicates
         * @return List of all unique permutations
         */

        // Sort the array to group duplicates together
        Arrays.sort(nums);

        List<List<Integer>> result = new ArrayList<>();
        boolean[] used = new boolean[nums.length]; // Track used elements

        // Start backtracking with empty permutation
        backtrack(nums, used, new ArrayList<>(), result);
        return result;
    }

    /**
     * Recursive backtracking function to build permutations.
     *
     * @param nums - Original array (sorted)
     * @param used - Boolean array tracking which elements are in current permutation
     * @param currentPerm - The permutation being built
     * @param result - List to store completed permutations
     */
    private void backtrack(int[] nums, boolean[] used,
                          List<Integer> currentPerm, List<List<Integer>> result) {
        // Base case: if permutation is complete, add to result
        if (currentPerm.size() == nums.length) {
            result.add(new ArrayList<>(currentPerm)); // Make a copy
            return;
        }

        // Try each element that hasn't been used yet
        for (int i = 0; i < nums.length; i++) {
            // Skip if element is already in current permutation
            if (used[i]) {
                continue;
            }

            // Skip duplicates: if current equals previous AND previous wasn't used
            // This prevents generating duplicate permutations
            // When nums[i] == nums[i-1] && !used[i-1], using nums[i] would
            // create the same permutation as using nums[i-1] earlier
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) {
                continue;
            }

            // Choose nums[i] for current position
            used[i] = true;
            currentPerm.add(nums[i]);

            // Recurse to build the rest of the permutation
            backtrack(nums, used, currentPerm, result);

            // Backtrack: remove nums[i] for next iteration
            currentPerm.remove(currentPerm.size() - 1);
            used[i] = false;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × n!)

- Sorting takes O(n log n), which is dominated by the permutation generation
- In the worst case (all unique elements), we generate n! permutations
- Each permutation takes O(n) time to build (the recursive tree has n! leaves, each leaf path has length n)
- With duplicates, we generate fewer permutations, but the upper bound remains O(n × n!)

**Space Complexity:** O(n) excluding output storage

- The recursion depth is at most n, so the call stack uses O(n) space
- The `used` array uses O(n) space
- The `current_perm` list uses O(n) space
- If we count the output storage, it would be O(n × n!) since we store n! permutations each of size n

## Common Mistakes

1. **Forgetting to sort the array first** - This is crucial for the duplicate skipping logic to work. Without sorting, identical elements won't be adjacent, so our duplicate check won't catch all duplicates.

2. **Incorrect duplicate skipping condition** - The condition `nums[i] == nums[i-1] and not used[i-1]` is subtle but critical. Some candidates use `and used[i-1]` instead, which works differently. Our version ensures we only take the first available duplicate at each decision point.

3. **Not making a copy of the permutation before adding to results** - When we add `current_perm` to the result, we must add a copy (like `current_perm[:]` in Python). Otherwise, we're adding a reference that will continue to change as we backtrack.

4. **Using a set to filter duplicates after generation** - While this produces correct results, it's inefficient for larger inputs. The interviewer expects the optimized backtracking approach that avoids generating duplicates in the first place.

## When You'll See This Pattern

This "backtracking with pruning for duplicates" pattern appears in several permutation/combination problems:

1. **Subsets II (LeetCode 90)** - Similar concept: generate all unique subsets when the input contains duplicates. The solution involves sorting and skipping duplicates during backtracking.

2. **Combination Sum II (LeetCode 40)** - Find all unique combinations that sum to a target, with each number used only once and input containing duplicates. Requires the same duplicate skipping technique.

3. **Palindrome Permutation II (LeetCode 267)** - Generate all palindromic permutations of a string. Similar backtracking approach with careful handling of character counts, especially for the middle character in odd-length strings.

The core pattern is: when you need to generate combinatorial structures (permutations, combinations, subsets) from input with duplicates, sort first, then use backtracking with a condition to skip duplicate elements at each decision point.

## Key Takeaways

1. **Sorting enables intelligent duplicate skipping** - By sorting the input first, identical elements become adjacent, allowing us to skip duplicates with a simple comparison to the previous element.

2. **The duplicate skipping condition `nums[i] == nums[i-1] and not used[i-1]` is key** - This ensures we only use the first occurrence of a duplicate value when multiple identical values are available at the same decision level, preventing identical permutations from being generated.

3. **Backtracking with pruning is the standard approach for permutation problems** - This pattern extends to many combinatorial generation problems. The template involves: base case, loop through candidates, prune invalid choices, make choice, recurse, undo choice.

Related problems: [Next Permutation](/problem/next-permutation), [Permutations](/problem/permutations), [Palindrome Permutation II](/problem/palindrome-permutation-ii)
