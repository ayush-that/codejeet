---
title: "How to Solve Dota2 Senate — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Dota2 Senate. Medium difficulty, 49.6% acceptance rate. Topics: String, Greedy, Queue."
date: "2028-02-29"
category: "dsa-patterns"
tags: ["dota2-senate", "string", "greedy", "queue", "medium"]
---

# How to Solve Dota2 Senate

This problem simulates a voting process where senators from two parties (Radiant and Dire) try to eliminate each other in rounds. The tricky part is that senators act in the order they appear, but their actions affect future rounds — a senator who gets banned in the current round can't vote in later rounds, which creates a chain reaction that determines the final winner.

## Visual Walkthrough

Let's trace through a small example: `"RDDR"`

**Initial state:** Senators at indices: 0:R, 1:D, 2:D, 3:R

**Round 1:**

- Senator 0 (R) bans the next Dire senator (index 1)
- Senator 1 (D) is banned, so they're skipped
- Senator 2 (D) bans the next Radiant senator (index 3)
- Senator 3 (R) is banned, so they're skipped

**After Round 1:** Remaining senators: 0:R, 2:D

**Round 2:**

- Senator 0 (R) bans the next Dire senator (index 2)
- Senator 2 (D) is banned, so they're skipped

**Remaining:** Only Radiant senators left → Radiant wins.

The key insight: Each senator always bans the _next opposing senator_ who hasn't been banned yet. This creates a natural queue-like behavior where we need to track the order of senators who still need to act.

## Brute Force Approach

A naive approach would simulate each round explicitly:

1. Create a list of active senators
2. For each round, iterate through all active senators
3. For each senator, find the next opposing senator in the list and remove them
4. Continue until only one party remains

The problem with this approach is efficiency. In the worst case (like `"RRRRR...DDDDD"`), each senator might need to scan through many opponents to find the next one to ban. This could lead to O(n²) time complexity, which is too slow for n up to 10,000.

Additionally, tracking which senators are banned and maintaining the correct order for the next round becomes complex with array manipulations.

## Optimized Approach

The key insight is that we can model this as **two queues**:

1. Each senator needs to act in the order they appear
2. When a senator acts, they ban the _next opposing senator_ in line
3. After acting, the senator should go to the back of the queue to act again in the next round (if they weren't banned)

This naturally suggests using **queues to track the order of senators**. We store the indices of Radiant and Dire senators in separate queues. At each step, we compare the front of both queues:

- The senator with the smaller index acts first (since they come earlier in the original string)
- That senator bans one senator from the opposing party (removes them from their queue)
- The acting senator gets added back to their queue with an increased index (for the next round)

The "increased index" part is crucial: we add `current_index + n` where `n` is the original string length. This ensures that senators who act in later rounds properly queue behind senators from earlier rounds.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def predictPartyVictory(senate: str) -> str:
    """
    Simulates the Dota2 senate voting process using two queues.
    Each senator bans the next opposing senator, then re-enters the queue
    for the next round (if not banned themselves).
    """
    n = len(senate)

    # Create queues for Radiant and Dire senators
    # We store indices to preserve order and handle "next round" positioning
    radiant_queue = []
    dire_queue = []

    # Initialize queues with indices of each senator
    for i, party in enumerate(senate):
        if party == 'R':
            radiant_queue.append(i)
        else:  # party == 'D'
            dire_queue.append(i)

    # Continue until one party is completely eliminated
    while radiant_queue and dire_queue:
        # Get the next senator from each party who needs to act
        radiant_idx = radiant_queue.pop(0)  # front of Radiant queue
        dire_idx = dire_queue.pop(0)        # front of Dire queue

        # The senator with the smaller index acts first (comes earlier in original string)
        if radiant_idx < dire_idx:
            # Radiant senator acts: bans the next Dire senator
            # Radiant senator goes to back of queue with increased index for next round
            radiant_queue.append(radiant_idx + n)
        else:
            # Dire senator acts: bans the next Radiant senator
            # Dire senator goes to back of queue with increased index for next round
            dire_queue.append(dire_idx + n)

    # The party with remaining senators wins
    return "Radiant" if radiant_queue else "Dire"
```

```javascript
// Time: O(n) | Space: O(n)
function predictPartyVictory(senate) {
  /**
   * Simulates the Dota2 senate voting process using two queues.
   * Each senator bans the next opposing senator, then re-enters the queue
   * for the next round (if not banned themselves).
   */
  const n = senate.length;

  // Create queues for Radiant and Dire senators
  // We use arrays and shift() for queue operations (pop from front)
  const radiantQueue = [];
  const direQueue = [];

  // Initialize queues with indices of each senator
  for (let i = 0; i < n; i++) {
    if (senate[i] === "R") {
      radiantQueue.push(i);
    } else {
      // senate[i] === 'D'
      direQueue.push(i);
    }
  }

  // Continue until one party is completely eliminated
  while (radiantQueue.length > 0 && direQueue.length > 0) {
    // Get the next senator from each party who needs to act
    const radiantIdx = radiantQueue.shift(); // front of Radiant queue
    const direIdx = direQueue.shift(); // front of Dire queue

    // The senator with the smaller index acts first (comes earlier in original string)
    if (radiantIdx < direIdx) {
      // Radiant senator acts: bans the next Dire senator
      // Radiant senator goes to back of queue with increased index for next round
      radiantQueue.push(radiantIdx + n);
    } else {
      // Dire senator acts: bans the next Radiant senator
      // Dire senator goes to back of queue with increased index for next round
      direQueue.push(direIdx + n);
    }
  }

  // The party with remaining senators wins
  return radiantQueue.length > 0 ? "Radiant" : "Dire";
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public String predictPartyVictory(String senate) {
        /**
         * Simulates the Dota2 senate voting process using two queues.
         * Each senator bans the next opposing senator, then re-enters the queue
         * for the next round (if not banned themselves).
         */
        int n = senate.length();

        // Create queues for Radiant and Dire senators
        // Using LinkedList as Queue implementation
        Queue<Integer> radiantQueue = new LinkedList<>();
        Queue<Integer> direQueue = new LinkedList<>();

        // Initialize queues with indices of each senator
        for (int i = 0; i < n; i++) {
            if (senate.charAt(i) == 'R') {
                radiantQueue.offer(i);
            } else { // senate.charAt(i) == 'D'
                direQueue.offer(i);
            }
        }

        // Continue until one party is completely eliminated
        while (!radiantQueue.isEmpty() && !direQueue.isEmpty()) {
            // Get the next senator from each party who needs to act
            int radiantIdx = radiantQueue.poll(); // front of Radiant queue
            int direIdx = direQueue.poll();       // front of Dire queue

            // The senator with the smaller index acts first (comes earlier in original string)
            if (radiantIdx < direIdx) {
                // Radiant senator acts: bans the next Dire senator
                // Radiant senator goes to back of queue with increased index for next round
                radiantQueue.offer(radiantIdx + n);
            } else {
                // Dire senator acts: bans the next Radiant senator
                // Dire senator goes to back of queue with increased index for next round
                direQueue.offer(direIdx + n);
            }
        }

        // The party with remaining senators wins
        return radiantQueue.isEmpty() ? "Dire" : "Radiant";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each senator exactly once when initializing the queues: O(n)
- In the while loop, each comparison removes one senator from the front of a queue
- Each senator is removed at most once (when banned) and added at most once (when re-queuing)
- Total operations: O(n) queue operations

**Space Complexity: O(n)**

- We store all senator indices in two queues: O(n) total space
- The queues combined contain all n senators initially
- As the simulation progresses, the total number of indices in both queues decreases

## Common Mistakes

1. **Not handling the "next round" ordering correctly**: Simply re-adding senators to the end of the same queue without adjusting their index causes ordering issues. Senators from later rounds should act after senators from earlier rounds. The `+ n` trick ensures proper ordering across rounds.

2. **Using a single queue or array**: Some candidates try to process senators in a single data structure, which makes it hard to track which senators are still active and who should ban whom. The two-queue approach naturally separates the parties while preserving order.

3. **Infinite loops with equal indices**: In the rare case where indices might be equal (though not possible in our implementation), not having a clear rule for which senator acts first could cause issues. Our comparison `radiantIdx < direIdx` provides a deterministic rule.

4. **Forgetting that banned senators don't get re-queued**: The key insight is that when a senator is banned (their index is not re-queued), they're permanently out. The acting senator always gets re-queued (unless they get banned later).

## When You'll See This Pattern

This "competing queues" pattern appears in problems where two groups take turns eliminating each other based on some ordering:

1. **Task Scheduler (LeetCode 621)**: Similar queue-based approach for scheduling tasks with cooldown periods, where you need to track which tasks are available vs. cooling down.

2. **Reveal Cards In Increasing Order (LeetCode 950)**: Uses a queue to simulate the card revealing process where you need to track order of operations.

3. **Number of Recent Calls (LeetCode 933)**: Uses a queue to maintain sliding window of recent requests, removing old ones as new ones come in.

The core pattern is using queues to maintain order of events/entities when you need to process them in sequence and some get removed while others get re-added for later processing.

## Key Takeaways

1. **Queues naturally model turn-based elimination**: When entities act in order and can remove other entities from future consideration, queues help maintain the proper sequence of actions.

2. **The "+n" index adjustment trick**: When you need to re-queue items for "next round" processing, adding the total count ensures they queue behind items from the current round. This is a useful technique for multi-round simulations.

3. **Separate data structures for competing groups**: When two groups interact in predictable ways (like banning each other), maintaining separate queues for each group simplifies the logic compared to trying to manage everything in one structure.

Related problems: [Teemo Attacking](/problem/teemo-attacking)
