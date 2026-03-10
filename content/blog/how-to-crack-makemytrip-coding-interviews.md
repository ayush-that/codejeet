---
title: "How to Crack MakeMyTrip Coding Interviews in 2026"
description: "Complete guide to MakeMyTrip coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-06-24"
category: "company-guide"
company: "makemytrip"
tags: ["makemytrip", "interview prep", "leetcode"]
---

# How to Crack MakeMyTrip Coding Interviews in 2026

MakeMyTrip’s technical interview process is a focused, multi-stage evaluation designed to identify engineers who can build scalable, efficient systems for one of India’s largest online travel platforms. The process typically involves an initial online assessment (OA) with 2-3 coding problems, followed by 2-3 technical rounds that blend algorithmic problem-solving with system design discussions, and often a final round with a senior engineer or manager. What makes their process distinct is its strong emphasis on real-world applicability—problems often have a flavor of travel, logistics, or inventory management (like flight/hotel bookings), and interviewers expect not just a correct solution but a deeply optimized one, often probing trade-offs between time and space complexity. You’ll be coding in a shared editor (like HackerRank or CodePair), and while pseudocode might be tolerated in early discussion, production-ready code is the expectation.

## What Makes MakeMyTrip Different

Unlike some FAANG companies that might prioritize abstract algorithmic puzzles, MakeMyTrip’s interviews are grounded in their business domain. This doesn’t mean you’ll get a trivial problem; it means the _constraints_ and _optimization goals_ mirror real systems. For example, a problem about finding the cheapest flight route isn’t just a graph search—it’s about doing it with millions of possible connections and under strict latency requirements. Interviewers here often have a systems mindset. They’re likely to follow up a correct solution with: “How would this perform if the data size grew 100x?” or “How would you modify this to run in a distributed environment?” This blend of DSA and practical system thinking is the core differentiator. They also place a higher-than-average weight on **Dynamic Programming** and **Sliding Window** patterns, as these directly map to optimization problems in routing, pricing, and resource allocation.

## By the Numbers

An analysis of 24 recent MakeMyTrip coding questions reveals a telling distribution: **0% Easy, 71% Medium, and 29% Hard**. This is a stark contrast to many companies that include easy problems as warm-ups. It signals that from the very first round, you’re expected to handle substantial complexity. The absence of "Easy" problems means there’s no free pass; every question requires strategic thinking.

The top topics by frequency are:

- **Array (25% of questions)**
- **String (21%)**
- **Dynamic Programming (17%)**
- **Hash Table (13%)**
- **Sliding Window (13%)**

This breakdown is your study blueprint. Problems like **"Minimum Window Substring" (LeetCode #76)**, a classic Hard combining Hash Table and Sliding Window, or **"Longest Palindromic Substring" (LeetCode #5)**, which tests String manipulation and DP, are emblematic of their question bank. The high percentage of Hard problems often involves DP variations or complex array/string manipulations.

## Top Topics to Focus On

### 1. Dynamic Programming

MakeMyTrip favors DP because it’s the engine behind many optimization problems in travel—finding the cheapest itinerary with stops, allocating hotel rooms for maximum profit, or managing booking inventories over time. You must be fluent in both top-down (memoization) and bottom-up (tabulation) approaches, and more importantly, in space-optimizing the DP table.

**Key Pattern: DP on Strings (Longest Common Subsequence Variants)**
A common theme is comparing or transforming sequences (e.g., user search query vs. destination names, editing itinerary strings). Here’s the bottom-up DP for the classic **Edit Distance (LeetCode #72)** problem, which is highly relevant.

<div class="code-group">

```python
# LeetCode #72 - Edit Distance
# Time: O(m * n) | Space: O(m * n) (can be optimized to O(min(m, n)))
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    # dp[i][j] = min ops to convert word1[:i] to word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # chars match, no cost
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # delete from word1
                    dp[i][j-1],    # insert into word1
                    dp[i-1][j-1]   # replace
                )
    return dp[m][n]
```

```javascript
// LeetCode #72 - Edit Distance
// Time: O(m * n) | Space: O(m * n)
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // delete
            dp[i][j - 1], // insert
            dp[i - 1][j - 1] // replace
          );
      }
    }
  }
  return dp[m][n];
}
```

```java
// LeetCode #72 - Edit Distance
// Time: O(m * n) | Space: O(m * n)
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i-1][j],      // delete
                    Math.min(
                        dp[i][j-1],  // insert
                        dp[i-1][j-1] // replace
                    )
                );
            }
        }
    }
    return dp[m][n];
}
```

</div>

### 2. Sliding Window + Hash Table

This combo is paramount for problems involving subarrays or substrings with constraints—think analyzing user session data, finding optimal booking periods, or detecting patterns in search logs. MakeMyTrip often uses this to test your ability to handle streaming data efficiently.

**Key Pattern: Variable Size Window with Frequency Map**
The **"Longest Substring Without Repeating Characters" (LeetCode #3)** is a fundamental pattern you must know cold.

<div class="code-group">

```python
# LeetCode #3 - Longest Substring Without Repeating Characters
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}  # stores the most recent index of each character
    left = 0
    max_len = 0

    for right, ch in enumerate(s):
        # If char seen and its index is within current window, shrink
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1
        # Update char's latest index
        char_index[ch] = right
        # Update max length
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// LeetCode #3 - Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(min(m, n))
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0,
    maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (map.has(ch) && map.get(ch) >= left) {
      left = map.get(ch) + 1;
    }
    map.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
// LeetCode #3 - Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(min(m, n))
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        if (map.containsKey(ch) && map.get(ch) >= left) {
            left = map.get(ch) + 1;
        }
        map.put(ch, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

### 3. Array Manipulation

Array problems often model sorted lists (like flight departure times), 2D grids (seat maps, pricing matrices), or in-place transformations. Expect questions that require careful index management and minimizing passes over the data.

**Key Pattern: In-place Array Modification (Cyclic Replacements)**
A problem like **"Rotate Array" (LeetCode #189)** tests your ability to manipulate indices efficiently without extra space—a skill valuable for memory-constrained environments.

<div class="code-group">

```python
# LeetCode #189 - Rotate Array (k steps to the right)
# Time: O(n) | Space: O(1)
def rotate(nums: list[int], k: int) -> None:
    n = len(nums)
    k %= n  # handle k larger than n

    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1

    # Reverse entire array, then reverse two parts
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)
```

```javascript
// LeetCode #189 - Rotate Array
// Time: O(n) | Space: O(1)
function rotate(nums, k) {
  const n = nums.length;
  k %= n;

  const reverse = (start, end) => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  };

  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
}
```

```java
// LeetCode #189 - Rotate Array
// Time: O(n) | Space: O(1)
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;

    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}

private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}
```

</div>

## Preparation Strategy

Given the Medium-Hard skew, a 6-week plan is ideal.

- **Weeks 1-2: Foundation & Patterns.** Focus on the top 5 topics. Solve 60 problems (≈5/day). For each, master the brute force first, then the optimal pattern. Use LeetCode’s "Top Interview Questions" list filtered by these topics.
- **Week 3: Deep Dive on DP.** This is your make-or-break week. Solve 20-25 DP problems, covering all major types: 1D (Fibonacci, KnapSack), 2D (LCS, Edit Distance), and Partition/Interval DP. Write out the recurrence relation before coding.
- **Week 4: Sliding Window & Complex Arrays.** Solve 15-20 problems combining these patterns with Hash Maps. Practice explaining the `left`/`right` pointer logic aloud. Time yourself to solve Medium in 20 mins, Hard in 35.
- **Week 5: Mock Interviews & System Design.** Do 2-3 mock interviews weekly with a focus on MakeMyTrip’s style. Spend 30% of your time on basic system design concepts (scaling, databases, caching) as they often weave into discussions.
- **Week 6: Revision & Weak Areas.** Re-solve 15-20 of the toughest problems you’ve encountered. Focus on bug-free implementation. Practice articulating trade-offs: “This uses O(n) space for O(n) time; if memory were critical, we could use X slower approach.”

## Common Mistakes

1.  **Stopping at a Correct Solution:** Many candidates breathe a sigh of relief when their code passes sample tests. MakeMyTrip interviewers will immediately ask, “Can we do better?” Always be prepared to discuss time-space trade-offs and further optimizations.
2.  **Ignoring the Business Context:** When given a problem about flights or bookings, failing to connect your algorithm to the real-world constraint (e.g., “This DP table row could represent daily hotel capacity”) misses a chance to show systems thinking.
3.  **Under-Communicating During Optimization:** When you realize a better approach mid-problem, don’t just silently rewrite code. Say: “I initially used a hash map, but I see we can use the array itself as a marker to reduce space to O(1). Let me implement that.” This showcases structured thinking.
4.  **Neglecting Edge Cases in String/Array Problems:** Off-by-one errors kill. For array problems, test empty, single-element, sorted, and reverse-sorted inputs. For strings, test empty, all same characters, and Unicode if relevant.

## Key Tips

1.  **Lead with the Brute Force:** Even if you know the optimal solution, briefly state the naive approach and its complexity first. This creates a narrative of improvement and shows you can analyze problems methodically.
2.  **Practice the “Follow-Up” Mindset:** After solving any practice problem, ask yourself: “What if the input streamed in?” (switch to sliding window), “What if I had limited memory?” (think in-place or bit manipulation), “How would this work distributed?” (mention sharding keys). This prepares you for their next question.
3.  **Memorize Recurrence Relations for 5 Key DP Problems:** Know the exact recurrence and base cases for: 0/1 Knapsack, Longest Increasing Subsequence, Edit Distance, Coin Change, and Matrix Chain Multiplication. These form the building blocks for most DP variations.
4.  **Use Their Tech Stack in Examples:** If you discuss system design elements, mention technologies in MakeMyTrip’s stack (e.g., Java/Spring Boot, React, AWS, Kafka). It shows you’ve done your homework and can hit the ground running.
5.  **Clarify Constraints Upfront:** Before coding, always ask: “What are the expected input sizes?” or “Is the array sorted?” This directly informs your algorithm choice and demonstrates professional diligence.

Cracking MakeMyTrip’s interview is about demonstrating depth in core patterns and the ability to think like an engineer building their platform. Focus on optimization, articulate your trade-offs, and connect your solutions to real-world use cases. The problems are challenging, but with targeted preparation, they are absolutely surmountable.

[Browse all MakeMyTrip questions on CodeJeet](/company/makemytrip)
