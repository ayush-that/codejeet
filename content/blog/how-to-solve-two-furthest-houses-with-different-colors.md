---
title: "How to Solve Two Furthest Houses With Different Colors — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Two Furthest Houses With Different Colors. Easy difficulty, 65.5% acceptance rate. Topics: Array, Greedy."
date: "2027-08-11"
category: "dsa-patterns"
tags: ["two-furthest-houses-with-different-colors", "array", "greedy", "easy"]
---

# How to Solve Two Furthest Houses With Different Colors

You're given an array `colors` where each element represents the color of a house on a street. Your task is to find the maximum distance between two houses that have different colors. The distance is simply the absolute difference between their indices. What makes this problem interesting is that while it seems straightforward, the optimal solution requires careful thinking about which pairs to check—you can't just compare every house with every other house.

## Visual Walkthrough

Let's walk through an example: `colors = [1, 1, 1, 6, 1, 1, 1]`

We want to find the maximum distance between two houses with different colors. The houses are at indices 0 through 6.

**Step-by-step reasoning:**

1. The first house (index 0) has color 1. The last house (index 6) has color 1. These are the same color, so they don't count.
2. But wait—the maximum distance will always involve either the first house or the last house (or both). Why? Because distance is measured by index difference, and the first and last houses give us the largest possible spread.
3. Let's check: If the first house (index 0, color 1) is different from some house, the farthest possible partner would be at index 6. But index 6 also has color 1, so that doesn't work.
4. However, if we look for a house with a different color starting from the right end: The last house (index 6, color 1) could pair with the first house with a different color from the left. The first different color from left is at index 3 (color 6). Distance = |6 - 3| = 3.
5. Similarly, the first house (index 0, color 1) could pair with the first different color from the right. The first different color from right is at index 3 (color 6). Distance = |3 - 0| = 3.
6. Actually, let's check all possibilities systematically:
   - Pair (index 0, color 1) with (index 3, color 6): distance = 3
   - Pair (index 0, color 1) with (index 6, color 1): same color, invalid
   - Pair (index 3, color 6) with (index 6, color 1): distance = 3
   - The maximum is indeed 3.

The key insight: The maximum distance must involve at least one endpoint (first or last house). So we only need to check two scenarios:

1. Fix the first house, find the farthest house with a different color (search from right)
2. Fix the last house, find the farthest house with a different color (search from left)

## Brute Force Approach

The brute force solution would compare every pair of houses (i, j) where i < j, check if they have different colors, and track the maximum distance.

**Why this is inefficient:**

- For an array of length n, there are n(n-1)/2 possible pairs
- This gives O(n²) time complexity, which is too slow for large inputs (n up to 100,000 in typical test cases)
- We're doing unnecessary work by checking pairs that can't possibly give the maximum distance

**Brute force code (for understanding only):**

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxDistance(colors):
    max_dist = 0
    n = len(colors)

    # Check every possible pair
    for i in range(n):
        for j in range(i + 1, n):
            if colors[i] != colors[j]:
                max_dist = max(max_dist, j - i)

    return max_dist
```

```javascript
// Time: O(n²) | Space: O(1)
function maxDistance(colors) {
  let maxDist = 0;
  const n = colors.length;

  // Check every possible pair
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (colors[i] !== colors[j]) {
        maxDist = Math.max(maxDist, j - i);
      }
    }
  }

  return maxDist;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxDistance(int[] colors) {
    int maxDist = 0;
    int n = colors.length;

    // Check every possible pair
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (colors[i] != colors[j]) {
                maxDist = Math.max(maxDist, j - i);
            }
        }
    }

    return maxDist;
}
```

</div>

## Optimal Solution

The optimal solution uses a greedy approach based on a key observation: **The maximum distance will always involve at least one of the endpoints (first or last house)**.

**Proof of the observation:**
Consider any valid pair (i, j) with different colors. If neither i nor j is an endpoint (0 or n-1), then we could extend the distance by moving one of them toward an endpoint while keeping colors different. Since we want maximum distance, we should check pairs involving endpoints.

**Algorithm:**

1. Start from the left end (index 0), find the rightmost house with a different color
2. Start from the right end (index n-1), find the leftmost house with a different color
3. Return the maximum of these two distances

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxDistance(colors):
    n = len(colors)
    max_dist = 0

    # Case 1: Fix the first house (index 0), find farthest different color from right
    for i in range(n - 1, -1, -1):  # Start from rightmost, go left
        if colors[i] != colors[0]:
            max_dist = max(max_dist, i - 0)  # Distance from first house
            break  # Found the farthest different color from right

    # Case 2: Fix the last house (index n-1), find farthest different color from left
    for i in range(n):  # Start from leftmost, go right
        if colors[i] != colors[n - 1]:
            max_dist = max(max_dist, (n - 1) - i)  # Distance from last house
            break  # Found the farthest different color from left

    return max_dist
```

```javascript
// Time: O(n) | Space: O(1)
function maxDistance(colors) {
  const n = colors.length;
  let maxDist = 0;

  // Case 1: Fix the first house (index 0), find farthest different color from right
  for (let i = n - 1; i >= 0; i--) {
    // Start from rightmost, go left
    if (colors[i] !== colors[0]) {
      maxDist = Math.max(maxDist, i - 0); // Distance from first house
      break; // Found the farthest different color from right
    }
  }

  // Case 2: Fix the last house (index n-1), find farthest different color from left
  for (let i = 0; i < n; i++) {
    // Start from leftmost, go right
    if (colors[i] !== colors[n - 1]) {
      maxDist = Math.max(maxDist, n - 1 - i); // Distance from last house
      break; // Found the farthest different color from left
    }
  }

  return maxDist;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxDistance(int[] colors) {
    int n = colors.length;
    int maxDist = 0;

    // Case 1: Fix the first house (index 0), find farthest different color from right
    for (int i = n - 1; i >= 0; i--) {  // Start from rightmost, go left
        if (colors[i] != colors[0]) {
            maxDist = Math.max(maxDist, i - 0);  // Distance from first house
            break;  // Found the farthest different color from right
        }
    }

    // Case 2: Fix the last house (index n-1), find farthest different color from left
    for (int i = 0; i < n; i++) {  // Start from leftmost, go right
        if (colors[i] != colors[n - 1]) {
            maxDist = Math.max(maxDist, (n - 1) - i);  // Distance from last house
            break;  // Found the farthest different color from left
        }
    }

    return maxDist;
}
```

</div>

**Alternative one-pass implementation:** We can combine both searches into a single pass by checking each house against both endpoints:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxDistance(colors):
    n = len(colors)
    max_dist = 0

    # Single pass: check each house against both endpoints
    for i in range(n):
        # If current house differs from first house, check distance
        if colors[i] != colors[0]:
            max_dist = max(max_dist, i)
        # If current house differs from last house, check distance
        if colors[i] != colors[n - 1]:
            max_dist = max(max_dist, n - 1 - i)

    return max_dist
```

```javascript
// Time: O(n) | Space: O(1)
function maxDistance(colors) {
  const n = colors.length;
  let maxDist = 0;

  // Single pass: check each house against both endpoints
  for (let i = 0; i < n; i++) {
    // If current house differs from first house, check distance
    if (colors[i] !== colors[0]) {
      maxDist = Math.max(maxDist, i);
    }
    // If current house differs from last house, check distance
    if (colors[i] !== colors[n - 1]) {
      maxDist = Math.max(maxDist, n - 1 - i);
    }
  }

  return maxDist;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxDistance(int[] colors) {
    int n = colors.length;
    int maxDist = 0;

    // Single pass: check each house against both endpoints
    for (int i = 0; i < n; i++) {
        // If current house differs from first house, check distance
        if (colors[i] != colors[0]) {
            maxDist = Math.max(maxDist, i);
        }
        // If current house differs from last house, check distance
        if (colors[i] != colors[n - 1]) {
            maxDist = Math.max(maxDist, n - 1 - i);
        }
    }

    return maxDist;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make at most two passes through the array (or one pass in the alternative implementation)
- Each pass visits each house exactly once
- Even in the worst case where all houses have the same color except one at the opposite end, we still only make two passes

**Space Complexity: O(1)**

- We only use a few variables (n, max_dist, loop counters)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle the case where all houses have the same color**
   - The problem guarantees at least two houses with different colors, but it's good practice to consider edge cases
   - In our solution, we'll always find at least one valid pair since the endpoints must differ from at least one house

2. **Off-by-one errors in loop boundaries**
   - When iterating from the right, starting at `n-1` (not `n`)
   - When calculating distance: `j - i` not `j - i + 1` (distance between indices 0 and 5 is 5, not 6)
   - Remember: distance = absolute difference between indices

3. **Not breaking early when using the two-pass approach**
   - In the first solution, once we find the farthest different color from an endpoint, we should break
   - Continuing to search would be wasteful (though still O(n))

4. **Misunderstanding what "maximum distance" means**
   - Distance is measured in index difference, not physical distance
   - The problem asks for maximum distance between two houses with DIFFERENT colors, not any two houses

## When You'll See This Pattern

This problem uses the **"endpoint consideration"** pattern, which appears in many array problems where you need to maximize or minimize some distance or difference:

1. **Replace Elements with Greatest Element on Right Side (Easy)** - Similar idea of scanning from right to left to find maximum values
2. **Maximum Distance Between a Pair of Values (Medium)** - Also involves finding maximum distance between indices satisfying certain conditions
3. **Maximum Difference Between Increasing Elements (Easy)** - Finding maximum difference where larger element comes after smaller one
4. **Container With Most Water (Medium)** - Uses two pointers starting at ends, moving inward based on comparisons

The core insight is that for distance maximization problems on linear structures, the optimal solution often involves the endpoints. This reduces an O(n²) pairwise comparison to O(n) by only checking meaningful candidates.

## Key Takeaways

1. **For distance maximization in arrays, consider endpoints first** - The maximum spread will always involve at least one endpoint when distance is measured by index difference.

2. **Break problems down into cases** - Instead of trying to solve everything at once, identify key scenarios (fix first house, fix last house) that cover all possibilities.

3. **Look for opportunities to reduce O(n²) to O(n)** - When a brute force solution compares all pairs, see if you can eliminate unnecessary comparisons by reasoning about which pairs could possibly be optimal.

4. **Test with simple examples** - The observation about endpoints becomes clear when you try examples like `[1,1,1,6,1,1,1]` or `[1,2,2,2,2,2,2]`.

Related problems: [Replace Elements with Greatest Element on Right Side](/problem/replace-elements-with-greatest-element-on-right-side), [Maximum Distance Between a Pair of Values](/problem/maximum-distance-between-a-pair-of-values), [Maximum Difference Between Increasing Elements](/problem/maximum-difference-between-increasing-elements)
