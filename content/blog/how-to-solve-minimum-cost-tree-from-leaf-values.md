---
title: "How to Solve Minimum Cost Tree From Leaf Values — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost Tree From Leaf Values. Medium difficulty, 67.8% acceptance rate. Topics: Array, Dynamic Programming, Stack, Greedy, Monotonic Stack."
date: "2027-02-13"
category: "dsa-patterns"
tags: ["minimum-cost-tree-from-leaf-values", "array", "dynamic-programming", "stack", "medium"]
---

# How to Solve Minimum Cost Tree From Leaf Values

This problem asks us to build a binary tree where all non-leaf nodes have exactly two children, the leaf values appear in-order as the given array, and the value of each non-leaf node equals the product of the largest leaf values in its left and right subtrees. Our goal is to minimize the sum of all non-leaf node values. The tricky part is that while the leaf order is fixed, we can choose how to group them into subtrees, which dramatically affects the total cost.

## Visual Walkthrough

Let's trace through a small example: `arr = [6, 2, 4]`.

We need to arrange these leaves into a full binary tree (every node has 0 or 2 children). The leaves must appear in-order as `[6, 2, 4]`. There are two possible groupings:

**Option 1:** `(6 * 4) + (6 * 2)`

- Group 2 and 4 first: `2 * 4 = 8` (new parent node)
- Then combine with 6: `6 * 4 = 24` (root node, using max(6) and max(2,4)=4)
- Total cost: `8 + 24 = 32`

**Option 2:** `(6 * 2) + (4 * 2)`

- Group 6 and 2 first: `6 * 2 = 12` (new parent node)
- Then combine with 4: `4 * 2 = 8` (root node, using max(6,2)=6 and max(4)=4? Wait, careful!)
- Actually, for the root: left subtree has leaves [6,2] with max=6, right subtree has leaf [4] with max=4
- So root value = `6 * 4 = 24`
- Total cost: `12 + 24 = 36`

Wait, I made a mistake in Option 2. Let's visualize the trees properly:

Option 1 (right-heavy):

```
     24
    /  \
   6    8
       / \
      2   4
```

Cost: `6*4 (24) + 2*4 (8) = 32`

Option 2 (left-heavy):

```
     24
    /  \
   12   4
  /  \
 6    2
```

Cost: `6*2 (12) + 6*4 (24) = 36`

So the minimum cost is 32. Notice the pattern: we want to pair smaller leaves together first to avoid multiplying large numbers multiple times. The 2 (smallest) gets paired with 4 first, not with 6.

## Brute Force Approach

A brute force solution would try all possible binary tree structures with the given in-order leaf sequence. For n leaves, the number of possible full binary trees is given by the Catalan numbers C\_{n-1}, which grows exponentially (roughly O(4^n/n^{1.5})).

We could implement this using recursion: at each step, choose a split point k, recursively build left subtree with leaves arr[i:k+1] and right subtree with leaves arr[k+1:j+1]. The cost for this split would be `max(left_subtree) * max(right_subtree) + recursive_cost(left) + recursive_cost(right)`.

The problem with this approach is obvious: exponential time complexity. For n=20, there are already over 10^6 possible trees. The constraints (arr.length up to 40) make this completely infeasible.

## Optimized Approach

The key insight is that this problem has optimal substructure: the optimal solution for the whole array can be built from optimal solutions for subarrays. This suggests dynamic programming.

**DP State:** Let `dp[i][j]` be the minimum cost to build a tree from leaves `arr[i..j]`.

**DP Transition:** For each possible root position k (where i ≤ k < j):

```
dp[i][j] = min(
    dp[i][k] + dp[k+1][j] + max(arr[i..k]) * max(arr[k+1..j])
)
```

We need to precompute or efficiently get the maximum value in any subarray.

**Even Better Insight (Greedy with Stack):**
There's actually a greedy O(n) solution! Notice that in our example `[6, 2, 4]`, we removed the smallest leaf (2) by pairing it with its smaller neighbor (4 rather than 6). This suggests a general strategy: repeatedly remove the smallest leaf by pairing it with its smaller neighbor, adding the product to our total cost.

Why does this work? Each non-leaf node's value is the product of the maximum leaf values from its left and right subtrees. When we remove a leaf (by making it part of a subtree), it will only contribute to one product: with the smaller of its two neighbors. We want to remove smaller leaves first because they create smaller products.

This leads to the monotonic decreasing stack approach:

1. Maintain a stack of leaf values in decreasing order
2. For each new leaf, while it's larger than the stack top, pop the stack (remove that leaf by pairing it with the smaller of its two neighbors)
3. Add the product to total cost
4. Push the new leaf onto stack
5. Finally, combine remaining leaves in the stack

## Optimal Solution

Here's the O(n) greedy solution using a monotonic stack:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def mctFromLeafValues(arr):
    """
    Build minimum cost tree using greedy approach with monotonic decreasing stack.
    Key insight: Always remove the smallest leaf by pairing it with its smaller neighbor.
    """
    stack = []
    total_cost = 0

    for current in arr:
        # While current leaf is larger than stack top, we can create a subtree
        # by pairing the stack top with its smaller neighbor
        while stack and stack[-1] <= current:
            # Pop the smaller leaf from stack
            mid = stack.pop()

            # Determine the smaller neighbor for pairing
            # If stack is empty, the only neighbor is current
            # Otherwise, choose the smaller of left neighbor (stack[-1]) and right neighbor (current)
            left = stack[-1] if stack else float('inf')
            total_cost += mid * min(left, current)

        # Push current leaf onto stack (maintaining decreasing order)
        stack.append(current)

    # Combine remaining leaves in stack (they're in decreasing order)
    # Pair each leaf with its left neighbor
    while len(stack) > 1:
        # Pop the rightmost leaf and pair with its left neighbor
        right = stack.pop()
        left = stack[-1]
        total_cost += left * right

    return total_cost
```

```javascript
// Time: O(n) | Space: O(n)
function mctFromLeafValues(arr) {
  /**
   * Build minimum cost tree using greedy approach with monotonic decreasing stack.
   * Key insight: Always remove the smallest leaf by pairing it with its smaller neighbor.
   */
  const stack = [];
  let totalCost = 0;

  for (const current of arr) {
    // While current leaf is larger than stack top, we can create a subtree
    // by pairing the stack top with its smaller neighbor
    while (stack.length > 0 && stack[stack.length - 1] <= current) {
      // Pop the smaller leaf from stack
      const mid = stack.pop();

      // Determine the smaller neighbor for pairing
      // If stack is empty, the only neighbor is current
      // Otherwise, choose the smaller of left neighbor (stack[-1]) and right neighbor (current)
      const left = stack.length > 0 ? stack[stack.length - 1] : Infinity;
      totalCost += mid * Math.min(left, current);
    }

    // Push current leaf onto stack (maintaining decreasing order)
    stack.push(current);
  }

  // Combine remaining leaves in stack (they're in decreasing order)
  // Pair each leaf with its left neighbor
  while (stack.length > 1) {
    // Pop the rightmost leaf and pair with its left neighbor
    const right = stack.pop();
    const left = stack[stack.length - 1];
    totalCost += left * right;
  }

  return totalCost;
}
```

```java
// Time: O(n) | Space: O(n)
public int mctFromLeafValues(int[] arr) {
    /**
     * Build minimum cost tree using greedy approach with monotonic decreasing stack.
     * Key insight: Always remove the smallest leaf by pairing it with its smaller neighbor.
     */
    Stack<Integer> stack = new Stack<>();
    int totalCost = 0;

    for (int current : arr) {
        // While current leaf is larger than stack top, we can create a subtree
        // by pairing the stack top with its smaller neighbor
        while (!stack.isEmpty() && stack.peek() <= current) {
            // Pop the smaller leaf from stack
            int mid = stack.pop();

            // Determine the smaller neighbor for pairing
            // If stack is empty, the only neighbor is current
            // Otherwise, choose the smaller of left neighbor (stack[-1]) and right neighbor (current)
            int left = stack.isEmpty() ? Integer.MAX_VALUE : stack.peek();
            totalCost += mid * Math.min(left, current);
        }

        // Push current leaf onto stack (maintaining decreasing order)
        stack.push(current);
    }

    // Combine remaining leaves in stack (they're in decreasing order)
    // Pair each leaf with its left neighbor
    while (stack.size() > 1) {
        // Pop the rightmost leaf and pair with its left neighbor
        int right = stack.pop();
        int left = stack.peek();
        totalCost += left * right;
    }

    return totalCost;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each element once when pushing onto the stack
- Each element is popped at most once from the stack
- The while loop inside the for loop doesn't make it O(n²) because each element enters and exits the stack exactly once
- Total operations: O(2n) = O(n)

**Space Complexity:** O(n)

- In the worst case, the stack could contain all elements (when array is strictly decreasing)
- This gives us O(n) space usage

## Common Mistakes

1. **Using the wrong comparison in the while loop:** Some candidates use `stack[-1] < current` instead of `stack[-1] <= current`. This fails for equal values. If we have `[3, 3, 3]`, we need to process all equal values to build the optimal tree.

2. **Forgetting to handle the final stack cleanup:** After processing all leaves, we need to combine the remaining leaves in the stack. These are in decreasing order, so we pair from right to left. Missing this step gives incorrect results.

3. **Incorrect neighbor selection when popping:** When we pop `mid`, we need to pair it with the smaller of its two neighbors (left from stack or right which is `current`). Some candidates always pair with `current`, which fails for cases like `[6, 2, 4]` where 2 should pair with 4, not 6.

4. **Trying to implement the O(n³) DP without optimization:** The DP solution with precomputed max tables is O(n³), which is too slow for n=40 (40³ = 64,000 operations, which might pass but the greedy O(n) is better). Candidates waste time implementing the slower DP when the greedy solution is simpler and faster.

## When You'll See This Pattern

This "monotonic stack with greedy removal" pattern appears in several problems:

1. **Largest Rectangle in Histogram (LeetCode 84)** - Uses monotonic stack to find the next smaller element on both sides, similar to how we find neighbors here.

2. **Remove K Digits (LeetCode 402)** - Greedily remove digits while maintaining monotonic property to get smallest number.

3. **Sum of Subarray Minimums (LeetCode 907)** - Uses monotonic stack to find contribution of each element as a minimum in subarrays.

4. **Trapping Rain Water (LeetCode 42)** - While different, it also uses the concept of finding boundaries (like our left and right neighbors) to calculate contributions.

The common theme: when you need to process elements while considering their relationship with neighbors, and you want to remove/process elements in a certain order, monotonic stacks are often the answer.

## Key Takeaways

1. **Greedy with monotonic stack works when local optimal choices lead to global optimum.** Here, always removing the smallest leaf by pairing with its smaller neighbor gives the global minimum cost.

2. **Visualize the problem as removing elements.** Sometimes reformulating a "building" problem as a "removal" problem reveals the greedy strategy. Instead of building the tree bottom-up, think about removing leaves from the array.

3. **Monotonic stacks excel at finding next greater/smaller elements.** When you need to compare each element with its neighbors in a way that depends on relative values, consider a monotonic stack.

[Practice this problem on CodeJeet](/problem/minimum-cost-tree-from-leaf-values)
