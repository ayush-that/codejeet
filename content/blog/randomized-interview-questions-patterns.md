---
title: "Randomized Interview Questions: Patterns and Strategies"
description: "Master Randomized problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-19"
category: "dsa-patterns"
tags: ["randomized", "dsa", "interview prep"]
---

Randomized algorithms are a specialized but critical domain in technical interviews. Unlike deterministic algorithms that produce the same output for a given input, randomized algorithms incorporate an element of randomness, leading to probabilistic guarantees on correctness or performance. In interviews, they test a candidate's ability to think about trade-offs—often sacrificing guaranteed optimality for significant gains in speed or simplicity. They appear in problems involving sampling, load balancing, quick selection, and systems design, making them a favorite for companies evaluating a candidate's comfort with probability and non-deterministic system behavior.

## Common Patterns

Recognizing the underlying pattern is key to solving randomized problems efficiently.

### 1. Reservoir Sampling

This pattern is used to select `k` items uniformly at random from a data stream of unknown or very large size `n`. The core idea is to build the reservoir of size `k` as you read the stream, updating it with decreasing probability.

<div class="code-group">

```python
import random

def reservoir_sample(stream, k):
    reservoir = []
    for i, element in enumerate(stream):
        if i < k:
            reservoir.append(element)
        else:
            # Randomly replace an element in the reservoir
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

public List<Integer> reservoirSample(int[] stream, int k) {
    List<Integer> reservoir = new ArrayList<>();
    Random rand = new Random();
    for (int i = 0; i < stream.length; i++) {
        if (i < k) {
            reservoir.add(stream[i]);
        } else {
            int j = rand.nextInt(i + 1);
            if (j < k) {
                reservoir.set(j, stream[i]);
            }
        }
    }
    return reservoir;
}
```

</div>

### 2. Randomized QuickSelect / Quicksort Pivot Selection

The performance of QuickSelect (for finding the k-th smallest element) and Quicksort heavily depends on pivot choice. A randomized pivot selection ensures average-case O(n) and O(n log n) time complexity, respectively, mitigating worst-case scenarios.

<div class="code-group">

```python
import random

def partition(arr, low, high):
    pivot_idx = random.randint(low, high)
    arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]  # move pivot to end
    pivot = arr[high]
    i = low
    for j in range(low, high):
        if arr[j] <= pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[high] = arr[high], arr[i]
    return i

def quickselect(arr, low, high, k):
    if low <= high:
        pi = partition(arr, low, high)
        if pi == k:
            return arr[pi]
        elif pi < k:
            return quickselect(arr, pi + 1, high, k)
        else:
            return quickselect(arr, low, pi - 1, k)
```

```javascript
function partition(arr, low, high) {
  const pivotIdx = Math.floor(Math.random() * (high - low + 1)) + low;
  [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}

function quickselect(arr, low, high, k) {
  if (low <= high) {
    const pi = partition(arr, low, high);
    if (pi === k) {
      return arr[pi];
    } else if (pi < k) {
      return quickselect(arr, pi + 1, high, k);
    } else {
      return quickselect(arr, low, pi - 1, k);
    }
  }
}
```

```java
import java.util.Random;

public class QuickSelect {
    private static Random rand = new Random();

    private static int partition(int[] arr, int low, int high) {
        int pivotIdx = rand.nextInt(high - low + 1) + low;
        int temp = arr[pivotIdx];
        arr[pivotIdx] = arr[high];
        arr[high] = temp;

        int pivot = arr[high];
        int i = low;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i++;
            }
        }
        temp = arr[i];
        arr[i] = arr[high];
        arr[high] = temp;
        return i;
    }

    public static int quickselect(int[] arr, int low, int high, int k) {
        if (low <= high) {
            int pi = partition(arr, low, high);
            if (pi == k) {
                return arr[pi];
            } else if (pi < k) {
                return quickselect(arr, pi + 1, high, k);
            } else {
                return quickselect(arr, low, pi - 1, k);
            }
        }
        return -1;
    }
}
```

</div>

### 3. Shuffling (Fisher-Yates Algorithm)

Generating a uniformly random permutation of an array is a fundamental operation. The Fisher-Yates (or Knuth) shuffle runs in O(n) time and ensures every permutation is equally likely.

### 4. Randomized Data Structures & Hashing

This involves using randomness in the design of data structures, like in Randomized Sets (insert, delete, getRandom in O(1)) where a hash map is paired with a list and a random index is selected. It also includes probabilistic data structures like Bloom filters.

## Difficulty Breakdown

Our dataset of 12 questions shows a distinct skew: **0% Easy, 75% Medium, and 25% Hard**. This split is revealing.

The absence of Easy questions indicates that "Randomized" is rarely a trivial topic. It inherently combines algorithmic design with probabilistic reasoning, pushing it beyond basic comprehension. The dominance of Medium questions (9 out of 12) suggests the core of this topic is accessible to a prepared candidate. These problems typically ask for a direct implementation of a known pattern—like Reservoir Sampling for a stream or using a random pivot in QuickSelect. The 25% Hard questions (3 out of 12) involve more complex systems, intricate proofs of correctness, or combining randomization with other advanced paradigms like divide-and-conquer or graph algorithms.

## Which Companies Ask Randomized

Randomized questions are a staple at companies dealing with large-scale data, distributed systems, and performance-critical applications.

- **[Google](/company/google)**: Frequently asks about randomized algorithms in systems design (e.g., load balancing, consistent hashing) and algorithmic problems (e.g., sampling from a stream).
- **[Meta](/company/meta)**: Uses them in problems related to large datasets, A/B testing infrastructure, and algorithmic challenges involving random selection.
- **[Amazon](/company/amazon)**: Relevant for problems in their e-commerce and AWS domains, such as randomized caching strategies or selecting random items from a catalog.
- **[Uber](/company/uber)**: Applies randomness in problems related to geospatial data sampling, ride-matching simulations, and system reliability.
- **[LinkedIn](/company/linkedin)**: Asks questions involving random member selection, feed sampling, and probabilistic data structures for analytics.

## Study Tips

1.  **Master the Core Four**: Ensure you can implement Reservoir Sampling, Randomized QuickSelect/Quicksort, Fisher-Yates Shuffle, and a Randomized Set from memory. These are the building blocks.
2.  **Focus on Probability Reasoning**: Be prepared to justify _why_ your algorithm yields a uniform distribution or achieves an expected runtime. Interviewers often ask for a brief proof or explanation.
3.  **Practice Integration**: Work on problems where randomization is one component of a larger solution, such as using a random pivot in a selection algorithm within a graph problem.
4.  **Simulate the Randomness**: When practicing, manually step through your algorithm with a small, fixed set of random choices (e.g., "if the random index is 2...") to verify its logic and edge cases.

[Practice all Randomized questions on CodeJeet](/topic/randomized)
