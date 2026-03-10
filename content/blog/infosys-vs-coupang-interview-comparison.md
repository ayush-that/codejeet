---
title: "Infosys vs Coupang: Interview Question Comparison"
description: "Compare coding interview questions at Infosys and Coupang — difficulty levels, topic focus, and preparation strategy."
date: "2032-04-29"
category: "tips"
tags: ["infosys", "coupang", "comparison"]
---

# Infosys vs Coupang: Interview Question Comparison

If you're preparing for interviews at both Infosys and Coupang, you're looking at two distinct worlds of software engineering assessment. Infosys, a global IT services giant, and Coupang, South Korea's e-commerce powerhouse often called "the Amazon of Korea," approach technical screening with different philosophies. The key insight? Preparing for one will give you partial, but not complete, overlap for the other. This comparison will help you strategize your limited prep time for maximum coverage.

## Question Volume and Difficulty

The raw numbers tell a story. Infosys has a massive 158 questions tagged on LeetCode, with a distribution of 42 Easy, 82 Medium, and 34 Hard problems. This suggests a broad, well-established interview process that tests across a wide difficulty spectrum, with a strong emphasis on Medium-level problems. You're likely to encounter a mix designed to filter for baseline competency (Easy), core problem-solving (Medium), and differentiate top candidates (Hard).

Coupang, in contrast, has 53 tagged questions: 3 Easy, 36 Medium, and 14 Hard. The distribution is striking—it's almost entirely a Medium-and-Harder game. With nearly 95% of their questions at Medium or Hard difficulty, Coupang signals an interview process intensely focused on complex problem-solving from the outset. The lower total volume indicates they may have a more curated, less leaked question bank, or a process that relies more on interviewer-generated variations.

**Implication:** For Infosys, ensure you have solid fundamentals to breeze through the Easy/Medium warm-ups. For Coupang, skip extensive Easy problem drilling and go straight to deep practice on Medium and Hard challenges. Coupang's process is likely more intense per problem.

## Topic Overlap

Both companies heavily test **Array** and **String** manipulation. These are the bread and butter of algorithmic interviews, and proficiency here is non-negotiable for either company.

**Dynamic Programming (DP)** is another major shared focus. This is critical. DP problems often serve as differentiators, and both companies list it among their top topics.

The key divergence is in their secondary focuses:

- **Infosys** uniquely emphasizes **Math** problems. Think number theory, combinatorics, and mathematical reasoning (e.g., problems involving prime numbers, gcd, or modular arithmetic).
- **Coupang** uniquely emphasizes **Hash Table** problems. This points towards a heavy focus on problems involving efficient lookups, counting, and frequency analysis, which are common in data processing and e-commerce scenarios (inventory, user sessions, etc.).

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

1.  **Maximum ROI (Study First):** These topics help both interviews.
    - **Dynamic Programming:** Start with classical problems. Master the patterns for 1D and 2D DP.
    - **Array & String Manipulation:** Sliding window, two-pointers, prefix sums, and in-place modifications.

2.  **Infosys-Specific Priority:**
    - **Math:** Review basic number theory, modulus operations, and combinatorial formulas. Practice converting wordy math problems into code.

3.  **Coupang-Specific Priority:**
    - **Hash Table:** Go beyond simple `Two Sum`. Practice problems where hash maps are used for memoization in DP, for storing complex objects as keys, or for designing efficient data structures.

**Shared-Prep LeetCode Problems:**

- **Longest Palindromic Substring (#5):** Covers string manipulation and expands into DP.
- **Merge Intervals (#56):** Classic array problem with a sorting + linear scan pattern.
- **Longest Increasing Subsequence (#300):** A fundamental DP problem with multiple solution approaches (standard DP and patience sorting).

## Interview Format Differences

**Infosys:**

- **Rounds:** Typically involves an initial online assessment (OA) with multiple-choice and coding questions, followed by technical and HR interviews. The technical rounds may be more structured.
- **Focus:** The broad question bank suggests they test for well-rounded algorithmic knowledge. Behavioral questions are standard. For many entry and mid-level roles, system design may be less emphasized or simpler.
- **Pacing:** The presence of many Easy problems indicates you might be expected to solve more problems in a given time, testing speed and accuracy on fundamentals.

**Coupang:**

- **Rounds:** Process is often leaner and meaner—fewer rounds, but each is more intense. Likely a series of deep-dive technical interviews.
- **Focus:** The high difficulty skew points towards interviews where you might get one or two complex problems per hour-long session, with heavy emphasis on optimization, edge cases, and communication. For senior roles, expect robust system design discussions relevant to scalability and e-commerce (caches, queues, inventory systems).
- **Pacing:** Depth over breadth. You'll have more time to wrestle with a single problem, but the expectation for optimal solutions is higher.

## Specific Problem Recommendations for Dual Preparation

Here are 3-5 problems that efficiently build skills for both companies.

1.  **Minimum Window Substring (#76) - Hard**
    - **Why:** It's the quintessential hard sliding window problem using a hash map to track counts. It directly practices Coupang's Hash Table focus and the complex string/array manipulation needed for Infosys. Mastering this teaches you to manage multiple constraints within a window.

<div class="code-group">

```python
# Time: O(|S| + |T|) | Space: O(|S| + |T|)
def minWindow(self, s: str, t: str) -> str:
    from collections import Counter
    if not s or not t:
        return ""

    dict_t = Counter(t)
    required = len(dict_t)
    l, r = 0, 0
    formed = 0
    window_counts = {}
    ans = float("inf"), None, None  # (window length, left, right)

    while r < len(s):
        char = s[r]
        window_counts[char] = window_counts.get(char, 0) + 1
        if char in dict_t and window_counts[char] == dict_t[char]:
            formed += 1
        while l <= r and formed == required:
            char = s[l]
            if r - l + 1 < ans[0]:
                ans = (r - l + 1, l, r)
            window_counts[char] -= 1
            if char in dict_t and window_counts[char] < dict_t[char]:
                formed -= 1
            l += 1
        r += 1
    return "" if ans[0] == float("inf") else s[ans[1]: ans[2] + 1]
```

```javascript
// Time: O(|S| + |T|) | Space: O(|S| + |T|)
function minWindow(s, t) {
  if (s.length === 0 || t.length === 0) return "";

  const mapT = new Map();
  for (const ch of t) {
    mapT.set(ch, (mapT.get(ch) || 0) + 1);
  }
  const required = mapT.size;
  let l = 0,
    r = 0;
  let formed = 0;
  const windowCounts = new Map();
  const ans = [-1, 0, 0]; // (window length, left, right)

  while (r < s.length) {
    const char = s[r];
    windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
    if (mapT.has(char) && windowCounts.get(char) === mapT.get(char)) {
      formed++;
    }
    while (l <= r && formed === required) {
      const char = s[l];
      if (ans[0] === -1 || r - l + 1 < ans[0]) {
        ans[0] = r - l + 1;
        ans[1] = l;
        ans[2] = r;
      }
      windowCounts.set(char, windowCounts.get(char) - 1);
      if (mapT.has(char) && windowCounts.get(char) < mapT.get(char)) {
        formed--;
      }
      l++;
    }
    r++;
  }
  return ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1);
}
```

```java
// Time: O(|S| + |T|) | Space: O(|S| + |T|)
public String minWindow(String s, String t) {
    if (s.length() == 0 || t.length() == 0) return "";

    Map<Character, Integer> dictT = new HashMap<>();
    for (char c : t.toCharArray()) {
        dictT.put(c, dictT.getOrDefault(c, 0) + 1);
    }
    int required = dictT.size();
    int l = 0, r = 0;
    int formed = 0;
    Map<Character, Integer> windowCounts = new HashMap<>();
    int[] ans = {-1, 0, 0}; // (window length, left, right)

    while (r < s.length()) {
        char c = s.charAt(r);
        windowCounts.put(c, windowCounts.getOrDefault(c, 0) + 1);
        if (dictT.containsKey(c) && windowCounts.get(c).intValue() == dictT.get(c).intValue()) {
            formed++;
        }
        while (l <= r && formed == required) {
            c = s.charAt(l);
            if (ans[0] == -1 || r - l + 1 < ans[0]) {
                ans[0] = r - l + 1;
                ans[1] = l;
                ans[2] = r;
            }
            windowCounts.put(c, windowCounts.get(c) - 1);
            if (dictT.containsKey(c) && windowCounts.get(c) < dictT.get(c)) {
                formed--;
            }
            l++;
        }
        r++;
    }
    return ans[0] == -1 ? "" : s.substring(ans[1], ans[2] + 1);
}
```

</div>

2.  **Coin Change (#322) - Medium**
    - **Why:** A foundational DP problem. It's a must-know for both companies' DP focus. It teaches the "minimum number of coins" DP pattern, which is easily adaptable to other "minimum number of items" problems.

3.  **Product of Array Except Self (#238) - Medium**
    - **Why:** An excellent array problem that tests your ability to think about prefix and suffix computations without using division. It's a common pattern that appears in variations, testing in-place manipulation and space optimization—skills valued by both.

4.  **Unique Paths (#62) - Medium**
    - **Why:** A clean, classic 2D Dynamic Programming problem. It's the perfect starting point to build your DP intuition for grid-based problems, which frequently appear in interviews. Solving this helps you tackle more complex DP problems for either company.

## Which to Prepare for First?

**Prepare for Coupang first.**

Here’s the strategic reasoning: Coupang's focus on Medium and Hard problems will force you to reach a higher ceiling in your problem-solving skills. The intense practice on complex array, string, hash table, and DP problems will inherently cover the Medium and Hard problems you'd see at Infosys. Once you're comfortable at that level, reviewing Infosys's broader scope—specifically adding Math practice—will be a lighter lift. Preparing in the reverse order (Infosys first) might leave you under-prepared for the difficulty jump Coupang requires.

Think of it as training for a marathon (Coupang) versus a 10K (Infosys). The marathon training will cover the 10K distance with ease, but the reverse isn't true.

For more detailed company-specific question lists and trends, check out the CodeJeet pages for [Infosys](/company/infosys) and [Coupang](/company/coupang). Good luck
