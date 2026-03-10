---
title: "How to Solve Two City Scheduling — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Two City Scheduling. Medium difficulty, 68.4% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-02-13"
category: "dsa-patterns"
tags: ["two-city-scheduling", "array", "greedy", "sorting", "medium"]
---

# How to Solve Two City Scheduling

You need to schedule `2n` people between two cities, where each person has different costs for each city. The challenge is to minimize total cost while sending exactly `n` people to each city. What makes this interesting is that you can't just send everyone to their cheaper city — you must balance the counts, requiring strategic trade-offs between individual savings and overall distribution.

## Visual Walkthrough

Let's trace through a concrete example:  
`costs = [[10, 20], [30, 200], [400, 50], [30, 20]]` (so `n = 2` people per city)

**Step 1: Understanding the trade-off**  
For person 0: City A costs $10, City B costs $20. Sending them to A saves $10 compared to B.  
For person 1: City A costs $30, City B costs $200. Sending them to A saves $170.  
For person 2: City A costs $400, City B costs $50. Sending them to B saves $350.  
For person 3: City A costs $30, City B costs $20. Sending them to B saves $10.

**Step 2: The greedy insight**  
If we calculate `costA - costB` for each person:

- Person 0: 10 - 20 = -10 (negative means B is more expensive, so A is better)
- Person 1: 30 - 200 = -170 (strong preference for A)
- Person 2: 400 - 50 = 350 (strong preference for B)
- Person 3: 30 - 20 = 10 (slight preference for B)

Sorting by this difference: [-170, -10, 10, 350]

**Step 3: Making the assignment**  
The first `n` (2) people in sorted order have the strongest preference for City A:

- Person 1 (difference -170): Send to A (cost $30)
- Person 0 (difference -10): Send to A (cost $10)

The last `n` people have the strongest preference for City B:

- Person 3 (difference 10): Send to B (cost $20)
- Person 2 (difference 350): Send to B (cost $50)

**Step 4: Calculate total**  
Total = 30 + 10 + 20 + 50 = $110

This is optimal because we're prioritizing the people with the strongest preferences for each city, ensuring we don't waste the "big savings" opportunities.

## Brute Force Approach

A naive approach would try all possible assignments of `n` people to City A (with the rest going to City B). For `2n` people, we need to choose `n` for City A, which gives `C(2n, n)` combinations. For each combination, we sum the City A costs for chosen people and City B costs for the rest.

The number of combinations grows factorially: for `n=15` (30 people), that's over 155 million combinations. This is clearly infeasible.

Even if a candidate considers sending each person to their cheaper city first, they'll quickly realize this might not yield exactly `n` people per city. Adjusting from there requires checking multiple swaps, which also becomes combinatorially complex.

## Optimized Approach

The key insight is to think in terms of **opportunity cost**: What do we lose by sending someone to their non-preferred city?

For each person, calculate `costA - costB`:

- Negative difference: City A is cheaper (the more negative, the stronger the preference for A)
- Positive difference: City B is cheaper (the more positive, the stronger the preference for B)

If we sort people by this difference, the first half (most negative) have the strongest economic case for City A, while the last half (most positive) have the strongest case for City B.

Why does this work? Consider two people with differences `-100` and `+5`. If we need to send one to each city, sending the `-100` person to B costs us $100 more than sending them to A, while sending the `+5` person to A only costs $5 more than sending them to B. Clearly, we should send the `-100` person to A and the `+5` person to B.

The sorting approach systematically applies this logic to all people, ensuring we capture the biggest savings opportunities first.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def twoCitySchedCost(costs):
    """
    Calculate minimum cost to send exactly n people to each city.

    Strategy:
    1. Sort by the difference (costA - costB)
    2. First n people in sorted order go to City A
    3. Last n people go to City B
    """
    # Sort by the savings from choosing City A over City B
    # Negative values mean City A is cheaper, positive means City B is cheaper
    costs.sort(key=lambda x: x[0] - x[1])

    n = len(costs) // 2
    total_cost = 0

    # First n people have strongest preference for City A
    for i in range(n):
        total_cost += costs[i][0]  # Send to City A

    # Last n people have strongest preference for City B
    for i in range(n, 2 * n):
        total_cost += costs[i][1]  # Send to City B

    return total_cost
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function twoCitySchedCost(costs) {
  /**
   * Calculate minimum cost to send exactly n people to each city.
   *
   * Strategy:
   * 1. Sort by the difference (costA - costB)
   * 2. First n people in sorted order go to City A
   * 3. Last n people go to City B
   */

  // Sort by the savings from choosing City A over City B
  // Negative values mean City A is cheaper, positive means City B is cheaper
  costs.sort((a, b) => a[0] - a[1] - (b[0] - b[1]));

  const n = costs.length / 2;
  let totalCost = 0;

  // First n people have strongest preference for City A
  for (let i = 0; i < n; i++) {
    totalCost += costs[i][0]; // Send to City A
  }

  // Last n people have strongest preference for City B
  for (let i = n; i < 2 * n; i++) {
    totalCost += costs[i][1]; // Send to City B
  }

  return totalCost;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;
import java.util.Comparator;

class Solution {
    public int twoCitySchedCost(int[][] costs) {
        /**
         * Calculate minimum cost to send exactly n people to each city.
         *
         * Strategy:
         * 1. Sort by the difference (costA - costB)
         * 2. First n people in sorted order go to City A
         * 3. Last n people go to City B
         */

        // Sort by the savings from choosing City A over City B
        // Negative values mean City A is cheaper, positive means City B is cheaper
        Arrays.sort(costs, new Comparator<int[]>() {
            @Override
            public int compare(int[] a, int[] b) {
                return (a[0] - a[1]) - (b[0] - b[1]);
            }
        });

        int n = costs.length / 2;
        int totalCost = 0;

        // First n people have strongest preference for City A
        for (int i = 0; i < n; i++) {
            totalCost += costs[i][0];  // Send to City A
        }

        // Last n people have strongest preference for City B
        for (int i = n; i < 2 * n; i++) {
            totalCost += costs[i][1];  // Send to City B
        }

        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)  
The dominant operation is sorting the array of `2n` elements. Sorting takes O(n log n) time in typical implementations. The subsequent linear pass through the array takes O(n) time, which is dominated by the sorting step.

**Space Complexity:** O(1) or O(n) depending on language and sorting implementation

- Python's `sort()` uses Timsort which requires O(n) space in the worst case
- JavaScript's `sort()` typically uses O(log n) to O(n) space depending on implementation
- Java's `Arrays.sort()` uses O(log n) to O(n) space  
  If we consider only auxiliary space (excluding input storage), some implementations can achieve O(1) space with in-place sorting, but language libraries may use additional space.

## Common Mistakes

1. **Forgetting to divide by 2 when calculating `n`**: The input has `2n` people, so `n = len(costs) // 2`. Using `len(costs)` directly will send too many people to City A.

2. **Sorting by absolute difference instead of signed difference**: Sorting by `abs(costA - costB)` loses the direction information (which city is cheaper). You need the signed difference to know whether to send someone to A or B.

3. **Incorrect loop boundaries**: When iterating for City B assignments, start from `i = n` (not `n-1`) and go to `2n-1`. Off-by-one errors here will either miss a person or double-count.

4. **Assuming equal distribution isn't required**: Some candidates try to send everyone to their cheaper city first, then adjust. This leads to complex swapping logic and often suboptimal results. Always remember the constraint: exactly `n` people per city.

## When You'll See This Pattern

This "sort by difference/ratio" pattern appears in optimization problems where you need to make binary choices under constraints:

1. **Maximum Performance of a Team** (LeetCode 1383): Sort engineers by efficiency, then use a min-heap to maintain the fastest `k` speeds. Similar trade-off between two metrics.

2. **Minimum Cost to Hire K Workers** (LeetCode 857): Sort by wage/quality ratio, then maintain a sliding window with a max-heap of qualities.

3. **Task Scheduler** (LeetCode 621): Sort tasks by frequency, then schedule highest frequency tasks first to minimize idle time.

The common theme is sorting by a derived metric that captures the trade-off between competing objectives, then applying a greedy selection strategy.

## Key Takeaways

- **When facing binary choices with quotas**, consider calculating a "preference score" (like `costA - costB`) that quantifies the trade-off for each item.
- **Sorting by this score** often reveals the optimal greedy assignment: items with extreme scores in one direction should get that choice.
- **Always verify constraints** after greedy assignment — in this case, we get exactly `n` people per city automatically because we take first `n` and last `n`.

This problem teaches that not all greedy problems are about picking the absolute best each time; sometimes you need to sort by a clever metric first to see the global optimum.

Related problems: [Rearrange Array to Maximize Prefix Score](/problem/rearrange-array-to-maximize-prefix-score)
