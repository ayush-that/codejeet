---
title: "How to Solve Permutations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Permutations. Medium difficulty, 81.7% acceptance rate. Topics: Array, Backtracking."
date: "2026-03-30"
category: "dsa-patterns"
tags: ["permutations", "array", "backtracking", "medium"]
---

# How to Solve Permutations

Given an array of distinct integers, return all possible permutations. This problem is interesting because it requires generating every possible ordering of elements—a fundamental combinatorial problem that appears in many real-world scenarios like scheduling, game theory, and cryptography. The challenge lies in doing this efficiently without missing any permutations or creating duplicates.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`. We want to generate all 6 permutations:

1. Start with an empty permutation `[]` and all numbers available: `{1, 2, 3}`
2. Pick `1`: permutation becomes `[1]`, available numbers: `{2, 3}`
   - Pick `2`: permutation becomes `[1, 2]`, available numbers: `{3}`
     - Pick `3`: permutation becomes `[1, 2, 3]` → complete permutation!
   - Backtrack: remove `2`, available numbers: `{2, 3}`
   - Pick `3`: permutation becomes `[1, 3]`, available numbers: `{2}`
     - Pick `2`: permutation becomes `[1, 3, 2]` → complete permutation!
3. Backtrack to start: permutation `[]`, available numbers: `{1, 2, 3}`
4. Pick `2`: permutation becomes `[2]`, available numbers: `{1, 3}`
   - Continue similarly...
5. Pick `3`: permutation becomes `[3]`, available numbers: `{1, 2}`
   - Continue similarly...

This tree-like exploration is called **backtracking**. We build permutations incrementally, and when we reach a complete permutation (length equals input length), we save it and backtrack to try other possibilities.

## Brute Force Approach

A naive approach might try to generate permutations by swapping elements randomly or using nested loops, but these methods either miss permutations or create duplicates. The most straightforward brute force would be to generate all possible sequences of length n (where n is the array length) and filter out invalid ones, but this is extremely inefficient:

- For n elements, there are n^n possible sequences (many with repeated elements)
- We'd need to check each sequence for duplicates and valid permutations
- This gives O(n^n × n) time complexity (checking duplicates takes O(n) per sequence)

For n=3, we'd generate 27 sequences but only need 6 permutations. For n=10, we'd generate 10 billion sequences but only need 3.6 million permutations—a waste of 99.96% computation!

## Optimized Approach

The key insight is to use **backtracking with state tracking**. We need to:

1. Build permutations incrementally
2. Keep track of which elements we've already used
3. When we reach a complete permutation, save it
4. Backtrack (undo our last choice) to explore other possibilities

We can track used elements using:

- A boolean array (size n) marking which indices are used
- A set to store used values (works since elements are distinct)
- Swapping elements in-place (more space-efficient)

The swapping approach is particularly elegant: we fix elements at the beginning of the array one by one, swapping them with later elements to generate different permutations.

## Optimal Solution

Here's the backtracking solution with detailed comments:

<div class="code-group">

```python
# Time: O(n × n!) | Space: O(n) for recursion stack (excluding output)
def permute(nums):
    """
    Generate all permutations of distinct integers using backtracking.

    Args:
        nums: List of distinct integers

    Returns:
        List of all permutations
    """
    result = []

    def backtrack(start):
        """
        Recursive backtracking function.

        Args:
            start: Index from which to start generating permutations
        """
        # Base case: if we've reached the end, we have a complete permutation
        if start == len(nums):
            # Append a copy since nums will be modified during backtracking
            result.append(nums[:])
            return

        # Explore all possibilities for the current position
        for i in range(start, len(nums)):
            # Swap current element with element at position 'start'
            # This places nums[i] at the current position in the permutation
            nums[start], nums[i] = nums[i], nums[start]

            # Recursively generate permutations for the remaining positions
            backtrack(start + 1)

            # Backtrack: undo the swap to restore original order
            # This allows us to try different elements at this position
            nums[start], nums[i] = nums[i], nums[start]

    # Start backtracking from the first position
    backtrack(0)
    return result
```

```javascript
// Time: O(n × n!) | Space: O(n) for recursion stack (excluding output)
function permute(nums) {
  /**
   * Generate all permutations of distinct integers using backtracking.
   *
   * @param {number[]} nums - Array of distinct integers
   * @return {number[][]} - All permutations
   */
  const result = [];

  /**
   * Recursive backtracking function.
   *
   * @param {number} start - Index from which to start generating permutations
   */
  function backtrack(start) {
    // Base case: if we've reached the end, we have a complete permutation
    if (start === nums.length) {
      // Create a copy since nums will be modified during backtracking
      result.push([...nums]);
      return;
    }

    // Explore all possibilities for the current position
    for (let i = start; i < nums.length; i++) {
      // Swap current element with element at position 'start'
      // This places nums[i] at the current position in the permutation
      [nums[start], nums[i]] = [nums[i], nums[start]];

      // Recursively generate permutations for the remaining positions
      backtrack(start + 1);

      // Backtrack: undo the swap to restore original order
      // This allows us to try different elements at this position
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }

  // Start backtracking from the first position
  backtrack(0);
  return result;
}
```

```java
// Time: O(n × n!) | Space: O(n) for recursion stack (excluding output)
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        /**
         * Generate all permutations of distinct integers using backtracking.
         *
         * @param nums: Array of distinct integers
         * @return: List of all permutations
         */
        List<List<Integer>> result = new ArrayList<>();

        // Convert array to list for easier swapping
        List<Integer> numsList = new ArrayList<>();
        for (int num : nums) {
            numsList.add(num);
        }

        // Start backtracking from the first position
        backtrack(0, numsList, result);
        return result;
    }

    /**
     * Recursive backtracking function.
     *
     * @param start: Index from which to start generating permutations
     * @param nums: Current state of the permutation being built
     * @param result: List to store completed permutations
     */
    private void backtrack(int start, List<Integer> nums, List<List<Integer>> result) {
        // Base case: if we've reached the end, we have a complete permutation
        if (start == nums.size()) {
            // Create a copy since nums will be modified during backtracking
            result.add(new ArrayList<>(nums));
            return;
        }

        // Explore all possibilities for the current position
        for (int i = start; i < nums.size(); i++) {
            // Swap current element with element at position 'start'
            // This places nums[i] at the current position in the permutation
            Collections.swap(nums, start, i);

            // Recursively generate permutations for the remaining positions
            backtrack(start + 1, nums, result);

            // Backtrack: undo the swap to restore original order
            // This allows us to try different elements at this position
            Collections.swap(nums, start, i);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × n!)**

- There are n! permutations to generate (factorial growth)
- For each permutation, we spend O(n) time:
  - O(n) for the base case (creating a copy of the array)
  - O(n) for the loop iterations in total across recursion levels
- More precisely: T(n) = n × T(n-1) + O(n), which solves to O(n × n!)

**Space Complexity: O(n)** (excluding output storage)

- The recursion depth is n (one level for each element)
- We use O(n) space for the recursion stack
- The swapping happens in-place, so no additional O(n) arrays
- If we count the output: O(n × n!) space to store all permutations

## Common Mistakes

1. **Not making a copy of the current permutation**: When adding to results, candidates often do `result.append(nums)` instead of `result.append(nums[:])`. This adds a reference to the same list that gets modified during backtracking, so all entries in result end up being the same final state.

2. **Forgetting to backtrack**: After the recursive call, you must undo your change (swap back). Without this, you lose the ability to explore other branches of the decision tree.

3. **Incorrect loop bounds**: The loop should start from `start`, not `0`. Starting from `0` would generate permutations with repeated elements since you'd be considering already-placed elements again.

4. **Using extra O(n²) space unnecessarily**: Some solutions use a separate "used" boolean array and a "current" list, which is fine but uses more space than the swapping approach. The swapping approach is more elegant for distinct elements.

## When You'll See This Pattern

Backtracking for permutations appears in many variations:

1. **Permutations II** (LeetCode 47): Same problem but with duplicates. Requires additional logic to skip duplicate permutations, often by sorting and checking if we've used identical elements at the same level.

2. **Next Permutation** (LeetCode 31): Given a permutation, find the next lexicographic permutation. Uses a clever algorithm to avoid generating all permutations.

3. **Permutation Sequence** (LeetCode 60): Find the k-th permutation sequence without generating all permutations. Uses factorial number system mathematics.

4. **Letter Case Permutation** (LeetCode 784): Generate all permutations of letter cases in a string. Similar backtracking structure but with different choices at each position.

5. **Subsets/Power Set** problems: While subsets don't care about order, the backtracking structure is similar—at each element, you choose whether to include it or not.

## Key Takeaways

1. **Backtracking is natural for permutations**: When you need to generate all possible arrangements/orderings, backtracking with swapping or a "used" array is the standard approach.

2. **The swapping trick saves space**: For distinct elements, swapping elements in-place avoids extra O(n) storage for tracking used elements. Remember to swap back after recursion!

3. **Recognize factorial complexity**: If a problem asks for "all possible arrangements" of n items, expect O(n!) time complexity. This grows extremely fast, so these problems typically have small constraints (n ≤ 10).

Related problems: [Next Permutation](/problem/next-permutation), [Permutations II](/problem/permutations-ii), [Permutation Sequence](/problem/permutation-sequence)
