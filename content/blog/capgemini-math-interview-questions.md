---
title: "Math Questions at Capgemini: What to Expect"
description: "Prepare for Math interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-04-28"
category: "dsa-patterns"
tags: ["capgemini", "math", "interview prep"]
---

Math questions appear in Capgemini's online assessment for a clear reason: they test logical reasoning, numerical ability, and problem-solving speed—core skills for consulting and technology roles. While the technical interview dives deep into coding and system design, the initial 36-question test (which includes 6 math problems) acts as a critical filter. Strong performance here demonstrates you can analyze data, interpret quantitative information, and think systematically under time pressure. It's not about advanced calculus; it's about applying fundamental arithmetic and logic to real-world business and technical scenarios.

## What to Expect — Types of Problems

The math section typically covers a few consistent categories. Expect questions on:

- **Percentages, Profit & Loss:** Calculating discounts, cost price, selling price, and profit percentages.
- **Ratios & Proportions:** Dividing quantities, mixing ratios, or solving problems involving direct/inverse proportion.
- **Time, Speed & Distance/Work:** Classic problems like relative speed, average speed, or work done by individuals and groups over time.
- **Number Systems & Basic Algebra:** Problems on divisibility, remainders, simple equations, or finding numbers based on given conditions.
- **Averages & Mixtures:** Calculating weighted averages or determining the ratio of components in a mixture (like two liquids).

The problems are designed to be solvable within a minute or two. The challenge lies in identifying the correct approach quickly and avoiding calculation errors.

## How to Prepare — Study Tips with One Code Example

Focus on conceptual clarity over rote memorization. Re-learn the core formulas for the categories above. Then, practice mental math and approximation—you often don't need an exact calculation to eliminate wrong answers. Most importantly, recognize the underlying pattern. Many word problems are variations of the same core algorithm.

For example, a common pattern is the **"Work" problem**: If Person A can complete a task in `x` hours, and Person B in `y` hours, how long will it take them together? The pattern is to find the work rate per hour (`1/x` and `1/y`), sum them to get the combined rate, then find the reciprocal for the total time.

<div class="code-group">

```python
def time_together(time_a, time_b):
    # rate = work / time, assuming work = 1
    rate_a = 1 / time_a
    rate_b = 1 / time_b
    combined_rate = rate_a + rate_b
    time_together = 1 / combined_rate
    return time_together

# Example: A takes 6 hours, B takes 3 hours
print(time_together(6, 3))  # Output: 2.0 hours
```

```javascript
function timeTogether(timeA, timeB) {
  const rateA = 1 / timeA;
  const rateB = 1 / timeB;
  const combinedRate = rateA + rateB;
  const timeTogether = 1 / combinedRate;
  return timeTogether;
}

// Example: A takes 6 hours, B takes 3 hours
console.log(timeTogether(6, 3)); // Output: 2
```

```java
public class WorkProblem {
    public static double timeTogether(double timeA, double timeB) {
        double rateA = 1.0 / timeA;
        double rateB = 1.0 / timeB;
        double combinedRate = rateA + rateB;
        double timeTogether = 1.0 / combinedRate;
        return timeTogether;
    }

    public static void main(String[] args) {
        // Example: A takes 6 hours, B takes 3 hours
        System.out.println(timeTogether(6, 3)); // Output: 2.0
    }
}
```

</div>

## Recommended Practice Order

1.  **Review Fundamentals:** Spend an hour refreshing core concepts (percentages, ratios, rates). Write down key formulas.
2.  **Pattern Recognition:** Solve 20-30 mixed problems. Your goal is not just to get the answer, but to label each problem's type (e.g., "this is a profit percentage problem").
3.  **Timed Drills:** Practice sets of 6 questions with a strict 10-12 minute limit to simulate the actual test pressure.
4.  **Analyze Mistakes:** For every error, identify if it was a conceptual gap, a misread, or a calculation slip. Fix the root cause.

[Practice Math at Capgemini](/company/capgemini/math)
