---
title: "How to Crack Meesho Coding Interviews in 2026"
description: "Complete guide to Meesho coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-04-25"
category: "company-guide"
company: "meesho"
tags: ["meesho", "interview prep", "leetcode"]
---

# How to Crack Meesho Coding Interviews in 2026

Meesho’s interview process for software engineering roles is a focused, multi-stage evaluation designed to assess problem-solving, coding fluency, and system design under pressure. The typical process includes an initial recruiter screen, followed by a 60–75 minute technical phone screen focused on data structures and algorithms (DSA). Candidates who pass advance to a virtual onsite, which usually consists of 3–4 rounds: two DSA/coding rounds, one system design round, and a behavioral/experience deep-dive round. What makes Meesho’s process distinct is its intensity—the questions are heavily skewed toward Medium and Hard difficulty, and interviewers expect not just a working solution but a highly optimized one, often with follow-ups probing edge cases and scalability. You’re expected to code in a real, shared editor (no pseudocode), explain your thought process clearly, and demonstrate that you can think like an engineer building for Meesho’s unique e-commerce and social reseller platform.

## What Makes Meesho Different

While FAANG companies often test a broad range of topics with standardized rubrics, Meesho’s interviews feel more like a deep dive into practical, optimization-heavy problem-solving. The company’s core business—connecting suppliers, resellers, and customers on a social commerce platform—means their engineering challenges revolve heavily around efficient data processing, real-time updates, inventory management, and recommendation systems. This context bleeds into their technical interviews.

First, **optimization is non-negotiable**. A brute-force solution, even if correct, is often considered a failure. Interviewers will explicitly ask for a better approach if your first thought isn’t optimal. Second, **mathematical reasoning is frequently tested alongside coding**. Problems often have a combinatorial or number-theory twist, requiring you to derive formulas or recognize patterns beyond standard algorithms. Third, **the system design round is deeply integrated with product thinking**. You might be asked to design a feature like "flash sales for social resellers" or "real-time order tracking for millions of concurrent users," where you must balance scalability with business logic specific to Meesho’s model. Unlike some companies that allow pseudocode in early stages, Meesho expects fully executable, clean code in your chosen language from the first technical screen.

## By the Numbers

An analysis of Meesho’s recent question bank reveals a telling distribution: out of 44 cataloged questions, only 4 (9%) are Easy, 22 (50%) are Medium, and a substantial 18 (41%) are Hard. This skew toward Medium-Hard difficulty is more pronounced than at many other tech companies of similar scale. It signals that Meesho is selecting for candidates who can handle complexity under time constraints.

The difficulty breakdown dictates a specific preparation strategy. You cannot afford to skip Hard problems. For example, known Meesho problems include variations of **"Minimum Window Substring" (LeetCode #76, Hard)**, which tests sliding window and hash map mastery; **"Edit Distance" (LeetCode #72, Hard)**, a classic DP problem; and **"Trapping Rain Water" (LeetCode #42, Hard)**, which tests two-pointer array manipulation. The Medium problems often involve nuanced applications of arrays, strings, and dynamic programming—think **"Longest Palindromic Substring" (LeetCode #5, Medium)** or **"Word Break" (LeetCode #139, Medium)**. The takeaway: your practice must be heavily weighted toward solving Medium problems quickly and reliably, while dedicating significant time to dissecting Hard problems, understanding their patterns, and writing bug-free implementations.

## Top Topics to Focus On

**Array (and Two-Pointers/Sliding Window)**
Arrays are fundamental to almost all of Meesho’s data processing tasks, from managing user feeds to batch updating inventory. The focus is on in-place operations, minimizing space, and efficient traversal. Sliding window and two-pointer techniques are paramount for subarray/substring problems common in their question set.

<div class="code-group">

```python
# Problem: Minimum Window Substring (LeetCode #76) - Sliding Window pattern
# Time: O(|S| + |T|) | Space: O(1) [since hash maps hold at most 128 ASCII chars]
def minWindow(s: str, t: str) -> str:
    if not s or not t or len(s) < len(t):
        return ""

    from collections import defaultdict
    target_count = defaultdict(int)
    for ch in t:
        target_count[ch] += 1

    required = len(target_count)  # number of unique chars we need to match
    formed = 0
    window_count = defaultdict(int)

    left = 0
    min_len = float('inf')
    min_left = 0

    for right, ch in enumerate(s):
        window_count[ch] += 1

        # Check if current char's count in window matches its target count
        if ch in target_count and window_count[ch] == target_count[ch]:
            formed += 1

        # Try to contract the window from the left
        while left <= right and formed == required:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_left = left

            left_char = s[left]
            window_count[left_char] -= 1
            if left_char in target_count and window_count[left_char] < target_count[left_char]:
                formed -= 1
            left += 1

    return "" if min_len == float('inf') else s[min_left:min_left + min_len]
```

```javascript
// Problem: Minimum Window Substring (LeetCode #76) - Sliding Window pattern
// Time: O(|S| + |T|) | Space: O(1) [constant space for character maps]
function minWindow(s, t) {
  if (!s || !t || s.length < t.length) return "";

  const targetCount = new Map();
  for (const ch of t) {
    targetCount.set(ch, (targetCount.get(ch) || 0) + 1);
  }

  let required = targetCount.size;
  let formed = 0;
  const windowCount = new Map();

  let left = 0;
  let minLen = Infinity;
  let minLeft = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    windowCount.set(ch, (windowCount.get(ch) || 0) + 1);

    if (targetCount.has(ch) && windowCount.get(ch) === targetCount.get(ch)) {
      formed++;
    }

    while (left <= right && formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minLeft = left;
      }

      const leftChar = s[left];
      windowCount.set(leftChar, windowCount.get(leftChar) - 1);
      if (targetCount.has(leftChar) && windowCount.get(leftChar) < targetCount.get(leftChar)) {
        formed--;
      }
      left++;
    }
  }

  return minLen === Infinity ? "" : s.substring(minLeft, minLeft + minLen);
}
```

```java
// Problem: Minimum Window Substring (LeetCode #76) - Sliding Window pattern
// Time: O(|S| + |T|) | Space: O(1) [fixed-size arrays for ASCII]
public class Solution {
    public String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) return "";

        int[] targetCount = new int[128];
        int required = 0;
        for (char ch : t.toCharArray()) {
            if (targetCount[ch] == 0) required++;
            targetCount[ch]++;
        }

        int[] windowCount = new int[128];
        int formed = 0;
        int left = 0;
        int minLen = Integer.MAX_VALUE;
        int minLeft = 0;

        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            windowCount[ch]++;

            if (targetCount[ch] > 0 && windowCount[ch] == targetCount[ch]) {
                formed++;
            }

            while (left <= right && formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                }

                char leftChar = s.charAt(left);
                windowCount[leftChar]--;
                if (targetCount[leftChar] > 0 && windowCount[leftChar] < targetCount[leftChar]) {
                    formed--;
                }
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLen);
    }
}
```

</div>

**Dynamic Programming**
DP appears frequently because Meesho deals with optimization problems—minimizing costs, maximizing efficiency in logistics, or optimizing recommendation scores. You must be comfortable with both 1D and 2D DP, and especially with problems that have a combinatorial count or "minimum/maximum" objective.

<div class="code-group">

```python
# Problem: Edit Distance (LeetCode #72) - Classic 2D DP
# Time: O(m * n) | Space: O(m * n) [can be optimized to O(min(m, n))]
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    # dp[i][j] = min ops to convert word1[:i] to word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars into word1

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # no operation needed
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],    # delete from word1
                    dp[i][j - 1],    # insert into word1
                    dp[i - 1][j - 1] # replace
                )
    return dp[m][n]
```

```javascript
// Problem: Edit Distance (LeetCode #72) - Classic 2D DP
// Time: O(m * n) | Space: O(m * n)
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

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
// Problem: Edit Distance (LeetCode #72) - Classic 2D DP
// Time: O(m * n) | Space: O(m * n)
public class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],      // delete
                        Math.min(
                            dp[i][j - 1],  // insert
                            dp[i - 1][j - 1] // replace
                        )
                    );
                }
            }
        }
        return dp[m][n];
    }
}
```

</div>

**Math & Number Theory**
Many Meesho problems involve mathematical insights—counting ways, modulo arithmetic, or optimizing based on numerical properties. This reflects real-world scenarios like calculating discount combinations, partitioning resources, or generating unique IDs.

**Hash Table**
Used for efficient lookups in problems involving frequency counting, substring searches, or caching intermediate results. Often combined with arrays or strings.

**String**
String manipulation is critical for processing user-generated content, search queries, and product descriptions. Problems often involve palindrome checks, anagrams, or parsing.

<div class="code-group">

```python
# Problem: Trapping Rain Water (LeetCode #42) - Two Pointers / DP
# This combines array manipulation with mathematical calculation of areas.
# Time: O(n) | Space: O(1) [two-pointer approach shown]
def trap(height):
    if not height:
        return 0

    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0

    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]

    return water
```

```javascript
// Problem: Trapping Rain Water (LeetCode #42) - Two Pointers
// Time: O(n) | Space: O(1)
function trap(height) {
  if (!height.length) return 0;

  let left = 0,
    right = height.length - 1;
  let leftMax = height[left],
    rightMax = height[right];
  let water = 0;

  while (left < right) {
    if (leftMax < rightMax) {
      left++;
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
    } else {
      right--;
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
    }
  }
  return water;
}
```

```java
// Problem: Trapping Rain Water (LeetCode #42) - Two Pointers
// Time: O(n) | Space: O(1)
public class Solution {
    public int trap(int[] height) {
        if (height == null || height.length == 0) return 0;

        int left = 0, right = height.length - 1;
        int leftMax = height[left], rightMax = height[right];
        int water = 0;

        while (left < right) {
            if (leftMax < rightMax) {
                left++;
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
            } else {
                right--;
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
            }
        }
        return water;
    }
}
```

</div>

## Preparation Strategy

Given the difficulty skew, a 6-week plan is recommended.

**Weeks 1–2: Foundation & Core Topics**

- Focus: Arrays, Strings, Hash Tables, and basic Two-Pointer/Sliding Window.
- Goal: Solve 60–80 problems, 70% Medium, 30% Easy. Ensure you can code standard patterns (binary search, fast-slow pointers, anagram checks) without hesitation.
- Daily target: 4–5 problems with detailed analysis.

**Weeks 3–4: Advanced Patterns & Hard Problems**

- Focus: Dynamic Programming (start with 1D, move to 2D), advanced Graph problems (if time), and Math/Number Theory.
- Goal: Solve 50–60 problems, 50% Medium, 50% Hard. For DP, master at least 10 classic problems (Knapsack, LCS, Edit Distance, etc.).
- Daily target: 3–4 problems, but spend more time on each Hard problem—write out the recurrence relation, trace examples, optimize space.

**Week 5: Meesho-Specific & Mock Interviews**

- Focus: Solve known Meesho problems (use curated lists). Practice explaining your thought process aloud.
- Goal: Complete 30–40 company-tagged problems. Do 2–3 mock interviews with a peer, simulating the 60-minute time limit.
- Daily target: 3 problems + one mock interview every other day.

**Week 6: Revision & System Design**

- Focus: Revisit weak areas. Dedicate 50% of time to system design—study scalable architectures for e-commerce, real-time notifications, and recommendation systems.
- Goal: No new problems. Re-solve 20–30 previously solved problems, focusing on speed and clean code.
- Daily target: 2–3 revision problems + 2–3 hours of system design study.

## Common Mistakes

1. **Ignoring Space Optimization**: Candidates often present a DP solution with O(n²) space when O(n) is possible. Interviewers will ask, "Can we use less memory?" Always think about space optimization after getting a working solution.
   _Fix_: For DP, practice the "rolling array" technique. For sliding window, ask if you can use a fixed-size array instead of a hash map.

2. **Overlooking Mathematical Shortcuts**: In problems involving counts or sequences, candidates dive into brute-force simulation instead of looking for a formula.
   _Fix_: When you see problems about "number of ways" or "total sum under constraints," pause and test small cases to detect a pattern or combinatorial identity.

3. **Poor Handling of Edge Cases in String/Array Problems**: Meesho problems often have tricky edge cases—empty inputs, all identical elements, large values causing overflow.
   _Fix_: Before coding, verbally list edge cases. Write them down as comments and address them explicitly in your code.

4. **Silent Thinking**: Many candidates go quiet for minutes, then present a solution. Meesho interviewers want to see your reasoning.
   _Fix_: Narrate your thoughts, even if they're incomplete. Say, "I'm considering a sliding window because we need a contiguous substring, but I'm unsure about the condition to shrink the window."

## Key Tips

1. **Master the "Optimization Dialogue"**: After presenting a solution, proactively say, "This runs in O(n²) time and O(n) space. A potential optimization could be to use a monotonic stack to reduce time to O(n)." This shows advanced thinking.

2. **Practice Writing Code on a Whiteboard or Plain Text Editor**: Turn off auto-complete and syntax highlighting in your practice sessions. Meesho's coding environment is often a simple shared editor without IDE features.

3. **Connect Problems to Meesho's Business**: When discussing your approach, subtly relate it to a real-world use case. For a caching problem, mention how it could optimize product recommendation lookups. This demonstrates product empathy.

4. **Prepare for Follow-Up Questions**: For any problem, be ready to answer: "What if the input stream is infinite?" or "How would you distribute this computation across multiple servers?" Think about scalability from the start.

5. **Use Constraints to Guide Your Solution**: If the problem says `1 <= n <= 10^5`, an O(n log n) or O(n) solution is expected. Mention this constraint to justify your algorithm choice.

Success in Meesho interviews comes from a blend of algorithmic depth, coding precision, and the ability to think under pressure about practical optimization. Focus on the patterns above, practice relentlessly on Medium and Hard problems, and always articulate your thought process.

[Browse all Meesho questions on CodeJeet](/company/meesho)
