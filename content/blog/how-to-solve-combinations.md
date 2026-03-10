---
title: "How to Solve Combinations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Combinations. Medium difficulty, 74.2% acceptance rate. Topics: Backtracking."
date: "2026-08-18"
category: "dsa-patterns"
tags: ["combinations", "backtracking", "medium"]
---

# How to Solve Combinations

Given two integers `n` and `k`, return all possible combinations of `k` numbers chosen from the range `[1, n]`. This problem is interesting because it requires generating all subsets of a specific size from a set of numbers, which is a fundamental combinatorial pattern that appears in many real-world scenarios like team selection, lottery combinations, or feature selection in machine learning. The challenge lies in generating these combinations efficiently without duplicates and in a systematic way.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose `n = 4` and `k = 2`. We need all combinations of 2 numbers chosen from `[1, 2, 3, 4]`.

We can think of this as building combinations step by step:

1. Start with number 1:
   - Add 2 → [1, 2]
   - Add 3 → [1, 3]
   - Add 4 → [1, 4]

2. Move to number 2 (we don't go back to 1 to avoid duplicates like [2, 1] which is the same as [1, 2]):
   - Add 3 → [2, 3]
   - Add 4 → [2, 4]

3. Move to number 3:
   - Add 4 → [3, 4]

4. Number 4 doesn't have enough numbers after it to form a combination of size 2.

The complete result is: [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]

Notice the pattern: for each starting number `i`, we only consider numbers greater than `i` to avoid duplicates and maintain the natural order. This is the key insight for our backtracking approach.

## Brute Force Approach

A naive approach might try to generate all possible k-length sequences from n numbers and then filter out duplicates. For example, we could use k nested loops:

```python
# Pseudo-code for brute force
result = []
for i in range(1, n+1):
    for j in range(i+1, n+1):
        if k == 2:
            result.append([i, j])
        elif k == 3:
            for m in range(j+1, n+1):
                result.append([i, j, m])
        # ... and so on for larger k
```

The problem with this approach is that it's not generalizable - the code structure changes depending on the value of `k`. We would need to write different code for different values of `k`, which is impractical. Even if we could write it, the time complexity would be O(n^k) which grows exponentially with `k`. For `n = 20` and `k = 10`, this would be 20^10 ≈ 10 trillion operations - completely infeasible.

## Optimized Approach

The key insight is to use **backtracking**, which is a systematic way to explore all possibilities without writing nested loops for each possible `k`. Backtracking works by:

1. Building combinations incrementally
2. Making a choice (adding a number to the current combination)
3. Recursively exploring further choices
4. Undoing the choice (backtracking) to explore other possibilities

The critical optimization is to only consider numbers greater than the last chosen number. This ensures:

- No duplicates (since [1,2] and [2,1] are the same combination)
- Natural ordering of results
- Efficient pruning of the search space

We maintain a `start` parameter that tells us where to begin choosing the next number. After choosing number `i`, we only consider numbers from `i+1` to `n` for the next position.

## Optimal Solution

Here's the complete backtracking solution with detailed comments:

<div class="code-group">

```python
# Time: O(C(n,k) * k) where C(n,k) is binomial coefficient "n choose k"
# Space: O(k) for recursion stack and current combination
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        result = []

        def backtrack(start, current):
            """
            Generate combinations using backtracking.

            Args:
                start: The smallest number we can choose next
                current: The current combination being built
            """
            # Base case: if current combination has reached size k
            if len(current) == k:
                # Add a copy of current combination to result
                result.append(current[:])
                return

            # Iterate through possible next numbers
            # We only go up to n - (k - len(current)) + 1 to ensure
            # we have enough numbers left to complete the combination
            for num in range(start, n + 1):
                # Prune: if not enough numbers left to complete combination
                remaining_positions = k - len(current) - 1
                if num + remaining_positions > n:
                    break

                # Choose: add current number to combination
                current.append(num)

                # Explore: recursively build the rest of the combination
                # Note: next start is num + 1 to avoid duplicates
                backtrack(num + 1, current)

                # Backtrack: remove last number to try other possibilities
                current.pop()

        # Start backtracking from number 1 with empty combination
        backtrack(1, [])
        return result
```

```javascript
// Time: O(C(n,k) * k) where C(n,k) is binomial coefficient "n choose k"
// Space: O(k) for recursion stack and current combination
function combine(n, k) {
  const result = [];

  /**
   * Generate combinations using backtracking.
   * @param {number} start - The smallest number we can choose next
   * @param {number[]} current - The current combination being built
   */
  function backtrack(start, current) {
    // Base case: if current combination has reached size k
    if (current.length === k) {
      // Add a copy of current combination to result
      result.push([...current]);
      return;
    }

    // Iterate through possible next numbers
    // We only go up to n - (k - current.length) + 1 to ensure
    // we have enough numbers left to complete the combination
    for (let num = start; num <= n; num++) {
      // Prune: if not enough numbers left to complete combination
      const remainingPositions = k - current.length - 1;
      if (num + remainingPositions > n) {
        break;
      }

      // Choose: add current number to combination
      current.push(num);

      // Explore: recursively build the rest of the combination
      // Note: next start is num + 1 to avoid duplicates
      backtrack(num + 1, current);

      // Backtrack: remove last number to try other possibilities
      current.pop();
    }
  }

  // Start backtracking from number 1 with empty combination
  backtrack(1, []);
  return result;
}
```

```java
// Time: O(C(n,k) * k) where C(n,k) is binomial coefficient "n choose k"
// Space: O(k) for recursion stack and current combination
import java.util.*;

class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();

        // Start backtracking from number 1 with empty combination
        backtrack(1, n, k, new ArrayList<>(), result);
        return result;
    }

    /**
     * Generate combinations using backtracking.
     * @param start The smallest number we can choose next
     * @param n The maximum number available
     * @param k The target combination size
     * @param current The current combination being built
     * @param result The list to store all valid combinations
     */
    private void backtrack(int start, int n, int k,
                          List<Integer> current,
                          List<List<Integer>> result) {
        // Base case: if current combination has reached size k
        if (current.size() == k) {
            // Add a copy of current combination to result
            result.add(new ArrayList<>(current));
            return;
        }

        // Iterate through possible next numbers
        // We only go up to n - (k - current.size()) + 1 to ensure
        // we have enough numbers left to complete the combination
        for (int num = start; num <= n; num++) {
            // Prune: if not enough numbers left to complete combination
            int remainingPositions = k - current.size() - 1;
            if (num + remainingPositions > n) {
                break;
            }

            // Choose: add current number to combination
            current.add(num);

            // Explore: recursively build the rest of the combination
            // Note: next start is num + 1 to avoid duplicates
            backtrack(num + 1, n, k, current, result);

            // Backtrack: remove last number to try other possibilities
            current.remove(current.size() - 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(C(n,k) × k) where C(n,k) is the binomial coefficient "n choose k".

- C(n,k) represents the number of combinations we generate
- For each combination, we spend O(k) time to create a copy when adding to results
- The pruning in our loop reduces the actual number of recursive calls, but the dominant term remains O(C(n,k) × k)

**Space Complexity:** O(k) for the recursion stack and the current combination being built.

- The recursion depth is at most k (when we've added k numbers)
- We don't count the output space (the result list) in auxiliary space complexity
- If we include output space, it would be O(C(n,k) × k) to store all combinations

## Common Mistakes

1. **Forgetting to make a copy of the current combination**: When adding `current` to `result`, you must add a copy (like `current[:]` in Python or `new ArrayList<>(current)` in Java). If you add the reference, all combinations in the result will point to the same list, which gets modified during backtracking, resulting in all combinations being empty or identical.

2. **Not incrementing the start parameter correctly**: The most common error is passing `start + 1` instead of `num + 1` to the recursive call. With `start + 1`, you might reuse numbers you've already passed over, leading to duplicates like [1,1] or missing valid combinations.

3. **Missing the pruning condition**: Without the pruning condition `if num + remainingPositions > n: break`, the algorithm still works but does unnecessary work. This optimization is especially important for large n and k near n/2.

4. **Incorrect base case condition**: Using `if len(current) > k: return` instead of `if len(current) == k:` can cause infinite recursion or incorrect results. The base case should only trigger when we have exactly k elements.

## When You'll See This Pattern

The backtracking pattern used here appears in many combinatorial problems:

1. **Combination Sum** (LeetCode 39): Similar structure but numbers can be reused and there's a target sum to reach. Instead of incrementing start by 1, you might keep it the same to allow reuse, or increment to prevent reuse.

2. **Permutations** (LeetCode 46): Instead of maintaining a `start` parameter to avoid going back, permutations need to consider all unused numbers at each step, often tracked with a `used` array or set.

3. **Subsets** (LeetCode 78): This is essentially combinations of all possible sizes (k = 0 to n). You can modify the combinations solution by removing the size constraint and adding every subset to the result as you build it.

4. **Letter Combinations of a Phone Number** (LeetCode 17): Uses similar backtracking but over different sets of choices at each position based on digit mappings.

## Key Takeaways

1. **Backtracking is the go-to technique for combinatorial generation problems** where you need to explore all possible combinations/permutations/subset. The pattern is: choose, explore, unchoose.

2. **The `start` parameter is crucial for combinations** to avoid duplicates and ensure natural ordering. For permutations, you'd typically use a `used` set instead.

3. **Always make copies when saving complete states** in the result list. The current state list gets modified during backtracking, so references to it will show incorrect values.

4. **Pruning early saves significant computation** in backtracking problems. Always look for conditions that let you stop exploring a branch early (like not enough numbers left to complete the combination).

Related problems: [Combination Sum](/problem/combination-sum), [Permutations](/problem/permutations)
