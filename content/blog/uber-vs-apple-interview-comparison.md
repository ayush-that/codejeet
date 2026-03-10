---
title: "Uber vs Apple: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Apple — difficulty levels, topic focus, and preparation strategy."
date: "2030-01-22"
category: "tips"
tags: ["uber", "apple", "comparison"]
---

# Uber vs Apple: Interview Question Comparison

If you're interviewing at both Uber and Apple, or trying to decide which to prioritize, you're facing two distinct engineering cultures with surprisingly similar technical requirements on paper. Both companies ask about arrays, strings, hash tables, and dynamic programming — but the _way_ they test these fundamentals reveals their different engineering priorities. Uber's interviews feel like solving tactical dispatch problems under time pressure, while Apple's often resemble debugging a complex system with elegant constraints. Here's what you need to know to prepare effectively for both.

## Question Volume and Difficulty

Let's start with the raw numbers from LeetCode's company-tagged problems:

**Uber**: 381 questions (54 Easy / 224 Medium / 103 Hard)  
**Apple**: 356 questions (100 Easy / 206 Medium / 50 Hard)

The first thing that jumps out is the difficulty distribution. Uber has _twice_ as many Hard problems (103 vs 50), suggesting their interviews push candidates toward more complex algorithmic challenges. This aligns with Uber's reputation for favoring candidates who can handle intricate optimization problems — think about the real-time routing and matching algorithms that power their core business.

Apple's distribution is more balanced toward Medium problems with a significant Easy tier. Don't misinterpret this as "Apple is easier." Instead, Apple often uses simpler problem statements to test deeper understanding of edge cases, memory management, and clean implementation. Their Hard problems are fewer but tend to be _substantial_ — think system-level challenges rather than pure algorithm puzzles.

The volume difference (381 vs 356) is negligible for preparation purposes. Both companies have extensive question banks, meaning you won't see repeats unless you're very lucky (or unlucky). The key takeaway: Uber interviews will likely present you with more technically challenging problems, while Apple interviews will expect more polished, production-ready solutions to moderately difficult problems.

## Topic Overlap

Both companies heavily test:

- **Arrays** (Uber's #1 topic, Apple's #1 topic)
- **Strings** (top 3 for both)
- **Hash Tables** (top 3 for both)
- **Dynamic Programming** (top 4 for both)

This overlap is your preparation sweet spot. If you master these four topics, you'll cover approximately 60-70% of what both companies test. The emphasis differs slightly: Uber's array problems often involve intervals, sorting, and two-pointer techniques for real-world scenarios (matching riders to drivers, calculating surge pricing windows). Apple's array problems frequently involve in-place operations, memory efficiency, and sometimes hardware-adjacent thinking (think optimizing for cache locality).

Where they diverge:

- **Uber-specific emphasis**: Graph algorithms (especially BFS/DFS for location-based problems), Tree problems (for hierarchical data like ride histories), and Design questions (for their complex distributed systems).
- **Apple-specific emphasis**: Linked Lists (still surprisingly common), Binary Search (for performance-critical code), and Recursion (for elegant solutions to hierarchical problems).

Interestingly, both test System Design, but from different angles: Uber focuses on scalable distributed systems (how would you design Uber Eats?), while Apple leans toward API design and client-server architecture (how would you design the Photos sync across devices?).

## Preparation Priority Matrix

Here's how to allocate your study time for maximum ROI:

**Tier 1: Shared Fundamentals (Study First)**

- Arrays: Two-pointer, sliding window, interval merging
- Strings: Palindrome checks, anagram detection, string manipulation
- Hash Tables: Frequency counting, complement finding, caching
- Dynamic Programming: 1D and 2D DP, especially for optimization problems

**Tier 2: Uber-Specific Priorities**

- Graph traversal (BFS/DFS) for matrix and network problems
- Tree algorithms (especially BST operations)
- Complex interval problems (multiple overlapping timelines)

**Tier 3: Apple-Specific Priorities**

- Linked list manipulation (often without extra space)
- Binary search variations
- Memory-efficient array operations

For shared fundamentals, these problems offer excellent crossover value:

<div class="code-group">

```python
# LeetCode #56: Merge Intervals
# Uber: High frequency | Apple: Medium frequency
# Tests array sorting, interval logic, and clean edge case handling
# Time: O(n log n) | Space: O(n) for output, O(1) extra
def merge(intervals):
    if not intervals:
        return []

    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    merged = []
    for interval in intervals:
        # If merged is empty or no overlap
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            # Merge overlapping intervals
            merged[-1][1] = max(merged[-1][1], interval[1])

    return merged
```

```javascript
// LeetCode #56: Merge Intervals
// Uber: High frequency | Apple: Medium frequency
// Time: O(n log n) | Space: O(n) for output, O(1) extra
function merge(intervals) {
  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    if (last[1] < current[0]) {
      merged.push(current);
    } else {
      last[1] = Math.max(last[1], current[1]);
    }
  }

  return merged;
}
```

```java
// LeetCode #56: Merge Intervals
// Uber: High frequency | Apple: Medium frequency
// Time: O(n log n) | Space: O(n) for output, O(1) extra
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;

    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    int[] current = intervals[0];
    merged.add(current);

    for (int[] interval : intervals) {
        if (interval[0] <= current[1]) {
            current[1] = Math.max(current[1], interval[1]);
        } else {
            current = interval;
            merged.add(current);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## Interview Format Differences

**Uber's Format:**

- Typically 4-5 rounds: 2-3 coding, 1 system design, 1 behavioral
- Coding rounds are 45-60 minutes, often with 2 medium-hard problems
- Expect follow-up questions: "How would this scale to millions of requests?" or "What if we added this constraint?"
- Virtual or on-site similar in structure
- System design is crucial — they want to see you think about real-world constraints

**Apple's Format:**

- Typically 4-6 rounds: 2-3 coding, 1-2 system design/architecture, 1 behavioral
- Coding rounds are 45-60 minutes, often with 1-2 problems but more in-depth discussion
- Expect questions about trade-offs, memory usage, and edge cases
- Sometimes includes "debugging rounds" where you're given buggy code
- Behavioral rounds often include "Tell me about a time you dealt with a difficult technical trade-off"
- On-site may include lunch with team members (not evaluated, but still professional)

Key difference: Uber interviews feel like a sprint — solve the problem, then optimize. Apple interviews feel like a code review — solve it correctly, then make it production-ready.

## Specific Problem Recommendations

For someone interviewing at both companies, these 5 problems provide exceptional coverage:

1. **Two Sum (#1)** - The ultimate hash table problem. Uber tests variations with ride matching logic; Apple tests variations with memory constraints.

2. **Merge Intervals (#56)** - As shown above, tests sorting and interval logic crucial for both companies' domains.

3. **Word Break (#139)** - A classic DP problem that appears at both companies. Uber might frame it as "can this trip be broken into segments?" Apple might frame it as "can this string be parsed validly?"

4. **LRU Cache (#146)** - Tests hash table + linked list combination. Uber cares about caching for API responses; Apple cares about efficient memory use.

5. **Course Schedule (#207)** - Graph/topological sort problem. High frequency at Uber (dependency resolution), medium at Apple (task scheduling).

Here's why Word Break (#139) is particularly valuable:

<div class="code-group">

```python
# LeetCode #139: Word Break
# Tests DP and string manipulation — relevant to both companies
# Time: O(n³) naive, O(n²) with set lookup | Space: O(n)
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True  # Empty string can be segmented

    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # No need to check further

    return dp[len(s)]
```

```javascript
// LeetCode #139: Word Break
// Time: O(n³) naive, O(n²) with set lookup | Space: O(n)
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}
```

```java
// LeetCode #139: Word Break
// Time: O(n³) naive, O(n²) with set lookup | Space: O(n)
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;

    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[s.length()];
}
```

</div>

## Which to Prepare for First

Prepare for **Apple first**, then Uber. Here's the strategic reasoning:

1. **Apple's fundamentals-first approach** forces you to write clean, efficient code with proper edge cases. This discipline will serve you well at Uber too.

2. **Uber's harder problems** build on Apple's foundation. If you can solve Uber-level graph and DP problems, Apple's medium problems will feel more manageable.

3. **The shared topics** (arrays, strings, hash tables, DP) represent about 70% of both companies' questions. Master these for Apple, and you're most of the way there for Uber.

4. **Timing**: If you have interviews scheduled close together, the Apple → Uber progression lets you ramp up difficulty naturally.

Start with Apple's tagged problems (focus on Easy and Medium), then tackle Uber's Medium problems, then finally Uber's Hards. This progression maximizes learning while minimizing frustration.

Remember: Both companies value clear communication and thought process. At Uber, explain your optimization choices. At Apple, explain your trade-off decisions. The code might be similar, but the narrative should match the company's engineering culture.

For more company-specific insights, check out our guides: [/company/uber](/company/uber) and [/company/apple](/company/apple).
