---
title: "How to Solve Combination Sum III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Combination Sum III. Medium difficulty, 73.0% acceptance rate. Topics: Array, Backtracking."
date: "2026-12-24"
category: "dsa-patterns"
tags: ["combination-sum-iii", "array", "backtracking", "medium"]
---

# How to Solve Combination Sum III

Combination Sum III asks us to find all unique combinations of exactly `k` distinct numbers from 1 to 9 that sum to `n`. What makes this problem interesting is that it combines three constraints: we must use exactly `k` numbers, each number can only be used once, and we're limited to digits 1-9. This creates a perfect scenario for backtracking with pruning.

## Visual Walkthrough

Let's trace through an example: `k = 3`, `n = 7`

We need exactly 3 distinct numbers from 1-9 that sum to 7.

**Step 1:** Start with 1

- Current combination: [1], sum = 1, remaining = 6
- Need 2 more numbers

**Step 2:** Try 2 next (must be > 1 to avoid duplicates)

- Current: [1, 2], sum = 3, remaining = 4
- Need 1 more number

**Step 3:** Try 3 next (must be > 2)

- Current: [1, 2, 3], sum = 6, remaining = 1
- Not enough numbers left to reach 7 with 3 numbers
- Backtrack: remove 3

**Step 4:** Try 4 next

- Current: [1, 2, 4], sum = 7, remaining = 0
- ✅ Found valid combination: [1, 2, 4]
- Backtrack: remove 4

**Step 5:** Try 5 next

- Current: [1, 2, 5], sum = 8, remaining = -1
- Sum exceeds target → prune this branch
- Backtrack: remove 5

**Step 6:** Continue backtracking and exploring other branches...

**Valid combinations found:** [1, 2, 4]

Other branches would explore starting with 2, 3, etc., but they won't find valid combinations for this example since the smallest sum with 3 numbers starting from 2 is 2+3+4=9 > 7.

## Brute Force Approach

A naive approach would be to generate all possible combinations of `k` numbers from 1-9, then filter those that sum to `n`. We could use nested loops or generate all subsets.

**Why this fails:**

- Generating all combinations of size `k` from 9 numbers gives C(9,k) possibilities
- For k=9, that's 1 combination; for k=5, that's 126 combinations
- While this might seem manageable for small k, the approach doesn't scale well conceptually
- More importantly, it doesn't leverage the sum constraint to prune branches early
- The backtracking approach is more elegant and efficient

## Optimized Approach

The key insight is that this is a classic **backtracking with pruning** problem. We can build combinations incrementally and prune branches when:

1. **Sum exceeds target**: If our current sum > n, no need to explore further
2. **Not enough numbers remaining**: If we need k numbers but have fewer than k numbers left to choose from
3. **Numbers are exhausted**: We've considered all numbers 1-9

**Backtracking framework:**

1. Start with an empty combination
2. Try adding each number from current position to 9
3. Recursively explore with the next number (to avoid duplicates)
4. If combination reaches size k and sum equals n, add to results
5. Backtrack by removing last number and try next possibility

**Pruning optimizations:**

- Stop if current sum > n (no point adding larger numbers)
- Stop if we need more numbers than are available (can't complete combination)
- Only consider numbers greater than the last added number (to avoid permutations of same combination)

## Optimal Solution

Here's the complete backtracking solution with pruning:

<div class="code-group">

```python
# Time: O(C(9,k)) = O(9!/(k!*(9-k)!)) - in worst case, we explore all combinations
# Space: O(k) for recursion stack and current combination
class Solution:
    def combinationSum3(self, k: int, n: int) -> List[List[int]]:
        def backtrack(start: int, current_sum: int, current_comb: List[int]):
            """
            Backtracking helper function
            start: smallest number we can consider next (to avoid duplicates)
            current_sum: sum of numbers in current_comb
            current_comb: current combination being built
            """
            # Base case: if combination is complete
            if len(current_comb) == k:
                if current_sum == n:
                    # Found valid combination, add copy to results
                    result.append(current_comb.copy())
                return

            # Try each number from start to 9
            for num in range(start, 10):
                # Prune if adding num would exceed target
                if current_sum + num > n:
                    # Since numbers are sorted, all subsequent numbers will also exceed
                    break

                # Add current number to combination
                current_comb.append(num)

                # Recurse with next number (num + 1 to avoid reusing numbers)
                backtrack(num + 1, current_sum + num, current_comb)

                # Backtrack: remove last number to try next possibility
                current_comb.pop()

        result = []
        backtrack(1, 0, [])
        return result
```

```javascript
// Time: O(C(9,k)) = O(9!/(k!*(9-k)!))
// Space: O(k) for recursion stack and current combination
function combinationSum3(k, n) {
  const result = [];

  /**
   * Backtracking helper function
   * @param {number} start - smallest number we can consider next
   * @param {number} currentSum - sum of numbers in currentComb
   * @param {number[]} currentComb - current combination being built
   */
  function backtrack(start, currentSum, currentComb) {
    // Base case: if combination is complete
    if (currentComb.length === k) {
      if (currentSum === n) {
        // Found valid combination, add copy to results
        result.push([...currentComb]);
      }
      return;
    }

    // Try each number from start to 9
    for (let num = start; num <= 9; num++) {
      // Prune if adding num would exceed target
      if (currentSum + num > n) {
        // Since numbers are sorted, all subsequent numbers will also exceed
        break;
      }

      // Add current number to combination
      currentComb.push(num);

      // Recurse with next number (num + 1 to avoid reusing numbers)
      backtrack(num + 1, currentSum + num, currentComb);

      // Backtrack: remove last number to try next possibility
      currentComb.pop();
    }
  }

  backtrack(1, 0, []);
  return result;
}
```

```java
// Time: O(C(9,k)) = O(9!/(k!*(9-k)!))
// Space: O(k) for recursion stack and current combination
class Solution {
    public List<List<Integer>> combinationSum3(int k, int n) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(1, k, n, new ArrayList<>(), result);
        return result;
    }

    /**
     * Backtracking helper function
     * @param start - smallest number we can consider next
     * @param k - remaining numbers needed
     * @param remaining - remaining sum needed
     * @param currentComb - current combination being built
     * @param result - list to store valid combinations
     */
    private void backtrack(int start, int k, int remaining,
                          List<Integer> currentComb, List<List<Integer>> result) {
        // Base case: if no more numbers needed
        if (k == 0) {
            if (remaining == 0) {
                // Found valid combination, add copy to results
                result.add(new ArrayList<>(currentComb));
            }
            return;
        }

        // Additional pruning: if remaining sum is too small for k numbers
        // The smallest sum we can get with k numbers starting from start is:
        // start + (start+1) + ... + (start+k-1) = k*start + k*(k-1)/2
        if (remaining < k * start + k * (k - 1) / 2) {
            return;
        }

        // Additional pruning: if remaining sum is too large for k numbers
        // The largest sum we can get with k numbers ending at 9 is:
        // 9 + 8 + ... + (9-k+1) = k*9 - k*(k-1)/2
        if (remaining > k * 9 - k * (k - 1) / 2) {
            return;
        }

        // Try each number from start to 9
        for (int num = start; num <= 9; num++) {
            // Prune if current number exceeds remaining sum
            if (num > remaining) {
                break;
            }

            // Add current number to combination
            currentComb.add(num);

            // Recurse with next number and updated parameters
            backtrack(num + 1, k - 1, remaining - num, currentComb, result);

            // Backtrack: remove last number to try next possibility
            currentComb.remove(currentComb.size() - 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(C(9,k) × k) in worst case

- C(9,k) = 9!/(k!×(9-k)!) is the number of combinations of size k from 9 elements
- In worst case (k=4 or 5), we explore all combinations
- The ×k factor comes from creating copies of valid combinations
- With pruning, actual runtime is often much better

**Space Complexity:** O(k)

- The recursion depth is at most k (when we've added k numbers)
- The current combination stores up to k numbers
- Output space is not counted in auxiliary space complexity

## Common Mistakes

1. **Forgetting to make copies of combinations**: When adding a combination to results, you must add a copy (`current_comb.copy()` in Python, `new ArrayList<>(currentComb)` in Java, `[...currentComb]` in JS). Otherwise, you'll add references that get modified during backtracking.

2. **Not pruning early enough**: Candidates often check `if current_sum > n` only at the base case. By checking and breaking/returning early when `current_sum + num > n`, we save significant computation.

3. **Generating permutations instead of combinations**: To avoid duplicates like [1,2,4] and [2,1,4], always start the next recursion from `num + 1` instead of from 1 again. This ensures we only consider numbers in increasing order.

4. **Missing the "exactly k numbers" constraint**: Some candidates stop when sum equals n, even if they haven't used exactly k numbers. The base case must check both conditions: `len(current_comb) == k` AND `current_sum == n`.

## When You'll See This Pattern

This backtracking with pruning pattern appears in many combination/subset problems:

1. **Combination Sum (LeetCode 39)**: Similar but numbers can be reused. The pruning logic changes slightly since you can reuse elements.

2. **Combination Sum II (LeetCode 40)**: Numbers can't be reused and input may contain duplicates. Requires additional logic to skip duplicate values.

3. **Subsets (LeetCode 78)**: Generate all possible subsets. Similar backtracking structure but without sum constraint.

4. **Palindrome Partitioning (LeetCode 131)**: Different constraint (palindromes) but same backtracking framework for partitioning a string.

The pattern is: when you need to explore all possible combinations/permutations with constraints, and the search space can be pruned, backtracking is often the right approach.

## Key Takeaways

1. **Backtracking is ideal for combination generation**: When you need to explore all possible combinations with constraints, backtracking provides a clean, recursive way to build solutions incrementally.

2. **Prune early, prune often**: The efficiency of backtracking comes from eliminating invalid branches as soon as possible. Check constraints at each step, not just at the base case.

3. **Avoid duplicates with ordering**: By only considering numbers in increasing order (starting each recursion from the next number), you automatically avoid generating permutations of the same combination.

4. **Remember to copy results**: This is a subtle but critical detail in backtracking problems. Always create copies of valid combinations before adding them to results.

Related problems: [Combination Sum](/problem/combination-sum)
