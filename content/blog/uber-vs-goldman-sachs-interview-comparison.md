---
title: "Uber vs Goldman Sachs: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Goldman Sachs — difficulty levels, topic focus, and preparation strategy."
date: "2030-01-26"
category: "tips"
tags: ["uber", "goldman-sachs", "comparison"]
---

# Uber vs Goldman Sachs: Interview Question Comparison

If you're preparing for interviews at both Uber and Goldman Sachs, you're facing two distinct challenges. While both are top-tier companies, their interview processes reflect their different engineering cultures and business needs. Uber's interviews emphasize practical problem-solving for real-time systems, while Goldman Sachs focuses on algorithmic precision for financial applications. The good news: there's significant overlap in their technical requirements, allowing for efficient preparation if you approach it strategically.

## Question Volume and Difficulty

Looking at the numbers tells an important story. Uber has 381 tagged questions (54 Easy, 224 Medium, 103 Hard) compared to Goldman Sachs' 270 (51 Easy, 171 Medium, 48 Hard). This 40% difference in total questions suggests Uber's interview process casts a wider net in terms of problem types and difficulty distribution.

The difficulty breakdown reveals more: Uber has more than twice as many Hard problems (103 vs 48), indicating they're more likely to push candidates with complex algorithmic challenges. Goldman Sachs, while still rigorous, shows a stronger Medium-problem focus (63% of their questions vs 59% for Uber). This doesn't mean Goldman Sachs interviews are easier—it means their Hard problems tend to be more concentrated in specific domains relevant to finance.

**Implication for preparation:** If you're strong on Medium problems but weaker on Hards, Goldman Sachs might be a slightly better fit initially. However, preparing for Uber's Hard problems will give you an advantage for both companies.

## Topic Overlap

Both companies heavily test the same four core topics: Array, String, Hash Table, and Dynamic Programming. This 100% overlap in top topics is excellent news for your preparation efficiency.

**Shared emphasis:**

- **Arrays:** Both companies love array manipulation problems, especially those involving sorting, searching, and two-pointer techniques
- **Dynamic Programming:** This appears in both lists because it's fundamental to optimization problems—Uber for route optimization, Goldman for financial optimization
- **Hash Tables:** Essential for efficient lookups in both domains

**Unique Goldman Sachs emphasis:** While not in their top four, Goldman Sachs places more weight on **Linked Lists** and **Trees**—data structures common in financial modeling and transaction systems. They also test **Math** problems more frequently due to quantitative finance requirements.

**Unique Uber emphasis:** Uber emphasizes **Graph** algorithms more heavily (for mapping and routing) and **Design** problems (for system architecture). Their questions often involve real-time data processing scenarios.

## Preparation Priority Matrix

Here's how to allocate your study time for maximum ROI:

**Tier 1: Overlap Topics (Study First)**

- Arrays & Strings: 30% of study time
- Hash Tables: 20% of study time
- Dynamic Programming: 25% of study time

**Tier 2: Uber-Specific Topics**

- Graphs: 15% of study time
- System Design: 10% of study time

**Tier 3: Goldman-Specific Topics**

- Linked Lists & Trees: 10% of study time
- Math/Probability: 5% of study time

For overlap topics, these problems provide excellent cross-company value:

<div class="code-group">

```python
# Two Sum (#1) - Uber and Goldman Sachs favorite
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    """
    Classic hash table problem that tests your ability to
    optimize lookups. Both companies use variations of this.
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Longest Substring Without Repeating Characters (#3)
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s):
    """
    Tests sliding window + hash table skills. Uber uses this
    for data stream problems, Goldman for sequence analysis.
    """
    char_index = {}
    left = max_length = 0

    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Two Sum (#1)
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

// Longest Substring Without Repeating Characters (#3)
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
// Two Sum (#1)
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}

// Longest Substring Without Repeating Characters (#3)
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

## Interview Format Differences

**Uber's Format:**

- Typically 4-5 rounds including 2-3 coding, 1 system design, 1 behavioral
- Coding problems often involve real-world scenarios (matching riders/drivers, surge pricing)
- System design is crucial—expect questions about scaling real-time systems
- Virtual or on-site with equal weight on both
- 45-60 minutes per coding round, often with 2 medium problems or 1 hard

**Goldman Sachs' Format:**

- Usually 3-4 rounds with heavier focus on pure algorithms
- Problems often have financial context (portfolio optimization, transaction validation)
- Less emphasis on system design (unless applying for specific roles)
- More likely to include mathematical/probability questions
- 45 minutes per round, typically 1-2 medium problems
- Strong behavioral component focusing on risk management and compliance mindset

**Key difference:** Uber interviews feel more like building something, while Goldman Sachs interviews feel more like proving mathematical/algorithmic competence.

## Specific Problem Recommendations

For someone interviewing at both companies, these 5 problems provide exceptional coverage:

1. **Best Time to Buy and Sell Stock (#121)** - Perfect overlap: Uber for surge pricing logic, Goldman for trading algorithms. Tests array traversal and optimization.

2. **Merge Intervals (#56)** - Uber uses this for scheduling rides, Goldman for financial time periods. Excellent for testing sorting and interval logic.

3. **Word Break (#139)** - Dynamic Programming problem loved by both. Uber for parsing location data, Goldman for transaction validation patterns.

4. **Course Schedule (#207)** - Graph/topological sort problem. Uber for prerequisite checking in systems, Goldman for dependency resolution in financial pipelines.

5. **LRU Cache (#146)** - System design fundamentals. Uber for caching ride data, Goldman for financial instrument caching.

## Which to Prepare for First

**Prepare for Uber first if:**

- You have system design experience
- You're comfortable with graph algorithms
- Your interviews are close together (Uber's broader coverage will help with Goldman)

**Prepare for Goldman Sachs first if:**

- You're stronger at pure algorithms than system design
- You need to build confidence with Medium problems
- You have more time before your Uber interview

**Strategic recommendation:** Start with the overlap topics (Arrays, Strings, Hash Tables, DP), then add Uber-specific graph problems, then Goldman-specific linked list/tree problems. This gives you 80% coverage for both companies with minimal context switching.

Remember: Uber's interview will stress-test your ability to build scalable systems, while Goldman Sachs will test your algorithmic precision. Both value clean code, clear communication, and systematic problem-solving—so practice explaining your thinking aloud.

For more company-specific insights, check out our [Uber interview guide](/company/uber) and [Goldman Sachs interview guide](/company/goldman-sachs).
