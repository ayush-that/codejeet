---
title: "How to Solve Teemo Attacking — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Teemo Attacking. Easy difficulty, 57.5% acceptance rate. Topics: Array, Simulation."
date: "2028-08-11"
category: "dsa-patterns"
tags: ["teemo-attacking", "array", "simulation", "easy"]
---

# How to Solve Teemo Attacking

Teemo is poisoning Ashe with attacks that apply a poison lasting exactly `duration` seconds. The challenge is calculating the **total time Ashe is poisoned** when attacks can overlap. The tricky part is handling overlapping poison durations correctly—you can't simply add `duration` for each attack, because overlapping time should only be counted once.

## Visual Walkthrough

Let's trace through an example: `timeSeries = [1, 4, 5]`, `duration = 2`

**Attack 1 at t=1**:  
Poison lasts from time 1 to time 2 (inclusive interval [1, 1+2-1] = [1, 2])  
Total poisoned time so far: 2 seconds

**Attack 2 at t=4**:  
Poison lasts from time 4 to time 5 ([4, 5])  
Notice there's a gap between time 2 and time 4 (time 3 is not poisoned)  
Total poisoned time: 2 + 2 = 4 seconds

**Attack 3 at t=5**:  
Poison would last from time 5 to time 6 ([5, 6])  
But time 5 is already poisoned from the previous attack!  
The new attack doesn't extend the poison duration—it just resets it to end at time 6  
So instead of adding 2 seconds, we only add 1 second (time 6)  
Total poisoned time: 4 + 1 = 5 seconds

**Final answer**: 5 seconds

The key insight: When attacks overlap, we only add the **non-overlapping portion** of the new poison duration.

## Brute Force Approach

A naive approach would simulate every second:

1. Create a set to track poisoned seconds
2. For each attack time `t`, add all seconds from `t` to `t + duration - 1` to the set
3. Return the size of the set

<div class="code-group">

```python
# Time: O(n * duration) | Space: O(n * duration)
def findPoisonedDuration_brute(timeSeries, duration):
    poisoned = set()
    for t in timeSeries:
        # Add all poisoned seconds from this attack
        for i in range(t, t + duration):
            poisoned.add(i)
    return len(poisoned)
```

```javascript
// Time: O(n * duration) | Space: O(n * duration)
function findPoisonedDurationBrute(timeSeries, duration) {
  const poisoned = new Set();
  for (const t of timeSeries) {
    // Add all poisoned seconds from this attack
    for (let i = t; i < t + duration; i++) {
      poisoned.add(i);
    }
  }
  return poisoned.size;
}
```

```java
// Time: O(n * duration) | Space: O(n * duration)
public int findPoisonedDurationBrute(int[] timeSeries, int duration) {
    Set<Integer> poisoned = new HashSet<>();
    for (int t : timeSeries) {
        // Add all poisoned seconds from this attack
        for (int i = t; i < t + duration; i++) {
            poisoned.add(i);
        }
    }
    return poisoned.size;
}
```

</div>

**Why this is inefficient**:

- Time complexity is O(n × duration), which could be huge if `duration` is large (up to 10⁷ in constraints)
- Space complexity is also O(n × duration), wasting memory storing individual seconds
- We're doing unnecessary work by tracking each second when we only need the total

## Optimal Solution

The optimal approach processes attacks in order, adding either:

- Full `duration` if there's no overlap with the next attack
- Only the gap until the next attack if they overlap

We iterate through attacks, comparing each with the next one to determine overlap.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findPoisonedDuration(timeSeries, duration):
    # Edge case: no attacks means no poison
    if not timeSeries:
        return 0

    total = 0

    # Process each attack except the last one
    for i in range(len(timeSeries) - 1):
        current_attack = timeSeries[i]
        next_attack = timeSeries[i + 1]

        # Calculate when current poison would end
        poison_end = current_attack + duration

        if poison_end <= next_attack:
            # No overlap: add full duration
            total += duration
        else:
            # Overlap: add only until next attack starts
            total += next_attack - current_attack

    # Always add full duration for the last attack
    # (nothing comes after it to cause overlap)
    total += duration

    return total
```

```javascript
// Time: O(n) | Space: O(1)
function findPoisonedDuration(timeSeries, duration) {
  // Edge case: no attacks means no poison
  if (timeSeries.length === 0) {
    return 0;
  }

  let total = 0;

  // Process each attack except the last one
  for (let i = 0; i < timeSeries.length - 1; i++) {
    const currentAttack = timeSeries[i];
    const nextAttack = timeSeries[i + 1];

    // Calculate when current poison would end
    const poisonEnd = currentAttack + duration;

    if (poisonEnd <= nextAttack) {
      // No overlap: add full duration
      total += duration;
    } else {
      // Overlap: add only until next attack starts
      total += nextAttack - currentAttack;
    }
  }

  // Always add full duration for the last attack
  // (nothing comes after it to cause overlap)
  total += duration;

  return total;
}
```

```java
// Time: O(n) | Space: O(1)
public int findPoisonedDuration(int[] timeSeries, int duration) {
    // Edge case: no attacks means no poison
    if (timeSeries.length == 0) {
        return 0;
    }

    int total = 0;

    // Process each attack except the last one
    for (int i = 0; i < timeSeries.length - 1; i++) {
        int currentAttack = timeSeries[i];
        int nextAttack = timeSeries[i + 1];

        // Calculate when current poison would end
        int poisonEnd = currentAttack + duration;

        if (poisonEnd <= nextAttack) {
            // No overlap: add full duration
            total += duration;
        } else {
            // Overlap: add only until next attack starts
            total += nextAttack - currentAttack;
        }
    }

    // Always add full duration for the last attack
    // (nothing comes after it to cause overlap)
    total += duration;

    return total;
}
```

</div>

**Step-by-step reasoning**:

1. Handle empty input first (no attacks = no poison)
2. Initialize total poisoned time to 0
3. For each attack (except the last), compare with the next attack:
   - If current poison ends before or exactly when next attack starts: add full `duration`
   - If current poison overlaps with next attack: only add the time until next attack starts
4. The last attack always contributes full `duration` since nothing follows it
5. Return the accumulated total

## Complexity Analysis

**Time Complexity**: O(n)  
We make a single pass through the `timeSeries` array, performing constant-time operations for each element.

**Space Complexity**: O(1)  
We only use a few variables (`total`, loop indices, temporary calculations), regardless of input size.

## Common Mistakes

1. **Forgetting the empty array case**: If `timeSeries` is empty, we should return 0 immediately. Without this check, the loop might throw an error or return incorrect results.

2. **Off-by-one errors with poison duration**: Remember poison lasts from `t` to `t + duration - 1` (inclusive). A common mistake is using `t + duration` as the end point, which adds an extra second.

3. **Incorrect overlap calculation**: When attacks overlap, you should add `nextAttack - currentAttack`, not `duration - (nextAttack - currentAttack)`. The overlap is handled by NOT adding the full duration.

4. **Missing the last attack**: In the loop that compares each attack with the next, the last attack isn't processed. You must remember to add `duration` for it after the loop.

## When You'll See This Pattern

This problem uses **interval merging logic**—similar to calculating the total length covered by multiple intervals that can overlap. You'll see this pattern in:

1. **Merge Intervals (LeetCode 56)**: Instead of just calculating total length, you actually merge overlapping intervals into consolidated ranges.

2. **Meeting Rooms II (LeetCode 253)**: Uses similar logic to find maximum concurrent intervals (poison durations in our case).

3. **Non-overlapping Intervals (LeetCode 435)**: Works with intervals that shouldn't overlap, using similar comparison logic.

The core technique is: **process sorted intervals sequentially, comparing each with the next to handle overlaps**.

## Key Takeaways

- **Think in intervals, not individual points**: When dealing with time ranges or numerical intervals, it's more efficient to work with start/end points than to enumerate every element.

- **Sorted input enables greedy solutions**: Since attacks come in chronological order, we can process them sequentially and make optimal local decisions (add full duration or only the gap).

- **Edge cases matter**: Always check for empty input, single element, and boundary conditions (what happens at the very first and last elements).

Related problems: [Merge Intervals](/problem/merge-intervals), [Can Place Flowers](/problem/can-place-flowers), [Dota2 Senate](/problem/dota2-senate)
