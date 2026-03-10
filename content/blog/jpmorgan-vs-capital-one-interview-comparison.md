---
title: "JPMorgan vs Capital One: Interview Question Comparison"
description: "Compare coding interview questions at JPMorgan and Capital One — difficulty levels, topic focus, and preparation strategy."
date: "2026-03-02"
category: "tips"
tags: ["jpmorgan", "capital-one", "comparison"]
---

If you're interviewing at both JPMorgan and Capital One, you're in a fortunate position: these are two of the most structured and predictable technical interview processes in the finance-tech space. While both are large financial institutions, their engineering cultures and interview focuses differ in subtle but important ways. The good news is that there's significant overlap in what they test, meaning you can prepare efficiently for both simultaneously. This comparison will break down the data, highlight the strategic differences, and give you a prioritized study plan to maximize your chances at both.

## Question Volume and Difficulty

Let's start with the raw numbers. JPMorgan's tagged question list on LeetCode stands at **78 questions**, broken down as **Easy: 25, Medium: 45, Hard: 8**. Capital One's list is **57 questions**, with a breakdown of **Easy: 11, Medium: 36, Hard: 10**.

What does this tell us?

- **JPMorgan's process is broader.** With 21 more tagged questions, their interview pool is larger. This doesn't necessarily mean their interviews are harder, but it suggests more variety and potentially less predictability. You need a wider foundation.
- **Capital One leans slightly more challenging.** Look at the Hard count: 10 out of 57 (~17.5%) for Capital One vs. 8 out of 78 (~10%) for JPMorgan. While both are overwhelmingly Medium-focused (the standard for most tech interviews), Capital One has a slightly higher propensity to include a truly difficult problem. Their Mediums also tend to be on the more complex end of the spectrum.
- **The intensity implication:** JPMorgan interviews might feel like a comprehensive test of fundamentals across many problem types. Capital One interviews might feel like a deeper dive into fewer, more intricate problems. For JPMorgan, speed and accuracy on standard patterns is key. For Capital One, resilience and deep problem-solving on trickier implementations is valuable.

## Topic Overlap

The core of your preparation is identical for both companies. The top four topics are a perfect match:

1.  **Array:** The absolute fundamental. Expect manipulations, sliding windows, two-pointer techniques, and prefix sums.
2.  **String:** Closely tied to array problems. Focus on palindrome checks, anagrams, string parsing, and common subsequence problems.
3.  **Hash Table:** The go-to data structure for achieving O(1) lookups to optimize solutions. It's less of a topic and more of a critical tool you'll use in 70% of your solutions.
4.  **Sorting:** Often a prerequisite step. Know your standard sorts (Quick, Merge) and more importantly, know when to sort to enable a simpler two-pointer or greedy solution.

**Unique to JPMorgan:** **Sorting** is explicitly listed as a top-tier topic. This signals that they frequently ask problems where the _insight_ is that sorting the data first unlocks the solution. Think "Meeting Rooms II" or "Non-overlapping Intervals."

**Unique to Capital One:** **Math.** This isn't just arithmetic. This category includes number theory (prime checks, GCD), simulation problems (like "Rotate Image"), and problems that require a clever mathematical trick or formula (e.g., "Happy Number," "Pow(x, n)").

## Preparation Priority Matrix

Use this to allocate your study time strategically.

| Priority                        | Topics                                          | Rationale                                                                                                        | Sample LeetCode Problems                                                                     |
| :------------------------------ | :---------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Tier 1 (Max ROI)**            | **Array, String, Hash Table**                   | The universal core for both companies. Mastery here is non-negotiable.                                           | Two Sum (#1), Valid Anagram (#242), Group Anagrams (#49), Contains Duplicate (#217)          |
| **Tier 2 (JPMorgan Focus)**     | **Sorting**                                     | JPMorgan's explicit call-out. Practice problems where sorting is the key insight.                                | Merge Intervals (#56), Non-overlapping Intervals (#435), Meeting Rooms II (#253)             |
| **Tier 2 (Capital One Focus)**  | **Math**                                        | Capital One's differentiator. Be comfortable with digit manipulation, simulation, and basic number theory.       | Happy Number (#202), Rotate Image (#48), Plus One (#66), Count Primes (#204)                 |
| **Tier 3 (General Competence)** | Linked List, Tree, DFS/BFS, Dynamic Programming | While not in the top 4 for either, these are common secondary topics that appear in their Medium-Hard questions. | Reverse Linked List (#206), Binary Tree Level Order Traversal (#102), Maximum Subarray (#53) |

## Interview Format Differences

This is where the companies diverge beyond just question content.

- **JPMorgan:** The process is typically very structured, often starting with a HackerRank online assessment. The on-site/virtual final rounds usually consist of **2-3 technical interviews** (45-60 minutes each) that are purely coding/algorithms, followed by a behavioral round. The problems are often classic LeetCode-style. System design is **rare for entry to mid-level roles**; it may appear for senior positions but is less emphasized than at pure tech firms.
- **Capital One:** Known for its **"case study"** format, especially for data and business-aligned engineering roles. A coding interview might be framed within a business context (e.g., "design a feature to detect fraudulent transactions"). They heavily weight **behavioral and leadership principles** (their "HOW" values) in every round. You might have **1-2 coding rounds** alongside behavioral and system design discussions. For mid-level+, expect a **light system design** component (e.g., "design a URL shortener") to assess architectural thinking, even if the title isn't "System Design Engineer."

**The Takeaway:** For JPMorgan, prep is like standard tech prep: grind LeetCode. For Capital One, you must also: 1) Practice explaining your code in terms of business impact, 2) Prepare strong STAR-method behavioral stories, and 3) Brush up on basic system design concepts.

## Specific Problem Recommendations for Dual Preparation

Here are 5 problems that efficiently cover patterns relevant to both companies.

<div class="code-group">

```python
# 1. Two Sum (#1) - The Hash Table Archetype
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    """
    The foundational hash map problem. Teaches you to trade space for time.
    Relevant for both companies due to heavy Hash Table focus.
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# 2. Group Anagrams (#49) - String & Hash Table Mastery
# Time: O(n * k log k) | Space: O(n * k) [where k is max string length]
def groupAnagrams(strs):
    """
    Excellent for practicing hash map with a custom key (sorted string).
    Tests string manipulation and categorization logic.
    """
    from collections import defaultdict
    anagrams = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))  # The canonical key
        anagrams[key].append(s)
    return list(anagrams.values())

# 3. Merge Intervals (#56) - The Sorting Insight (JPMorgan)
# Time: O(n log n) | Space: O(n) [or O(1) if sorting in-place]
def merge(intervals):
    """
    Classic 'sort first' problem. The entire solution hinges on sorting by start time.
    Directly addresses JPMorgan's Sorting focus and is a common pattern.
    """
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:  # Overlap
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    return merged

# 4. Happy Number (#202) - Math & Cycle Detection (Capital One)
# Time: O(log n) | Space: O(log n) [or O(1) with Floyd's Cycle Detection]
def isHappy(n):
    """
    Covers Capital One's Math category. Involves digit manipulation and
    a classic cycle detection pattern (can be solved with hash set or fast/slow pointers).
    """
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = get_next(n)
    return n == 1

# 5. Product of Array Except Self (#238) - Array Manipulation
# Time: O(n) | Space: O(1) [if output array is not counted]
def productExceptSelf(nums):
    """
    A superb Medium problem that tests your ability to derive an O(n) solution
    with clever array passes (prefix and suffix products). Tests fundamental
    array logic required by both.
    """
    n = len(nums)
    answer = [1] * n
    # Left pass - prefix product
    left_product = 1
    for i in range(n):
        answer[i] = left_product
        left_product *= nums[i]
    # Right pass - suffix product
    right_product = 1
    for i in range(n-1, -1, -1):
        answer[i] *= right_product
        right_product *= nums[i]
    return answer
```

```javascript
// 1. Two Sum (#1) - The Hash Table Archetype
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

// 2. Group Anagrams (#49) - String & Hash Table Mastery
// Time: O(n * k log k) | Space: O(n * k)
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}

// 3. Merge Intervals (#56) - The Sorting Insight (JPMorgan)
// Time: O(n log n) | Space: O(n)
function merge(intervals) {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= last[1]) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

// 4. Happy Number (#202) - Math & Cycle Detection (Capital One)
// Time: O(log n) | Space: O(log n)
function isHappy(n) {
  function getNext(num) {
    let total = 0;
    while (num > 0) {
      const digit = num % 10;
      total += digit * digit;
      num = Math.floor(num / 10);
    }
    return total;
  }
  const seen = new Set();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = getNext(n);
  }
  return n === 1;
}

// 5. Product of Array Except Self (#238) - Array Manipulation
// Time: O(n) | Space: O(1)
function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = leftProduct;
    leftProduct *= nums[i];
  }
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  return answer;
}
```

```java
// 1. Two Sum (#1) - The Hash Table Archetype
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}

// 2. Group Anagrams (#49) - String & Hash Table Mastery
// Time: O(n * k log k) | Space: O(n * k)
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        map.putIfAbsent(key, new ArrayList<>());
        map.get(key).add(s);
    }
    return new ArrayList<>(map.values());
}

// 3. Merge Intervals (#56) - The Sorting Insight (JPMorgan)
// Time: O(n log n) | Space: O(n) [or O(log n) for sorting space]
public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] curr = intervals[i];
        if (curr[0] <= last[1]) {
            last[1] = Math.max(last[1], curr[1]);
        } else {
            merged.add(curr);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}

// 4. Happy Number (#202) - Math & Cycle Detection (Capital One)
// Time: O(log n) | Space: O(log n)
public boolean isHappy(int n) {
    Set<Integer> seen = new HashSet<>();
    while (n != 1 && !seen.contains(n)) {
        seen.add(n);
        n = getNext(n);
    }
    return n == 1;
}
private int getNext(int n) {
    int total = 0;
    while (n > 0) {
        int digit = n % 10;
        total += digit * digit;
        n /= 10;
    }
    return total;
}

// 5. Product of Array Except Self (#238) - Array Manipulation
// Time: O(n) | Space: O(1) [output array is typically not counted]
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];
    // Left pass
    int leftProduct = 1;
    for (int i = 0; i < n; i++) {
        answer[i] = leftProduct;
        leftProduct *= nums[i];
    }
    // Right pass
    int rightProduct = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    return answer;
}
```

</div>

## Which to Prepare for First?

The strategic answer is **Capital One**.

Here's why: Capital One's process, with its case-study framing and behavioral emphasis, requires a broader skill set. Preparing for Capital One forces you to:

1.  **Solidify your core algorithms** (for the coding).
2.  **Practice articulating the "why"** behind your code (for the business context).
3.  **Polish your behavioral stories** (for their "HOW" principles).
4.  **Review basic system design** (for potential light architectural questions).

Once you've done this, preparing for JPMorgan becomes a subset of that work: primarily a focused, deep dive into their larger question bank, with extra attention on **Sorting-based problems**. You'll already have the core algorithmic skills and communication practice; you just need to adapt to their more standard, direct problem-solving format.

In short, prep for the more holistic interview (Capital One) first, then specialize for the more purely algorithmic one (JPMorgan). This approach gives you the highest combined probability of success.

For more detailed breakdowns of each company's process, check out the CodeJeet guides for [JPMorgan](/company/jpmorgan) and [Capital One](/company/capital-one).
