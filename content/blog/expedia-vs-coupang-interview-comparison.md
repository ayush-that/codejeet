---
title: "Expedia vs Coupang: Interview Question Comparison"
description: "Compare coding interview questions at Expedia and Coupang — difficulty levels, topic focus, and preparation strategy."
date: "2026-12-31"
category: "tips"
tags: ["expedia", "coupang", "comparison"]
---

# Expedia vs Coupang: A Strategic Interview Question Comparison

If you're preparing for interviews at both Expedia and Coupang, you're looking at two distinct technical cultures that happen to share a surprising amount of common ground in their coding assessments. The key insight isn't just that both companies test arrays and strings heavily—it's _how_ they test them. Expedia leans toward practical, business-logic problems you might encounter in travel tech, while Coupang pushes deeper into algorithmic optimization, reflecting its e-commerce and logistics DNA. Preparing for both simultaneously is actually quite efficient if you approach it strategically, focusing first on their significant overlap before branching into company-specific specialties.

## Question Volume and Difficulty

Let's decode what those numbers really mean for your preparation intensity.

**Expedia (54 questions: Easy 13, Medium 35, Hard 6)**
This distribution screams "medium-focused technical screen." With nearly 65% of questions at Medium difficulty, Expedia's interviews are designed to assess competent problem-solving within reasonable time constraints. The six Hard questions suggest you might encounter one challenging problem in later rounds, but the interview isn't primarily a gauntlet of optimization puzzles. The relatively high number of Easy questions (13) indicates they use simpler problems for initial screening or warm-up questions.

**Coupang (53 questions: Easy 3, Medium 36, Hard 14)**
Notice the dramatic difference: only 3 Easy questions versus 14 Hard. Coupang's distribution reveals a company that pushes candidates harder on algorithmic complexity and optimization. With over 26% of questions at Hard difficulty, you should expect at least one genuinely challenging problem in your interview loop. This aligns with Coupang's reputation as a tech-forward e-commerce company where system efficiency directly impacts logistics and customer experience.

**Implication:** If you're preparing for both, you should gear your practice toward Medium-Hard problems, knowing that Coupang will require more comfort with advanced optimization techniques, while Expedia will test broader implementation competence across more problems.

## Topic Overlap and Divergence

Both companies test **Array, String, and Hash Table** problems extensively—this is your foundation. But their secondary focuses reveal different priorities.

**Shared Foundation (Study These First):**

- **Array Manipulation:** Both companies love array problems involving sliding windows, two pointers, and in-place modifications.
- **String Operations:** Pattern matching, palindrome checks, and encoding/decoding problems appear frequently.
- **Hash Table Applications:** From frequency counting to memoization, both expect fluent use of hash maps.

**Expedia's Unique Emphasis: Greedy Algorithms**
Expedia's 6% focus on Greedy algorithms (versus minimal mention for Coupang) suggests they favor problems with practical, step-by-step optimization—think "minimum number of flights to cover all destinations" or "optimal booking schedules." These often model real travel industry problems.

**Coupang's Unique Emphasis: Dynamic Programming**
Coupang's significant DP focus (explicitly mentioned in their topics) reveals their interest in optimization problems with overlapping subproblems—perfect for logistics, inventory management, and resource allocation. If you're interviewing at Coupang, you must prepare for medium-hard DP problems.

## Preparation Priority Matrix

Here's how to allocate your limited prep time for maximum ROI:

1. **Overlap Topics (Highest Priority - 60% of prep time)**
   - Arrays: Sliding window, two pointers, rotation/shuffling
   - Strings: Palindrome variations, substring problems, encoding
   - Hash Tables: Frequency counting, complement finding, caching

   _Recommended problems useful for both:_ Two Sum (#1), Longest Substring Without Repeating Characters (#3), Group Anagrams (#49)

2. **Expedia-Specific (20% of prep time)**
   - Greedy algorithms: Scheduling, assignment, "minimum X to achieve Y" problems
   - _Recommended:_ Merge Intervals (#56), Task Scheduler (#621), Jump Game (#55)

3. **Coupang-Specific (20% of prep time)**
   - Dynamic Programming: 1D and 2D DP, knapsack variations, string DP
   - Graph algorithms (implied by their problem distribution)
   - _Recommended:_ Coin Change (#322), Longest Increasing Subsequence (#300), Word Break (#139)

## Interview Format Differences

**Expedia's Process:**
Typically 3-4 rounds including: initial phone screen (1 coding problem), virtual onsite (2-3 technical rounds with 1-2 problems each), and behavioral/System Design rounds. Problems tend to be 45-minute sessions with moderate difficulty. System design questions often relate to travel industry scenarios (booking systems, recommendation engines).

**Coupang's Process:**
Often begins with a more challenging online assessment, followed by 4-5 interview rounds. Coding sessions frequently involve 1-2 problems with deeper follow-up optimization questions ("now optimize it further"). System design heavily emphasizes scalability and logistics (inventory systems, delivery routing, real-time tracking).

**Key Difference:** Coupang interviews generally have more "depth over breadth"—they'll dig deeper into one problem's optimization. Expedia tends toward "breadth over depth"—covering more problems with slightly less extreme optimization demands.

## Specific Problem Recommendations for Both Companies

These five problems provide exceptional cross-company preparation value:

1. **Longest Substring Without Repeating Characters (#3)**
   - Tests sliding window (crucial for both), hash table usage, and string manipulation
   - Variations appear frequently in both companies' question banks

<div class="code-group">

```python
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        # If char seen and within current window, move left pointer
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(min(m, n))
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1;
    }
    charIndex.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(min(m, n))
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;
        }
        charIndex.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

</div>

2. **Merge Intervals (#56)**
   - Covers array sorting and greedy merging (Expedia's greedy focus)
   - Practical for scheduling problems common in both travel and e-commerce

3. **Product of Array Except Self (#238)**
   - Tests array manipulation and prefix/suffix thinking
   - Optimization from O(n²) to O(n) demonstrates algorithmic maturity both companies value

4. **Coin Change (#322)**
   - Essential DP problem for Coupang preparation
   - Also tests greedy thinking (though greedy doesn't always work—important nuance)

5. **Valid Parentheses (#20)**
   - Fundamental stack problem that tests basic DS competency
   - Frequently appears as a warm-up or part of more complex string problems

## Which to Prepare for First?

**Start with Expedia**, even if your Coupang interview comes first. Here's why:

1. **Foundation First:** Expedia's broader medium-difficulty coverage ensures you build comprehensive problem-solving skills. The jump from Expedia-level prep to Coupang's harder problems is easier than the reverse.

2. **Efficiency:** Mastering the overlap topics (arrays, strings, hash tables) through Expedia's lens gives you 80% of what you need for both. You can then layer on Coupang's DP depth.

3. **Confidence Building:** Solving more medium problems first builds pattern recognition and coding speed, which you'll need when tackling Coupang's harder problems under time pressure.

**Preparation Timeline:**

- Weeks 1-2: Focus on overlap topics using Expedia's question distribution
- Week 3: Add Expedia-specific greedy problems
- Week 4: Layer in Coupang-specific DP and advanced optimization
- Final days: Mixed practice with timing—simulate Coupang's depth and Expedia's breadth

Remember: Both companies ultimately test clean, efficient, well-communicated code. The patterns matter, but so does your ability to explain trade-offs and think aloud. Practice solving problems from both companies' question banks, but prioritize understanding _why_ certain approaches work over memorizing solutions.

For more company-specific insights, check out our detailed guides: [Expedia Interview Guide](/company/expedia) and [Coupang Interview Guide](/company/coupang).
