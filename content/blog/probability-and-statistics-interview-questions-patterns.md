---
title: "Probability and Statistics Interview Questions: Patterns and Strategies"
description: "Master Probability and Statistics problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-07-01"
category: "dsa-patterns"
tags: ["probability-and-statistics", "dsa", "interview prep"]
---

# Probability and Statistics Interview Questions: Patterns and Strategies

You're in the middle of a Google interview, feeling good about your coding skills, when the interviewer asks: "Given a stream of integers, design a data structure that returns a random element with equal probability, but you can only use O(1) memory." This isn't a trick question—it's Reservoir Sampling (LeetCode #382), and it's exactly the kind of probability problem that separates candidates who've prepared for these patterns from those who haven't.

Probability and statistics questions appear in about 15-20% of technical interviews at top companies, particularly for roles involving data, machine learning, or systems design. What makes them challenging is that they often look like regular algorithm problems at first glance, but require a fundamentally different mindset. You're not just optimizing for time complexity—you're reasoning about distributions, expected values, and statistical properties.

## Common Patterns

### 1. Reservoir Sampling

This is the single most important pattern to know. When you need to select k random items from a stream of unknown length with equal probability, reservoir sampling is your answer. The intuition is elegant: as you process each new element, you decide whether to include it in your reservoir, with decreasing probability as you see more elements.

<div class="code-group">

```python
import random

class RandomSelector:
    def __init__(self):
        self.reservoir = None
        self.count = 0

    def add(self, val):
        self.count += 1
        # For the first element, always take it
        if self.count == 1:
            self.reservoir = val
        else:
            # Generate random number between 0 and count-1
            # If it's 0, replace the reservoir with current value
            # Probability of picking current element = 1/count
            # Probability of keeping previous = (count-1)/count
            if random.randint(0, self.count - 1) == 0:
                self.reservoir = val

    def get_random(self):
        return self.reservoir

# Time: O(1) per add, O(1) for get_random | Space: O(1)
```

```javascript
class RandomSelector {
  constructor() {
    this.reservoir = null;
    this.count = 0;
  }

  add(val) {
    this.count++;
    if (this.count === 1) {
      this.reservoir = val;
    } else {
      // Math.random() returns [0, 1)
      // Multiply by count to get [0, count)
      // Floor to get [0, count-1]
      if (Math.floor(Math.random() * this.count) === 0) {
        this.reservoir = val;
      }
    }
  }

  getRandom() {
    return this.reservoir;
  }
}

// Time: O(1) per add, O(1) for getRandom | Space: O(1)
```

```java
import java.util.Random;

class RandomSelector {
    private Integer reservoir;
    private int count;
    private Random rand;

    public RandomSelector() {
        this.reservoir = null;
        this.count = 0;
        this.rand = new Random();
    }

    public void add(int val) {
        count++;
        if (count == 1) {
            reservoir = val;
        } else {
            // nextInt(count) returns [0, count-1]
            if (rand.nextInt(count) == 0) {
                reservoir = val;
            }
        }
    }

    public int getRandom() {
        return reservoir;
    }
}

// Time: O(1) per add, O(1) for getRandom | Space: O(1)
```

</div>

**Key Problems:** Linked List Random Node (#382), Random Pick Index (#398)

### 2. Rejection Sampling

When you have a source of random numbers but need to generate numbers from a different distribution, rejection sampling is your tool. The intuition: generate a candidate, check if it's valid according to your target distribution, and if not, try again. The efficiency depends on your acceptance rate.

<div class="code-group">

```python
import random
import math

def generate_unit_circle_point():
    """Generate random point uniformly within unit circle using rejection sampling"""
    while True:
        # Generate point in [-1, 1] x [-1, 1] square
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)

        # Accept if within unit circle (x² + y² ≤ 1)
        if x*x + y*y <= 1:
            return (x, y)

# Time: O(1) average (π/4 acceptance rate ≈ 78.5%) | Space: O(1)
```

```javascript
function generateUnitCirclePoint() {
  while (true) {
    // Generate point in [-1, 1] x [-1, 1] square
    const x = Math.random() * 2 - 1; // [0,1) -> [-1,1)
    const y = Math.random() * 2 - 1;

    // Accept if within unit circle (x² + y² ≤ 1)
    if (x * x + y * y <= 1) {
      return [x, y];
    }
  }
}

// Time: O(1) average (π/4 acceptance rate ≈ 78.5%) | Space: O(1)
```

```java
import java.util.Random;

class PointGenerator {
    private Random rand = new Random();

    public double[] generateUnitCirclePoint() {
        while (true) {
            // Generate point in [-1, 1] x [-1, 1] square
            double x = rand.nextDouble() * 2 - 1;  // [0,1) -> [-1,1)
            double y = rand.nextDouble() * 2 - 1;

            // Accept if within unit circle (x² + y² ≤ 1)
            if (x*x + y*y <= 1) {
                return new double[]{x, y};
            }
        }
    }
}

// Time: O(1) average (π/4 acceptance rate ≈ 78.5%) | Space: O(1)
```

</div>

**Key Problems:** Generate Random Point in a Circle (#478), Implement Rand10() Using Rand7() (#470)

### 3. Probability Distribution Transformation

Sometimes you need to generate random numbers according to a specific non-uniform distribution. The key insight is to use the cumulative distribution function (CDF) and its inverse.

<div class="code-group">

```python
import random
import bisect

class WeightedRandomPicker:
    def __init__(self, weights):
        # Build prefix sums for cumulative distribution
        self.prefix_sums = []
        prefix_sum = 0
        for w in weights:
            prefix_sum += w
            self.prefix_sums.append(prefix_sum)
        self.total_sum = prefix_sum

    def pickIndex(self):
        # Generate random number in [0, total_sum)
        target = random.random() * self.total_sum

        # Binary search to find first prefix_sum > target
        return bisect.bisect_right(self.prefix_sums, target)

# Time: O(log n) per pick, O(n) initialization | Space: O(n)
```

```javascript
class WeightedRandomPicker {
  constructor(weights) {
    this.prefixSums = [];
    let prefixSum = 0;
    for (const w of weights) {
      prefixSum += w;
      this.prefixSums.push(prefixSum);
    }
    this.totalSum = prefixSum;
  }

  pickIndex() {
    const target = Math.random() * this.totalSum;

    // Binary search
    let left = 0,
      right = this.prefixSums.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.prefixSums[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }
}

// Time: O(log n) per pick, O(n) initialization | Space: O(n)
```

```java
import java.util.Random;

class WeightedRandomPicker {
    private int[] prefixSums;
    private int totalSum;
    private Random rand;

    public WeightedRandomPicker(int[] weights) {
        prefixSums = new int[weights.length];
        int prefixSum = 0;
        for (int i = 0; i < weights.length; i++) {
            prefixSum += weights[i];
            prefixSums[i] = prefixSum;
        }
        totalSum = prefixSum;
        rand = new Random();
    }

    public int pickIndex() {
        int target = rand.nextInt(totalSum);

        // Binary search
        int left = 0, right = prefixSums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (prefixSums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}

// Time: O(log n) per pick, O(n) initialization | Space: O(n)
```

</div>

**Key Problems:** Random Pick with Weight (#528), Random Point in Non-overlapping Rectangles (#497)

## When to Use Probability and Statistics vs Alternatives

Recognizing probability problems is half the battle. Here's how to identify them:

1. **Look for "random" or "probability" in the problem statement** - This seems obvious, but many candidates miss it when the problem is disguised as something else.

2. **Check if you need to maintain equal probability** - If the problem asks for random selection where every element should have equal chance regardless of when it arrived, think reservoir sampling.

3. **Consider the data source** - Streaming data (unknown length) → reservoir sampling. Fixed dataset with weights → probability distribution transformation.

4. **Watch for distribution requirements** - Need uniform distribution in a non-rectangular area? → rejection sampling. Need specific non-uniform distribution? → CDF transformation.

**Decision criteria:**

- If you can store all data: use simple random selection from array
- If data streams in and memory is limited: reservoir sampling
- If you need to generate from complex distribution: rejection sampling or CDF transform
- If weights are involved: prefix sums + binary search

## Edge Cases and Gotchas

### 1. Floating Point Precision

When comparing probabilities or doing acceptance checks, floating point errors can bite you. Always use a small epsilon for comparisons.

```python
# Bad
if x*x + y*y == 1:  # Might never be exactly 1
    return True

# Good
EPSILON = 1e-10
if abs(x*x + y*y - 1) < EPSILON:
    return True
```

### 2. Zero Weights

In weighted random selection, zero-weight elements should never be selected. Make sure your implementation handles this correctly—elements with weight 0 should have zero probability.

### 3. Single Element Streams

Reservoir sampling implementations often fail when there's only one element. Always test with count = 1.

### 4. Random Number Generation Range

Different languages have different default ranges for random number generators. Python's `random.random()` gives [0, 1), Java's `Math.random()` gives [0, 1), but the exact boundaries matter for probability calculations.

## Difficulty Breakdown

The data shows 100% medium difficulty problems. This is actually telling:

1. **Probability questions are rarely "easy"** - Even simple-looking probability problems require careful reasoning about edge cases and distributions.

2. **They're also rarely "hard"** - Unlike complex graph algorithms, probability problems usually have clean mathematical solutions that fit in medium difficulty.

3. **Focus on medium problems** - This is where you'll find the most interview-relevant material. Hard problems often involve complex probability theory beyond typical interviews.

## Which Companies Ask Probability and Statistics

### [Google](/company/google)

Google loves probability questions, especially for ML and data engineering roles. They often combine probability with system design—"How would you randomly sample from petabytes of data?" Expect reservoir sampling variations.

### [Bloomberg](/company/bloomberg)

At Bloomberg, probability questions often relate to financial data—random sampling from market data streams, weighted selection based on trading volumes. They test both the algorithm and your understanding of statistical properties.

### [Microsoft](/company/microsoft)

Microsoft tends to ask probability questions in the context of systems—load balancing, random routing, A/B testing infrastructure. Know how to implement these in a thread-safe manner.

### [Amazon](/company/amazon)

Amazon focuses on practical applications: recommendation systems (weighted random selection of products), ad targeting, and distributed sampling. They care about scalability.

### [DE Shaw](/company/de-shaw)

As a quantitative trading firm, DE Shaw asks the most mathematically rigorous probability questions. Expect problems involving expected values, probability distributions, and sometimes even basic statistics proofs.

## Study Tips

1. **Master the three patterns first** - Reservoir sampling, rejection sampling, and probability distribution transformation cover 80% of interview questions. Implement each from memory.

2. **Practice in this order:**
   - Start with Random Pick Index (#398) - basic reservoir sampling
   - Move to Random Pick with Weight (#528) - probability distribution
   - Try Generate Random Point in a Circle (#478) - rejection sampling
   - Attempt Linked List Random Node (#382) - reservoir sampling on linked list
   - Finish with Implement Rand10() Using Rand7() (#470) - advanced distribution

3. **Think out loud about probability** - In interviews, you need to justify why your solution maintains equal probability. Practice explaining: "The probability that the nth element is in the reservoir is 1/n, and the probability it stays until the end is..."

4. **Test with small cases** - Manually trace through your algorithm with 3-4 elements. Calculate probabilities by hand to verify correctness.

Remember: probability questions test your ability to reason mathematically about uncertainty. It's not just about writing code—it's about proving (or at least convincingly arguing) that your solution produces the correct distribution.

[Practice all Probability and Statistics questions on CodeJeet](/topic/probability-and-statistics)
