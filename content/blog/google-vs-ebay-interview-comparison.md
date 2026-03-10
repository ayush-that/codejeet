---
title: "Google vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Google and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2028-09-29"
category: "tips"
tags: ["google", "ebay", "comparison"]
---

# Google vs eBay: Interview Question Comparison

If you're interviewing at both Google and eBay, you're facing two very different beasts. One is a FAANG giant with a legendary interview process, the other a major e-commerce platform with a more focused technical screen. The key insight? Preparing for Google will cover about 90% of what eBay tests, but not vice versa. Let me explain why, and give you a strategic roadmap for tackling both.

## Question Volume and Difficulty

The numbers tell a clear story. Google has **2,217 tagged questions** on LeetCode (588 Easy, 1,153 Medium, 476 Hard), while eBay has just **60** (12 Easy, 38 Medium, 10 Hard). This isn't just about quantity—it's about what these numbers imply.

Google's massive question bank means they can afford to be unpredictable. You might get a brand new problem that hasn't leaked online yet. Their interviewers have deep benches of questions to draw from, and they often modify existing problems slightly to test your adaptability. The difficulty distribution (roughly 25% Easy, 50% Medium, 25% Hard) suggests you should expect at least one Medium-Hard problem per round.

eBay's smaller question bank means there's more predictability. You're more likely to encounter problems that have appeared before in their interviews. The 63% Medium, 17% Hard split tells you that mastering Medium problems is your ticket through their technical screens. Don't neglect Easy problems though—they often appear in phone screens.

**Practical implication:** For Google, you need robust pattern recognition skills. For eBay, thorough practice of their tagged questions has higher ROI.

## Topic Overlap

Both companies heavily test:

- **Arrays** (manipulation, searching, sorting)
- **Strings** (palindromes, transformations, parsing)
- **Hash Tables** (frequency counting, lookups)

This overlap is your preparation sweet spot. Master these three topics and you'll be well-prepared for the core of both companies' interviews.

Where they diverge:

- **Google uniquely emphasizes Dynamic Programming** (476 DP-related questions!). This isn't surprising—DP tests both algorithmic thinking and optimization skills, which Google values highly for their scale problems.
- **eBay adds Sorting** as a distinct focus area. While sorting is often a component of other problems, eBay explicitly tests it, likely because efficient sorting relates to their e-commerce operations (ranking products, organizing data).

**Key insight:** If you're short on time, focus on Array, String, and Hash Table problems with Medium difficulty. These will serve you for both companies.

## Preparation Priority Matrix

Here's how to allocate your study time strategically:

**Tier 1: Overlap Topics (Highest ROI)**

- Array manipulation (sliding window, two pointers)
- String operations (reversal, comparison, parsing)
- Hash Table applications (frequency counting, caching)

**Tier 2: Google-Specific Focus**

- Dynamic Programming (memoization, tabulation, state machines)
- Graph algorithms (BFS/DFS, especially for their infrastructure roles)
- System design fundamentals (even for coding-focused roles)

**Tier 3: eBay-Specific Focus**

- Sorting algorithms and their applications
- Database/SQL questions (more common at eBay for backend roles)
- Practical string parsing (relevant to their data processing needs)

**Specific crossover problems to study:**

1. **Two Sum (#1)** - Tests hash table usage, appears at both companies
2. **Valid Parentheses (#20)** - Tests stack usage, common warm-up problem
3. **Merge Intervals (#56)** - Tests array sorting and merging, appears in both question banks

## Interview Format Differences

**Google's Process:**

- Typically 4-5 rounds of 45-minute interviews
- Mix of coding, system design, and behavioral (though coding dominates for junior roles)
- Expect 1-2 problems per coding round, often with follow-ups
- Whiteboard or Google Docs coding (no IDE assistance)
- Heavy emphasis on optimal solutions and clean code

**eBay's Process:**

- Usually 2-3 technical rounds
- More likely to use coding platforms with compiler access
- Often includes a practical component (e.g., "how would you design this feature for eBay?")
- Behavioral questions tend to be more product-focused
- May include take-home assignments for some roles

**Critical difference:** Google interviewers are trained to provide minimal hints and watch your problem-solving process. eBay interviewers often engage more collaboratively, treating it as a pairing session.

## Specific Problem Recommendations

Here are 5 problems that provide excellent crossover value:

1. **Longest Substring Without Repeating Characters (#3)**
   - Tests sliding window + hash table
   - Medium difficulty, appears in both companies' question banks
   - Teaches you to track character positions efficiently

<div class="code-group">

```python
# Time: O(n) | Space: O(min(m, n)) where m is character set size
def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}  # stores most recent index of each character
    left = max_length = 0

    for right, char in enumerate(s):
        # If char seen before and within current window, move left pointer
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1

        char_index[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(min(m, n))
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1;
    }
    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(min(m, n))
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;
        }
        charIndex.put(c, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

2. **Product of Array Except Self (#238)**
   - Tests array manipulation and prefix/suffix thinking
   - Medium difficulty, common at Google
   - Teaches space optimization (O(1) extra space version)

3. **Merge k Sorted Lists (#23)**
   - Tests heap/priority queue usage
   - Hard difficulty, appears at Google
   - Excellent for learning divide-and-conquer approaches

4. **Group Anagrams (#49)**
   - Tests hash table + string manipulation
   - Medium difficulty, appears at both
   - Teaches creative key generation for grouping

5. **Coin Change (#322)**
   - Classic DP problem, highly relevant for Google
   - Medium difficulty but teaches fundamental DP patterns
   - The unbounded knapsack pattern appears in many variations

## Which to Prepare for First

**Prepare for Google first.** Here's why:

1. **Coverage:** Google's preparation will naturally cover eBay's core topics (arrays, strings, hash tables) plus add DP and graph practice.
2. **Difficulty ramp:** If you can handle Google-style interviews, eBay's will feel more manageable.
3. **Timing:** Google's process is typically longer (4-6 weeks from phone screen to offer), while eBay often moves faster (2-4 weeks).

**Strategic schedule:**

- Weeks 1-4: Focus on Google patterns (DP, graphs, arrays, strings)
- Week 5: Review eBay-specific tagged questions (do all 60)
- Week 6: Mock interviews focusing on each company's style

**One exception:** If your eBay interview is scheduled first, reverse the order. But still prioritize learning DP—it's the highest-leverage topic for Google and appears in eBay's Hard questions.

Remember: Both companies value clean, readable code and clear communication. Practice explaining your thought process out loud. The technical patterns matter, but so does showing how you think through problems.

For more company-specific insights, check out our guides: [/company/google](/company/google) and [/company/ebay](/company/ebay).
