---
title: "Goldman Sachs vs IBM: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and IBM — difficulty levels, topic focus, and preparation strategy."
date: "2028-01-11"
category: "tips"
tags: ["goldman-sachs", "ibm", "comparison"]
---

When preparing for technical interviews at major tech and finance firms, understanding the specific question patterns and difficulty distributions can significantly streamline your study. Goldman Sachs and IBM, while both prestigious, present distinct interview landscapes. Goldman Sachs focuses heavily on finance-aligned problem-solving with complex scenarios, whereas IBM's process is more typical of large-scale enterprise software engineering. This comparison breaks down their question volume, difficulty, and core topics to help you prioritize.

## Question Volume and Difficulty

The data shows a clear difference in both the scale and depth of technical assessment.

**Goldman Sachs (270 questions)** presents a larger and more challenging question bank. Its difficulty distribution (E51/M171/H48) reveals a strong emphasis on **Medium** problems, which comprise nearly two-thirds of their questions. The substantial number of **Hard** problems (48) indicates that candidates must be prepared for multi-layered algorithmic challenges, often involving optimization under constraints, which mirrors the quantitative and high-stakes nature of financial systems.

**IBM (170 questions)** has a more approachable question pool. Its distribution (E52/M102/H16) is heavily skewed towards **Easy** and **Medium** problems, with only a minimal presence of **Hard** questions. This suggests IBM's interviews are more focused on assessing solid foundational knowledge, clean code, and practical problem-solving rather than extreme algorithmic optimization. The lower total volume also means the question space is more contained and potentially easier to master.

## Topic Overlap

Both companies test fundamental data structures, but with different points of emphasis.

The strongest shared focus is on **Array** and **String** manipulation. These form the bedrock of most coding interviews. However, their application diverges:

- **Goldman Sachs** heavily prioritizes **Hash Table** and **Dynamic Programming (DP)**. Hash tables are crucial for efficient data lookup in financial data processing, while DP is essential for solving complex optimization problems, such as those found in risk analysis or algorithmic trading scenarios.
- **IBM** emphasizes **Two Pointers** and **Sorting**. These are classic techniques for solving problems involving sequences, intervals, or ordered data—common tasks in systems integration, data processing pipelines, and backend services.

Here is a typical problem that highlights Goldman's DP focus versus IBM's two-pointer focus:

<div class="code-group">

```python
# Goldman Sachs Style: DP (Coin Change)
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

# IBM Style: Two Pointers (Container With Most Water)
def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        max_area = max(max_area, (right - left) * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area
```

```javascript
// Goldman Sachs Style: DP (Coin Change)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// IBM Style: Two Pointers (Container With Most Water)
function maxArea(height) {
  let left = 0,
    right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    maxArea = Math.max(maxArea, (right - left) * Math.min(height[left], height[right]));
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}
```

```java
// Goldman Sachs Style: DP (Coin Change)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

// IBM Style: Two Pointers (Container With Most Water)
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;
    while (left < right) {
        maxArea = Math.max(maxArea, (right - left) * Math.min(height[left], height[right]));
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}
```

</div>

## Which to Prepare for First

Prepare for **IBM first** if you are early in your interview preparation cycle. The lower volume and reduced emphasis on Hard problems allow you to build confidence by mastering core data structures (Arrays, Strings) and essential techniques (Two Pointers, Sorting). Success here solidifies the fundamentals.

Prepare for **Goldman Sachs first** only if you are already strong in algorithms and are specifically targeting finance or quant roles. Its curriculum requires deep, advanced practice, particularly in Dynamic Programming and complex Hash Table applications. Use IBM-style problems as a warm-up, but allocate the majority of your time to mastering Medium and Hard problems for Goldman.

Start your targeted practice here: [Goldman Sachs Questions](/company/goldman-sachs) | [IBM Questions](/company/ibm)
