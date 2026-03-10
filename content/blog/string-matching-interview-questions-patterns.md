---
title: "String Matching Interview Questions: Patterns and Strategies"
description: "Master String Matching problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-05-18"
category: "dsa-patterns"
tags: ["string-matching", "dsa", "interview prep"]
---

# String Matching Interview Questions: Patterns and Strategies

You’re in an interview, feeling good. You just aced the binary tree problem. Then the interviewer smiles and says, “Let’s try something different. Given a string `s` and a pattern `p`, implement wildcard matching where `'?'` matches any single character and `'*'` matches any sequence of characters.” Your mind goes blank. This isn’t just `str.find()` — it’s LeetCode #44 (Wildcard Matching), a hard problem that tests whether you understand the nuances of string matching beyond simple equality checks.

String matching questions appear in about 32% of technical interviews at top companies, with a surprising distribution: 31% easy, 25% medium, and a hefty 44% hard. Why such a high hard percentage? Because strings are deceptively simple data structures that hide complex algorithmic challenges. Interviewers love them because they test multiple skills simultaneously: pattern recognition, edge case handling, and optimization under constraints.

## Common Patterns

### 1. Two-Pointer Sliding Window

This is your bread and butter for substring problems. Instead of checking every possible substring (O(n²)), you maintain a window that slides through the string, adjusting its boundaries based on what you’re looking for.

**Intuition**: Imagine you’re looking for the longest substring without repeating characters. You keep a right pointer that expands the window and a left pointer that contracts it when you find a duplicate. The magic happens in the hash map that tracks character positions — when you see a duplicate, you don’t just move left by one; you jump it to the position after the previous occurrence.

<div class="code-group">

```python
# LeetCode #3: Longest Substring Without Repeating Characters
# Time: O(n) | Space: O(min(m, n)) where m is character set size
def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}  # Stores last seen index of each character
    left = max_length = 0

    for right, char in enumerate(s):
        # If char seen before and within current window
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1  # Jump left pointer

        char_index[char] = right  # Update last seen index
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// LeetCode #3: Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(min(m, n)) where m is character set size
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    // If char seen before and within current window
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1; // Jump left pointer
    }

    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
// LeetCode #3: Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(min(m, n)) where m is character set size
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        // If char seen before and within current window
        if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;  // Jump left pointer
        }

        charIndex.put(c, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

**Related problems**: Minimum Window Substring (#76), Longest Repeating Character Replacement (#424)

### 2. Rabin-Karp Rolling Hash

When you need to find multiple patterns or check for repeating substrings, hashing lets you compare strings in O(1) time after preprocessing.

**Intuition**: Instead of comparing strings character by character, convert them to a numerical hash. The rolling part is key — when you slide the window, you don’t recompute the entire hash. You subtract the contribution of the leaving character and add the new one, similar to how a moving average works.

<div class="code-group">

```python
# LeetCode #187: Repeated DNA Sequences
# Time: O(n) | Space: O(n) for the result
def findRepeatedDnaSequences(s: str):
    if len(s) < 10:
        return []

    seen = set()
    repeated = set()

    # Simple hash: map A->0, C->1, G->2, T->3
    mapping = {'A': 0, 'C': 1, 'G': 2, 'T': 3}

    # Initial hash for first 10 characters
    hash_val = 0
    for i in range(10):
        hash_val = (hash_val << 2) | mapping[s[i]]

    seen.add(hash_val)

    # Rolling hash: remove leftmost, add new rightmost
    for i in range(10, len(s)):
        # Remove leftmost 2 bits (20 bits total for 10 chars * 2 bits each)
        hash_val &= (1 << 20) - 1  # Keep only 20 bits
        # Shift left and add new character
        hash_val = (hash_val << 2) | mapping[s[i]]

        if hash_val in seen:
            repeated.add(s[i-9:i+1])
        else:
            seen.add(hash_val)

    return list(repeated)
```

```javascript
// LeetCode #187: Repeated DNA Sequences
// Time: O(n) | Space: O(n) for the result
function findRepeatedDnaSequences(s) {
  if (s.length < 10) return [];

  const seen = new Set();
  const repeated = new Set();

  // Simple hash using string slicing for clarity
  // In real interview, implement proper rolling hash
  for (let i = 0; i <= s.length - 10; i++) {
    const substr = s.substring(i, i + 10);
    if (seen.has(substr)) {
      repeated.add(substr);
    } else {
      seen.add(substr);
    }
  }

  return Array.from(repeated);
}
```

```java
// LeetCode #187: Repeated DNA Sequences
// Time: O(n) | Space: O(n) for the result
public List<String> findRepeatedDnaSequences(String s) {
    List<String> result = new ArrayList<>();
    if (s.length() < 10) return result;

    Set<String> seen = new HashSet<>();
    Set<String> repeated = new HashSet<>();

    for (int i = 0; i <= s.length() - 10; i++) {
        String substr = s.substring(i, i + 10);
        if (seen.contains(substr)) {
            repeated.add(substr);
        } else {
            seen.add(substr);
        }
    }

    return new ArrayList<>(repeated);
}
```

</div>

**Related problems**: Implement strStr() (#28), Longest Duplicate Substring (#1044)

### 3. KMP (Knuth-Morris-Pratt) Pattern Matching

The interview killer. When you need to find a pattern in O(n+m) time without backtracking in the text, KMP is your answer.

**Intuition**: The key insight is that when a mismatch occurs, you don’t need to restart from the beginning of the pattern. The prefix function (LPS array) tells you how much of the pattern you’ve already matched that’s also a prefix of the pattern itself. It’s like having memory of what you’ve already seen.

<div class="code-group">

```python
# LeetCode #28: Implement strStr() - KMP version
# Time: O(n+m) | Space: O(m) for LPS array
def strStr(haystack: str, needle: str) -> int:
    if not needle:
        return 0

    # Build LPS (Longest Prefix Suffix) array
    lps = [0] * len(needle)
    length = 0
    i = 1

    while i < len(needle):
        if needle[i] == needle[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1

    # KMP search
    i = j = 0
    while i < len(haystack):
        if haystack[i] == needle[j]:
            i += 1
            j += 1

            if j == len(needle):
                return i - j
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1

    return -1
```

```javascript
// LeetCode #28: Implement strStr() - KMP version
// Time: O(n+m) | Space: O(m) for LPS array
function strStr(haystack, needle) {
  if (needle.length === 0) return 0;

  // Build LPS array
  const lps = new Array(needle.length).fill(0);
  let length = 0;
  let i = 1;

  while (i < needle.length) {
    if (needle[i] === needle[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        length = lps[length - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  // KMP search
  i = 0;
  let j = 0;

  while (i < haystack.length) {
    if (haystack[i] === needle[j]) {
      i++;
      j++;

      if (j === needle.length) {
        return i - j;
      }
    } else {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return -1;
}
```

```java
// LeetCode #28: Implement strStr() - KMP version
// Time: O(n+m) | Space: O(m) for LPS array
public int strStr(String haystack, String needle) {
    if (needle.isEmpty()) return 0;

    // Build LPS array
    int[] lps = new int[needle.length()];
    int length = 0;
    int i = 1;

    while (i < needle.length()) {
        if (needle.charAt(i) == needle.charAt(length)) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    // KMP search
    i = 0;
    int j = 0;

    while (i < haystack.length()) {
        if (haystack.charAt(i) == needle.charAt(j)) {
            i++;
            j++;

            if (j == needle.length()) {
                return i - j;
            }
        } else {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return -1;
}
```

</div>

**Related problems**: Repeated Substring Pattern (#459), Shortest Palindrome (#214)

## When to Use String Matching vs Alternatives

The biggest mistake candidates make is reaching for string matching when a simpler approach exists. Here’s how to decide:

**Use string matching when:**

1. You need to find patterns within text (obviously)
2. The problem mentions "substring," "pattern," or "matching"
3. You need to process streaming data (rolling hash shines here)
4. Memory is limited (KMP uses O(m) space vs O(n) for some DP approaches)

**Consider alternatives when:**

1. **Regular expressions**: If the interviewer allows `re` module (Python) or similar, sometimes a well-crafted regex is the right answer for pattern validation problems
2. **Dynamic programming**: For edit distance (#72) or wildcard matching (#44), DP often provides clearer logic than complex string matching
3. **Trie**: When you have multiple patterns to search for simultaneously (word search, autocomplete)
4. **Simple iteration**: For easy problems like checking palindromes, sometimes `s == s[::-1]` is fine

**Decision criteria**: Ask yourself: "Am I looking for exact matches or approximate matches?" Exact matches favor KMP/rolling hash; approximate matches (with edits) need DP.

## Edge Cases and Gotchas

Interviewers love these traps. Miss one, and you’ve failed the question.

1. **Empty strings and null inputs**: Always check `if not s: return 0` or similar. In Java, watch for `s == null` vs `s.isEmpty()`.
2. **Case sensitivity**: Is "A" equal to "a"? Usually not in coding problems, but sometimes (like in email validation) it matters. Clarify.
3. **Unicode and special characters**: Your sliding window hash map might need more than 26 slots. Use a dictionary/map, not a fixed array.
4. **Integer overflow in rolling hash**: When computing large hashes, use modulo arithmetic with a large prime. Python handles big integers, but Java/JavaScript can overflow.
5. **Off-by-one in sliding window**: The window size is `right - left + 1`, not `right - left`. I’ve seen candidates miss this consistently.
6. **Multiple matches**: Should you return the first match, all matches, or the longest match? Read the problem carefully.

## Difficulty Breakdown

The 44% hard problems tell a story: companies use string matching to separate senior from junior candidates. Here’s what each level typically tests:

- **Easy (31%)**: Basic operations — reversing, palindromes, anagrams. These test coding fluency, not algorithms.
- **Medium (25%)**: Single pattern application — one sliding window, one rolling hash. You need to recognize and implement the pattern.
- **Hard (44%)**: Combination patterns or optimization — KMP with modifications, sliding window with complex constraints, or multiple techniques chained together.

**Study prioritization**: Master the medium problems first. They give you the patterns you need for hards. Don’t start with KMP — build up to it.

## Which Companies Ask String Matching

Different companies have different philosophies:

- **Google**: Loves rolling hash and KMP variants. They’ll give you what looks like an easy problem but has an O(n) optimization. Expect DNA sequence problems.
- **Amazon**: Practical string manipulation — parsing logs, processing customer data. More sliding window, less theoretical algorithms.
- **Bloomberg**: Financial data parsing. Think date formats, ticker symbols, news headline analysis.
- **Microsoft**: Mix of practical and theoretical. They invented the "edit distance" problem (#72).
- **Meta**: String problems related to social features — username validation, hashtag extraction, search autocomplete.

## Study Tips

1. **Learn in this order**:
   - Week 1: Easy problems to build confidence
   - Week 2: Sliding window patterns (minimum window, longest substring)
   - Week 3: Rolling hash applications
   - Week 4: KMP and hard problems

2. **Implement from memory**: After solving a problem, close the editor and reimplement it the next day. String algorithms have many subtle details.

3. **Draw it out**: For sliding window and KMP, draw the pointers and arrays. Understanding why `lps[j-1]` works in KMP requires visualization.

4. **Recommended problem order**:
   1. Valid Palindrome (#125) - easy warmup
   2. Longest Substring Without Repeating Characters (#3) - sliding window
   3. Minimum Window Substring (#76) - advanced sliding window
   4. Repeated DNA Sequences (#187) - rolling hash
   5. Implement strStr() (#28) - KMP practice
   6. Wildcard Matching (#44) - when to use DP instead

String matching questions are gatekeepers for a reason. They test whether you understand that simple data structures can have complex behaviors. Master these patterns, and you’ll handle whatever string problem comes your way.

[Practice all String Matching questions on CodeJeet](/topic/string-matching)
