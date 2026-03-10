---
title: "Reservoir Sampling Interview Questions: Patterns and Strategies"
description: "Master Reservoir Sampling problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-07-05"
category: "dsa-patterns"
tags: ["reservoir-sampling", "dsa", "interview prep"]
---

# Reservoir Sampling Interview Questions: Patterns and Strategies

You're 30 minutes into a Google interview, feeling good about your solution to a streaming data problem. You've implemented a hash map to track frequencies, optimized for O(1) lookups, and the interviewer nods approvingly. Then they ask: "Great, but what if we need to select a random element from the stream with equal probability, and we can only store k elements at any time?" Your hash map solution just evaporated. This is the moment candidates realize why reservoir sampling matters.

Reservoir sampling isn't just another algorithm—it's a mindset shift. While most interview problems assume you can process all data at once, reservoir sampling forces you to think about constraints: unbounded streams, memory limits, and true randomness. I've seen strong candidates stumble on problems like "Random Pick Index" (#398) because they try to apply traditional sampling approaches to streaming constraints. The key insight? You don't need to see all the data to sample it fairly.

## Common Patterns

### Pattern 1: Single Element Sampling (Algorithm R)

This is the foundational pattern: selecting one random element from a stream where each element has equal probability of being chosen. The intuition is elegant—maintain a candidate and replace it with probability 1/i for the i-th element.

<div class="code-group">

```python
import random

def select_random_element(stream):
    """
    Reservoir sampling for single element selection.
    Each element in stream has equal probability of being selected.
    """
    result = None
    count = 0

    for element in stream:
        count += 1
        # For the i-th element, replace result with probability 1/i
        if random.randint(1, count) == 1:
            result = element

    return result

# Time: O(n) where n is stream length | Space: O(1)
# Each element requires constant time operations
```

```javascript
function selectRandomElement(stream) {
  let result = null;
  let count = 0;

  for (const element of stream) {
    count++;
    // Math.random() returns [0, 1), so probability 1/count
    if (Math.floor(Math.random() * count) === 0) {
      result = element;
    }
  }

  return result;
}

// Time: O(n) where n is stream length | Space: O(1)
// Random number generation is O(1) in practice
```

```java
import java.util.Iterator;
import java.util.Random;

public class ReservoirSampling {
    public static <T> T selectRandomElement(Iterator<T> stream) {
        T result = null;
        int count = 0;
        Random rand = new Random();

        while (stream.hasNext()) {
            T element = stream.next();
            count++;
            // rand.nextInt(count) returns [0, count-1]
            // Probability that 0 is selected = 1/count
            if (rand.nextInt(count) == 0) {
                result = element;
            }
        }

        return result;
    }
}

// Time: O(n) where n is stream length | Space: O(1)
// Random.nextInt() is O(1) amortized
```

</div>

**LeetCode problems using this pattern:** Random Pick Index (#398), Linked List Random Node (#382). The key insight is proving that for the i-th element, the probability it ends up as the result is 1/n (where n is total elements). This works because: P(i selected) = P(i replaces at step i) × P(not replaced later) = (1/i) × (i/(i+1)) × ... × ((n-1)/n) = 1/n.

### Pattern 2: k-Element Sampling (Algorithm L)

When you need to select k random elements from a stream, the algorithm becomes slightly more complex but follows the same probabilistic reasoning. The intuition: maintain a reservoir of size k, and for the i-th element (where i > k), replace a random element in the reservoir with probability k/i.

<div class="code-group">

```python
import random

def select_k_random_elements(stream, k):
    """
    Reservoir sampling for k-element selection.
    Returns list of k elements where each subset of size k is equally likely.
    """
    reservoir = []
    count = 0

    for element in stream:
        count += 1
        if len(reservoir) < k:
            # Fill reservoir initially
            reservoir.append(element)
        else:
            # For i-th element (i > k), replace random element with probability k/i
            j = random.randint(0, count - 1)
            if j < k:
                reservoir[j] = element

    return reservoir

# Time: O(n) where n is stream length | Space: O(k) for the reservoir
# Each element requires O(1) operations (random number + possible replacement)
```

```javascript
function selectKRandomElements(stream, k) {
  const reservoir = [];
  let count = 0;

  for (const element of stream) {
    count++;
    if (reservoir.length < k) {
      reservoir.push(element);
    } else {
      const j = Math.floor(Math.random() * count);
      if (j < k) {
        reservoir[j] = element;
      }
    }
  }

  return reservoir;
}

// Time: O(n) where n is stream length | Space: O(k)
// Math.random() and array access are O(1)
```

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

public class KReservoirSampling {
    public static <T> List<T> selectKRandomElements(Iterator<T> stream, int k) {
        List<T> reservoir = new ArrayList<>(k);
        int count = 0;
        Random rand = new Random();

        while (stream.hasNext()) {
            T element = stream.next();
            count++;

            if (reservoir.size() < k) {
                reservoir.add(element);
            } else {
                int j = rand.nextInt(count);
                if (j < k) {
                    reservoir.set(j, element);
                }
            }
        }

        return reservoir;
    }
}

// Time: O(n) where n is stream length | Space: O(k)
// ArrayList operations are amortized O(1)
```

</div>

**LeetCode problems:** This pattern appears in variations of random selection problems, though fewer pure implementations exist on LeetCode. The proof is similar: for any element at position i, probability it's in final reservoir = k/n. This holds because: P(in reservoir) = P(selected at step i) × P(not replaced later) = (k/i) × (i/(i+1)) × ... × ((n-1)/n) = k/n.

### Pattern 3: Weighted Reservoir Sampling

When elements have different weights, the sampling probability should be proportional to weight. The intuition: assign each element a random key = random^(1/weight), and keep the k elements with highest keys.

<div class="code-group">

```python
import random
import math

def weighted_reservoir_sampling(stream, weights, k):
    """
    Weighted reservoir sampling using the A-Res algorithm.
    Each element's selection probability is proportional to its weight.
    """
    reservoir = []  # Store (key, element) pairs
    min_heap = []   # Min-heap to track smallest key in reservoir

    for i, (element, weight) in enumerate(zip(stream, weights)):
        # Generate random key: random^(1/weight)
        key = random.random() ** (1.0 / weight)

        if len(reservoir) < k:
            reservoir.append((key, element))
            heapq.heappush(min_heap, key)
        else:
            # If key > smallest key in reservoir, replace it
            if key > min_heap[0]:
                # Remove smallest
                heapq.heappop(min_heap)
                # Find and replace the element with smallest key
                for j in range(len(reservoir)):
                    if reservoir[j][0] == min_heap[0]:
                        reservoir[j] = (key, element)
                        break
                heapq.heappush(min_heap, key)

    return [elem for _, elem in reservoir]

# Time: O(n log k) where n is stream length | Space: O(k)
# Heap operations are O(log k), and we do them for each element
```

```javascript
function weightedReservoirSampling(stream, weights, k) {
  const reservoir = []; // Array of {key, element}
  const minHeap = new MinHeap();

  stream.forEach((element, i) => {
    const weight = weights[i];
    // Generate key = random^(1/weight)
    const key = Math.pow(Math.random(), 1 / weight);

    if (reservoir.length < k) {
      reservoir.push({ key, element });
      minHeap.insert(key);
    } else {
      if (key > minHeap.peek()) {
        minHeap.extractMin();
        // Find element with smallest key (simplified - in practice use better tracking)
        let minIndex = 0;
        for (let j = 1; j < reservoir.length; j++) {
          if (reservoir[j].key < reservoir[minIndex].key) {
            minIndex = j;
          }
        }
        reservoir[minIndex] = { key, element };
        minHeap.insert(key);
      }
    }
  });

  return reservoir.map((item) => item.element);
}

// Time: O(nk) naive, O(n log k) with proper heap | Space: O(k)
// Simplified version shows the algorithm logic
```

```java
import java.util.*;

public class WeightedReservoirSampling {
    static class ElementWithKey<T> {
        double key;
        T element;

        ElementWithKey(double key, T element) {
            this.key = key;
            this.element = element;
        }
    }

    public static <T> List<T> weightedSample(List<T> stream, List<Double> weights, int k) {
        PriorityQueue<Double> minHeap = new PriorityQueue<>();
        List<ElementWithKey<T>> reservoir = new ArrayList<>();
        Random rand = new Random();

        for (int i = 0; i < stream.size(); i++) {
            T element = stream.get(i);
            double weight = weights.get(i);
            double key = Math.pow(rand.nextDouble(), 1.0 / weight);

            if (reservoir.size() < k) {
                reservoir.add(new ElementWithKey<>(key, element));
                minHeap.offer(key);
            } else {
                if (key > minHeap.peek()) {
                    minHeap.poll();
                    // Find and replace element with smallest key
                    double minKey = minHeap.peek();
                    for (int j = 0; j < reservoir.size(); j++) {
                        if (Math.abs(reservoir.get(j).key - minKey) < 1e-9) {
                            reservoir.set(j, new ElementWithKey<>(key, element));
                            break;
                        }
                    }
                    minHeap.offer(key);
                }
            }
        }

        List<T> result = new ArrayList<>();
        for (ElementWithKey<T> item : reservoir) {
            result.add(item.element);
        }
        return result;
    }
}

// Time: O(n log k) with proper implementation | Space: O(k)
// PriorityQueue operations are O(log k)
```

</div>

**Why this works:** The key insight is that P(key > t) = t^weight, which creates the correct weighted probabilities. This pattern appears in systems design interviews for recommendation systems and load balancing.

## When to Use Reservoir Sampling vs Alternatives

Recognizing when to reach for reservoir sampling is half the battle. Here's my decision framework:

1. **Streaming vs Static Data**: If the problem mentions "stream", "infinite", "too large to store", or "process as you receive", think reservoir sampling. If you have all data in memory, consider shuffle algorithms (Fisher-Yates) or random selection with indices.

2. **Memory Constraints**: When the problem specifies "constant space" or "O(k) space" where k ≪ n, reservoir sampling is likely. Alternatives like storing all elements and sampling later violate these constraints.

3. **Equal vs Weighted Probability**: For equal probability, use Algorithm R or L. For weighted probability, use weighted reservoir sampling. Don't try to force equal-probability algorithms to handle weights—it won't work mathematically.

4. **One-pass Requirement**: If you must process data in one pass (can't rewind), reservoir sampling is your only option. Two-pass alternatives include counting then sampling, which uses O(n) space.

**Common Mistake**: Using a hash map to count frequencies when asked for random sampling. Frequency counting helps with weighted sampling if you know all weights upfront, but fails for streaming weighted sampling.

## Edge Cases and Gotchas

### 1. The Empty Stream Problem

What if the stream has zero elements? Your code should handle this gracefully. In single-element sampling, return `None`/`null`. In k-element sampling, return an empty list.

```python
def select_random_element(stream):
    result = None
    count = 0

    for element in stream:
        count += 1
        if random.randint(1, count) == 1:
            result = element

    # Handle empty stream
    if count == 0:
        raise ValueError("Cannot sample from empty stream")

    return result
```

### 2. k > n (Sample Size Larger Than Population)

When k exceeds the stream length, you should return all elements. The mathematical definition of sampling breaks down, but practically, you can't sample k items from n < k.

```python
def select_k_random_elements(stream, k):
    reservoir = []
    count = 0

    for element in stream:
        count += 1
        if len(reservoir) < k:
            reservoir.append(element)
        else:
            j = random.randint(0, count - 1)
            if j < k:
                reservoir[j] = element

    # If k > n, we just return all elements we saw
    return reservoir
```

### 3. Random Number Generation Edge Cases

Most random functions return values in [0, 1). When converting to integers, be careful with off-by-one errors. The correct formula for probability p = k/i is: generate random integer in [0, i-1], check if < k.

### 4. Floating Point Precision in Weighted Sampling

When computing random^(1/weight) for very small weights, you might get numerical instability. Consider using log-space: key = exp(log(random)/weight) for better numerical stability.

## Difficulty Breakdown

The 100% medium distribution tells a clear story: companies test reservoir sampling at the medium level because they want to see if you can:

1. Understand probabilistic reasoning
2. Implement an algorithm correctly under pressure
3. Handle the streaming constraint

No easy problems exist because the core concept requires mathematical understanding. No hard problems exist because once you grasp the pattern, variations are manageable. This means: master the medium problems thoroughly, and you'll cover the entire topic.

## Which Companies Ask Reservoir Sampling

- **Google** (/company/google): Loves streaming algorithms. They'll often combine reservoir sampling with system design questions about Google Search or YouTube recommendations.
- **Meta** (/company/meta): Focuses on practical applications for News Feed ranking and ad selection. Expect weighted reservoir sampling more than uniform.
- **Amazon** (/company/amazon): Asks about streaming product recommendations and warehouse data processing. They care about the one-pass constraint for AWS data streams.
- **NVIDIA** (/company/nvidia): Tests reservoir sampling for GPU memory management and parallel data processing. They might ask about parallelizing the algorithm.
- **TikTok** (/company/tiktok): Focuses on video recommendation systems. Weighted reservoir sampling appears frequently for A/B testing and content selection.

Each company has a style: Google tests mathematical rigor, Meta tests practical implementation, Amazon tests scalability, NVIDIA tests parallelization, and TikTok tests recommendation applications.

## Study Tips

1. **Start with Proofs, Not Code**: Before implementing, prove to yourself why Algorithm R works. Draw the probability tree for n=3. This understanding will help you handle variations.

2. **Practice in This Order**:
   - Random Pick Index (#398) - Single element, equal probability
   - Linked List Random Node (#382) - Same pattern, different data structure
   - Implement weighted reservoir sampling from scratch
   - Design a recommendation system using reservoir sampling (system design)

3. **Whiteboard the Algorithm First**: Don't jump to code. Draw the stream, show how the reservoir evolves, and explain the probabilities at each step. Interviewers care more about your reasoning than perfect syntax.

4. **Test Edge Cases Systematically**: Write test cases for: empty stream, k=0, k=1, k=n, k>n, very large n. Time yourself implementing these tests.

Reservoir sampling questions are deceptively simple-looking but test fundamental computer science: algorithms, probability, and constraints. Master this topic, and you'll handle any streaming random selection question with confidence.

[Practice all Reservoir Sampling questions on CodeJeet](/topic/reservoir-sampling)
