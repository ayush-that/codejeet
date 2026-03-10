---
title: "How to Solve Maximum Containers on a Ship — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Containers on a Ship. Easy difficulty, 75.2% acceptance rate. Topics: Math."
date: "2028-08-06"
category: "dsa-patterns"
tags: ["maximum-containers-on-a-ship", "math", "easy"]
---

# How to Solve Maximum Containers on a Ship

This problem asks: given an `n x n` cargo deck where each container weighs exactly `w`, and a maximum weight capacity `maxWeight`, what's the maximum number of containers you can load without exceeding capacity? The challenge lies in recognizing that this isn't a complex optimization problem—it's a simple calculation that tests your ability to translate constraints into mathematical operations.

## Visual Walkthrough

Let's trace through an example: `n = 3`, `w = 2`, `maxWeight = 15`.

**Step 1:** Calculate total deck capacity

- The deck is `n x n`, so there are `3 × 3 = 9` total cells
- If we filled all cells, we'd have 9 containers

**Step 2:** Calculate total weight if we fill all cells

- Each container weighs `w = 2`
- Total weight = `9 × 2 = 18`

**Step 3:** Compare with maxWeight

- `18 > 15`, so we can't load all containers
- We need to find how many we CAN load

**Step 4:** Calculate maximum containers

- Each container weighs exactly 2
- Maximum containers = floor(maxWeight / w) = floor(15 / 2) = 7
- But wait! We only have 9 cells, so we're limited by both weight AND space

**Step 5:** Apply both constraints

- Weight limit allows: 7 containers
- Space limit allows: 9 containers
- We take the minimum: min(7, 9) = 7 containers

Let's verify: 7 containers × 2 weight each = 14 total weight, which is ≤ 15, and fits in our 3×3 deck.

## Brute Force Approach

A naive approach might try to simulate loading containers one by one until we hit either weight or space limits:

<div class="code-group">

```python
# Time: O(min(n², maxWeight/w)) | Space: O(1)
def maxContainersBrute(n, w, maxWeight):
    total_cells = n * n
    containers = 0
    current_weight = 0

    # Try to add containers until we hit a limit
    while containers < total_cells and current_weight + w <= maxWeight:
        containers += 1
        current_weight += w

    return containers
```

```javascript
// Time: O(min(n², maxWeight/w)) | Space: O(1)
function maxContainersBrute(n, w, maxWeight) {
  const totalCells = n * n;
  let containers = 0;
  let currentWeight = 0;

  // Try to add containers until we hit a limit
  while (containers < totalCells && currentWeight + w <= maxWeight) {
    containers++;
    currentWeight += w;
  }

  return containers;
}
```

```java
// Time: O(min(n², maxWeight/w)) | Space: O(1)
public int maxContainersBrute(int n, int w, int maxWeight) {
    int totalCells = n * n;
    int containers = 0;
    int currentWeight = 0;

    // Try to add containers until we hit a limit
    while (containers < totalCells && currentWeight + w <= maxWeight) {
        containers++;
        currentWeight += w;
    }

    return containers;
}
```

</div>

**Why this is inefficient:** While this works, it's unnecessarily slow for large inputs. If `n = 10^5`, we'd have 10^10 cells, and if `w = 1` and `maxWeight = 10^9`, we'd loop 10^9 times! We can solve this with simple math in O(1) time.

## Optimal Solution

The key insight is that we have two independent constraints:

1. **Space constraint:** Maximum containers = `n × n` (total cells)
2. **Weight constraint:** Maximum containers = `floor(maxWeight / w)` (weight capacity divided by container weight)

The actual maximum is the smaller of these two values. We calculate both and return the minimum.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def maxContainers(n, w, maxWeight):
    """
    Calculate maximum containers that can be loaded on an n x n deck.

    Args:
        n: Dimension of the square deck (n x n)
        w: Weight of each container (positive integer)
        maxWeight: Maximum total weight capacity

    Returns:
        Maximum number of containers that can be loaded
    """
    # Step 1: Calculate maximum containers based on available space
    # The deck has n rows and n columns, so total cells = n * n
    max_by_space = n * n

    # Step 2: Calculate maximum containers based on weight capacity
    # Each container weighs w, so we can load at most floor(maxWeight / w) containers
    max_by_weight = maxWeight // w  # Integer division gives us floor()

    # Step 3: We're limited by both constraints, so take the minimum
    # If weight allows more than space, we're space-limited
    # If space allows more than weight, we're weight-limited
    return min(max_by_space, max_by_weight)
```

```javascript
// Time: O(1) | Space: O(1)
function maxContainers(n, w, maxWeight) {
  /**
   * Calculate maximum containers that can be loaded on an n x n deck.
   *
   * @param {number} n - Dimension of the square deck (n x n)
   * @param {number} w - Weight of each container (positive integer)
   * @param {number} maxWeight - Maximum total weight capacity
   * @returns {number} Maximum number of containers that can be loaded
   */

  // Step 1: Calculate maximum containers based on available space
  // The deck has n rows and n columns, so total cells = n * n
  const maxBySpace = n * n;

  // Step 2: Calculate maximum containers based on weight capacity
  // Each container weighs w, so we can load at most floor(maxWeight / w) containers
  const maxByWeight = Math.floor(maxWeight / w);

  // Step 3: We're limited by both constraints, so take the minimum
  // If weight allows more than space, we're space-limited
  // If space allows more than weight, we're weight-limited
  return Math.min(maxBySpace, maxByWeight);
}
```

```java
// Time: O(1) | Space: O(1)
public int maxContainers(int n, int w, int maxWeight) {
    /**
     * Calculate maximum containers that can be loaded on an n x n deck.
     *
     * @param n Dimension of the square deck (n x n)
     * @param w Weight of each container (positive integer)
     * @param maxWeight Maximum total weight capacity
     * @return Maximum number of containers that can be loaded
     */

    // Step 1: Calculate maximum containers based on available space
    // The deck has n rows and n columns, so total cells = n * n
    int maxBySpace = n * n;

    // Step 2: Calculate maximum containers based on weight capacity
    // Each container weighs w, so we can load at most floor(maxWeight / w) containers
    int maxByWeight = maxWeight / w;  // Integer division in Java gives floor()

    // Step 3: We're limited by both constraints, so take the minimum
    // If weight allows more than space, we're space-limited
    // If space allows more than weight, we're weight-limited
    return Math.min(maxBySpace, maxByWeight);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform only a few arithmetic operations: multiplication, division, and min()
- These operations take constant time regardless of input size

**Space Complexity: O(1)**

- We use only a few variables to store intermediate results
- No data structures that grow with input size

## Common Mistakes

1. **Forgetting integer division:** Using regular division (`/`) instead of integer division (`//` in Python, `Math.floor()` in JavaScript, or `/` with integers in Java) can give fractional results. Since we can't load partial containers, we must round down.

2. **Calculating space incorrectly:** Some candidates might calculate `n²` as `n * 2` instead of `n * n`. Remember: an `n x n` grid has `n²` cells, not `2n`.

3. **Over-optimizing prematurely:** While the O(1) solution is simple, some candidates might jump to it without explaining their reasoning. In an interview, walk through the brute force first to show you understand the problem, then optimize.

4. **Not handling edge cases:** While the problem states inputs are positive integers, in real interviews you should consider:
   - What if `w > maxWeight`? Then `maxWeight // w = 0`, and we correctly return 0.
   - What if `w = 0`? This would cause division by zero, but the problem states `w` is positive.

## When You'll See This Pattern

This "minimum of constraints" pattern appears in many optimization problems:

1. **LeetCode 1464: Maximum Product of Two Elements in an Array** - You need to find the two largest numbers, similar to how we find the limiting constraint here.

2. **LeetCode 1013: Partition Array Into Three Parts With Equal Sum** - You're balancing multiple constraints (three equal sums) and finding if it's possible.

3. **LeetCode 1103: Distribute Candies to People** - Distributing limited resources (candies) according to multiple constraints (people count, distribution pattern).

The core idea is recognizing when a problem has independent constraints and the solution is simply the most restrictive one.

## Key Takeaways

1. **Look for independent constraints:** When a problem has multiple limitations (space, weight, time, etc.), the solution is often just the minimum of what each constraint allows individually.

2. **Math beats simulation:** Many "Easy" problems that seem like they need loops can be solved with simple arithmetic. Before writing code, ask: "Can I calculate this directly?"

3. **Test with small examples:** The visual walkthrough with `n=3, w=2, maxWeight=15` made the solution obvious. Always test your reasoning on concrete examples before coding.

[Practice this problem on CodeJeet](/problem/maximum-containers-on-a-ship)
