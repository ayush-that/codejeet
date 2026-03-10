---
title: "How to Solve Maximum Capacity Within Budget — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Capacity Within Budget. Medium difficulty, 19.9% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2029-12-20"
category: "dsa-patterns"
tags: ["maximum-capacity-within-budget", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Maximum Capacity Within Budget

You need to select at most two machines with total cost ≤ budget to maximize total capacity. The twist is you can choose the same machine twice if it's the best option, but they must be "distinct" — meaning you can't pick the same index twice. This problem is interesting because it combines budget constraints with capacity optimization, requiring careful consideration of single-machine purchases versus two-machine combinations.

## Visual Walkthrough

Let's walk through an example:

- `costs = [3, 5, 2, 8, 4]`
- `capacity = [7, 9, 5, 12, 6]`
- `budget = 10`

**Step 1: Consider single machines**
We check each machine individually if its cost ≤ budget:

- Machine 0: cost=3 ≤ 10 → capacity=7
- Machine 1: cost=5 ≤ 10 → capacity=9
- Machine 2: cost=2 ≤ 10 → capacity=5
- Machine 3: cost=8 ≤ 10 → capacity=12
- Machine 4: cost=4 ≤ 10 → capacity=6

Best single machine: Machine 3 with capacity 12.

**Step 2: Consider two-machine combinations**
We need pairs (i, j) where i ≠ j and cost[i] + cost[j] ≤ 10:

- (0,1): 3+5=8 ≤ 10 → capacity=7+9=16
- (0,2): 3+2=5 ≤ 10 → capacity=7+5=12
- (0,3): 3+8=11 > 10 ❌
- (0,4): 3+4=7 ≤ 10 → capacity=7+6=13
- (1,2): 5+2=7 ≤ 10 → capacity=9+5=14
- (1,3): 5+8=13 > 10 ❌
- (1,4): 5+4=9 ≤ 10 → capacity=9+6=15
- (2,3): 2+8=10 ≤ 10 → capacity=5+12=17
- (2,4): 2+4=6 ≤ 10 → capacity=5+6=11
- (3,4): 8+4=12 > 10 ❌

Best pair: (2,3) with capacity 17.

**Step 3: Compare results**
Single machine best: 12
Two-machine best: 17
Answer: 17

The challenge is finding the best pair efficiently without checking all O(n²) combinations.

## Brute Force Approach

The brute force solution checks all possible combinations:

1. Check each machine individually if affordable
2. Check all pairs (i, j) where i ≠ j if total cost ≤ budget
3. Track maximum capacity found

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maximumCapacityWithinBudget(costs, capacity, budget):
    n = len(costs)
    max_cap = 0

    # Check single machines
    for i in range(n):
        if costs[i] <= budget:
            max_cap = max(max_cap, capacity[i])

    # Check all pairs
    for i in range(n):
        for j in range(i + 1, n):
            if costs[i] + costs[j] <= budget:
                max_cap = max(max_cap, capacity[i] + capacity[j])

    return max_cap
```

```javascript
// Time: O(n²) | Space: O(1)
function maximumCapacityWithinBudget(costs, capacity, budget) {
  const n = costs.length;
  let maxCap = 0;

  // Check single machines
  for (let i = 0; i < n; i++) {
    if (costs[i] <= budget) {
      maxCap = Math.max(maxCap, capacity[i]);
    }
  }

  // Check all pairs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (costs[i] + costs[j] <= budget) {
        maxCap = Math.max(maxCap, capacity[i] + capacity[j]);
      }
    }
  }

  return maxCap;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maximumCapacityWithinBudget(int[] costs, int[] capacity, int budget) {
    int n = costs.length;
    int maxCap = 0;

    // Check single machines
    for (int i = 0; i < n; i++) {
        if (costs[i] <= budget) {
            maxCap = Math.max(maxCap, capacity[i]);
        }
    }

    // Check all pairs
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (costs[i] + costs[j] <= budget) {
                maxCap = Math.max(maxCap, capacity[i] + capacity[j]);
            }
        }
    }

    return maxCap;
}
```

</div>

**Why this is insufficient:** With n up to 10⁵, O(n²) is far too slow (10¹⁰ operations). We need O(n log n) or better.

## Optimized Approach

The key insight: We need to find for each machine i, the best affordable partner j (i ≠ j) where cost[i] + cost[j] ≤ budget. This is similar to the "Two Sum" problem but with capacity maximization.

**Step-by-step reasoning:**

1. **Sort machines by cost** to enable binary search or two-pointer techniques
2. **Track best capacity for each cost prefix** — for any cost C, we want to know the maximum capacity among all machines with cost ≤ C
3. **For each machine i**, find the maximum affordable partner:
   - Maximum affordable cost for partner = budget - cost[i]
   - Use binary search to find all machines with cost ≤ this limit
   - But we can't use machine i itself, so we need careful handling
4. **Alternative approach**: Sort and use two pointers:
   - Sort machines by cost
   - Use left pointer at cheapest, right pointer at most expensive affordable with left
   - As we move left pointer right, adjust right pointer to maintain cost constraint
   - Track maximum capacity sum

The two-pointer approach is cleaner: For each left machine, find the best right machine where total cost ≤ budget. Since we want maximum capacity, we should track the maximum capacity seen so far for any cost.

**Optimal strategy:**

1. Create list of (cost, capacity) pairs and sort by cost
2. Build prefix maximum capacity array — maxCap[i] = maximum capacity among first i+1 machines
3. For each machine j (starting from most expensive affordable), find the best partner i (i < j) using binary search
4. Also check single machines

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maximumCapacityWithinBudget(costs, capacity, budget):
    n = len(costs)

    # Step 1: Create list of (cost, capacity) pairs
    machines = [(costs[i], capacity[i]) for i in range(n)]

    # Step 2: Sort by cost (primary) and capacity (secondary for stability)
    machines.sort(key=lambda x: (x[0], x[1]))

    # Step 3: Build prefix maximum capacity array
    # prefix_max[i] = maximum capacity among machines[0..i]
    prefix_max = [0] * n
    prefix_max[0] = machines[0][1]
    for i in range(1, n):
        prefix_max[i] = max(prefix_max[i-1], machines[i][1])

    # Step 4: Initialize answer with best single machine
    max_capacity = 0
    for cost, cap in machines:
        if cost <= budget:
            max_capacity = max(max_capacity, cap)

    # Step 5: For each machine as the "second" (more expensive) machine,
    # find the best affordable partner using binary search
    for j in range(1, n):  # Start from 1 since we need a partner
        cost_j, cap_j = machines[j]

        # Maximum affordable cost for partner
        max_partner_cost = budget - cost_j

        # If we can't afford even the cheapest machine with this one, skip
        if max_partner_cost < machines[0][0]:
            continue

        # Binary search to find the rightmost machine with cost <= max_partner_cost
        left, right = 0, j - 1  # Partner must be before j (different machine)
        best_i = -1

        while left <= right:
            mid = (left + right) // 2
            if machines[mid][0] <= max_partner_cost:
                best_i = mid
                left = mid + 1  # Try to find a more expensive but still affordable partner
            else:
                right = mid - 1

        # If we found a valid partner
        if best_i != -1:
            # Use prefix_max[best_i] to get the best capacity among affordable partners
            total_capacity = prefix_max[best_i] + cap_j
            max_capacity = max(max_capacity, total_capacity)

    return max_capacity
```

```javascript
// Time: O(n log n) | Space: O(n)
function maximumCapacityWithinBudget(costs, capacity, budget) {
  const n = costs.length;

  // Step 1: Create array of [cost, capacity] pairs
  const machines = [];
  for (let i = 0; i < n; i++) {
    machines.push([costs[i], capacity[i]]);
  }

  // Step 2: Sort by cost (primary) and capacity (secondary)
  machines.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  // Step 3: Build prefix maximum capacity array
  const prefixMax = new Array(n);
  prefixMax[0] = machines[0][1];
  for (let i = 1; i < n; i++) {
    prefixMax[i] = Math.max(prefixMax[i - 1], machines[i][1]);
  }

  // Step 4: Initialize with best single machine
  let maxCapacity = 0;
  for (const [cost, cap] of machines) {
    if (cost <= budget) {
      maxCapacity = Math.max(maxCapacity, cap);
    }
  }

  // Step 5: For each machine as the second (more expensive) one,
  // find best affordable partner using binary search
  for (let j = 1; j < n; j++) {
    const costJ = machines[j][0];
    const capJ = machines[j][1];

    // Maximum affordable cost for partner
    const maxPartnerCost = budget - costJ;

    // If we can't afford even the cheapest machine with this one, skip
    if (maxPartnerCost < machines[0][0]) {
      continue;
    }

    // Binary search for rightmost machine with cost <= maxPartnerCost
    let left = 0,
      right = j - 1;
    let bestI = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (machines[mid][0] <= maxPartnerCost) {
        bestI = mid;
        left = mid + 1; // Try to find more expensive but still affordable
      } else {
        right = mid - 1;
      }
    }

    // If found valid partner
    if (bestI !== -1) {
      const totalCapacity = prefixMax[bestI] + capJ;
      maxCapacity = Math.max(maxCapacity, totalCapacity);
    }
  }

  return maxCapacity;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

public int maximumCapacityWithinBudget(int[] costs, int[] capacity, int budget) {
    int n = costs.length;

    // Step 1: Create array of Machine objects
    Machine[] machines = new Machine[n];
    for (int i = 0; i < n; i++) {
        machines[i] = new Machine(costs[i], capacity[i]);
    }

    // Step 2: Sort by cost (primary) and capacity (secondary)
    Arrays.sort(machines, (a, b) -> {
        if (a.cost != b.cost) return Integer.compare(a.cost, b.cost);
        return Integer.compare(a.capacity, b.capacity);
    });

    // Step 3: Build prefix maximum capacity array
    int[] prefixMax = new int[n];
    prefixMax[0] = machines[0].capacity;
    for (int i = 1; i < n; i++) {
        prefixMax[i] = Math.max(prefixMax[i-1], machines[i].capacity);
    }

    // Step 4: Initialize with best single machine
    int maxCapacity = 0;
    for (Machine machine : machines) {
        if (machine.cost <= budget) {
            maxCapacity = Math.max(maxCapacity, machine.capacity);
        }
    }

    // Step 5: For each machine as the second one, find best partner
    for (int j = 1; j < n; j++) {
        int costJ = machines[j].cost;
        int capJ = machines[j].capacity;

        // Maximum affordable cost for partner
        int maxPartnerCost = budget - costJ;

        // If can't afford even cheapest machine with this one, skip
        if (maxPartnerCost < machines[0].cost) {
            continue;
        }

        // Binary search for rightmost machine with cost <= maxPartnerCost
        int left = 0, right = j - 1;
        int bestI = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (machines[mid].cost <= maxPartnerCost) {
                bestI = mid;
                left = mid + 1;  // Try to find more expensive but still affordable
            } else {
                right = mid - 1;
            }
        }

        // If found valid partner
        if (bestI != -1) {
            int totalCapacity = prefixMax[bestI] + capJ;
            maxCapacity = Math.max(maxCapacity, totalCapacity);
        }
    }

    return maxCapacity;
}

class Machine {
    int cost;
    int capacity;

    Machine(int cost, int capacity) {
        this.cost = cost;
        this.capacity = capacity;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the machines: O(n log n)
- Building prefix maximum array: O(n)
- Binary search for each machine: O(log n) per machine, O(n log n) total
- Checking single machines: O(n)
- Dominated by O(n log n) from sorting and binary searches

**Space Complexity: O(n)**

- Storing the machines array: O(n)
- Prefix maximum array: O(n)
- Sorting in Python/JavaScript uses O(n) additional space (Timsort)
- In Java, Arrays.sort() uses O(log n) stack space for primitive types, but we're sorting objects

## Common Mistakes

1. **Forgetting to check single machines**: Some candidates only look for pairs, but the problem says "at most two" machines, which includes buying just one. Always initialize your answer with the best single machine.

2. **Using the same machine twice**: The problem says "distinct" machines, meaning different indices. When using binary search, ensure i < j or i ≠ j. In our solution, we search only indices 0 to j-1 for partner of machine j.

3. **Not handling the prefix maximum correctly**: When we find the rightmost affordable machine at index `best_i`, we need the maximum capacity among ALL machines from 0 to `best_i`, not just the capacity at `best_i`. That's why we use `prefix_max[best_i]`.

4. **Missing the case where two cheap machines beat one expensive one**: Even if a single expensive machine has high capacity, two moderately priced machines might have higher combined capacity. Our solution checks all possibilities.

## When You'll See This Pattern

This "budget-constrained optimization with at most two items" pattern appears in several LeetCode problems:

1. **Two Sum Less Than K (LeetCode 1099)**: Find two numbers with sum less than K maximizing the sum. Same binary search/two-pointer approach after sorting.

2. **Boats to Save People (LeetCode 881)**: Similar constraint of pairing people with weight limit, though here we minimize pairs rather than maximize value.

3. **Maximum Units on a Truck (LeetCode 1710)**: Budget-constrained optimization but with multiple items allowed. Uses greedy approach instead.

The core technique is: **Sort + Binary Search/Two Pointers + Prefix Optimization**. When you need to find pairs satisfying a constraint and optimizing a value, consider sorting first to enable efficient searching.

## Key Takeaways

1. **When dealing with pair selection under constraints, sorting is your friend**: It enables binary search and two-pointer techniques that reduce O(n²) to O(n log n).

2. **Prefix maximum arrays help find "best so far"**: When searching for partners, you often want the best partner up to a certain point, not just any partner. Prefix arrays let you answer this in O(1).

3. **Always consider all cases in "at most K" problems**: For "at most 2", check both single items and pairs. Initialize your answer properly.

[Practice this problem on CodeJeet](/problem/maximum-capacity-within-budget)
