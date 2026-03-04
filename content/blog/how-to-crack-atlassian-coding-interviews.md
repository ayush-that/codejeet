---
title: "How to Crack Atlassian Coding Interviews in 2026"
description: "Complete guide to Atlassian coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-02-12"
category: "company-guide"
company: "atlassian"
tags: ["atlassian", "interview prep", "leetcode"]
---

Landing a software engineering role at Atlassian means proving you can solve the kind of complex, product-adjacent problems the company tackles daily. Their coding interview process is rigorous, typically involving multiple rounds focused on algorithmic problem-solving, system design, and behavioral questions. Success hinges on targeted preparation that aligns with their specific technical focus.

## By the Numbers

Understanding the statistical landscape of Atlassian's coding questions is your first strategic advantage. Based on reported data, the difficulty breakdown is 11% Easy, 69% Medium, and 19% Hard. This distribution is telling.

The overwhelming majority of questions are Medium difficulty. This means Atlassian is primarily testing for strong, reliable fundamentals and the ability to navigate common algorithmic patterns under pressure. You are expected to cleanly solve these problems. The significant Hard component (nearly 1 in 5 questions) serves as a differentiator. These questions are designed to separate very good candidates from exceptional ones, often testing advanced optimization or less common paradigms. The low number of Easy questions indicates they assume a baseline competency; you won't spend interview time on trivial problems.

## Top Topics to Focus On

Your study time should be heavily weighted toward the most frequently tested areas. For Atlassian, these are:

- **Array:** Master in-place operations, sliding window techniques, and two-pointer approaches. Many problems involve manipulating or analyzing data sequences.
- **Hash Table:** This is your go-to tool for achieving O(1) lookups. Be prepared to use maps for frequency counting, memoization, or as a supporting data structure to optimize array/string traversals.
- **String:** Focus on manipulation, pattern matching, and anagrams. Interleaving, transformation, and palindrome problems are common. Strong string skills often combine with array and hash table techniques.
- **Sorting:** Don't just know how to call a sort function. Understand when sorting can be a pre-processing step to simplify a problem (e.g., two-sum variants, meeting intervals). Be ready to implement custom comparators.
- **Dynamic Programming:** A critical area for Hard problems. Start with classic patterns (knapsack, LCS, LIS) and practice identifying overlapping subproblems and optimal substructure in word break, pathfinding, or partition scenarios.

### Deep Dive: Code Examples for Core Topics

Let's explore practical implementations for the key patterns mentioned above.

**1. Array - Two-Pointer Technique**
A classic pattern for in-place operations or finding pairs in a sorted array. The following example finds two numbers in a sorted array that add up to a target.

<div class="code-group">

```python
def two_sum_sorted(numbers, target):
    """
    Uses two pointers to find two indices (1-indexed) where their values sum to target.
    Assumes the input array is sorted in non-decreasing order.
    """
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            # Problem often expects 1-indexed indices
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1  # Need a larger sum, move left pointer right
        else:
            right -= 1  # Need a smaller sum, move right pointer left
    return [-1, -1]  # No solution found

# Example usage
nums = [2, 7, 11, 15]
target = 9
print(two_sum_sorted(nums, target))  # Output: [1, 2]
```

```javascript
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    if (currentSum === target) {
      // Return 1-indexed indices
      return [left + 1, right + 1];
    } else if (currentSum < target) {
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }
  return [-1, -1]; // No solution
}

// Example usage
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSumSorted(nums, target)); // Output: [1, 2]
```

```java
import java.util.Arrays;

public class TwoPointerExample {
    public static int[] twoSumSorted(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;
        while (left < right) {
            int currentSum = numbers[left] + numbers[right];
            if (currentSum == target) {
                // Return 1-indexed indices
                return new int[]{left + 1, right + 1};
            } else if (currentSum < target) {
                left++; // Need a larger sum
            } else {
                right--; // Need a smaller sum
            }
        }
        return new int[]{-1, -1}; // No solution
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(twoSumSorted(nums, target))); // Output: [1, 2]
    }
}
```

</div>

**2. Hash Table - Frequency Counting**
Hash tables (dictionaries, maps) are indispensable for problems involving counts or lookups. Here's an example finding the first non-repeating character in a string.

<div class="code-group">

```python
def first_unique_char(s: str) -> int:
    """
    Returns the index of the first non-repeating character in a string.
    Returns -1 if no such character exists.
    """
    char_count = {}
    # First pass: count frequencies
    for ch in s:
        char_count[ch] = char_count.get(ch, 0) + 1
    # Second pass: find the first character with count 1
    for i, ch in enumerate(s):
        if char_count[ch] == 1:
            return i
    return -1

# Example usage
print(first_unique_char("leetcode"))      # Output: 0 ('l')
print(first_unique_char("loveleetcode"))  # Output: 2 ('v')
```

```javascript
function firstUniqueChar(s) {
  const charCount = new Map();
  // First pass: count frequencies
  for (const ch of s) {
    charCount.set(ch, (charCount.get(ch) || 0) + 1);
  }
  // Second pass: find the first character with count 1
  for (let i = 0; i < s.length; i++) {
    if (charCount.get(s[i]) === 1) {
      return i;
    }
  }
  return -1;
}

// Example usage
console.log(firstUniqueChar("leetcode")); // Output: 0
console.log(firstUniqueChar("loveleetcode")); // Output: 2
```

```java
import java.util.HashMap;

public class HashTableExample {
    public static int firstUniqueChar(String s) {
        HashMap<Character, Integer> charCount = new HashMap<>();
        // First pass: count frequencies
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            charCount.put(ch, charCount.getOrDefault(ch, 0) + 1);
        }
        // Second pass: find the first character with count 1
        for (int i = 0; i < s.length(); i++) {
            if (charCount.get(s.charAt(i)) == 1) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(firstUniqueChar("leetcode"));      // Output: 0
        System.out.println(firstUniqueChar("loveleetcode"));  // Output: 2
    }
}
```

</div>

**3. Dynamic Programming - Classic Fibonacci with Memoization**
DP problems require breaking down a problem into overlapping subproblems. Let's implement Fibonacci, the classic introduction to DP concepts, using memoization (top-down) and tabulation (bottom-up).

<div class="code-group">

```python
def fib_memoization(n, memo={}):
    """
    Top-down DP approach using memoization.
    """
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib_memoization(n-1, memo) + fib_memoization(n-2, memo)
    return memo[n]

def fib_tabulation(n):
    """
    Bottom-up DP approach using tabulation.
    """
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Example usage
print(fib_memoization(10))  # Output: 55
print(fib_tabulation(10))   # Output: 55
```

```javascript
function fibMemoization(n, memo = {}) {
  // Top-down DP approach using memoization
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fibMemoization(n - 1, memo) + fibMemoization(n - 2, memo);
  return memo[n];
}

function fibTabulation(n) {
  // Bottom-up DP approach using tabulation
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Example usage
console.log(fibMemoization(10)); // Output: 55
console.log(fibTabulation(10)); // Output: 55
```

```java
import java.util.HashMap;

public class DynamicProgrammingExample {
    // Top-down DP with memoization
    public static int fibMemoization(int n, HashMap<Integer, Integer> memo) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        int result = fibMemoization(n - 1, memo) + fibMemoization(n - 2, memo);
        memo.put(n, result);
        return result;
    }

    // Bottom-up DP with tabulation
    public static int fibTabulation(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(fibMemoization(10, new HashMap<>())); // Output: 55
        System.out.println(fibTabulation(10));                    // Output: 55
    }
}
```

</div>

## Preparation Strategy

A focused 6-week plan is effective. Prioritize quality of practice over quantity.

**Weeks 1-2: Foundation & Core Topics.** Build depth in the top five topics. Dedicate days to Array/Hash Table combos, then String manipulation, then Sorting applications. Solve 2-3 Medium problems daily, ensuring you can explain your approach and walk through test cases. Re-solve problems the next day from scratch to build muscle memory.

**Weeks 3-4: Pattern Recognition & Difficulty Ramp.** Shift to mixed-topic practice. Use the "Atlassian" tagged problems on platforms. Your goal is to correctly identify which pattern (e.g., sliding window, DFS/BFS, DP) applies to a new problem statement. Introduce 1-2 Hard problems per week, focusing on understanding the solution approach even if you can't code it fully initially.

**Weeks 5-6: Mock Interviews & Gaps.** Simulate the real environment with timed mock interviews (45-60 minutes). Always verbalize your thought process. Analyze your weaknesses—did you miss a DP state definition? Fail to optimize with a hash map? Dedicate the final week to drilling these specific gaps. Revisit all previously solved problems to ensure retention.

### Implementing a Mock Interview Problem

Let's simulate solving a common Atlassian-style problem: **"Maximum Subarray" (Kadane's Algorithm)**. This is a classic array problem that tests your ability to optimize a brute-force solution.

**Problem:** Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

**Brute-force Approach:** Check every possible subarray. This is O(n²) and not acceptable for large inputs.
**Optimal Approach (Kadane's Algorithm):** Traverse the array once, maintaining the maximum sum ending at the current position and the overall maximum sum.

<div class="code-group">

```python
def max_subarray_bruteforce(nums):
    """Brute-force O(n^2) solution for understanding."""
    max_sum = float('-inf')
    n = len(nums)
    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += nums[j]
            max_sum = max(max_sum, current_sum)
    return max_sum

def max_subarray_kadane(nums):
    """Optimal O(n) solution using Kadane's Algorithm."""
    current_max = nums[0]
    global_max = nums[0]
    for num in nums[1:]:
        # Should we start a new subarray at `num` or extend the previous one?
        current_max = max(num, current_max + num)
        # Update the global maximum if needed
        global_max = max(global_max, current_max)
    return global_max

# Example usage
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print("Brute-force result:", max_subarray_bruteforce(nums))  # Output: 6
print("Kadane's result:", max_subarray_kadane(nums))         # Output: 6 (subarray [4,-1,2,1])
```

```javascript
function maxSubarrayBruteforce(nums) {
  // Brute-force O(n^2) solution
  let maxSum = -Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    for (let j = i; j < n; j++) {
      currentSum += nums[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }
  return maxSum;
}

function maxSubarrayKadane(nums) {
  // Optimal O(n) solution using Kadane's Algorithm
  let currentMax = nums[0];
  let globalMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    // Decide: start new subarray at nums[i] or extend previous?
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    // Update global maximum
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}

// Example usage
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("Brute-force result:", maxSubarrayBruteforce(nums)); // Output: 6
console.log("Kadane's result:", maxSubarrayKadane(nums)); // Output: 6
```

```java
public class MockInterviewProblem {
    // Brute-force O(n^2) solution
    public static int maxSubarrayBruteforce(int[] nums) {
        int maxSum = Integer.MIN_VALUE;
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                maxSum = Math.max(maxSum, currentSum);
            }
        }
        return maxSum;
    }

    // Optimal O(n) solution using Kadane's Algorithm
    public static int maxSubarrayKadane(int[] nums) {
        int currentMax = nums[0];
        int globalMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            // Choose: start new subarray at nums[i] or extend previous?
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            // Update global maximum
            globalMax = Math.max(globalMax, currentMax);
        }
        return globalMax;
    }

    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println("Brute-force result: " + maxSubarrayBruteforce(nums)); // Output: 6
        System.out.println("Kadane's result: " + maxSubarrayKadane(nums));        // Output: 6
    }
}
```

</div>

**Interview Thought Process:**

1.  **Clarify:** "So I need to find the sum of the contiguous subarray with the largest sum. The array can contain negative numbers. I should return just the sum, not the subarray indices, correct?"
2.  **Brute-force:** "A naive approach would be to check every possible start and end index for subarrays. That's O(n²) time. For large inputs, that's inefficient."
3.  **Optimize:** "I recall a pattern called Kadane's Algorithm for this problem. We can traverse the array once. At each element, we decide: does this element start a new subarray, or is it better to add it to the subarray ending at the previous element? We keep track of the maximum sum found so far."
4.  **Walkthrough:** "Let's test with the example `[-2,1,-3,4,-1,2,1,-5,4]`. Starting at -2, current and global max are -2. Next element 1: `current_max = max(1, -2+1= -1) = 1`. Global max becomes 1. Next -3: `current_max = max(-3, 1 + -3 = -2) = -2`. Global stays 1. Next 4: `current_max = max(4, -2+4=2) = 4`. Global becomes 4... and so on. The final global max is 6."
5.  **Edge Cases:** "What if the array has all negative numbers? The algorithm should still work, returning the least negative number (largest sum). An empty array? Let's assume input is non-empty as per the problem."

## Key Tips

1.  **Communicate Relentlessly.** Atlassian values collaboration. Narrate your thinking, discuss trade-offs between approaches, and ask clarifying questions before you code. Silence is your enemy.
2.  **Optimize for Medium, Then Attempt Hard.** Your primary goal is to flawlessly solve the Medium-difficulty questions you encounter. If presented with a Hard problem, demonstrate a clear, logical brute-force solution first, then methodically work towards optimization. A working sub-optimal solution is better than an incomplete optimal one.
3.  **Consider Real-World Context.** While solving an algorithmic problem, briefly mention how it might relate to a real-world system (e.g., "This rate-limiting algorithm could be applied to an API gateway"). It shows product-aware thinking. For the Maximum Subarray problem, you could mention: "This algorithm is foundational for analyzing trends in time-series data, like finding the most profitable period in stock prices."
4.  **Test Your Own Code.** Before declaring "done," walk through your code with a small but interesting edge case. Correctly handling null inputs, empty arrays, or single-element cases demonstrates thoroughness. For example, always test with a single element array `[5]`, an array with all negatives `[-3, -1, -2]`, and a mixed array.

### Final Practice Problem: Group Anagrams

This combines Strings, Hash Tables, and Sorting—a quintessential Atlassian topic.

<div class="code-group">

```python
def group_anagrams(strs):
    """
    Groups anagrams together from a list of strings.
    An Anagram is a word formed by rearranging the letters of another.
    """
    from collections import defaultdict
    anagram_map = defaultdict(list)
    for s in strs:
        # Use sorted string as the key
        key = ''.join(sorted(s))
        anagram_map[key].append(s)
    return list(anagram_map.values())

# Example usage
input_strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(group_anagrams(input_strs))
# Output: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

```javascript
function groupAnagrams(strs) {
  const anagramMap = new Map();
  for (const s of strs) {
    // Create a key by sorting the string's characters
    const key = s.split("").sort().join("");
    if (!anagramMap.has(key)) {
      anagramMap.set(key, []);
    }
    anagramMap.get(key).push(s);
  }
  return Array.from(anagramMap.values());
}

// Example usage
const inputStrs = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log(groupAnagrams(inputStrs));
// Output: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

```java
import java.util.*;

public class FinalExample {
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> anagramMap = new HashMap<>();
        for (String s : strs) {
            // Convert string to char array, sort it, and use as key
            char[] charArray = s.toCharArray();
            Arrays.sort(charArray);
            String key = new String(charArray);
            // Add the original string to the corresponding list
            anagramMap.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(anagramMap.values());
    }

    public static void main(String[] args) {
        String[] inputStrs = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(inputStrs));
        // Output: [[eat, tea, ate], [tan, nat], [bat]]
    }
}
```

</div>

Targeted, consistent practice on these core areas will build the proficiency and confidence needed to succeed. Start with the fundamentals, pressure-test your skills, and refine your communication.

[Browse all Atlassian questions on CodeJeet](/company/atlassian)
