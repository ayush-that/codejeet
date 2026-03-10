---
title: "How to Solve New 21 Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode New 21 Game. Medium difficulty, 52.0% acceptance rate. Topics: Math, Dynamic Programming, Sliding Window, Probability and Statistics."
date: "2026-07-20"
category: "dsa-patterns"
tags: ["new-21-game", "math", "dynamic-programming", "sliding-window", "medium"]
---

# How to Solve New 21 Game

The New 21 Game is a probability problem where Alice draws random points between 1 and `maxPts` until her total reaches at least `k`, and we need to find the probability she ends with `n` or fewer points. What makes this tricky is that it's not a simple combinatorial problem — the draws stop when reaching `k`, creating a conditional probability scenario that requires careful dynamic programming.

## Visual Walkthrough

Let's trace through a small example: `n = 6, k = 1, maxPts = 10`

**Step 1: Understanding the rules**

- Alice starts at 0 points
- She draws while her score < `k` (which is 1)
- Since 0 < 1, she draws once
- She gets a random number between 1 and 10
- We want the probability her final score ≤ 6

**Step 2: Manual calculation**
Since she only draws once (because after one draw, her score ≥ 1 = k), the probability is simply:

- She needs to draw ≤ 6
- Possible draws: 1 through 10 (10 possibilities)
- Favorable draws: 1 through 6 (6 possibilities)
- Probability = 6/10 = 0.6

Now let's try `n = 6, k = 2, maxPts = 3`

**Step 3: More complex scenario**
Alice draws while score < 2:

- Start at 0
- First draw: 1, 2, or 3 with equal probability

**Case analysis:**

1. Draw 1: Now score = 1 (< 2), draw again
   - Second draw possibilities: 1, 2, 3
   - Final scores: 2, 3, 4
   - All ≤ 6? Yes (2, 3, 4 all ≤ 6)
   - Probability for this branch: (1/3) × 1 = 1/3

2. Draw 2: Now score = 2 (≥ 2), stop
   - Final score = 2 ≤ 6 ✓
   - Probability: 1/3

3. Draw 3: Now score = 3 (≥ 2), stop
   - Final score = 3 ≤ 6 ✓
   - Probability: 1/3

Total probability = 1/3 + 1/3 + 1/3 = 1.0

This manual approach becomes exponentially complex as `k` grows — we need a systematic method.

## Brute Force Approach

The brute force approach uses recursion to explore all possible sequences of draws:

1. Start with score = 0
2. If score ≥ k: check if score ≤ n, return 1 or 0
3. Otherwise: for each possible draw d from 1 to maxPts, recursively compute probability from score + d
4. Average all results (divide by maxPts)

<div class="code-group">

```python
def new21Game_brute(k, n, maxPts):
    def dfs(score):
        if score >= k:
            return 1.0 if score <= n else 0.0

        total = 0.0
        for draw in range(1, maxPts + 1):
            total += dfs(score + draw)
        return total / maxPts

    return dfs(0)
```

```javascript
function new21GameBrute(k, n, maxPts) {
  function dfs(score) {
    if (score >= k) {
      return score <= n ? 1.0 : 0.0;
    }

    let total = 0.0;
    for (let draw = 1; draw <= maxPts; draw++) {
      total += dfs(score + draw);
    }
    return total / maxPts;
  }

  return dfs(0);
}
```

```java
public double new21GameBrute(int k, int n, int maxPts) {
    return dfs(0, k, n, maxPts);
}

private double dfs(int score, int k, int n, int maxPts) {
    if (score >= k) {
        return score <= n ? 1.0 : 0.0;
    }

    double total = 0.0;
    for (int draw = 1; draw <= maxPts; draw++) {
        total += dfs(score + draw, k, n, maxPts);
    }
    return total / maxPts;
}
```

</div>

**Why this fails:**

- Time complexity: O(maxPts^k) — exponential explosion
- Redundant calculations: Same scores reached via different paths
- Even for moderate k (like 10000), this is completely infeasible

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with a **sliding window** optimization:

1. **DP State**: Let dp[i] = probability of reaching exactly score i
2. **Base Case**: dp[0] = 1 (starting probability)
3. **Transition**: To reach score i, we must have come from some score j where i - j is between 1 and maxPts
   - dp[i] = (dp[i-1] + dp[i-2] + ... + dp[i-maxPts]) / maxPts
4. **Stopping Condition**: Once score ≥ k, we stop drawing
5. **Final Answer**: Sum of dp[i] for i from k to n (inclusive)

**The sliding window trick:**
Instead of summing maxPts terms for each i (O(n × maxPts)), maintain a running sum:

- windowSum = sum of last maxPts dp values
- When moving to i+1: windowSum += dp[i] - dp[i-maxPts]

**Special cases:**

- If k = 0: Alice never draws, score stays 0
- If n ≥ k + maxPts - 1: All stopping scores are ≤ n (since max score when stopping is k + maxPts - 1)

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
def new21Game(k, n, maxPts):
    """
    Calculate probability that Alice's score is <= n
    when she stops drawing at score >= k.

    Args:
        k: Stop drawing when score >= k
        n: Maximum score we consider "winning" (score <= n)
        maxPts: Maximum points per draw (range 1..maxPts)

    Returns:
        Probability as float
    """
    # Edge case: if k == 0, Alice never draws, score is always 0
    if k == 0:
        return 1.0

    # dp[i] = probability of reaching exactly score i
    dp = [0.0] * (n + 1)
    dp[0] = 1.0  # Starting probability

    # Running sum of last maxPts probabilities
    window_sum = 1.0
    probability = 0.0

    for i in range(1, n + 1):
        # dp[i] = average of previous maxPts probabilities
        dp[i] = window_sum / maxPts

        # If we can still draw from this state (i < k)
        if i < k:
            window_sum += dp[i]
        else:
            # Once i >= k, we stop drawing, add to final probability
            probability += dp[i]

        # Remove the probability that fell out of the window
        if i >= maxPts:
            window_sum -= dp[i - maxPts]

    return probability
```

```javascript
function new21Game(k, n, maxPts) {
  // Edge case: if k == 0, Alice never draws, score is always 0
  if (k === 0) {
    return 1.0;
  }

  // dp[i] = probability of reaching exactly score i
  const dp = new Array(n + 1).fill(0.0);
  dp[0] = 1.0; // Starting probability

  // Running sum of last maxPts probabilities
  let windowSum = 1.0;
  let probability = 0.0;

  for (let i = 1; i <= n; i++) {
    // dp[i] = average of previous maxPts probabilities
    dp[i] = windowSum / maxPts;

    // If we can still draw from this state (i < k)
    if (i < k) {
      windowSum += dp[i];
    } else {
      // Once i >= k, we stop drawing, add to final probability
      probability += dp[i];
    }

    // Remove the probability that fell out of the window
    if (i >= maxPts) {
      windowSum -= dp[i - maxPts];
    }
  }

  return probability;
}
```

```java
public double new21Game(int k, int n, int maxPts) {
    // Edge case: if k == 0, Alice never draws, score is always 0
    if (k == 0) {
        return 1.0;
    }

    // dp[i] = probability of reaching exactly score i
    double[] dp = new double[n + 1];
    dp[0] = 1.0;  // Starting probability

    // Running sum of last maxPts probabilities
    double windowSum = 1.0;
    double probability = 0.0;

    for (int i = 1; i <= n; i++) {
        // dp[i] = average of previous maxPts probabilities
        dp[i] = windowSum / maxPts;

        // If we can still draw from this state (i < k)
        if (i < k) {
            windowSum += dp[i];
        } else {
            // Once i >= k, we stop drawing, add to final probability
            probability += dp[i];
        }

        // Remove the probability that fell out of the window
        if (i >= maxPts) {
            windowSum -= dp[i - maxPts];
        }
    }

    return probability;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through scores from 1 to n exactly once
- Each iteration does O(1) operations (addition, subtraction, division)
- The sliding window optimization reduces from O(n × maxPts) to O(n)

**Space Complexity: O(n)**

- We maintain a dp array of size n+1
- Could be optimized to O(maxPts) by only storing last maxPts values, but O(n) is simpler and acceptable for typical constraints

## Common Mistakes

1. **Forgetting the k = 0 edge case**: When k = 0, Alice never draws, so her score is always 0, which is always ≤ n. The probability should be 1.0.

2. **Incorrect window management**: When i < maxPts, we shouldn't subtract anything from windowSum. The condition `if i >= maxPts:` is crucial.

3. **Confusing when to add to probability**: We only add dp[i] to the final probability when i ≥ k (when Alice would stop drawing). For i < k, she continues drawing, so we add dp[i] to windowSum for future calculations.

4. **Integer division**: In languages like Java, ensure you're using floating-point division (`/ maxPts`) not integer division (`/ maxPts` with integers would give 0).

## When You'll See This Pattern

This problem combines **dynamic programming** with **sliding window optimization**, a pattern that appears in:

1. **Climbing Stairs (LeetCode 70)**: Similar DP with limited steps, though simpler without probability.
2. **Minimum Window Substring (LeetCode 76)**: Different application of sliding window, but same core idea of maintaining a running aggregate.
3. **Maximum Sum Subarray of Size K (LeetCode 53 variant)**: Classic sliding window problem for efficient summation.
4. **Probability problems with Markov chains**: Any problem where the next state depends probabilistically on recent previous states.

The key pattern to recognize: when you need to compute a running sum/average of the last K elements efficiently, sliding window is your tool.

## Key Takeaways

1. **DP + Sliding Window is powerful**: When transitions depend on a fixed window of previous states (like sum of last maxPts values), use a running sum to avoid O(n × K) complexity.

2. **Probability DP often looks like expected value**: The recurrence dp[i] = average of previous states is common in probability problems where each choice is equally likely.

3. **Define states carefully**: Here, dp[i] = probability of reaching exactly score i (not probability of winning from score i). The right state definition makes the recurrence natural.

4. **Handle edge cases early**: k = 0 and n ≥ k + maxPts - 1 are special cases that simplify the problem significantly.

[Practice this problem on CodeJeet](/problem/new-21-game)
