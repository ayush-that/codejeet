---
title: "Math Questions at Zomato: What to Expect"
description: "Prepare for Math interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-06"
category: "dsa-patterns"
tags: ["zomato", "math", "interview prep"]
---

## Why Math Matters at Zomato

If you're preparing for a Zomato interview and see that only 3 out of 29 questions are tagged as "Math," you might be tempted to deprioritize this category. That would be a mistake. While the raw count is low, Math questions at Zomato are strategic filters. This is a company built on logistics, recommendations, and marketplace dynamics—all domains where mathematical thinking is essential. In real interviews, these questions don't appear as often as arrays or strings, but when they do, they're often the deciding factor between a "hire" and a "strong hire." They test your ability to translate a real-world constraint (delivery radius, order batching, coupon distribution) into a clean, efficient algorithm. Think of them not as abstract number theory, but as _applied computational logic_.

## Specific Patterns Zomato Favors

Zomato's Math problems tend to cluster around a few practical, optimization-focused themes. You won't see many pure number theory puzzles. Instead, expect:

1.  **Modular Arithmetic and Cycle Detection:** Essential for problems involving circular buffers, round-robin scheduling (think delivery executive assignment), or repeating patterns. This is less about the modulo operator itself and more about using it to find cycles or states.
2.  **Combinatorics and Probability (Basic):** Questions about counting ways to arrange orders, assign promotions, or calculate probabilities under constraints. These are usually grounded in scenarios a product manager might actually propose.
3.  **Numerical Simulation / Iterative Computation:** Problems where a direct formula exists but deriving it on the spot is tough. They want to see if you can model the process step-by-step and then optimize the simulation. A classic example is **Happy Number (LeetCode #202)**, which combines digit square summation with cycle detection.
4.  **GCD/LCM and Multiples:** Used in problems about synchronizing events (e.g., two delivery promotions that repeat every X and Y days—when do they coincide?).

The overarching theme is **applied, iterative logic over deep, formulaic knowledge.** They prefer a candidate who can reason through a process and code it cleanly over one who memorizes combinatorics formulas but can't adapt them.

## How to Prepare

Your preparation should focus on recognizing the underlying _process_ in a word problem and mapping it to a computational loop or state machine. Let's look at the quintessential example: the Happy Number problem. It's perfect for Zomato because it involves a repetitive transformation (sum of squares of digits) and a termination condition (reaching 1 or detecting a loop)—analogous to many routing or state-change problems.

The key pattern is **Floyd's Cycle-Finding Algorithm (Tortoise and Hare)**. Instead of using a HashSet to store seen numbers (O(n) space), we can detect the cycle with O(1) space.

<div class="code-group">

```python
def is_happy(n: int) -> bool:
    """
    Determines if a number is "happy" using Floyd's cycle detection.
    A happy number eventually reaches 1 after repeatedly summing the squares of its digits.
    """
    def get_next(num):
        """Helper: calculates the sum of squares of digits."""
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    slow = n
    fast = get_next(n)

    # If fast reaches 1, it's happy. If slow meets fast in a cycle not at 1, it's not.
    while fast != 1 and slow != fast:
        slow = get_next(slow)       # Moves one step
        fast = get_next(get_next(fast))  # Moves two steps

    return fast == 1

# Time Complexity: O(log n) for the digit sum calculation per step,
# and the cycle detection runs in O(log n) steps. Overall ~O(log n).
# Space Complexity: O(1) - we only use a few integer variables.
```

```javascript
function isHappy(n) {
  const getNext = (num) => {
    let total = 0;
    while (num > 0) {
      const digit = num % 10;
      total += digit * digit;
      num = Math.floor(num / 10);
    }
    return total;
  };

  let slow = n;
  let fast = getNext(n);

  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }

  return fast === 1;
}

// Time Complexity: O(log n)
// Space Complexity: O(1)
```

```java
public boolean isHappy(int n) {
    // Helper method to compute sum of squares of digits
    int getNext(int num) {
        int total = 0;
        while (num > 0) {
            int digit = num % 10;
            total += digit * digit;
            num /= 10;
        }
        return total;
    }

    int slow = n;
    int fast = getNext(n);

    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }

    return fast == 1;
}

// Time Complexity: O(log n)
// Space Complexity: O(1)
```

</div>

Another common pattern is using **GCD to find the fundamental unit of repetition**. Consider a problem where you need to find when two repeating events sync up.

<div class="code-group">

```python
def find_sync_point(period_a, period_b, offset_a=0, offset_b=0):
    """
    Finds the first positive time where two events with given periods and offsets coincide.
    This uses the concept that they sync at time t where:
    (t - offset_a) % period_a == 0 and (t - offset_b) % period_b == 0.
    This is equivalent to solving (t ≡ offset_a mod period_a) and (t ≡ offset_b mod period_b).
    For the simple case where offsets are 0, they sync at LCM(period_a, period_b).
    """
    # For offset = 0 case:
    import math
    lcm = abs(period_a * period_b) // math.gcd(period_a, period_b)
    return lcm

# Time Complexity: O(log(min(a, b))) for GCD calculation.
# Space Complexity: O(1)
```

```javascript
function findSyncPoint(periodA, periodB, offsetA = 0, offsetB = 0) {
  // Helper for GCD
  const gcd = (x, y) => {
    while (y !== 0) {
      [x, y] = [y, x % y];
    }
    return x;
  };
  // For offset = 0 case
  const lcm = Math.abs(periodA * periodB) / gcd(periodA, periodB);
  return lcm;
}

// Time Complexity: O(log(min(a, b)))
// Space Complexity: O(1)
```

```java
public int findSyncPoint(int periodA, int periodB) {
    // Helper method for GCD
    int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    // For offset = 0 case
    int lcm = Math.abs(periodA * periodB) / gcd(periodA, periodB);
    return lcm;
}

// Time Complexity: O(log(min(a, b)))
// Space Complexity: O(1)
```

</div>

## How Zomato Tests Math vs Other Companies

Compared to other companies, Zomato's Math questions have a distinct flavor:

- **vs. FAANG (Meta, Google):** FAANG questions are often more abstract, leaning toward pure number theory (e.g., "Count Primes" Sieve of Eratosthenes) or complex combinatorics. Zomato's are more narrative-driven, embedded in a business scenario.
- **vs. FinTech (Stripe, PayPal):** FinTech focuses heavily on precision, numerical stability, and advanced probability/statistics. Zomato's problems are conceptually simpler but test clean, bug-free implementation of a process.
- **The Zomato Difference:** The unique aspect is the **"simulation first, optimize later"** expectation. Interviewers often want to see you model the described process literally in code. If you jump too quickly to an optimized mathematical formula without demonstrating you understand the underlying mechanics, you might lose points. They value clarity of thought over cleverness.

## Study Order

Tackle these sub-topics in this order to build a logical progression:

1.  **Basic Number Manipulation:** Practice extracting digits, reversing integers, and basic modulo operations. This is the foundation for almost everything else. (Problems: LeetCode #7 Reverse Integer, #9 Palindrome Number).
2.  **Modular Arithmetic & Cycle Detection:** Learn to identify when a problem describes a cyclic process. Master the fast/slow pointer pattern for cycle detection in O(1) space. (Problem: LeetCode #202 Happy Number).
3.  **GCD, LCM, and Multiples:** Understand how to find the greatest common divisor and least common multiple. This is key for any "synchronization" or "repetition" problem. (Problem: LeetCode #1071 Greatest Common Divisor of Strings).
4.  **Simple Combinatorics (Permutations & Combinations):** Focus on the _reasoning_ behind the count (e.g., using DFS to generate permutations) rather than memorizing nCr formulas. (Problem: LeetCode #77 Combinations).
5.  **Numerical Simulation:** Practice problems where you explicitly model steps. Learn to identify when a simulation can be optimized with a mathematical insight (like detecting a cycle) versus when you must run it. (Problem: LeetCode #258 Add Digits).

## Recommended Practice Order

Solve these problems in sequence. Each builds on concepts from the previous one, mirroring a likely interview progression:

1.  **LeetCode #202 Happy Number:** The perfect starter. It combines digit manipulation, cycle detection, and optimization.
2.  **LeetCode #367 Valid Perfect Square:** Tests your understanding of numerical properties and efficient search (binary search on numbers).
3.  **LeetCode #780 Reaching Points:** A more advanced problem involving GCD and modulo operations to work backwards—excellent for testing mathematical insight.
4.  **LeetCode #1492 The kth Factor of n:** Combines enumeration with understanding of factors and efficient iteration (up to sqrt(n)).
5.  **LeetCode #1015 Smallest Integer Divisible by K:** A superb Zomato-style problem. It's about finding a cycle in remainders using modular arithmetic, directly applicable to many scheduling scenarios.

This sequence moves from direct implementation, to applying number theory, to solving a complex problem with mathematical reduction—exactly the skill progression Zomato interviewers look for.

[Practice Math at Zomato](/company/zomato/math)
