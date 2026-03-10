---
title: "How to Solve Destination City — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Destination City. Easy difficulty, 79.5% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-11-24"
category: "dsa-patterns"
tags: ["destination-city", "array", "hash-table", "string", "easy"]
---

# How to Solve Destination City

You're given a list of city pairs where each pair `[A, B]` means there's a direct path from city A to city B. Your task is to find the destination city — the city that has no outgoing paths to any other city. The tricky part is that while the problem seems simple, it requires careful tracking of which cities have outgoing paths versus which only have incoming paths.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

```
paths = [["London","New York"],["New York","Lima"],["Lima","Sao Paulo"]]
```

We need to find the city that has no outgoing path. Let's track this step by step:

1. **First path**: London → New York
   - London has an outgoing path (to New York)
   - New York has an incoming path (from London)

2. **Second path**: New York → Lima
   - New York has an outgoing path (to Lima)
   - Lima has an incoming path (from New York)

3. **Third path**: Lima → Sao Paulo
   - Lima has an outgoing path (to Sao Paulo)
   - Sao Paulo has an incoming path (from Lima)

Now let's list all cities and check which have outgoing paths:

- London: Has outgoing path to New York ✓
- New York: Has outgoing path to Lima ✓
- Lima: Has outgoing path to Sao Paulo ✓
- Sao Paulo: No outgoing path ✗

Sao Paulo is our destination city! Notice that the destination city appears only as the second element in pairs, never as the first. This gives us a clue for our solution.

## Brute Force Approach

A naive approach would be to:

1. Collect all cities that appear as starting points (first element in each pair)
2. Collect all cities that appear as ending points (second element in each pair)
3. Find which ending city doesn't appear as a starting point

While this approach works, it's not the most efficient implementation. A candidate might try to use nested loops to check each city against all others, which would be O(n²) time complexity. However, even the simple version above is actually optimal in terms of time complexity — the "brute force" here refers more to an inefficient implementation rather than an algorithmically different approach.

The key insight is that we need to track which cities have outgoing paths, and the destination city is simply the one that doesn't.

## Optimal Solution

The optimal solution uses a hash set to track cities with outgoing paths. We iterate through all paths, adding the starting city (first element) to our set. Then we iterate through all paths again, checking if the destination city (second element) exists in our set. The first destination city not found in the set is our answer.

<div class="code-group">

```python
# Time: O(n) where n is the number of paths
# Space: O(n) for storing cities with outgoing paths
def destCity(paths):
    """
    Finds the destination city that has no outgoing paths.

    Args:
        paths: List of lists where each inner list [A, B]
               represents a path from city A to city B

    Returns:
        The destination city name as a string
    """
    # Step 1: Create a set to store all cities that have outgoing paths
    # Using a set gives us O(1) lookup time
    outgoing_cities = set()

    # Step 2: First pass - collect all starting cities
    # These are cities that definitely have outgoing paths
    for path in paths:
        start_city = path[0]  # First city in the pair
        outgoing_cities.add(start_city)

    # Step 3: Second pass - find the destination city
    # The destination city will be an ending city that's not in our set
    for path in paths:
        end_city = path[1]  # Second city in the pair

        # If this ending city doesn't have any outgoing paths,
        # it must be our destination
        if end_city not in outgoing_cities:
            return end_city

    # According to the problem guarantee, we'll always find a destination
    # This return is just for safety
    return ""
```

```javascript
// Time: O(n) where n is the number of paths
// Space: O(n) for storing cities with outgoing paths
function destCity(paths) {
  /**
   * Finds the destination city that has no outgoing paths.
   *
   * @param {string[][]} paths - Array of arrays where each inner array [A, B]
   *                             represents a path from city A to city B
   * @return {string} The destination city name
   */

  // Step 1: Create a Set to store all cities that have outgoing paths
  // Using a Set gives us O(1) lookup time
  const outgoingCities = new Set();

  // Step 2: First pass - collect all starting cities
  // These are cities that definitely have outgoing paths
  for (const path of paths) {
    const startCity = path[0]; // First city in the pair
    outgoingCities.add(startCity);
  }

  // Step 3: Second pass - find the destination city
  // The destination city will be an ending city that's not in our set
  for (const path of paths) {
    const endCity = path[1]; // Second city in the pair

    // If this ending city doesn't have any outgoing paths,
    // it must be our destination
    if (!outgoingCities.has(endCity)) {
      return endCity;
    }
  }

  // According to the problem guarantee, we'll always find a destination
  // This return is just for safety
  return "";
}
```

```java
// Time: O(n) where n is the number of paths
// Space: O(n) for storing cities with outgoing paths
import java.util.HashSet;
import java.util.List;

public class Solution {
    public String destCity(List<List<String>> paths) {
        /**
         * Finds the destination city that has no outgoing paths.
         *
         * @param paths List of lists where each inner list [A, B]
         *              represents a path from city A to city B
         * @return The destination city name as a String
         */

        // Step 1: Create a HashSet to store all cities that have outgoing paths
        // Using a HashSet gives us O(1) average-case lookup time
        HashSet<String> outgoingCities = new HashSet<>();

        // Step 2: First pass - collect all starting cities
        // These are cities that definitely have outgoing paths
        for (List<String> path : paths) {
            String startCity = path.get(0);  // First city in the pair
            outgoingCities.add(startCity);
        }

        // Step 3: Second pass - find the destination city
        // The destination city will be an ending city that's not in our set
        for (List<String> path : paths) {
            String endCity = path.get(1);  // Second city in the pair

            // If this ending city doesn't have any outgoing paths,
            // it must be our destination
            if (!outgoingCities.contains(endCity)) {
                return endCity;
            }
        }

        // According to the problem guarantee, we'll always find a destination
        // This return is just for safety
        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the list of paths
- First pass: O(n) to add all starting cities to the set
- Second pass: O(n) to check each ending city against the set
- Set operations (add and contains) are O(1) on average
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- In the worst case, we store all starting cities in the set
- If every path starts from a different city, we store n cities
- Thus, space complexity is O(n)

## Common Mistakes

1. **Using lists instead of sets for lookup**: Some candidates use lists to store cities and then check membership using `in` operator (Python) or `contains` method (Java/JavaScript). This turns O(1) lookups into O(n), making the overall solution O(n²). Always use hash-based sets for membership testing.

2. **Only checking the last city**: Because the problem says the graph forms a line, some candidates assume the destination is always the last city in the last pair. While this might work for the given examples, it's not guaranteed by the problem statement. The paths could be given in any order.

3. **Forgetting to handle empty input**: While the problem guarantees at least one path, in real interviews you should mention edge cases. What if `paths` is empty? What if a city name is empty? Good candidates discuss these even if they don't implement handling for them.

4. **Confusing starting and ending cities**: When iterating, it's easy to accidentally check `path[0]` instead of `path[1]` in the second pass. Always be clear: starting cities go in the set, ending cities get checked against the set.

## When You'll See This Pattern

This "find the element that appears only in one context" pattern appears in many problems:

1. **Single Number (LeetCode 136)**: Find the number that appears exactly once while all others appear twice. The solution uses XOR to cancel out pairs, similar to how we track cities with outgoing vs incoming paths.

2. **Find the Town Judge (LeetCode 997)**: Similar concept where you track who trusts others vs who is trusted by others. The judge is someone who is trusted by everyone but trusts no one.

3. **Find the Difference (LeetCode 389)**: Given two strings where one has an extra character, find that character. You can use frequency counting similar to tracking outgoing paths.

The core pattern is: **When you need to track elements based on some property (outgoing paths, frequency, relationships), use hash maps or sets for O(1) lookups.**

## Key Takeaways

1. **Hash sets are perfect for membership testing**: When you need to quickly check if an element exists in a collection, use a hash-based set for O(1) average-time operations.

2. **Break problems into clear passes**: First collect information (which cities have outgoing paths), then use that information to find your answer. This separation of concerns makes code easier to understand and debug.

3. **Read problem guarantees carefully**: The guarantee that the graph forms a line without loops means there's exactly one destination city. This simplifies the problem — we don't need to handle multiple possible destinations or cycles.

[Practice this problem on CodeJeet](/problem/destination-city)
