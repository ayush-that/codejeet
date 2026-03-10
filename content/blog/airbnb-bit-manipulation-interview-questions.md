---
title: "Bit Manipulation Questions at Airbnb: What to Expect"
description: "Prepare for Bit Manipulation interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2028-12-28"
category: "dsa-patterns"
tags: ["airbnb", "bit-manipulation", "interview prep"]
---

When you're preparing for Airbnb interviews, you'll notice a curious statistic: out of their 64 tagged problems on LeetCode, 6 are categorized under Bit Manipulation. That's nearly 10% of their public problem set. This isn't a coincidence or a fluke. While not as dominant as array or string questions, bit manipulation at Airbnb is a deliberate, secondary focus area that serves as a reliable filter. It doesn't appear in every interview loop, but when it does, it's often in the first technical phone screen. The goal isn't to test obscure tricks, but to assess a candidate's comfort with low-level operations, logical thinking, and the ability to optimize for space—a critical concern for a platform handling global listings and bookings. If you can't reason about bits, you might struggle with problems involving compact state representation, which is a real-world scenario for feature flags or permission systems.

## Specific Patterns Airbnb Favors

Airbnb's bit manipulation problems tend to cluster around two practical themes: **state representation** and **mathematical properties**. You won't often find esoteric bit puzzles. Instead, they favor problems where bits elegantly represent a set, a visited state, or a unique identifier.

A prime example is **using bits as a compact boolean array**. This is the core of problems like checking if all characters in a string are unique without extra data structures, or tracking which numbers have appeared. The bitmask becomes a lightweight `Set<Integer>`.

Another favored pattern is the **mathematical trick using XOR**. Airbnb has problems that lean on XOR's magical property: `a ^ a = 0` and `a ^ 0 = a`. This is perfect for finding a single unique element among duplicates, or for problems involving toggling states.

You'll also see **bit counting** (population count) appear, not as an end in itself, but as a step in a larger algorithm, often related to optimization or game theory (like the "Nim Game" variant).

Let's look at the core pattern for using an integer as a bitmask to track seen elements or states. This is the foundation for several Airbnb problems.

<div class="code-group">

```python
# Using an integer as a bitmask to check for duplicate characters.
# This is the essence of problems like "Determine if a string has all unique characters".
# Time: O(n) | Space: O(1) - uses a single integer instead of a hash set.
def is_unique(s: str) -> bool:
    checker = 0  # Our 32-bit bitmask (assuming lowercase a-z only)
    for char in s:
        # Calculate the bit position for this character.
        # For 'a', val = 0; for 'b', val = 1, etc.
        val = ord(char) - ord('a')
        # If the bit at position 'val' is already set to 1, we found a duplicate.
        if (checker & (1 << val)) > 0:
            return False
        # Set the bit at position 'val' to 1.
        checker |= (1 << val)
    return True
```

```javascript
// Using an integer as a bitmask to check for duplicate characters.
// Time: O(n) | Space: O(1)
function isUnique(s) {
  let checker = 0;
  for (let i = 0; i < s.length; i++) {
    const val = s.charCodeAt(i) - "a".charCodeAt(0);
    if ((checker & (1 << val)) > 0) {
      return false;
    }
    checker |= 1 << val;
  }
  return true;
}
```

```java
// Using an integer as a bitmask to check for duplicate characters.
// Time: O(n) | Space: O(1)
public boolean isUnique(String s) {
    int checker = 0;
    for (int i = 0; i < s.length(); i++) {
        int val = s.charAt(i) - 'a';
        if ((checker & (1 << val)) > 0) {
            return false;
        }
        checker |= (1 << val);
    }
    return true;
}
```

</div>

## How to Prepare

Your preparation should be conceptual, not just memorization. Start by internalizing the core bitwise operators: AND (`&`), OR (`|`), XOR (`^`), NOT (`~`), and shifts (`<<`, `>>`). Understand that `1 << n` creates a mask with a `1` at the _n_-th bit (zero-indexed from the right).

When you see a problem involving a small set of possible states (like the 26 lowercase letters, days of the week, or a small grid of cells), immediately consider if a bitmask integer can replace a hash set or boolean array. The space optimization is dramatic—from O(n) to O(1).

For the XOR pattern, remember it's commutative and associative. The classic "find the single number" problem (LeetCode #136) is the purest form. Practice deriving the property that XOR-ing all numbers cancels out pairs, leaving the unique one.

<div class="code-group">

```python
# The fundamental XOR pattern to find a unique element among duplicates.
# This solves LeetCode #136 "Single Number".
# Time: O(n) | Space: O(1)
def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num  # XOR all numbers together
    return result
    # Why it works: a ^ a = 0, and 0 ^ b = b.
    # All paired numbers cancel to 0, leaving the single number.
```

```javascript
// The fundamental XOR pattern to find a unique element among duplicates.
// Time: O(n) | Space: O(1)
function singleNumber(nums) {
  return nums.reduce((acc, num) => acc ^ num, 0);
}
```

```java
// The fundamental XOR pattern to find a unique element among duplicates.
// Time: O(n) | Space: O(1)
public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}
```

</div>

## How Airbnb Tests Bit Manipulation vs Other Companies

Compared to other major tech companies, Airbnb's bit manipulation questions are more _applied_ and less _theoretical_. At companies like Google or Facebook (Meta), you might encounter bit manipulation deeply embedded within a complex graph or systems problem (e.g., representing adjacency matrices or designing a bitset class). The difficulty is in the integration.

At Airbnb, the bit manipulation problem is often the _main event_ in a 45-minute interview, but its application is straightforward. The interviewer wants to see if you recognize the pattern cleanly and implement it without bugs. The unique aspect is their tendency to frame it within a domain-specific scenario, like checking guest ID uniqueness or managing listing availability flags, even if the underlying problem is a known LeetCode question. The expectation is a flawless, optimal solution. There's less tolerance for brute-force approaches because the optimal bit solution is usually short and elegant.

## Study Order

1.  **Master the Operators and Binary Basics:** You must be able to convert decimal to binary in your head for small numbers (0-31). Know what `1 << 5` equals (32) and what `29 & (1 << 4)` checks.
2.  **Learn the Bitmask-as-Set Pattern:** This is the most common building block. Practice setting, clearing, checking, and toggling bits. This directly enables solutions for problems like checking unique characters or generating power sets.
3.  **Internalize XOR Properties:** Understand why XOR is used for finding the unique element, for toggling, and even for basic encryption. This pattern often provides the "aha!" moment.
4.  **Study Bit Counting (Popcount):** Learn the standard algorithm (`n & (n-1)` to clear the lowest set bit) to count how many `1`s are in a binary representation. This is useful for problems involving optimization or game states.
5.  **Tackle Multi-State Masks:** Learn to manage more than one piece of information per bit position. Sometimes you'll use two integers (like `seen_once` and `seen_twice`) to track states for a problem like "Single Number II" (LeetCode #137).

## Recommended Practice Order

Solve these problems in sequence to build competence:

1.  **LeetCode #136 (Single Number):** The pure XOR warm-up.
2.  **LeetCode #191 (Number of 1 Bits):** Master the `n & (n-1)` trick for popcount.
3.  **LeetCode #268 (Missing Number):** Can be solved elegantly with XOR (xor all indices and values).
4.  **LeetCode #78 (Subsets):** Use bitmask iteration to generate all subsets. This cements the "bitmask as representation" concept.
5.  **LeetCode #137 (Single Number II):** A significant step up. Requires reasoning about state machines or using two bitmasks. This is close to the upper bound of difficulty you might see at Airbnb.
6.  **LeetCode #201 (Bitwise AND of Numbers Range):** Tests your understanding of bit shifts and common prefix patterns, which is a different but valuable angle.

By following this progression, you move from recognizing a single trick to synthesizing bit operations to manage complex states. When your Airbnb interviewer presents a bit problem, you'll be ready to discuss the trade-offs and implement the optimal solution with confidence.

[Practice Bit Manipulation at Airbnb](/company/airbnb/bit-manipulation)
