---
title: "The Sliding Window Pattern Explained"
description: "Master fixed and variable-size sliding window problems. Learn the template, common variations, and when to use this pattern."
date: "2026-06-30"
category: "tips"
tags: ["sliding window", "arrays", "strings", "patterns", "interview prep"]
---

The sliding window pattern maintains a contiguous range (subarray or substring) that expands and contracts as you scan through the input. Once you internalize the template, you can solve most sliding window problems quickly.

## When to Use Sliding Window

Look for these signals: "find the longest/shortest subarray or substring satisfying some condition," "find a subarray with a given sum," "maximum/minimum of all subarrays of size K." If the problem involves a contiguous sequence and a clear validity condition, sliding window likely applies.

## Fixed-Size Windows

The window size is given. Slide it across the input one element at a time.

**Template:** Initialize the window with the first K elements. For each new position, add the entering element, remove the leaving element, update your answer.

**Maximum Average Subarray I:** Compute the sum of the first K elements, then slide, tracking the maximum sum. Sliding Window Maximum extends this with a monotonic deque for O(1) max tracking per step.

Let's implement the classic fixed-size window problem: finding the maximum average subarray of a given size `k`. The core logic is to maintain a running sum as the window slides.

<div class="code-group">

```python
def find_max_average(nums, k):
    """
    Finds the maximum average value of any contiguous subarray of length k.
    """
    # Calculate sum of first window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide the window from index k to the end
    for i in range(k, len(nums)):
        # Add the new element entering the window
        window_sum += nums[i]
        # Remove the element leaving the window
        window_sum -= nums[i - k]
        # Update the maximum sum found
        max_sum = max(max_sum, window_sum)

    # Return the maximum average
    return max_sum / k

# Example usage
nums = [1, 12, -5, -6, 50, 3]
k = 4
print(f"Maximum average of subarray of size {k}: {find_max_average(nums, k)}")
```

```javascript
function findMaxAverage(nums, k) {
  /**
   * Finds the maximum average value of any contiguous subarray of length k.
   */
  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;

  // Slide the window from index k to the end
  for (let i = k; i < nums.length; i++) {
    // Add the new element entering the window
    windowSum += nums[i];
    // Remove the element leaving the window
    windowSum -= nums[i - k];
    // Update the maximum sum found
    maxSum = Math.max(maxSum, windowSum);
  }

  // Return the maximum average
  return maxSum / k;
}

// Example usage
const nums = [1, 12, -5, -6, 50, 3];
const k = 4;
console.log(`Maximum average of subarray of size ${k}: ${findMaxAverage(nums, k)}`);
```

```java
public class FixedWindow {
    public static double findMaxAverage(int[] nums, int k) {
        /**
         * Finds the maximum average value of any contiguous subarray of length k.
         */
        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }
        int maxSum = windowSum;

        // Slide the window from index k to the end
        for (int i = k; i < nums.length; i++) {
            // Add the new element entering the window
            windowSum += nums[i];
            // Remove the element leaving the window
            windowSum -= nums[i - k];
            // Update the maximum sum found
            maxSum = Math.max(maxSum, windowSum);
        }

        // Return the maximum average
        return (double) maxSum / k;
    }

    public static void main(String[] args) {
        int[] nums = {1, 12, -5, -6, 50, 3};
        int k = 4;
        System.out.printf("Maximum average of subarray of size %d: %.2f%n", k, findMaxAverage(nums, k));
    }
}
```

</div>

## Variable-Size Windows

The more common and challenging variant. Expand the window until it violates a condition, then shrink until validity is restored.

**Template:**

1. Initialize `left` and `right` at 0.
2. Expand by moving `right` forward, updating window state.
3. When invalid, shrink by moving `left` forward, updating state.
4. Update the answer at each step (when valid for "longest," or when about to shrink for "shortest").

### Longest Substring Without Repeating Characters

Maintain a set of characters in the window. Expand `right`. If the new character duplicates, shrink from `left` until it is removed. Update max length when valid. O(n) because each character enters and leaves the set at most once.

Here's the implementation for this classic problem:

<div class="code-group">

```python
def length_of_longest_substring(s):
    """
    Returns the length of the longest substring without repeating characters.
    """
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If the character at 'right' is already in the set, shrink the window
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        # Add the current character to the set
        char_set.add(s[right])
        # Update the maximum length (window is valid here)
        max_length = max(max_length, right - left + 1)

    return max_length

# Example usage
test_string = "abcabcbb"
print(f"Longest substring without repeating characters in '{test_string}': {length_of_longest_substring(test_string)}")
```

```javascript
function lengthOfLongestSubstring(s) {
  /**
   * Returns the length of the longest substring without repeating characters.
   */
  const charSet = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // If the character at 'right' is already in the set, shrink the window
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    // Add the current character to the set
    charSet.add(s[right]);
    // Update the maximum length (window is valid here)
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Example usage
const testString = "abcabcbb";
console.log(
  `Longest substring without repeating characters in '${testString}': ${lengthOfLongestSubstring(testString)}`
);
```

```java
import java.util.HashSet;
import java.util.Set;

public class LongestSubstring {
    public static int lengthOfLongestSubstring(String s) {
        /**
         * Returns the length of the longest substring without repeating characters.
         */
        Set<Character> charSet = new HashSet<>();
        int left = 0;
        int maxLength = 0;

        for (int right = 0; right < s.length(); right++) {
            // If the character at 'right' is already in the set, shrink the window
            while (charSet.contains(s.charAt(right))) {
                charSet.remove(s.charAt(left));
                left++;
            }
            // Add the current character to the set
            charSet.add(s.charAt(right));
            // Update the maximum length (window is valid here)
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }

    public static void main(String[] args) {
        String testString = "abcabcbb";
        System.out.printf("Longest substring without repeating characters in '%s': %d%n",
                         testString, lengthOfLongestSubstring(testString));
    }
}
```

</div>

### Minimum Window Substring

Given strings S and T, find the smallest substring of S containing all characters of T. Expand until all characters are present, then shrink to minimize length while valid. Use a frequency map for T and a counter tracking satisfied characters.

This is a more complex variable-size window problem. The key is to track character frequencies and maintain a count of how many characters from T have been satisfied.

<div class="code-group">

```python
def min_window(s, t):
    """
    Returns the minimum window substring of s that contains all characters of t.
    """
    if not s or not t or len(s) < len(t):
        return ""

    # Frequency map for characters in t
    t_freq = {}
    for char in t:
        t_freq[char] = t_freq.get(char, 0) + 1

    # Variables for sliding window
    left = 0
    min_len = float('inf')
    min_start = 0
    required_chars = len(t_freq)  # Number of unique characters we need to match
    formed_chars = 0  # Number of unique characters currently satisfied

    # Frequency map for current window
    window_freq = {}

    for right in range(len(s)):
        char = s[right]
        window_freq[char] = window_freq.get(char, 0) + 1

        # Check if this character's frequency matches the requirement
        if char in t_freq and window_freq[char] == t_freq[char]:
            formed_chars += 1

        # Try to shrink the window while the condition is satisfied
        while left <= right and formed_chars == required_chars:
            # Update minimum window
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_start = left

            # Remove left character from window
            left_char = s[left]
            window_freq[left_char] -= 1
            if left_char in t_freq and window_freq[left_char] < t_freq[left_char]:
                formed_chars -= 1
            left += 1

    return "" if min_len == float('inf') else s[min_start:min_start + min_len]

# Example usage
s = "ADOBECODEBANC"
t = "ABC"
print(f"Minimum window substring of '{s}' containing '{t}': '{min_window(s, t)}'")
```

```javascript
function minWindow(s, t) {
  /**
   * Returns the minimum window substring of s that contains all characters of t.
   */
  if (!s || !t || s.length < t.length) {
    return "";
  }

  // Frequency map for characters in t
  const tFreq = {};
  for (const char of t) {
    tFreq[char] = (tFreq[char] || 0) + 1;
  }

  // Variables for sliding window
  let left = 0;
  let minLen = Infinity;
  let minStart = 0;
  const requiredChars = Object.keys(tFreq).length; // Number of unique characters we need to match
  let formedChars = 0; // Number of unique characters currently satisfied

  // Frequency map for current window
  const windowFreq = {};

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowFreq[char] = (windowFreq[char] || 0) + 1;

    // Check if this character's frequency matches the requirement
    if (tFreq[char] && windowFreq[char] === tFreq[char]) {
      formedChars++;
    }

    // Try to shrink the window while the condition is satisfied
    while (left <= right && formedChars === requiredChars) {
      // Update minimum window
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }

      // Remove left character from window
      const leftChar = s[left];
      windowFreq[leftChar]--;
      if (tFreq[leftChar] && windowFreq[leftChar] < tFreq[leftChar]) {
        formedChars--;
      }
      left++;
    }
  }

  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}

// Example usage
const s = "ADOBECODEBANC";
const t = "ABC";
console.log(`Minimum window substring of '${s}' containing '${t}': '${minWindow(s, t)}'`);
```

```java
import java.util.HashMap;
import java.util.Map;

public class MinimumWindowSubstring {
    public static String minWindow(String s, String t) {
        /**
         * Returns the minimum window substring of s that contains all characters of t.
         */
        if (s == null || t == null || s.length() < t.length()) {
            return "";
        }

        // Frequency map for characters in t
        Map<Character, Integer> tFreq = new HashMap<>();
        for (char c : t.toCharArray()) {
            tFreq.put(c, tFreq.getOrDefault(c, 0) + 1);
        }

        // Variables for sliding window
        int left = 0;
        int minLen = Integer.MAX_VALUE;
        int minStart = 0;
        int requiredChars = tFreq.size(); // Number of unique characters we need to match
        int formedChars = 0; // Number of unique characters currently satisfied

        // Frequency map for current window
        Map<Character, Integer> windowFreq = new HashMap<>();

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            windowFreq.put(c, windowFreq.getOrDefault(c, 0) + 1);

            // Check if this character's frequency matches the requirement
            if (tFreq.containsKey(c) && windowFreq.get(c).intValue() == tFreq.get(c).intValue()) {
                formedChars++;
            }

            // Try to shrink the window while the condition is satisfied
            while (left <= right && formedChars == requiredChars) {
                // Update minimum window
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }

                // Remove left character from window
                char leftChar = s.charAt(left);
                windowFreq.put(leftChar, windowFreq.get(leftChar) - 1);
                if (tFreq.containsKey(leftChar) && windowFreq.get(leftChar) < tFreq.get(leftChar)) {
                    formedChars--;
                }
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }

    public static void main(String[] args) {
        String s = "ADOBECODEBANC";
        String t = "ABC";
        System.out.printf("Minimum window substring of '%s' containing '%s': '%s'%n",
                         s, t, minWindow(s, t));
    }
}
```

</div>

### Longest Substring with At Most K Distinct Characters

Track character frequencies. When distinct characters exceed K, shrink from left. Update max length at each step. This pattern extends to Fruits Into Baskets (K = 2).

This problem demonstrates how to maintain a window with a constraint on the number of distinct elements:

<div class="code-group">

```python
def length_of_longest_substring_k_distinct(s, k):
    """
    Returns the length of the longest substring with at most k distinct characters.
    """
    if k == 0 or not s:
        return 0

    char_freq = {}
    left = 0
    max_length = 0

    for right in range(len(s)):
        # Add current character to frequency map
        char_freq[s[right]] = char_freq.get(s[right], 0) + 1

        # Shrink window if we have more than k distinct characters
        while len(char_freq) > k:
            left_char = s[left]
            char_freq[left_char] -= 1
            if char_freq[left_char] == 0:
                del char_freq[left_char]
            left += 1

        # Update maximum length (window is valid here)
        max_length = max(max_length, right - left + 1)

    return max_length

# Example usage
test_string = "eceba"
k = 2
print(f"Longest substring with at most {k} distinct characters in '{test_string}': {length_of_longest_substring_k_distinct(test_string, k)}")
```

```javascript
function lengthOfLongestSubstringKDistinct(s, k) {
  /**
   * Returns the length of the longest substring with at most k distinct characters.
   */
  if (k === 0 || !s) {
    return 0;
  }

  const charFreq = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // Add current character to frequency map
    const char = s[right];
    charFreq.set(char, (charFreq.get(char) || 0) + 1);

    // Shrink window if we have more than k distinct characters
    while (charFreq.size > k) {
      const leftChar = s[left];
      charFreq.set(leftChar, charFreq.get(leftChar) - 1);
      if (charFreq.get(leftChar) === 0) {
        charFreq.delete(leftChar);
      }
      left++;
    }

    // Update maximum length (window is valid here)
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Example usage
const testString = "eceba";
const k = 2;
console.log(
  `Longest substring with at most ${k} distinct characters in '${testString}': ${lengthOfLongestSubstringKDistinct(testString, k)}`
);
```

```java
import java.util.HashMap;
import java.util.Map;

public class KDistinctCharacters {
    public static int lengthOfLongestSubstringKDistinct(String s, int k) {
        /**
         * Returns the length of the longest substring with at most k distinct characters.
         */
        if (k == 0 || s == null || s.isEmpty()) {
            return 0;
        }

        Map<Character, Integer> charFreq = new HashMap<>();
        int left = 0;
        int maxLength = 0;

        for (int right = 0; right < s.length(); right++) {
            // Add current character to frequency map
            char c = s.charAt(right);
            charFreq.put(c, charFreq.getOrDefault(c, 0) + 1);

            // Shrink window if we have more than k distinct characters
            while (charFreq.size() > k) {
                char leftChar = s.charAt(left);
                charFreq.put(leftChar, charFreq.get(leftChar) - 1);
                if (charFreq.get(leftChar) == 0) {
                    charFreq.remove(leftChar);
                }
                left++;
            }

            // Update maximum length (window is valid here)
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }

    public static void main(String[] args) {
        String testString = "eceba";
        int k = 2;
        System.out.printf("Longest substring with at most %d distinct characters in '%s': %d%n",
                         k, testString, lengthOfLongestSubstringKDistinct(testString, k));
    }
}
```

</div>

### Minimum Size Subarray Sum

Find the smallest subarray with sum >= target. Expand until the sum meets the target, shrink to minimize length. Template for all "shortest valid subarray" problems.

This problem demonstrates the pattern for finding the shortest subarray that satisfies a condition:

<div class="code-group">

```python
def min_subarray_len(target, nums):
    """
    Returns the minimal length of a contiguous subarray whose sum is at least target.
    """
    left = 0
    current_sum = 0
    min_length = float('inf')

    for right in range(len(nums)):
        # Expand the window by adding the current element
        current_sum += nums[right]

        # Shrink the window while the sum is at least target
        while current_sum >= target:
            # Update minimum length
            min_length = min(min_length, right - left + 1)
            # Remove left element and move left pointer
            current_sum -= nums[left]
            left += 1

    return 0 if min_length == float('inf') else min_length

# Example usage
nums = [2, 3, 1, 2, 4, 3]
target = 7
print(f"Minimal length of subarray with sum >= {target}: {min_subarray_len(target, nums)}")
```

```javascript
function minSubArrayLen(target, nums) {
  /**
   * Returns the minimal length of a contiguous subarray whose sum is at least target.
   */
  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    // Expand the window by adding the current element
    currentSum += nums[right];

    // Shrink the window while the sum is at least target
    while (currentSum >= target) {
      // Update minimum length
      minLength = Math.min(minLength, right - left + 1);
      // Remove left element and move left pointer
      currentSum -= nums[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}

// Example usage
const nums = [2, 3, 1, 2, 4, 3];
const target = 7;
console.log(`Minimal length of subarray with sum >= ${target}: ${minSubArrayLen(target, nums)}`);
```

```java
public class MinimumSizeSubarraySum {
    public static int minSubArrayLen(int target, int[] nums) {
        /**
         * Returns the minimal length of a contiguous subarray whose sum is at least target.
         */
        int left = 0;
        int currentSum = 0;
        int minLength = Integer.MAX_VALUE;

        for (int right = 0; right < nums.length; right++) {
            // Expand the window by adding the current element
            currentSum += nums[right];

            // Shrink the window while the sum is at least target
            while (currentSum >= target) {
                // Update minimum length
                minLength = Math.min(minLength, right - left + 1);
                // Remove left element and move left pointer
                currentSum -= nums[left];
                left++;
            }
        }

        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }

    public static void main(String[] args) {
        int[] nums = {2, 3, 1, 2, 4, 3};
        int target = 7;
        System.out.printf("Minimal length of subarray with sum >= %d: %d%n",
                         target, minSubArrayLen(target, nums));
    }
}
```

</div>

## The Shrinking Condition

The hardest part is defining when the window is invalid. "No repeating characters" means invalid when a duplicate exists. "At most K distinct" means invalid when count exceeds K. Getting this wrong is the most common source of bugs. Trace through a small example before coding.

Let's examine the shrinking condition more closely with a practical example. Consider the problem "Find the longest substring with at most two distinct characters" for the input "eceba":

1. **Window State Tracking**: We need to track character frequencies in the current window.
2. **Invalid Condition**: The window becomes invalid when we have MORE than 2 distinct characters.
3. **Shrinking Logic**: When invalid, we must remove characters from the left until validity is restored.

Here's a step-by-step trace:

- Start: left=0, right=0, window="e", distinct=1
- Expand: left=0, right=1, window="ec", distinct=2
- Expand: left=0, right=2, window="ece", distinct=2
- Expand: left=0, right=3, window="eceb", distinct=3 (INVALID!)
- Shrink: left=1, right=3, window="ceb", distinct=3 (still invalid)
- Shrink: left=2, right=3, window="eb", distinct=2 (valid again)

The key insight is that the shrinking condition must be precise. If you shrink too much, you might miss valid windows. If you don't shrink enough, the window remains invalid.

## Sliding Window vs Two Pointers

Classic two pointers search for specific elements, often on sorted data. Sliding window maintains a contiguous range with aggregate properties (sum, frequency, distinct count). If the problem says "contiguous subarray/substring" with an aggregate condition, use sliding window. For more on two pointers, see the [two pointer guide](/blog/two-pointer-technique-complete-guide).

To illustrate the difference, let's compare two similar problems:

**Two Pointers Example**: "Two Sum II - Input Array Is Sorted" - Find two numbers that add up to a target in a sorted array. The pointers move based on the sum comparison, but they don't maintain a contiguous window.

**Sliding Window Example**: "Minimum Size Subarray Sum" - Find the smallest contiguous subarray with sum >= target. The window expands and contracts while maintaining the sum of elements between the pointers.

Here's a quick comparison table:

| Aspect               | Two Pointers                              | Sliding Window                                 |
| -------------------- | ----------------------------------------- | ---------------------------------------------- |
| **Data Structure**   | Often sorted arrays/lists                 | Any sequence (arrays, strings)                 |
| **Pointer Movement** | Move based on comparison (sum, value)     | Expand right, contract left based on condition |
| **Window Property**  | Not necessarily contiguous                | Always maintains contiguous range              |
| **Typical Use**      | Finding pairs/triplets, palindrome checks | Subarray/substring problems with conditions    |
| **Complexity**       | Usually O(n)                              | Usually O(n)                                   |

## Practice Problems

**Fixed size:**

1. Maximum Average Subarray I
2. Sliding Window Maximum (monotonic deque)

**Variable size -- longest:** 3. Longest Substring Without Repeating Characters 4. Longest Repeating Character Replacement 5. Longest Substring with At Most K Distinct Characters

**Variable size -- shortest:** 6. Minimum Window Substring 7. Minimum Size Subarray Sum

**Advanced:** 8. Subarrays with K Different Integers 9. Permutation in String

Let's implement one more advanced problem to solidify the pattern: **Permutation in String**. This checks if one string contains a permutation of another as a substring.

<div class="code-group">

```python
def check_inclusion(s1, s2):
    """
    Returns True if s2 contains a permutation of s1.
    """
    if len(s1) > len(s2):
        return False

    # Frequency maps
    s1_freq = [0] * 26
    window_freq = [0] * 26

    # Initialize frequency maps for first window
    for i in range(len(s1)):
        s1_freq[ord(s1[i]) - ord('a')] += 1
        window_freq[ord(s2[i]) - ord('a')] += 1

    # Check first window
    if s1_freq == window_freq:
        return True

    # Slide the window
    for i in range(len(s1), len(s2)):
        # Add new character
        window_freq[ord(s2[i]) - ord('a')] += 1
        # Remove old character
        window_freq[ord(s2[i - len(s1)]) - ord('a')] -= 1

        # Check if current window matches s1
        if s1_freq == window_freq:
            return True

    return False

# Example usage
s1 = "ab"
s2 = "eidbaooo"
print(f"Does '{s2}' contain a permutation of '{s1}'? {check_inclusion(s1, s2)}")
```

```javascript
function checkInclusion(s1, s2) {
  /**
   * Returns true if s2 contains a permutation of s1.
   */
  if (s1.length > s2.length) {
    return false;
  }

  // Frequency arrays
  const s1Freq = new Array(26).fill(0);
  const windowFreq = new Array(26).fill(0);

  // Initialize frequency arrays for first window
  for (let i = 0; i < s1.length; i++) {
    s1Freq[s1.charCodeAt(i) - "a".charCodeAt(0)]++;
    windowFreq[s2.charCodeAt(i) - "a".charCodeAt(0)]++;
  }

  // Check first window
  if (arraysEqual(s1Freq, windowFreq)) {
    return true;
  }

  // Slide the window
  for (let i = s1.length; i < s2.length; i++) {
    // Add new character
    windowFreq[s2.charCodeAt(i) - "a".charCodeAt(0)]++;
    // Remove old character
    windowFreq[s2.charCodeAt(i - s1.length) - "a".charCodeAt(0)]--;

    // Check if current window matches s1
    if (arraysEqual(s1Freq, windowFreq)) {
      return true;
    }
  }

  return false;
}

// Helper function to compare arrays
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// Example usage
const s1 = "ab";
const s2 = "eidbaooo";
console.log(`Does '${s2}' contain a permutation of '${s1}'? ${checkInclusion(s1, s2)}`);
```

```java
public class PermutationInString {
    public static boolean checkInclusion(String s1, String s2) {
        /**
         * Returns true if s2 contains a permutation of s1.
         */
        if (s1.length() > s2.length()) {
            return false;
        }

        // Frequency arrays
        int[] s1Freq = new int[26];
        int[] windowFreq = new int[26];

        // Initialize frequency arrays for first window
        for (int i = 0; i < s1.length(); i++) {
            s1Freq[s1.charAt(i) - 'a']++;
            windowFreq[s2.charAt(i) - 'a']++;
        }

        // Check first window
        if (arraysEqual(s1Freq, windowFreq)) {
            return true;
        }

        // Slide the window
        for (int i = s1.length(); i < s2.length(); i++) {
            // Add new character
            windowFreq[s2.charAt(i) - 'a']++;
            // Remove old character
            windowFreq[s2.charAt(i - s1.length()) - 'a']--;

            // Check if current window matches s1
            if (arraysEqual(s1Freq, windowFreq)) {
                return true;
            }
        }

        return false;
    }

    // Helper method to compare arrays
    private static boolean arraysEqual(int[] arr1, int[] arr2) {
        if (arr1.length != arr2.length) return false;
        for (int i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        String s1 = "ab";
        String s2 = "eidbaooo";
        System.out.printf("Does '%s' contain a permutation of '%s'? %b%n",
                         s2, s1, checkInclusion(s1, s2));
    }
}
```

</div>

Check the [CodeJeet dashboard](/dashboard) for problems by company. This pattern is heavily tested at [Amazon](/company/amazon), [Microsoft](/company/microsoft), and [Meta](/company/meta).

## Common Pitfalls and Optimization Tips

1. **Off-by-one errors**: Pay close attention to whether your window includes or excludes the endpoints. Using 0-based or 1-based indexing consistently is crucial.

2. **State maintenance**: For complex conditions, consider what data structure best maintains your window state:
   - Use sets for membership checks (no duplicates)
   - Use hash maps for frequency tracking
   - Use arrays for fixed character sets (like lowercase English letters)

3. **Time complexity**: While sliding window is O(n), the shrinking operation inside the while loop might seem like O(n²). However, each element enters the window once and leaves at most once, so the total operations are O(2n) = O(n).

4. **Space complexity**: This depends on your state tracking. For character frequency problems, it's O(k) where k is the size of the character set.

5. **Edge cases**: Always test with:
   - Empty strings/arrays
   - Single element
   - All elements identical
   - Target larger than sum of all elements
   - Window size equal to array size

Mastering the sliding window pattern requires practice, but once you internalize the template and understand the shrinking condition, you'll be able to solve a wide variety of problems efficiently. Start with the basic problems listed above and gradually work your way to the advanced ones.
