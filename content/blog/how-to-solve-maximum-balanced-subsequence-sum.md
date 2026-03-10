---
title: "How to Solve Maximum Balanced Subsequence Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Balanced Subsequence Sum. Hard difficulty, 25.8% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Binary Indexed Tree, Segment Tree."
date: "2026-05-30"
category: "dsa-patterns"
tags: ["maximum-balanced-subsequence-sum", "array", "binary-search", "dynamic-programming", "hard"]
---

# How to Solve Maximum Balanced Subsequence Sum

This problem asks us to find the maximum sum of a **balanced subsequence** from an array `nums`. A subsequence is balanced if for every consecutive pair of elements at indices `i` and `j` (with `i < j`), the condition `nums[j] - nums[i] ≥ j - i` holds. What makes this problem tricky is that we're not just looking for any subsequence—we need to find the one with the maximum sum while satisfying a constraint that links the values with their positions. This constraint essentially says that as we move forward in the array, the values must increase at least as fast as the distance between indices.

## Visual Walkthrough

Let's walk through a small example: `nums = [3, 2, 5, 4]`

We want to find subsequences where for any two consecutive elements at indices `i` and `j`:
`nums[j] - nums[i] ≥ j - i`

We can rearrange this constraint to: `nums[j] - j ≥ nums[i] - i`

This is the key insight! Let's compute `nums[i] - i` for each index:

- Index 0: 3 - 0 = 3
- Index 1: 2 - 1 = 1
- Index 2: 5 - 2 = 3
- Index 3: 4 - 3 = 1

Now the condition becomes: for a valid subsequence, the sequence of `nums[i] - i` values must be **non-decreasing**.

Let's check some subsequences:

- `[3, 5]` (indices 0, 2): values are 3 and 3 → non-decreasing ✓ Sum = 8
- `[3, 4]` (indices 0, 3): values are 3 and 1 → decreasing ✗
- `[2, 5]` (indices 1, 2): values are 1 and 3 → non-decreasing ✓ Sum = 7
- `[2, 4]` (indices 1, 3): values are 1 and 1 → non-decreasing ✓ Sum = 6
- `[5, 4]` (indices 2, 3): values are 3 and 1 → decreasing ✗
- `[3, 2, 5]` (indices 0, 1, 2): values are 3, 1, 3 → not non-decreasing ✗

The maximum sum we found is 8 from subsequence `[3, 5]`.

## Brute Force Approach

The brute force approach would be to generate all possible subsequences (2^n possibilities), check if each is balanced, and track the maximum sum. For each subsequence of length k, we'd need to check k-1 pairs to verify the balance condition.

The code would look something like this:

<div class="code-group">

```python
# Time: O(2^n * n) | Space: O(n) for recursion stack
def maxBalancedSubsequenceSum(nums):
    n = len(nums)
    max_sum = float('-inf')

    # Generate all subsequences using bitmask
    for mask in range(1 << n):
        subsequence = []
        current_sum = 0
        valid = True

        # Extract indices from the bitmask
        last_idx = -1
        last_val_minus_idx = float('-inf')

        for i in range(n):
            if mask & (1 << i):  # If i-th bit is set
                if last_idx != -1:
                    # Check the balance condition
                    if nums[i] - nums[last_idx] < i - last_idx:
                        valid = False
                        break
                last_idx = i
                current_sum += nums[i]

        if valid:
            max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(2^n * n) | Space: O(1)
function maxBalancedSubsequenceSum(nums) {
  const n = nums.length;
  let maxSum = -Infinity;

  // Generate all subsequences using bitmask
  for (let mask = 1; mask < 1 << n; mask++) {
    let currentSum = 0;
    let valid = true;
    let lastIdx = -1;

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        if (lastIdx !== -1) {
          // Check the balance condition
          if (nums[i] - nums[lastIdx] < i - lastIdx) {
            valid = false;
            break;
          }
        }
        lastIdx = i;
        currentSum += nums[i];
      }
    }

    if (valid) {
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(2^n * n) | Space: O(1)
public long maxBalancedSubsequenceSum(int[] nums) {
    int n = nums.length;
    long maxSum = Long.MIN_VALUE;

    // Generate all subsequences using bitmask
    for (int mask = 1; mask < (1 << n); mask++) {
        long currentSum = 0;
        boolean valid = true;
        int lastIdx = -1;

        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                if (lastIdx != -1) {
                    // Check the balance condition
                    if (nums[i] - nums[lastIdx] < i - lastIdx) {
                        valid = false;
                        break;
                    }
                }
                lastIdx = i;
                currentSum += nums[i];
            }
        }

        if (valid) {
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return maxSum;
}
```

</div>

This brute force solution is exponential (O(2^n \* n)) and will time out for n > 20. We need a more efficient approach.

## Optimized Approach

The key insight is that we can transform the problem. From the constraint:
`nums[j] - nums[i] ≥ j - i`

We rearrange to: `nums[j] - j ≥ nums[i] - i`

Let's define `a[i] = nums[i] - i`. Now the condition becomes: for a valid subsequence, the sequence of `a[i]` values must be **non-decreasing**.

So we're looking for: among all non-decreasing subsequences of `a`, find the one with maximum sum of corresponding `nums[i]` values.

This is similar to the **Longest Increasing Subsequence (LIS)** problem, but instead of maximizing length, we want to maximize the sum. And we're working with `a[i]` values that need to be non-decreasing (not strictly increasing).

We can use dynamic programming with a Fenwick Tree (Binary Indexed Tree) or Segment Tree to achieve O(n log n) time:

1. Define `dp[i]` = maximum sum of a balanced subsequence ending at index `i`
2. For each `i`, we need to find: `dp[i] = nums[i] + max(dp[j])` for all `j < i` where `a[j] ≤ a[i]`
3. We can use a Fenwick Tree where the index is the rank of `a[i]` in the sorted unique `a` values, and the value stored is the maximum `dp` value for that `a` value

The challenge is that `nums[i]` can be negative, but we must handle the case where we might not include any previous elements (just `nums[i]` itself).

## Optimal Solution

Here's the complete solution using coordinate compression and Fenwick Tree:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [float('-inf')] * (n + 1)

    def update(self, idx, val):
        """Update the maximum value at position idx"""
        idx += 1  # Fenwick tree is 1-indexed
        while idx <= self.n:
            if val > self.tree[idx]:
                self.tree[idx] = val
            idx += idx & -idx

    def query(self, idx):
        """Get maximum value from position 0 to idx (inclusive)"""
        idx += 1  # Fenwick tree is 1-indexed
        result = float('-inf')
        while idx > 0:
            if self.tree[idx] > result:
                result = self.tree[idx]
            idx -= idx & -idx
        return result

def maxBalancedSubsequenceSum(nums):
    n = len(nums)

    # Step 1: Compute a[i] = nums[i] - i
    a = [nums[i] - i for i in range(n)]

    # Step 2: Coordinate compression for a values
    # We need to map a values to indices for Fenwick Tree
    sorted_unique_a = sorted(set(a))
    # Create mapping from a value to its rank
    rank = {val: idx for idx, val in enumerate(sorted_unique_a)}

    # Step 3: Initialize Fenwick Tree
    m = len(sorted_unique_a)
    fenwick = FenwickTree(m)

    # Step 4: Dynamic Programming with Fenwick Tree
    max_sum = float('-inf')

    for i in range(n):
        # Get the rank of current a[i]
        r = rank[a[i]]

        # Query maximum dp value for all j < i with a[j] <= a[i]
        # This gives us the best sum ending before i that we can extend
        best_prev = fenwick.query(r)

        # dp[i] = max(nums[i], nums[i] + best_prev)
        # We take max with nums[i] alone in case best_prev is negative
        if best_prev == float('-inf'):
            current = nums[i]
        else:
            current = max(nums[i], nums[i] + best_prev)

        # Update global maximum
        if current > max_sum:
            max_sum = current

        # Update Fenwick Tree at position r with current dp value
        fenwick.update(r, current)

    return max_sum
```

```javascript
// Time: O(n log n) | Space: O(n)
class FenwickTree {
  constructor(n) {
    this.n = n;
    this.tree = new Array(n + 1).fill(-Infinity);
  }

  update(idx, val) {
    // Update the maximum value at position idx
    idx += 1; // Fenwick tree is 1-indexed
    while (idx <= this.n) {
      if (val > this.tree[idx]) {
        this.tree[idx] = val;
      }
      idx += idx & -idx;
    }
  }

  query(idx) {
    // Get maximum value from position 0 to idx (inclusive)
    idx += 1; // Fenwick tree is 1-indexed
    let result = -Infinity;
    while (idx > 0) {
      if (this.tree[idx] > result) {
        result = this.tree[idx];
      }
      idx -= idx & -idx;
    }
    return result;
  }
}

function maxBalancedSubsequenceSum(nums) {
  const n = nums.length;

  // Step 1: Compute a[i] = nums[i] - i
  const a = new Array(n);
  for (let i = 0; i < n; i++) {
    a[i] = nums[i] - i;
  }

  // Step 2: Coordinate compression for a values
  // We need to map a values to indices for Fenwick Tree
  const sortedUniqueA = [...new Set(a)].sort((x, y) => x - y);
  // Create mapping from a value to its rank
  const rank = new Map();
  for (let i = 0; i < sortedUniqueA.length; i++) {
    rank.set(sortedUniqueA[i], i);
  }

  // Step 3: Initialize Fenwick Tree
  const m = sortedUniqueA.length;
  const fenwick = new FenwickTree(m);

  // Step 4: Dynamic Programming with Fenwick Tree
  let maxSum = -Infinity;

  for (let i = 0; i < n; i++) {
    // Get the rank of current a[i]
    const r = rank.get(a[i]);

    // Query maximum dp value for all j < i with a[j] <= a[i]
    // This gives us the best sum ending before i that we can extend
    const bestPrev = fenwick.query(r);

    // dp[i] = max(nums[i], nums[i] + bestPrev)
    // We take max with nums[i] alone in case bestPrev is negative
    let current;
    if (bestPrev === -Infinity) {
      current = nums[i];
    } else {
      current = Math.max(nums[i], nums[i] + bestPrev);
    }

    // Update global maximum
    if (current > maxSum) {
      maxSum = current;
    }

    // Update Fenwick Tree at position r with current dp value
    fenwick.update(r, current);
  }

  return maxSum;
}
```

```java
// Time: O(n log n) | Space: O(n)
class FenwickTree {
    private int n;
    private long[] tree;

    public FenwickTree(int n) {
        this.n = n;
        this.tree = new long[n + 1];
        Arrays.fill(this.tree, Long.MIN_VALUE);
    }

    public void update(int idx, long val) {
        // Update the maximum value at position idx
        idx += 1;  // Fenwick tree is 1-indexed
        while (idx <= n) {
            if (val > tree[idx]) {
                tree[idx] = val;
            }
            idx += idx & -idx;
        }
    }

    public long query(int idx) {
        // Get maximum value from position 0 to idx (inclusive)
        idx += 1;  // Fenwick tree is 1-indexed
        long result = Long.MIN_VALUE;
        while (idx > 0) {
            if (tree[idx] > result) {
                result = tree[idx];
            }
            idx -= idx & -idx;
        }
        return result;
    }
}

public long maxBalancedSubsequenceSum(int[] nums) {
    int n = nums.length;

    // Step 1: Compute a[i] = nums[i] - i
    long[] a = new long[n];
    for (int i = 0; i < n; i++) {
        a[i] = (long) nums[i] - i;
    }

    // Step 2: Coordinate compression for a values
    // We need to map a values to indices for Fenwick Tree
    long[] sortedUniqueA = a.clone();
    Arrays.sort(sortedUniqueA);
    int m = 1;
    for (int i = 1; i < n; i++) {
        if (sortedUniqueA[i] != sortedUniqueA[m - 1]) {
            sortedUniqueA[m++] = sortedUniqueA[i];
        }
    }
    sortedUniqueA = Arrays.copyOf(sortedUniqueA, m);

    // Create mapping from a value to its rank
    Map<Long, Integer> rank = new HashMap<>();
    for (int i = 0; i < m; i++) {
        rank.put(sortedUniqueA[i], i);
    }

    // Step 3: Initialize Fenwick Tree
    FenwickTree fenwick = new FenwickTree(m);

    // Step 4: Dynamic Programming with Fenwick Tree
    long maxSum = Long.MIN_VALUE;

    for (int i = 0; i < n; i++) {
        // Get the rank of current a[i]
        int r = rank.get(a[i]);

        // Query maximum dp value for all j < i with a[j] <= a[i]
        // This gives us the best sum ending before i that we can extend
        long bestPrev = fenwick.query(r);

        // dp[i] = max(nums[i], nums[i] + bestPrev)
        // We take max with nums[i] alone in case bestPrev is negative
        long current;
        if (bestPrev == Long.MIN_VALUE) {
            current = nums[i];
        } else {
            current = Math.max(nums[i], (long) nums[i] + bestPrev);
        }

        // Update global maximum
        if (current > maxSum) {
            maxSum = current;
        }

        // Update Fenwick Tree at position r with current dp value
        fenwick.update(r, current);
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Computing `a[i] = nums[i] - i`: O(n)
- Sorting unique `a` values for coordinate compression: O(n log n)
- For each of n elements: O(log n) for Fenwick Tree query and update
- Total: O(n log n)

**Space Complexity: O(n)**

- Storing `a` array: O(n)
- Fenwick Tree: O(n)
- Coordinate compression mapping: O(n)

## Common Mistakes

1. **Forgetting to handle negative numbers correctly**: When `nums[i]` is negative, we might want to start a new subsequence with just that element rather than extending a previous one with negative sum. That's why we use `max(nums[i], nums[i] + bestPrev)` instead of just `nums[i] + bestPrev`.

2. **Using strict inequality instead of non-strict**: The condition is `nums[j] - nums[i] ≥ j - i`, which becomes `a[j] ≥ a[i]` (non-decreasing). Some candidates mistakenly use `>` (strictly increasing), which would miss valid subsequences where `a[j] = a[i]`.

3. **Not using coordinate compression**: The values of `a[i]` can be as large as 10^9 (if nums[i] = 10^9 and i = 0). We can't create a Fenwick Tree of size 10^9. Coordinate compression maps these values to indices 0..m-1 where m ≤ n.

4. **Incorrect Fenwick Tree implementation for maximum queries**: Fenwick Trees are typically used for sum queries. For maximum queries, we need to modify the update logic to propagate the maximum value correctly through the tree.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Transforming constraints**: Rearranging inequalities to reveal a simpler structure (here, `nums[j] - j ≥ nums[i] - i`).

2. **Dynamic Programming with data structure optimization**: When DP has the form `dp[i] = f(i) + max(dp[j])` for `j` satisfying some condition, we can often use Fenwick Trees or Segment Trees to query the maximum efficiently.

3. **Coordinate compression**: When values are large but count is small, we map them to indices.

Similar problems:

- **Longest Increasing Subsequence (LIS)**: Classic problem that can be solved with similar DP + Fenwick Tree approach
- **Number of Pairs Satisfying Inequality**: Also involves transforming inequalities and using Fenwick Trees
- **Russian Doll Envelopes**: Another problem that benefits from sorting + LIS-like approach

## Key Takeaways

1. **Look for algebraic transformations**: When faced with complex constraints, try rearranging them. Here, transforming `nums[j] - nums[i] ≥ j - i` to `nums[j] - j ≥ nums[i] - i` was the key insight.

2. **Recognize when to use Fenwick/Segment Trees**: When you need to frequently query maximum/minimum/sum over a range in a DP transition, these data structures can reduce O(n) queries to O(log n).

3. **Coordinate compression is your friend**: When dealing with large value ranges but relatively few distinct values, compress them to indices to use array-based data structures efficiently.

Related problems: [Number of Pairs Satisfying Inequality](/problem/number-of-pairs-satisfying-inequality)
