---
title: "How to Solve Minimum Space Wasted From Packaging — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Space Wasted From Packaging. Hard difficulty, 33.5% acceptance rate. Topics: Array, Binary Search, Sorting, Prefix Sum."
date: "2030-01-08"
category: "dsa-patterns"
tags: ["minimum-space-wasted-from-packaging", "array", "binary-search", "sorting", "hard"]
---

# How to Solve Minimum Space Wasted From Packaging

This problem asks us to minimize wasted space when packing packages into boxes, where each package must go into exactly one box, and we can choose from multiple suppliers offering different box sizes. The challenge lies in efficiently matching each package to the smallest possible box that fits it, while considering that we must commit to one supplier's set of box sizes for all packages.

**What makes this tricky:** We need to consider all suppliers, sort both packages and each supplier's boxes, use binary search to find the appropriate box for each package, and calculate wasted space efficiently. The constraints (up to 10⁵ packages and suppliers) make brute force impossible.

## Visual Walkthrough

Let's trace through a concrete example:

- Packages: `[2, 3, 5]`
- Suppliers: `[[4, 8], [2, 8]]` (two suppliers, each with their available box sizes)

**Step 1: Sort packages** → `[2, 3, 5]`

**Step 2: Consider Supplier 1** with boxes `[4, 8]`:

- Sort boxes → `[4, 8]`
- Package 2 → smallest box ≥ 2 is 4 → waste = 4-2 = 2
- Package 3 → smallest box ≥ 3 is 4 → waste = 4-3 = 1
- Package 5 → smallest box ≥ 5 is 8 → waste = 8-5 = 3
- Total waste = 2 + 1 + 3 = 6
- Total box space used = 4 + 4 + 8 = 16

**Step 3: Consider Supplier 2** with boxes `[2, 8]`:

- Sort boxes → `[2, 8]`
- Package 2 → smallest box ≥ 2 is 2 → waste = 2-2 = 0
- Package 3 → smallest box ≥ 3 is 8 → waste = 8-3 = 5
- Package 5 → smallest box ≥ 5 is 8 → waste = 8-5 = 3
- Total waste = 0 + 5 + 3 = 8
- Total box space used = 2 + 8 + 8 = 18

**Step 4: Compare results**:

- Supplier 1 waste = 6
- Supplier 2 waste = 8
- Minimum waste = 6

The key insight: For each supplier, we need to match each package to the smallest box that fits it, which requires sorting and binary search.

## Brute Force Approach

A naive approach would be to try every possible assignment of packages to boxes for each supplier:

1. For each supplier
2. For each package
3. Try every box size from that supplier to find the smallest one that fits
4. Calculate total waste

This is extremely inefficient: O(m × n × b) where m = suppliers, n = packages, b = boxes per supplier. With constraints up to 10⁵ for each, this could be O(10¹⁵) operations.

Even a slightly better brute force would still be too slow:

- Sort packages once: O(n log n)
- For each supplier, sort their boxes: O(b log b) per supplier
- For each package, linearly scan boxes to find the right fit: O(n × b) per supplier

With m suppliers, this becomes O(m × (n × b + b log b)), which is still too slow when n and b can be 10⁵.

## Optimized Approach

The key insight is that for each supplier, once packages and boxes are sorted, we can use **binary search** to find the appropriate box for each package in O(log b) time instead of O(b).

**Step-by-step reasoning:**

1. **Sort all packages** once (O(n log n)) since we'll need them sorted for every supplier
2. **Precompute prefix sums** of packages (O(n)) to quickly calculate the sum of packages between any two indices
3. For each supplier:
   - **Sort their boxes** (O(b log b))
   - Check if the largest box can fit the largest package (if not, skip this supplier)
   - Use **binary search** to find the appropriate box for each package
   - Instead of processing packages one by one, we can process them in **groups** that use the same box size
4. Calculate waste efficiently using prefix sums

**Why grouping packages is efficient:**
When boxes are sorted, packages will use boxes in increasing order. We can find all packages that fit in a particular box size using binary search on the sorted packages array. This allows us to process multiple packages at once.

**Mathematical formula for waste calculation:**
If packages from index `i` to `j` (inclusive) all use a box of size `boxSize`, then:

- Total box space used = `boxSize × (j - i + 1)`
- Total package sizes = `prefixSum[j+1] - prefixSum[i]`
- Waste for this group = `(boxSize × (j - i + 1)) - (prefixSum[j+1] - prefixSum[i])`

## Optimal Solution

<div class="code-group">

```python
# Time: O((m * b log b) + (n log n)) where m = suppliers, b = boxes per supplier, n = packages
# Space: O(n) for prefix sums and sorting
class Solution:
    def minWastedSpace(self, packages: List[int], boxes: List[List[int]]) -> int:
        MOD = 10**9 + 7
        n = len(packages)

        # Step 1: Sort packages and compute prefix sums
        packages.sort()
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + packages[i]

        min_waste = float('inf')

        # Step 2: Process each supplier
        for supplier_boxes in boxes:
            # Sort current supplier's boxes
            supplier_boxes.sort()

            # Step 3: Check if largest box can fit largest package
            if supplier_boxes[-1] < packages[-1]:
                continue  # This supplier cannot handle all packages

            total_waste = 0
            prev_idx = 0  # Index in packages array

            # Step 4: For each box size, find all packages it can handle
            for box_size in supplier_boxes:
                # Binary search to find the rightmost package that fits in this box
                # We're looking for the last index where packages[idx] <= box_size
                lo, hi = prev_idx, n - 1
                while lo <= hi:
                    mid = (lo + hi) // 2
                    if packages[mid] <= box_size:
                        lo = mid + 1
                    else:
                        hi = mid - 1

                # hi now points to the last package that fits
                if hi < prev_idx:
                    continue  # No packages fit in this box

                # Calculate waste for packages[prev_idx..hi]
                count = hi - prev_idx + 1
                packages_sum = prefix[hi + 1] - prefix[prev_idx]
                box_space = box_size * count
                total_waste += box_space - packages_sum

                # Move to next package
                prev_idx = hi + 1

                # If all packages are assigned, break early
                if prev_idx >= n:
                    break

            # Update minimum waste
            min_waste = min(min_waste, total_waste)

        return min_waste % MOD if min_waste != float('inf') else -1
```

```javascript
// Time: O((m * b log b) + (n log n)) where m = suppliers, b = boxes per supplier, n = packages
// Space: O(n) for prefix sums and sorting
var minWastedSpace = function (packages, boxes) {
  const MOD = 1e9 + 7;
  const n = packages.length;

  // Step 1: Sort packages and compute prefix sums
  packages.sort((a, b) => a - b);
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + packages[i];
  }

  let minWaste = Infinity;

  // Step 2: Process each supplier
  for (const supplierBoxes of boxes) {
    // Sort current supplier's boxes
    supplierBoxes.sort((a, b) => a - b);

    // Step 3: Check if largest box can fit largest package
    if (supplierBoxes[supplierBoxes.length - 1] < packages[n - 1]) {
      continue; // This supplier cannot handle all packages
    }

    let totalWaste = 0;
    let prevIdx = 0; // Index in packages array

    // Step 4: For each box size, find all packages it can handle
    for (const boxSize of supplierBoxes) {
      // Binary search to find the rightmost package that fits in this box
      let lo = prevIdx,
        hi = n - 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (packages[mid] <= boxSize) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      // hi now points to the last package that fits
      if (hi < prevIdx) {
        continue; // No packages fit in this box
      }

      // Calculate waste for packages[prevIdx..hi]
      const count = hi - prevIdx + 1;
      const packagesSum = prefix[hi + 1] - prefix[prevIdx];
      const boxSpace = boxSize * count;
      totalWaste += boxSpace - packagesSum;

      // Move to next package
      prevIdx = hi + 1;

      // If all packages are assigned, break early
      if (prevIdx >= n) {
        break;
      }
    }

    // Update minimum waste
    minWaste = Math.min(minWaste, totalWaste);
  }

  return minWaste !== Infinity ? minWaste % MOD : -1;
};
```

```java
// Time: O((m * b log b) + (n log n)) where m = suppliers, b = boxes per supplier, n = packages
// Space: O(n) for prefix sums and sorting
class Solution {
    public int minWastedSpace(int[] packages, int[][] boxes) {
        final int MOD = 1_000_000_007;
        int n = packages.length;

        // Step 1: Sort packages and compute prefix sums
        Arrays.sort(packages);
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + packages[i];
        }

        long minWaste = Long.MAX_VALUE;

        // Step 2: Process each supplier
        for (int[] supplierBoxes : boxes) {
            // Sort current supplier's boxes
            Arrays.sort(supplierBoxes);

            // Step 3: Check if largest box can fit largest package
            if (supplierBoxes[supplierBoxes.length - 1] < packages[n - 1]) {
                continue; // This supplier cannot handle all packages
            }

            long totalWaste = 0;
            int prevIdx = 0; // Index in packages array

            // Step 4: For each box size, find all packages it can handle
            for (int boxSize : supplierBoxes) {
                // Binary search to find the rightmost package that fits in this box
                int lo = prevIdx, hi = n - 1;
                while (lo <= hi) {
                    int mid = lo + (hi - lo) / 2;
                    if (packages[mid] <= boxSize) {
                        lo = mid + 1;
                    } else {
                        hi = mid - 1;
                    }
                }

                // hi now points to the last package that fits
                if (hi < prevIdx) {
                    continue; // No packages fit in this box
                }

                // Calculate waste for packages[prevIdx..hi]
                int count = hi - prevIdx + 1;
                long packagesSum = prefix[hi + 1] - prefix[prevIdx];
                long boxSpace = (long) boxSize * count;
                totalWaste += boxSpace - packagesSum;

                // Move to next package
                prevIdx = hi + 1;

                // If all packages are assigned, break early
                if (prevIdx >= n) {
                    break;
                }
            }

            // Update minimum waste
            minWaste = Math.min(minWaste, totalWaste);
        }

        return minWaste != Long.MAX_VALUE ? (int)(minWaste % MOD) : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting packages: O(n log n)
- Computing prefix sums: O(n)
- For each of m suppliers:
  - Sorting boxes: O(b log b) where b is boxes for that supplier
  - Processing boxes with binary search: O(b log n) since each binary search is O(log n)
- Total: O(n log n + m × (b log b + b log n))

In the worst case where each supplier has all packages as boxes, this becomes O(n log n + m × n log n) = O(m × n log n). However, the problem constraints make this acceptable.

**Space Complexity:**

- O(n) for the prefix sum array
- O(log n) for sorting packages (recursive stack space in some languages)
- O(log b) for sorting boxes per supplier
- Total: O(n) dominated by the prefix sum array

## Common Mistakes

1. **Forgetting to check if a supplier can handle all packages**: If a supplier's largest box is smaller than the largest package, that supplier should be skipped entirely. Missing this check leads to incorrect results.

2. **Not using prefix sums for efficient sum calculation**: Calculating package sums by iterating through the subarray each time leads to O(n²) complexity. Prefix sums reduce this to O(1) per query.

3. **Incorrect binary search bounds**: When finding packages that fit in a box, we need the rightmost package ≤ box size. Using the wrong comparison or not updating bounds correctly can miss packages or include ones that don't fit.

4. **Integer overflow**: The total waste can be very large (up to 10⁵ × 10⁹ = 10¹⁴). Using 32-bit integers can cause overflow. Always use 64-bit integers (long in Java, int in Python handles big integers automatically).

5. **Not breaking early when all packages are assigned**: Once all packages are assigned to boxes, we should stop processing remaining boxes for that supplier to save time.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sorting + Binary Search**: Similar to "Find First and Last Position of Element in Sorted Array" (LeetCode 34) where we use binary search to find boundaries.

2. **Prefix Sums for Range Queries**: Like in "Range Sum Query - Immutable" (LeetCode 303) where we precompute sums for O(1) range queries.

3. **Greedy Assignment with Sorting**: Similar to "Assign Cookies" (LeetCode 455) where we match smallest cookies to smallest greed factors.

4. **Multi-supplier/Minimization Problems**: Like "Minimum Time to Complete Trips" (LeetCode 2187) where we evaluate multiple options and choose the minimum.

## Key Takeaways

1. **When you need to match elements from two sorted arrays**, think about using a two-pointer approach or binary search. Sorting often reveals structure that makes problems tractable.

2. **Prefix sums are your friend for range sum queries**. Whenever you need to calculate sums of subarrays repeatedly, precompute prefix sums to answer each query in O(1) time.

3. **Break complex problems into steps**: 1) Sort packages, 2) Precompute prefix sums, 3) For each supplier: sort boxes, validate, process with binary search, calculate waste. Tackling one step at a time makes hard problems manageable.

4. **Always check edge cases**: What if no supplier can handle all packages? What if waste overflows 32-bit integers? What if packages or boxes arrays are empty?

[Practice this problem on CodeJeet](/problem/minimum-space-wasted-from-packaging)
