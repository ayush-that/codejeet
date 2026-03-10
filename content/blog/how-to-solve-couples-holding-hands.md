---
title: "How to Solve Couples Holding Hands — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Couples Holding Hands. Hard difficulty, 59.2% acceptance rate. Topics: Greedy, Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-10-30"
category: "dsa-patterns"
tags: ["couples-holding-hands", "greedy", "depth-first-search", "breadth-first-search", "hard"]
---

# How to Solve Couples Holding Hands

This problem asks us to find the minimum number of swaps needed so that all couples can sit together. We have `n` couples (2n people) sitting in a row, and we need to rearrange adjacent seats through swaps so that each person sits next to their partner. What makes this problem tricky is that it looks like a sorting problem at first glance, but the optimal solution requires recognizing it as a graph connectivity problem.

## Visual Walkthrough

Let's trace through a concrete example: `row = [3, 1, 4, 0, 2, 5]`

**Step 1: Understanding the couples**

- Couple 0: (0, 1)
- Couple 1: (2, 3)
- Couple 2: (4, 5)

**Step 2: Initial seating arrangement**
Seats: [0] [1] [2] [3] [4] [5]
People: 3 1 4 0 2 5

**Step 3: Identify where couples should be**
Each couple should occupy seats (0,1), (2,3), or (4,5) - adjacent pairs.

**Step 4: Check current pairings**

- Seats 0-1: Person 3 (couple 1) with person 1 (couple 0) ❌ not a couple
- Seats 2-3: Person 4 (couple 2) with person 0 (couple 0) ❌ not a couple
- Seats 4-5: Person 2 (couple 1) with person 5 (couple 2) ❌ not a couple

**Step 5: The graph insight**
Let's track which couples are connected through the seating arrangement:

- Seat 0 has person 3 (couple 1), seat 1 has person 1 (couple 0) → couples 1 and 0 are connected
- Seat 2 has person 4 (couple 2), seat 3 has person 0 (couple 0) → couples 2 and 0 are connected
- Seat 4 has person 2 (couple 1), seat 5 has person 5 (couple 2) → couples 1 and 2 are connected

We have a cycle: couple 0 ↔ couple 1 ↔ couple 2 ↔ couple 0

**Step 6: Why swaps = components - 1**
For a connected component of k couples, we need k-1 swaps to arrange them properly. Our single component of 3 couples needs 2 swaps.

**Step 7: Verify with actual swaps**

1. Swap person at seat 1 with person at seat 4: [3, 4, 1, 0, 2, 5]
2. Swap person at seat 2 with person at seat 4: [3, 4, 2, 0, 1, 5]
   Now: (3,2), (4,0), (1,5) are all couples sitting together.

## Brute Force Approach

A naive approach would try all possible sequences of swaps using BFS, treating each arrangement as a state. With 2n seats, there are (2n)! possible arrangements, but we only care about adjacent swaps. Even with BFS pruning, this becomes intractable quickly.

The state space grows exponentially: for n=3 (6 people), there are 720 possible arrangements. For n=30 (60 people), the state space is astronomically large. This approach would have time complexity of O((2n)!) in the worst case, which is completely impractical.

## Optimized Approach

The key insight is to recognize this as a graph problem where:

- Each couple is a node
- Each seat pair (0-1, 2-3, 4-5, etc.) creates an edge between the couples sitting in that pair

**Why this works:**

1. If two people from different couples sit together, their couples are "connected" in the seating arrangement
2. Each connected component of k couples forms a cycle in the seating arrangement
3. To fix a component of k couples, we need exactly k-1 swaps
4. Therefore, total swaps = sum over all components of (size_of_component - 1)

**Step-by-step reasoning:**

1. Create a mapping from person ID to their couple ID (person // 2)
2. For each seat pair (i, i+1 where i is even):
   - Get the couple IDs of the two people sitting together
   - If they're different, add an edge between these couples in our graph
3. Find connected components in this graph
4. For each component of size k, add k-1 to our total swaps

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minSwapsCouples(row):
    """
    Minimum swaps to make all couples sit together.

    Approach: Treat couples as nodes in a graph. Each seat pair (i,i+1)
    creates an edge between the couples of the people sitting there.
    Each connected component of size k requires k-1 swaps.
    """
    n = len(row)

    # Step 1: Create a mapping from person to their seat position
    # This allows us to quickly find where any person is sitting
    position = [0] * n
    for i, person in enumerate(row):
        position[person] = i

    swaps = 0

    # Step 2: Process each couple pair (seats 0-1, 2-3, 4-5, etc.)
    for i in range(0, n, 2):
        # Get the person currently sitting at seat i
        person1 = row[i]

        # Determine who their partner should be
        # If person is even, partner is person+1; if odd, partner is person-1
        partner = person1 + 1 if person1 % 2 == 0 else person1 - 1

        # Check if partner is already sitting in the adjacent seat (i+1)
        if row[i + 1] != partner:
            # Partner is not in the correct seat, need to swap

            # Find where the partner is currently sitting
            partner_pos = position[partner]

            # Swap the partner with the person currently at seat i+1
            # Update the row array
            row[i + 1], row[partner_pos] = row[partner_pos], row[i + 1]

            # Update the position mapping for both swapped people
            position[row[partner_pos]] = partner_pos
            position[partner] = i + 1

            swaps += 1

    return swaps
```

```javascript
// Time: O(n) | Space: O(n)
function minSwapsCouples(row) {
  /**
   * Minimum swaps to make all couples sit together.
   *
   * Approach: Greedy swapping. For each seat pair, if the couple
   * is not together, find the partner and swap them into place.
   * Each swap fixes at least one couple.
   */
  const n = row.length;

  // Step 1: Create a mapping from person to their seat position
  const position = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    position[row[i]] = i;
  }

  let swaps = 0;

  // Step 2: Process each couple pair (seats 0-1, 2-3, 4-5, etc.)
  for (let i = 0; i < n; i += 2) {
    // Get the person currently sitting at seat i
    const person1 = row[i];

    // Determine who their partner should be
    // If person is even, partner is person+1; if odd, partner is person-1
    const partner = person1 % 2 === 0 ? person1 + 1 : person1 - 1;

    // Check if partner is already sitting in the adjacent seat (i+1)
    if (row[i + 1] !== partner) {
      // Partner is not in the correct seat, need to swap

      // Find where the partner is currently sitting
      const partnerPos = position[partner];

      // Swap the partner with the person currently at seat i+1
      // Update the row array
      [row[i + 1], row[partnerPos]] = [row[partnerPos], row[i + 1]];

      // Update the position mapping for both swapped people
      position[row[partnerPos]] = partnerPos;
      position[partner] = i + 1;

      swaps++;
    }
  }

  return swaps;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minSwapsCouples(int[] row) {
        /**
         * Minimum swaps to make all couples sit together.
         *
         * Approach: Greedy swapping with position tracking.
         * For each seat pair, if the couple is not together,
         * find the partner and swap them into place immediately.
         */
        int n = row.length;

        // Step 1: Create a mapping from person to their seat position
        int[] position = new int[n];
        for (int i = 0; i < n; i++) {
            position[row[i]] = i;
        }

        int swaps = 0;

        // Step 2: Process each couple pair (seats 0-1, 2-3, 4-5, etc.)
        for (int i = 0; i < n; i += 2) {
            // Get the person currently sitting at seat i
            int person1 = row[i];

            // Determine who their partner should be
            // If person is even, partner is person+1; if odd, partner is person-1
            int partner = (person1 % 2 == 0) ? person1 + 1 : person1 - 1;

            // Check if partner is already sitting in the adjacent seat (i+1)
            if (row[i + 1] != partner) {
                // Partner is not in the correct seat, need to swap

                // Find where the partner is currently sitting
                int partnerPos = position[partner];

                // Swap the partner with the person currently at seat i+1
                // Update the row array
                int temp = row[i + 1];
                row[i + 1] = row[partnerPos];
                row[partnerPos] = temp;

                // Update the position mapping for both swapped people
                position[row[partnerPos]] = partnerPos;
                position[partner] = i + 1;

                swaps++;
            }
        }

        return swaps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the row once to build the position mapping: O(n)
- We iterate through the row again with step size 2: O(n)
- Each swap operation is O(1)
- Total: O(n) where n is the number of seats (2 \* number of couples)

**Space Complexity: O(n)**

- We store a position array of size n: O(n)
- The input array is modified in place
- No recursion or additional data structures needed

## Common Mistakes

1. **Forgetting to update the position mapping after swaps**: This is crucial! If you don't update `position[partner]` and `position[row[partnerPos]]`, future lookups will use stale positions, causing incorrect swaps or infinite loops.

2. **Incorrect partner calculation**: The partner of person `p` is `p ^ 1` (XOR with 1), which works because couples are (0,1), (2,3), etc. Some candidates mistakenly use `p + 1` for all cases, which fails for odd-numbered people.

3. **Using DFS/Union-Find unnecessarily**: While the graph approach is valid, the greedy swapping solution is simpler and more efficient. Some candidates overcomplicate by building the full graph when direct swapping works.

4. **Not handling the position update correctly during swaps**: When swapping `row[i+1]` with `row[partnerPos]`, you must update positions for BOTH people swapped, not just the partner.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Greedy with position tracking**: Similar to problems where you need to arrange elements in a specific order with minimal swaps. The key insight is that making locally optimal choices (fixing one couple at a time) leads to a globally optimal solution.

2. **Graph connectivity for arrangement problems**: Problems like "K-Similar Strings" (Hard) use similar reasoning - treating permutations as graph states and finding the shortest path to the target arrangement.

3. **Minimum swaps to arrange elements**: Problems like "Minimum Swaps to Arrange Pairs" or "Minimum Swaps to Make Sequences Increasing" use similar position tracking and greedy swapping techniques.

**Related problems:**

- **First Missing Positive**: Also uses index manipulation and position tracking to arrange numbers in their correct positions.
- **Missing Number**: Involves understanding number relationships and positions.
- **K-Similar Strings**: Requires finding minimum swaps between characters to reach a target arrangement, using BFS over permutation space.

## Key Takeaways

1. **Greedy can be optimal for pairing problems**: When each swap fixes at least one couple permanently, a greedy approach works. This is a classic "fix what you can now" strategy.

2. **Position tracking enables O(1) lookups**: Maintaining a separate array that maps values to their current positions is a powerful technique for swap-based rearrangement problems.

3. **Recognize when local fixes lead to global optimum**: In this problem, fixing one couple doesn't break previously fixed couples, which is why greedy works. This isn't always true for swap problems, so check carefully.

4. **The XOR trick for couples**: Remember that for consecutive pairs (0,1), (2,3), etc., the partner is always `p ^ 1`. This is cleaner than using conditional logic.

Related problems: [First Missing Positive](/problem/first-missing-positive), [Missing Number](/problem/missing-number), [K-Similar Strings](/problem/k-similar-strings)
