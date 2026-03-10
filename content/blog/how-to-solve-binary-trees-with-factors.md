---
title: "How to Solve Binary Trees With Factors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Trees With Factors. Medium difficulty, 53.1% acceptance rate. Topics: Array, Hash Table, Dynamic Programming, Sorting."
date: "2026-07-27"
category: "dsa-patterns"
tags: ["binary-trees-with-factors", "array", "hash-table", "dynamic-programming", "medium"]
---

# How to Solve Binary Trees With Factors

You're given an array of unique integers greater than 1, and you need to count how many binary trees can be formed where each non-leaf node equals the product of its two children. The tricky part is that numbers can be reused as children, and you need to count all possible tree structures efficiently.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [2, 4, 5, 10]`

We want to count all possible binary trees where:

1. Each node value comes from the array
2. Non-leaf nodes equal the product of their two children
3. Numbers can be reused

**Step-by-step reasoning:**

1. **Sort the array first:** `[2, 4, 5, 10]` (this helps us process smaller numbers first)
2. **Initialize counts:** Each number can form at least one tree (just itself as a leaf)
   - `dp[2] = 1` (just the single node tree with value 2)
   - `dp[4] = 1` (just the single node tree with value 4)
   - `dp[5] = 1` (just the single node tree with value 5)
   - `dp[10] = 1` (just the single node tree with value 10)

3. **Process 4:** Check if 4 can be formed from smaller factors in the array
   - Factors of 4: 2 × 2 = 4 (both 2 and 2 are in the array)
   - So 4 can be formed as a parent with two children of value 2
   - Number of trees with 4 as root = `dp[2] × dp[2] = 1 × 1 = 1`
   - Total `dp[4] = 1 + 1 = 2` (single node + this new tree)

4. **Process 10:** Check if 10 can be formed from smaller factors
   - Factors of 10: 2 × 5 = 10 (both 2 and 5 are in the array)
   - Number of trees with 10 as root = `dp[2] × dp[5] = 1 × 1 = 1`
   - Total `dp[10] = 1 + 1 = 2`

5. **Final count:** Sum all dp values = `1 + 2 + 1 + 2 = 6`

The 6 trees are:

- Four single-node trees: [2], [4], [5], [10]
- One tree with root 4 and children 2,2
- One tree with root 10 and children 2,5

## Brute Force Approach

A naive approach would try to generate all possible trees recursively. For each number, you could:

1. Try all pairs of numbers that multiply to it
2. Recursively build trees for those children
3. Count all combinations

The problem with this approach is **exponential time complexity**. For an array of size n, you'd need to:

- Check all pairs (O(n²) for each number)
- Recursively explore all possible subtrees
- Handle duplicates and reuse of numbers

This quickly becomes infeasible even for moderately sized arrays. The brute force would have factorial-like growth because you're essentially enumerating all possible tree structures.

## Optimized Approach

The key insight is to use **dynamic programming with sorting**:

1. **Sort the array** so we process numbers from smallest to largest. This ensures that when we check if a number can be formed as a product, its potential factors have already been processed.

2. **Use a hash map** to store the number of binary trees that can have each value as the root. Initialize each value to 1 (the single node tree).

3. **For each number**, check all smaller numbers to see if they divide it evenly. If `arr[j]` divides `arr[i]` and the quotient is also in our array, then we've found a valid pair of children.

4. **The recurrence relation**: If `arr[i] = arr[j] × complement` and both factors are in the array, then:

   ```
   dp[arr[i]] += dp[arr[j]] × dp[complement]
   ```

   We multiply because for each way to form the left child and each way to form the right child, we get a new tree.

5. **Modulo operation**: Since the count can be huge, we use modulo `10^9 + 7` as specified in the problem.

The sorting is crucial because it ensures that when we process `arr[i]`, all possible factors (which must be smaller) have already been processed and their dp values are available.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def numFactoredBinaryTrees(arr):
    """
    Count the number of binary trees where each non-leaf node equals
    the product of its two children.
    """
    MOD = 10**9 + 7
    n = len(arr)

    # Sort the array to process smaller numbers first
    arr.sort()

    # Create a dictionary for O(1) lookups
    index = {x: i for i, x in enumerate(arr)}

    # dp[i] = number of binary trees with arr[i] as root
    dp = [1] * n  # Each number can at least be a single node tree

    # Process each number from smallest to largest
    for i in range(n):
        current = arr[i]

        # Check all possible smaller factors
        for j in range(i):
            # If arr[j] divides current evenly
            if current % arr[j] == 0:
                complement = current // arr[j]

                # Check if the complement is also in the array
                if complement in index:
                    # Both factors exist, so we can form current as parent
                    # Multiply dp values because each left tree can pair with each right tree
                    dp[i] = (dp[i] + dp[j] * dp[index[complement]]) % MOD

    # Sum all dp values and return modulo MOD
    return sum(dp) % MOD
```

```javascript
// Time: O(n²) | Space: O(n)
function numFactoredBinaryTrees(arr) {
  const MOD = 10 ** 9 + 7;
  const n = arr.length;

  // Sort the array to process smaller numbers first
  arr.sort((a, b) => a - b);

  // Create a map for O(1) lookups
  const index = new Map();
  for (let i = 0; i < n; i++) {
    index.set(arr[i], i);
  }

  // dp[i] = number of binary trees with arr[i] as root
  const dp = new Array(n).fill(1); // Each number can at least be a single node tree

  // Process each number from smallest to largest
  for (let i = 0; i < n; i++) {
    const current = arr[i];

    // Check all possible smaller factors
    for (let j = 0; j < i; j++) {
      // If arr[j] divides current evenly
      if (current % arr[j] === 0) {
        const complement = current / arr[j];

        // Check if the complement is also in the array
        if (index.has(complement)) {
          // Both factors exist, so we can form current as parent
          // Multiply dp values because each left tree can pair with each right tree
          const k = index.get(complement);
          dp[i] = (dp[i] + dp[j] * dp[k]) % MOD;
        }
      }
    }
  }

  // Sum all dp values and return modulo MOD
  let total = 0;
  for (let count of dp) {
    total = (total + count) % MOD;
  }
  return total;
}
```

```java
// Time: O(n²) | Space: O(n)
import java.util.*;

class Solution {
    public int numFactoredBinaryTrees(int[] arr) {
        final int MOD = 1_000_000_007;
        int n = arr.length;

        // Sort the array to process smaller numbers first
        Arrays.sort(arr);

        // Create a map for O(1) lookups
        Map<Integer, Integer> index = new HashMap<>();
        for (int i = 0; i < n; i++) {
            index.put(arr[i], i);
        }

        // dp[i] = number of binary trees with arr[i] as root
        long[] dp = new long[n];
        Arrays.fill(dp, 1);  // Each number can at least be a single node tree

        // Process each number from smallest to largest
        for (int i = 0; i < n; i++) {
            int current = arr[i];

            // Check all possible smaller factors
            for (int j = 0; j < i; j++) {
                // If arr[j] divides current evenly
                if (current % arr[j] == 0) {
                    int complement = current / arr[j];

                    // Check if the complement is also in the array
                    if (index.containsKey(complement)) {
                        // Both factors exist, so we can form current as parent
                        // Multiply dp values because each left tree can pair with each right tree
                        int k = index.get(complement);
                        dp[i] = (dp[i] + dp[j] * dp[k]) % MOD;
                    }
                }
            }
        }

        // Sum all dp values and return modulo MOD
        long total = 0;
        for (long count : dp) {
            total = (total + count) % MOD;
        }
        return (int) total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting the array takes O(n log n)
- The nested loops take O(n²): For each of n elements, we check up to i smaller elements
- The hash map lookups are O(1) on average
- Overall, O(n²) dominates

**Space Complexity: O(n)**

- We store the dp array of size n
- We store the hash map of size n for O(1) lookups
- The sorting may use O(log n) to O(n) additional space depending on the language implementation

## Common Mistakes

1. **Forgetting to sort the array**: This is the most critical step. Without sorting, you can't guarantee that when you process a number, its potential factors have already been processed. The dynamic programming approach relies on this ordering.

2. **Not handling the modulo correctly**: The counts can grow very large (exponential in n), so you must apply modulo `10^9 + 7` at each addition/multiplication, not just at the end. Otherwise, you'll get integer overflow.

3. **Counting duplicates**: When both factors are the same (like 2 × 2 = 4), candidates sometimes double-count. Our approach handles this correctly because we only iterate j up to i, and when complement equals arr[j], we're using the same dp value twice in the multiplication.

4. **Missing the base case**: Each number should start with count 1 (the single node tree). Forgetting this means you'll miss all the simplest trees.

## When You'll See This Pattern

This problem combines **dynamic programming** with **factorization** and **combinatorial counting**. You'll see similar patterns in:

1. **Coin Change (LeetCode 322/518)**: Counting ways to make change using coins - similar combinatorial DP where you build up solutions from smaller subproblems.

2. **Perfect Squares (LeetCode 279)**: Finding the minimum number of perfect squares that sum to n - uses DP to build up from smaller numbers.

3. **Integer Break (LeetCode 343)**: Maximizing product by breaking integer into sum of positive integers - involves considering factors of numbers.

The core pattern is: when you need to count combinations or build solutions from smaller pieces, and the problem has optimal substructure (solutions can be built from solutions to subproblems), dynamic programming is often the right approach.

## Key Takeaways

1. **Sorting enables DP**: When you need to process elements in increasing order to ensure subproblems are solved first, sorting is a powerful preprocessing step.

2. **Combinatorial DP often involves multiplication**: When counting combinations where you need to pair independent choices (like left and right subtrees), you multiply the counts rather than add them.

3. **Hash maps provide O(1) factor lookup**: When you need to quickly check if a complement exists in the array, a hash map is essential for efficiency.

[Practice this problem on CodeJeet](/problem/binary-trees-with-factors)
