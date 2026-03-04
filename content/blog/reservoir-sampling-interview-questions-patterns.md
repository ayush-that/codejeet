---
title: "Reservoir Sampling Interview Questions: Patterns and Strategies"
description: "Master Reservoir Sampling problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-14"
category: "dsa-patterns"
tags: ["reservoir-sampling", "dsa", "interview prep"]
---

Reservoir Sampling Interview Questions: Patterns and Strategies

Reservoir sampling is a niche but critical algorithm family for handling data streams. In interviews, it tests your ability to design probabilistic algorithms for scenarios where data is too large to fit in memory or its total size is unknown upfront. Mastering it demonstrates strong algorithmic thinking beyond standard data structures.

## Common Patterns

The core problem is selecting `k` items uniformly at random from a stream of `n` items where `n` is either unknown or very large. Here are the key patterns.

**1. The Basic Algorithm (Selecting One Item)**
The fundamental version selects a single random item. For each incoming item at index `i` (starting from 0), you replace the selected item with the new item with probability `1/(i+1)`. This ensures every item has an equal `1/n` chance of being chosen.

<div class="code-group">

```python
import random

def select_random(stream):
    selected = None
    for i, element in enumerate(stream):
        # randint(0, i) generates a number from 0 to i inclusive.
        # It equals 0 with probability 1/(i+1).
        if random.randint(0, i) == 0:
            selected = element
    return selected
```

```javascript
function selectRandom(stream) {
  let selected = null;
  for (let i = 0; i < stream.length; i++) {
    // Math.random() returns a value in [0, 1).
    // The condition is true with probability 1/(i+1).
    if (Math.floor(Math.random() * (i + 1)) === 0) {
      selected = stream[i];
    }
  }
  return selected;
}
```

```java
import java.util.Random;

public class ReservoirSampling {
    public static Integer selectRandom(Iterable<Integer> stream) {
        Random rand = new Random();
        Integer selected = null;
        int count = 0;
        for (Integer element : stream) {
            if (rand.nextInt(++count) == 0) {
                selected = element;
            }
        }
        return selected;
    }
}
```

</div>

**2. Generalization to k Items (Algorithm R)**
To select `k` items, maintain a reservoir of size `k`. For the first `k` items, place them directly into the reservoir. For each subsequent item at index `i` (≥ k), generate a random integer `j` between `0` and `i`. If `j < k`, replace the reservoir item at index `j` with the new item.

<div class="code-group">

```python
import random

def reservoir_sample(stream, k):
    reservoir = []
    for i, element in enumerate(stream):
        if i < k:
            reservoir.append(element)
        else:
            j = random.randint(0, i)
            if j < k:
                reservoir[j] = element
    return reservoir
```

```javascript
function reservoirSample(stream, k) {
  const reservoir = [];
  for (let i = 0; i < stream.length; i++) {
    if (i < k) {
      reservoir.push(stream[i]);
    } else {
      const j = Math.floor(Math.random() * (i + 1));
      if (j < k) {
        reservoir[j] = stream[i];
      }
    }
  }
  return reservoir;
}
```

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ReservoirSampling {
    public static List<Integer> reservoirSample(Iterable<Integer> stream, int k) {
        Random rand = new Random();
        List<Integer> reservoir = new ArrayList<>(k);
        int count = 0;
        for (Integer element : stream) {
            if (count < k) {
                reservoir.add(element);
            } else {
                int j = rand.nextInt(count + 1);
                if (j < k) {
                    reservoir.set(j, element);
                }
            }
            count++;
        }
        return reservoir;
    }
}
```

</div>

**3. Weighted Reservoir Sampling**
A common variant assigns different selection probabilities. For a stream of items with weights, the probability of selecting an item is proportional to its weight. The algorithm involves keeping track of a key for each reservoir slot, where `key = random^(1/weight)`, and always keeping the items with the top `k` keys.

## Difficulty Breakdown

The data shows a 100% concentration on Medium-difficulty questions. This is revealing: interviewers use reservoir sampling not as a trivial trick, but as a conceptual building block within a more complex problem. You won't be asked to just implement Algorithm R. Instead, you'll need to recognize a streaming, unknown-size scenario and adapt the reservoir logic—often integrating it with other structures like hash maps or heaps. The "Medium" label means you must derive the algorithm or apply it creatively under interview pressure.

## Which Companies Ask Reservoir Sampling

This topic is favored by companies dealing with massive-scale data systems, real-time processing, or machine learning infrastructure.

- **Google** (/company/google) and **Meta** (/company/meta) ask it for system design and data engineering roles, often in the context of sampling logs or user events.
- **Amazon** (/company/amazon) tests it for streaming analytics positions within AWS.
- **NVIDIA** (/company/nvidia) and **TikTok** (/company/tiktok) include it in interviews for roles involving large-scale data pipelines or recommendation systems that process unbounded streams.

## Study Tips

1.  **Internalize the Proof:** Don't just memorize code. Understand why the probability works. For the single-item case, prove that the last item has probability `1/n`, and use induction to show it holds for all items. This is often part of the interview discussion.
2.  **Practice the k-Generalization:** Be able to write Algorithm R flawlessly. A common pitfall is incorrect index handling. Remember: for item index `i` (0-based), the random range is `[0, i]` inclusive.
3.  **Identify the Pattern in Word Problems:** Look for keywords: "infinite stream," "unknown size," "too large to store," "random pick with equal probability." These signal that a reservoir sampling approach may be needed.
4.  **Combine with Other Structures:** Many Medium problems combine reservoir sampling with a hash map (for random pick by key) or require maintaining auxiliary data. Practice problems where the "item" you're sampling is a complex object or a key from a data structure.

Mastering these patterns turns a seemingly obscure topic into a reliable strength for your system design and algorithmic interviews.

[Practice all Reservoir Sampling questions on CodeJeet](/topic/reservoir-sampling)
