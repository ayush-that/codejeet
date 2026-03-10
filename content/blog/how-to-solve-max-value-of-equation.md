---
title: "How to Solve Max Value of Equation — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Max Value of Equation. Hard difficulty, 45.0% acceptance rate. Topics: Array, Queue, Sliding Window, Heap (Priority Queue), Monotonic Queue."
date: "2028-06-01"
category: "dsa-patterns"
tags: ["max-value-of-equation", "array", "queue", "sliding-window", "hard"]
---

# How to Solve Max Value of Equation

This problem asks us to find the maximum value of `yi + yj + |xi - xj|` where `|xi - xj| ≤ k` and `i < j`. The points are sorted by x-values, which is crucial. The tricky part is that we need to efficiently find pairs of points that satisfy the distance constraint while maximizing the equation value, without checking all possible pairs.

## Visual Walkthrough

Let's trace through an example: `points = [[1,3],[2,0],[3,10],[5,2],[6,0]]`, `k = 2`

We want to maximize `yi + yj + (xj - xi)` (since `xj > xi` because points are sorted). This simplifies to `(yi - xi) + (yj + xj)`.

Let's calculate for each point:

- Point 0 (1,3): `y-x = 2`, `y+x = 4`
- Point 1 (2,0): `y-x = -2`, `y+x = 2`
- Point 2 (3,10): `y-x = 7`, `y+x = 13`
- Point 3 (5,2): `y-x = -3`, `y+x = 7`
- Point 4 (6,0): `y-x = -6`, `y+x = 6`

Now we need to find pairs where `xj - xi ≤ 2`:

- Check point 0 (x=1): Can pair with point 1 (x=2, diff=1) and point 2 (x=3, diff=2)
  - With point 1: `(y0-x0) + (y1+x1) = 2 + 2 = 4`
  - With point 2: `2 + 13 = 15` ← current max
- Check point 1 (x=2): Can pair with point 2 (x=3, diff=1) and point 3 (x=5, diff=3 > k, so stop)
  - With point 2: `(-2) + 13 = 11`
- Check point 2 (x=3): Can pair with point 3 (x=5, diff=2) and point 4 (x=6, diff=3 > k)
  - With point 3: `7 + 7 = 14`
- Check point 3 (x=5): Can pair with point 4 (x=6, diff=1)
  - With point 4: `(-3) + 6 = 3`

Maximum value is 15 from points (1,3) and (3,10).

## Brute Force Approach

The brute force solution checks all pairs `(i, j)` where `i < j` and `xj - xi ≤ k`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def findMaxValueOfEquation(points, k):
    max_val = float('-inf')
    n = len(points)

    for i in range(n):
        xi, yi = points[i]
        for j in range(i + 1, n):
            xj, yj = points[j]
            # Since points are sorted by x, xj > xi
            if xj - xi > k:
                break  # No need to check further j's since x increases
            value = yi + yj + (xj - xi)
            max_val = max(max_val, value)

    return max_val
```

```javascript
// Time: O(n²) | Space: O(1)
function findMaxValueOfEquation(points, k) {
  let maxVal = -Infinity;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const [xi, yi] = points[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj] = points[j];
      // Since points are sorted by x, xj > xi
      if (xj - xi > k) {
        break; // No need to check further j's since x increases
      }
      const value = yi + yj + (xj - xi);
      maxVal = Math.max(maxVal, value);
    }
  }

  return maxVal;
}
```

```java
// Time: O(n²) | Space: O(1)
public int findMaxValueOfEquation(int[][] points, int k) {
    int maxVal = Integer.MIN_VALUE;
    int n = points.length;

    for (int i = 0; i < n; i++) {
        int xi = points[i][0];
        int yi = points[i][1];
        for (int j = i + 1; j < n; j++) {
            int xj = points[j][0];
            int yj = points[j][1];
            // Since points are sorted by x, xj > xi
            if (xj - xi > k) {
                break;  // No need to check further j's since x increases
            }
            int value = yi + yj + (xj - xi);
            maxVal = Math.max(maxVal, value);
        }
    }

    return maxVal;
}
```

</div>

**Why it's too slow:** For each point `i`, we might check many `j` values until `xj - xi > k`. In the worst case (when `k` is large), we check all pairs, giving O(n²) time complexity. With `n` up to 10⁵, this is far too slow.

## Optimized Approach

The key insight comes from rewriting the equation. Since `xj > xi` (points are sorted), we have:

```
yi + yj + |xi - xj| = yi + yj + (xj - xi) = (yi - xi) + (yj + xj)
```

For a fixed `j`, we want to find the maximum `(yi - xi)` among all `i < j` where `xj - xi ≤ k`.

This is a sliding window maximum problem! We maintain a window of points where `xj - xi ≤ k`, and we want the maximum `(yi - xi)` in that window.

We can use a monotonic decreasing deque (double-ended queue) to efficiently track the maximum `(yi - xi)`:

1. Store `(xi, yi - xi)` in the deque
2. Keep the deque in decreasing order of `(yi - xi)`
3. Remove points from the front when `xj - xi > k` (out of window)
4. The front of the deque always has the maximum `(yi - xi)` for current `j`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findMaxValueOfEquation(points, k):
    """
    Find maximum value of yi + yj + |xi - xj| where |xi - xj| <= k and i < j.

    Approach: Use a monotonic decreasing deque to track maximum (yi - xi)
    for points within distance k of current point j.
    """
    from collections import deque

    max_value = float('-inf')
    dq = deque()  # Stores tuples of (xi, yi - xi)

    for xj, yj in points:
        # Remove points from front that are too far from current point
        while dq and xj - dq[0][0] > k:
            dq.popleft()

        # If deque is not empty, calculate potential max value
        if dq:
            # Current max value = max(yi - xi) + (yj + xj)
            curr_value = dq[0][1] + (yj + xj)
            max_value = max(max_value, curr_value)

        # Maintain deque in decreasing order of (yi - xi)
        # Remove points from back with smaller or equal (yi - xi)
        curr_y_minus_x = yj - xj
        while dq and dq[-1][1] <= curr_y_minus_x:
            dq.pop()

        # Add current point to deque
        dq.append((xj, curr_y_minus_x))

    return max_value
```

```javascript
// Time: O(n) | Space: O(n)
function findMaxValueOfEquation(points, k) {
  /**
   * Find maximum value of yi + yj + |xi - xj| where |xi - xj| <= k and i < j.
   *
   * Approach: Use a monotonic decreasing deque to track maximum (yi - xi)
   * for points within distance k of current point j.
   */
  let maxValue = -Infinity;
  const deque = []; // Array acting as deque, stores [xi, yi - xi]

  for (const [xj, yj] of points) {
    // Remove points from front that are too far from current point
    while (deque.length > 0 && xj - deque[0][0] > k) {
      deque.shift();
    }

    // If deque is not empty, calculate potential max value
    if (deque.length > 0) {
      // Current max value = max(yi - xi) + (yj + xj)
      const currValue = deque[0][1] + (yj + xj);
      maxValue = Math.max(maxValue, currValue);
    }

    // Maintain deque in decreasing order of (yi - xi)
    // Remove points from back with smaller or equal (yi - xi)
    const currYMinusX = yj - xj;
    while (deque.length > 0 && deque[deque.length - 1][1] <= currYMinusX) {
      deque.pop();
    }

    // Add current point to deque
    deque.push([xj, currYMinusX]);
  }

  return maxValue;
}
```

```java
// Time: O(n) | Space: O(n)
public int findMaxValueOfEquation(int[][] points, int k) {
    /**
     * Find maximum value of yi + yj + |xi - xj| where |xi - xj| <= k and i < j.
     *
     * Approach: Use a monotonic decreasing deque to track maximum (yi - xi)
     * for points within distance k of current point j.
     */
    int maxValue = Integer.MIN_VALUE;
    // Deque stores arrays: [xi, yi - xi]
    Deque<int[]> deque = new ArrayDeque<>();

    for (int[] point : points) {
        int xj = point[0];
        int yj = point[1];

        // Remove points from front that are too far from current point
        while (!deque.isEmpty() && xj - deque.peekFirst()[0] > k) {
            deque.pollFirst();
        }

        // If deque is not empty, calculate potential max value
        if (!deque.isEmpty()) {
            // Current max value = max(yi - xi) + (yj + xj)
            int currValue = deque.peekFirst()[1] + (yj + xj);
            maxValue = Math.max(maxValue, currValue);
        }

        // Maintain deque in decreasing order of (yi - xi)
        // Remove points from back with smaller or equal (yi - xi)
        int currYMinusX = yj - xj;
        while (!deque.isEmpty() && deque.peekLast()[1] <= currYMinusX) {
            deque.pollLast();
        }

        // Add current point to deque
        deque.offerLast(new int[]{xj, currYMinusX});
    }

    return maxValue;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each point exactly once
- Each point is added to the deque once and removed at most once
- The while loops for maintaining the deque run in amortized O(1) time per point

**Space Complexity:** O(n)

- In the worst case, we might store all points in the deque (when k is very large)
- The deque can contain up to n elements

## Common Mistakes

1. **Forgetting to check the distance constraint:** Some candidates correctly implement the deque for tracking maximum `(yi - xi)` but forget to remove points that are too far away (`xj - xi > k`). This leads to considering invalid pairs.

2. **Incorrect deque ordering:** The deque must be maintained in **decreasing** order of `(yi - xi)`. If you maintain it in increasing order, you won't get the maximum value at the front.

3. **Not handling empty deque case:** When the deque is empty (at the beginning or after removing invalid points), you shouldn't try to calculate a value. Always check if the deque is not empty before accessing the front element.

4. **Using a heap instead of deque:** A max-heap could work but would be O(n log n). The deque gives us O(n) time because we can remove from both ends efficiently. With a heap, removing elements that go out of the window would require lazy deletion or be inefficient.

## When You'll See This Pattern

This "monotonic deque for sliding window maximum" pattern appears in several problems:

1. **Sliding Window Maximum (LeetCode 239)** - Direct application of the pattern to find maximum in each sliding window.

2. **Shortest Subarray with Sum at Least K (LeetCode 862)** - Uses a monotonic deque to maintain prefix sums for finding minimum length subarrays.

3. **Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit (LeetCode 1438)** - Uses two deques to track min and max in a sliding window.

The pattern is useful whenever you need to efficiently track extreme values (min/max) in a sliding window while being able to add new elements and remove old ones from both ends.

## Key Takeaways

1. **Rewrite equations creatively:** The key insight came from rewriting `yi + yj + |xi - xj|` as `(yi - xi) + (yj + xj)` when `xj > xi`. Always look for ways to separate variables that depend on different indices.

2. **Recognize sliding window maximum problems:** When you need the maximum of some expression for elements within a distance constraint, consider using a monotonic deque.

3. **Monotonic deque maintains optimal candidates:** By keeping the deque in decreasing order, the front always has the best candidate. Remove from front when elements leave the window, and from back when new elements are better than existing ones.

Related problems: [Count Pairs in Two Arrays](/problem/count-pairs-in-two-arrays)
