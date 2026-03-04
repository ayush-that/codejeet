---
title: "Math Questions at Uber: What to Expect"
description: "Prepare for Math interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-03"
category: "dsa-patterns"
tags: ["uber", "math", "interview prep"]
---

Math matters at Uber because the company operates at the intersection of massive-scale logistics, dynamic pricing, geospatial analysis, and real-time data. Every ride request, delivery route, and surge price is driven by mathematical models. Engineers need to reason about probabilities, statistics, and discrete math to design systems that are efficient, fair, and reliable. A strong grasp of core math concepts is not academic—it's essential for solving the optimization and prediction problems that define Uber's platform.

## What to Expect — Types of Problems

Uber's math questions primarily test probability, statistics, combinatorics, and basic linear algebra. You won't encounter advanced calculus; the focus is on applied, discrete mathematics relevant to tech.

**Probability & Statistics:** These are the most frequent. Expect questions about conditional probability, Bayes' Theorem, expected value, and distributions (especially uniform, binomial, and Poisson). A classic example is calculating the probability of a driver being within a certain distance of a pickup.

**Combinatorics:** Problems involving counting principles, permutations, and combinations appear often. For instance, "How many ways can you assign 5 drivers to 10 ride requests?"

**Basic Linear Algebra:** Questions may involve matrix operations or understanding vectors in the context of geospatial data, though this is less common than probability.

**Logic & Puzzle Problems:** Some questions are brainteasers that test quantitative reasoning and problem-solving under constraints.

## How to Prepare — Study Tips with One Code Example

1.  **Master Fundamentals:** Solidify your understanding of probability rules (sum, product, conditional), expected value, and common distributions. Use textbooks or online courses focused on discrete math for computer science.
2.  **Practice Word Problems:** Translate real-world scenarios into mathematical models. Uber questions are often story-based.
3.  **Implement Key Concepts:** Writing code for simulations or calculations reinforces understanding. For example, a frequent pattern is **sampling or simulating a probability scenario** to verify a theoretical result.

Here is a code example for a common pattern: calculating an **expected value** through simulation. The problem might be: "A driver has a 60% chance of getting a ride request in any given 5-minute interval. What is the expected number of intervals before they get their first request?"

<div class="code-group">

```python
import random

def simulate_expected_intervals(p_success=0.6, trials=100000):
    total_intervals = 0
    for _ in range(trials):
        intervals = 1
        while random.random() > p_success:  # Simulate failure
            intervals += 1
        total_intervals += intervals
    return total_intervals / trials

# Theoretical expected value for geometric distribution is 1/p
print(f"Simulated: {simulate_expected_intervals():.4f}")
print(f"Theoretical: {1/0.6:.4f}")
```

```javascript
function simulateExpectedIntervals(pSuccess = 0.6, trials = 100000) {
  let totalIntervals = 0;
  for (let i = 0; i < trials; i++) {
    let intervals = 1;
    while (Math.random() > pSuccess) {
      intervals++;
    }
    totalIntervals += intervals;
  }
  return totalIntervals / trials;
}

// Theoretical expected value for geometric distribution is 1/p
console.log(`Simulated: ${simulateExpectedIntervals().toFixed(4)}`);
console.log(`Theoretical: ${(1 / 0.6).toFixed(4)}`);
```

```java
import java.util.Random;

public class ExpectedValueSimulation {
    public static double simulateExpectedIntervals(double pSuccess, int trials) {
        Random rand = new Random();
        long totalIntervals = 0;
        for (int i = 0; i < trials; i++) {
            int intervals = 1;
            while (rand.nextDouble() > pSuccess) {
                intervals++;
            }
            totalIntervals += intervals;
        }
        return (double) totalIntervals / trials;
    }

    public static void main(String[] args) {
        double pSuccess = 0.6;
        int trials = 100000;
        System.out.printf("Simulated: %.4f%n", simulateExpectedIntervals(pSuccess, trials));
        System.out.printf("Theoretical: %.4f%n", 1 / pSuccess);
    }
}
```

</div>

## Recommended Practice Order

Start with foundational probability (conditional probability, Bayes'). Move to expected value problems. Then tackle combinatorics (permutations, combinations). Finally, integrate these concepts by solving Uber's past problems. Always derive the answer mathematically first, then use code to verify if the problem allows for simulation.

[Practice Math at Uber](/company/uber/math)
