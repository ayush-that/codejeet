---
title: "Math Questions at Twitter: What to Expect"
description: "Prepare for Math interview questions at Twitter — patterns, difficulty breakdown, and study tips."
date: "2029-08-01"
category: "dsa-patterns"
tags: ["twitter", "math", "interview prep"]
---

Math questions appear in roughly 13% of Twitter's technical interview problems. While this may seem low, these problems often test fundamental analytical skills crucial for optimizing systems at scale, analyzing metrics, designing algorithms, and implementing features involving probability or logic. Success here demonstrates a capacity for precise, efficient thinking—a key trait for engineers working on a platform serving hundreds of millions of users.

## What to Expect — Types of Problems

Twitter's math-focused questions typically fall into a few core categories. You will not encounter advanced calculus; instead, expect problems rooted in computer science fundamentals.

- **Number Theory & Bit Manipulation:** Problems involving properties of integers, prime numbers, or direct operations on bits (e.g., counting set bits, finding the single number in a duplicate array). These test low-level optimization skills.
- **Probability & Combinatorics:** Questions about calculating odds, expected values, or counting arrangements. These might relate to designing fair systems or estimating metrics.
- **Modular Arithmetic & Sequences:** Problems involving cycles, repeating patterns, or operations within a fixed modulus (like clock arithmetic). These are common in scheduling or state-machine logic.
- **Mathematical Modeling:** Applying simple formulas or logic to solve a word problem, often related to system design or feature logic (e.g., calculating tweet delivery rates or cache expiration times).

## How to Prepare — Study Tips with One Code Example

Focus on core principles, not rote memorization. Practice translating word problems into clean code. A key pattern is using the properties of numbers (like bitwise XOR) to find a unique element in a duplicate array—a classic number theory problem.

<div class="code-group">

```python
def single_number(nums):
    """
    Finds the single number in an array where every other element appears twice.
    Uses the property: a ^ a = 0 and a ^ 0 = a.
    """
    result = 0
    for num in nums:
        result ^= num  # XOR all numbers together
    return result

# Example: [4, 1, 2, 1, 2] -> 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4
```

```javascript
function singleNumber(nums) {
  /**
   * Finds the single number in an array where every other element appears twice.
   * Uses the property: a ^ a = 0 and a ^ 0 = a.
   */
  let result = 0;
  for (const num of nums) {
    result ^= num; // XOR all numbers together
  }
  return result;
}

// Example: [4, 1, 2, 1, 2] -> 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4
```

```java
public int singleNumber(int[] nums) {
    /**
     * Finds the single number in an array where every other element appears twice.
     * Uses the property: a ^ a = 0 and a ^ 0 = a.
     */
    int result = 0;
    for (int num : nums) {
        result ^= num; // XOR all numbers together
    }
    return result;
}

// Example: [4, 1, 2, 1, 2] -> 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4
```

</div>

## Recommended Practice Order

1.  **Bit Manipulation:** Start with fundamentals (AND, OR, XOR, shifts). Solve problems like "Number of 1 Bits" and "Missing Number."
2.  **Basic Number Theory:** Practice problems involving prime numbers, GCD/LCM, and modular arithmetic.
3.  **Probability & Combinatorics:** Work on simple counting problems and expected value calculations. Focus on the logic, not complex formulas.
4.  **Mathematical Word Problems:** Practice translating real-world scenarios into code. These often combine simple math with basic data structures.
5.  **Twitter-Specific Practice:** Finally, target the company's tagged problems to familiarize yourself with their style and frequently tested concepts.

[Practice Math at Twitter](/company/twitter/math)
