---
title: "How to Crack Goldman Sachs Coding Interviews in 2026"
description: "Complete guide to Goldman Sachs coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-01-23"
category: "company-guide"
company: "goldman-sachs"
tags: ["goldman-sachs", "interview prep", "leetcode"]
---

# How to Crack Goldman Sachs Coding Interviews in 2026

Goldman Sachs’s engineering interviews are a unique blend of financial rigor and software craftsmanship. While the process varies slightly by team and location, a typical 2026 software engineering candidate can expect: a recruiter screen, a HackerRank coding assessment (60-90 minutes, 2-3 problems), and 3-4 final round virtual interviews. These final rounds usually consist of 2-3 coding sessions, often with a focus on data structures and algorithms, and 1-2 sessions that mix system design with behavioral questions. What makes Goldman distinct is the consistent integration of finance-adjacent concepts—think optimizing transaction sequences, scheduling time-series data, or modeling simple financial instruments—within otherwise standard algorithmic problems. You’re not just writing code; you’re demonstrating you can build reliable, efficient systems that handle real-world, quantitative data.

## What Makes Goldman Sachs Different

At first glance, Goldman’s coding interviews resemble those at other top tech firms: LeetCode-style problems assessed for correctness, efficiency, and communication. However, three key differences shape their unique fingerprint.

First, **pragmatic optimization over theoretical extremes**. While FAANG companies might push you to find the O(n) solution for an O(n log n) problem, Goldman’s interviewers often prioritize a correct, well-explained, and maintainable solution first. They care deeply about edge cases and robustness, especially for problems involving numerical data or transactions. You’ll be expected to discuss trade-offs: “Is the 10% speed gain from this complex algorithm worth the added code complexity?” This reflects their engineering culture, where system reliability and clarity are paramount in financial contexts.

Second, **context matters more than pseudocode**. At some companies, sketching an approach can suffice. At Goldman, you must produce clean, compilable code in your chosen language. They assess your ability to translate a business or quantitative scenario into a working program. You might be given a problem about stock trade settlements or portfolio rebalancing—the underlying algorithm is standard (like greedy scheduling or two-pointer technique), but framing it correctly is part of the test.

Third, **the “system design” lens is applied earlier**. Even in coding rounds, interviewers may probe how your algorithm scales, how you’d handle data persistence, or what parts you’d parallelize. This isn’t full-blown system design, but it tests if you think beyond the function. For example, after solving a string processing problem, you might be asked, “How would you modify this if the input streamed in from multiple sources?”

## By the Numbers

An analysis of Goldman Sachs’s tagged questions reveals a clear strategy. Out of approximately 270 problems, the breakdown is: **51 Easy (19%), 171 Medium (63%), and 48 Hard (18%)**. This distribution is telling.

The **63% Medium** majority is your core battlefield. These problems test foundational data structures applied in slightly novel ways, often with a financial twist. You must be fluent in turning problem descriptions into the correct pattern. For instance, “Best Time to Buy and Sell Stock” variations (LeetCode #121, #122) are classics because they model core trading logic. The **18% Hard** problems often involve advanced Dynamic Programming or graph traversals, but note: many “Hard” problems at Goldman are Medium-difficulty problems made complex by intricate input constraints or output requirements, like “Max Points on a Line” (LeetCode #149), which is more about handling edge cases and precision than a revolutionary algorithm.

The key takeaway: Master Medium problems thoroughly. If you can reliably solve any Medium within 25 minutes, you’re in a strong position. The Easy problems are warm-ups or appear in early screening; the Hards are differentiators for top-tier roles.

## Top Topics to Focus On

Your study should be disproportionately weighted toward these areas, as they form the scaffolding for most Goldman problems.

**1. Array & String Manipulation**
Why: Financial data is often sequential—time-series prices, transaction logs, payment strings. Goldman loves problems that require in-place manipulation, sliding windows, or two-pointer techniques to optimize space, reflecting constraints of high-frequency systems.
_Pattern to master: Sliding Window for subarray/substring problems._
Example Problem: **Longest Substring Without Repeating Characters (LeetCode #3)**. This is a quintessential Goldman problem because it models finding a stable, non-conflicting sequence within a stream of data.

<div class="code-group">

```python
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s: str) -> int:
    char_index_map = {}
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        # If char is seen and its index is within current window, shrink window
        if char in char_index_map and char_index_map[char] >= left:
            left = char_index_map[char] + 1
        # Update char's latest index
        char_index_map[char] = right
        # Update max length
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(min(m, n)) where m is charset size
function lengthOfLongestSubstring(s) {
  const charIndexMap = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    // If char exists and its index is within current window, move left
    if (charIndexMap.has(char) && charIndexMap.get(char) >= left) {
      left = charIndexMap.get(char) + 1;
    }
    // Update char's latest index
    charIndexMap.set(char, right);
    // Update max length
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(min(m, n)) where m is charset size
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndexMap = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        // If char exists and its index is within current window, move left
        if (charIndexMap.containsKey(c) && charIndexMap.get(c) >= left) {
            left = charIndexMap.get(c) + 1;
        }
        // Update char's latest index
        charIndexMap.put(c, right);
        // Update max length
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

</div>

**2. Hash Table**
Why: Constant-time lookups are critical in finance for matching orders, caching calculations, or deduplication. Many Goldman problems use hash maps to reduce time complexity from O(n²) to O(n).
_Pattern to master: Complement lookups for pair-finding._
Example Problem: **Two Sum (LeetCode #1)**. This is foundational for problems involving matching transactions or finding arbitrage pairs.

**3. Dynamic Programming**
Why: Optimization is at the heart of quantitative finance. DP appears in problems about maximizing profit, minimizing risk, or counting ways to partition assets—essentially, optimizing decisions over time or states.
_Pattern to master: 1D DP for sequence decisions._
Example Problem: **Coin Change (LeetCode #322)**. It models finding the optimal combination to make an amount, analogous to portfolio construction with minimal transactions.

<div class="code-group">

```python
# Time: O(amount * n) | Space: O(amount)
def coinChange(coins, amount):
    # dp[i] = min coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins to make amount 0

    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Time: O(amount * n) | Space: O(amount)
function coinChange(coins, amount) {
  // dp[i] = min coins to make amount i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case

  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Time: O(amount * n) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // dp[i] = min coins to make amount i
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Use amount+1 as "infinity"
    dp[0] = 0; // Base case

    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

**4. Math & Numerical Problems**
Why: Quantitative analysis is Goldman’s core. You’ll see problems involving probabilities, combinatorics, or numerical stability. These test your ability to handle integers and floating-point issues, and to derive formulas that avoid brute force.
_Pattern to master: Using modulus and integer division for digit or number manipulation._
Example Problem: **Reverse Integer (LeetCode #7)**. It tests careful handling of overflow—a real concern in financial systems.

## Preparation Strategy

A targeted 6-week plan is optimal. This assumes you have basic data structure knowledge.

**Weeks 1-2: Foundation & Patterns**

- Goal: Complete 60 problems (40 Medium, 20 Easy).
- Focus: One core topic per day (Array, String, Hash Table, DP, Math). Use the Goldman Sachs tagged list. For each problem, write code in your interview language, test edge cases, and articulate the time/space complexity aloud.
- Daily: 3-4 problems, 1 hour of review.

**Weeks 3-4: Integration & Speed**

- Goal: Complete 80 Medium problems, mixing topics randomly.
- Focus: Simulate interview conditions. Use a timer (30 minutes per problem). Practice explaining your thought process from problem reading to solution, including trade-offs. Start each session with a Goldman-specific problem like “Best Time to Buy and Sell Stock” or “Merge Intervals” (LeetCode #56).
- Daily: 4 problems, 30 minutes of reviewing mistakes.

**Weeks 5-5.5: Hard Problems & Mock Interviews**

- Goal: Tackle 20-25 Hard problems from the Goldman list.
- Focus: Don’t aim for perfection. Often, discussing a partial solution or a brute-force approach that you then optimize is acceptable. Do 2-3 mock interviews per week with a peer or via platforms like CodeJeet, focusing on the financial angle in problems.
- Daily: 2 Hard problems, 1 mock interview every other day.

**Week 6: Final Review & Behavioral**

- Goal: Re-solve 40-50 of the most frequent Goldman problems (use CodeJeet’s frequency sorting).
- Focus: No new problems. Refine communication: practice stating constraints, edge cases, and complexity without prompting. Dedicate time to behavioral stories using the STAR method, emphasizing quantitative outcomes and collaboration.

## Common Mistakes

1.  **Ignoring Numerical Edge Cases**: Forgetting integer overflow, division by zero, or floating-point precision in math problems. Goldman’s systems handle monetary values, so this is a red flag.
    - **Fix**: Always ask: “Can the input be zero or negative?” “What’s the expected output for an empty dataset?” For math problems, consider using `long` in Java or `math.floor` in Python for integer division.

2.  **Over-Engineering the First Solution**: Candidates often jump to an optimized, complex solution, introducing bugs. Interviewers prefer to see a working brute-force solution that you then refine.
    - **Fix**: Verbally state: “Let me start with a straightforward approach to ensure correctness, then we can optimize.” This demonstrates structured thinking.

3.  **Silent Solving**: Goldman values collaboration. Writing code silently for 10 minutes makes the interviewer unsure of your process.
    - **Fix**: Narrate continuously. “I’m considering a hash map here because we need fast lookups. The trade-off is O(n) space, but that’s acceptable given the constraints.”

4.  **Neglecting the “Why”**: Solving the algorithm but failing to connect it to the business context (e.g., “This sliding window finds the longest period of stable prices”).
    - **Fix**: After coding, summarize: “This approach efficiently finds the target, which in a trading context could help identify optimal time windows.”

## Key Tips

1.  **Practice with Financial Flavors**: When you solve a problem, re-frame it in a financial context. For “Merge Intervals,” think of merging overlapping trading sessions. For “Top K Frequent Elements,” think of identifying the most active stock symbols. This mental shift will help you recognize patterns quickly during the interview.

2.  **Write Production-Ready Code**: Use meaningful variable names (`profit` not `p`), add brief comments for complex logic, and handle edge cases explicitly. Show them you write code they’d want in their codebase.

3.  **Master One Language Deeply**: Don’t switch languages mid-preparation. Know the standard library for collections, strings, and math utilities cold. For example, in Python, know `collections.Counter` and `defaultdict`; in Java, `HashMap` and `PriorityQueue`.

4.  **Ask Clarifying Questions Early**: Before coding, confirm assumptions. For a problem about “transactions,” ask: “Are transactions positive integers? Can they be zero? Is the list sorted?” This shows analytical thoroughness.

5.  **Discuss Scalability Proactively**: After presenting a solution, briefly note: “This runs in O(n) time with O(n) space. If we had billions of records, we might need to stream the input and use a distributed approach.” This bridges coding to system design.

Goldman Sachs interviews are challenging but predictable. By focusing on their preferred topics, practicing within context, and communicating your thought process clearly, you’ll demonstrate the blend of technical skill and practical judgment they value. Remember, they’re not just assessing your coding ability; they’re assessing how you’d solve real problems on their team.

Start your targeted practice today: [Browse all Goldman Sachs questions on CodeJeet](/company/goldman-sachs)
