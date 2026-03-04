---
title: "Math Questions at Swiggy: What to Expect"
description: "Prepare for Math interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-02-03"
category: "dsa-patterns"
tags: ["swiggy", "math", "interview prep"]
---

Math matters at Swiggy because its core business—food delivery, logistics, and hyperlocal commerce—is fundamentally built on mathematical optimization. Every order involves calculating the shortest delivery routes, estimating accurate arrival times, dynamically adjusting for traffic and restaurant prep delays, and optimizing delivery partner assignments. These systems rely heavily on probability, statistics, combinatorics, and discrete math. For a software engineer at Swiggy, the ability to reason through these problems translates directly into building scalable, efficient systems that handle millions of daily transactions. The six math questions in their technical interview assess your foundational quantitative reasoning and your capacity to model real-world constraints into solvable computational problems.

## What to Expect — Types of Problems

The math problems at Swiggy typically fall into a few key categories. **Probability and Statistics** questions are common, often involving scenarios like order batching, delivery success rates, or A/B testing metrics. You might calculate conditional probabilities or expected values. **Combinatorics** appears in problems related to counting ways to assign orders or arrange sequences under specific rules. **Basic Number Theory and Modular Arithmetic** can surface in problems about unique order IDs or distributed system design. Finally, **Optimization and Logic Puzzles** test your ability to find minimal or maximal values, often wrapped in a business context like minimizing delivery time or maximizing platform efficiency. The problems are applied; you'll be expected to derive a formula or logic before jumping to code.

## How to Prepare — Study Tips with One Code Example

Focus on strengthening your fundamentals in probability, combinatorics, and modular arithmetic. Practice translating word problems into mathematical expressions. Use brute-force simulation for smaller cases to verify your reasoning before optimizing. Work on time complexity analysis for your math-based solutions. A key pattern is using **combinatorial mathematics** to avoid exhaustive enumeration. For example, calculating combinations (n choose k) efficiently is essential.

<div class="code-group">

```python
def n_choose_k(n, k):
    if k > n:
        return 0
    # Use multiplicative formula for O(k) time
    result = 1
    for i in range(1, min(k, n - k) + 1):
        result = result * (n - i + 1) // i
    return result

# Example: Ways to choose 2 delivery slots from 7
print(n_choose_k(7, 2))  # Output: 21
```

```javascript
function nChooseK(n, k) {
  if (k > n) return 0;
  let result = 1;
  for (let i = 1; i <= Math.min(k, n - k); i++) {
    result = (result * (n - i + 1)) / i;
  }
  return Math.round(result); // Result is integer
}

// Example: Ways to choose 2 delivery slots from 7
console.log(nChooseK(7, 2)); // Output: 21
```

```java
public class Combinatorics {
    public static long nChooseK(int n, int k) {
        if (k > n) return 0;
        long result = 1;
        for (int i = 1; i <= Math.min(k, n - k); i++) {
            result = result * (n - i + 1) / i;
        }
        return result;
    }

    public static void main(String[] args) {
        // Example: Ways to choose 2 delivery slots from 7
        System.out.println(nChooseK(7, 2)); // Output: 21
    }
}
```

</div>

## Recommended Practice Order

Start with core probability concepts (independent events, conditional probability, expectation). Move to combinatorics (permutations, combinations, counting principles). Then, tackle modular arithmetic and basic number theory. Finally, practice applied optimization and logic puzzles. Integrate coding practice for each topic using platforms like CodeJeet to simulate the interview environment. Always articulate your reasoning step-by-step during practice.

[Practice Math at Swiggy](/company/swiggy/math)
