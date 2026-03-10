---
title: "How to Solve Find Positive Integer Solution for a Given Equation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Positive Integer Solution for a Given Equation. Medium difficulty, 69.8% acceptance rate. Topics: Math, Two Pointers, Binary Search, Interactive."
date: "2027-11-02"
category: "dsa-patterns"
tags:
  [
    "find-positive-integer-solution-for-a-given-equation",
    "math",
    "two-pointers",
    "binary-search",
    "medium",
  ]
---

# How to Solve "Find Positive Integer Solution for a Given Equation"

This problem presents an interesting twist on search problems: you're given a "black box" function `f(x, y)` with a hidden formula, but you know it's **monotonically increasing** in both `x` and `y`. Your task is to find all positive integer pairs `(x, y)` where `f(x, y) = z`. The monotonic property is your key to solving this efficiently without knowing the actual formula.

What makes this problem tricky is that you can't directly solve for `x` and `y` since you don't know the formula, but the monotonic constraint allows you to systematically search the solution space much more efficiently than brute force.

## Visual Walkthrough

Let's walk through an example. Suppose we have a hidden function where `f(x, y) = x² + y²` (though we don't know this formula during the problem). We're told `z = 25`, and we need to find all positive integer pairs `(x, y)` where `f(x, y) = 25`.

**Step 1:** Since `f` is monotonically increasing in both variables, if we fix `x = 1`, then as `y` increases, `f(1, y)` increases. We can find if there's a `y` where `f(1, y) = 25` using binary search on `y` from 1 to 1000 (the problem constraints say `x, y ≤ 1000`).

**Step 2:** For `x = 1`, we try different `y` values:

- `f(1, 1) = 1² + 1² = 2` (too small)
- `f(1, 5) = 1² + 5² = 26` (too large)
- `f(1, 4) = 1² + 4² = 17` (too small)
- `f(1, 4)` is too small and `f(1, 5)` is too large, so no integer `y` gives exactly 25 when `x = 1`.

**Step 3:** Move to `x = 2`:

- `f(2, 1) = 2² + 1² = 5` (too small)
- `f(2, 5) = 2² + 5² = 29` (too large)
- `f(2, 4) = 2² + 4² = 20` (too small)
- `f(2, 5)` is too large, so no solution for `x = 2`.

**Step 4:** Continue this process. When we reach `x = 3`:

- `f(3, 4) = 3² + 4² = 25` (exact match!) → Add `(3, 4)` to results
- Also `f(4, 3) = 4² + 3² = 25` (exact match!) → Add `(4, 3)` to results

**Step 5:** Since the function is symmetric in this example (though not necessarily in the actual problem), we find both `(3, 4)` and `(4, 3)`. We continue until `x` reaches a point where even the smallest `y` (1) gives `f(x, 1) > z`, at which point we can stop.

## Brute Force Approach

The most straightforward approach would be to try all possible pairs of `x` and `y` from 1 to 1000:

1. For `x` from 1 to 1000
2. For `y` from 1 to 1000
3. If `f(x, y) == z`, add `(x, y)` to results

This approach has O(1000 × 1000) = O(1,000,000) calls to `f`, which might seem acceptable since 1000² is only 1 million. However, the problem constraints actually allow `x` and `y` up to 1000, but in the worst case, this is still O(n²) complexity where n is the upper bound. More importantly, we can do much better by leveraging the monotonic property.

The brute force approach misses the key insight: since `f` is monotonically increasing, for each fixed `x`, there's at most one `y` that could satisfy `f(x, y) = z`. This allows us to use binary search instead of linear search for `y`.

## Optimized Approach

The key insight comes from the monotonic property: for a fixed `x`, as `y` increases, `f(x, y)` increases. This means that for each `x`, the values `f(x, 1)`, `f(x, 2)`, `f(x, 3)`, ... form a **sorted array**.

This gives us two efficient strategies:

**Strategy 1: Binary Search for Each x**
For each `x` from 1 upwards:

1. Use binary search to find if there exists a `y` such that `f(x, y) = z`
2. Since `f(x, y)` increases with `y`, we can:
   - Start with `y_low = 1`, `y_high = 1000`
   - While `y_low ≤ y_high`:
     - Compute `y_mid = (y_low + y_high) // 2`
     - If `f(x, y_mid) == z`, we found a solution
     - If `f(x, y_mid) < z`, search in the right half (`y_low = y_mid + 1`)
     - If `f(x, y_mid) > z`, search in the left half (`y_high = y_mid - 1`)

**Strategy 2: Two Pointers (More Efficient)**
We can use a two-pointer approach that's even more efficient:

1. Start with `x = 1` and `y = 1000` (maximum)
2. While `x ≤ 1000` and `y ≥ 1`:
   - Compute `val = f(x, y)`
   - If `val == z`, add `(x, y)` to results, then increment `x` and decrement `y`
   - If `val < z`, increment `x` (we need a larger value)
   - If `val > z`, decrement `y` (we need a smaller value)

The two-pointer approach works because:

- When `f(x, y) < z`, increasing `x` will increase the function value (monotonic in `x`)
- When `f(x, y) > z`, decreasing `y` will decrease the function value (monotonic in `y`)
- This gives us O(n) time complexity instead of O(n log n)

## Optimal Solution

Here's the complete solution using the two-pointer approach, which is optimal for this problem:

<div class="code-group">

```python
"""
Time Complexity: O(n) where n is the upper bound (1000 in this case)
Space Complexity: O(k) where k is the number of valid pairs (for storing results)
"""
class Solution:
    def findSolution(self, customfunction: 'CustomFunction', z: int) -> List[List[int]]:
        result = []
        x, y = 1, 1000  # Start with smallest x and largest y

        # Two-pointer approach: move x up and y down based on function value
        while x <= 1000 and y >= 1:
            val = customfunction.f(x, y)

            if val == z:
                # Found a valid pair
                result.append([x, y])
                x += 1  # Move to next x
                y -= 1  # Move to previous y
            elif val < z:
                # Function value too small, increase x to get larger value
                x += 1
            else:
                # Function value too large, decrease y to get smaller value
                y -= 1

        return result
```

```javascript
/**
 * Time Complexity: O(n) where n is the upper bound (1000 in this case)
 * Space Complexity: O(k) where k is the number of valid pairs
 */
var findSolution = function (customfunction, z) {
  const result = [];
  let x = 1,
    y = 1000; // Start with smallest x and largest y

  // Two-pointer approach: adjust x and y based on function value
  while (x <= 1000 && y >= 1) {
    const val = customfunction.f(x, y);

    if (val === z) {
      // Found a valid pair
      result.push([x, y]);
      x++; // Move to next x
      y--; // Move to previous y
    } else if (val < z) {
      // Value too small, increase x
      x++;
    } else {
      // Value too large, decrease y
      y--;
    }
  }

  return result;
};
```

```java
/**
 * Time Complexity: O(n) where n is the upper bound (1000 in this case)
 * Space Complexity: O(k) where k is the number of valid pairs
 */
class Solution {
    public List<List<Integer>> findSolution(CustomFunction customfunction, int z) {
        List<List<Integer>> result = new ArrayList<>();
        int x = 1, y = 1000;  // Start with smallest x and largest y

        // Two-pointer approach: adjust pointers based on function value
        while (x <= 1000 && y >= 1) {
            int val = customfunction.f(x, y);

            if (val == z) {
                // Found a valid pair
                List<Integer> pair = new ArrayList<>();
                pair.add(x);
                pair.add(y);
                result.add(pair);
                x++;  // Move to next x
                y--;  // Move to previous y
            } else if (val < z) {
                // Value too small, increase x
                x++;
            } else {
                // Value too large, decrease y
                y--;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we might check all values from `x = 1` to `1000` and `y = 1000` to `1`
- Each iteration either increases `x` or decreases `y`, so we have at most `1000 + 1000 = 2000` iterations
- This is linear in terms of the upper bound `n = 1000`

**Space Complexity: O(k)**

- We only store the valid pairs in the result
- `k` is the number of pairs where `f(x, y) = z`
- In the worst case, if all pairs satisfy the condition, this would be O(n²), but that's determined by the output size, not the algorithm

## Common Mistakes

1. **Forgetting the monotonic property**: Some candidates try to solve this like a regular equation or use brute force without leveraging the sorted nature of the function values. Always read the problem statement carefully—the monotonic property is the key to an efficient solution.

2. **Incorrect bounds in two-pointer approach**: Starting with `x = 1, y = 1` won't work efficiently because when the value is too small, you need to decide whether to increase `x` or `y`. Starting at opposite ends (`x = 1, y = 1000`) gives you clear direction: if value is too small, increase `x`; if too large, decrease `y`.

3. **Off-by-one errors in binary search approach**: If using binary search for each `x`, common mistakes include:
   - Using `while (low < high)` instead of `while (low ≤ high)` and missing exact matches
   - Not updating bounds correctly (`mid ± 1` is crucial to avoid infinite loops)
   - Forgetting to handle the case where no `y` exists for a given `x`

4. **Assuming symmetry**: The function `f(x, y)` is monotonically increasing but not necessarily symmetric. Don't assume that if `(x, y)` is a solution, then `(y, x)` is also a solution unless the problem states this property.

## When You'll See This Pattern

The two-pointer technique on a "sorted" 2D space appears in several problems:

1. **Search a 2D Matrix II (LeetCode 240)**: Given a matrix sorted row-wise and column-wise, search for a target value. The optimal solution starts from the top-right corner and moves left or down based on comparisons.

2. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Find two numbers in a sorted array that sum to a target. The two-pointer approach starts from both ends and moves inward.

3. **Container With Most Water (LeetCode 11)**: Find two lines that form the container with the most water. The two-pointer approach starts from both ends and moves the pointer pointing to the shorter line.

The common pattern: when you have a sorted structure (either explicitly or implicitly through monotonic properties), and you're searching for pairs or specific values, consider starting pointers at opposite ends and moving them based on comparisons.

## Key Takeaways

1. **Monotonic functions enable efficient search**: When a function increases (or decreases) consistently, you can use binary search or two-pointer techniques instead of checking all possibilities.

2. **Start pointers at opposite ends for 2D search**: When searching in two dimensions with monotonic properties, starting at minimum `x` and maximum `y` (or vice versa) gives you a clear search direction.

3. **Black box problems rely on properties, not formulas**: Even when you don't know the exact formula, you can solve the problem efficiently by leveraging given properties (like monotonicity in this case).

[Practice this problem on CodeJeet](/problem/find-positive-integer-solution-for-a-given-equation)
