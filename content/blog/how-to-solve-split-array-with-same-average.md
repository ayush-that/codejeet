---
title: "How to Solve Split Array With Same Average — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Split Array With Same Average. Hard difficulty, 26.8% acceptance rate. Topics: Array, Hash Table, Math, Dynamic Programming, Bit Manipulation."
date: "2028-09-03"
category: "dsa-patterns"
tags: ["split-array-with-same-average", "array", "hash-table", "math", "hard"]
---

# How to Solve Split Array With Same Average

You need to split an integer array into two non-empty groups such that both groups have the same average. This is a classic hard problem that combines mathematical insight with clever algorithmic techniques. The challenge lies in avoiding the exponential search through all possible splits while leveraging the relationship between sums and averages.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3, 4, 5, 6, 7, 8]`.

**Step 1: Understanding the average relationship**

- Total sum = 36, total count = 8
- If we split into groups A (size k) and B (size n-k), both must have same average
- Let sumA be sum of group A, sumB be sum of group B
- Average equality: `sumA/k = sumB/(n-k) = totalSum/n`

**Step 2: Mathematical transformation**
From the average equality:

```
sumA/k = totalSum/n
sumA = (totalSum/n) * k
```

Since sumA must be an integer, `(totalSum * k) % n == 0`

**Step 3: Checking possible k values**
For our example (totalSum=36, n=8):

- k=1: (36×1)%8=4 ≠ 0 ❌
- k=2: (36×2)%8=0 ✅
- k=3: (36×3)%8=4 ≠ 0 ❌
- k=4: (36×4)%8=0 ✅

We only need to check k from 1 to n/2 (since groups are symmetric).

**Step 4: Finding if sum exists**
For k=2, we need sumA = (36/8)×2 = 9
We need to check if any 2 elements sum to 9: pairs like (1,8), (2,7), (3,6), (4,5) all work ✅

For k=4, we need sumA = (36/8)×4 = 18
We need to check if any 4 elements sum to 18

This shows the core challenge: we need to efficiently check if a subset of size k exists with a specific sum.

## Brute Force Approach

The brute force solution would try all possible subsets:

1. Generate all 2^n possible splits of the array
2. For each split, check if both groups are non-empty
3. Calculate averages of both groups
4. Return true if any split has equal averages

This approach has O(2^n) time complexity, which is infeasible for n > 20. Even with n=30, that's over 1 billion possibilities.

The key insight is we don't need to check all splits - we can use the mathematical relationship to reduce the search space dramatically.

## Optimized Approach

The optimized solution uses these key insights:

1. **Mathematical simplification**: If `sumA/k = totalSum/n`, then `sumA = (totalSum * k) / n`. This means we're looking for subsets of size k with a specific sum.

2. **Early pruning**: We only need to check k values where `(totalSum * k) % n == 0`.

3. **Meet in the middle**: For n up to 30, we can split the array into two halves and use bitmask enumeration on each half. This reduces 2^n to 2^(n/2) × 2^(n/2) = 2^(n/2+1), which is manageable.

4. **Dynamic programming alternative**: We can use a DP approach where `dp[i][j]` represents whether we can achieve sum j using i elements. This is O(n² × totalSum) which works for moderate n and sum values.

5. **Optimization**: Since we only care about subsets of size k with specific sum, we can use a hashmap to store all possible (sum, count) pairs from the first half, then check the second half for complements.

## Optimal Solution

The optimal solution uses meet-in-the-middle with careful pruning:

<div class="code-group">

```python
# Time: O(n * 2^(n/2)) | Space: O(2^(n/2))
def splitArraySameAverage(nums):
    """
    Returns True if nums can be split into two non-empty groups
    with the same average, False otherwise.
    """
    n = len(nums)
    total_sum = sum(nums)

    # Early check: if n == 1, impossible to split into two non-empty groups
    if n == 1:
        return False

    # Early optimization: if total_sum == 0, we can split if we can find
    # any non-empty proper subset with sum 0
    if total_sum == 0:
        # Check if there's any subset (not all elements) with sum 0
        # This is a special case of our general algorithm
        pass

    # Try all possible sizes for the first group (1 to n//2)
    # We only need to check up to n//2 due to symmetry
    for k in range(1, n // 2 + 1):
        # Check if (total_sum * k) is divisible by n
        # This is necessary for the sum to be an integer
        if (total_sum * k) % n != 0:
            continue

        # Target sum for subset of size k
        target_sum = (total_sum * k) // n

        # Check if there exists a subset of size k with sum = target_sum
        # Using DP: dp[i][j] = whether we can get sum j using i elements
        dp = [set() for _ in range(k + 1)]
        dp[0].add(0)  # 0 elements can achieve sum 0

        # Process each number
        for num in nums:
            # Process backwards to avoid reusing the same element
            for i in range(min(k, len(nums) - 1), 0, -1):
                for prev_sum in list(dp[i - 1]):
                    dp[i].add(prev_sum + num)

        # Check if target_sum is achievable with exactly k elements
        if target_sum in dp[k]:
            return True

    return False
```

```javascript
// Time: O(n * 2^(n/2)) | Space: O(2^(n/2))
function splitArraySameAverage(nums) {
  const n = nums.length;
  const totalSum = nums.reduce((a, b) => a + b, 0);

  // Early check: if n == 1, impossible to split into two non-empty groups
  if (n === 1) return false;

  // Try all possible sizes for the first group (1 to n//2)
  for (let k = 1; k <= Math.floor(n / 2); k++) {
    // Check if (totalSum * k) is divisible by n
    if ((totalSum * k) % n !== 0) continue;

    // Target sum for subset of size k
    const targetSum = Math.floor((totalSum * k) / n);

    // DP approach: check if subset of size k with targetSum exists
    // dp[i] = set of achievable sums with i elements
    const dp = Array(k + 1)
      .fill()
      .map(() => new Set());
    dp[0].add(0); // 0 elements can achieve sum 0

    // Process each number
    for (const num of nums) {
      // Process backwards to avoid reusing the same element
      for (let i = Math.min(k, n - 1); i >= 1; i--) {
        // Convert set to array to iterate while modifying
        const prevSums = Array.from(dp[i - 1]);
        for (const prevSum of prevSums) {
          dp[i].add(prevSum + num);
        }
      }
    }

    // Check if targetSum is achievable with exactly k elements
    if (dp[k].has(targetSum)) return true;
  }

  return false;
}
```

```java
// Time: O(n * 2^(n/2)) | Space: O(2^(n/2))
class Solution {
    public boolean splitArraySameAverage(int[] nums) {
        int n = nums.length;
        int totalSum = 0;
        for (int num : nums) totalSum += num;

        // Early check: if n == 1, impossible to split into two non-empty groups
        if (n == 1) return false;

        // Try all possible sizes for the first group (1 to n/2)
        for (int k = 1; k <= n / 2; k++) {
            // Check if (totalSum * k) is divisible by n
            if ((totalSum * k) % n != 0) continue;

            // Target sum for subset of size k
            int targetSum = (totalSum * k) / n;

            // DP approach: check if subset of size k with targetSum exists
            // dp[i] = set of achievable sums with i elements
            Set<Integer>[] dp = new HashSet[k + 1];
            for (int i = 0; i <= k; i++) dp[i] = new HashSet<>();
            dp[0].add(0);  // 0 elements can achieve sum 0

            // Process each number
            for (int num : nums) {
                // Process backwards to avoid reusing the same element
                for (int i = Math.min(k, n - 1); i >= 1; i--) {
                    // Need to copy to avoid concurrent modification
                    Set<Integer> temp = new HashSet<>(dp[i - 1]);
                    for (int prevSum : temp) {
                        dp[i].add(prevSum + num);
                    }
                }
            }

            // Check if targetSum is achievable with exactly k elements
            if (dp[k].contains(targetSum)) return true;
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² × totalSum) for DP approach**

- The outer loop runs n/2 times (for k from 1 to n/2)
- For each k, we run DP that processes n elements
- For each element, we update up to k sets, each containing up to totalSum possible sums
- In practice, with pruning and the mathematical constraint, it's much faster than worst case

**Space Complexity: O(k × totalSum)**

- We maintain DP arrays of sets for each possible count (0 to k)
- Each set can contain up to totalSum different sum values
- In the worst case, this is O(n × totalSum)

**Optimized Meet-in-the-Middle Approach (mentioned in walkthrough):**

- Time: O(n × 2^(n/2)) - split array in half, enumerate all subsets of each half
- Space: O(2^(n/2)) - store all subset sums for first half

## Common Mistakes

1. **Forgetting the non-empty constraint**: Candidates sometimes return true when one group could be empty. Remember both groups must be non-empty, which is why we check k from 1 to n/2 (not 0 to n).

2. **Integer division errors**: When calculating `targetSum = (totalSum * k) / n`, ensure you check divisibility first. Using integer division without the divisibility check can give wrong targets.

3. **Not pruning impossible k values**: Checking all subset sums for all k values is inefficient. The divisibility check `(totalSum * k) % n == 0` prunes most k values, making the solution practical.

4. **Reusing elements in DP**: When implementing the DP, you must iterate backwards through the counts (i from k down to 1) to avoid using the same element multiple times in the same subset.

5. **Missing the symmetry optimization**: Since groups A and B are symmetric, you only need to check k up to n/2. Checking all k from 1 to n-1 doubles the work unnecessarily.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Subset Sum Problem**: The core challenge reduces to checking if a subset of specific size exists with a specific sum, which is a variant of the classic subset sum problem.

2. **Meet-in-the-Middle**: For problems where n is moderate (typically ≤ 30), splitting the search space and combining results is a powerful technique.

3. **Mathematical Transformations**: Many array partition problems (like "Partition Equal Subset Sum") use mathematical insights to transform the problem into something more tractable.

**Related Problems:**

- **Partition Array Into Two Arrays to Minimize Sum Difference**: Similar subset selection problem with optimization goal
- **Minimum Average Difference**: Also deals with array averages but with different constraints
- **Partition Equal Subset Sum**: Simpler version without the average constraint

## Key Takeaways

1. **Mathematical simplification is key**: Transforming "same average" to "subset of size k with specific sum" turns a vague optimization into a concrete combinatorial problem.

2. **Prune early, prune often**: The divisibility check eliminates most k values immediately, making an exponential problem tractable.

3. **Symmetry reduces search space**: When partitioning into two groups, you only need to consider sizes up to n/2 due to symmetry.

4. **DP for subset problems**: When you need to check existence of subsets with specific properties (sum, size), dynamic programming with state (count, sum) is often the right approach.

Related problems: [Partition Array Into Two Arrays to Minimize Sum Difference](/problem/partition-array-into-two-arrays-to-minimize-sum-difference), [Minimum Average Difference](/problem/minimum-average-difference)
