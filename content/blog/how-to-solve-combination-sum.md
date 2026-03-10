---
title: "How to Solve Combination Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Combination Sum. Medium difficulty, 76.1% acceptance rate. Topics: Array, Backtracking."
date: "2026-03-29"
category: "dsa-patterns"
tags: ["combination-sum", "array", "backtracking", "medium"]
---

# How to Solve Combination Sum

The Combination Sum problem asks us to find all unique combinations of numbers from a given array that sum to a target value, where each number can be used an unlimited number of times. What makes this problem interesting is that we need to generate all possible combinations—not just find if one exists—and we must avoid duplicate combinations while allowing repeated use of the same element. This requires careful backtracking to explore all possibilities efficiently.

## Visual Walkthrough

Let's trace through a concrete example: `candidates = [2, 3, 6, 7]` with `target = 7`.

We'll use a backtracking approach where we build combinations incrementally:

1. **Start with empty combination** `[]`, remaining target = 7
2. **Try adding 2**:
   - New combination `[2]`, remaining target = 5
   - Since we can reuse numbers, we can try adding 2 again:
     - `[2, 2]`, remaining target = 3
     - Try adding 2 again: `[2, 2, 2]`, remaining target = 1 (can't use 2 anymore since 1 < 2)
     - Backtrack to `[2, 2]`, try 3: `[2, 2, 3]`, remaining target = 0 ✓ Found a valid combination!
     - Continue exploring other options...
3. **Backtrack to `[2]`**, try 3:
   - `[2, 3]`, remaining target = 2
   - Try adding 2: `[2, 3, 2]` → This is actually the same as `[2, 2, 3]` which we already found! We need to avoid duplicates.
4. **Backtrack to `[]`**, try 3:
   - `[3]`, remaining target = 4
   - Try adding 3: `[3, 3]`, remaining target = 1 (1 < 3, can't continue)
   - Try adding 6: `[3, 6]`, remaining target = -2 (negative, backtrack)
5. **Backtrack to `[]`**, try 6:
   - `[6]`, remaining target = 1 (1 < 6, can't continue)
6. **Backtrack to `[]`**, try 7:
   - `[7]`, remaining target = 0 ✓ Found another valid combination!

Final result: `[[2, 2, 3], [7]]`

The key insight is that to avoid duplicates like `[2, 3, 2]` and `[2, 2, 3]`, we should only consider candidates starting from the current position or later, never going backward. This ensures combinations are generated in non-decreasing order.

## Brute Force Approach

A naive approach would be to generate all possible combinations of any length (including repeated elements) and check which ones sum to the target. For each position, we could choose any candidate any number of times, leading to an exponential number of possibilities.

The brute force would look something like:

1. Generate all sequences where each element is from `candidates`
2. For each sequence, check if it sums to `target`
3. Filter out duplicates

This is clearly infeasible because:

- The search space is infinite since we can use elements repeatedly
- Even with a depth limit, the branching factor is `n` (number of candidates) at each step
- We'd generate many duplicate combinations that need to be filtered out

The time complexity would be worse than exponential, and we'd waste time exploring many invalid paths.

## Optimized Approach

The key insight is to use **backtracking with pruning**:

1. **Backtracking**: We build combinations incrementally. At each step, we add a candidate to our current combination and recursively try to reach the remaining target.
2. **Pruning**: We stop exploring a path when:
   - The remaining target becomes negative (we've overshot)
   - We've exhausted all candidates to consider
3. **Avoiding duplicates**: By only considering candidates starting from the current index (or later), we ensure combinations are generated in non-decreasing order. This prevents permutations of the same set of numbers from appearing multiple times.
4. **Optimization**: We can sort the candidates first. This allows us to stop early when the current candidate is larger than the remaining target, since all subsequent candidates will be even larger (assuming distinct, sorted candidates).

The algorithm works like this:

- Sort the candidates (optional but helpful for pruning)
- Use a recursive backtracking function that takes:
  - The current combination being built
  - The current index in candidates (to avoid going backward)
  - The remaining target sum needed
- At each call:
  - If remaining target is 0, add current combination to results
  - If remaining target is negative, return (prune)
  - For each candidate from current index to end:
    - Add candidate to combination
    - Recursively call with same index (allowing reuse)
    - Remove candidate (backtrack)
    - Move to next candidate

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(N^(T/M + 1)) where N = len(candidates), T = target, M = min(candidates)
# Space: O(T/M) for recursion depth and combination storage
def combinationSum(candidates, target):
    """
    Find all unique combinations of candidates that sum to target.
    Each candidate can be used unlimited times.
    """
    result = []

    def backtrack(start, current_combination, remaining):
        """
        Backtracking helper function.

        Args:
            start: Index to start considering candidates from (avoids duplicates)
            current_combination: Current combination being built
            remaining: Remaining target sum needed
        """
        # Base case: we've reached the target exactly
        if remaining == 0:
            # Add a copy of the current combination to results
            result.append(list(current_combination))
            return

        # Base case: we've overshot the target
        if remaining < 0:
            return

        # Try each candidate starting from 'start' index
        for i in range(start, len(candidates)):
            candidate = candidates[i]

            # Skip if candidate is larger than remaining target
            # (optional optimization, requires sorted candidates)
            if candidate > remaining:
                continue

            # Choose: add candidate to current combination
            current_combination.append(candidate)

            # Explore: recurse with same index i (allows reuse of same candidate)
            # Note: we pass i, not i+1, because we can reuse the same element
            backtrack(i, current_combination, remaining - candidate)

            # Unchoose: remove candidate (backtrack)
            current_combination.pop()

    # Start backtracking from index 0 with empty combination and full target
    backtrack(0, [], target)

    return result
```

```javascript
// Time: O(N^(T/M + 1)) where N = candidates.length, T = target, M = min(candidates)
// Space: O(T/M) for recursion depth and combination storage
function combinationSum(candidates, target) {
  const result = [];

  /**
   * Backtracking helper function.
   * @param {number} start - Index to start considering candidates from
   * @param {number[]} currentCombination - Current combination being built
   * @param {number} remaining - Remaining target sum needed
   */
  function backtrack(start, currentCombination, remaining) {
    // Base case: we've reached the target exactly
    if (remaining === 0) {
      // Add a copy of the current combination to results
      result.push([...currentCombination]);
      return;
    }

    // Base case: we've overshot the target
    if (remaining < 0) {
      return;
    }

    // Try each candidate starting from 'start' index
    for (let i = start; i < candidates.length; i++) {
      const candidate = candidates[i];

      // Skip if candidate is larger than remaining target
      // (optional optimization, requires sorted candidates)
      if (candidate > remaining) {
        continue;
      }

      // Choose: add candidate to current combination
      currentCombination.push(candidate);

      // Explore: recurse with same index i (allows reuse of same candidate)
      // Note: we pass i, not i+1, because we can reuse the same element
      backtrack(i, currentCombination, remaining - candidate);

      // Unchoose: remove candidate (backtrack)
      currentCombination.pop();
    }
  }

  // Start backtracking from index 0 with empty combination and full target
  backtrack(0, [], target);

  return result;
}
```

```java
// Time: O(N^(T/M + 1)) where N = candidates.length, T = target, M = min(candidates)
// Space: O(T/M) for recursion depth and combination storage
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    /**
     * Backtracking helper function.
     * @param candidates - Array of candidate numbers
     * @param remaining - Remaining target sum needed
     * @param start - Index to start considering candidates from
     * @param currentCombination - Current combination being built
     * @param result - List to store valid combinations
     */
    private void backtrack(int[] candidates, int remaining, int start,
                          List<Integer> currentCombination, List<List<Integer>> result) {
        // Base case: we've reached the target exactly
        if (remaining == 0) {
            // Add a copy of the current combination to results
            result.add(new ArrayList<>(currentCombination));
            return;
        }

        // Base case: we've overshot the target
        if (remaining < 0) {
            return;
        }

        // Try each candidate starting from 'start' index
        for (int i = start; i < candidates.length; i++) {
            int candidate = candidates[i];

            // Skip if candidate is larger than remaining target
            // (optional optimization, requires sorted candidates)
            if (candidate > remaining) {
                continue;
            }

            // Choose: add candidate to current combination
            currentCombination.add(candidate);

            // Explore: recurse with same index i (allows reuse of same candidate)
            // Note: we pass i, not i+1, because we can reuse the same element
            backtrack(candidates, remaining - candidate, i, currentCombination, result);

            // Unchoose: remove candidate (backtrack)
            currentCombination.remove(currentCombination.size() - 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(N^(T/M + 1)) where:

- N = number of candidates
- T = target value
- M = minimum value in candidates

This might look intimidating, but let's break it down:

- In the worst case, we explore a tree where each node has up to N children (one for each candidate)
- The maximum depth of the tree is T/M (if we always use the smallest candidate)
- So we have roughly N^(T/M) leaf nodes in the worst case
- The "+1" accounts for internal nodes

**Space Complexity**: O(T/M) for:

- The recursion call stack depth (maximum T/M recursive calls)
- Storage for the current combination (maximum T/M elements)
- The output space is not counted in auxiliary space complexity

## Common Mistakes

1. **Forgetting to backtrack**: After the recursive call, you must remove the last element added to the current combination. This is a classic backtracking pattern: choose → explore → unchoose.

2. **Generating duplicate combinations**: If you always start the loop from index 0 instead of the current index, you'll generate permutations of the same combination (e.g., `[2, 2, 3]` and `[2, 3, 2]`). Always pass the current index (or start from it) to avoid going backward.

3. **Not handling the "unlimited use" correctly**: Some candidates think they need to call `backtrack(i+1, ...)` to move to the next candidate. But for this problem, we need `backtrack(i, ...)` to allow reusing the same candidate.

4. **Missing the base case for negative remaining**: If you only check `remaining == 0`, you might miss cases where you overshoot the target and need to backtrack. Always check for `remaining < 0` as well.

## When You'll See This Pattern

This backtracking pattern appears in many combination/permutation problems:

1. **Combination Sum II** (LeetCode 40): Similar but each candidate can only be used once. The key difference is passing `i+1` instead of `i` to the recursive call.

2. **Subsets** (LeetCode 78): Generate all possible subsets of a set. Uses similar backtracking but adds the current combination at every step, not just when reaching a target.

3. **Palindrome Partitioning** (LeetCode 131): Partition a string into palindromic substrings. Uses backtracking to try different partition points.

4. **Letter Combinations of a Phone Number** (LeetCode 17): Generate all possible letter combinations from phone digits. Similar backtracking structure but with fixed mapping.

The core pattern is: when you need to explore all possible combinations/permutations subject to constraints, backtracking is often the right approach.

## Key Takeaways

1. **Backtracking is your friend for combination problems**: When you need to generate all possible combinations/permutations, think backtracking. The template is: choose → explore → unchoose.

2. **Avoid duplicates with index tracking**: To avoid generating permutations of the same combination, always consider elements from the current index forward (not from the beginning).

3. **Prune early for efficiency**: Check constraints as early as possible (like `candidate > remaining`) to avoid exploring dead ends.

Related problems: [Letter Combinations of a Phone Number](/problem/letter-combinations-of-a-phone-number), [Combination Sum II](/problem/combination-sum-ii), [Combinations](/problem/combinations)
