---
title: "How to Solve X of a Kind in a Deck of Cards — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode X of a Kind in a Deck of Cards. Easy difficulty, 30.1% acceptance rate. Topics: Array, Hash Table, Math, Counting, Number Theory."
date: "2026-08-16"
category: "dsa-patterns"
tags: ["x-of-a-kind-in-a-deck-of-cards", "array", "hash-table", "math", "easy"]
---

# How to Solve X of a Kind in a Deck of Cards

This problem asks us to determine if we can partition a deck of cards into groups where each group has exactly `x > 1` cards, and all cards in a group share the same value. What makes this problem interesting is that it's not about finding a specific `x`—we need to determine if _any_ `x > 1` exists that works for the entire deck. The challenge lies in finding a mathematical relationship between the counts of each card value.

## Visual Walkthrough

Let's trace through an example: `deck = [1, 1, 2, 2, 2, 2, 3, 3]`

**Step 1: Count card frequencies**

- Value 1 appears 2 times
- Value 2 appears 4 times
- Value 3 appears 2 times

So we have frequency counts: `[2, 4, 2]`

**Step 2: Understand what we're looking for**
We need to find an `x > 1` such that every frequency is divisible by `x`. This means `x` must be a common divisor of all frequencies.

**Step 3: Find possible x values**
The frequencies are 2, 4, and 2. Their divisors are:

- 2: divisors {1, 2}
- 4: divisors {1, 2, 4}
- 2: divisors {1, 2}

The common divisors are {1, 2}. Since `x > 1`, we check if 2 works:

- 2 ÷ 2 = 1 group of 2 cards ✓
- 4 ÷ 2 = 2 groups of 2 cards ✓
- 2 ÷ 2 = 1 group of 2 cards ✓

All frequencies are divisible by 2, so `x = 2` works! We can create:

- Two groups: [1, 1] and [3, 3]
- Two groups: [2, 2] and [2, 2]

**Counter-example**: `deck = [1, 1, 1, 2, 2, 2, 3, 3]`
Frequencies: 3, 3, 2
Common divisors of {3, 3, 2} are {1}
No `x > 1` divides all frequencies, so we return false.

## Brute Force Approach

A naive approach would be to try every possible `x` from 2 up to the minimum frequency:

1. Count frequencies of each card value
2. For each `x` from 2 to `min(frequency)`, check if all frequencies are divisible by `x`
3. Return true if any `x` works

This approach is inefficient because:

- We might check many `x` values unnecessarily
- The worst-case time complexity is O(n × min_freq) where n is the number of unique cards
- For a deck like `[1, 1, 1, 1, 1, 1, 1, 1]` (eight 1's), we'd check x = 2, 3, 4, 5, 6, 7, 8 even though we could determine the answer more efficiently

The key insight is that we don't need to check every `x`—we just need to check if the _greatest common divisor (GCD)_ of all frequencies is greater than 1.

## Optimal Solution

The optimal solution uses number theory: if the greatest common divisor (GCD) of all frequency counts is greater than 1, then we can partition the deck. Here's why:

1. Let `g` be the GCD of all frequencies
2. If `g > 1`, then every frequency is divisible by `g`
3. We can split each card value into groups of size `g`
4. Since `g > 1`, this satisfies the condition

If `g = 1`, no number greater than 1 divides all frequencies, so partitioning is impossible.

<div class="code-group">

```python
# Time: O(n log m) where n is deck length, m is max frequency
# Space: O(n) for the frequency dictionary
def hasGroupsSizeX(deck):
    """
    Determine if deck can be partitioned into groups of size x > 1
    where all cards in a group have the same value.
    """
    from math import gcd
    from collections import Counter

    # Step 1: Count frequency of each card value
    # Counter creates a dictionary: {card_value: count}
    freq = Counter(deck)

    # Step 2: Initialize GCD with the first frequency
    # We'll iterate through all frequencies to compute overall GCD
    current_gcd = 0

    # Step 3: Compute GCD of all frequencies
    # GCD(0, a) = a, so starting with 0 works correctly
    for count in freq.values():
        current_gcd = gcd(current_gcd, count)

    # Step 4: Check if GCD > 1
    # If GCD > 1, we can partition into groups of size GCD
    # If GCD == 1, no x > 1 divides all frequencies
    return current_gcd > 1
```

```javascript
// Time: O(n log m) where n is deck length, m is max frequency
// Space: O(n) for the frequency map
function hasGroupsSizeX(deck) {
  /**
   * Determine if deck can be partitioned into groups of size x > 1
   * where all cards in a group have the same value.
   */

  // Helper function to compute GCD using Euclidean algorithm
  function gcd(a, b) {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Step 1: Count frequency of each card value
  const freq = new Map();
  for (const card of deck) {
    freq.set(card, (freq.get(card) || 0) + 1);
  }

  // Step 2: Initialize GCD with 0 (gcd(0, a) = a)
  let currentGcd = 0;

  // Step 3: Compute GCD of all frequencies
  for (const count of freq.values()) {
    currentGcd = gcd(currentGcd, count);
  }

  // Step 4: Check if GCD > 1
  return currentGcd > 1;
}
```

```java
// Time: O(n log m) where n is deck length, m is max frequency
// Space: O(n) for the frequency map
import java.util.*;

class Solution {
    public boolean hasGroupsSizeX(int[] deck) {
        /**
         * Determine if deck can be partitioned into groups of size x > 1
         * where all cards in a group have the same value.
         */

        // Step 1: Count frequency of each card value
        Map<Integer, Integer> freq = new HashMap<>();
        for (int card : deck) {
            freq.put(card, freq.getOrDefault(card, 0) + 1);
        }

        // Step 2: Initialize GCD with 0 (gcd(0, a) = a)
        int currentGcd = 0;

        // Step 3: Compute GCD of all frequencies
        for (int count : freq.values()) {
            currentGcd = gcd(currentGcd, count);
        }

        // Step 4: Check if GCD > 1
        return currentGcd > 1;
    }

    // Helper method to compute GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log m)**

- `n`: length of the deck
- `m`: maximum frequency count

Breaking it down:

1. Counting frequencies: O(n) to iterate through the deck once
2. Computing GCD of all frequencies: O(k log m) where k is the number of unique cards and m is the maximum frequency. Each GCD operation takes O(log min(a,b)) time using the Euclidean algorithm.
3. In worst case, k could be O(n) if all cards are unique, making it O(n log m)

**Space Complexity: O(n)**

- We need to store frequency counts for each unique card value
- In worst case, all cards are unique, so we need O(n) space

## Common Mistakes

1. **Checking only the minimum frequency**: Some candidates think if all frequencies are divisible by the minimum frequency, it should work. Counterexample: `[1,1,1,2,2,2,3,3]` has min frequency = 2, but frequency 3 is not divisible by 2.

2. **Forgetting x > 1**: The problem explicitly states x > 1, so GCD = 1 means false. Some candidates return true when GCD = 1, thinking "groups of size 1" would work.

3. **Incorrect GCD initialization**: Starting GCD computation with 1 instead of 0. Since gcd(1, a) = 1 for any a, this would always give GCD = 1, leading to incorrect false results. We need gcd(0, a) = a to properly accumulate the GCD.

4. **Not handling small decks**: For a deck with 1 card, we should return false (can't make groups of size > 1). Our solution handles this because with 1 card, we have one frequency = 1, GCD = 1, so returns false.

## When You'll See This Pattern

This GCD pattern appears in problems involving:

1. **Partitioning with divisibility constraints** - When you need to split items into equal groups
2. **Finding common divisors across multiple counts** - When operations must be applied uniformly

Related LeetCode problems:

- **1497. Check If Array Pairs Are Divisible by k**: Similar divisibility checking, but with pairs instead of groups
- **1010. Pairs of Songs With Total Durations Divisible by 60**: Uses modulus and counting, though with different grouping logic
- **365. Water and Jug Problem**: Uses GCD to determine if a target volume is achievable

## Key Takeaways

1. **When you need to check if multiple counts can be divided into equal groups, think GCD**. If the GCD of all counts is g, you can make groups of size g (or any divisor of g).

2. **GCD properties are powerful**:
   - gcd(a, b, c) = gcd(gcd(a, b), c)
   - gcd(0, a) = a (useful for initialization)
   - If gcd of all numbers > 1, they share a common divisor > 1

3. **Counting frequencies is often the first step** in problems about grouping identical items. Always reach for a hash map/dictionary when you need to count occurrences.

[Practice this problem on CodeJeet](/problem/x-of-a-kind-in-a-deck-of-cards)
