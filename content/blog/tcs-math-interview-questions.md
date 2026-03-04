---
title: "Math Questions at TCS: What to Expect"
description: "Prepare for Math interview questions at TCS — patterns, difficulty breakdown, and study tips."
date: "2027-09-11"
category: "dsa-patterns"
tags: ["tcs", "math", "interview prep"]
---

Math questions form a significant portion of the TCS aptitude test, accounting for 37 out of 217 total questions. This section is not just a hurdle; it's a critical filter. TCS uses these problems to assess your quantitative reasoning, logical thinking, and ability to perform under time pressure—skills directly transferable to the analytical problem-solving required in software development and consulting roles. A strong performance here demonstrates the numerical proficiency needed for tasks like data analysis, algorithm optimization, and system design.

## What to Expect — Types of Problems

The math section primarily tests fundamental concepts with a focus on speed and accuracy. You can expect a mix of the following problem types:

- **Arithmetic & Number Systems:** Problems on percentages, profit & loss, ratios, averages, and divisibility rules.
- **Algebra:** Linear equations, quadratic equations, and basic algebraic manipulations.
- **Speed, Time & Distance / Work:** Classic word problems involving relative speed, average speed, and work done by individuals or groups.
- **Permutations & Combinations / Probability:** Basic counting principles and simple probability calculations.
- **Geometry & Mensuration:** Area, volume, and perimeter calculations for standard shapes like squares, circles, and cubes.

The problems are typically designed to be solvable with quick mental math or one or two-step calculations, but the sheer volume makes time management essential.

## How to Prepare — Study Tips with One Code Example

Focus on mastering the basics rather than advanced mathematics. Relearn formulas for areas, percentages, and probability. Practice mental calculation tricks for squares, multiplications, and divisions. The key is to recognize problem patterns quickly.

For certain problem types, like finding the number of trailing zeros in a factorial or checking divisibility, understanding the underlying algorithmic pattern can be a huge advantage. Here is a code example for a common pattern: counting trailing zeros in `n!`. The count is determined by the number of times 10 is a factor, which is the minimum of counts of factors 2 and 5. Since factors of 5 are always fewer, we simply count the multiples of 5, 25, 125, etc.

<div class="code-group">

```python
def count_trailing_zeros_in_factorial(n):
    count = 0
    i = 5
    while n // i > 0:
        count += n // i
        i *= 5
    return count

# Example: 100!
print(count_trailing_zeros_in_factorial(100))  # Output: 24
```

```javascript
function countTrailingZerosInFactorial(n) {
  let count = 0;
  for (let i = 5; Math.floor(n / i) > 0; i *= 5) {
    count += Math.floor(n / i);
  }
  return count;
}

// Example: 100!
console.log(countTrailingZerosInFactorial(100)); // Output: 24
```

```java
public class TrailingZeros {
    public static int countTrailingZerosInFactorial(int n) {
        int count = 0;
        for (int i = 5; n / i > 0; i *= 5) {
            count += n / i;
        }
        return count;
    }
    // Example: 100!
    // System.out.println(countTrailingZerosInFactorial(100)); // Output: 24
}
```

</div>

## Recommended Practice Order

Start with the highest-yield topics. Begin your preparation with **Arithmetic (Percentages, Ratios, Averages)** and **Speed, Time & Distance/Work** problems, as these are most frequent. Next, move to **Algebra** and **Number Systems**. Then, tackle **Permutations & Combinations/Probability**. Finally, solidify **Geometry & Mensuration** formulas. Throughout this process, dedicate time to taking full, timed practice tests to build the stamina and pacing required for the actual exam.

[Practice Math at TCS](/company/tcs/math)
