---
title: "How to Solve Statistics from a Large Sample — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Statistics from a Large Sample. Medium difficulty, 43.0% acceptance rate. Topics: Array, Math, Probability and Statistics."
date: "2029-07-25"
category: "dsa-patterns"
tags: ["statistics-from-a-large-sample", "array", "math", "probability-and-statistics", "medium"]
---

# How to Solve Statistics from a Large Sample

This problem gives us a statistical sample in compressed form: an array `count` where `count[k]` represents how many times the value `k` appears in the sample, with `k` ranging from 0 to 255. We need to calculate several statistics directly from this frequency array without expanding it into the full sample. The challenge is computing statistics like median and percentiles efficiently when we only have frequency counts, not the actual data points.

## Visual Walkthrough

Let's trace through a small example: `count = [0, 1, 3, 4, 0, 2]`

**Step 1: Understanding the data**

- Value 0 appears 0 times
- Value 1 appears 1 time
- Value 2 appears 3 times
- Value 3 appears 4 times
- Value 4 appears 0 times
- Value 5 appears 2 times

The actual sample would be: `[1, 2, 2, 2, 3, 3, 3, 3, 5, 5]` (10 total elements)

**Step 2: Calculating minimum**
We scan from left to right looking for the first `k` where `count[k] > 0`. Here, `count[1] = 1`, so minimum = 1.

**Step 3: Calculating maximum**
We scan from right to left looking for the last `k` where `count[k] > 0`. Here, `count[5] = 2`, so maximum = 5.

**Step 4: Calculating mean**
We need: `sum(all values) / total_count`

- Sum = (1×1) + (2×3) + (3×4) + (5×2) = 1 + 6 + 12 + 10 = 29
- Total count = 1 + 3 + 4 + 2 = 10
- Mean = 29 / 10 = 2.9

**Step 5: Calculating median (tricky part)**
Total count = 10 (even), so median = average of 5th and 6th elements.
Sorted sample: `[1, 2, 2, 2, 3, 3, 3, 3, 5, 5]`

- 5th element = 3
- 6th element = 3
- Median = (3 + 3) / 2 = 3

To find this using counts: we need to find where the cumulative count reaches/exceeds positions 5 and 6.

**Step 6: Calculating mode**
Mode = value with highest frequency. Here, value 3 has frequency 4 (highest), so mode = 3.

## Brute Force Approach

A naive approach would be to expand the frequency array into the actual sample, then compute statistics on that array. For example:

1. Create an empty list
2. For each index `i` from 0 to 255, add `count[i]` copies of `i` to the list
3. Sort the list (though it would already be sorted since we add in order)
4. Compute statistics directly from the expanded list

**Why this fails:**
The problem states this is a "large sample" - if `count[i]` values are large, we could be creating an array with millions or billions of elements. With `k` up to 255 and potentially large counts, the expanded array could have up to 255 × (max count value) elements. This would use excessive memory and time.

Even worse, some test cases might have counts that cause integer overflow when expanded. The problem is designed to be solved without materializing the full sample.

## Optimized Approach

The key insight is that we can compute all statistics directly from the frequency counts without expanding the array. Here's the step-by-step reasoning:

**1. Minimum and Maximum:** Simple linear scans through the `count` array.

**2. Mean:** We need the sum of all values. Instead of expanding, we calculate:  
`sum = Σ(k × count[k])` for k from 0 to 255  
`total = Σ(count[k])` for k from 0 to 255  
`mean = sum / total`

**3. Median:** This is the trickiest part. For an odd total count `n`, the median is the element at position `(n+1)/2`. For even `n`, it's the average of elements at positions `n/2` and `n/2 + 1`.

We find these positions using cumulative sums:

- Keep a running total of counts as we iterate through values
- When cumulative count reaches or exceeds the target position, we've found the corresponding value
- For even `n`, we need to find two values and average them

**4. Mode:** Simple linear scan to find the `k` with maximum `count[k]`.

**Critical optimization:** We need to handle the case where the median might be the average of two different values (when the two middle positions fall in different value buckets).

## Optimal Solution

<div class="code-group">

```python
# Time: O(256) = O(1) | Space: O(1)
def sampleStats(self, count):
    """
    Calculate statistics from frequency counts without expanding the sample.

    Args:
        count: List[int] - frequency counts for values 0-255

    Returns:
        List[float] - [minimum, maximum, mean, median, mode]
    """
    n = 256  # Values range from 0 to 255

    # 1. Initialize statistics
    minimum = -1  # Will be set when we find first non-zero count
    maximum = -1  # Will be set when we find last non-zero count
    total_sum = 0
    total_count = 0
    mode = 0  # Value with highest frequency
    max_freq = 0  # Highest frequency seen

    # 2. First pass: compute min, max, sum, total count, and mode
    for i in range(n):
        freq = count[i]
        if freq > 0:
            # Update minimum (only set on first non-zero value)
            if minimum == -1:
                minimum = i
            # Update maximum (always update when we see non-zero)
            maximum = i

            # Update sum and total count for mean calculation
            total_sum += i * freq
            total_count += freq

            # Update mode if we found higher frequency
            if freq > max_freq:
                max_freq = freq
                mode = i

    # Calculate mean
    mean = total_sum / total_count if total_count > 0 else 0

    # 3. Calculate median using cumulative counts
    median = 0
    if total_count > 0:
        # Positions are 1-indexed in statistics
        # For odd n: median is at position (n+1)/2
        # For even n: median is average of positions n/2 and n/2+1
        pos1 = (total_count + 1) // 2  # First middle position (1-indexed)
        pos2 = total_count // 2 + 1    # Second middle position for even n (1-indexed)

        # We need to find values at these positions
        cum_count = 0  # Cumulative count of elements seen so far
        value1 = -1    # Value at position pos1
        value2 = -1    # Value at position pos2 (only needed for even n)

        for i in range(n):
            freq = count[i]
            if freq == 0:
                continue

            # Check if pos1 is in the current bucket
            if value1 == -1 and cum_count + freq >= pos1:
                value1 = i

            # Check if pos2 is in the current bucket
            if total_count % 2 == 0 and value2 == -1 and cum_count + freq >= pos2:
                value2 = i

            # If we found both values, we can break early
            if value1 != -1 and (total_count % 2 == 1 or value2 != -1):
                break

            cum_count += freq

        # Calculate median based on whether total_count is odd or even
        if total_count % 2 == 1:
            median = value1
        else:
            median = (value1 + value2) / 2

    return [float(minimum), float(maximum), mean, median, float(mode)]
```

```javascript
// Time: O(256) = O(1) | Space: O(1)
/**
 * Calculate statistics from frequency counts without expanding the sample.
 *
 * @param {number[]} count - frequency counts for values 0-255
 * @return {number[]} - [minimum, maximum, mean, median, mode]
 */
var sampleStats = function (count) {
  const n = 256; // Values range from 0 to 255

  // 1. Initialize statistics
  let minimum = -1; // Will be set when we find first non-zero count
  let maximum = -1; // Will be set when we find last non-zero count
  let totalSum = 0;
  let totalCount = 0;
  let mode = 0; // Value with highest frequency
  let maxFreq = 0; // Highest frequency seen

  // 2. First pass: compute min, max, sum, total count, and mode
  for (let i = 0; i < n; i++) {
    const freq = count[i];
    if (freq > 0) {
      // Update minimum (only set on first non-zero value)
      if (minimum === -1) {
        minimum = i;
      }
      // Update maximum (always update when we see non-zero)
      maximum = i;

      // Update sum and total count for mean calculation
      totalSum += i * freq;
      totalCount += freq;

      // Update mode if we found higher frequency
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = i;
      }
    }
  }

  // Calculate mean
  const mean = totalCount > 0 ? totalSum / totalCount : 0;

  // 3. Calculate median using cumulative counts
  let median = 0;
  if (totalCount > 0) {
    // Positions are 1-indexed in statistics
    // For odd n: median is at position (n+1)/2
    // For even n: median is average of positions n/2 and n/2+1
    const pos1 = Math.floor((totalCount + 1) / 2); // First middle position
    const pos2 = Math.floor(totalCount / 2) + 1; // Second middle position

    // We need to find values at these positions
    let cumCount = 0; // Cumulative count of elements seen so far
    let value1 = -1; // Value at position pos1
    let value2 = -1; // Value at position pos2 (only needed for even n)

    for (let i = 0; i < n; i++) {
      const freq = count[i];
      if (freq === 0) continue;

      // Check if pos1 is in the current bucket
      if (value1 === -1 && cumCount + freq >= pos1) {
        value1 = i;
      }

      // Check if pos2 is in the current bucket
      if (totalCount % 2 === 0 && value2 === -1 && cumCount + freq >= pos2) {
        value2 = i;
      }

      // If we found both values, we can break early
      if (value1 !== -1 && (totalCount % 2 === 1 || value2 !== -1)) {
        break;
      }

      cumCount += freq;
    }

    // Calculate median based on whether totalCount is odd or even
    if (totalCount % 2 === 1) {
      median = value1;
    } else {
      median = (value1 + value2) / 2;
    }
  }

  return [minimum, maximum, mean, median, mode];
};
```

```java
// Time: O(256) = O(1) | Space: O(1)
class Solution {
    /**
     * Calculate statistics from frequency counts without expanding the sample.
     *
     * @param count frequency counts for values 0-255
     * @return array containing [minimum, maximum, mean, median, mode]
     */
    public double[] sampleStats(int[] count) {
        final int n = 256; // Values range from 0 to 255

        // 1. Initialize statistics
        int minimum = -1; // Will be set when we find first non-zero count
        int maximum = -1; // Will be set when we find last non-zero count
        long totalSum = 0; // Use long to avoid overflow
        long totalCount = 0; // Use long to avoid overflow
        int mode = 0; // Value with highest frequency
        int maxFreq = 0; // Highest frequency seen

        // 2. First pass: compute min, max, sum, total count, and mode
        for (int i = 0; i < n; i++) {
            int freq = count[i];
            if (freq > 0) {
                // Update minimum (only set on first non-zero value)
                if (minimum == -1) {
                    minimum = i;
                }
                // Update maximum (always update when we see non-zero)
                maximum = i;

                // Update sum and total count for mean calculation
                totalSum += (long) i * freq;
                totalCount += freq;

                // Update mode if we found higher frequency
                if (freq > maxFreq) {
                    maxFreq = freq;
                    mode = i;
                }
            }
        }

        // Calculate mean
        double mean = totalCount > 0 ? (double) totalSum / totalCount : 0.0;

        // 3. Calculate median using cumulative counts
        double median = 0.0;
        if (totalCount > 0) {
            // Positions are 1-indexed in statistics
            // For odd n: median is at position (n+1)/2
            // For even n: median is average of positions n/2 and n/2+1
            long pos1 = (totalCount + 1) / 2; // First middle position
            long pos2 = totalCount / 2 + 1;   // Second middle position

            // We need to find values at these positions
            long cumCount = 0; // Cumulative count of elements seen so far
            int value1 = -1;   // Value at position pos1
            int value2 = -1;   // Value at position pos2 (only needed for even n)

            for (int i = 0; i < n; i++) {
                int freq = count[i];
                if (freq == 0) continue;

                // Check if pos1 is in the current bucket
                if (value1 == -1 && cumCount + freq >= pos1) {
                    value1 = i;
                }

                // Check if pos2 is in the current bucket
                if (totalCount % 2 == 0 && value2 == -1 && cumCount + freq >= pos2) {
                    value2 = i;
                }

                // If we found both values, we can break early
                if (value1 != -1 && (totalCount % 2 == 1 || value2 != -1)) {
                    break;
                }

                cumCount += freq;
            }

            // Calculate median based on whether totalCount is odd or even
            if (totalCount % 2 == 1) {
                median = value1;
            } else {
                median = (value1 + value2) / 2.0;
            }
        }

        return new double[]{minimum, maximum, mean, median, mode};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(256) = O(1)

- We make at most two passes through the 256-element array
- First pass computes minimum, maximum, mean, and mode
- Second pass computes median using cumulative counts
- Since 256 is constant, time complexity is O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No additional data structures that scale with input size
- The input itself is already O(256) = O(1) in size

## Common Mistakes

1. **Expanding the array:** The most common mistake is trying to materialize the full sample by creating an array with all elements. This fails for large samples due to memory constraints.

2. **Incorrect median calculation for even counts:** When total count is even, candidates often forget they need to average two middle values. Worse, they might not realize these two values could come from different "buckets" in the count array.

3. **Off-by-one errors with positions:** Statistics use 1-indexed positions (1st element, 2nd element, etc.), but programming uses 0-indexing. Confusing these leads to incorrect median calculations.

4. **Integer overflow in sum calculation:** When calculating `total_sum = Σ(k × count[k])`, the product `k × count[k]` can overflow 32-bit integers. Always use 64-bit integers (long in Java/C++, long long in C) for these accumulations.

5. **Forgetting to handle empty sample:** While the problem guarantees non-empty input, robust code should handle the edge case where all counts are zero to avoid division by zero when calculating mean.

## When You'll See This Pattern

This problem teaches **frequency array/counting sort techniques** and **statistical calculations on compressed data**. You'll see similar patterns in:

1. **Find Median from Data Stream (LeetCode 295)** - Also requires maintaining median from streaming data, though with different data structures.
2. **Top K Frequent Elements (LeetCode 347)** - Uses frequency counting to find most common elements.
3. **Range Sum Query - Immutable (LeetCode 303)** - Uses prefix sums (cumulative sums), similar to how we use cumulative counts to find median positions.
4. **Corporate Flight Bookings (LeetCode 1109)** - Uses difference arrays, another compressed representation technique.

The core pattern is: when data has limited range (like 0-255 here), you can use frequency arrays for O(1) lookups and O(range) operations instead of O(n) operations on the full dataset.

## Key Takeaways

1. **Frequency arrays are powerful for limited ranges:** When values have a bounded range, store counts instead of the actual data to save memory and enable efficient computations.

2. **Cumulative sums solve position-based queries:** To find the k-th element in sorted order from frequency counts, use cumulative frequencies to locate which value "bucket" contains that position.

3. **Compute statistics directly from distributions:** Mean, mode, and range can be computed directly from frequency distributions without expanding the data. Median requires careful handling of cumulative counts.

[Practice this problem on CodeJeet](/problem/statistics-from-a-large-sample)
