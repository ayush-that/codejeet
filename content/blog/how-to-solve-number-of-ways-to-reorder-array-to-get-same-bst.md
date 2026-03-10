---
title: "How to Solve Number of Ways to Reorder Array to Get Same BST — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Reorder Array to Get Same BST. Hard difficulty, 54.0% acceptance rate. Topics: Array, Math, Divide and Conquer, Dynamic Programming, Tree."
date: "2028-04-04"
category: "dsa-patterns"
tags:
  ["number-of-ways-to-reorder-array-to-get-same-bst", "array", "math", "divide-and-conquer", "hard"]
---

# How to Solve Number of Ways to Reorder Array to Get Same BST

This problem asks: given an array representing a BST insertion order, how many other insertion orders produce the exact same BST structure? The challenge is that we can't just count permutations—we need to respect the BST property where left subtree elements must appear before the root in some relative ordering, but can be interleaved with right subtree elements in specific ways.

## Visual Walkthrough

Let's trace through `nums = [3,4,5,1,2]`:

1. **Build the BST**: Insert 3 (root), then 4 (right of 3), then 5 (right of 4), then 1 (left of 3), then 2 (right of 1). The BST structure is fixed: root=3, left child=1 with right child=2, right child=4 with right child=5.

2. **Key insight**: For the BST to be identical, the root (3) must always be inserted first. After that:
   - Elements smaller than 3 (`[1,2]`) go to the left subtree
   - Elements larger than 3 (`[4,5]`) go to the right subtree
   - The relative order within each subtree must be preserved (1 before 2, 4 before 5)
   - But we can interleave left and right subtree elements!

3. **Counting interleavings**: With 2 left elements and 2 right elements, how many ways to interleave them while preserving internal orders?
   - Left sequence: `[1,2]` (order fixed)
   - Right sequence: `[4,5]` (order fixed)
   - We need to choose positions for left elements among 4 total positions: C(4,2) = 6 ways
   - Example interleaving: `[1,4,2,5]` (valid), `[4,1,5,2]` (valid), `[1,2,4,5]` (valid)

4. **Recursive nature**: Within each subtree, the same logic applies! For left subtree `[1,2]`:
   - Root 1 must come first
   - Left of 1: `[]`
   - Right of 1: `[2]`
   - Interleavings: C(1,0) = 1 way
   - Multiply with parent count: 6 × 1 = 6

5. **Final count**: 6 ways for the top level × 1 way for left subtree × 1 way for right subtree = 6 total reorderings.

## Brute Force Approach

A naive approach would generate all permutations of `nums`, build a BST from each, and compare structures. For n=10, that's 3.6 million permutations—completely infeasible for n up to 1000.

Even a smarter brute force that only permutes valid interleavings would still be exponential. The key issue is that we're counting combinatorial possibilities, not checking each one individually.

## Optimized Approach

The optimal solution combines **divide-and-conquer** with **combinatorial mathematics**:

1. **Recursive structure**: The root is always the first element. Partition remaining elements into left (smaller) and right (larger) subtrees.

2. **Interleaving count**: For m left elements and n right elements, we can interleave them in C(m+n, m) ways while preserving internal orders. This is because we choose m positions out of (m+n) for the left elements.

3. **Independent subtrees**: The left and right subtrees are independent—their internal reorderings multiply with the interleaving count.

4. **Dynamic programming for combinations**: We need combinations modulo MOD = 10^9+7 for large n. Precompute Pascal's triangle using DP: `C[n][k] = C[n-1][k-1] + C[n-1][k]`.

5. **Recursive formula**:
   ```
   ways(root) = C(m+n, m) × ways(left) × ways(right)
   where m = len(left), n = len(right)
   ```

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
MOD = 10**9 + 7

class Solution:
    def numOfWays(self, nums: List[int]) -> int:
        # Precompute combinations C[n][k] using Pascal's triangle
        n = len(nums)
        C = [[0] * (n + 1) for _ in range(n + 1)]
        for i in range(n + 1):
            C[i][0] = C[i][i] = 1
            for j in range(1, i):
                C[i][j] = (C[i-1][j-1] + C[i-1][j]) % MOD

        def dfs(arr):
            """Return number of ways to reorder arr to get same BST"""
            if len(arr) <= 2:
                return 1  # Only one possible ordering for 0, 1, or 2 elements

            root = arr[0]
            left = [x for x in arr if x < root]   # Elements for left subtree
            right = [x for x in arr if x > root]  # Elements for right subtree

            # Recursively compute ways for left and right subtrees
            ways_left = dfs(left)
            ways_right = dfs(right)

            # Number of interleavings: C(len(left)+len(right), len(left))
            interleavings = C[len(left) + len(right)][len(left)]

            # Total ways = interleavings × ways_left × ways_right
            return (interleavings * ways_left % MOD) * ways_right % MOD

        # Subtract 1 to exclude the original ordering
        return (dfs(nums) - 1) % MOD
```

```javascript
// Time: O(n^2) | Space: O(n^2)
const MOD = 1_000_000_007;

var numOfWays = function (nums) {
  const n = nums.length;

  // Precompute combinations C[n][k] using Pascal's triangle
  const C = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    C[i][0] = C[i][i] = 1;
    for (let j = 1; j < i; j++) {
      C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
    }
  }

  const dfs = (arr) => {
    // Base case: 0, 1, or 2 elements have only one valid ordering
    if (arr.length <= 2) return 1;

    const root = arr[0];
    const left = arr.filter((x) => x < root); // Elements for left subtree
    const right = arr.filter((x) => x > root); // Elements for right subtree

    // Recursively compute ways for subtrees
    const waysLeft = dfs(left);
    const waysRight = dfs(right);

    // Number of interleavings: C(left.length + right.length, left.length)
    const interleavings = C[left.length + right.length][left.length];

    // Total ways = interleavings × waysLeft × waysRight
    return Number(
      (((BigInt(interleavings) * BigInt(waysLeft)) % BigInt(MOD)) * BigInt(waysRight)) % BigInt(MOD)
    );
  };

  // Subtract 1 to exclude the original ordering
  return (dfs(nums) - 1 + MOD) % MOD;
};
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    private static final int MOD = 1_000_000_007;
    private long[][] C;

    public int numOfWays(int[] nums) {
        int n = nums.length;

        // Precompute combinations C[n][k] using Pascal's triangle
        C = new long[n + 1][n + 1];
        for (int i = 0; i <= n; i++) {
            C[i][0] = C[i][i] = 1;
            for (int j = 1; j < i; j++) {
                C[i][j] = (C[i-1][j-1] + C[i-1][j]) % MOD;
            }
        }

        List<Integer> arr = new ArrayList<>();
        for (int num : nums) arr.add(num);

        // Subtract 1 to exclude the original ordering
        return (int)((dfs(arr) - 1 + MOD) % MOD);
    }

    private long dfs(List<Integer> arr) {
        // Base case: 0, 1, or 2 elements have only one valid ordering
        if (arr.size() <= 2) return 1;

        int root = arr.get(0);
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();

        // Partition elements into left and right subtrees
        for (int i = 1; i < arr.size(); i++) {
            int val = arr.get(i);
            if (val < root) left.add(val);
            else right.add(val);  // val > root (all elements are distinct)
        }

        // Recursively compute ways for subtrees
        long waysLeft = dfs(left);
        long waysRight = dfs(right);

        // Number of interleavings: C(left.size() + right.size(), left.size())
        long interleavings = C[left.size() + right.size()][left.size()];

        // Total ways = interleavings × waysLeft × waysRight
        return (interleavings * waysLeft % MOD) * waysRight % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²)

- Building Pascal's triangle: O(n²)
- Recursive DFS: Each element is processed once at each level of recursion, but with array partitioning (O(n) per node), total is O(n²) in worst case (skewed tree)
- Overall: O(n²) dominates

**Space Complexity**: O(n²)

- Pascal's triangle storage: O(n²)
- Recursion stack: O(n) in worst case (skewed tree)
- Temporary arrays for partitioning: O(n) but garbage collected

## Common Mistakes

1. **Forgetting modulo operations**: The result grows exponentially (n! possible), so intermediate calculations overflow 64-bit integers. Must apply modulo after each multiplication.

2. **Incorrect combination calculation**: Using factorial formula `n!/(k!(n-k)!)` causes overflow and is inefficient. Pascal's triangle with modulo is the right approach.

3. **Not handling empty subtrees**: When left or right subtree is empty, `C(m+n, m)` should be 1 (only one way to arrange nothing). The base case `arr.length <= 2` handles this.

4. **Including the original ordering**: The problem asks for "different ways" excluding the original. Remember to subtract 1 at the end.

## When You'll See This Pattern

This **divide-and-conquer with combinatorics** pattern appears in problems where:

1. The structure has recursive independence (trees, partitions)
2. You need to count configurations, not just find one
3. The count involves combining independent subproblems

Related LeetCode problems:

- **96. Unique Binary Search Trees**: Count BST structures (Catalan numbers)
- **95. Unique Binary Search Trees II**: Generate all BSTs (similar recursive structure)
- **241. Different Ways to Add Parentheses**: Divide expression and combine results

## Key Takeaways

1. **BST insertion order constraints**: The root comes first, then left/right subtrees can be interleaved while preserving internal orders. This gives the `C(m+n, m)` factor.

2. **Recursive independence**: Left and right subtree reorderings are independent—multiply their counts rather than add.

3. **Precompute combinations**: For combinatorial counting modulo large primes, Pascal's triangle with DP is more efficient than factorial formulas.

[Practice this problem on CodeJeet](/problem/number-of-ways-to-reorder-array-to-get-same-bst)
