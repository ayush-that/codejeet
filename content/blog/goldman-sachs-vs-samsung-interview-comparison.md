---
title: "Goldman Sachs vs Samsung: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Samsung — difficulty levels, topic focus, and preparation strategy."
date: "2028-02-18"
category: "tips"
tags: ["goldman-sachs", "samsung", "comparison"]
---

Preparing for technical interviews at Goldman Sachs and Samsung requires understanding their distinct priorities in candidate evaluation. While both assess core algorithmic competency, their question volume, difficulty distribution, and topical focus differ significantly, reflecting their respective industry domains—investment banking/financial technology versus consumer electronics/hardware manufacturing. This comparison analyzes their question banks to guide efficient preparation.

## Question Volume and Difficulty

Goldman Sachs maintains a substantially larger and more challenging question bank. With 270 total questions (51 Easy, 171 Medium, 48 Hard), the volume is nearly four times that of Samsung. The difficulty distribution is heavily skewed toward Medium-difficulty problems, which constitute over 63% of the total. This indicates Goldman Sachs interviews are designed to rigorously test applied problem-solving under typical constraints, with a significant number of Hard questions to differentiate top candidates.

Samsung's question bank is more concise at 69 questions (15 Easy, 37 Medium, 17 Hard). The difficulty distribution is more balanced relative to its size, with Medium questions still forming the majority (~54%) but a notable proportion of Hard questions (~25%). The smaller bank suggests Samsung interviews may focus more on depth within a narrower set of problem patterns or on practical implementation skills relevant to systems and hardware-adjacent software.

**Example: A classic Medium-difficulty problem both might use is "Longest Substring Without Repeating Characters":**

<div class="code-group">

```python
def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len
```

```javascript
function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0,
    maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right))) {
            set.remove(s.charAt(left));
            left++;
        }
        set.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

## Topic Overlap

Both companies emphasize **Array** and **Dynamic Programming (DP)** as fundamental topics. This reflects the universal importance of data structure manipulation and optimized computation. **Hash Table** is also a shared key topic, essential for efficient lookups.

The primary divergence is in their secondary focuses. Goldman Sachs lists **String** manipulation as a top topic, aligning with financial data processing and log analysis. Samsung highlights **Two Pointers** as a core technique, which is crucial for solving array and string problems with optimal space complexity, often relevant in embedded systems or memory-constrained environments.

This overlap means preparing for core topics like Arrays, Hash Tables, and DP benefits candidates for both companies. A strong DP foundation is critical, as it appears in complex problems at both firms.

**Example: A Dynamic Programming problem, like "Coin Change":**

<div class="code-group">

```python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
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
```

```java
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
```

</div>

## Which to Prepare for First

Prepare for **Samsung first** if you are interviewing at both companies. Its smaller, focused question bank allows you to build core competency efficiently. Mastering Samsung's list—particularly Arrays, DP, Two Pointers, and Hash Tables—creates a solid foundation. The Two Pointers technique is highly transferable and will serve you well in Goldman Sachs' String and Array problems.

After covering Samsung's core, transition to **Goldman Sachs preparation**. Use the larger question bank to increase your exposure to problem variations and difficulty. Prioritize their heavy emphasis on Medium-difficulty String and Array problems, and ensure you can handle a subset of Hard DP questions. The volume will test your endurance and adaptability, which is the final step in comprehensive preparation.

This sequence builds from a focused core to broad, rigorous practice, maximizing efficiency.

For specific question lists and patterns, visit the Goldman Sachs and Samsung question pages: [Goldman Sachs](/company/goldman-sachs), [Samsung](/company/samsung).
