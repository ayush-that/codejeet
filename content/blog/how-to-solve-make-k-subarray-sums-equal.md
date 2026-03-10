---
title: "How to Solve Make K-Subarray Sums Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Make K-Subarray Sums Equal. Medium difficulty, 38.2% acceptance rate. Topics: Array, Math, Greedy, Sorting, Number Theory."
date: "2026-02-14"
category: "dsa-patterns"
tags: ["make-k-subarray-sums-equal", "array", "math", "greedy", "medium"]
---

## How to Solve Make K-Subarray Sums Equal

This problem asks us to make all subarrays of length `k` in a circular array have equal sums, using the minimum number of operations where we can increment or decrement any element by 1. What makes this tricky is the circular nature combined with the constraint that all k-length subarrays must have equal sums — this creates hidden mathematical relationships between elements that are far apart in the array.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [1, 4, 1, 3]`, `k = 2`.

We have a circular array, so the k-subarrays (length 2) are:

- Subarray 0: `[1, 4]` → sum = 5
- Subarray 1: `[4, 1]` → sum = 5
- Subarray 2: `[1, 3]` → sum = 4
- Subarray 3: `[3, 1]` → sum = 4 (wrapping around)

We need all these sums to be equal. Notice something interesting: for subarrays to have equal sums, certain elements must be equal to each other.

Let's write the condition mathematically. For any index `i`, the sum of subarray starting at `i` equals the sum of subarray starting at `i+1`:

```
arr[i] + arr[i+1] + ... + arr[i+k-1] = arr[i+1] + arr[i+2] + ... + arr[i+k]
```

Cancel common terms and we get:

```
arr[i] = arr[i+k]
```

This means elements spaced `k` apart must be equal! In our example with `k=2`:

- `arr[0]` must equal `arr[2]` (1 = 1 ✓)
- `arr[1]` must equal `arr[3]` (4 ≠ 3 ✗)

So we need to make `arr[1]` and `arr[3]` equal with minimal operations. The optimal way is to make them both equal to the median of their values (4 and 3), which is either 3 or 4. Choosing median 3 requires 1 operation (decrement 4 to 3). Choosing median 4 also requires 1 operation (increment 3 to 4).

But wait — there's another layer! Because the array is circular, indices wrap around. With `n=4` and `k=2`, we actually have two independent groups:

- Group 1: indices 0, 2 (since 0+2=2, 2+2=4≡0 mod 4)
- Group 2: indices 1, 3 (since 1+2=3, 3+2=5≡1 mod 4)

Each group must have all elements equal. We minimize operations by making each group's elements equal to their median.

## Brute Force Approach

A naive approach might try to brute force all possible target sums, but there are infinite possibilities since we can increment/decrement without bounds. Another brute force would try all possible values to make each group equal to, but the search space is huge.

Even if we realized the grouping insight, a suboptimal approach would be to make each group equal to its mean (average). This doesn't work because increment/decrement operations have equal cost whether moving up or down, so the optimal target is the median, not the mean.

For example, group values `[1, 100, 101]`:

- Mean = 67.33, operations = |1-67| + |100-67| + |101-67| = 66 + 33 + 34 = 133
- Median = 100, operations = |1-100| + |100-100| + |101-100| = 99 + 0 + 1 = 100

The median gives fewer operations because it minimizes the sum of absolute deviations.

## Optimized Approach

The key insight has two parts:

1. **Grouping by GCD**: Elements at indices `i` and `j` must be equal if `(i - j) % gcd(n, k) == 0`. Why? Because starting from the condition `arr[i] = arr[i+k]`, we can jump `k` steps repeatedly. In a circular array of length `n`, jumping `k` steps repeatedly will visit indices separated by `gcd(n, k)`. So we get `gcd(n, k)` independent groups.

2. **Median minimizes operations**: For each group, to make all values equal with minimal increment/decrement operations, we should make them all equal to the median of the group's values. The median minimizes the sum of absolute differences.

The algorithm:

1. Compute `g = gcd(n, k)` — this tells us how many independent groups exist
2. For each group (indices `i, i+g, i+2g, ...` modulo `n`), collect all values
3. Sort each group and find its median
4. Sum the absolute differences between each element and its group's median
5. Return the total

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def makeSubKSumEqual(self, arr, k):
    """
    Makes all k-length subarrays in a circular array have equal sums
    by minimizing increment/decrement operations on elements.
    """
    n = len(arr)

    # Step 1: Find the size of independent groups using GCD
    # Elements spaced gcd(n, k) apart must be equal
    g = math.gcd(n, k)

    total_ops = 0

    # Step 2: Process each independent group
    for start in range(g):
        group = []

        # Collect all elements in this group
        # Indices: start, start+g, start+2g, ... (mod n)
        for i in range(start, n, g):
            group.append(arr[i])

        # Step 3: Sort to find median efficiently
        group.sort()

        # Median is the middle element (or any middle for even length)
        median = group[len(group) // 2]

        # Step 4: Calculate operations needed for this group
        # Making all elements equal to median minimizes |x - target| sum
        for num in group:
            total_ops += abs(num - median)

    return total_ops
```

```javascript
// Time: O(n log n) | Space: O(n)
function makeSubKSumEqual(arr, k) {
  const n = arr.length;

  // Helper function to compute GCD
  const gcd = (a, b) => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Step 1: Find group size using GCD
  const g = gcd(n, k);
  let totalOps = 0;

  // Step 2: Process each independent group
  for (let start = 0; start < g; start++) {
    const group = [];

    // Collect all elements in this group
    for (let i = start; i < n; i += g) {
      group.push(arr[i]);
    }

    // Step 3: Sort to find median
    group.sort((a, b) => a - b);

    // Median is middle element
    const median = group[Math.floor(group.length / 2)];

    // Step 4: Calculate operations for this group
    for (const num of group) {
      totalOps += Math.abs(num - median);
    }
  }

  return totalOps;
}
```

```java
// Time: O(n log n) | Space: O(n)
public long makeSubKSumEqual(int[] arr, int k) {
    int n = arr.length;

    // Step 1: Compute GCD to find group size
    int g = gcd(n, k);
    long totalOps = 0;

    // Step 2: Process each independent group
    for (int start = 0; start < g; start++) {
        List<Integer> group = new ArrayList<>();

        // Collect all elements in this group
        for (int i = start; i < n; i += g) {
            group.add(arr[i]);
        }

        // Step 3: Sort to find median
        Collections.sort(group);

        // Median is middle element
        int median = group.get(group.size() / 2);

        // Step 4: Calculate operations for this group
        for (int num : group) {
            totalOps += Math.abs(num - median);
        }
    }

    return totalOps;
}

// Helper function to compute GCD
private int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Computing GCD takes O(log min(n, k)) time
- Collecting elements into groups takes O(n) time
- Sorting each group: In the worst case when `g = 1`, we sort all n elements → O(n log n)
- Calculating operations takes O(n) time
- Dominated by the sorting step: O(n log n)

**Space Complexity:** O(n)

- We store groups which in total contain all n elements
- Sorting may use O(n) additional space (depending on implementation)
- No recursion, so call stack is O(1)

## Common Mistakes

1. **Using mean instead of median**: Candidates often try to make each group equal to the average/mean value. This is incorrect because operations have symmetric cost (increment and decrement cost the same), so the optimal target is the median, which minimizes sum of absolute deviations.

2. **Missing the GCD grouping**: Some candidates correctly identify that `arr[i] = arr[i+k]` but then create groups of size `k` instead of using `gcd(n, k)`. With `n=6, k=4`, jumping 4 steps gives indices: 0→4→2→0, forming a group of size 3, not 4.

3. **Not handling circular wrap-around**: Forgetting that indices wrap modulo `n` when collecting group elements. The loop should use `i += g` and rely on array bounds, not modulo arithmetic, to avoid duplicates.

4. **Integer overflow**: When n is large (up to 10^5) and values are large (up to 10^9), the total operations can exceed 32-bit integer range. Always use 64-bit integers (long in Java/JavaScript, int is fine in Python).

## When You'll See This Pattern

This problem combines **modular arithmetic grouping** with **median optimization**:

1. **Rotate Array (LeetCode 189)**: Also deals with circular array indexing and GCD-based grouping for efficient rotation.

2. **Minimum Moves to Equal Array Elements II (LeetCode 462)**: The core median-finding to minimize increments/decrements appears here. This problem is essentially applying that pattern to multiple independent groups.

3. **Make Sum Divisible by P (LeetCode 1590)**: Uses similar modular arithmetic and prefix sums with remainder grouping.

The pattern appears whenever you have constraints that create equivalence classes in a circular array, often revealed by analyzing how indices relate through modular arithmetic.

## Key Takeaways

1. **Circular constraints create hidden relationships**: When dealing with circular arrays and subarray constraints, write out the equality conditions and simplify algebraically. This often reveals that elements at certain distances must be equal.

2. **GCD determines independent groups**: In circular problems with step size `k`, the number of independent sequences is `gcd(n, k)`. This is a fundamental number theory result worth remembering.

3. **Median minimizes L1 distance**: When you need to make numbers equal with minimum total absolute changes (increments/decrements of 1), the median is always the optimal target, not the mean.

Related problems: [Rotate Array](/problem/rotate-array), [Minimum Moves to Equal Array Elements II](/problem/minimum-moves-to-equal-array-elements-ii)
