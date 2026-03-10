---
title: "How to Solve Minimum Rounds to Complete All Tasks — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Rounds to Complete All Tasks. Medium difficulty, 63.2% acceptance rate. Topics: Array, Hash Table, Greedy, Counting."
date: "2026-05-14"
category: "dsa-patterns"
tags: ["minimum-rounds-to-complete-all-tasks", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Minimum Rounds to Complete All Tasks

You're given an array of tasks where each number represents a difficulty level. In each round, you can complete either 2 or 3 tasks of the same difficulty. Your goal is to find the minimum number of rounds needed to complete all tasks, or return -1 if it's impossible. The tricky part is that you can't complete just 1 task in a round — you must complete groups of 2 or 3 — so some task counts might be impossible to complete.

## Visual Walkthrough

Let's trace through an example: `tasks = [2,2,3,3,2,4,4,4,4,4]`

First, we need to count how many tasks we have at each difficulty level:

- Difficulty 2: 3 tasks
- Difficulty 3: 2 tasks
- Difficulty 4: 5 tasks

Now let's process each difficulty level separately:

**Difficulty 2 (3 tasks):**

- Can we complete 3 tasks using only groups of 2 or 3? Yes! One group of 3.
- Rounds needed: 1

**Difficulty 3 (2 tasks):**

- Can we complete 2 tasks? Yes! One group of 2.
- Rounds needed: 1

**Difficulty 4 (5 tasks):**

- Let's try different combinations:
  - Option 1: One group of 3 (3 tasks) + one group of 2 (2 tasks) = 5 tasks
  - Option 2: Two groups of 2 (4 tasks) + ... can't complete the last task
- Best option: 3 + 2 = 5 tasks, which takes 2 rounds

Total rounds: 1 + 1 + 2 = 4 rounds

What about a case that's impossible? Consider `tasks = [2,3,3]`:

- Difficulty 2: 1 task → Can't complete (need at least 2 per round)
- Difficulty 3: 2 tasks → Can complete in 1 round
- Since difficulty 2 is impossible, we return -1

The key insight: For each difficulty level with `count` tasks:

- If `count == 1`: Impossible → return -1
- Otherwise, we want to use as many groups of 3 as possible (since 3 > 2, using more 3s reduces rounds)
- But we need to handle the remainder carefully

## Brute Force Approach

A naive approach might try to explore all possible combinations of 2s and 3s for each task count. For a task count `n`, we could try:

- All possible numbers of groups of 3 (from 0 to `n//3`)
- For each, check if the remaining tasks can be completed with groups of 2

While this would work, it's inefficient. For each difficulty level with `n` tasks, we'd check up to `n//3` possibilities. With `m` unique difficulties and average count `k`, this becomes O(m × k) time, which is too slow for large inputs (up to 10⁵ tasks).

More importantly, we don't need to try all combinations — there's a mathematical pattern we can exploit.

## Optimized Approach

The key insight is that we can solve this with a greedy approach using simple arithmetic. For each task count `n`:

1. **Base case**: If `n == 1`, it's impossible → return -1
2. **General case**: We want to use as many groups of 3 as possible
   - If `n % 3 == 0`: All groups of 3 → `n // 3` rounds
   - If `n % 3 == 1`: We have one extra task. Example: 4, 7, 10, 13...
     - For 4: Can't do 3+1, but can do 2+2 → 2 rounds
     - For 7: 3+3+1 doesn't work, but 3+2+2 works → 3 rounds
     - Pattern: `(n // 3) + 1` rounds (convert one group of 3 to two groups of 2)
   - If `n % 3 == 2`: We have two extra tasks. Example: 5, 8, 11, 14...
     - For 5: 3+2 → 2 rounds
     - For 8: 3+3+2 → 3 rounds
     - Pattern: `(n // 3) + 1` rounds (add one group of 2)

Wait, let's verify the patterns:

- `n = 4`: `4 // 3 = 1`, `1 + 1 = 2` ✓
- `n = 7`: `7 // 3 = 2`, `2 + 1 = 3` ✓
- `n = 5`: `5 // 3 = 1`, `1 + 1 = 2` ✓
- `n = 8`: `8 // 3 = 2`, `2 + 1 = 3` ✓

Actually, there's an even cleaner formula: `(n + 2) // 3` works for all cases except `n = 1`! Let's test:

- `n = 2`: `(2+2)//3 = 4//3 = 1` ✓
- `n = 3`: `(3+2)//3 = 5//3 = 1` ✓
- `n = 4`: `(4+2)//3 = 6//3 = 2` ✓
- `n = 5`: `(5+2)//3 = 7//3 = 2` ✓
- `n = 6`: `(6+2)//3 = 8//3 = 2` ✓
- `n = 7`: `(7+2)//3 = 9//3 = 3` ✓
- `n = 1`: `(1+2)//3 = 3//3 = 1` but this is wrong!

So we need the special case for `n = 1`. Alternatively, we can use: `ceil(n / 3)` for all `n > 1`, but we still need to check `n = 1`.

## Optimal Solution

The algorithm:

1. Count frequency of each task difficulty using a hash map
2. For each frequency:
   - If frequency is 1, return -1 (impossible)
   - Otherwise, add `(frequency + 2) // 3` to the total rounds
3. Return total rounds

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumRounds(tasks):
    """
    Calculate minimum rounds to complete all tasks.

    Args:
        tasks: List of task difficulties

    Returns:
        Minimum rounds or -1 if impossible
    """
    from collections import Counter

    # Step 1: Count frequency of each task difficulty
    # We need to know how many tasks of each type we have
    freq_map = Counter(tasks)

    total_rounds = 0

    # Step 2: Process each task difficulty
    for count in freq_map.values():
        # If we have only 1 task of a type, it's impossible
        # (we need at least 2 tasks per round)
        if count == 1:
            return -1

        # Step 3: Calculate minimum rounds for this task count
        # Formula: (count + 2) // 3 works for all count > 1
        # Why? We want ceil(count / 3) but handle remainders properly
        # For count = 2: (2+2)//3 = 1 ✓
        # For count = 3: (3+2)//3 = 1 ✓
        # For count = 4: (4+2)//3 = 2 ✓ (2+2)
        # For count = 5: (5+2)//3 = 2 ✓ (3+2)
        # For count = 6: (6+2)//3 = 2 ✓ (3+3)
        rounds_for_this_task = (count + 2) // 3
        total_rounds += rounds_for_this_task

    return total_rounds
```

```javascript
// Time: O(n) | Space: O(n)
function minimumRounds(tasks) {
  /**
   * Calculate minimum rounds to complete all tasks.
   *
   * @param {number[]} tasks - Array of task difficulties
   * @return {number} Minimum rounds or -1 if impossible
   */

  // Step 1: Count frequency of each task difficulty
  const freqMap = new Map();

  for (const task of tasks) {
    // Increment count for this task difficulty
    freqMap.set(task, (freqMap.get(task) || 0) + 1);
  }

  let totalRounds = 0;

  // Step 2: Process each task difficulty
  for (const count of freqMap.values()) {
    // If we have only 1 task of a type, it's impossible
    if (count === 1) {
      return -1;
    }

    // Step 3: Calculate minimum rounds for this task count
    // Formula: Math.ceil(count / 3) also works
    // But (count + 2) // 3 is more efficient
    const roundsForThisTask = Math.floor((count + 2) / 3);
    totalRounds += roundsForThisTask;
  }

  return totalRounds;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int minimumRounds(int[] tasks) {
        /**
         * Calculate minimum rounds to complete all tasks.
         *
         * @param tasks Array of task difficulties
         * @return Minimum rounds or -1 if impossible
         */

        // Step 1: Count frequency of each task difficulty
        Map<Integer, Integer> freqMap = new HashMap<>();

        for (int task : tasks) {
            // Increment count for this task difficulty
            freqMap.put(task, freqMap.getOrDefault(task, 0) + 1);
        }

        int totalRounds = 0;

        // Step 2: Process each task difficulty
        for (int count : freqMap.values()) {
            // If we have only 1 task of a type, it's impossible
            if (count == 1) {
                return -1;
            }

            // Step 3: Calculate minimum rounds for this task count
            // Using (count + 2) / 3 handles all cases except count = 1
            // Integer division works because we add before dividing
            int roundsForThisTask = (count + 2) / 3;
            totalRounds += roundsForThisTask;
        }

        return totalRounds;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all `n` tasks once to build the frequency map: O(n)
- We iterate through all unique task difficulties (at most `n`): O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- In the worst case, all tasks have different difficulties, so the frequency map stores `n` entries: O(n)
- The space for the output and counters is O(1)

## Common Mistakes

1. **Forgetting the `count == 1` edge case**: This is the most common mistake. Candidates often implement the `(count + 2) // 3` formula but forget that it gives 1 for `count = 1`, which is incorrect. Always check for this case first.

2. **Using the wrong formula**: Some candidates try `count // 3 + (count % 3 != 0 ? 1 : 0)` which works but is more complex. Others try `count // 2` which is wrong for odd counts. The cleanest is `(count + 2) // 3` with the `count == 1` check.

3. **Not using a hash map for counting**: Some candidates try to sort the array first, which takes O(n log n) time. While this works, it's less efficient than the O(n) hash map approach.

4. **Integer division errors in Java/JavaScript**: In Java, `(count + 2) / 3` works with integer division. In JavaScript, you need `Math.floor((count + 2) / 3)` or use the `~~` operator. Python's `//` operator handles it correctly.

## When You'll See This Pattern

This problem combines **frequency counting** with **greedy optimization** and **modular arithmetic**. You'll see similar patterns in:

1. **Coin Change (LeetCode 322)**: Both problems involve finding minimum counts using limited denominations (here 2 and 3, in Coin Change arbitrary denominations).

2. **Task Scheduler (LeetCode 621)**: Both involve scheduling tasks with constraints, though Task Scheduler is more complex with cooling periods.

3. **Maximum Number of Groups Entering a Competition (LeetCode 2358)**: Similar grouping constraints but with different rules.

4. **Any problem with "minimum groups" or "partition into fixed sizes"**: The core idea of using as many large groups as possible and handling remainders is a common greedy strategy.

## Key Takeaways

1. **When you see "group by property" problems, think hash maps**: The first step is almost always counting frequencies of each type.

2. **Greedy with remainders often has simple formulas**: Instead of trying all combinations, look for mathematical patterns. For grouping into sizes `a` and `b`, the optimal is usually: use as many of the larger size as possible, then handle the remainder.

3. **Always check small edge cases**: Test your formula with `n = 1, 2, 3, 4, 5` to catch off-by-one errors. These small values often reveal flaws in the logic.

Related problems: [Climbing Stairs](/problem/climbing-stairs), [Odd String Difference](/problem/odd-string-difference), [Minimum Levels to Gain More Points](/problem/minimum-levels-to-gain-more-points)
