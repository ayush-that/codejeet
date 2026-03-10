---
title: "How to Solve Maximum Number of Weeks for Which You Can Work — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Weeks for Which You Can Work. Medium difficulty, 42.3% acceptance rate. Topics: Array, Greedy."
date: "2029-04-26"
category: "dsa-patterns"
tags: ["maximum-number-of-weeks-for-which-you-can-work", "array", "greedy", "medium"]
---

# How to Solve Maximum Number of Weeks for Which You Can Work

This problem asks us to determine the maximum number of weeks we can work on projects given constraints: each week we must work on exactly one milestone from any project, but we cannot work on the same project two weeks in a row. The tricky part is that we need to schedule milestones optimally to maximize total weeks worked before we're forced to stop due to the "no consecutive same project" rule.

## Visual Walkthrough

Let's trace through an example: `milestones = [5, 2, 1]`

We have:

- Project 0: 5 milestones
- Project 1: 2 milestones
- Project 2: 1 milestone

**Key Insight**: Think of this as arranging milestones in a sequence where no two identical projects are adjacent. The question becomes: can we arrange all milestones, or will we run out of "spacers"?

**Step-by-step reasoning**:

1. Total milestones = 5 + 2 + 1 = 8
2. The largest project has 5 milestones
3. If we try to arrange all 8 milestones, we need to ensure no two Project 0 milestones are adjacent
4. The maximum number of Project 0 milestones we can place without adjacency = (sum of all other milestones) + 1
   - Other milestones = 2 + 1 = 3
   - So maximum Project 0 milestones = 3 + 1 = 4
5. But we have 5 Project 0 milestones, which exceeds this limit
6. Therefore, we cannot complete all milestones
7. Maximum weeks = 2 _ (sum of other milestones) + 1 = 2 _ 3 + 1 = 7

Let's verify with a valid 7-week schedule:

- Week 1: Project 0
- Week 2: Project 1
- Week 3: Project 0
- Week 4: Project 2
- Week 5: Project 0
- Week 6: Project 1
- Week 7: Project 0

We used all milestones from Projects 1 and 2 (2 + 1 = 3), and 4 out of 5 milestones from Project 0. We can't add an 8th week because that would require either:

- Another Project 0 (would be adjacent to week 7's Project 0)
- Another Project 1 or 2 (we've already used them all)

## Brute Force Approach

A naive approach would try to generate all possible sequences of milestones, checking at each step if we can add another milestone without violating the "no consecutive same project" rule. We could use backtracking:

1. Start with an empty sequence
2. At each step, try adding a milestone from any project (except the one just added)
3. Keep track of remaining milestones for each project
4. Continue until no valid moves remain
5. Track the maximum sequence length found

However, this approach has exponential time complexity. With `n` projects and `m` total milestones, there are `O(n^m)` possible sequences to explore. Even with pruning, this is infeasible for the constraints (up to 10^5 milestones).

The brute force fails because it doesn't leverage the mathematical structure of the problem. We don't need to find the actual sequence - we just need to know if one exists that uses all milestones.

## Optimized Approach

The key insight comes from thinking about the largest project relative to all others:

1. **If the largest project has ≤ (sum of all other projects) + 1 milestones**:
   - We can interleave the largest project's milestones with others
   - Example: largest = 4, others sum = 5 → we can arrange all milestones
   - Maximum weeks = total milestones

2. **If the largest project has > (sum of all other projects) + 1 milestones**:
   - We cannot use all milestones from the largest project
   - The best we can do is use the largest project as every other milestone
   - Maximum weeks = 2 \* (sum of other projects) + 1

**Why this works**:

- In the worst case, the largest project dictates the schedule
- Each milestone from other projects can "separate" two milestones from the largest project
- With `k` other milestones, we can separate at most `k + 1` milestones from the largest project
- If we have more than `k + 1` largest-project milestones, the excess can't be placed without adjacency

This is a greedy approach: we always prioritize using milestones from the largest project when possible, but we're limited by the availability of "spacer" projects.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of projects
# Space: O(1) - only using constant extra space
def numberOfWeeks(milestones):
    """
    Calculate maximum weeks we can work without working on the same project consecutively.

    Args:
        milestones: List[int] - number of milestones for each project

    Returns:
        int - maximum number of weeks we can work
    """
    # Find the project with the maximum milestones
    max_milestones = max(milestones)

    # Calculate sum of all milestones
    total_milestones = sum(milestones)

    # Calculate sum of milestones for all other projects (excluding the max)
    sum_of_others = total_milestones - max_milestones

    # If the largest project has at most (sum of others + 1) milestones,
    # we can arrange all milestones without adjacency issues
    if max_milestones <= sum_of_others + 1:
        # All milestones can be completed
        return total_milestones
    else:
        # We can't complete all milestones from the largest project
        # Best we can do: use each other milestone to separate two largest-project milestones
        # This gives us: 2 * sum_of_others (for the separators and their pairs) + 1 (one extra largest)
        return 2 * sum_of_others + 1
```

```javascript
// Time: O(n) where n is number of projects
// Space: O(1) - only using constant extra space
function numberOfWeeks(milestones) {
  /**
   * Calculate maximum weeks we can work without working on the same project consecutively.
   *
   * @param {number[]} milestones - Array of milestone counts for each project
   * @return {number} - Maximum number of weeks we can work
   */

  // Find the project with the maximum milestones
  let maxMilestones = Math.max(...milestones);

  // Calculate sum of all milestones
  let totalMilestones = milestones.reduce((sum, val) => sum + val, 0);

  // Calculate sum of milestones for all other projects (excluding the max)
  let sumOfOthers = totalMilestones - maxMilestones;

  // If the largest project has at most (sum of others + 1) milestones,
  // we can arrange all milestones without adjacency issues
  if (maxMilestones <= sumOfOthers + 1) {
    // All milestones can be completed
    return totalMilestones;
  } else {
    // We can't complete all milestones from the largest project
    // Best we can do: use each other milestone to separate two largest-project milestones
    // This gives us: 2 * sumOfOthers (for the separators and their pairs) + 1 (one extra largest)
    return 2 * sumOfOthers + 1;
  }
}
```

```java
// Time: O(n) where n is number of projects
// Space: O(1) - only using constant extra space
class Solution {
    public long numberOfWeeks(int[] milestones) {
        /**
         * Calculate maximum weeks we can work without working on the same project consecutively.
         *
         * @param milestones - Array of milestone counts for each project
         * @return Maximum number of weeks we can work
         */

        // Find the project with the maximum milestones
        long maxMilestones = 0;
        long totalMilestones = 0;

        for (int milestone : milestones) {
            totalMilestones += milestone;
            if (milestone > maxMilestones) {
                maxMilestones = milestone;
            }
        }

        // Calculate sum of milestones for all other projects (excluding the max)
        long sumOfOthers = totalMilestones - maxMilestones;

        // If the largest project has at most (sum of others + 1) milestones,
        // we can arrange all milestones without adjacency issues
        if (maxMilestones <= sumOfOthers + 1) {
            // All milestones can be completed
            return totalMilestones;
        } else {
            // We can't complete all milestones from the largest project
            // Best we can do: use each other milestone to separate two largest-project milestones
            // This gives us: 2 * sumOfOthers (for the separators and their pairs) + 1 (one extra largest)
            return 2 * sumOfOthers + 1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We need to iterate through the milestones array once to find the maximum and calculate the sum
- In Python/JavaScript: `max()` and `sum()` are O(n) operations
- In Java: single pass through the array
- No nested loops or expensive operations

**Space Complexity**: O(1)

- We only store a few variables: `max_milestones`, `total_milestones`, `sum_of_others`
- No additional data structures that scale with input size
- Even the recursive stack in brute force is avoided with the mathematical solution

## Common Mistakes

1. **Trying to actually build the schedule**: Many candidates waste time trying to construct an actual sequence of milestones. The problem only asks for the maximum number of weeks, not the schedule itself. Recognizing this allows for the mathematical solution.

2. **Integer overflow**: With up to 10^5 projects and each having up to 10^9 milestones, the total can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, regular int in Python handles big integers automatically).

3. **Off-by-one errors in the formula**: The critical comparison is `max_milestones <= sum_of_others + 1` (not `sum_of_others`). If the largest equals `sum_of_others + 1`, we can still arrange all milestones. For example: `[3, 1, 1]` → max=3, others=2 → 3 ≤ 2+1 → we can complete all 5 milestones.

4. **Forgetting edge cases**:
   - Single project: `[5]` → can only work 1 week (can't work same project consecutively)
   - All zeros: `[0, 0, 0]` → should return 0
   - Very large numbers: ensure your solution handles the upper constraints

## When You'll See This Pattern

This problem uses a **greedy mathematical insight** pattern common in scheduling problems:

1. **Task Scheduler (LeetCode 621)**: Very similar concept - schedule tasks with cooldown period. The solution involves comparing the most frequent task with available slots.

2. **Rearrange String k Distance Apart (LeetCode 358)**: Another scheduling problem where you need to arrange characters with minimum distance between identical ones.

3. **Maximum Number of Events That Can Be Attended (LeetCode 1353)**: While different in details, it also involves greedy scheduling with constraints.

The common thread: when you need to arrange items with spacing constraints, think about how the most frequent/abundant item limits the arrangement, and use mathematical reasoning rather than trying to construct the actual arrangement.

## Key Takeaways

1. **Look for mathematical properties**: When a problem asks for a count or maximum rather than the actual arrangement, there's often a mathematical formula or property that gives the answer directly without constructing solutions.

2. **The largest element often dictates constraints**: In arrangement problems with spacing requirements, the most frequent element determines what's possible. Compare it against the sum of all other elements.

3. **Greedy thinking with proof**: The optimal strategy is often "use the largest when possible, but limited by availability of alternatives." Be prepared to explain why this greedy approach works (it minimizes idle time/wasted opportunities).

Related problems: [Task Scheduler](/problem/task-scheduler)
