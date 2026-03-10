---
title: "How to Solve Maximum Performance of a Team — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Performance of a Team. Hard difficulty, 47.7% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2027-04-17"
category: "dsa-patterns"
tags: ["maximum-performance-of-a-team", "array", "greedy", "sorting", "hard"]
---

# How to Solve Maximum Performance of a Team

You need to form a team of at most `k` engineers to maximize performance, where performance is defined as the sum of their speeds multiplied by the minimum efficiency among them. This problem is tricky because you need to balance two competing factors: you want high efficiency (since it's a multiplier) but also high total speed, and you can only pick at most `k` engineers. The key insight is that if you fix the minimum efficiency, you can greedily pick the fastest engineers with efficiency at least that value.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

```
n = 3, k = 2
speed = [2, 8, 3]
efficiency = [5, 4, 6]
```

We need to choose at most 2 engineers. Let's think through some combinations:

1. If we pick engineers 0 and 2: speeds = 2+3=5, min efficiency = min(5,6)=5 → performance = 5×5=25
2. If we pick engineers 0 and 1: speeds = 2+8=10, min efficiency = min(5,4)=4 → performance = 10×4=40
3. If we pick engineers 1 and 2: speeds = 8+3=11, min efficiency = min(4,6)=4 → performance = 11×4=44

The best is 44. But how do we find this systematically?

Here's the optimal approach in action:

**Step 1:** Combine and sort engineers by efficiency in descending order:

- Engineer 2: (speed=3, efficiency=6)
- Engineer 0: (speed=2, efficiency=5)
- Engineer 1: (speed=8, efficiency=4)

**Step 2:** Process engineers one by one, treating each as the minimum efficiency in our team:

- Process engineer 2 (eff=6): Add speed 3 to team. Team has 1 engineer, speeds sum=3. Performance = 3×6=18
- Process engineer 0 (eff=5): Add speed 2 to team. Team has 2 engineers, speeds sum=5. Performance = 5×5=25
- Process engineer 1 (eff=4): Add speed 8 to team. Now team has 3 engineers, but k=2. Remove smallest speed (2). Team has engineers 1 and 2, speeds sum=11. Performance = 11×4=44

The maximum we saw was 44, which matches our earlier calculation.

## Brute Force Approach

A brute force solution would try all possible subsets of size 1 through k from n engineers. For each subset:

1. Calculate the sum of speeds
2. Find the minimum efficiency
3. Compute performance = sum × min_efficiency
4. Track the maximum

The number of subsets is C(n,1) + C(n,2) + ... + C(n,k), which grows exponentially with n. Even for moderate n and k, this becomes infeasible. For example, with n=100 and k=10, we'd need to check over 1.7×10^13 subsets!

<div class="code-group">

```python
# Brute force solution - TOO SLOW for large inputs
# Time: O(2^n) in worst case | Space: O(n) for recursion
def maxPerformanceBruteForce(n, speed, efficiency, k):
    max_perf = 0

    # Try all subsets using bitmasking
    for mask in range(1, 1 << n):
        # Count bits to check subset size
        if bin(mask).count('1') > k:
            continue

        total_speed = 0
        min_eff = float('inf')

        for i in range(n):
            if mask & (1 << i):
                total_speed += speed[i]
                min_eff = min(min_eff, efficiency[i])

        max_perf = max(max_perf, total_speed * min_eff)

    return max_perf % (10**9 + 7)
```

```javascript
// Brute force solution - TOO SLOW for large inputs
// Time: O(2^n) in worst case | Space: O(n) for recursion
function maxPerformanceBruteForce(n, speed, efficiency, k) {
  let maxPerf = 0;

  // Try all subsets using bitmasking
  for (let mask = 1; mask < 1 << n; mask++) {
    // Count bits to check subset size
    let bitCount = 0;
    let temp = mask;
    while (temp > 0) {
      bitCount += temp & 1;
      temp >>= 1;
    }
    if (bitCount > k) continue;

    let totalSpeed = 0;
    let minEff = Infinity;

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        totalSpeed += speed[i];
        minEff = Math.min(minEff, efficiency[i]);
      }
    }

    maxPerf = Math.max(maxPerf, totalSpeed * minEff);
  }

  return maxPerf % 1000000007;
}
```

```java
// Brute force solution - TOO SLOW for large inputs
// Time: O(2^n) in worst case | Space: O(n) for recursion
public int maxPerformanceBruteForce(int n, int[] speed, int[] efficiency, int k) {
    long maxPerf = 0;

    // Try all subsets using bitmasking
    for (int mask = 1; mask < (1 << n); mask++) {
        // Count bits to check subset size
        if (Integer.bitCount(mask) > k) continue;

        long totalSpeed = 0;
        int minEff = Integer.MAX_VALUE;

        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                totalSpeed += speed[i];
                minEff = Math.min(minEff, efficiency[i]);
            }
        }

        maxPerf = Math.max(maxPerf, totalSpeed * minEff);
    }

    return (int)(maxPerf % 1000000007);
}
```

</div>

## Optimized Approach

The key insight is: **If we fix the minimum efficiency in our team, we should pick the engineers with the highest speeds among those with efficiency ≥ this minimum.**

Here's the step-by-step reasoning:

1. **Sort engineers by efficiency in descending order** - This way, when we process engineers one by one, the current engineer's efficiency is always the minimum in our potential team.

2. **Maintain a min-heap of speeds** - As we process engineers, we add their speed to our team. If the team size exceeds k, we remove the engineer with the smallest speed (since we want to maximize total speed).

3. **Track running sum of speeds** - This avoids recalculating the sum each time.

4. **Calculate performance at each step** - For each engineer we process as the potential minimum efficiency, performance = (current sum of speeds) × (current engineer's efficiency).

5. **Take the maximum** - Track the maximum performance seen across all engineers as potential minimum efficiency.

Why does this work? When we process engineer i with efficiency e, all engineers we've processed so far have efficiency ≥ e (because we sorted descending). So e is indeed the minimum efficiency in our current team. By maintaining only the top k speeds in a min-heap, we ensure we have the best possible team with e as the minimum efficiency.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n log k) for heap operations = O(n log n)
# Space: O(n) for storing engineers + O(k) for heap = O(n)
def maxPerformance(n, speed, efficiency, k):
    # Step 1: Combine speed and efficiency for each engineer
    engineers = list(zip(efficiency, speed))

    # Step 2: Sort by efficiency in descending order
    # This ensures when we process an engineer, their efficiency is the minimum
    # in the current team (since all previous engineers had higher efficiency)
    engineers.sort(reverse=True)

    # Step 3: Initialize min-heap to track speeds and running sum
    import heapq
    min_heap = []  # will store speeds of selected engineers
    speed_sum = 0
    max_performance = 0

    # Step 4: Process each engineer as potential minimum efficiency
    for eff, spd in engineers:
        # Add current engineer's speed to our team
        heapq.heappush(min_heap, spd)
        speed_sum += spd

        # If team size exceeds k, remove the engineer with smallest speed
        # We use a min-heap, so the smallest speed is at the root
        if len(min_heap) > k:
            # Remove the smallest speed from team
            smallest_speed = heapq.heappop(min_heap)
            speed_sum -= smallest_speed

        # Calculate performance with current engineer as minimum efficiency
        # All engineers in heap have efficiency >= current eff (due to sorting)
        current_performance = speed_sum * eff

        # Update maximum performance
        max_performance = max(max_performance, current_performance)

    # Step 5: Return result modulo 10^9 + 7
    return max_performance % (10**9 + 7)
```

```javascript
// Time: O(n log n) for sorting + O(n log k) for heap operations = O(n log n)
// Space: O(n) for storing engineers + O(k) for heap = O(n)
function maxPerformance(n, speed, efficiency, k) {
  // Step 1: Combine speed and efficiency for each engineer
  const engineers = [];
  for (let i = 0; i < n; i++) {
    engineers.push([efficiency[i], speed[i]]);
  }

  // Step 2: Sort by efficiency in descending order
  // This ensures when we process an engineer, their efficiency is the minimum
  // in the current team (since all previous engineers had higher efficiency)
  engineers.sort((a, b) => b[0] - a[0]);

  // Step 3: Initialize min-heap to track speeds and running sum
  // JavaScript doesn't have built-in heap, so we'll use array and sort
  // or implement a proper min-heap. Here's an efficient approach:
  const minHeap = new MinHeap();
  let speedSum = 0;
  let maxPerformance = 0;

  // Step 4: Process each engineer as potential minimum efficiency
  for (const [eff, spd] of engineers) {
    // Add current engineer's speed to our team
    minHeap.push(spd);
    speedSum += spd;

    // If team size exceeds k, remove the engineer with smallest speed
    if (minHeap.size() > k) {
      // Remove the smallest speed from team
      const smallestSpeed = minHeap.pop();
      speedSum -= smallestSpeed;
    }

    // Calculate performance with current engineer as minimum efficiency
    // All engineers in heap have efficiency >= current eff (due to sorting)
    const currentPerformance = speedSum * eff;

    // Update maximum performance
    maxPerformance = Math.max(maxPerformance, currentPerformance);
  }

  // Step 5: Return result modulo 10^9 + 7
  return maxPerformance % 1000000007;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }

      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(n log n) for sorting + O(n log k) for heap operations = O(n log n)
// Space: O(n) for storing engineers + O(k) for heap = O(n)
public int maxPerformance(int n, int[] speed, int[] efficiency, int k) {
    // Step 1: Combine speed and efficiency for each engineer
    int[][] engineers = new int[n][2];
    for (int i = 0; i < n; i++) {
        engineers[i][0] = efficiency[i];
        engineers[i][1] = speed[i];
    }

    // Step 2: Sort by efficiency in descending order
    // This ensures when we process an engineer, their efficiency is the minimum
    // in the current team (since all previous engineers had higher efficiency)
    Arrays.sort(engineers, (a, b) -> b[0] - a[0]);

    // Step 3: Initialize min-heap to track speeds and running sum
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    long speedSum = 0;  // Use long to avoid overflow
    long maxPerformance = 0;

    // Step 4: Process each engineer as potential minimum efficiency
    for (int[] engineer : engineers) {
        int eff = engineer[0];
        int spd = engineer[1];

        // Add current engineer's speed to our team
        minHeap.offer(spd);
        speedSum += spd;

        // If team size exceeds k, remove the engineer with smallest speed
        // PriorityQueue in Java is min-heap by default
        if (minHeap.size() > k) {
            // Remove the smallest speed from team
            int smallestSpeed = minHeap.poll();
            speedSum -= smallestSpeed;
        }

        // Calculate performance with current engineer as minimum efficiency
        // All engineers in heap have efficiency >= current eff (due to sorting)
        long currentPerformance = speedSum * eff;

        // Update maximum performance
        maxPerformance = Math.max(maxPerformance, currentPerformance);
    }

    // Step 5: Return result modulo 10^9 + 7
    return (int)(maxPerformance % 1000000007);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the engineers by efficiency: O(n log n)
- Processing each engineer: O(n)
- For each engineer, heap operations (push/pop): O(log k)
- Total: O(n log n) + O(n log k) = O(n log n) since log n dominates log k for k ≤ n

**Space Complexity: O(n)**

- Storing the combined engineer data: O(n)
- Min-heap storing at most k elements: O(k)
- Total: O(n) since n ≥ k

## Common Mistakes

1. **Forgetting to use modulo at the end** - The problem requires returning the result modulo 10^9+7. Many candidates calculate the correct maximum but forget this final step.

2. **Using the wrong heap type** - You need a min-heap to remove the smallest speed when the team exceeds k. Using a max-heap would remove the largest speed, which is wrong.

3. **Not using long/int64 for intermediate calculations** - The product of speed sum and efficiency can easily exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C, BigInt in JavaScript).

4. **Incorrect sorting order** - You must sort by efficiency in **descending** order. If you sort ascending, the current engineer's efficiency won't be the minimum in the team.

5. **Not handling the "at most k" condition properly** - The problem says "at most k", not "exactly k". Your solution should work for teams of size 1 through k.

## When You'll See This Pattern

This "sort + heap" pattern appears in problems where you need to:

1. Select a subset of items with some constraint
2. Optimize a product or sum that depends on both individual values and a collective property (like minimum or maximum)

Similar LeetCode problems:

- **Meeting Rooms II** (Medium) - Sort intervals, use min-heap to track end times
- **Top K Frequent Elements** (Medium) - Use heap to track top k frequencies
- **IPO** (Hard) - Very similar structure: sort projects by capital, use max-heap for profits
- **Car Pooling** (Medium) - Sort events, use data structure to track current load

## Key Takeaways

1. **When optimizing a product of (sum × min/max), try fixing the min/max value** - Sort by that attribute, then greedily select the best items for the sum component.

2. **Heap + sorting is powerful for "select top k with constraint" problems** - Sort by one criterion, use heap to dynamically maintain the best k items by another criterion.

3. **Always check for overflow in product calculations** - When multiplying two potentially large numbers, use 64-bit integers or modulo arithmetic early.

Related problems: [Maximum Fruits Harvested After at Most K Steps](/problem/maximum-fruits-harvested-after-at-most-k-steps)
