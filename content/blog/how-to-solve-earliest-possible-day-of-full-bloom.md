---
title: "How to Solve Earliest Possible Day of Full Bloom — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Earliest Possible Day of Full Bloom. Hard difficulty, 71.2% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-03-24"
category: "dsa-patterns"
tags: ["earliest-possible-day-of-full-bloom", "array", "greedy", "sorting", "hard"]
---

# How to Solve Earliest Possible Day of Full Bloom

You have `n` flower seeds, each requiring `plantTime[i]` days to plant and `growTime[i]` days to grow after planting. You can only plant one seed at a time, but growth happens simultaneously once planting is complete. The goal is to find the earliest day when all flowers have bloomed. The tricky part is that planting order matters significantly—seeds with long growth times should be planted earlier, even if their planting time is long, because their growth can overlap with the planting of other seeds.

## Visual Walkthrough

Let's trace through a concrete example:  
`plantTime = [1, 4, 3]`, `growTime = [2, 3, 1]`

**Incorrect approach (plant in given order):**

1. Plant seed 0: day 0-1 (planting), day 1-3 (growing) → blooms day 3
2. Plant seed 1: day 1-5 (planting), day 5-8 (growing) → blooms day 8
3. Plant seed 2: day 5-8 (planting), day 8-9 (growing) → blooms day 9  
   All bloom by day 9.

**Better approach (sort by growth time):**
Sort seeds by decreasing growth time: seeds 1 (grow=3), 0 (grow=2), 2 (grow=1)

1. Plant seed 1: day 0-4 (planting), day 4-7 (growing) → blooms day 7
2. Plant seed 0: day 4-5 (planting), day 5-7 (growing) → blooms day 7
3. Plant seed 2: day 5-8 (planting), day 8-9 (growing) → blooms day 9  
   All bloom by day 9 (same as before—not optimal yet).

**Optimal approach (sort by decreasing growth time):**
Actually, let's calculate properly with the sorted order:

1. Plant seed 1 (grow=3): day 0-4 planting, finishes growing day 4+3=7
2. Plant seed 0 (grow=2): day 4-5 planting, finishes growing day 5+2=7
3. Plant seed 2 (grow=1): day 5-8 planting, finishes growing day 8+1=9

Earliest completion = max(7, 7, 9) = day 9.

Wait, let's try a different order: seeds 1 (grow=3), 2 (grow=1), 0 (grow=2)

1. Seed 1: day 0-4 planting → blooms day 7
2. Seed 2: day 4-7 planting → blooms day 8 (7+1)
3. Seed 0: day 7-8 planting → blooms day 10 (8+2)  
   Result: day 10 (worse).

The key insight: **Always plant seeds with longer growth times first**. Let's verify with the correct sorted order (by decreasing growTime):

Sorted indices: [1(grow=3), 0(grow=2), 2(grow=1)]

- Current day = 0
- Plant seed 1: finishes planting day 4, will bloom day 4+3=7
- Current day = 4
- Plant seed 0: finishes planting day 5, will bloom day 5+2=7
- Current day = 5
- Plant seed 2: finishes planting day 8, will bloom day 8+1=9

Earliest day = max(7, 7, 9) = 9.

## Brute Force Approach

A brute force solution would try all possible permutations of planting orders. For each permutation, we would simulate planting seeds sequentially, tracking the current day and calculating when each flower blooms. The answer is the minimum over all permutations of the maximum bloom day.

Why this fails:

- There are `n!` possible permutations
- For `n = 20`, that's 2.4×10¹⁸ permutations—completely infeasible
- Even for `n = 10`, we have 3.6 million permutations

The brute force approach is only useful for understanding the problem space, not for solving it within constraints (n up to 10⁵).

## Optimized Approach

The key insight is that **growth happens concurrently with planting of subsequent seeds**. Once a seed is planted, its growth timer starts, and it continues growing while we plant other seeds. Therefore, seeds with long growth times should be planted as early as possible so their growth overlaps with as much planting time as possible.

Think of it this way:  
Total time = (sum of all planting times) + (some growth time)  
But the growth time that matters is only for the last seed to finish growing. If we plant a seed with long growth time late, its growth extends the total time significantly.

Mathematical intuition:  
For seed `i` planted at position `j` in the sequence:  
Bloom day = (sum of planting times for seeds 0..j) + growTime[i]  
We want to minimize the maximum of these expressions over all seeds.

This is a classic scheduling problem solved by sorting seeds in **decreasing order of growTime**. Why? Because if we have two seeds A and B with growTime[A] > growTime[B], and we swap their planting order:

- If A comes before B: max(plantA + growA, plantA + plantB + growB)
- If B comes before A: max(plantB + growB, plantB + plantA + growA)

Since growA > growB, the first ordering gives a smaller maximum.

## Optimal Solution

We sort seeds by decreasing growTime, then simulate planting in that order. For each seed, we track the current day (cumulative planting time) and calculate when it would bloom. The answer is the maximum bloom day across all seeds.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def earliestFullBloom(plantTime, growTime):
    """
    Returns the earliest day when all flowers have bloomed.

    Strategy: Sort seeds by decreasing growth time. Seeds with longer
    growth times should be planted earlier so their growth overlaps
    with planting of other seeds.
    """
    # Create list of (growTime, plantTime) pairs for sorting
    seeds = list(zip(growTime, plantTime))

    # Sort by decreasing growth time (primary) - this is the key insight
    seeds.sort(reverse=True)

    current_day = 0  # Tracks cumulative planting days
    max_bloom_day = 0  # Tracks the latest bloom day among all seeds

    for grow, plant in seeds:
        # Plant the current seed starting from current_day
        # Bloom day = planting finish day + growth time
        bloom_day = current_day + plant + grow

        # Update the maximum bloom day we've seen
        max_bloom_day = max(max_bloom_day, bloom_day)

        # Move current day forward by this seed's planting time
        current_day += plant

    return max_bloom_day
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Returns the earliest day when all flowers have bloomed.
 *
 * Strategy: Sort seeds by decreasing growth time. Seeds with longer
 * growth times should be planted earlier so their growth overlaps
 * with planting of other seeds.
 */
function earliestFullBloom(plantTime, growTime) {
  // Create array of [growTime, plantTime] pairs for sorting
  const seeds = [];
  for (let i = 0; i < plantTime.length; i++) {
    seeds.push([growTime[i], plantTime[i]]);
  }

  // Sort by decreasing growth time (primary) - this is the key insight
  seeds.sort((a, b) => b[0] - a[0]);

  let currentDay = 0; // Tracks cumulative planting days
  let maxBloomDay = 0; // Tracks the latest bloom day among all seeds

  for (const [grow, plant] of seeds) {
    // Plant the current seed starting from currentDay
    // Bloom day = planting finish day + growth time
    const bloomDay = currentDay + plant + grow;

    // Update the maximum bloom day we've seen
    maxBloomDay = Math.max(maxBloomDay, bloomDay);

    // Move current day forward by this seed's planting time
    currentDay += plant;
  }

  return maxBloomDay;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Returns the earliest day when all flowers have bloomed.
     *
     * Strategy: Sort seeds by decreasing growth time. Seeds with longer
     * growth times should be planted earlier so their growth overlaps
     * with planting of other seeds.
     */
    public int earliestFullBloom(int[] plantTime, int[] growTime) {
        int n = plantTime.length;
        // Create array of Seed objects for sorting
        Seed[] seeds = new Seed[n];
        for (int i = 0; i < n; i++) {
            seeds[i] = new Seed(plantTime[i], growTime[i]);
        }

        // Sort by decreasing growth time (primary) - this is the key insight
        Arrays.sort(seeds, (a, b) -> b.growTime - a.growTime);

        int currentDay = 0;  // Tracks cumulative planting days
        int maxBloomDay = 0; // Tracks the latest bloom day among all seeds

        for (Seed seed : seeds) {
            // Plant the current seed starting from currentDay
            // Bloom day = planting finish day + growth time
            int bloomDay = currentDay + seed.plantTime + seed.growTime;

            // Update the maximum bloom day we've seen
            maxBloomDay = Math.max(maxBloomDay, bloomDay);

            // Move current day forward by this seed's planting time
            currentDay += seed.plantTime;
        }

        return maxBloomDay;
    }

    // Helper class to store seed information
    class Seed {
        int plantTime;
        int growTime;

        Seed(int plantTime, int growTime) {
            this.plantTime = plantTime;
            this.growTime = growTime;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Creating the pairs/objects: O(n)
- Sorting: O(n log n) — dominates the time complexity
- Single pass through sorted array: O(n)

**Space Complexity:** O(n)

- Storing the pairs/objects for sorting: O(n)
- Sorting in Python/Timsort uses O(n) space in worst case
- Java/JavaScript sorting typically uses O(log n) auxiliary space for the sort algorithm itself, but we still need O(n) for the seed data

## Common Mistakes

1. **Sorting by plantTime instead of growTime**: This is the most common error. Candidates might think to plant seeds with longer planting times first, but growth time is what matters because it can overlap with other planting.

2. **Forgetting that planting is sequential but growth is parallel**: Some candidates try to plant multiple seeds simultaneously or misunderstand that growth happens concurrently after planting.

3. **Incorrect bloom day calculation**: The formula is `current_day + plantTime[i] + growTime[i]`, not `current_day + growTime[i]`. The planting must finish before growth starts.

4. **Not using the maximum bloom day**: The answer isn't the last planting day plus something—it's the maximum of all individual bloom days. A seed planted early with long growth might bloom later than a seed planted later with short growth.

## When You'll See This Pattern

This problem uses a **greedy scheduling** pattern where you sort items by a specific criterion to minimize completion time. Similar problems include:

1. **Minimum Number of Days to Make m Bouquets (Medium)**: While not identical, it also involves scheduling bloom times and uses binary search on the answer space.

2. **Task Scheduler (Medium)**: Requires arranging tasks with cooldown periods to minimize total time—another scheduling optimization problem.

3. **Maximum Performance of a Team (Hard)**: Combines sorting with priority queues to optimize team selection based on speed and efficiency.

The core pattern: when you need to sequence items to optimize completion time and some activities can overlap, consider sorting by the "overlappable" component (here, growth time).

## Key Takeaways

1. **Overlap optimization**: When some processes can happen concurrently (growth while planting other seeds), schedule long concurrent processes first to maximize overlap.

2. **Greedy sorting proofs**: For scheduling problems, try proving greedy choices by considering what happens when you swap two items in the sequence. If swapping makes things worse, your ordering is optimal.

3. **Think about what's parallel vs sequential**: Clearly identify which operations must happen in sequence (planting) vs which can overlap (growth). This distinction guides the optimization strategy.

Related problems: [Minimum Number of Days to Make m Bouquets](/problem/minimum-number-of-days-to-make-m-bouquets)
