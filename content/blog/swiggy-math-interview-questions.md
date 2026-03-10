---
title: "Math Questions at Swiggy: What to Expect"
description: "Prepare for Math interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-01-26"
category: "dsa-patterns"
tags: ["swiggy", "math", "interview prep"]
---

## Why Math Matters at Swiggy

If you're preparing for Swiggy interviews, you might be surprised to see that approximately 15% of their coding questions (6 out of 41) are math-focused. This isn't random — it's strategic. Swiggy operates in the hyperlocal delivery space where mathematical thinking directly translates to business impact. Route optimization, delivery time estimation, surge pricing algorithms, inventory management, and even restaurant recommendation systems all rely on mathematical foundations.

In real interviews, math questions appear consistently across all engineering levels. For junior roles, they test basic problem-solving and numerical reasoning. For senior positions, they become more nuanced, often disguised as system design or optimization problems. The key insight: Swiggy doesn't ask abstract math for its own sake. Every math problem relates to their core business — whether it's calculating delivery distances, optimizing resource allocation, or analyzing time-series data.

## Specific Patterns Swiggy Favors

Swiggy's math questions cluster around three practical domains:

1. **Modular Arithmetic and Number Properties** — Essential for hashing, distribution problems, and cyclic operations. You'll see problems about finding remainders, working with large numbers, and cyclic rotations.

2. **Combinatorics and Probability** — Not theoretical probability, but applied counting problems. Think: "How many ways can we assign N delivery agents to M orders?" or "What's the probability a delivery arrives within the promised time window?"

3. **Geometric and Coordinate Math** — Directly applicable to their mapping and routing systems. Distance calculations, point-in-polygon problems, and nearest-neighbor queries appear frequently.

Here's a typical Swiggy-style problem: Given coordinates of restaurants and customers, find the minimum total distance to deliver all orders (similar to LeetCode #1584 "Min Cost to Connect All Points" but with delivery constraints).

<div class="code-group">

```python
# Swiggy-style: Minimum delivery distance between points
# Similar to Manhattan distance calculation with constraints
# Time: O(n) | Space: O(1)
def min_delivery_distance(points):
    """
    points: List of (x, y) coordinates for restaurants and customers
    Returns minimum Manhattan distance to connect all points
    """
    if not points:
        return 0

    # For Manhattan distance, we can separate x and y coordinates
    x_coords = sorted([p[0] for p in points])
    y_coords = sorted([p[1] for p in points])

    # Find median point (optimal meeting point for Manhattan distance)
    median_x = x_coords[len(x_coords) // 2]
    median_y = y_coords[len(y_coords) // 2]

    # Calculate total distance to median point
    total_distance = 0
    for x, y in points:
        total_distance += abs(x - median_x) + abs(y - median_y)

    return total_distance
```

```javascript
// Swiggy-style: Minimum delivery distance between points
// Time: O(n log n) for sorting | Space: O(n)
function minDeliveryDistance(points) {
  if (!points || points.length === 0) return 0;

  // Extract and sort coordinates
  const xCoords = points.map((p) => p[0]).sort((a, b) => a - b);
  const yCoords = points.map((p) => p[1]).sort((a, b) => a - b);

  // Find median indices
  const medianX = xCoords[Math.floor(xCoords.length / 2)];
  const medianY = yCoords[Math.floor(yCoords.length / 2)];

  // Calculate total Manhattan distance
  let totalDistance = 0;
  for (const [x, y] of points) {
    totalDistance += Math.abs(x - medianX) + Math.abs(y - medianY);
  }

  return totalDistance;
}
```

```java
// Swiggy-style: Minimum delivery distance between points
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

public class DeliveryDistance {
    public int minDeliveryDistance(int[][] points) {
        if (points == null || points.length == 0) return 0;

        int n = points.length;
        int[] xCoords = new int[n];
        int[] yCoords = new int[n];

        for (int i = 0; i < n; i++) {
            xCoords[i] = points[i][0];
            yCoords[i] = points[i][1];
        }

        Arrays.sort(xCoords);
        Arrays.sort(yCoords);

        int medianX = xCoords[n / 2];
        int medianY = yCoords[n / 2];

        int totalDistance = 0;
        for (int[] point : points) {
            totalDistance += Math.abs(point[0] - medianX) + Math.abs(point[1] - medianY);
        }

        return totalDistance;
    }
}
```

</div>

## How to Prepare

Swiggy's math questions test your ability to translate real-world constraints into mathematical models. Here's my preparation strategy:

1. **Master Modular Arithmetic** — Practice problems involving `%` operator, especially with large numbers. Understand properties like `(a + b) % m = (a % m + b % m) % m`.

2. **Learn Applied Combinatorics** — Focus on combinations (`nCr`) rather than permutations. Know when to use the multiplicative principle versus additive principle.

3. **Practice Coordinate Geometry** — Manhattan distance is more common than Euclidean distance in their problems. Understand how to optimize for grid-based movement.

Here's a combinatorics pattern that appears frequently:

<div class="code-group">

```python
# Swiggy-style: Count ways to assign delivery agents
# Similar to combinations calculation
# Time: O(k) | Space: O(1)
def count_assignments(n, k):
    """
    n: number of delivery agents
    k: number of orders (k <= n)
    Returns number of ways to assign k distinct orders to n agents
    where each agent gets at most one order
    """
    if k > n:
        return 0

    # nPk = n! / (n-k)! for distinct orders
    result = 1
    for i in range(n, n - k, -1):
        result *= i

    return result

# Alternative: If orders are identical, use combinations
def count_assignments_identical(n, k):
    """
    n: number of delivery agents
    k: number of identical orders
    Returns number of ways to assign k identical orders to n agents
    """
    # Stars and bars: C(n + k - 1, k)
    def comb(n, r):
        if r > n:
            return 0
        r = min(r, n - r)
        result = 1
        for i in range(1, r + 1):
            result = result * (n - i + 1) // i
        return result

    return comb(n + k - 1, k)
```

```javascript
// Swiggy-style: Count ways to assign delivery agents
// Time: O(k) | Space: O(1)
function countAssignments(n, k) {
  if (k > n) return 0;

  // nPk calculation
  let result = 1;
  for (let i = n; i > n - k; i--) {
    result *= i;
  }
  return result;
}

// For identical orders (combinations with repetition)
function countAssignmentsIdentical(n, k) {
  // Helper for combination calculation
  function comb(n, r) {
    if (r > n) return 0;
    r = Math.min(r, n - r);
    let result = 1;
    for (let i = 1; i <= r; i++) {
      result = (result * (n - i + 1)) / i;
    }
    return Math.round(result); // Result is always integer
  }

  return comb(n + k - 1, k);
}
```

```java
// Swiggy-style: Count ways to assign delivery agents
// Time: O(k) | Space: O(1)
public class AssignmentCounter {
    public int countAssignments(int n, int k) {
        if (k > n) return 0;

        int result = 1;
        for (int i = n; i > n - k; i--) {
            result *= i;
        }
        return result;
    }

    // For identical orders
    public int countAssignmentsIdentical(int n, int k) {
        return combination(n + k - 1, k);
    }

    private int combination(int n, int r) {
        if (r > n) return 0;
        r = Math.min(r, n - r);
        long result = 1;
        for (int i = 1; i <= r; i++) {
            result = result * (n - i + 1) / i;
        }
        return (int) result;
    }
}
```

</div>

## How Swiggy Tests Math vs Other Companies

Swiggy's math questions differ from other companies in three key ways:

1. **Practical Over Theoretical** — Unlike Google's abstract algorithm questions or Jane Street's probability puzzles, Swiggy's math problems have immediate business applications. You're never proving theorems; you're solving delivery logistics.

2. **Medium Difficulty with Real Constraints** — Swiggy problems are typically LeetCode Medium level, but they add real-world constraints. Instead of "find the shortest path," it's "find the shortest path given traffic patterns and restaurant prep times."

3. **Integration with System Design** — At senior levels, math questions often blend into system design. You might be asked to mathematically justify your architecture choices or calculate system limits.

Compared to FAANG companies, Swiggy places more weight on optimization mathematics and less on pure computer science theory. Their questions feel like mini-case studies from their actual engineering challenges.

## Study Order

Follow this sequence to build mathematical intuition systematically:

1. **Number Theory Basics** — Start with prime numbers, divisors, and modular arithmetic. These are building blocks for more complex problems. Practice: LeetCode #204 "Count Primes", #365 "Water and Jug Problem".

2. **Combinatorics Fundamentals** — Learn permutations, combinations, and the stars-and-bars method. Understand when order matters versus when it doesn't. Practice: LeetCode #62 "Unique Paths", #96 "Unique Binary Search Trees".

3. **Probability Applications** — Focus on discrete probability and expected value calculations. Practice: LeetCode #1227 "Airplane Seat Assignment Probability".

4. **Geometric Algorithms** — Master distance calculations, especially Manhattan distance. Learn about convex hulls and nearest neighbor searches. Practice: LeetCode #973 "K Closest Points to Origin", #223 "Rectangle Area".

5. **Optimization Mathematics** — Study greedy proofs and basic linear programming concepts. Practice: LeetCode #135 "Candy", #455 "Assign Cookies".

This order works because each topic builds on the previous one. Number theory gives you tools for counting problems. Combinatorics helps with probability. Geometry combines with optimization for delivery routing problems.

## Recommended Practice Order

Solve these problems in sequence to build Swiggy-specific math skills:

1. LeetCode #7 "Reverse Integer" — Basic number manipulation
2. LeetCode #50 "Pow(x, n)" — Fast exponentiation with modular arithmetic
3. LeetCode #172 "Factorial Trailing Zeroes" — Mathematical pattern recognition
4. LeetCode #462 "Minimum Moves to Equal Array Elements II" — Median optimization (key for Swiggy)
5. LeetCode #1010 "Pairs of Songs With Total Durations Divisible by 60" — Modular arithmetic application
6. LeetCode #1467 "Probability of a Two Boxes Having The Same Number of Distinct Balls" — Advanced probability
7. LeetCode #1573 "Number of Ways to Split a String" — Combinatorics with constraints
8. LeetCode #1584 "Min Cost to Connect All Points" — Geometric optimization

After completing these, search for "delivery", "distance", and "assignment" problems on LeetCode to find similar patterns.

Remember: Swiggy's math questions test your ability to model real-world constraints. Always ask clarifying questions about edge cases and business requirements during your interview. Think aloud about how your mathematical solution would scale with their actual data volumes.

[Practice Math at Swiggy](/company/swiggy/math)
