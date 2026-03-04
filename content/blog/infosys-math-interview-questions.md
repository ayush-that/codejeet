---
title: "Math Questions at Infosys: What to Expect"
description: "Prepare for Math interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-14"
category: "dsa-patterns"
tags: ["infosys", "math", "interview prep"]
---

Math matters at Infosys because the company’s core business—consulting, technology, and outsourcing—relies on logical problem-solving, data analysis, and algorithmic thinking. The 31 math questions in their 158-question assessment aren't about advanced calculus; they test your quantitative aptitude, numerical reasoning, and ability to apply basic mathematical concepts under time pressure. Strong performance here demonstrates analytical rigor, a skill critical for roles in software development, data engineering, and process optimization. Think of it as a filter for structured thinking.

## What to Expect — Types of Problems

The math section typically includes problems from these categories:

- **Number Systems & Arithmetic:** Work with divisibility, remainders, HCF/LCM, decimals, fractions, and percentages. Questions often involve finding the greatest number that divides several numbers, or the smallest number divisible by a set.
- **Algebra & Equations:** Solve linear equations, word problems involving ages, ratios, and proportions. You might need to set up equations from descriptive scenarios.
- **Speed, Time, & Distance / Work:** Classic problems like calculating relative speed, average speed, or how long multiple people take to complete a task together.
- **Profit & Loss / Simple & Compound Interest:** Calculate cost price, selling price, percentage profit/loss, or interest accrued over time.
- **Permutations & Combinations / Probability:** Basic counting problems, such as arranging items or selecting teams, and calculating simple probabilities.

The problems are designed to be solved quickly with clear steps, not complex derivations.

## How to Prepare — Study Tips with One Code Example

Focus on understanding concepts, not rote memorization. Practice mental math to improve speed. For word problems, learn to quickly translate the text into mathematical expressions or equations.

A key pattern in many problems (like work, pipes filling tanks, or rates) is the concept of **combined rate**. The formula is often: `1/(combined time) = 1/time_A + 1/time_B + ...`.

Here’s how you might implement a solution for a common "time to complete work together" problem:

<div class="code-group">

```python
def time_together(individual_times):
    """
    Calculate the time taken to complete a task when working together.
    individual_times: List of times (as floats) each person takes alone.
    Returns the combined time.
    """
    combined_rate = sum(1 / t for t in individual_times)
    return 1 / combined_rate if combined_rate != 0 else float('inf')

# Example: A takes 6 hours, B takes 3 hours
print(f"Time together: {time_together([6, 3]):.2f} hours") # Output: 2.00 hours
```

```javascript
function timeTogether(individualTimes) {
  /**
   * Calculate the time taken to complete a task when working together.
   * individualTimes: Array of times (as numbers) each person takes alone.
   * Returns the combined time.
   */
  const combinedRate = individualTimes.reduce((sum, t) => sum + 1 / t, 0);
  return combinedRate !== 0 ? 1 / combinedRate : Infinity;
}

// Example: A takes 6 hours, B takes 3 hours
console.log(`Time together: ${timeTogether([6, 3]).toFixed(2)} hours`); // Output: 2.00 hours
```

```java
public class WorkProblem {
    public static double timeTogether(double[] individualTimes) {
        /**
         * Calculate the time taken to complete a task when working together.
         * individualTimes: Array of times (as doubles) each person takes alone.
         * Returns the combined time.
         */
        double combinedRate = 0;
        for (double t : individualTimes) {
            combinedRate += 1 / t;
        }
        return combinedRate != 0 ? 1 / combinedRate : Double.POSITIVE_INFINITY;
    }

    public static void main(String[] args) {
        // Example: A takes 6 hours, B takes 3 hours
        double[] times = {6, 3};
        System.out.printf("Time together: %.2f hours%n", timeTogether(times)); // Output: 2.00 hours
    }
}
```

</div>

## Recommended Practice Order

1.  **Foundation First:** Solidify your basics in percentages, ratios, and averages. These concepts underpin many other problem types.
2.  **Core Problem Types:** Move to Speed-Time-Distance and Work problems. Practice until you can set up the equation from the problem statement quickly.
3.  **Number Systems:** Practice HCF/LCM and remainder problems, as they are common.
4.  **Algebra & Word Problems:** Hone your skill in converting text to equations.
5.  **Permutations & Probability:** Tackle these last if your test is known to include them, ensuring you understand the fundamental counting principles.
6.  **Timed Practice:** Finally, take full, timed practice sets to build speed and accuracy under pressure.

[Practice Math at Infosys](/company/infosys/math)
