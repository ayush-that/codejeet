---
title: "Randomized Interview Questions: Patterns and Strategies"
description: "Master Randomized problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-06-09"
category: "dsa-patterns"
tags: ["randomized", "dsa", "interview prep"]
---

# Randomized Interview Questions: Patterns and Strategies

You’re in an interview, confidently solving a problem about selecting a random element from a stream. You implement a reservoir sampling solution, feeling good. Then the interviewer asks: “Now, what if we need to pick k elements, and we must guarantee the selection is uniformly random even if the stream length is unknown?” That’s when many candidates realize they’ve only memorized the algorithm—they don’t truly understand why it works. Randomized algorithms aren’t just about adding `Math.random()` to your code; they’re about leveraging probability to achieve elegant solutions to problems that seem intractable with deterministic approaches.

What makes randomized questions particularly challenging is that they test both algorithmic thinking and mathematical intuition. You need to reason about probability distributions, expected values, and worst-case scenarios—all while writing clean, efficient code. The data shows why this matters: among 12 common randomized questions, 75% are Medium difficulty and 25% are Hard, with zero Easy problems. This isn’t beginner material.

## Common Patterns

### 1. Reservoir Sampling

This is the classic pattern for selecting random elements from a stream of unknown length. The intuition is beautiful: maintain a candidate and replace it with decreasing probability as you see more elements. For k elements, you maintain a reservoir of size k and replace elements with probability k/(i+1) for the i-th element.

<div class="code-group">

```python
import random

class Solution:
    def __init__(self, nums):
        self.nums = nums

    def pick(self, target):
        # Reservoir sampling for k=1
        count = 0
        result = -1
        for i, num in enumerate(self.nums):
            if num == target:
                count += 1
                # Replace with probability 1/count
                if random.randint(1, count) == 1:
                    result = i
        return result

# Time: O(n) | Space: O(1) for pick() method
# The probability any target index is selected = 1/(number of targets)
```

```javascript
class Solution {
  constructor(nums) {
    this.nums = nums;
  }

  pick(target) {
    let count = 0;
    let result = -1;

    for (let i = 0; i < this.nums.length; i++) {
      if (this.nums[i] === target) {
        count++;
        // Replace with probability 1/count
        if (Math.floor(Math.random() * count) === 0) {
          result = i;
        }
      }
    }
    return result;
  }
}

// Time: O(n) | Space: O(1) for pick() method
```

```java
import java.util.Random;

class Solution {
    private int[] nums;
    private Random rand;

    public Solution(int[] nums) {
        this.nums = nums;
        this.rand = new Random();
    }

    public int pick(int target) {
        int count = 0;
        int result = -1;

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                count++;
                // Replace with probability 1/count
                if (rand.nextInt(count) == 0) {
                    result = i;
                }
            }
        }
        return result;
    }
}

// Time: O(n) | Space: O(1) for pick() method
```

</div>

**Related problems:** Random Pick Index (#398), Linked List Random Node (#382)

### 2. Randomized Partition (QuickSelect)

This pattern uses randomization to achieve expected O(n) time for selection problems. By randomly choosing a pivot, we avoid worst-case O(n²) behavior. The intuition: bad pivots become statistically unlikely over multiple trials.

<div class="code-group">

```python
import random

def findKthLargest(nums, k):
    def partition(left, right, pivot_idx):
        pivot = nums[pivot_idx]
        # Move pivot to end
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        store_idx = left

        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1

        # Move pivot to final position
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx

    def select(left, right, k_smallest):
        if left == right:
            return nums[left]

        # Random pivot
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)

        if k_smallest == pivot_idx:
            return nums[k_smallest]
        elif k_smallest < pivot_idx:
            return select(left, pivot_idx - 1, k_smallest)
        else:
            return select(pivot_idx + 1, right, k_smallest)

    # kth largest = (n-k)th smallest
    return select(0, len(nums) - 1, len(nums) - k)

# Time: O(n) average, O(n²) worst-case | Space: O(1)
# Randomization makes worst-case extremely unlikely
```

```javascript
function findKthLargest(nums, k) {
  function partition(left, right, pivotIdx) {
    const pivot = nums[pivotIdx];
    // Move pivot to end
    [nums[pivotIdx], nums[right]] = [nums[right], nums[pivotIdx]];
    let storeIdx = left;

    for (let i = left; i < right; i++) {
      if (nums[i] < pivot) {
        [nums[storeIdx], nums[i]] = [nums[i], nums[storeIdx]];
        storeIdx++;
      }
    }

    // Move pivot to final position
    [nums[right], nums[storeIdx]] = [nums[storeIdx], nums[right]];
    return storeIdx;
  }

  function select(left, right, kSmallest) {
    if (left === right) return nums[left];

    // Random pivot
    const pivotIdx = left + Math.floor(Math.random() * (right - left + 1));
    const newPivotIdx = partition(left, right, pivotIdx);

    if (kSmallest === newPivotIdx) {
      return nums[kSmallest];
    } else if (kSmallest < newPivotIdx) {
      return select(left, newPivotIdx - 1, kSmallest);
    } else {
      return select(newPivotIdx + 1, right, kSmallest);
    }
  }

  // kth largest = (n-k)th smallest
  return select(0, nums.length - 1, nums.length - k);
}

// Time: O(n) average, O(n²) worst-case | Space: O(1)
```

```java
import java.util.Random;

class Solution {
    private Random rand = new Random();

    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, 0, nums.length - 1, nums.length - k);
    }

    private int quickSelect(int[] nums, int left, int right, int kSmallest) {
        if (left == right) return nums[left];

        // Random pivot
        int pivotIdx = left + rand.nextInt(right - left + 1);
        pivotIdx = partition(nums, left, right, pivotIdx);

        if (kSmallest == pivotIdx) {
            return nums[kSmallest];
        } else if (kSmallest < pivotIdx) {
            return quickSelect(nums, left, pivotIdx - 1, kSmallest);
        } else {
            return quickSelect(nums, pivotIdx + 1, right, kSmallest);
        }
    }

    private int partition(int[] nums, int left, int right, int pivotIdx) {
        int pivot = nums[pivotIdx];
        // Move pivot to end
        swap(nums, pivotIdx, right);
        int storeIdx = left;

        for (int i = left; i < right; i++) {
            if (nums[i] < pivot) {
                swap(nums, storeIdx, i);
                storeIdx++;
            }
        }

        // Move pivot to final position
        swap(nums, right, storeIdx);
        return storeIdx;
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}

// Time: O(n) average, O(n²) worst-case | Space: O(1)
```

</div>

**Related problems:** Kth Largest Element in an Array (#215), Top K Frequent Elements (#347) with quickselect variation

### 3. Rejection Sampling

When you have a random number generator for one distribution but need another, rejection sampling lets you transform it. The intuition: generate points in a bounding box and accept only those that fall under your desired distribution curve.

<div class="code-group">

```python
import random
import math

def rand7():
    """Generate random integer 1-7 using only rand5()"""
    while True:
        # Generate uniform distribution 0-24
        num = 5 * (random.randint(1, 5) - 1) + (random.randint(1, 5) - 1)
        # Reject samples 21-24 to maintain uniformity
        if num < 21:
            return (num % 7) + 1

# Time: O(1) expected (21/25 acceptance probability) | Space: O(1)
# Each iteration has 21/25 = 84% chance of acceptance
```

```javascript
function rand7() {
  while (true) {
    // Generate uniform distribution 0-24
    const num = 5 * (rand5() - 1) + (rand5() - 1);
    // Reject samples 21-24 to maintain uniformity
    if (num < 21) {
      return (num % 7) + 1;
    }
  }
}

function rand5() {
  return Math.floor(Math.random() * 5) + 1;
}

// Time: O(1) expected | Space: O(1)
```

```java
class Solution extends SolBase {
    public int rand7() {
        while (true) {
            // Generate uniform distribution 0-24
            int num = 5 * (rand5() - 1) + (rand5() - 1);
            // Reject samples 21-24 to maintain uniformity
            if (num < 21) {
                return (num % 7) + 1;
            }
        }
    }
}

// Time: O(1) expected | Space: O(1)
```

</div>

**Related problems:** Implement Rand10() Using Rand7() (#470), Generate Random Point in a Circle (#478)

## When to Use Randomized vs Alternatives

Recognizing when to reach for randomization is crucial. Here’s your decision framework:

1. **Streaming data with unknown length** → Reservoir sampling. Alternative: Store everything (O(n) space) if you can afford it.

2. **Selection/order statistics (kth largest/smallest)** → Quickselect with random pivot. Alternative: Sorting (O(n log n)) is simpler but slower for large n; heap (O(n log k)) for top-k when k is small.

3. **Distribution transformation** → Rejection sampling. Alternative: Lookup tables if the transformation is simple and memory isn’t constrained.

4. **Avoiding worst-case inputs** → Randomization in algorithms like quicksort or hash functions. Alternative: Deterministic pivot selection (median-of-medians gives O(n) worst-case but with high constant factor).

The key insight: randomized algorithms often trade deterministic worst-case guarantees for better average-case performance with simpler implementations. In interviews, you must justify this tradeoff—explain why the probability of worst-case is acceptably low.

## Edge Cases and Gotchas

1. **Random seed and determinism**: In production, you might need reproducible results for debugging. Mention that you’d use a fixed seed in tests. In Python: `random.seed(42)`; in Java: `new Random(42)`.

2. **Probability proof requirements**: Interviewers often ask you to prove uniformity. For reservoir sampling: The probability the i-th element is in the reservoir = k/n. Proof: It enters with probability k/i, and stays (not replaced by later elements) = Π\_{j=i+1}^n (1 - k/j) = k/n.

3. **Integer overflow in random generation**: When combining multiple random calls (like 5\*rand5() + rand5()), ensure you don’t overflow. Use 64-bit integers if needed.

4. **Infinite loop risk in rejection sampling**: Always verify your acceptance probability is bounded away from zero. For rand7() from rand5(), acceptance probability is 21/25 = 84%, so expected iterations = 25/21 ≈ 1.19.

## Difficulty Breakdown

The 75% Medium, 25% Hard split tells you something important: randomized questions are inherently challenging. Easy problems don’t exist because even basic randomization requires probabilistic reasoning.

Prioritize Medium problems first—they teach the core patterns. The Hard problems usually combine randomization with other advanced techniques (like data structures or math). Don’t jump to Hard until you’re comfortable proving correctness for Medium problems.

## Which Companies Ask Randomized

- **Google** (/company/google): Loves reservoir sampling and randomized selection. They often ask variations where you need to prove correctness mathematically.

- **Meta** (/company/meta): Frequently asks randomization in system design contexts—like load balancing or A/B testing—but also in coding interviews for sampling problems.

- **Amazon** (/company/amazon): Tends toward practical applications: random playlist generation, recommendation sampling, and streaming algorithms.

- **Uber** (/company/uber): Asks about geospatial randomization (pick random point in circle/rectangle) and ride-matching simulations.

- **LinkedIn** (/company/linkedin): Focuses on feed randomization and weighted random selection (pick from items with different probabilities).

Each company has a style: Google wants mathematical rigor, Meta wants practical systems thinking, Amazon wants business applications, Uber wants spatial reasoning, LinkedIn wants weighted probability.

## Study Tips

1. **Master the proofs, not just the code**: For each pattern, be able to prove why it produces a uniform random distribution. This is what separates candidates who memorized from those who understand.

2. **Practice in this order**:
   - Start with Random Pick Index (#398) to understand basic reservoir sampling
   - Move to Kth Largest Element (#215) for randomized selection
   - Try Implement Rand10() Using Rand7() (#470) for rejection sampling
   - Attempt Shuffle an Array (#384) for Fisher-Yates shuffle
   - Finally tackle Generate Random Point in a Circle (#478) for geometric applications

3. **Implement from scratch multiple times**: These algorithms are subtle. Implement each pattern 3 times: immediately after learning, the next day, and a week later.

4. **Pair probabilistic reasoning with coding**: When practicing, verbalize the probability calculations as you code. “The i-th element has probability 1/i of being selected, and for j > i, the probability it survives is (1 - 1/j)...”

Randomized questions test a unique blend of algorithmic thinking and mathematical maturity. They reveal whether you understand why an algorithm works, not just how to implement it. The patterns are few but deep—master them, and you’ll handle these questions with confidence.

[Practice all Randomized questions on CodeJeet](/topic/randomized)
