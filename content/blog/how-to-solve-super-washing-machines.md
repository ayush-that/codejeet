---
title: "How to Solve Super Washing Machines — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Super Washing Machines. Hard difficulty, 43.9% acceptance rate. Topics: Array, Greedy."
date: "2028-12-06"
category: "dsa-patterns"
tags: ["super-washing-machines", "array", "greedy", "hard"]
---

# How to Solve Super Washing Machines

You have `n` washing machines in a line, each with some number of dresses. In one move, you can select any `m` machines and simultaneously move one dress from each selected machine to an adjacent machine (left or right). Your goal is to find the **minimum number of moves** required to make all machines have an equal number of dresses. If it's impossible, return -1 (though with integer dresses, it's always possible if total dresses is divisible by `n`).

What makes this problem tricky is that moves happen **simultaneously** — multiple machines can send/receive dresses in a single move. This isn't a simple sequential redistribution problem. The optimal solution requires understanding the **net flow** of dresses through each position.

## Visual Walkthrough

Let's trace through example `[1, 0, 5]` with 3 machines and 6 total dresses. Each machine should end with `6/3 = 2` dresses.

**Position 0 (target: 2, current: 1)**: Needs +1 dress from the right
**Position 1 (target: 2, current: 0)**: Needs +2 dresses
**Position 2 (target: 2, current: 5)**: Needs -3 dresses (has excess)

Now think about the flow:

- Machine 2 has 3 extra dresses to send left
- Machine 1 needs 2 dresses, machine 0 needs 1 dress

The key insight: At position 1 (between machines 0 and 1), dresses must flow through. Let's calculate the **cumulative imbalance** from left to right:

**Left of position 0**: 0 dresses (nothing to the left)
**Between 0 and 1**: Machine 0 has -1 imbalance (needs 1). Cumulative = -1
**Between 1 and 2**: Machine 0 (-1) + machine 1 (-2) = -3 cumulative
**Right of position 2**: All machines balanced = 0

The maximum absolute cumulative imbalance is 3, which happens between positions 1 and 2. This tells us that at some point, 3 dresses must pass through that boundary. Since each machine can only pass one dress per move, we need at least 3 moves.

Let's verify: Move 1: Machine 2 → 1 (2→1), Machine 2 → 1 (2→1), Machine 2 → 1 (2→1) = [1, 3, 2]
Move 2: Machine 1 → 0 (1→0) = [2, 2, 2]

Wait — that's only 2 moves! But our calculation said 3. Why? Because in move 1, machine 2 sent **3 dresses simultaneously** to machine 1, which is allowed since we can select multiple machines. However, machine 1 can only receive one dress per move from each adjacent machine. Actually, re-reading: "pass one dress of each washing machine to one of its adjacent machines" — each selected machine gives out one dress. So machine 2 could give 1 dress to left in one move. To give 3 dresses left, it needs 3 moves.

Correct sequence:
Move 1: Machine 2 → left = [1, 1, 4]
Move 2: Machine 2 → left = [1, 2, 3]  
Move 3: Machine 2 → left = [1, 3, 2]
Move 4: Machine 1 → left = [2, 2, 2]

That's 4 moves! Let's recalculate properly...

Actually, the optimal is 3 moves. Let me show the actual optimal:
Move 1: Select machine 2 → left AND machine 1 → left simultaneously: [2, 0, 4]? No, machine 1 has 0, can't give.

The correct insight: The answer is `max(max(deficit_at_i), max(abs(cumulative_imbalance)))` where:

- `deficit_at_i` = dresses needed at machine i (positive if needs, negative if excess)
- `cumulative_imbalance` = running total of deficits

For [1, 0, 5]:
Deficits: [-1, -2, +3] (wait, needs are positive, excess negative)
Actually: target=2, so deficits = [1-2=-1, 0-2=-2, 5-2=+3]
Cumulative: -1, -3, 0
Max deficit = max(1, 2, 3) = 3 (absolute values)
Max abs cumulative = max(1, 3, 0) = 3
Answer = max(3, 3) = 3 moves ✓

## Brute Force Approach

A brute force approach would simulate all possible moves. At each step, we could:

1. Check if all machines are equal
2. For each possible selection of m machines (2^n subsets)
3. For each selected machine, choose left or right direction
4. Apply the moves simultaneously
5. Recursively try all possibilities

This is exponential and impractical. Even a BFS approach would have state space explosion since each machine can have many possible dress counts.

The problem constraints (n ≤ 10^4) clearly require an O(n) solution, so brute force isn't viable. A naive candidate might try greedy: always move from richest to poorest neighbor, but this doesn't account for simultaneous moves properly.

## Optimized Approach

The key insight is to think in terms of **dress flow through boundaries** between machines. For the final configuration where each machine has `target = total/n` dresses:

1. **Balance condition**: If total dresses isn't divisible by n, return -1
2. **Deficit per machine**: `deficit[i] = machines[i] - target` (positive = excess, negative = need)
3. **Cumulative flow**: `flow[i] = sum(deficit[0..i])` represents net dresses that must pass from left side (machines 0..i) to right side (machines i+1..n-1)
   - Positive flow: left side has excess, must send right
   - Negative flow: left side needs dresses, must receive from right
4. **Two constraints determine minimum moves**:
   - **Individual machine limit**: A machine with `k` excess dresses needs at least `k` moves to send them all out (one per move)
   - **Bottleneck limit**: At boundary `i`, `abs(flow[i])` dresses must cross that boundary. Since each move can transfer at most 1 dress across a boundary (from either direction), we need at least `abs(flow[i])` moves.

The answer is the maximum of these two values across all positions.

Why does this work? Each move transfers at most 1 dress across any given boundary between machines. The cumulative flow tells us the minimum dresses that must cross each boundary. The individual excess tells us how many moves a single machine needs to offload its excess. We need enough moves to satisfy both constraints.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findMinMoves(machines):
    """
    Calculate minimum moves to equalize dresses across washing machines.

    Args:
        machines: List of integers representing dresses in each machine

    Returns:
        Minimum moves needed, or -1 if impossible
    """
    n = len(machines)
    total = sum(machines)

    # If total dresses cannot be divided equally, impossible
    if total % n != 0:
        return -1

    target = total // n  # Each machine should have this many dresses
    moves_needed = 0
    cumulative_flow = 0  # Net dresses flowing from left to right

    for dresses in machines:
        # Calculate how many dresses this machine needs (negative) or has excess (positive)
        deficit = dresses - target

        # Update cumulative flow: net dresses that must pass from left side to right side
        cumulative_flow += deficit

        # The moves needed is the maximum of:
        # 1. Absolute cumulative flow (dresses that must cross current boundary)
        # 2. This machine's excess (dresses it needs to send out)
        moves_needed = max(moves_needed, abs(cumulative_flow), deficit)

    return moves_needed
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate minimum moves to equalize dresses across washing machines.
 * @param {number[]} machines - Array representing dresses in each machine
 * @return {number} Minimum moves needed, or -1 if impossible
 */
function findMinMoves(machines) {
  const n = machines.length;
  const total = machines.reduce((sum, val) => sum + val, 0);

  // If total dresses cannot be divided equally, impossible
  if (total % n !== 0) {
    return -1;
  }

  const target = Math.floor(total / n); // Each machine should have this many dresses
  let movesNeeded = 0;
  let cumulativeFlow = 0; // Net dresses flowing from left to right

  for (let i = 0; i < n; i++) {
    // Calculate how many dresses this machine needs (negative) or has excess (positive)
    const deficit = machines[i] - target;

    // Update cumulative flow: net dresses that must pass from left side to right side
    cumulativeFlow += deficit;

    // The moves needed is the maximum of:
    // 1. Absolute cumulative flow (dresses that must cross current boundary)
    // 2. This machine's excess (dresses it needs to send out)
    movesNeeded = Math.max(movesNeeded, Math.abs(cumulativeFlow), deficit);
  }

  return movesNeeded;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate minimum moves to equalize dresses across washing machines.
     * @param machines Array representing dresses in each machine
     * @return Minimum moves needed, or -1 if impossible
     */
    public int findMinMoves(int[] machines) {
        int n = machines.length;
        int total = 0;

        // Calculate total dresses
        for (int dresses : machines) {
            total += dresses;
        }

        // If total dresses cannot be divided equally, impossible
        if (total % n != 0) {
            return -1;
        }

        int target = total / n;  // Each machine should have this many dresses
        int movesNeeded = 0;
        int cumulativeFlow = 0;  // Net dresses flowing from left to right

        for (int i = 0; i < n; i++) {
            // Calculate how many dresses this machine needs (negative) or has excess (positive)
            int deficit = machines[i] - target;

            // Update cumulative flow: net dresses that must pass from left side to right side
            cumulativeFlow += deficit;

            // The moves needed is the maximum of:
            // 1. Absolute cumulative flow (dresses that must cross current boundary)
            // 2. This machine's excess (dresses it needs to send out)
            movesNeeded = Math.max(movesNeeded, Math.max(Math.abs(cumulativeFlow), deficit));
        }

        return movesNeeded;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once to calculate the total sum: O(n)
- We iterate through the array again to calculate deficits and track maximums: O(n)
- Overall: O(n) where n is the number of machines

**Space Complexity: O(1)**

- We only use a few integer variables (total, target, moves_needed, cumulative_flow)
- No additional data structures that grow with input size
- Even if we stored deficits in an array, we could still do it in O(1) by processing on the fly

## Common Mistakes

1. **Forgetting the divisibility check**: If total dresses isn't divisible by n, return -1 immediately. Some candidates miss this edge case.

2. **Confusing deficit sign**: Remember `deficit = machines[i] - target`. Positive means excess (needs to give out), negative means deficit (needs to receive). The individual machine constraint uses `deficit` (not absolute value) because a machine with deficit (negative) doesn't need moves to receive — it can receive while giving in the same move.

3. **Wrong formula for moves_needed**: The correct formula is `max(abs(cumulative_flow), deficit)`, not `max(abs(cumulative_flow), abs(deficit))`. A machine with -3 deficit (needs 3 dresses) doesn't necessarily need 3 moves — it can receive dresses while other machines are giving.

4. **Off-by-one in cumulative flow**: The cumulative flow is calculated **after** including the current machine's deficit. Think of it as the flow between machine i and i+1 (after processing machine i).

## When You'll See This Pattern

This "cumulative balance" pattern appears in problems where you need to redistribute resources with constraints on transfer:

1. **Candy (LeetCode 135)**: Similar idea of ensuring each child gets enough candy based on neighbors. Uses forward and backward passes.

2. **Gas Station (LeetCode 134)**: Uses cumulative gas balance to find starting point where you never run out of gas.

3. **Split Array Largest Sum (LeetCode 410)**: Different constraints but similar idea of balancing loads across partitions.

4. **Minimum Number of Increments on Subarrays to Form a Target Array (LeetCode 1526)**: Uses differences between adjacent elements to calculate operations.

The core pattern: When you need to balance elements with constraints on how transfers can happen, think about the **net flow** across boundaries and the **bottlenecks** that determine the minimum operations.

## Key Takeaways

1. **Think in terms of flow, not individual moves**: When operations can happen simultaneously, consider what must cross boundaries between positions rather than simulating individual transfers.

2. **Cumulative sums reveal bottlenecks**: The running total of imbalances tells you the minimum transfers needed across each boundary. The maximum absolute value gives a lower bound on moves.

3. **Multiple constraints determine the answer**: The answer isn't just the maximum deficit or maximum flow — it's the maximum of both because we need to satisfy all constraints simultaneously.

[Practice this problem on CodeJeet](/problem/super-washing-machines)
