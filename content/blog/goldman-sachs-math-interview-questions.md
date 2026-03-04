---
title: "Math Questions at Goldman Sachs: What to Expect"
description: "Prepare for Math interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-08-02"
category: "dsa-patterns"
tags: ["goldman-sachs", "math", "interview prep"]
---

Math matters at Goldman Sachs because the firm operates at the intersection of finance and technology, where quantitative precision is non-negotiable. Whether modeling risk, developing trading algorithms, or optimizing complex systems, the ability to reason logically through numerical and statistical problems is fundamental. The 39 math questions in their assessment aren't about advanced calculus; they test the analytical sharpness, pattern recognition, and computational thinking required to solve real-world financial and technical problems efficiently. Strong performance here signals you can handle the quantitative rigor of the role.

## What to Expect — Types of Problems

The math section typically focuses on mental calculations, probability, statistics, and basic combinatorics. You won't need a calculator. Expect questions like:

- **Probability & Statistics:** Coin flips, dice rolls, card draws, expected value, and conditional probability.
- **Mental Arithmetic:** Quick percentage calculations, profit/loss, and rate problems.
- **Sequences & Patterns:** Identifying the next number in a series or the missing element.
- **Logical Word Problems:** Puzzles involving ratios, averages, or time/work scenarios.
- **Basic Combinatorics:** Counting principles, permutations, and combinations in simple contexts.

These problems assess speed, accuracy, and the ability to apply fundamental concepts under time pressure.

## How to Prepare — Study Tips with One Code Example

Brush up on high-school level probability, permutations, and basic statistics. Practice mental math daily—calculate tips, discounts, or percentages in your head. For pattern problems, work on sequence recognition (arithmetic, geometric, alternating). Most importantly, practice under timed conditions to simulate the test environment.

A common pattern is calculating the number of ways to choose or arrange items. For example, "In how many ways can you choose 2 analysts from a group of 5?" This is a combination problem (order doesn't matter). Understanding and implementing this formula is key.

<div class="code-group">

```python
def n_choose_k(n, k):
    # Calculate combinations: n! / (k! * (n-k)!)
    if k > n:
        return 0
    # Compute using multiplicative formula to avoid large factorials
    result = 1
    for i in range(1, k + 1):
        result = result * (n - k + i) // i
    return result

# Example: Choose 2 from 5
print(n_choose_k(5, 2))  # Output: 10
```

```javascript
function nChooseK(n, k) {
  // Calculate combinations: n! / (k! * (n-k)!)
  if (k > n) return 0;
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - k + i)) / i;
  }
  return Math.round(result); // Division yields integer here
}

// Example: Choose 2 from 5
console.log(nChooseK(5, 2)); // Output: 10
```

```java
public class Combinations {
    public static int nChooseK(int n, int k) {
        // Calculate combinations: n! / (k! * (n-k)!)
        if (k > n) return 0;
        int result = 1;
        for (int i = 1; i <= k; i++) {
            result = result * (n - k + i) / i;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(nChooseK(5, 2)); // Output: 10
    }
}
```

</div>

## Recommended Practice Order

1. **Master Fundamentals:** Review probability rules, permutations/combinations formulas, and basic statistics (mean, median, mode).
2. **Speed Drills:** Practice mental arithmetic daily without a calculator.
3. **Pattern Recognition:** Solve sequence and series problems to identify common progressions quickly.
4. **Apply to Word Problems:** Translate financial or logical scenarios into mathematical equations.
5. **Timed Practice:** Simulate the actual test conditions with full problem sets.

Focus on accuracy first, then build speed. Consistent, targeted practice is more effective than cramming.

[Practice Math at Goldman Sachs](/company/goldman-sachs/math)
