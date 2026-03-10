---
title: "How to Solve Poor Pigs — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Poor Pigs. Hard difficulty, 59.1% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2026-12-16"
category: "dsa-patterns"
tags: ["poor-pigs", "math", "dynamic-programming", "combinatorics", "hard"]
---

# How to Solve Poor Pigs

This problem presents a unique scenario: you have `buckets` of liquid where exactly one is poisonous, `minutesToDie` minutes for a pig to die after drinking poison, and `minutesToTest` total minutes available to determine the poisonous bucket. You need to find the **minimum number of pigs** required to figure out which bucket is poisonous. What makes this problem tricky is that it's not about programming logic in the traditional sense—it's about mathematical modeling and understanding how to maximize information from limited tests.

## Visual Walkthrough

Let's build intuition with a concrete example. Suppose we have:

- `buckets = 4`
- `minutesToDie = 15`
- `minutesToTest = 15`

This means we have only **one testing round** (since `minutesToTest / minutesToDie = 1`). With one round, each pig can be in one of two states: alive or dead. If we have 1 pig, we can test at most 2 buckets (feed it from one bucket; if it dies, that bucket is poison; if it lives, the other bucket is poison). But we have 4 buckets, so 1 pig isn't enough.

With 2 pigs, we can encode 4 possibilities:

- Pig 1 lives, Pig 2 lives → Bucket 1
- Pig 1 lives, Pig 2 dies → Bucket 2
- Pig 1 dies, Pig 2 lives → Bucket 3
- Pig 1 dies, Pig 2 dies → Bucket 4

So 2 pigs suffice for 4 buckets with 1 test round.

Now consider `buckets = 8`, `minutesToDie = 15`, `minutesToTest = 30`. Here we have **2 testing rounds** (30/15 = 2). Each pig can now be in 3 states:

- Alive after both rounds
- Dies in first round
- Dies in second round

With 1 pig and 3 states, we can distinguish 3 buckets. But we need 8 buckets. With 2 pigs, each with 3 states, we have 3² = 9 possible outcomes, which covers 8 buckets. So 2 pigs suffice.

This pattern reveals the core insight: **each pig represents a digit in a base-(tests+1) number system**, where the number of digits (pigs) needed is the smallest integer such that (tests+1)^pigs ≥ buckets.

## Brute Force Approach

A naive approach might try to simulate all possible testing strategies or use dynamic programming to track probabilities. However, this quickly becomes intractable because:

1. The state space grows exponentially with buckets
2. We'd need to consider all possible feeding schedules across multiple rounds
3. The problem asks for a mathematical minimum, not a specific testing plan

Any brute force simulation would have complexity at least O(buckets^pigs), which is infeasible for large inputs. The key realization is that we don't need to simulate—we can compute the answer directly using combinatorial reasoning.

## Optimized Approach

The optimal solution comes from understanding the information-theoretic capacity of our testing scheme:

1. **Determine number of tests**: We can perform `tests = minutesToTest // minutesToDie` rounds of testing.

2. **States per pig**: In each test round, we can feed a pig from different buckets. A pig can:
   - Survive all tests (state 0)
   - Die in test 1 (state 1)
   - Die in test 2 (state 2)
   - ...
   - Die in test `tests` (state `tests`)

   So each pig has `tests + 1` possible states.

3. **Encoding buckets as states**: If we have `x` pigs, we can encode up to `(tests + 1)^x` distinct bucket identifiers. Each pig's death time tells us one digit of the bucket's ID in base `(tests + 1)`.

4. **Finding minimum pigs**: We need the smallest integer `x` such that `(tests + 1)^x ≥ buckets`. This is equivalent to `x ≥ log(buckets) / log(tests + 1)`.

The reasoning: Assign each bucket a unique code in base `(tests + 1)`, where each digit corresponds to a pig. The digit value (0 to `tests`) tells us in which round to feed that pig from that bucket (0 means don't feed it at all). At the end, each pig's death time gives us one digit of the poisonous bucket's code.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def poorPigs(buckets, minutesToDie, minutesToTest):
    """
    Calculate the minimum number of pigs needed to find the poisonous bucket.

    Args:
        buckets: Total number of buckets (1 is poisonous)
        minutesToDie: Minutes until a pig dies after drinking poison
        minutesToTest: Total minutes available for testing

    Returns:
        Minimum number of pigs required
    """
    # Calculate how many test rounds we can perform
    # Integer division gives us the maximum complete tests possible
    tests = minutesToTest // minutesToDie

    # Each pig has (tests + 1) possible states:
    # - Alive after all tests (state 0)
    # - Dies in test 1 (state 1)
    # - Dies in test 2 (state 2)
    # - ...
    # - Dies in test 'tests' (state 'tests')

    # We need to find the smallest x such that (tests + 1)^x >= buckets
    # This is equivalent to x >= log(buckets) / log(tests + 1)

    # Handle edge case: if buckets is 1, no pigs needed
    if buckets == 1:
        return 0

    # Initialize pig count
    pigs = 0
    # Keep increasing pigs until we can cover all buckets
    # We use (tests + 1)^pigs to represent maximum distinguishable buckets
    while (tests + 1) ** pigs < buckets:
        pigs += 1

    return pigs
```

```javascript
// Time: O(1) | Space: O(1)
function poorPigs(buckets, minutesToDie, minutesToTest) {
  /**
   * Calculate the minimum number of pigs needed to find the poisonous bucket.
   *
   * @param {number} buckets - Total number of buckets (1 is poisonous)
   * @param {number} minutesToDie - Minutes until a pig dies after drinking poison
   * @param {number} minutesToTest - Total minutes available for testing
   * @return {number} Minimum number of pigs required
   */

  // Calculate maximum number of test rounds
  // Math.floor ensures we only count complete test rounds
  const tests = Math.floor(minutesToTest / minutesToDie);

  // Each pig has (tests + 1) possible states
  // We need smallest x where (tests + 1)^x >= buckets

  // Edge case: if only 1 bucket, no pigs needed
  if (buckets === 1) {
    return 0;
  }

  let pigs = 0;
  // Keep adding pigs until we can distinguish all buckets
  while (Math.pow(tests + 1, pigs) < buckets) {
    pigs++;
  }

  return pigs;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int poorPigs(int buckets, int minutesToDie, int minutesToTest) {
        /**
         * Calculate the minimum number of pigs needed to find the poisonous bucket.
         *
         * @param buckets Total number of buckets (1 is poisonous)
         * @param minutesToDie Minutes until a pig dies after drinking poison
         * @param minutesToTest Total minutes available for testing
         * @return Minimum number of pigs required
         */

        // Calculate number of complete test rounds
        // Integer division automatically floors the result
        int tests = minutesToTest / minutesToDie;

        // Each pig has (tests + 1) possible states
        // Need smallest x where (tests + 1)^x >= buckets

        // Edge case: only 1 bucket means no pigs needed
        if (buckets == 1) {
            return 0;
        }

        int pigs = 0;
        // Use long to prevent integer overflow for large values
        long maxBuckets = 1;

        // Incrementally calculate (tests + 1)^pigs
        while (maxBuckets < buckets) {
            pigs++;
            // Careful with overflow: recalculate from scratch each time
            // or use Math.pow with double (less precise for large numbers)
            maxBuckets = 1;
            for (int i = 0; i < pigs; i++) {
                maxBuckets *= (tests + 1);
                // Early exit if we already exceed buckets
                if (maxBuckets >= buckets) {
                    break;
                }
            }
        }

        return pigs;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(buckets)) in practice, but technically O(1) since the number of pigs grows logarithmically and is bounded (for reasonable inputs, pigs won't exceed a small constant).

**Space Complexity:** O(1) as we only use a few variables regardless of input size.

The logarithmic nature comes from the fact that we're essentially solving for `pigs` in `(tests+1)^pigs ≥ buckets`, which gives `pigs ≥ log(buckets) / log(tests+1)`.

## Common Mistakes

1. **Forgetting the +1 in states calculation**: Each pig has `tests + 1` states, not `tests` states. The "+1" represents the state where the pig survives all tests.

2. **Not handling the buckets=1 edge case**: When there's only one bucket, we already know it's poisonous without any pigs. Always check for this special case.

3. **Integer overflow in Java**: When calculating `(tests+1)^pigs`, the result can exceed `Integer.MAX_VALUE`. Use `long` or careful multiplication with early termination.

4. **Misunderstanding test rounds**: Some candidates think `minutesToTest / minutesToDie` gives the number of pigs that can be tested, rather than the number of testing rounds. Remember: we can test the same pig multiple times in different rounds.

## When You'll See This Pattern

This problem uses **combinatorial encoding** and **logarithmic scaling** patterns seen in:

1. **First Missing Positive (LeetCode 41)**: While different on surface, both require thinking about encoding information into array indices.

2. **Counting Bits (LeetCode 338)**: Involves understanding how many bits (like pigs) are needed to represent numbers up to n.

3. **Bulb Switcher (LeetCode 319)**: Another "math trick" problem where the optimal solution requires understanding factors rather than simulation.

The core pattern is recognizing when a problem can be reduced to finding `x` such that `base^x ≥ n`, which appears in information theory, encoding problems, and resource allocation scenarios.

## Key Takeaways

1. **Think in terms of information capacity**: Each test subject (pig) provides a certain amount of information based on possible outcomes. Multiply these to get total distinguishable states.

2. **Logarithmic scaling is powerful**: When something grows exponentially with resources (like distinguishable states with pigs), you often need logarithmic resources relative to the problem size.

3. **Encode, don't simulate**: For problems about optimal testing strategies, look for ways to encode all possibilities rather than simulating specific sequences.

[Practice this problem on CodeJeet](/problem/poor-pigs)
