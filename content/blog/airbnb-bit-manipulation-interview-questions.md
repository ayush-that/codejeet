---
title: "Bit Manipulation Questions at Airbnb: What to Expect"
description: "Prepare for Bit Manipulation interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2029-01-05"
category: "dsa-patterns"
tags: ["airbnb", "bit-manipulation", "interview prep"]
---

Bit Manipulation questions appear in about 9% of Airbnb’s technical interview problems. While not the most frequent category, they test a candidate’s comfort with low-level operations, efficient logic, and pattern recognition—skills relevant to optimizing performance-critical systems like search, pricing, or availability engines. Mastering these questions signals you can think in terms of memory and computational efficiency.

## What to Expect — Types of Problems

Airbnb’s bit manipulation problems typically fall into three categories:

1.  **Single Number Variations:** The classic “find the element that appears once while others appear twice (or k times).” This tests knowledge of XOR properties.
2.  **Bit Counting & Properties:** Problems involving counting set bits (Hamming weight), checking power-of-two status, or manipulating specific bits within integers.
3.  **Bitmask Applications:** Using integers as compact representations of sets or states, often in problems related to subsets, permutations, or state caching (e.g., in dynamic programming or backtracking). These are the most advanced and Airbnb-relevant, as they model complex state efficiently.

You are unlikely to encounter obscure bit tricks. The focus is on practical application of core operations: AND (`&`), OR (`|`), XOR (`^`), NOT (`~`), and shifts (`<<`, `>>`).

## How to Prepare — Study Tips with One Code Example

Start by solidifying your understanding of the fundamental operators and their properties. The most critical is XOR: `a ^ a = 0`, `a ^ 0 = a`, and it’s commutative/associative. Practice converting decimal numbers to binary and back manually.

A key pattern is using `n & (n-1)`. This operation drops the lowest set bit. Its primary applications are:

- **Checking if a number is a power of two:** A power of two has exactly one `1` bit. `n & (n-1)` will be `0`.
- **Counting the number of `1` bits (Hamming weight):** Repeatedly apply `n = n & (n-1)` until `n` becomes `0`, counting each iteration.

<div class="code-group">

```python
def count_bits(n):
    count = 0
    while n:
        n &= (n - 1)  # Drop the lowest set bit
        count += 1
    return count

def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
```

```javascript
function countBits(n) {
  let count = 0;
  while (n) {
    n &= n - 1; // Drop the lowest set bit
    count++;
  }
  return count;
}

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
```

```java
public class BitUtils {
    public int countBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1); // Drop the lowest set bit
            count++;
        }
        return count;
    }

    public boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  **Fundamentals:** Learn operators and practice basic tricks (checking odd/even, getting/toggling/setting a bit).
2.  **Core Patterns:** Solve “Single Number” and “Number of 1 Bits” problems. Master the `n & (n-1)` trick.
3.  **Subsets & Bitmasks:** Tackle problems that use bitmasks to generate subsets or represent states (e.g., “Subsets,” “Maximum Product of Word Lengths”).
4.  **Airbnb-Specific:** Finally, practice the actual problems from Airbnb’s question list to understand their particular style and difficulty level.

[Practice Bit Manipulation at Airbnb](/company/airbnb/bit-manipulation)
