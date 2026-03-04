---
title: "How to Practice LeetCode Effectively: A Strategic Approach"
description: "Stop grinding random problems. Learn a structured approach to LeetCode practice that maximizes learning and interview readiness."
date: "2026-07-25"
category: "tips"
tags: ["leetcode", "study plan", "interview prep", "strategy"]
---

Most people practice LeetCode wrong. They pick random problems, spend an hour struggling, check the solution, and move on. Two months later, they cannot solve the same problem. The issue is not effort -- it is strategy.

## Phase 1: Learn Patterns, Not Problems

Individual problems do not matter. Patterns do. If you understand the two pointer pattern, you can solve dozens of problems that use it. Learn patterns one at a time in this order:

1. Arrays and hashing (frequency maps, Two Sum)
2. Two pointers
3. Sliding window
4. Stack
5. Binary search
6. Linked lists
7. Trees (traversals, BST properties)
8. Graphs (BFS, DFS, topological sort)
9. Dynamic programming
10. Backtracking

For each pattern, study the concept first, then solve 5-8 problems that use it. Do not move on until the current one feels comfortable. CodeJeet organizes problems by [topic](/dashboard) to make this easy.

Let's look at concrete examples for the first few patterns to illustrate their core templates.

### 1. Arrays and Hashing: The Frequency Map

The key insight is to trade space for time by using a hash map (dictionary) to store counts or indices. This pattern is foundational for problems like Two Sum, Group Anagrams, and Top K Frequent Elements.

<div class="code-group">

```python
# Example: Two Sum
def two_sum(nums, target):
    num_map = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

# Example: Group Anagrams
def group_anagrams(strs):
    from collections import defaultdict
    anagram_map = defaultdict(list)
    for s in strs:
        # Use sorted string as key
        key = ''.join(sorted(s))
        anagram_map[key].append(s)
    return list(anagram_map.values())
```

```javascript
// Example: Two Sum
function twoSum(nums, target) {
  const numMap = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    numMap.set(nums[i], i);
  }
  return [];
}

// Example: Group Anagrams
function groupAnagrams(strs) {
  const anagramMap = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!anagramMap.has(key)) {
      anagramMap.set(key, []);
    }
    anagramMap.get(key).push(s);
  }
  return Array.from(anagramMap.values());
}
```

```java
// Example: Two Sum
import java.util.HashMap;
import java.util.Map;

public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> numMap = new HashMap<>(); // value -> index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (numMap.containsKey(complement)) {
            return new int[]{numMap.get(complement), i};
        }
        numMap.put(nums[i], i);
    }
    return new int[]{};
}

// Example: Group Anagrams
import java.util.*;

public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> anagramMap = new HashMap<>();
    for (String s : strs) {
        char[] charArray = s.toCharArray();
        Arrays.sort(charArray);
        String key = new String(charArray);
        anagramMap.putIfAbsent(key, new ArrayList<>());
        anagramMap.get(key).add(s);
    }
    return new ArrayList<>(anagramMap.values());
}
```

</div>

### 2. Two Pointers

This pattern uses two indices to traverse a data structure, often from opposite ends or at different speeds. It's ideal for problems involving sorted arrays, palindromes, or removing duplicates.

<div class="code-group">

```python
# Example: Valid Palindrome (ignoring non-alphanumeric)
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

# Example: Remove Duplicates from Sorted Array (in-place)
def remove_duplicates(nums):
    if not nums:
        return 0
    insert_pos = 1  # Pointer for the next unique element position
    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:
            nums[insert_pos] = nums[i]
            insert_pos += 1
    return insert_pos
```

```javascript
// Example: Valid Palindrome
function isPalindrome(s) {
  let left = 0,
    right = s.length - 1;
  while (left < right) {
    while (left < right && !/^[a-z0-9]$/i.test(s[left])) left++;
    while (left < right && !/^[a-z0-9]$/i.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

// Example: Remove Duplicates from Sorted Array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let insertPos = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }
  return insertPos;
}
```

```java
// Example: Valid Palindrome
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Example: Remove Duplicates from Sorted Array
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int insertPos = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[i - 1]) {
            nums[insertPos] = nums[i];
            insertPos++;
        }
    }
    return insertPos;
}
```

</div>

### 3. Sliding Window

The sliding window pattern maintains a subset of data (a "window") that moves across a linear data structure. It's perfect for problems involving contiguous subarrays, substrings, or finding a maximum/minimum within a window of fixed or variable size.

<div class="code-group">

```python
# Example: Maximum Sum Subarray of Size K (Fixed Window)
def max_sum_subarray_fixed(nums, k):
    if len(nums) < k:
        return 0
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        # Slide the window: remove leftmost, add new rightmost
        window_sum = window_sum - nums[i - k] + nums[i]
        max_sum = max(max_sum, window_sum)
    return max_sum

# Example: Longest Substring Without Repeating Characters (Variable Window)
def length_of_longest_substring(s):
    char_set = set()
    left = 0
    max_length = 0
    for right in range(len(s)):
        # Shrink window from left until no duplicate
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    return max_length
```

```javascript
// Example: Maximum Sum Subarray of Size K
function maxSumSubarrayFixed(nums, k) {
  if (nums.length < k) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum = windowSum - nums[i - k] + nums[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// Example: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0,
    maxLength = 0;
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
// Example: Maximum Sum Subarray of Size K
public int maxSumSubarrayFixed(int[] nums, int k) {
    if (nums.length < k) return 0;
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int maxSum = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}

// Example: Longest Substring Without Repeating Characters
import java.util.HashSet;
import java.util.Set;

public int lengthOfLongestSubstring(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0, maxLength = 0;
    for (int right = 0; right < s.length(); right++) {
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        charSet.add(s.charAt(right));
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

## Phase 2: The Three-Attempt Rule

**Attempt 1 (25 minutes max).** Try to solve it. If you cannot after 25 minutes, stop.

**Study the solution.** Understand why it works. Identify the pattern. Trace through examples. Ask: "What was the key insight I missed?"

**Attempt 2 (next day).** Solve from scratch without the solution. If you still struggle, study more carefully.

**Attempt 3 (one week later).** Revisit. If you solve it quickly, it is solidified.

This spaced repetition builds long-term memory. Track which problems to revisit and when.

Let's see how this rule applies to a classic problem: **"Valid Parentheses"** (a Stack pattern problem). The key insight is that a stack is perfect for matching nested structures because the last opened bracket must be the first closed (LIFO principle).

<div class="code-group">

```python
# Valid Parentheses Solution
def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:  # It's a closing bracket
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # It's an opening bracket
            stack.append(char)
    return not stack  # Stack should be empty if all brackets matched
```

```javascript
// Valid Parentheses Solution
function isValid(s) {
  const stack = [];
  const mapping = { ")": "(", "}": "{", "]": "[" };
  for (const char of s) {
    if (char in mapping) {
      const topElement = stack.length ? stack.pop() : "#";
      if (mapping[char] !== topElement) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}
```

```java
// Valid Parentheses Solution
import java.util.Stack;

public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');
    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) {
            char topElement = stack.empty() ? '#' : stack.pop();
            if (topElement != mapping.get(c)) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.isEmpty();
}
```

</div>

**Applying the Three-Attempt Rule:**

- **Attempt 1:** You might try a counter-based approach, which fails for nested cases like `([)]`. After 25 minutes, you look up the solution and realize the stack is necessary.
- **Attempt 2 (Next Day):** You implement the stack solution from memory, focusing on the mapping dictionary and the edge case of an empty stack.
- **Attempt 3 (One Week Later):** You solve it quickly and can explain why a queue or a simple counter wouldn't work. The pattern is now internalized.

## How Many Problems

Quality beats quantity. 150-200 problems with deep understanding beats 500 solved superficially. For a 2-3 month timeline, that is 2-3 problems per day.

Rough breakdown by pattern: Arrays/hashing 20, Two pointers 10, Sliding window 10, Stack/queue 10, Binary search 10, Linked lists 10, Trees 20, Graphs 15, DP 25, Backtracking 10, Misc 10.

## Topic-Based vs Random Practice

**First 4-6 weeks:** Practice by topic. Build pattern recognition. You should identify "this is a sliding window problem" within 30 seconds of reading the statement.

**Final 2-4 weeks:** Switch to random practice. Simulate real interviews where you do not know the topic. Practice pattern identification, not just application.

To aid pattern identification, here's a quick decision flowchart for common problem types:

1.  **Does it involve contiguous subarrays/substrings with a sum, product, or unique constraint?** → **Sliding Window**.
2.  **Is the input sorted, or does it involve pairing elements?** → **Two Pointers**.
3.  **Does it involve nested structures, matching pairs, or undo operations?** → **Stack**.
4.  **Can the problem be broken down into overlapping subproblems, often with a "maximum/minimum" or "number of ways" ask?** → **Dynamic Programming**.
5.  **Does it involve exploring all possible combinations or permutations?** → **Backtracking**.

## Difficulty Progression

Within each topic: 2-3 easy problems to learn the template, 3-5 mediums that add complexity, 1-2 hards to push limits. Do not skip easies (they build muscle memory) but do not linger on them (interviews test medium and hard).

For example, in **Binary Search**, start with the basic template for finding a target in a sorted array, then progress to rotated arrays and finding boundaries.

<div class="code-group">

```python
# Binary Search Basic Template
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Medium Variation: Find First Bad Version
def first_bad_version(n, isBadVersion):
    left, right = 1, n
    while left < right:  # Note: not <=
        mid = left + (right - left) // 2
        if isBadVersion(mid):
            right = mid  # Search left half, including mid
        else:
            left = mid + 1
    return left  # Left and right converge
```

```javascript
// Binary Search Basic Template
function binarySearch(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Medium Variation: Find First Bad Version
function firstBadVersion(n, isBadVersion) {
  let left = 1,
    right = n;
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (isBadVersion(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
```

```java
// Binary Search Basic Template
public int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // Prevent overflow
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Medium Variation: Find First Bad Version
public int firstBadVersion(int n, Function<Integer, Boolean> isBadVersion) {
    int left = 1, right = n;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (isBadVersion.apply(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

</div>

## Track Progress

Keep a log with: problem name, date, pattern used, difficulty, solved independently (yes/no), one-line note on the key insight. Review weekly to identify weak patterns and schedule spaced repetition.

A sample log entry in markdown format is practical:

```markdown
| Date       | Problem (Link)                              | Pattern      | Difficulty | Independent?   | Key Insight                                                                                                                            |
| ---------- | ------------------------------------------- | ------------ | ---------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-03-15 | [3Sum](https://leetcode.com/problems/3sum/) | Two Pointers | Medium     | No (Attempt 1) | Sort array first. Fix one number, then use two pointers on the rest to find complement. Avoid duplicates by skipping identical values. |
```

## When Are You Ready

You are ready when you can: identify the correct pattern within 2 minutes, solve most mediums in 25 minutes, articulate your approach before coding, analyze complexity without hesitating, and complete a mock interview successfully.

## Common Pitfalls

**Spending too long on one problem.** After 30 minutes stuck, look at the solution. Learning from studied solutions beats wasting an hour.

**Only solving easy problems.** Builds false confidence. Push to medium and hard.

**Not reviewing.** Solving once and never returning means forgetting. The three-attempt rule exists for this reason.

**Ignoring communication.** Practice explaining your approach out loud. In interviews, how you communicate matters as much as the answer. Use the **"Think Aloud"** method: narrate your thought process as you break down the problem, consider edge cases, and choose a pattern.

Use the [CodeJeet dashboard](/dashboard) to find problems by topic and company. Strategic practice always beats aimless grinding.
