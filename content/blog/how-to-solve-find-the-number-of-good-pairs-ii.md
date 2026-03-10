---
title: "How to Solve Find the Number of Good Pairs II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Number of Good Pairs II. Medium difficulty, 26.6% acceptance rate. Topics: Array, Hash Table."
date: "2029-05-14"
category: "dsa-patterns"
tags: ["find-the-number-of-good-pairs-ii", "array", "hash-table", "medium"]
---

# How to Solve Find the Number of Good Pairs II

This problem asks us to count all index pairs `(i, j)` where `nums1[i]` is divisible by `nums2[j] * k`. The challenge comes from the fact that both arrays can be large (up to 10⁵ elements), making the brute force O(n×m) approach impossible. The key insight is that we need to efficiently count how many elements in `nums1` are divisible by each transformed value from `nums2`.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
nums1 = [6, 12, 18, 24]
nums2 = [2, 3, 4]
k = 2
```

We need to count pairs where `nums1[i] % (nums2[j] * k) == 0`.

First, transform `nums2` by multiplying each element by `k`:

- `nums2[0] * k = 2 * 2 = 4`
- `nums2[1] * k = 3 * 2 = 6`
- `nums2[2] * k = 4 * 2 = 8`

Now we need to count how many elements in `nums1` are divisible by each transformed value:

1. For divisor 4: Check which `nums1` elements are divisible by 4
   - 6 ÷ 4 = 1.5 ❌
   - 12 ÷ 4 = 3 ✅
   - 18 ÷ 4 = 4.5 ❌
   - 24 ÷ 4 = 6 ✅
     Count = 2

2. For divisor 6: Check which `nums1` elements are divisible by 6
   - 6 ÷ 6 = 1 ✅
   - 12 ÷ 6 = 2 ✅
   - 18 ÷ 6 = 3 ✅
   - 24 ÷ 6 = 4 ✅
     Count = 4

3. For divisor 8: Check which `nums1` elements are divisible by 8
   - 6 ÷ 8 = 0.75 ❌
   - 12 ÷ 8 = 1.5 ❌
   - 18 ÷ 8 = 2.25 ❌
   - 24 ÷ 8 = 3 ✅
     Count = 1

Total good pairs = 2 + 4 + 1 = 7

The brute force approach would check all 4×3 = 12 pairs directly. But we can do better by counting frequencies and using divisors.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)`:

<div class="code-group">

```python
# Time: O(n * m) | Space: O(1)
def bruteForce(nums1, nums2, k):
    count = 0
    n = len(nums1)
    m = len(nums2)

    for i in range(n):
        for j in range(m):
            # Check if nums1[i] is divisible by nums2[j] * k
            if nums1[i] % (nums2[j] * k) == 0:
                count += 1

    return count
```

```javascript
// Time: O(n * m) | Space: O(1)
function bruteForce(nums1, nums2, k) {
  let count = 0;
  const n = nums1.length;
  const m = nums2.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      // Check if nums1[i] is divisible by nums2[j] * k
      if (nums1[i] % (nums2[j] * k) === 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n * m) | Space: O(1)
public long bruteForce(int[] nums1, int[] nums2, int k) {
    long count = 0;
    int n = nums1.length;
    int m = nums2.length;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            // Check if nums1[i] is divisible by nums2[j] * k
            // Use long to avoid integer overflow
            if (nums1[i] % ((long) nums2[j] * k) == 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With constraints up to 10⁵ elements in each array, the O(n×m) approach would require up to 10¹⁰ operations, which is far too slow. We need a solution that scales better.

## Optimized Approach

The key insight is that we can reverse the problem. Instead of checking each `nums2[j]` against each `nums1[i]`, we can:

1. Count the frequency of each number in `nums1` (since duplicates will have the same divisibility properties)
2. For each unique value `val` in `nums1`, find all its divisors
3. For each divisor `d` of `val`, check if `d` is divisible by `k` and if `d/k` exists in `nums2`
4. If yes, add `freq[val] * freq2[d/k]` to our count (where `freq2` is the frequency of values in `nums2`)

Wait, that's still inefficient because we'd need to find divisors for each unique value in `nums1`. Let's think differently:

Actually, the most efficient approach is:

1. Count frequency of each number in `nums1`
2. Count frequency of each number in `nums2`
3. For each unique value `b` in `nums2`, compute `target = b * k`
4. For each multiple `m` of `target` up to the maximum value in `nums1`, add `freq1[m] * freq2[b]` to our count

This works because if `nums1[i]` is divisible by `b * k`, then `nums1[i]` must be a multiple of `b * k`.

**Example with our earlier data:**

- `nums1` frequencies: {6:1, 12:1, 18:1, 24:1}
- `nums2` frequencies: {2:1, 3:1, 4:1}
- For `b=2`, `target=4`: Multiples of 4 ≤ 24 are 4,8,12,16,20,24
  Only 12 and 24 exist in `nums1`: count += 1×1 + 1×1 = 2
- For `b=3`, `target=6`: Multiples of 6 ≤ 24 are 6,12,18,24
  All exist in `nums1`: count += 1×1 + 1×1 + 1×1 + 1×1 = 4
- For `b=4`, `target=8`: Multiples of 8 ≤ 24 are 8,16,24
  Only 24 exists: count += 1×1 = 1
  Total = 7

This approach is O(max(nums1) × log(max(nums1))) for the multiples iteration, which is much better than O(n×m).

## Optimal Solution

Here's the complete implementation using frequency counting and iterating through multiples:

<div class="code-group">

```python
# Time: O(n + m + max(nums1) * log(max(nums1))) | Space: O(max(nums1) + max(nums2))
def numberOfPairs(nums1, nums2, k):
    # Edge case: if either array is empty, no pairs exist
    if not nums1 or not nums2:
        return 0

    # Find maximum values to determine array sizes for frequency counting
    max1 = max(nums1)
    max2 = max(nums2)

    # Count frequency of each number in nums1
    freq1 = [0] * (max1 + 1)
    for num in nums1:
        freq1[num] += 1

    # Count frequency of each number in nums2
    freq2 = [0] * (max2 + 1)
    for num in nums2:
        freq2[num] += 1

    total_pairs = 0

    # For each possible value b in nums2
    for b in range(1, max2 + 1):
        if freq2[b] == 0:
            continue  # Skip numbers not present in nums2

        # Calculate the divisor we need to check in nums1
        divisor = b * k

        # If divisor exceeds max1, no nums1 element can be divisible by it
        if divisor > max1:
            continue

        # Check all multiples of divisor up to max1
        # This is the key optimization: O(max1/divisor) iterations
        for multiple in range(divisor, max1 + 1, divisor):
            if freq1[multiple] > 0:
                # Each nums1 element at 'multiple' pairs with each nums2 element at 'b'
                total_pairs += freq1[multiple] * freq2[b]

    return total_pairs
```

```javascript
// Time: O(n + m + max(nums1) * log(max(nums1))) | Space: O(max(nums1) + max(nums2))
function numberOfPairs(nums1, nums2, k) {
  // Edge case: if either array is empty, no pairs exist
  if (!nums1.length || !nums2.length) {
    return 0;
  }

  // Find maximum values to determine array sizes for frequency counting
  const max1 = Math.max(...nums1);
  const max2 = Math.max(...nums2);

  // Count frequency of each number in nums1
  const freq1 = new Array(max1 + 1).fill(0);
  for (const num of nums1) {
    freq1[num]++;
  }

  // Count frequency of each number in nums2
  const freq2 = new Array(max2 + 1).fill(0);
  for (const num of nums2) {
    freq2[num]++;
  }

  let totalPairs = 0;

  // For each possible value b in nums2
  for (let b = 1; b <= max2; b++) {
    if (freq2[b] === 0) {
      continue; // Skip numbers not present in nums2
    }

    // Calculate the divisor we need to check in nums1
    const divisor = b * k;

    // If divisor exceeds max1, no nums1 element can be divisible by it
    if (divisor > max1) {
      continue;
    }

    // Check all multiples of divisor up to max1
    // This is the key optimization: O(max1/divisor) iterations
    for (let multiple = divisor; multiple <= max1; multiple += divisor) {
      if (freq1[multiple] > 0) {
        // Each nums1 element at 'multiple' pairs with each nums2 element at 'b'
        totalPairs += freq1[multiple] * freq2[b];
      }
    }
  }

  return totalPairs;
}
```

```java
// Time: O(n + m + max(nums1) * log(max(nums1))) | Space: O(max(nums1) + max(nums2))
public long numberOfPairs(int[] nums1, int[] nums2, int k) {
    // Edge case: if either array is empty, no pairs exist
    if (nums1.length == 0 || nums2.length == 0) {
        return 0L;
    }

    // Find maximum values to determine array sizes for frequency counting
    int max1 = 0;
    for (int num : nums1) {
        max1 = Math.max(max1, num);
    }

    int max2 = 0;
    for (int num : nums2) {
        max2 = Math.max(max2, num);
    }

    // Count frequency of each number in nums1
    int[] freq1 = new int[max1 + 1];
    for (int num : nums1) {
        freq1[num]++;
    }

    // Count frequency of each number in nums2
    int[] freq2 = new int[max2 + 1];
    for (int num : nums2) {
        freq2[num]++;
    }

    long totalPairs = 0L;

    // For each possible value b in nums2
    for (int b = 1; b <= max2; b++) {
        if (freq2[b] == 0) {
            continue;  // Skip numbers not present in nums2
        }

        // Calculate the divisor we need to check in nums1
        // Use long to avoid integer overflow
        long divisor = (long) b * k;

        // If divisor exceeds max1, no nums1 element can be divisible by it
        if (divisor > max1) {
            continue;
        }

        // Check all multiples of divisor up to max1
        // This is the key optimization: O(max1/divisor) iterations
        for (int multiple = (int) divisor; multiple <= max1; multiple += divisor) {
            if (freq1[multiple] > 0) {
                // Each nums1 element at 'multiple' pairs with each nums2 element at 'b'
                // Use long multiplication to avoid overflow
                totalPairs += (long) freq1[multiple] * freq2[b];
            }
        }
    }

    return totalPairs;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m + max(nums1) × log(max(nums1)))

- O(n) to count frequencies in `nums1` and find its maximum
- O(m) to count frequencies in `nums2` and find its maximum
- O(max(nums1) × log(max(nums1))) for the nested loops: The outer loop runs up to `max2` times, and the inner loop runs `max1/divisor` times. In the worst case, this sums to max₁ × (1/1 + 1/2 + 1/3 + ...) ≈ max₁ × log(max₁)

**Space Complexity:** O(max(nums1) + max(nums2))

- We create frequency arrays of size `max1+1` and `max2+1`
- In the worst case where arrays contain large numbers, this could be substantial, but it's necessary for O(1) lookups

## Common Mistakes

1. **Integer overflow**: When computing `b * k`, the product might exceed 32-bit integer limits, especially since constraints don't specify upper bounds. Always use 64-bit integers (long in Java, normal ints are fine in Python).
2. **Missing edge cases**: Forgetting to handle empty arrays or when `divisor > max1`. The latter is important because if the divisor exceeds the maximum value in `nums1`, no element can be divisible by it.

3. **Inefficient divisor finding**: Some candidates try to find divisors of each `nums1[i]` instead of multiples of each `nums2[j] * k`. Finding divisors is O(√n) per element, while finding multiples is O(n/divisor), which is more efficient when many elements share divisors.

4. **Not using frequency counting**: Trying to process each element individually rather than counting frequencies first. This misses the optimization where all elements with the same value have the same divisibility properties.

## When You'll See This Pattern

This "frequency counting + multiples iteration" pattern appears in several counting problems:

1. **Count Array Pairs Divisible by K (Hard)**: Similar structure but with pairs within a single array. Uses the same multiple-iteration technique.

2. **Two Sum (Easy)**: While simpler, it teaches the frequency counting/hash map approach for pair finding.

3. **Number of Good Pairs (Easy)**: The simpler version where you count pairs with equal values - introduces the frequency counting pattern.

4. **Count Nice Pairs in an Array (Medium)**: Another variation where you transform elements first, then count pairs with equal transformed values.

The core pattern is: when you need to count pairs satisfying a divisibility condition, consider counting frequencies and iterating through multiples rather than checking each pair individually.

## Key Takeaways

1. **Frequency counting transforms O(n²) to O(n)**: When you need to count pairs, first count how many times each value appears. This lets you compute pair counts in bulk rather than individually.

2. **Reverse the iteration direction**: Instead of "for each A, find matching B", sometimes "for each possible match, find all A and B that satisfy it" is more efficient, especially with divisibility conditions.

3. **Multiples iteration beats divisor finding**: When checking divisibility at scale, iterating through multiples (O(n/divisor)) is often faster than finding divisors (O(√n)) for each element.

Related problems: [Count Array Pairs Divisible by K](/problem/count-array-pairs-divisible-by-k)
