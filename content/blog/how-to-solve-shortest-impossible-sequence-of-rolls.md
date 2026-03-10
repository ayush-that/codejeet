---
title: "How to Solve Shortest Impossible Sequence of Rolls — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Impossible Sequence of Rolls. Hard difficulty, 69.2% acceptance rate. Topics: Array, Hash Table, Greedy."
date: "2029-12-10"
category: "dsa-patterns"
tags: ["shortest-impossible-sequence-of-rolls", "array", "hash-table", "greedy", "hard"]
---

# How to Solve "Shortest Impossible Sequence of Rolls"

This problem asks: given a sequence of dice rolls (numbers from 1 to k) and an integer k, what's the shortest sequence you could roll that is **not** a subsequence of the given rolls? The tricky part is that we're not looking for a missing single roll, but a missing sequence of rolls. A subsequence doesn't need to be consecutive, just maintain order. This makes brute force checking impossible for large inputs, requiring a clever greedy counting approach.

## Visual Walkthrough

Let's trace through an example: `rolls = [4,2,1,2,3,3,2,4,1]`, `k = 4`

We want to find the shortest sequence that's NOT a subsequence of `rolls`. Think about building sequences length by length:

**Length 1 sequences:** All single rolls 1-4 appear in `rolls`, so all length-1 sequences exist.

**Length 2 sequences:** We need to check if every possible pair (1,1), (1,2), ..., (4,4) appears as a subsequence. Let's see how we'd check systematically:

We scan through `rolls`, looking to complete sequences. For example, to check if (1,2) exists:

- Find first 1 → at index 2
- Find next 2 after index 2 → at index 3 ✓

But here's the key insight: instead of checking all k² pairs, we can count how many **complete sets** of 1-k we can find while scanning. Each time we find all numbers 1 through k, we've essentially collected enough to form any length-1 sequence starting from that point.

Let's trace:

- Start with empty set
- See 4 → set = {4}
- See 2 → set = {2,4}
- See 1 → set = {1,2,4}
- See 2 → set = {1,2,4}
- See 3 → set = {1,2,3,4} ✓ COMPLETE SET #1
  Reset set, start counting next sequences from here
- See 3 → set = {3}
- See 2 → set = {2,3}
- See 4 → set = {2,3,4}
- See 1 → set = {1,2,3,4} ✓ COMPLETE SET #2

We found 2 complete sets. This means:

- With 0 complete sets: we can't guarantee any length-1 sequence
- With 1 complete set: we can form any length-1 sequence (using numbers from that set)
- With 2 complete sets: we can form any length-2 sequence (first roll from first set, second from second set)

Since we have 2 complete sets, all length-2 sequences exist. But we don't have a 3rd complete set, so some length-3 sequences won't exist. Therefore, the answer is 3.

## Brute Force Approach

A naive approach would be to generate all possible sequences in increasing length order, checking each against `rolls` to see if it's a subsequence. For length L, there are kᴸ possible sequences. Checking if a sequence is a subsequence takes O(n) time. So for length L, we'd need O(kᴸ × n) time.

This becomes astronomically large very quickly. Even for k=6 and L=5, that's 6⁵ = 7776 sequences to check. For k=20 and L=3, it's 8000 sequences. The problem constraints (n up to 10⁵, k up to 10⁵) make this completely infeasible.

## Optimized Approach

The key insight is that we don't need to check every possible sequence explicitly. Instead, we can think in terms of **how many complete sets of 1-k we can collect** from the array while maintaining order.

Here's the reasoning step-by-step:

1. **What does a "complete set" mean?** When we've seen all numbers from 1 to k at least once in our current scan, that's one complete set. This set can provide the next number for any sequence we're building.

2. **How do complete sets relate to sequence length?** If we have `count` complete sets, then we can build sequences of length `count+1`? Wait, let's think carefully:
   - With 0 complete sets: We might not even have all single numbers, so shortest missing sequence could be length 1
   - With 1 complete set: We definitely have all single numbers (length 1 sequences), but we might not have all pairs
   - With 2 complete sets: We can build any pair (first from set 1, second from set 2), so all length 2 sequences exist

3. **Actually, it's `count + 1`:** If we have `count` complete sets, then:
   - We can choose the first roll from the first set
   - Second roll from the second set
   - ...
   - `count`-th roll from the `count`-th set
     So we can build all sequences of length `count`. Therefore, the shortest impossible sequence has length `count + 1`.

4. **Greedy collection:** We scan through `rolls`, collecting unique numbers until we have all 1-k, then increment our count and reset. This greedy approach works because:
   - We want to maximize how many complete sets we can get
   - Once we have a complete set, starting fresh gives us the best chance to get another complete set quickly
   - Any numbers seen after completing a set can't help build longer sequences from earlier positions

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(k)
def shortestSequence(self, rolls: List[int], k: int) -> int:
    """
    Returns the length of the shortest sequence that is NOT a subsequence of rolls.

    Approach: Count how many complete sets of 1-k we can greedily collect from rolls.
    Each complete set allows us to extend possible sequences by one more roll.
    """
    seen = set()        # Track unique dice values in current segment
    complete_sets = 0   # Count how many complete 1-k sets we've found

    for roll in rolls:
        seen.add(roll)          # Add current roll to current set

        # If we've seen all k values in current segment
        if len(seen) == k:
            complete_sets += 1  # We've completed another full set
            seen.clear()        # Start fresh for next segment

    # With 'complete_sets' full sets, we can create any sequence of length 'complete_sets'
    # Therefore, the shortest impossible sequence has length 'complete_sets + 1'
    return complete_sets + 1
```

```javascript
// Time: O(n) | Space: O(k)
/**
 * Returns the length of the shortest sequence that is NOT a subsequence of rolls.
 *
 * Approach: Count how many complete sets of 1-k we can greedily collect from rolls.
 * Each complete set allows us to extend possible sequences by one more roll.
 */
function shortestSequence(rolls, k) {
  let seen = new Set(); // Track unique dice values in current segment
  let completeSets = 0; // Count how many complete 1-k sets we've found

  for (let roll of rolls) {
    seen.add(roll); // Add current roll to current set

    // If we've seen all k values in current segment
    if (seen.size === k) {
      completeSets++; // We've completed another full set
      seen.clear(); // Start fresh for next segment
    }
  }

  // With 'completeSets' full sets, we can create any sequence of length 'completeSets'
  // Therefore, the shortest impossible sequence has length 'completeSets + 1'
  return completeSets + 1;
}
```

```java
// Time: O(n) | Space: O(k)
/**
 * Returns the length of the shortest sequence that is NOT a subsequence of rolls.
 *
 * Approach: Count how many complete sets of 1-k we can greedily collect from rolls.
 * Each complete set allows us to extend possible sequences by one more roll.
 */
public int shortestSequence(int[] rolls, int k) {
    Set<Integer> seen = new HashSet<>();  // Track unique dice values in current segment
    int completeSets = 0;                  // Count how many complete 1-k sets we've found

    for (int roll : rolls) {
        seen.add(roll);                    // Add current roll to current set

        // If we've seen all k values in current segment
        if (seen.size() == k) {
            completeSets++;                // We've completed another full set
            seen.clear();                  // Start fresh for next segment
        }
    }

    // With 'completeSets' full sets, we can create any sequence of length 'completeSets'
    // Therefore, the shortest impossible sequence has length 'completeSets + 1'
    return completeSets + 1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the `rolls` array of length n
- Each roll is processed once: added to a set (O(1) average case) and we check set size (O(1))
- Clearing the set happens at most n/k times, and each clear is O(k), but amortized this is still O(n) total

**Space Complexity: O(k)**

- We maintain a set that can hold up to k unique values at once
- In the worst case, if k is large but we never complete a set, we store all k values
- The set is cleared after each complete set, so maximum size is k

## Common Mistakes

1. **Returning `complete_sets` instead of `complete_sets + 1`**: This is the most common error. Remember: if we have 2 complete sets, we can make all length-2 sequences (first from set 1, second from set 2). So the shortest impossible is length 3.

2. **Not resetting the set after finding a complete set**: If you keep accumulating in the same set, you're not counting distinct complete sets. For example, with rolls [1,2,3,1,2,3] and k=3, you'd count 1 complete set instead of 2 if you don't reset.

3. **Using a list instead of a set for tracking seen values**: A list would require O(k) time to check if a value is already present, making the solution O(nk) instead of O(n). The set gives us O(1) lookups.

4. **Misunderstanding subsequence vs substring**: Remember, a subsequence doesn't need to be consecutive. The sequence (1,2) is a subsequence of [1,3,2] because 1 comes before 2, even though they're not adjacent.

## When You'll See This Pattern

This greedy set-counting pattern appears in problems where you need to find the minimum "coverage" or "completeness" across segments:

1. **Minimum Number of Patches** (LeetCode 330): Similar concept of needing to cover all numbers up to a certain point, and greedily adding numbers when you can't cover the next one.

2. **Partition Labels** (LeetCode 763): While different in specifics, it uses a similar greedy "collect until complete" approach for partitioning strings.

3. **Task Scheduler** (LeetCode 621): Uses counting of frequencies and understanding how to arrange tasks with gaps, somewhat analogous to counting complete sets of tasks.

The core idea is: when you need to ensure coverage of all elements in a set, and you can process elements in order, greedily collect until you have everything you need, then start fresh.

## Key Takeaways

1. **Think in terms of coverage**: When a problem asks about "all possible combinations" or "missing sequences", consider whether you can frame it as "how many times can I cover the entire set of possibilities?"

2. **Greedy resets are powerful**: The insight to reset your tracking set after finding a complete collection is counterintuitive but optimal. It maximizes your ability to find more complete sets.

3. **Sequence length relates to set count**: The relationship "complete_sets count = maximum sequence length we can guarantee" appears in various forms. If you can find c disjoint complete sets, you can build sequences of length c.

[Practice this problem on CodeJeet](/problem/shortest-impossible-sequence-of-rolls)
