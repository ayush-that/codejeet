---
title: "How to Solve Subsets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Subsets. Medium difficulty, 82.1% acceptance rate. Topics: Array, Backtracking, Bit Manipulation."
date: "2026-04-01"
category: "dsa-patterns"
tags: ["subsets", "array", "backtracking", "bit-manipulation", "medium"]
---

# How to Solve Subsets

Given an array of unique integers, return all possible subsets (the power set). The challenge is generating every possible combination of elements without duplication, which requires systematic exploration of all 2^n possibilities. This problem is fundamental for understanding combinatorial generation and backtracking patterns.

## Visual Walkthrough

Let's trace through input `nums = [1,2,3]`:

**Step 1:** Start with empty subset `[]`

**Step 2:** For each element, we have a choice: include it or exclude it

- Path 1: Don't include 1 → still `[]`
- Path 2: Include 1 → `[1]`

**Step 3:** For each current subset, repeat with next element (2):

- From `[]`:
  - Don't include 2 → `[]`
  - Include 2 → `[2]`
- From `[1]`:
  - Don't include 2 → `[1]`
  - Include 2 → `[1,2]`

**Step 4:** For each current subset, repeat with last element (3):

- From `[]` → `[]`, `[3]`
- From `[2]` → `[2]`, `[2,3]`
- From `[1]` → `[1]`, `[1,3]`
- From `[1,2]` → `[1,2]`, `[1,2,3]`

Final result: `[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]`

Notice we're building subsets incrementally: at each step, we take all existing subsets and create new ones by adding the current element.

## Brute Force Approach

A naive approach might try to generate all combinations by nested loops, but this quickly becomes unwieldy. For example:

- For subsets of size 0: just the empty set
- For subsets of size 1: iterate through all elements
- For subsets of size 2: use two nested loops
- For subsets of size 3: use three nested loops...

This approach requires writing different logic for each subset size and becomes exponentially complex. The code would need to handle k nested loops for subsets of size k, which is impractical when we don't know k in advance.

## Optimized Approach

The key insight is that we can use **backtracking** to systematically explore all possibilities:

1. Start with an empty subset
2. For each position in the array, we have two choices:
   - Include the current element
   - Exclude the current element
3. Recursively explore both choices
4. When we reach the end of the array, add the current subset to results

Alternatively, we can use an **iterative approach**:

1. Start with a list containing just the empty subset
2. For each element in nums:
   - Take all existing subsets
   - Create new subsets by adding the current element to each
   - Add these new subsets to our collection

Both approaches generate all 2^n subsets without duplication.

## Optimal Solution

Here are complete implementations using both backtracking and iterative approaches:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(n * 2^n)
# Backtracking approach
def subsets(nums):
    """
    Generate all subsets using backtracking.
    Each element has two choices: include or exclude.
    """
    result = []

    def backtrack(start, current_subset):
        """
        start: index in nums to start considering elements from
        current_subset: the subset being built
        """
        # Add a copy of current subset to results
        # We need a copy because current_subset will be modified
        result.append(current_subset.copy())

        # Explore all possibilities starting from 'start' index
        for i in range(start, len(nums)):
            # Include nums[i] in the subset
            current_subset.append(nums[i])

            # Recurse with next index (i+1) to avoid duplicates
            backtrack(i + 1, current_subset)

            # Backtrack: remove nums[i] to try excluding it
            current_subset.pop()

    # Start with empty subset at index 0
    backtrack(0, [])
    return result


# Time: O(n * 2^n) | Space: O(n * 2^n)
# Iterative approach
def subsets_iterative(nums):
    """
    Generate all subsets iteratively.
    Start with empty set, then for each element,
    add it to all existing subsets.
    """
    result = [[]]  # Start with empty subset

    for num in nums:
        # For each existing subset, create a new one with current num
        new_subsets = []
        for subset in result:
            new_subsets.append(subset + [num])

        # Add all new subsets to results
        result.extend(new_subsets)

    return result
```

```javascript
// Time: O(n * 2^n) | Space: O(n * 2^n)
// Backtracking approach
function subsets(nums) {
  const result = [];

  /**
   * Backtracking helper function
   * @param {number} start - Index to start considering elements from
   * @param {number[]} currentSubset - The subset being built
   */
  function backtrack(start, currentSubset) {
    // Add a copy of current subset to results
    result.push([...currentSubset]);

    // Explore all possibilities starting from 'start' index
    for (let i = start; i < nums.length; i++) {
      // Include nums[i] in the subset
      currentSubset.push(nums[i]);

      // Recurse with next index (i+1) to avoid duplicates
      backtrack(i + 1, currentSubset);

      // Backtrack: remove nums[i] to try excluding it
      currentSubset.pop();
    }
  }

  // Start with empty subset at index 0
  backtrack(0, []);
  return result;
}

// Time: O(n * 2^n) | Space: O(n * 2^n)
// Iterative approach
function subsetsIterative(nums) {
  // Start with empty set
  let result = [[]];

  for (const num of nums) {
    // Store current length to avoid infinite loop
    const currentLength = result.length;

    // For each existing subset, create a new one with current num
    for (let i = 0; i < currentLength; i++) {
      const newSubset = [...result[i], num];
      result.push(newSubset);
    }
  }

  return result;
}
```

```java
// Time: O(n * 2^n) | Space: O(n * 2^n)
// Backtracking approach
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(result, new ArrayList<>(), nums, 0);
        return result;
    }

    /**
     * Backtracking helper function
     * @param result - List to store all subsets
     * @param currentSubset - The subset being built
     * @param nums - Input array
     * @param start - Index to start considering elements from
     */
    private void backtrack(List<List<Integer>> result,
                          List<Integer> currentSubset,
                          int[] nums,
                          int start) {
        // Add a copy of current subset to results
        result.add(new ArrayList<>(currentSubset));

        // Explore all possibilities starting from 'start' index
        for (int i = start; i < nums.length; i++) {
            // Include nums[i] in the subset
            currentSubset.add(nums[i]);

            // Recurse with next index (i+1) to avoid duplicates
            backtrack(result, currentSubset, nums, i + 1);

            // Backtrack: remove nums[i] to try excluding it
            currentSubset.remove(currentSubset.size() - 1);
        }
    }
}

// Time: O(n * 2^n) | Space: O(n * 2^n)
// Iterative approach
class Solution {
    public List<List<Integer>> subsetsIterative(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        // Start with empty set
        result.add(new ArrayList<>());

        for (int num : nums) {
            // Store current size to avoid concurrent modification
            int currentSize = result.size();

            // For each existing subset, create a new one with current num
            for (int i = 0; i < currentSize; i++) {
                List<Integer> newSubset = new ArrayList<>(result.get(i));
                newSubset.add(num);
                result.add(newSubset);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × 2^n)**

- We generate 2^n subsets (each element can be either included or excluded)
- For each subset, we spend O(n) time in the worst case to copy it to results
- In backtracking: The recursive tree has 2^n leaves and n levels, with O(n) work per leaf

**Space Complexity: O(n × 2^n)**

- We store 2^n subsets in the output
- Each subset can have up to n elements
- For backtracking: Additional O(n) space for the recursion call stack

## Common Mistakes

1. **Not making copies of subsets**: When adding a subset to results, you must create a copy. Otherwise, all subsets in results will reference the same list, which gets modified during backtracking, resulting in all subsets being identical (usually all empty or all full).

2. **Forgetting the empty subset**: The power set always includes the empty set. Candidates sometimes start with just the first element or forget to add `[]` in iterative approaches.

3. **Generating duplicates**: When using backtracking, if you don't use the `start` parameter correctly and allow going backward (starting from 0 instead of `i+1`), you'll generate duplicate subsets like `[1,2]` and `[2,1]`.

4. **Infinite loops in iterative approach**: When using the iterative method, you need to store the initial size before the loop, otherwise you'll keep iterating over newly added subsets, creating an infinite loop.

## When You'll See This Pattern

This subset generation pattern appears in many combinatorial problems:

1. **Subsets II (LeetCode 90)**: Same problem but with duplicates in input. Requires sorting and skipping duplicates during backtracking.

2. **Combination Sum (LeetCode 39)**: Similar backtracking structure but with a target sum constraint and ability to reuse elements.

3. **Permutations (LeetCode 46)**: Uses similar backtracking but explores all orderings (permutations) instead of subsets.

4. **Letter Case Permutation (LeetCode 784)**: Each character has two choices (uppercase or lowercase), similar to include/exclude decision for subsets.

The pattern is: when you need to explore all combinations/possibilities where each element has multiple choices, backtracking with include/exclude decisions is often the solution.

## Key Takeaways

1. **Backtracking is natural for subset problems**: The "include/exclude" decision for each element maps perfectly to recursive backtracking. Remember the template: add to current path, recurse, then remove (backtrack).

2. **Iterative approach builds incrementally**: Start with empty set, then for each element, add it to all existing subsets. This is often easier to implement and understand.

3. **2^n subsets for n elements**: This is the fundamental count. If your solution isn't generating exactly 2^n subsets (excluding duplicates), something is wrong.

Related problems: [Subsets II](/problem/subsets-ii), [Generalized Abbreviation](/problem/generalized-abbreviation), [Letter Case Permutation](/problem/letter-case-permutation)
