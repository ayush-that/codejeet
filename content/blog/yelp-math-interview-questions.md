---
title: "Math Questions at Yelp: What to Expect"
description: "Prepare for Math interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-03"
category: "dsa-patterns"
tags: ["yelp", "math", "interview prep"]
---

## Why Math Matters at Yelp

You might be surprised to learn that Yelp, a platform built on reviews and local business discovery, includes math questions in roughly 15% of its technical interviews (4 out of 27 total topics). This isn't about abstract calculus or proving theorems. It's about _applied, practical math_—the kind that underpins the features you use every day. Think about it: ranking search results, calculating average star ratings that resist manipulation, computing distances for "near me" searches, or modeling business popularity trends. These are all math problems disguised as product features.

In interviews, math questions test your ability to translate a real-world, often ambiguous, product requirement into a precise, efficient algorithm. It's a core focus area for assessing _product-minded engineering_—a key trait at Yelp. You're not just coding; you're demonstrating you can reason about the logic that makes the platform work. While you won't get a math question in every interview loop, when one appears, it's a significant opportunity to showcase this blend of analytical and practical skill.

## Specific Patterns Yelp Favors

Yelp's math problems tend to cluster around a few key, applicable areas. You won't see heavy combinatorics or number theory. Instead, expect problems involving **numerical simulation, probability, and modular arithmetic** applied to concrete scenarios.

1.  **Simulation & Iteration:** Many problems ask you to model a process step-by-step. This could be simulating the decay of a review's relevance over time, distributing seats for a reservation system, or calculating a running aggregate (like a moving average of ratings). The math is often simple arithmetic, but the challenge is designing a clean, efficient simulation loop.
2.  **Probability & Randomization:** Given Yelp's data-rich environment, questions about fair random selection (e.g., "pick a random business weighted by its rating") or expected value are common. These test your understanding of basic probability and your ability to implement algorithms like weighted random selection or reservoir sampling.
3.  **Modular Arithmetic & Number Properties:** Problems involving sequences, cycles, or wrapping around constraints (like circular arrays or round-robin scheduling) frequently appear. The key is recognizing when to use the modulo operator (`%`) to handle these cycles elegantly.

A classic example that combines simulation and number properties is **LeetCode #258: Add Digits** (the "digital root" problem). While simple, its core idea—repeatedly applying an operation until a condition is met—mirrors many Yelp simulation tasks.

## How to Prepare

The best preparation is to practice recognizing the underlying pattern in a wordy problem description. Let's look at a fundamental pattern: **Weighted Random Selection**. Imagine you need to randomly pick a business to feature, but businesses with higher ratings should have a higher chance of being chosen.

The efficient approach uses a prefix sum array and binary search. Here’s how it works:

<div class="code-group">

```python
import random, bisect

class WeightedRandomSelector:
    def __init__(self, weights):
        """
        :type weights: List[int] e.g., [1, 3, 2] for businesses with weights 1, 3, and 2.
        """
        self.prefix_sums = []
        running_sum = 0
        for w in weights:
            running_sum += w
            self.prefix_sums.append(running_sum)
        self.total_sum = running_sum

    def pick_index(self):
        """
        :rtype: int
        Picks an index proportional to its weight.
        """
        # 1. Pick a random target in range [1, total_sum]
        target = random.randint(1, self.total_sum)
        # 2. Find the first index where prefix_sum >= target
        # bisect_left finds the insertion point for target in a sorted list
        return bisect.bisect_left(self.prefix_sums, target)

# Example Usage:
selector = WeightedRandomSelector([1, 3, 2]) # Biz 0: weight 1, Biz 1: weight 3, Biz 2: weight 2
print(selector.pick_index()) # Output will be 1 ~50% of the time, 2 ~33%, 0 ~17%

# Time: O(n) for init, O(log n) for pick_index
# Space: O(n) for storing prefix sums
```

```javascript
class WeightedRandomSelector {
  constructor(weights) {
    this.prefixSums = [];
    let runningSum = 0;
    for (let w of weights) {
      runningSum += w;
      this.prefixSums.push(runningSum);
    }
    this.totalSum = runningSum;
  }

  pickIndex() {
    // 1. Pick a random target in range [1, totalSum]
    const target = Math.floor(Math.random() * this.totalSum) + 1;
    // 2. Find the first index where prefixSum >= target (binary search)
    let left = 0,
      right = this.prefixSums.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.prefixSums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }
}

// Example Usage:
const selector = new WeightedRandomSelector([1, 3, 2]);
console.log(selector.pickIndex());

// Time: O(n) for constructor, O(log n) for pickIndex
// Space: O(n) for storing prefixSums
```

```java
import java.util.Random;

class WeightedRandomSelector {
    private int[] prefixSums;
    private int totalSum;
    private Random rand;

    public WeightedRandomSelector(int[] weights) {
        prefixSums = new int[weights.length];
        rand = new Random();
        int runningSum = 0;
        for (int i = 0; i < weights.length; i++) {
            runningSum += weights[i];
            prefixSums[i] = runningSum;
        }
        totalSum = runningSum;
    }

    public int pickIndex() {
        // 1. Pick a random target in range [1, totalSum]
        int target = rand.nextInt(totalSum) + 1;
        // 2. Find the first index where prefixSum >= target (binary search)
        int left = 0, right = prefixSums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (prefixSums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}

// Time: O(n) for constructor, O(log n) for pickIndex
// Space: O(n) for storing prefixSums
```

</div>

Another common pattern is **simulation with modular arithmetic**. Consider a problem where events happen in a cycle, like rotating featured reviews. The key is using `%` to wrap around.

<div class="code-group">

```python
def simulate_round_robin(events, steps, start_index):
    """
    Simulates moving `steps` forward in a circular list of `events`.
    :type events: List[str]
    :type steps: int
    :type start_index: int
    :rtype: str
    """
    # The core math: (start + steps) % length handles wrap-around perfectly.
    final_index = (start_index + steps) % len(events)
    return events[final_index]

# Example: Events = ["ReviewA", "ReviewB", "ReviewC"], start at index 1 ("ReviewB"), take 5 steps.
# (1 + 5) % 3 = 6 % 3 = 0. Returns "ReviewA".
print(simulate_round_robin(["A", "B", "C"], 5, 1)) # Output: "A"

# Time: O(1) | Space: O(1)
```

```javascript
function simulateRoundRobin(events, steps, startIndex) {
  const finalIndex = (startIndex + steps) % events.length;
  return events[finalIndex];
}
// Time: O(1) | Space: O(1)
```

```java
public String simulateRoundRobin(String[] events, int steps, int startIndex) {
    int finalIndex = (startIndex + steps) % events.length;
    return events[finalIndex];
}
// Time: O(1) | Space: O(1)
```

</div>

## How Yelp Tests Math vs Other Companies

Yelp's math questions differ from those at companies like Google or Facebook. At pure tech giants, math problems can lean toward algorithmic trickery (e.g., "Bulb Switcher" #319) or complex combinatorics. At quant firms (like Jane Street), they dive deep into probability puzzles.

Yelp's approach is **pragmatic and product-adjacent**. The problem statement will often feel like a simplified version of a real task a Yelp engineer might tackle. The difficulty is usually in the **easy to medium range** on LeetCode. The evaluation focuses less on knowing an obscure formula and more on:

- **Clarity of Thought:** Can you explain your reasoning step-by-step?
- **Edge Case Handling:** Did you consider division by zero, negative numbers, or empty inputs?
- **Code Cleanliness:** Is your simulation loop easy to read and modify?
- **Efficiency Awareness:** Can you justify why your O(n) solution is acceptable, or identify when an O(n²) simulation might become a problem?

The "math" is a means to an end—the end being clean, maintainable, and logical code that solves a business-like problem.

## Study Order

Tackle these sub-topics in this order to build a solid foundation before combining concepts.

1.  **Basic Arithmetic & Simulation:** Start with simple loops that accumulate sums, averages, or model steps. This builds comfort with translating a process into code. (e.g., simulating a countdown).
2.  **Modular Arithmetic:** Learn how the modulo operator (`%`) works for wrapping indices and creating cycles. This is a single, powerful tool that unlocks many problems.
3.  **Probability Fundamentals:** Understand basic concepts like uniform vs. weighted random selection, expected value, and how to simulate simple probabilities (like a coin flip).
4.  **Number Properties:** Study problems involving digits, multiples, and prime numbers (up to efficient checking). These often involve clever use of `%` and `/`.
5.  **Combining Patterns:** Finally, practice problems that mix these ideas, like a weighted selection within a cyclic schedule.

## Recommended Practice Order

Solve these problems in sequence. They increase in complexity and closely mirror Yelp's style.

1.  **LeetCode #258: Add Digits** - A gentle intro to simulation and number properties.
2.  **LeetCode #384: Shuffle an Array** - Teaches the fundamentals of fair randomization (Fisher-Yates algorithm).
3.  **LeetCode #528: Random Pick with Weight** - Direct implementation of the weighted random selection pattern shown above. **Crucial for Yelp.**
4.  **LeetCode #398: Random Pick Index** - Introduces reservoir sampling, a useful pattern for streaming data.
5.  **LeetCode #453: Minimum Moves to Equal Array Elements** - A good example of a non-obvious math insight that simplifies a seemingly complex simulation.
6.  **LeetCode #780: Reaching Points** - A medium-difficulty problem that tests working backwards with modular arithmetic, excellent for stretching your skills.

Mastering these patterns will transform Yelp's math questions from a potential stumbling block into a chance to demonstrate your practical, product-oriented problem-solving skills.

[Practice Math at Yelp](/company/yelp/math)
