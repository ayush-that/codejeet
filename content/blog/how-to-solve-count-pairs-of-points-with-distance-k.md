---
title: "How to Solve Count Pairs of Points With Distance k — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Pairs of Points With Distance k. Medium difficulty, 32.8% acceptance rate. Topics: Array, Hash Table, Bit Manipulation."
date: "2026-03-16"
category: "dsa-patterns"
tags: ["count-pairs-of-points-with-distance-k", "array", "hash-table", "bit-manipulation", "medium"]
---

# How to Solve Count Pairs of Points With Distance k

This problem asks us to count pairs of points where the distance between them equals a given integer `k`. The distance is defined as `(x1 XOR x2) + (y1 XOR y2)`, which makes this problem interesting because it combines coordinate geometry with bitwise operations. The challenge is that a brute force check of all pairs would be too slow for large inputs, requiring us to find a clever mathematical relationship to optimize the counting.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have coordinates `[[1,2], [2,3], [3,4]]` and `k = 5`.

**Understanding the distance formula:**
For points (1,2) and (2,3):

- x1 XOR x2 = 1 XOR 2 = 3 (binary: 01 XOR 10 = 11)
- y1 XOR y2 = 2 XOR 3 = 1 (binary: 10 XOR 11 = 01)
- Distance = 3 + 1 = 4 ≠ 5

For points (1,2) and (3,4):

- x1 XOR x2 = 1 XOR 3 = 2 (binary: 01 XOR 11 = 10)
- y1 XOR y2 = 2 XOR 4 = 6 (binary: 10 XOR 100 = 110)
- Distance = 2 + 6 = 8 ≠ 5

For points (2,3) and (3,4):

- x1 XOR x2 = 2 XOR 3 = 1
- y1 XOR y2 = 3 XOR 4 = 7
- Distance = 1 + 7 = 8 ≠ 5

So in this case, no pairs have distance 5. But let's think about the mathematical relationship we need to exploit.

The key insight comes from rewriting the condition. We need:

```
(x1 XOR x2) + (y1 XOR y2) = k
```

This can be rearranged as:

```
(x1 XOR x2) = k - (y1 XOR y2)
```

But more usefully, for a fixed point (x1, y1), we're looking for points (x2, y2) such that:

```
(x1 XOR x2) + (y1 XOR y2) = k
```

Since XOR is its own inverse (a XOR b = c implies a = b XOR c), we can think about what values (x2, y2) could take. For any integers a and b where a + b = k, if we had (x1 XOR x2) = a and (y1 XOR y2) = b, then:

- x2 = x1 XOR a
- y2 = y1 XOR b

So for each point (x1, y1), we can iterate through all possible a values from 0 to k, set b = k - a, and check if the point (x1 XOR a, y1 XOR b) exists in our set of points.

## Brute Force Approach

The most straightforward solution is to check every pair of points:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countPairs(coordinates, k):
    n = len(coordinates)
    count = 0

    # Check every possible pair
    for i in range(n):
        x1, y1 = coordinates[i]
        for j in range(i + 1, n):
            x2, y2 = coordinates[j]
            # Calculate distance using XOR
            distance = (x1 ^ x2) + (y1 ^ y2)
            if distance == k:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countPairs(coordinates, k) {
  let count = 0;
  const n = coordinates.length;

  // Check every possible pair
  for (let i = 0; i < n; i++) {
    const [x1, y1] = coordinates[i];
    for (let j = i + 1; j < n; j++) {
      const [x2, y2] = coordinates[j];
      // Calculate distance using XOR
      const distance = (x1 ^ x2) + (y1 ^ y2);
      if (distance === k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countPairs(int[][] coordinates, int k) {
    int count = 0;
    int n = coordinates.length;

    // Check every possible pair
    for (int i = 0; i < n; i++) {
        int x1 = coordinates[i][0];
        int y1 = coordinates[i][1];
        for (int j = i + 1; j < n; j++) {
            int x2 = coordinates[j][0];
            int y2 = coordinates[j][1];
            // Calculate distance using XOR
            int distance = (x1 ^ x2) + (y1 ^ y2);
            if (distance == k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With `n` up to 100,000 in the problem constraints, O(n²) would be 10¹⁰ operations, which is far too slow. We need a solution that's closer to O(n).

## Optimized Approach

The key insight is that for each point `(x1, y1)`, we can find potential partners `(x2, y2)` by considering all ways to split `k` into two non-negative integers `a` and `b` such that `a + b = k`. Then:

- If `(x1 XOR x2) = a` and `(y1 XOR y2) = b`, then `x2 = x1 XOR a` and `y2 = y1 XOR b`

So for each point `(x1, y1)` and each possible `a` from `0` to `k`, we can compute what `(x2, y2)` would need to be and check if it exists in our set of points.

**Why this works:**

1. We iterate `a` from `0` to `k`, which gives us `k+1` possibilities
2. For each `a`, we compute `b = k - a`
3. For point `(x1, y1)`, the potential partner would be `(x1 XOR a, y1 XOR b)`
4. We check if this partner exists in our hash map

**Step-by-step reasoning:**

1. Store all points in a hash map with their counts (since there can be duplicate points)
2. For each point `(x1, y1)` in our coordinates:
   - For `a` from `0` to `k`:
     - Compute `b = k - a`
     - Compute the potential partner: `(x2, y2) = (x1 XOR a, y1 XOR b)`
     - Check if `(x2, y2)` exists in our hash map
     - If it exists, add its count to our total (handling the case where it might be the same point)
3. Since each pair would be counted twice (once from each endpoint), we divide by 2 at the end
4. We also need to handle the special case where `a = x1 XOR x1 = 0` and `b = y1 XOR y1 = 0`, which would give us the same point

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k) | Space: O(n)
def countPairs(coordinates, k):
    from collections import defaultdict

    # Create a frequency map of points
    # Key: tuple (x, y), Value: count of occurrences
    point_count = defaultdict(int)
    for x, y in coordinates:
        point_count[(x, y)] += 1

    total_pairs = 0

    # Iterate through each unique point
    for (x1, y1), count1 in list(point_count.items()):
        # Try all possible splits of k into a + b
        for a in range(k + 1):
            b = k - a

            # Calculate what the partner point would need to be
            x2 = x1 ^ a
            y2 = y1 ^ b

            # Check if this partner exists
            if (x2, y2) in point_count:
                count2 = point_count[(x2, y2)]

                # If it's the same point, we need to handle carefully
                if x1 == x2 and y1 == y2:
                    # For the same point, pairs are count1 choose 2
                    total_pairs += count1 * (count1 - 1)
                else:
                    # For different points, multiply their frequencies
                    total_pairs += count1 * count2

    # Each pair was counted twice (once from each endpoint)
    return total_pairs // 2
```

```javascript
// Time: O(n * k) | Space: O(n)
function countPairs(coordinates, k) {
  // Create a frequency map of points
  // Key: string "x,y", Value: count of occurrences
  const pointCount = new Map();

  for (const [x, y] of coordinates) {
    const key = `${x},${y}`;
    pointCount.set(key, (pointCount.get(key) || 0) + 1);
  }

  let totalPairs = 0;

  // Convert map to array for iteration
  const entries = Array.from(pointCount.entries());

  // Iterate through each unique point
  for (const [key1, count1] of entries) {
    const [x1, y1] = key1.split(",").map(Number);

    // Try all possible splits of k into a + b
    for (let a = 0; a <= k; a++) {
      const b = k - a;

      // Calculate what the partner point would need to be
      const x2 = x1 ^ a;
      const y2 = y1 ^ b;

      const key2 = `${x2},${y2}`;

      // Check if this partner exists
      if (pointCount.has(key2)) {
        const count2 = pointCount.get(key2);

        // If it's the same point, we need to handle carefully
        if (x1 === x2 && y1 === y2) {
          // For the same point, pairs are count1 choose 2
          totalPairs += count1 * (count1 - 1);
        } else {
          // For different points, multiply their frequencies
          totalPairs += count1 * count2;
        }
      }
    }
  }

  // Each pair was counted twice (once from each endpoint)
  return totalPairs / 2;
}
```

```java
// Time: O(n * k) | Space: O(n)
import java.util.*;

public int countPairs(int[][] coordinates, int k) {
    // Create a frequency map of points
    // Key: string "x,y", Value: count of occurrences
    Map<String, Integer> pointCount = new HashMap<>();

    for (int[] coord : coordinates) {
        String key = coord[0] + "," + coord[1];
        pointCount.put(key, pointCount.getOrDefault(key, 0) + 1);
    }

    long totalPairs = 0; // Use long to avoid integer overflow

    // Convert map to list for iteration
    List<Map.Entry<String, Integer>> entries = new ArrayList<>(pointCount.entrySet());

    // Iterate through each unique point
    for (Map.Entry<String, Integer> entry1 : entries) {
        String key1 = entry1.getKey();
        int count1 = entry1.getValue();

        // Parse coordinates from key
        String[] parts = key1.split(",");
        int x1 = Integer.parseInt(parts[0]);
        int y1 = Integer.parseInt(parts[1]);

        // Try all possible splits of k into a + b
        for (int a = 0; a <= k; a++) {
            int b = k - a;

            // Calculate what the partner point would need to be
            int x2 = x1 ^ a;
            int y2 = y1 ^ b;

            String key2 = x2 + "," + y2;

            // Check if this partner exists
            if (pointCount.containsKey(key2)) {
                int count2 = pointCount.get(key2);

                // If it's the same point, we need to handle carefully
                if (x1 == x2 && y1 == y2) {
                    // For the same point, pairs are count1 choose 2
                    totalPairs += (long) count1 * (count1 - 1);
                } else {
                    // For different points, multiply their frequencies
                    totalPairs += (long) count1 * count2;
                }
            }
        }
    }

    // Each pair was counted twice (once from each endpoint)
    return (int) (totalPairs / 2);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × k)**

- Building the frequency map takes O(n) time
- The outer loop iterates through at most n unique points
- The inner loop iterates k+1 times (from 0 to k)
- Hash map lookups are O(1) on average
- Total: O(n) + O(n × k) = O(n × k)

**Space Complexity: O(n)**

- We store a frequency map of all points, which in the worst case contains n entries
- Additional space for iteration is constant

**Why this is efficient enough:**

- In the problem constraints, k ≤ 100, which is relatively small
- With n ≤ 100,000, O(n × k) = 100,000 × 100 = 10⁷ operations, which is acceptable

## Common Mistakes

1. **Not handling duplicate points correctly**: If multiple points have the same coordinates, they should still form valid pairs. Our solution handles this by storing counts in a frequency map rather than just a set.

2. **Double counting pairs**: When we find a pair (p1, p2), we'll count it once when processing p1 and once when processing p2. We need to divide by 2 at the end to get the correct count.

3. **Integer overflow with large counts**: When n is large, the number of pairs can exceed 2³¹ - 1. In Java, we should use `long` for the total count and cast back to `int` at the end.

4. **Inefficient point representation**: Using strings like "x,y" as keys is convenient but slightly slower than using custom objects or bit manipulation. For maximum performance, we could encode (x, y) into a single 64-bit integer: `((long)x << 32) | y`.

5. **Missing the case where a = 0 and b = k**: Remember that a can be 0 and b can be k, or a can be k and b can be 0. Both are valid splits of k.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Frequency counting with hash maps**: Like in "Two Sum" (LeetCode 1), we use a hash map to quickly check if a complement exists.

2. **Bit manipulation with constraints**: Similar to problems like "Counting Bits" (LeetCode 338) or "Total Hamming Distance" (LeetCode 477), this requires thinking about bitwise operations.

3. **Combinatorial counting with duplicates**: Like in "Number of Good Pairs" (LeetCode 1512), we need to count pairs while handling duplicate elements correctly.

4. **Splitting a sum into two parts**: This is reminiscent of problems where we need to find two numbers that sum to a target, but with the twist of XOR operations.

## Key Takeaways

1. **When you see XOR in distance/metric definitions**, consider whether you can rearrange the equation to express one variable in terms of the other using XOR's self-inverse property.

2. **For counting problems with pair constraints**, a frequency map is often more useful than a set because it handles duplicates correctly and allows combinatorial calculations.

3. **When k is small relative to n**, an O(n × k) solution can be acceptable even when O(n²) is not. Always check the constraints to see what's feasible.

4. **Remember to handle the "same element" case separately** when counting pairs, as the combinatorial formula differs from the cross-product formula.

[Practice this problem on CodeJeet](/problem/count-pairs-of-points-with-distance-k)
