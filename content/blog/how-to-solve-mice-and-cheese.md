---
title: "How to Solve Mice and Cheese — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Mice and Cheese. Medium difficulty, 48.3% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2028-12-26"
category: "dsa-patterns"
tags: ["mice-and-cheese", "array", "greedy", "sorting", "medium"]
---

# How to Solve Mice and Cheese

You have two mice and `n` pieces of cheese. Each piece must be eaten by exactly one mouse. The first mouse gets `reward1[i]` points for eating cheese `i`, while the second mouse gets `reward2[i]`. Your goal is to maximize the total points by assigning exactly `k` pieces to the first mouse and the remaining `n-k` pieces to the second mouse. The tricky part is that you can't just give each mouse their highest rewards independently—you need to strategically choose which pieces are worth "sacrificing" to the other mouse to maximize the overall score.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose:

- `reward1 = [1, 4, 4, 6, 4]`
- `reward2 = [6, 5, 1, 6, 1]`
- `k = 2`

We need to give exactly 2 pieces to mouse 1 and 3 pieces to mouse 2.

**Step 1: Calculate the difference**
For each piece of cheese, calculate how much better mouse 1 is than mouse 2: `diff[i] = reward1[i] - reward2[i]`

- Piece 0: 1 - 6 = -5
- Piece 1: 4 - 5 = -1
- Piece 2: 4 - 1 = 3
- Piece 3: 6 - 6 = 0
- Piece 4: 4 - 1 = 3

**Step 2: Sort by difference**
We want to give mouse 1 the pieces where it has the biggest advantage (largest positive difference) and give mouse 2 the pieces where it has the biggest advantage (largest negative difference, which means mouse 2 is much better).

Sort indices by `diff` in descending order:

- Index 2: diff = 3
- Index 4: diff = 3
- Index 3: diff = 0
- Index 1: diff = -1
- Index 0: diff = -5

**Step 3: Assign the top k to mouse 1**
Since `k = 2`, we give the top 2 pieces (indices 2 and 4) to mouse 1:

- Mouse 1 gets pieces 2 and 4: reward1[2] + reward1[4] = 4 + 4 = 8

**Step 4: Assign the rest to mouse 2**
The remaining pieces (indices 3, 1, and 0) go to mouse 2:

- Mouse 2 gets pieces 3, 1, and 0: reward2[3] + reward2[1] + reward2[0] = 6 + 5 + 6 = 17

**Step 5: Calculate total**
Total = 8 + 17 = 25

This is the optimal assignment. The key insight is that by sorting based on the difference `reward1[i] - reward2[i]`, we can identify which pieces mouse 1 "wants" most (large positive difference) and which pieces mouse 2 "wants" most (large negative difference).

## Brute Force Approach

A brute force approach would try all possible ways to choose `k` pieces for mouse 1 from `n` total pieces. For each combination:

1. Assign those `k` pieces to mouse 1 (sum their `reward1` values)
2. Assign the remaining `n-k` pieces to mouse 2 (sum their `reward2` values)
3. Track the maximum total

This requires checking C(n, k) combinations, which grows factorially with `n`. For `n = 1000` and `k = 500`, this is completely infeasible (approximately 10^299 combinations).

Even if we tried a different naive approach—like giving mouse 1 the `k` pieces with highest `reward1` values—that would fail because it ignores that mouse 2 might be much better at those pieces. For example, if `reward1[i] = 100` but `reward2[i] = 1000`, we're better off giving it to mouse 2 even though mouse 1's reward is high.

## Optimized Approach

The optimal solution uses a greedy approach with sorting. Here's the step-by-step reasoning:

1. **Calculate opportunity cost**: For each piece `i`, compute `diff[i] = reward1[i] - reward2[i]`. This represents how much better mouse 1 is than mouse 2 for that piece. A large positive value means mouse 1 is much better; a large negative value means mouse 2 is much better.

2. **Sort by difference**: Sort indices based on `diff` in descending order. This puts pieces where mouse 1 has the biggest advantage first, and pieces where mouse 2 has the biggest advantage last.

3. **Strategic assignment**:
   - The first `k` pieces in the sorted list go to mouse 1. These are the pieces where mouse 1 has the strongest advantage (or smallest disadvantage).
   - The remaining `n-k` pieces go to mouse 2. These are the pieces where mouse 2 has the strongest advantage.

4. **Why this works**: This approach maximizes the total score because it minimizes the "opportunity cost" of each assignment. When we give a piece to mouse 1, we're "losing" the `reward2[i]` that mouse 2 could have gotten. By choosing pieces with the largest `reward1[i] - reward2[i]`, we're maximizing what mouse 1 gains relative to what mouse 2 loses.

This is essentially a variation of the "assignment problem" where we want to maximize the sum of selected values under constraints.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def miceAndCheese(reward1, reward2, k):
    """
    Maximize total points by assigning exactly k pieces to mouse 1
    and the rest to mouse 2.

    Args:
        reward1: List[int] - points mouse 1 gets for each cheese
        reward2: List[int] - points mouse 2 gets for each cheese
        k: int - number of pieces mouse 1 must eat

    Returns:
        int - maximum total points
    """
    n = len(reward1)

    # Step 1: Create list of (difference, index) pairs
    # diff = reward1[i] - reward2[i] shows mouse 1's advantage
    differences = []
    for i in range(n):
        diff = reward1[i] - reward2[i]
        differences.append((diff, i))

    # Step 2: Sort by difference in descending order
    # This puts pieces where mouse 1 has biggest advantage first
    differences.sort(reverse=True, key=lambda x: x[0])

    total = 0

    # Step 3: First k pieces go to mouse 1
    # These are the pieces where mouse 1 has strongest advantage
    for i in range(k):
        idx = differences[i][1]  # Get the original index
        total += reward1[idx]    # Mouse 1 eats this piece

    # Step 4: Remaining n-k pieces go to mouse 2
    # These are pieces where mouse 2 has advantage (or mouse 1 has disadvantage)
    for i in range(k, n):
        idx = differences[i][1]  # Get the original index
        total += reward2[idx]    # Mouse 2 eats this piece

    return total
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Maximize total points by assigning exactly k pieces to mouse 1
 * and the rest to mouse 2.
 *
 * @param {number[]} reward1 - points mouse 1 gets for each cheese
 * @param {number[]} reward2 - points mouse 2 gets for each cheese
 * @param {number} k - number of pieces mouse 1 must eat
 * @return {number} - maximum total points
 */
function miceAndCheese(reward1, reward2, k) {
  const n = reward1.length;

  // Step 1: Create array of objects with difference and index
  // diff = reward1[i] - reward2[i] shows mouse 1's advantage
  const differences = [];
  for (let i = 0; i < n; i++) {
    const diff = reward1[i] - reward2[i];
    differences.push({ diff, index: i });
  }

  // Step 2: Sort by difference in descending order
  // This puts pieces where mouse 1 has biggest advantage first
  differences.sort((a, b) => b.diff - a.diff);

  let total = 0;

  // Step 3: First k pieces go to mouse 1
  // These are the pieces where mouse 1 has strongest advantage
  for (let i = 0; i < k; i++) {
    const idx = differences[i].index; // Get the original index
    total += reward1[idx]; // Mouse 1 eats this piece
  }

  // Step 4: Remaining n-k pieces go to mouse 2
  // These are pieces where mouse 2 has advantage
  for (let i = k; i < n; i++) {
    const idx = differences[i].index; // Get the original index
    total += reward2[idx]; // Mouse 2 eats this piece
  }

  return total;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Maximize total points by assigning exactly k pieces to mouse 1
     * and the rest to mouse 2.
     *
     * @param reward1 points mouse 1 gets for each cheese
     * @param reward2 points mouse 2 gets for each cheese
     * @param k number of pieces mouse 1 must eat
     * @return maximum total points
     */
    public int miceAndCheese(int[] reward1, int[] reward2, int k) {
        int n = reward1.length;

        // Step 1: Create array of Cheese objects with difference and index
        // diff = reward1[i] - reward2[i] shows mouse 1's advantage
        Cheese[] cheeses = new Cheese[n];
        for (int i = 0; i < n; i++) {
            int diff = reward1[i] - reward2[i];
            cheeses[i] = new Cheese(diff, i);
        }

        // Step 2: Sort by difference in descending order
        // This puts pieces where mouse 1 has biggest advantage first
        Arrays.sort(cheeses, (a, b) -> b.diff - a.diff);

        int total = 0;

        // Step 3: First k pieces go to mouse 1
        // These are the pieces where mouse 1 has strongest advantage
        for (int i = 0; i < k; i++) {
            int idx = cheeses[i].index;  // Get the original index
            total += reward1[idx];       // Mouse 1 eats this piece
        }

        // Step 4: Remaining n-k pieces go to mouse 2
        // These are pieces where mouse 2 has advantage
        for (int i = k; i < n; i++) {
            int idx = cheeses[i].index;  // Get the original index
            total += reward2[idx];       // Mouse 2 eats this piece
        }

        return total;
    }

    // Helper class to store difference and original index
    class Cheese {
        int diff;
        int index;

        Cheese(int diff, int index) {
            this.diff = diff;
            this.index = index;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating differences: O(n) - we iterate through all n pieces once
- Sorting: O(n log n) - we sort n items by their difference
- Summing rewards: O(n) - we iterate through sorted list to calculate total
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- We store an array of size n to hold the (difference, index) pairs
- The sorting algorithm may use O(log n) to O(n) additional space depending on implementation, but we count the auxiliary data structure as O(n)

## Common Mistakes

1. **Forgetting to track original indices**: If you only store differences and lose track of which piece each difference corresponds to, you won't know which `reward1` or `reward2` value to add. Always store the original index along with the difference.

2. **Sorting rewards instead of differences**: Some candidates try to sort `reward1` in descending order and take the top k. This fails because it ignores that mouse 2 might be much better at those high-reward pieces. The correct approach is to sort by the difference `reward1[i] - reward2[i]`.

3. **Off-by-one errors with k**: When `k = 0` or `k = n`, make sure your loops handle these edge cases correctly. For `k = 0`, mouse 1 gets no pieces (first loop runs 0 times). For `k = n`, mouse 2 gets no pieces (second loop runs 0 times).

4. **Integer overflow with large values**: While not an issue in Python (which has arbitrary precision integers), in Java and JavaScript, be mindful that rewards could be large. However, the problem constraints typically keep values within safe ranges.

## When You'll See This Pattern

This "difference sorting" pattern appears in various assignment and scheduling problems:

1. **Two City Scheduling** (LeetCode 1029): You need to send `n` people to two cities, with exactly `n/2` to each city. Each person has different costs for each city. The optimal solution sorts by the difference in costs.

2. **Maximum Performance of a Team** (LeetCode 1383): You need to select `k` engineers to maximize performance, where each engineer has speed and efficiency. The solution involves sorting by efficiency and using a min-heap to track speeds.

3. **Course Schedule III** (LeetCode 630): You need to schedule courses with durations and deadlines to maximize the number taken. The solution involves sorting by deadlines and using a max-heap to replace courses when needed.

The common theme is making optimal selections under constraints by sorting based on a key metric (difference, efficiency, deadline) and then making greedy choices.

## Key Takeaways

1. **Think in terms of opportunity cost**: When assigning resources between two options, calculate what you gain vs. what you give up. The difference `reward1[i] - reward2[i]` represents the net benefit of choosing option 1 over option 2.

2. **Sorting enables greedy selection**: Many optimization problems become tractable when you sort items by a relevant metric. This transforms an exponential search space into a linear traversal.

3. **Constraint-driven assignment**: When you have exact counts (like "exactly k items to mouse 1"), consider approaches that let you pick the top k items after sorting by an appropriate criterion.

Related problems: [House Robber](/problem/house-robber)
