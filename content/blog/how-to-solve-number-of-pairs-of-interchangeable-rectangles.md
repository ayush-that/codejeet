---
title: "How to Solve Number of Pairs of Interchangeable Rectangles — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Pairs of Interchangeable Rectangles. Medium difficulty, 52.4% acceptance rate. Topics: Array, Hash Table, Math, Counting, Number Theory."
date: "2028-05-08"
category: "dsa-patterns"
tags: ["number-of-pairs-of-interchangeable-rectangles", "array", "hash-table", "math", "medium"]
---

# How to Solve Number of Pairs of Interchangeable Rectangles

This problem asks us to count pairs of rectangles that have the same width-to-height ratio. Two rectangles are interchangeable if their width/height ratios are equal, which means they're mathematically similar rectangles. The tricky part is that we need to count **pairs** efficiently — checking every possible pair would be too slow for large inputs. The key insight is that if `k` rectangles share the same ratio, they form `k*(k-1)/2` interchangeable pairs.

## Visual Walkthrough

Let's trace through an example: `rectangles = [[4,8],[3,6],[8,4],[2,4],[6,3]]`

1. **Calculate ratios for each rectangle:**
   - Rectangle 0: 4/8 = 0.5
   - Rectangle 1: 3/6 = 0.5
   - Rectangle 2: 8/4 = 2.0
   - Rectangle 3: 2/4 = 0.5
   - Rectangle 4: 6/3 = 2.0

2. **Group by ratio:**
   - Ratio 0.5: rectangles 0, 1, 3 (3 rectangles)
   - Ratio 2.0: rectangles 2, 4 (2 rectangles)

3. **Count pairs from each group:**
   - For ratio 0.5: 3 rectangles → 3\*(3-1)/2 = 3 pairs
   - For ratio 2.0: 2 rectangles → 2\*(2-1)/2 = 1 pair

4. **Total interchangeable pairs:** 3 + 1 = 4

But wait — there's a catch! Floating-point numbers can be imprecise. What if we had ratios like 1/3 and 2/6? Both equal 0.333..., but floating-point comparison might fail. We need a more reliable approach: store ratios as **reduced fractions** using the greatest common divisor (GCD).

## Brute Force Approach

The most straightforward solution is to check every pair of rectangles:

1. For each rectangle i from 0 to n-1
2. For each rectangle j from i+1 to n-1
3. Check if width[i]/height[i] == width[j]/height[j]
4. If yes, increment the count

This approach has O(n²) time complexity, which is too slow for n up to 10⁵ (the maximum in the problem constraints). Even with 10⁴ rectangles, we'd need to check about 50 million pairs!

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) - Too slow for n=10⁵!
def interchangeableRectangles_brute(rectangles):
    n = len(rectangles)
    count = 0

    for i in range(n):
        w1, h1 = rectangles[i]
        ratio1 = w1 / h1  # Floating point - problematic!

        for j in range(i + 1, n):
            w2, h2 = rectangles[j]
            ratio2 = w2 / h2

            # Floating point comparison can fail!
            if ratio1 == ratio2:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1) - Too slow for n=10⁵!
function interchangeableRectanglesBrute(rectangles) {
  let count = 0;
  const n = rectangles.length;

  for (let i = 0; i < n; i++) {
    const [w1, h1] = rectangles[i];
    const ratio1 = w1 / h1; // Floating point - problematic!

    for (let j = i + 1; j < n; j++) {
      const [w2, h2] = rectangles[j];
      const ratio2 = w2 / h2;

      // Floating point comparison can fail!
      if (ratio1 === ratio2) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1) - Too slow for n=10⁵!
public long interchangeableRectanglesBrute(int[][] rectangles) {
    long count = 0;
    int n = rectangles.length;

    for (int i = 0; i < n; i++) {
        double ratio1 = (double) rectangles[i][0] / rectangles[i][1];

        for (int j = i + 1; j < n; j++) {
            double ratio2 = (double) rectangles[j][0] / rectangles[j][1];

            // Floating point comparison can fail!
            if (ratio1 == ratio2) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to compare every pair directly. Instead:

1. **Normalize ratios** to avoid floating-point issues: For each rectangle, compute the greatest common divisor (GCD) of width and height, then divide both by the GCD to get a reduced fraction. Store this as a string or tuple like "width:height".

2. **Count occurrences** of each reduced ratio using a hash map (dictionary in Python, Map in JavaScript, HashMap in Java).

3. **Calculate pairs**: For a ratio that appears `k` times, the number of pairs is `k * (k-1) / 2`. This formula comes from combinatorics: choosing 2 items from k items.

Why does this work? If two rectangles have the same reduced fraction, their ratios are mathematically equal. The GCD reduction ensures that 2/4 becomes 1/2, 3/6 becomes 1/2, etc., so all equal ratios get grouped together.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * log(max(width, height))) | Space: O(n)
# The log factor comes from computing GCD using Euclidean algorithm
def interchangeableRectangles(rectangles):
    """
    Counts pairs of rectangles with the same width-to-height ratio.

    Approach:
    1. For each rectangle, compute the reduced fraction (width/GCD, height/GCD)
    2. Count occurrences of each reduced fraction using a hash map
    3. For each fraction with count k, add k*(k-1)/2 to the total pairs

    Args:
        rectangles: List of [width, height] pairs

    Returns:
        Number of interchangeable rectangle pairs
    """
    from math import gcd

    ratio_count = {}  # Hash map to store counts of reduced ratios
    total_pairs = 0   # Accumulator for the final answer

    for width, height in rectangles:
        # Step 1: Compute GCD to reduce the fraction
        # This ensures 2/4 becomes 1/2, 3/6 becomes 1/2, etc.
        divisor = gcd(width, height)

        # Step 2: Create a normalized ratio as a tuple
        # Using tuple instead of float avoids floating-point precision issues
        reduced_ratio = (width // divisor, height // divisor)

        # Step 3: Update count in hash map
        # If ratio already exists, increment; otherwise initialize to 1
        current_count = ratio_count.get(reduced_ratio, 0)
        ratio_count[reduced_ratio] = current_count + 1

    # Step 4: Calculate total pairs from counts
    # For k rectangles with same ratio, they form k*(k-1)/2 pairs
    for count in ratio_count.values():
        # Use integer division to avoid floating point
        total_pairs += count * (count - 1) // 2

    return total_pairs
```

```javascript
// Time: O(n * log(max(width, height))) | Space: O(n)
// The log factor comes from computing GCD using Euclidean algorithm
function interchangeableRectangles(rectangles) {
  /**
   * Counts pairs of rectangles with the same width-to-height ratio.
   *
   * Approach:
   * 1. For each rectangle, compute the reduced fraction (width/GCD, height/GCD)
   * 2. Count occurrences of each reduced fraction using a hash map
   * 3. For each fraction with count k, add k*(k-1)/2 to the total pairs
   *
   * @param {number[][]} rectangles - Array of [width, height] pairs
   * @return {number} Number of interchangeable rectangle pairs
   */

  // Helper function to compute GCD using Euclidean algorithm
  function gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  const ratioCount = new Map(); // Hash map to store counts of reduced ratios
  let totalPairs = 0; // Accumulator for the final answer

  for (const [width, height] of rectangles) {
    // Step 1: Compute GCD to reduce the fraction
    // This ensures 2/4 becomes 1/2, 3/6 becomes 1/2, etc.
    const divisor = gcd(width, height);

    // Step 2: Create a normalized ratio as a string
    // Using string instead of float avoids floating-point precision issues
    const reducedRatio = `${width / divisor}:${height / divisor}`;

    // Step 3: Update count in hash map
    // If ratio already exists, increment; otherwise initialize to 1
    const currentCount = ratioCount.get(reducedRatio) || 0;
    ratioCount.set(reducedRatio, currentCount + 1);
  }

  // Step 4: Calculate total pairs from counts
  // For k rectangles with same ratio, they form k*(k-1)/2 pairs
  for (const count of ratioCount.values()) {
    // Use integer division to avoid floating point
    totalPairs += Math.floor((count * (count - 1)) / 2);
  }

  return totalPairs;
}
```

```java
// Time: O(n * log(max(width, height))) | Space: O(n)
// The log factor comes from computing GCD using Euclidean algorithm
class Solution {
    public long interchangeableRectangles(int[][] rectangles) {
        /**
         * Counts pairs of rectangles with the same width-to-height ratio.
         *
         * Approach:
         * 1. For each rectangle, compute the reduced fraction (width/GCD, height/GCD)
         * 2. Count occurrences of each reduced fraction using a hash map
         * 3. For each fraction with count k, add k*(k-1)/2 to the total pairs
         *
         * @param rectangles Array of [width, height] pairs
         * @return Number of interchangeable rectangle pairs
         */

        // Hash map to store counts of reduced ratios
        Map<String, Integer> ratioCount = new HashMap<>();
        long totalPairs = 0;  // Use long to avoid integer overflow for large counts

        for (int[] rect : rectangles) {
            int width = rect[0];
            int height = rect[1];

            // Step 1: Compute GCD to reduce the fraction
            // This ensures 2/4 becomes 1/2, 3/6 becomes 1/2, etc.
            int divisor = gcd(width, height);

            // Step 2: Create a normalized ratio as a string
            // Using string instead of float avoids floating-point precision issues
            String reducedRatio = (width / divisor) + ":" + (height / divisor);

            // Step 3: Update count in hash map
            // If ratio already exists, increment; otherwise initialize to 1
            ratioCount.put(reducedRatio, ratioCount.getOrDefault(reducedRatio, 0) + 1);
        }

        // Step 4: Calculate total pairs from counts
        // For k rectangles with same ratio, they form k*(k-1)/2 pairs
        for (int count : ratioCount.values()) {
            // Cast to long before multiplication to avoid integer overflow
            totalPairs += (long) count * (count - 1) / 2;
        }

        return totalPairs;
    }

    // Helper method to compute GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* log(max(width, height)))

- We process each of the n rectangles once: O(n)
- For each rectangle, we compute GCD using Euclidean algorithm, which takes O(log(min(width, height))) time
- The worst case for GCD is O(log(max(width, height))) when using Euclidean algorithm
- Hash map operations (insert and lookup) are O(1) on average

**Space Complexity:** O(n)

- We store up to n entries in the hash map (in the worst case where all ratios are unique)
- Each entry stores a string/tuple key and an integer count

## Common Mistakes

1. **Using floating-point numbers for comparison**: This is the most common mistake. Ratios like 1/3 and 2/6 might not compare equal due to floating-point precision. Always use reduced fractions.

2. **Forgetting about integer overflow**: When n=10⁵, the maximum number of pairs is about 5 billion (n\*(n-1)/2), which exceeds 32-bit integer range. Use 64-bit integers (long in Java, no issue in Python, BigInt if needed in JavaScript).

3. **Incorrect pair counting formula**: Some candidates try to count pairs by incrementing as they find matches, which is O(n²). The correct formula is k\*(k-1)/2 for k rectangles with the same ratio.

4. **Not reducing fractions properly**: Simply dividing width by height gives a float. You must reduce by GCD first. For example, 2/4 and 1/2 should be recognized as the same ratio.

## When You'll See This Pattern

This "count pairs with same property" pattern appears frequently in coding interviews:

1. **Number of Good Pairs (LeetCode 1512)**: Count pairs where nums[i] == nums[j] and i < j. Same core idea: count occurrences, then use k\*(k-1)/2 formula.

2. **Count Nice Pairs in an Array (LeetCode 1814)**: Count pairs where nums[i] + rev(nums[j]) == nums[j] + rev(nums[i]). After rearranging, it becomes nums[i] - rev(nums[i]) == nums[j] - rev(nums[j]), reducing to the same pattern.

3. **Pairs of Songs With Total Durations Divisible by 60 (LeetCode 1010)**: Count pairs where (time[i] + time[j]) % 60 == 0. Store remainders in a hash map and count pairs.

The pattern is: when you need to count pairs satisfying some condition, often you can transform the condition into a "key" that can be hashed, count frequencies, then use combinatorial formulas.

## Key Takeaways

1. **Transform pair problems into counting problems**: Instead of checking O(n²) pairs directly, find a property that can be hashed, count frequencies, and use combinatorial math.

2. **Avoid floating-point comparisons in ratio problems**: Use reduced fractions (divide by GCD) and store as strings or tuples to ensure exact equality.

3. **Remember the pairs formula**: If k items share a property, they form k\*(k-1)/2 unordered pairs. This transforms O(n²) comparisons into O(n) counting.

Related problems: [Number of Good Pairs](/problem/number-of-good-pairs), [Count Nice Pairs in an Array](/problem/count-nice-pairs-in-an-array), [Replace Non-Coprime Numbers in Array](/problem/replace-non-coprime-numbers-in-array)
