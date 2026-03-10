---
title: "How to Solve Task Scheduler — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Task Scheduler. Medium difficulty, 62.7% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue)."
date: "2026-10-27"
category: "dsa-patterns"
tags: ["task-scheduler", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Task Scheduler

You're given a list of CPU tasks (each represented by a letter) and a cooldown period `n`. You need to find the minimum number of CPU intervals required to complete all tasks, with the constraint that two identical tasks must have at least `n` intervals between them. What makes this problem interesting is that it looks like a scheduling problem but has a clever mathematical solution that avoids actual simulation.

## Visual Walkthrough

Let's trace through an example: `tasks = ["A","A","A","B","B","B"]` with `n = 2`.

**Step 1: Count task frequencies**

- A appears 3 times
- B appears 3 times

**Step 2: Identify the most frequent task**
Both A and B appear 3 times (max frequency = 3).

**Step 3: Calculate the framework**
The most frequent task creates a framework. With frequency 3 and cooldown 2:

- Place A: A \_ _ A _ \_ A
- We need to fill the gaps with other tasks

**Step 4: Fill the gaps**
We have 3 B's to place:

- A B _ A B _ A (first B in each gap)
- A B B A B \_ A (second B in first gap)
- A B B A B B A (done!)

**Step 5: Count intervals**
We used 7 intervals total. Notice the pattern:

- Framework: (max_freq - 1) × (n + 1) = 2 × 3 = 6
- Plus one for the last A: 6 + 1 = 7

But wait, what if we have more tasks than gaps? Let's try `tasks = ["A","A","A","B","B","B","C","C","D"]` with `n = 2`:

- A:3, B:3, C:2, D:1
- Framework: A \_ _ A _ \_ A
- Fill gaps: A B C A B C A B D
- Total: 9 intervals (which equals number of tasks!)

The key insight: when tasks fill all gaps and overflow, the answer is simply the number of tasks.

## Brute Force Approach

A naive approach would try to simulate the scheduling process:

1. Sort tasks by frequency
2. Always pick the most frequent available task that's not on cooldown
3. Track cooldowns for each task type
4. Increment time step by step

This simulation approach has several problems:

- It's complex to implement correctly
- Time complexity is at least O(t × n) where t is number of tasks
- For large inputs (up to 10^4 tasks), this could be too slow
- The greedy choice (pick most frequent available task) needs proof

While this approach could work, it's unnecessarily complex. Interviewers expect the mathematical insight that leads to a simpler O(n) solution.

## Optimized Approach

The key insight comes from analyzing the structure:

1. **The most frequent task dictates the framework**
   If the most frequent task appears `max_freq` times, it creates `max_freq - 1` blocks of size `n + 1` (each block contains the task followed by `n` intervals).

2. **Count idle slots**
   Total framework size = `(max_freq - 1) × (n + 1)`
   Then add 1 for the last occurrence of the most frequent task.

3. **Fill idle slots with other tasks**
   For each other task, we can fill `min(freq, max_freq - 1)` slots. If multiple tasks have the same max frequency, we need to account for them at the end.

4. **Handle the overflow case**
   If the number of tasks exceeds the framework capacity, there are no idle slots needed. The answer is simply the number of tasks.

The formula becomes:

```
framework = (max_freq - 1) × (n + 1)
count_max_tasks = number of tasks with frequency = max_freq
result = max(len(tasks), framework + count_max_tasks)
```

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of tasks | Space: O(1) since alphabet size is fixed (26 letters)
def leastInterval(tasks, n):
    """
    Calculate minimum intervals to complete all tasks with cooldown n.

    Args:
        tasks: List of characters representing tasks
        n: Cooldown period between identical tasks

    Returns:
        Minimum number of CPU intervals required
    """
    # Step 1: Count frequency of each task
    # We have 26 possible tasks (A-Z)
    freq = [0] * 26
    for task in tasks:
        # Convert character to index (0-25)
        freq[ord(task) - ord('A')] += 1

    # Step 2: Find the maximum frequency
    max_freq = max(freq)

    # Step 3: Count how many tasks have the maximum frequency
    # This is important because if multiple tasks share the max frequency,
    # they all need to be accounted for in the final framework
    count_max_tasks = freq.count(max_freq)

    # Step 4: Calculate the framework size
    # (max_freq - 1) creates the gaps between occurrences of max frequency task
    # (n + 1) is the size of each block (task + n cooldown slots)
    # + count_max_tasks accounts for all tasks with max frequency at the end
    framework = (max_freq - 1) * (n + 1) + count_max_tasks

    # Step 5: Return the maximum of framework size and total tasks
    # If we have more tasks than framework slots, we can execute them
    # back-to-back without additional idle time
    return max(framework, len(tasks))
```

```javascript
// Time: O(n) where n is number of tasks | Space: O(1) since alphabet size is fixed (26 letters)
function leastInterval(tasks, n) {
  /**
   * Calculate minimum intervals to complete all tasks with cooldown n.
   *
   * @param {character[]} tasks - Array of characters representing tasks
   * @param {number} n - Cooldown period between identical tasks
   * @return {number} Minimum number of CPU intervals required
   */

  // Step 1: Count frequency of each task
  // We have 26 possible tasks (A-Z)
  const freq = new Array(26).fill(0);
  for (const task of tasks) {
    // Convert character to index (0-25)
    const index = task.charCodeAt(0) - "A".charCodeAt(0);
    freq[index]++;
  }

  // Step 2: Find the maximum frequency
  let maxFreq = 0;
  for (const count of freq) {
    if (count > maxFreq) {
      maxFreq = count;
    }
  }

  // Step 3: Count how many tasks have the maximum frequency
  let countMaxTasks = 0;
  for (const count of freq) {
    if (count === maxFreq) {
      countMaxTasks++;
    }
  }

  // Step 4: Calculate the framework size
  // (maxFreq - 1) creates the gaps between occurrences of max frequency task
  // (n + 1) is the size of each block (task + n cooldown slots)
  // + countMaxTasks accounts for all tasks with max frequency at the end
  const framework = (maxFreq - 1) * (n + 1) + countMaxTasks;

  // Step 5: Return the maximum of framework size and total tasks
  // If we have more tasks than framework slots, we can execute them
  // back-to-back without additional idle time
  return Math.max(framework, tasks.length);
}
```

```java
// Time: O(n) where n is number of tasks | Space: O(1) since alphabet size is fixed (26 letters)
class Solution {
    public int leastInterval(char[] tasks, int n) {
        /**
         * Calculate minimum intervals to complete all tasks with cooldown n.
         *
         * @param tasks - Array of characters representing tasks
         * @param n - Cooldown period between identical tasks
         * @return Minimum number of CPU intervals required
         */

        // Step 1: Count frequency of each task
        // We have 26 possible tasks (A-Z)
        int[] freq = new int[26];
        for (char task : tasks) {
            // Convert character to index (0-25)
            freq[task - 'A']++;
        }

        // Step 2: Find the maximum frequency
        int maxFreq = 0;
        for (int count : freq) {
            if (count > maxFreq) {
                maxFreq = count;
            }
        }

        // Step 3: Count how many tasks have the maximum frequency
        int countMaxTasks = 0;
        for (int count : freq) {
            if (count == maxFreq) {
                countMaxTasks++;
            }
        }

        // Step 4: Calculate the framework size
        // (maxFreq - 1) creates the gaps between occurrences of max frequency task
        // (n + 1) is the size of each block (task + n cooldown slots)
        // + countMaxTasks accounts for all tasks with max frequency at the end
        int framework = (maxFreq - 1) * (n + 1) + countMaxTasks;

        // Step 5: Return the maximum of framework size and total tasks
        // If we have more tasks than framework slots, we can execute them
        // back-to-back without additional idle time
        return Math.max(framework, tasks.length);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting task frequencies: O(n) where n is number of tasks
- Finding maximum frequency: O(26) = O(1)
- Counting tasks with max frequency: O(26) = O(1)
- All other operations are constant time
- Total: O(n) + O(1) = O(n)

**Space Complexity: O(1)**

- Frequency array has fixed size 26 (for A-Z)
- No additional data structures scale with input size
- Even with Unicode, we could use a hash map, but the problem specifies A-Z

The constant factors are small, making this very efficient even for large inputs.

## Common Mistakes

1. **Forgetting to handle multiple tasks with max frequency**
   - Mistake: Using `(max_freq - 1) * (n + 1) + 1`
   - Fix: Add `count_max_tasks` not just 1
   - Example: `["A","A","A","B","B","B"]` with `n=2` needs +2 not +1

2. **Not considering the overflow case**
   - Mistake: Always returning the framework calculation
   - Fix: Take `max(framework, len(tasks))`
   - Example: When tasks fill all gaps completely, no idle time is needed

3. **Incorrect cooldown calculation**
   - Mistake: Using `n` instead of `n + 1` in framework
   - Fix: Remember the framework includes the task itself plus `n` gaps
   - Example: With cooldown 2, each block is size 3 (task + 2 gaps)

4. **Overcomplicating with simulation**
   - Mistake: Trying to actually schedule tasks step by step
   - Fix: Recognize the mathematical pattern
   - Benefit: Simpler code, better performance, easier to reason about

## When You'll See This Pattern

This "frequency-based scheduling with gaps" pattern appears in several variations:

1. **Rearrange String k Distance Apart (Hard)**
   - Similar constraint: identical characters must be k apart
   - Difference: Returns the rearranged string or empty string if impossible
   - Same core insight: Most frequent character dictates the framework

2. **Reorganize String (Medium)**
   - Constraint: No two identical characters adjacent (n=1 case)
   - Special case of Task Scheduler with n=1
   - Check if possible: max_freq ≤ (len+1)/2

3. **Maximum Number of Weeks for Which You Can Can Work (Medium)**
   - Similar frequency analysis
   - Determine if you can complete all milestones
   - Key insight: If max ≤ sum - max + 1, you can complete all

The pattern recognition clue: When you see "arrange with minimum distance" or "schedule with cooldown", think about frequency counts and framework calculation.

## Key Takeaways

1. **Frequency dictates framework**: The most frequent element creates a template that other elements must fit into. Count frequencies first in any arrangement problem.

2. **Mathematical insight beats simulation**: Many scheduling problems have closed-form solutions. Look for patterns in small examples before coding.

3. **Handle edge cases systematically**: Multiple max-frequency elements and overflow cases (when tasks exceed framework) are common trip points. Test with: all tasks same, all tasks different, and mixed frequencies.

Remember: The optimal solution often comes from asking "What structure does the constraint create?" rather than "How do I simulate this process?"

Related problems: [Rearrange String k Distance Apart](/problem/rearrange-string-k-distance-apart), [Reorganize String](/problem/reorganize-string), [Maximum Number of Weeks for Which You Can Work](/problem/maximum-number-of-weeks-for-which-you-can-work)
