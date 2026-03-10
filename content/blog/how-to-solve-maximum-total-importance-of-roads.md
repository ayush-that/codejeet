---
title: "How to Solve Maximum Total Importance of Roads — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Total Importance of Roads. Medium difficulty, 69.1% acceptance rate. Topics: Greedy, Graph Theory, Sorting, Heap (Priority Queue)."
date: "2026-07-17"
category: "dsa-patterns"
tags: ["maximum-total-importance-of-roads", "greedy", "graph-theory", "sorting", "medium"]
---

# How to Solve Maximum Total Importance of Roads

This problem asks us to assign unique integer values from 1 to n to n cities such that the total "importance" of all roads is maximized. The importance of a road connecting two cities is simply the sum of their assigned values. What makes this problem interesting is that it's not about finding the optimal path or traversal, but about strategically assigning values to maximize a sum based on connectivity.

The key insight is that cities with more connections (higher degree) should receive higher values, since they contribute to more roads. This becomes a classic greedy assignment problem once we recognize the relationship between a city's connectivity and its optimal value.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
n = 5
roads = [[0,1],[1,2],[2,3],[0,2],[1,3]]
```

**Step 1: Calculate city degrees (number of connections)**

We have 5 cities (0-4). Let's count how many roads connect to each city:

- City 0: connected to 1 and 2 → degree = 2
- City 1: connected to 0, 2, and 3 → degree = 3
- City 2: connected to 1, 3, and 0 → degree = 3
- City 3: connected to 2 and 1 → degree = 2
- City 4: no connections → degree = 0

**Step 2: Sort cities by degree**

Cities sorted by degree (descending):

- City 1: degree 3
- City 2: degree 3
- City 0: degree 2
- City 3: degree 2
- City 4: degree 0

**Step 3: Assign values greedily**

We assign the highest values to cities with highest degrees:

- City 1 gets value 5 (highest available)
- City 2 gets value 4
- City 0 gets value 3
- City 3 gets value 2
- City 4 gets value 1

**Step 4: Calculate total importance**

Now compute the importance of each road:

- Road [0,1]: 3 + 5 = 8
- Road [1,2]: 5 + 4 = 9
- Road [2,3]: 4 + 2 = 6
- Road [0,2]: 3 + 4 = 7
- Road [1,3]: 5 + 2 = 7

Total importance = 8 + 9 + 6 + 7 + 7 = 37

This is the maximum possible total importance. If we had assigned values differently (like giving city 4 a high value), we would get a lower total because city 4's value only contributes to 0 roads.

## Brute Force Approach

A naive approach would be to try all possible assignments of values 1 through n to the n cities. For each assignment, we would calculate the total importance by summing the values of the two endpoints for each road.

The brute force solution would:

1. Generate all permutations of values 1 through n assigned to cities 0 through n-1
2. For each permutation, calculate the total importance
3. Track the maximum importance found

This approach has factorial time complexity O(n! × m) where m is the number of roads, since there are n! possible assignments and we need to evaluate each one. For n = 20, that's already 2.4 × 10¹⁸ operations - completely infeasible.

Even for small n, this approach is inefficient because it doesn't leverage the insight that cities with more connections should get higher values. The brute force essentially wastes time evaluating obviously suboptimal assignments.

## Optimized Approach

The key insight is mathematical: The total importance can be expressed as:

```
Total Importance = Σ(value[city] × degree[city])
```

Why? Because each road [a,b] contributes value[a] + value[b] to the total. If we think about how many times each city's value gets counted, it's exactly once for each road connected to that city. So city i's value gets added degree[i] times.

Therefore, to maximize the total, we should assign the largest values to cities with the highest degrees. This is a direct application of the rearrangement inequality, which states that to maximize the sum of products, we should pair larger numbers with larger numbers.

The optimal strategy becomes:

1. Calculate the degree (number of connections) for each city
2. Sort cities by their degree in descending order
3. Assign the highest value (n) to the city with highest degree, then n-1 to the next highest, and so on
4. Compute the total importance using the formula above

This greedy approach works because any swap of values between two cities would not increase the total if the higher-value city doesn't have the higher degree.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n log n + m) where n = number of cities, m = number of roads
# Space: O(n) for storing degrees and sorting
def maximumImportance(n, roads):
    # Step 1: Initialize degree array for all cities
    # degree[i] will store how many roads connect to city i
    degree = [0] * n

    # Step 2: Calculate degree for each city
    # For each road [a, b], both cities a and b get one more connection
    for a, b in roads:
        degree[a] += 1
        degree[b] += 1

    # Step 3: Sort degrees in descending order
    # Cities with more connections should get higher values
    degree.sort(reverse=True)

    # Step 4: Assign values and calculate total importance
    # The city with highest degree gets value n, next gets n-1, etc.
    total_importance = 0
    current_value = n  # Start with the highest possible value

    for d in degree:
        # Each city contributes its value multiplied by its degree
        total_importance += d * current_value
        current_value -= 1  # Decrease value for next city

    return total_importance
```

```javascript
// Time: O(n log n + m) where n = number of cities, m = number of roads
// Space: O(n) for storing degrees and sorting
function maximumImportance(n, roads) {
  // Step 1: Initialize degree array for all cities
  // degree[i] will store how many roads connect to city i
  const degree = new Array(n).fill(0);

  // Step 2: Calculate degree for each city
  // For each road [a, b], both cities a and b get one more connection
  for (const [a, b] of roads) {
    degree[a] += 1;
    degree[b] += 1;
  }

  // Step 3: Sort degrees in descending order
  // Cities with more connections should get higher values
  degree.sort((a, b) => b - a);

  // Step 4: Assign values and calculate total importance
  // The city with highest degree gets value n, next gets n-1, etc.
  let totalImportance = 0;
  let currentValue = n; // Start with the highest possible value

  for (const d of degree) {
    // Each city contributes its value multiplied by its degree
    totalImportance += d * currentValue;
    currentValue -= 1; // Decrease value for next city
  }

  return totalImportance;
}
```

```java
// Time: O(n log n + m) where n = number of cities, m = number of roads
// Space: O(n) for storing degrees and sorting
public long maximumImportance(int n, int[][] roads) {
    // Step 1: Initialize degree array for all cities
    // degree[i] will store how many roads connect to city i
    int[] degree = new int[n];

    // Step 2: Calculate degree for each city
    // For each road [a, b], both cities a and b get one more connection
    for (int[] road : roads) {
        int a = road[0];
        int b = road[1];
        degree[a] += 1;
        degree[b] += 1;
    }

    // Step 3: Sort degrees in ascending order (we'll traverse in reverse)
    // Using Integer array for proper sorting
    Integer[] degreeObj = new Integer[n];
    for (int i = 0; i < n; i++) {
        degreeObj[i] = degree[i];
    }
    Arrays.sort(degreeObj, Collections.reverseOrder());

    // Step 4: Assign values and calculate total importance
    // The city with highest degree gets value n, next gets n-1, etc.
    long totalImportance = 0;  // Use long to avoid overflow
    long currentValue = n;  // Start with the highest possible value

    for (int d : degreeObj) {
        // Each city contributes its value multiplied by its degree
        totalImportance += (long) d * currentValue;
        currentValue -= 1;  // Decrease value for next city
    }

    return totalImportance;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + m)**

- O(m) time to calculate degrees by iterating through all roads once
- O(n log n) time to sort the degrees array
- O(n) time to calculate the total importance
- Dominated by O(n log n) for sorting when n is large

**Space Complexity: O(n)**

- O(n) space to store the degree array
- O(log n) to O(n) additional space for sorting (depending on the sorting algorithm)
- Overall O(n) space complexity

The solution is optimal because:

1. We must at least read all roads (O(m)) and process all cities (O(n))
2. Sorting is necessary to match highest values with highest degrees
3. Any comparison-based sorting requires Ω(n log n) time in the worst case

## Common Mistakes

1. **Forgetting that roads are bidirectional**: Each road contributes to the degree of both cities. Some candidates might only increment one city's degree, effectively treating roads as directed.

2. **Using int instead of long for the total (Java/C++)**: The maximum total can be up to n × (sum of degrees). For n = 10⁵ and each city connected to all others, this exceeds 2³¹. Always use 64-bit integers for accumulation problems with large n.

3. **Sorting in ascending order instead of descending**: If you sort ascending and assign values 1, 2, 3,... starting from the lowest degree, you'll minimize rather than maximize the total. Remember: highest degree gets highest value.

4. **Overcomplicating with priority queues**: While a max-heap could work, it's unnecessary. Simple array sorting is more efficient and clearer. The extra O(n) space for a heap doesn't improve the O(n log n) time complexity.

## When You'll See This Pattern

This problem uses the **"rearrangement inequality"** pattern combined with **degree counting in graphs**. You'll encounter similar patterns in:

1. **Maximum Product of Two Elements in an Array** (LeetCode 1464): Assign the largest values to the largest numbers to maximize product sums.

2. **Minimum Product Sum of Two Arrays** (LeetCode 1874): Similar rearrangement concept but for minimization - pair largest with smallest.

3. **Reduce Array Size to The Half** (LeetCode 1338): Count frequencies and process from highest to lowest, similar to processing by degree.

4. **Task Scheduler** (LeetCode 621): Process tasks with highest frequency first, analogous to assigning values to highest-degree cities first.

The core pattern is: when you need to maximize/minimize a sum of products, sort both lists and pair corresponding elements (largest with largest for maximization, largest with smallest for minimization).

## Key Takeaways

1. **Degree analysis is powerful**: In graph problems where each node's contribution scales with its connections, counting and sorting by degree often reveals the optimal strategy.

2. **Rearrangement inequality**: For maximizing Σ(aᵢ × bᵢ), sort both sequences in the same order. For minimizing, sort in opposite orders. This mathematical principle appears in many optimization problems.

3. **Greedy can be proven optimal**: When a greedy approach seems intuitive (like giving highest values to most connected cities), look for a mathematical justification like the rearrangement inequality to prove its optimality to the interviewer.

[Practice this problem on CodeJeet](/problem/maximum-total-importance-of-roads)
