---
title: "How to Crack General Motors Coding Interviews in 2026"
description: "Complete guide to General Motors coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-12-05"
category: "company-guide"
company: "general-motors"
tags: ["general-motors", "interview prep", "leetcode"]
---

# How to Crack General Motors Coding Interviews in 2026

General Motors isn't just a car company anymore—it's a software company that builds vehicles. Their interview process reflects this dual identity, blending traditional software engineering rigor with practical, system-level thinking. The typical process for software roles includes an initial recruiter screen, a technical phone screen (often one 60-minute coding round), and a final virtual onsite consisting of 3-4 rounds. These rounds usually include 2-3 coding sessions, and 1-2 system design or behavioral discussions. What makes GM unique is the timing: they often move faster than big tech, with processes wrapping in 2-3 weeks, and their questions frequently have a tangible connection to real-world automotive or mobility problems, even if abstracted into a LeetCode format.

## What Makes General Motors Different

While FAANG companies might prioritize algorithmic purity and cutting-edge scalability, General Motors interviews test for **practical problem-solving on constrained systems**. You're less likely to get a purely academic graph theory puzzle and more likely to get a problem involving data streams, sensor fusion logic, or state management—all wrapped in classic data structure clothing. Three key differences stand out:

1.  **Design Discussions are Concrete:** System design questions often revolve around actual automotive or IoT-adjacent systems (e.g., "design a key fob system," "outline a telematics data pipeline"). They want to see you consider hardware constraints, network reliability, and safety.
2.  **Communication Over Pseudocode:** While you can write pseudocode for complex parts, interviewers strongly prefer runnable, logical code in your chosen language. They assess how cleanly you can translate a business rule into a working function.
3.  **Optimization is Contextual:** They care about Big O, but they also care about _practical_ optimization. For example, is your solution efficient enough to run on an embedded module with limited memory? Can it handle real-time data from hundreds of sensors? This "systems-aware" thinking is a differentiator.

## By the Numbers

An analysis of recent General Motors coding questions reveals a clear profile:

- **Easy:** 1 (10%)
- **Medium:** 6 (60%)
- **Hard:** 3 (30%)

This breakdown is telling. The heavy emphasis on Medium problems means you must be **exceptionally consistent**. You cannot afford to stumble on problems like "Merge Intervals" or "Validate Binary Search Tree." The 30% Hard problems are your gatekeepers; they're often the deciding factor for senior roles and typically involve Dynamic Programming or complex graph traversal. You won't see many "trick" Hards—instead, expect layered problems that combine multiple patterns.

For example, a known GM Hard variant is essentially **"Trapping Rain Water II (#407)"**—a 3D extension of the classic DP/Two Pointer problem, which models water flow in a complex environment. A frequent Medium is **"LRU Cache (#146)"**, a perfect test of designing a data structure with O(1) operations, highly relevant for caching in-vehicle infotainment data.

## Top Topics to Focus On

Master these five areas, which constitute the majority of GM's technical questions.

**1. Array & Hash Table**
This is the bedrock. GM problems often model sequences of sensor readings, time-series data, or event logs. The Hash Table is your primary tool for achieving O(1) lookups, which is critical for real-time processing. The most important pattern is the **Prefix Sum with Hash Map**, used for problems involving subarray sums or contiguous sequences.

<div class="code-group">

```python
# LeetCode #560: Subarray Sum Equals K
# Problem: Find the total number of contiguous subarrays whose sum equals k.
# Pattern: Prefix Sum with Hash Map
# Time: O(n) | Space: O(n)
def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> frequency_of_occurrence
    sum_map = {0: 1}  # Base case: a prefix sum of 0 has occurred once

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) exists in map, we found subarrays ending here that sum to k
        count += sum_map.get(prefix_sum - k, 0)
        # Update the frequency of the current prefix sum
        sum_map[prefix_sum] = sum_map.get(prefix_sum, 0) + 1

    return count
```

```javascript
// LeetCode #560: Subarray Sum Equals K
// Time: O(n) | Space: O(n)
function subarraySum(nums, k) {
  let count = 0;
  let prefixSum = 0;
  const sumMap = new Map();
  sumMap.set(0, 1); // Base case

  for (const num of nums) {
    prefixSum += num;
    // Check if we have seen (prefixSum - k) before
    if (sumMap.has(prefixSum - k)) {
      count += sumMap.get(prefixSum - k);
    }
    // Update map with current prefix sum
    sumMap.set(prefixSum, (sumMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
// LeetCode #560: Subarray Sum Equals K
// Time: O(n) | Space: O(n)
public int subarraySum(int[] nums, int k) {
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> sumMap = new HashMap<>();
    sumMap.put(0, 1); // Base case

    for (int num : nums) {
        prefixSum += num;
        // If (prefixSum - k) exists, add its frequency to count
        count += sumMap.getOrDefault(prefixSum - k, 0);
        // Update the map with the current prefix sum
        sumMap.put(prefixSum, sumMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
```

</div>

**2. Dynamic Programming**
DP appears in nearly every Hard problem at GM. The focus is on **applied optimization**—like finding the most efficient path, minimizing cost, or maximizing output given constraints (e.g., battery usage, processing steps). You must be fluent in both 1D and 2D DP. The classic **"House Robber"** pattern (deciding at each step whether to take an item/action or skip it) is fundamental.

**3. Design**
This isn't just large-scale system design. GM heavily tests **object-oriented design (OOD)** for modeling real-world entities (e.g., a parking garage, a vehicle trim configuration system) and **data structure design** (like designing a cache, a logger, or a rate limiter). Practice translating a set of requirements into a clean class hierarchy with clear APIs.

**4. String**
String manipulation questions often relate to parsing log files, validating VINs or serial numbers, or processing GPS coordinates. Key patterns include **Sliding Window** for substrings and **Two Pointers** for in-place manipulation or palindrome checks.

<div class="code-group">

```python
# LeetCode #3: Longest Substring Without Repeating Characters
# Problem: Find the length of the longest substring without repeating characters.
# Pattern: Sliding Window with Hash Set
# Time: O(n) | Space: O(min(n, m)) where m is charset size
def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        # If duplicate found, shrink window from the left
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        # Add new char and update max length
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// LeetCode #3: Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(min(n, m))
function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
// LeetCode #3: Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(min(n, m))
public int lengthOfLongestSubstring(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        charSet.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

**5. Tree/Graph**
While not in the top 5 by raw count, graph traversal (BFS/DFS) is essential for any problem modeling networks, dependencies, or hierarchical data (e.g., component failure propagation, navigation routing).

## Preparation Strategy: The 6-Week Plan

**Weeks 1-2: Foundation & Patterns**

- **Goal:** Complete 40-50 problems. Focus solely on Easy and Medium problems from the top topics (Array, Hash Table, String).
- **Action:** Do not just solve. For each problem, write the brute force solution first, then optimize. Practice explaining your reasoning out loud. Use a whiteboard or Miro board.
- **Weekly Target:** ~25 problems.

**Weeks 3-4: Depth & Integration**

- **Goal:** Tackle 30-40 problems, shifting weight to Medium and introducing Hards. Start integrating topics (e.g., a DP problem that uses a Hash Table).
- **Action:** Dedicate two full days to Dynamic Programming. Master the five classic patterns: 0/1 Knapsack, Unbounded Knapsack, Fibonacci, Longest Common Subsequence, and Palindromic Substrings. Practice at least 2 OOD problems per week.
- **Weekly Target:** ~20 problems.

**Weeks 5-6: Simulation & Polish**

- **Goal:** Mock interviews and targeted review.
- **Action:**
  - Conduct 4-6 mock interviews under realistic conditions (45-min timer, video on, explaining everything).
  - Re-solve 15-20 of your previously solved Medium/Hard problems from memory.
  - Prepare 3-4 detailed stories for behavioral questions using the STAR method, focusing on collaboration, debugging complex issues, and handling trade-offs.

## Common Mistakes (And How to Fix Them)

1.  **Ignoring Practical Constraints:** Candidates jump to the most algorithmically optimal solution without considering memory or real-time constraints.
    - **Fix:** Always ask clarifying questions: "What's the expected input size?" "Is this running on a resource-constrained device?" Then, mention trade-offs. "A hash table gives O(1) lookups but uses more memory; an array uses less memory but gives O(n) lookups."

2.  **Overcomplicating Object-Oriented Design:** They create deep, unnecessary inheritance hierarchies for simple OOD problems.
    - **Fix:** Start with the core nouns in the problem statement as potential classes. Favor composition over inheritance. Define clear, single-responsibility public methods first. It's better to have three simple, well-defined classes than one "clever" abstract class.

3.  **Silent Struggle:** When stuck on a Hard problem, they go quiet for 10 minutes, hoping for inspiration.
    - **Fix:** Talk _constantly_. Verbalize your thought process: "I'm considering a DP approach because we have overlapping subproblems. Let me define `dp[i]` as... Hmm, that doesn't cover case X. What if `dp[i][j]` represents...?" This lets the interviewer guide you and assesses your problem-solving _process_, not just the answer.

4.  **Neglecting Code Readability:** They write working but messy code with poor variable names and no comments on complex logic.
    - **Fix:** Write code as if the next engineer to read it is a new hire. Use `current_speed` instead of `cs`. Add a one-line comment before a non-obvious block (e.g., `// Kadane's algorithm: track max ending here`).

## Key Tips

1.  **Lead with a Brute Force:** For any problem, immediately state a simple, brute force solution and its complexity. This demonstrates a structured approach and gives you a starting point for optimization. It's far better than staring blankly at the screen.

2.  **Practice "Automotive Adjacent" Problems:** Seek out LeetCode problems that involve scheduling, rate limiting, caching, state machines, and parsing. Problems like **"Merge Intervals (#56)"** (scheduling tasks), **"Design Hit Counter (#362)"** (counting events), and **"Design Parking Lot** (OOD)\*\* are highly relevant.

3.  **Master One Advanced Pattern: Monotonic Stack.** This is a secret weapon for array-based "next greater element" or "trapping rain water" problems that GM favors. Be able to derive it on the spot.

<div class="code-group">

```python
# LeetCode #739: Daily Temperatures
# Problem: For each day, find how many days until a warmer temperature.
# Pattern: Monotonic Decreasing Stack (stores indices)
# Time: O(n) | Space: O(n)
def dailyTemperatures(temperatures):
    n = len(temperatures)
    answer = [0] * n
    stack = []  # stores indices of temperatures

    for i in range(n):
        # While current temp is greater than temp at index stored on stack
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index
        stack.append(i)
    return answer
```

```javascript
// LeetCode #739: Daily Temperatures
// Time: O(n) | Space: O(n)
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIndex = stack.pop();
      answer[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }
  return answer;
}
```

```java
// LeetCode #739: Daily Temperatures
// Time: O(n) | Space: O(n)
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIndex = stack.pop();
            answer[prevIndex] = i - prevIndex;
        }
        stack.push(i);
    }
    return answer;
}
```

</div>

4.  **Prepare Your "Why GM?":** Your answer must go beyond "I like cars." Research their specific initiatives in electric vehicles (Ultium), autonomous driving (Cruise), or software-defined vehicles. Connect your skills to their mission.

5.  **Test Your Own Code:** Before declaring "done," walk through a small, non-trivial test case with your code. This catches off-by-one errors and shows meticulousness.

General Motors is looking for engineers who can build robust, efficient software for the physical world. Your interview is a chance to prove you think not just in algorithms, but in systems. Master the patterns, practice the communication, and you'll be well on your way.

[Browse all General Motors questions on CodeJeet](/company/general-motors)
