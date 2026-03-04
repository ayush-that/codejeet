---
title: "Math Questions at Deloitte: What to Expect"
description: "Prepare for Math interview questions at Deloitte — patterns, difficulty breakdown, and study tips."
date: "2030-03-27"
category: "dsa-patterns"
tags: ["deloitte", "math", "interview prep"]
---

Math questions at Deloitte aren't about advanced calculus. They test your quantitative reasoning, data interpretation, and logical problem-solving—core skills for a consultant who must analyze client data, build business cases, and spot trends quickly. The 6 math questions (out of 38 total) assess your ability to work accurately under time pressure, a direct reflection of real project work. Failing here suggests you might struggle with the numerical rigor the job demands.

## What to Expect — Types of Problems

The math section is multiple-choice and typically covers three areas:

1.  **Basic Arithmetic & Percentages:** Profit/loss calculations, percentage change, discount applications, and simple interest. Example: "If revenue was $1.2M last year and grew by 15%, what is the new revenue?"
2.  **Ratios, Proportions & Averages:** Problems about mixing, splitting costs, or finding average rates. Example: "The ratio of consultants to analysts on a team is 3:2. If there are 15 consultants, how many people are on the team total?"
3.  **Data Interpretation:** You'll be given a table, chart, or graph (like a bar chart showing monthly sales) and asked 1-2 questions based on it. This tests your ability to extract and compute values from visual data.

The difficulty is not high-school math, but the time constraint is the real challenge. You have roughly 1-2 minutes per question.

## How to Prepare — Study Tips with One Code Example

Brush up on mental math. Practice calculating percentages (e.g., 15% of 80) and fractional conversions (e.g., 3/5 as a percentage) without a calculator. For data interpretation, skim business charts in articles to practice quick reading.

A common underlying pattern is the **"two-variable relationship"** problem, often solvable with a simple equation or ratio setup. Automating the setup in your mind is key. Here’s a generic code pattern for such problems:

<div class="code-group">

```python
def solve_ratio_problem(ratio_a, ratio_b, known_value, known_part):
    """
    Solves: If A:B = ratio_a:ratio_b, and you know the value of one part,
    find the total or the other part.
    known_part: 'A' or 'B'
    """
    total_ratio = ratio_a + ratio_b
    if known_part == 'A':
        a_value = known_value
        unit_value = a_value / ratio_a
        b_value = unit_value * ratio_b
    else:  # known_part == 'B'
        b_value = known_value
        unit_value = b_value / ratio_b
        a_value = unit_value * ratio_a

    total = a_value + b_value
    return total, a_value, b_value

# Example: Ratio of managers to staff is 2:7. There are 14 managers.
total, managers, staff = solve_ratio_problem(2, 7, 14, 'A')
print(f"Total people: {total}")  # Output: Total people: 63.0
```

```javascript
function solveRatioProblem(ratioA, ratioB, knownValue, knownPart) {
  // Solves: If A:B = ratioA:ratioB, and you know the value of one part,
  // find the total or the other part.
  // knownPart: 'A' or 'B'
  const totalRatio = ratioA + ratioB;
  let aValue, bValue;

  if (knownPart === "A") {
    aValue = knownValue;
    const unitValue = aValue / ratioA;
    bValue = unitValue * ratioB;
  } else {
    // knownPart === 'B'
    bValue = knownValue;
    const unitValue = bValue / ratioB;
    aValue = unitValue * ratioA;
  }

  const total = aValue + bValue;
  return { total, aValue, bValue };
}

// Example: Ratio of managers to staff is 2:7. There are 14 managers.
const result = solveRatioProblem(2, 7, 14, "A");
console.log(`Total people: ${result.total}`); // Output: Total people: 63
```

```java
public class RatioSolver {
    public static class Result {
        public double total;
        public double aValue;
        public double bValue;
        Result(double total, double a, double b) {
            this.total = total;
            this.aValue = a;
            this.bValue = b;
        }
    }

    public static Result solveRatioProblem(int ratioA, int ratioB,
                                           double knownValue, char knownPart) {
        // Solves: If A:B = ratioA:ratioB, and you know the value of one part,
        // find the total or the other part.
        // knownPart: 'A' or 'B'
        int totalRatio = ratioA + ratioB;
        double aValue, bValue;

        if (knownPart == 'A') {
            aValue = knownValue;
            double unitValue = aValue / ratioA;
            bValue = unitValue * ratioB;
        } else { // knownPart == 'B'
            bValue = knownValue;
            double unitValue = bValue / ratioB;
            aValue = unitValue * ratioA;
        }

        double total = aValue + bValue;
        return new Result(total, aValue, bValue);
    }

    public static void main(String[] args) {
        // Example: Ratio of managers to staff is 2:7. There are 14 managers.
        Result result = solveRatioProblem(2, 7, 14, 'A');
        System.out.println("Total people: " + result.total); // Output: Total people: 63.0
    }
}
```

</div>

## Recommended Practice Order

1.  **Master Fundamentals:** Drill percentage increase/decrease, fraction/decimal conversions, and basic algebra (solving for x).
2.  **Practice Ratios & Averages:** Work on problems involving splits, mixtures, and weighted averages.
3.  **Tackle Data Interpretation:** Use online resources with business charts. Focus on speed and accuracy in pulling numbers.
4.  **Take Timed Practice Sets:** Simulate the 6-question block under exam conditions. Review every mistake to identify weak spots.
5.  **Mental Math Daily:** Spend 5 minutes daily doing calculations in your head.

[Practice Math at Deloitte](/company/deloitte/math)
