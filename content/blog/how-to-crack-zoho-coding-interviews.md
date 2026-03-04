---
title: "How to Crack Zoho Coding Interviews in 2026"
description: "Complete guide to Zoho coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-07-13"
category: "company-guide"
company: "zoho"
tags: ["zoho", "interview prep", "leetcode"]
---

Zoho has carved out a unique position in the tech industry — a profitable, privately held company that builds an entire suite of business software (CRM, mail, office tools, finance, and more) without relying on outside funding. Their interview process reflects this self-reliant culture. Zoho values deep programming fundamentals, clean code, and the ability to build things from scratch. Unlike many companies that rely heavily on LeetCode-style pattern matching, Zoho interviews often include program design rounds where you write full working programs, not just functions.

The typical Zoho interview process for freshers includes an aptitude test, a programming round (write complete programs, often in C or C++), one or two advanced programming rounds, a technical HR interview, and a final HR round. For experienced hires, the process is similar but may include system design or domain-specific questions.

## By the Numbers

Zoho's CodeJeet question bank includes **179 questions** with a balanced difficulty profile:

- **Easy: 62 questions (35%)** — A solid base. Zoho's emphasis on fundamentals means Easy problems are not filler — they reflect what you will actually encounter.
- **Medium: 97 questions (54%)** — The majority. Medium problems form the backbone of Zoho's coding rounds.
- **Hard: 20 questions (11%)** — A small percentage. Zoho rarely throws very difficult algorithmic problems, preferring to test depth of implementation over raw difficulty.

The 35/54/11 split is practical and grounded. Zoho wants to see that you can write clean, complete programs — not that you can solve competitive programming puzzles. This is good news if you are stronger at implementation than at tricky algorithm design.

## Top Topics to Focus On

**Array** — Overwhelmingly the most common topic. Zoho array problems range from basic traversal to matrix operations, rotation, and subarray computations. Expect to write full programs that handle input parsing, array manipulation, and formatted output.

A classic example is rotating an array by `k` positions. The brute-force method involves rotating by one position `k` times, which is inefficient. The optimal approach uses reversal.

<div class="code-group">

```python
def rotate_array(arr, k):
    """
    Rotates the array 'arr' to the right by 'k' positions.
    This is a complete function; for a full program, you'd add input handling.
    """
    n = len(arr)
    k = k % n  # Handle cases where k >= n

    # Helper function to reverse a portion of the array
    def reverse(start, end):
        while start < end:
            arr[start], arr[end] = arr[end], arr[start]
            start += 1
            end -= 1

    # Reverse the entire array
    reverse(0, n - 1)
    # Reverse the first k elements
    reverse(0, k - 1)
    # Reverse the remaining n-k elements
    reverse(k, n - 1)
    return arr

# Example usage in a complete program context:
if __name__ == "__main__":
    # Simulate reading input, e.g., "1 2 3 4 5 6 7" and "3"
    input_arr = list(map(int, input("Enter array elements: ").split()))
    k_val = int(input("Enter rotation count k: "))
    result = rotate_array(input_arr, k_val)
    print("Rotated array:", result)
```

```javascript
/**
 * Rotates the array 'arr' to the right by 'k' positions.
 * This is a complete function; for a full program, you'd add input handling.
 */
function rotateArray(arr, k) {
  const n = arr.length;
  k = k % n; // Handle cases where k >= n

  // Helper function to reverse a portion of the array
  const reverse = (start, end) => {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  };

  // Reverse the entire array
  reverse(0, n - 1);
  // Reverse the first k elements
  reverse(0, k - 1);
  // Reverse the remaining n-k elements
  reverse(k, n - 1);
  return arr;
}

// Example usage in a complete program context:
// Simulate reading input, e.g., from command line arguments
// const inputArr = process.argv[2].split(',').map(Number);
// const kVal = parseInt(process.argv[3]);
// console.log("Rotated array:", rotateArray(inputArr, kVal));
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class RotateArray {
    /**
     * Rotates the array 'arr' to the right by 'k' positions.
     * This method modifies the array in-place.
     */
    public static void rotateArray(int[] arr, int k) {
        int n = arr.length;
        k = k % n; // Handle cases where k >= n

        // Helper function to reverse a portion of the array
        reverse(arr, 0, n - 1);
        reverse(arr, 0, k - 1);
        reverse(arr, k, n - 1);
    }

    private static void reverse(int[] arr, int start, int end) {
        while (start < end) {
            int temp = arr[start];
            arr[start] = arr[end];
            arr[end] = temp;
            start++;
            end--;
        }
    }

    // Example usage in a complete program
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter array elements (space-separated): ");
        String[] input = scanner.nextLine().split(" ");
        int[] arr = Arrays.stream(input).mapToInt(Integer::parseInt).toArray();

        System.out.print("Enter rotation count k: ");
        int k = scanner.nextInt();

        rotateArray(arr, k);
        System.out.println("Rotated array: " + Arrays.toString(arr));
        scanner.close();
    }
}
```

</div>

**String** — Zoho frequently tests string manipulation: reversal, compression, anagram detection, and pattern-based problems. Given that their programming rounds often require complete programs, practice reading string input and producing exact output formats.

String compression is a common problem where you replace consecutive duplicate characters with the character followed by the count. For example, "aaabbccc" becomes "a3b2c3".

<div class="code-group">

```python
def compress_string(s):
    """
    Compresses the string by counting consecutive characters.
    Returns the compressed string. If the compressed string is not smaller,
    returns the original string.
    """
    if not s:
        return s

    compressed_chars = []
    count = 1

    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            compressed_chars.append(s[i - 1] + str(count))
            count = 1
    # Append the last character and its count
    compressed_chars.append(s[-1] + str(count))

    compressed = ''.join(compressed_chars)
    return compressed if len(compressed) < len(s) else s

# Complete program example
if __name__ == "__main__":
    input_str = input("Enter a string to compress: ")
    result = compress_string(input_str)
    print(f"Compressed result: {result}")
```

```javascript
function compressString(s) {
  /**
   * Compresses the string by counting consecutive characters.
   * Returns the compressed string. If the compressed string is not smaller,
   * returns the original string.
   */
  if (!s) return s;

  let compressedChars = [];
  let count = 1;

  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      count++;
    } else {
      compressedChars.push(s[i - 1] + count);
      count = 1;
    }
  }
  // Append the last character and its count
  compressedChars.push(s[s.length - 1] + count);

  const compressed = compressedChars.join("");
  return compressed.length < s.length ? compressed : s;
}

// Complete program example
// const inputStr = prompt("Enter a string to compress:") || "";
// console.log(`Compressed result: ${compressString(inputStr)}`);
```

```java
import java.util.Scanner;

public class StringCompression {
    public static String compressString(String s) {
        /**
         * Compresses the string by counting consecutive characters.
         * Returns the compressed string. If the compressed string is not smaller,
         * returns the original string.
         */
        if (s == null || s.isEmpty()) return s;

        StringBuilder compressed = new StringBuilder();
        int count = 1;

        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                count++;
            } else {
                compressed.append(s.charAt(i - 1)).append(count);
                count = 1;
            }
        }
        // Append the last character and its count
        compressed.append(s.charAt(s.length() - 1)).append(count);

        String result = compressed.toString();
        return result.length() < s.length() ? result : s;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a string to compress: ");
        String inputStr = scanner.nextLine();
        String result = compressString(inputStr);
        System.out.println("Compressed result: " + result);
        scanner.close();
    }
}
```

</div>

**Hash Table** — Used to optimize lookup-heavy problems. Frequency counting, duplicate detection, and group-by operations. In Zoho's context, hash maps help you move from brute-force to efficient solutions, which interviewers explicitly look for.

A typical problem is finding the first non-repeating character in a string. The brute-force method would use nested loops (O(n²)). Using a hash table (dictionary) to count frequencies reduces it to O(n).

<div class="code-group">

```python
def first_non_repeating_char(s):
    """
    Returns the first character in the string that does not repeat.
    Returns '_' if no such character exists.
    """
    from collections import defaultdict

    # Build frequency dictionary
    freq = defaultdict(int)
    for ch in s:
        freq[ch] += 1

    # Find the first character with frequency 1
    for ch in s:
        if freq[ch] == 1:
            return ch
    return '_'

# Complete program
if __name__ == "__main__":
    input_str = input("Enter a string: ")
    result = first_non_repeating_char(input_str)
    print(f"First non-repeating character: {result}")
```

```javascript
function firstNonRepeatingChar(s) {
  /**
   * Returns the first character in the string that does not repeat.
   * Returns '_' if no such character exists.
   */
  const freq = new Map();

  // Build frequency map
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  // Find the first character with frequency 1
  for (const ch of s) {
    if (freq.get(ch) === 1) {
      return ch;
    }
  }
  return "_";
}

// Complete program
// const inputStr = prompt("Enter a string:") || "";
// console.log(`First non-repeating character: ${firstNonRepeatingChar(inputStr)}`);
```

```java
import java.util.HashMap;
import java.util.Scanner;

public class FirstNonRepeatingChar {
    public static char firstNonRepeatingChar(String s) {
        /**
         * Returns the first character in the string that does not repeat.
         * Returns '_' if no such character exists.
         */
        HashMap<Character, Integer> freq = new HashMap<>();

        // Build frequency map
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            freq.put(ch, freq.getOrDefault(ch, 0) + 1);
        }

        // Find the first character with frequency 1
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (freq.get(ch) == 1) {
                return ch;
            }
        }
        return '_';
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a string: ");
        String inputStr = scanner.nextLine();
        char result = firstNonRepeatingChar(inputStr);
        System.out.println("First non-repeating character: " + result);
        scanner.close();
    }
}
```

</div>

**Dynamic Programming** — While only 11% of problems are Hard, DP still appears in the Medium tier. Zoho favors classic DP problems: longest increasing subsequence, edit distance, and knapsack-style questions. Focus on being able to explain the recurrence relation clearly.

The classic 0/1 Knapsack problem is a fundamental DP question. Given weights and values of items, and a maximum weight capacity, determine the maximum value you can carry.

<div class="code-group">

```python
def knapsack_01(weights, values, capacity):
    """
    Solves the 0/1 Knapsack problem using Dynamic Programming.
    Returns the maximum value achievable.
    """
    n = len(weights)
    # DP table: dp[i][w] = max value with first i items and capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i - 1] <= w:
                # Option 1: Include the item
                include = values[i - 1] + dp[i - 1][w - weights[i - 1]]
                # Option 2: Exclude the item
                exclude = dp[i - 1][w]
                dp[i][w] = max(include, exclude)
            else:
                # Cannot include the item
                dp[i][w] = dp[i - 1][w]
    return dp[n][capacity]

# Complete program example
if __name__ == "__main__":
    weights = list(map(int, input("Enter weights (space-separated): ").split()))
    values = list(map(int, input("Enter values (space-separated): ").split()))
    capacity = int(input("Enter knapsack capacity: "))
    max_value = knapsack_01(weights, values, capacity)
    print(f"Maximum value in knapsack: {max_value}")
```

```javascript
function knapsack01(weights, values, capacity) {
  /**
   * Solves the 0/1 Knapsack problem using Dynamic Programming.
   * Returns the maximum value achievable.
   */
  const n = weights.length;
  // DP table: dp[i][w] = max value with first i items and capacity w
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        // Option 1: Include the item
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        // Option 2: Exclude the item
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);
      } else {
        // Cannot include the item
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}

// Complete program example
// const weights = prompt("Enter weights (comma-separated):").split(',').map(Number);
// const values = prompt("Enter values (comma-separated):").split(',').map(Number);
// const capacity = parseInt(prompt("Enter knapsack capacity:"));
// console.log(`Maximum value in knapsack: ${knapsack01(weights, values, capacity)}`);
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class Knapsack01 {
    public static int knapsack01(int[] weights, int[] values, int capacity) {
        /**
         * Solves the 0/1 Knapsack problem using Dynamic Programming.
         * Returns the maximum value achievable.
         */
        int n = weights.length;
        // DP table: dp[i][w] = max value with first i items and capacity w
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    // Option 1: Include the item
                    int include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
                    // Option 2: Exclude the item
                    int exclude = dp[i - 1][w];
                    dp[i][w] = Math.max(include, exclude);
                } else {
                    // Cannot include the item
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][capacity];
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter weights (space-separated): ");
        int[] weights = Arrays.stream(scanner.nextLine().split(" ")).mapToInt(Integer::parseInt).toArray();

        System.out.print("Enter values (space-separated): ");
        int[] values = Arrays.stream(scanner.nextLine().split(" ")).mapToInt(Integer::parseInt).toArray();

        System.out.print("Enter knapsack capacity: ");
        int capacity = scanner.nextInt();

        int maxValue = knapsack01(weights, values, capacity);
        System.out.println("Maximum value in knapsack: " + maxValue);
        scanner.close();
    }
}
```

</div>

**Two Pointers** — Pair sums, three sums, container problems, and merging sorted arrays. Two-pointer problems are a favorite in Zoho's programming rounds because they test whether you can optimize beyond the obvious nested-loop approach.

The "two sum" problem, where you need to find two numbers in a sorted array that add up to a target, is a classic two-pointer example.

<div class="code-group">

```python
def two_sum_sorted(arr, target):
    """
    Returns the indices (1-based) of the two numbers in the sorted array
    that add up to the target. Assumes exactly one solution exists.
    Uses the two-pointer technique.
    """
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            # Return 1-based indices as often required
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []  # No solution found (should not happen per assumption)

# Complete program
if __name__ == "__main__":
    arr = list(map(int, input("Enter sorted array elements: ").split()))
    target = int(input("Enter target sum: "))
    result = two_sum_sorted(arr, target)
    if result:
        print(f"Indices: {result}")
    else:
        print("No solution found.")
```

```javascript
function twoSumSorted(arr, target) {
  /**
   * Returns the indices (1-based) of the two numbers in the sorted array
   * that add up to the target. Assumes exactly one solution exists.
   * Uses the two-pointer technique.
   */
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === target) {
      // Return 1-based indices
      return [left + 1, right + 1];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return []; // No solution found
}

// Complete program
// const arr = prompt("Enter sorted array elements (comma-separated):").split(',').map(Number);
// const target = parseInt(prompt("Enter target sum:"));
// console.log(`Indices: ${twoSumSorted(arr, target)}`);
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class TwoSumSorted {
    public static int[] twoSumSorted(int[] arr, int target) {
        /**
         * Returns the indices (1-based) of the two numbers in the sorted array
         * that add up to the target. Assumes exactly one solution exists.
         * Uses the two-pointer technique.
         */
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int currentSum = arr[left] + arr[right];
            if (currentSum == target) {
                // Return 1-based indices
                return new int[]{left + 1, right + 1};
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{}; // No solution found
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter sorted array elements (space-separated): ");
        int[] arr = Arrays.stream(scanner.nextLine().split(" ")).mapToInt(Integer::parseInt).toArray();
        System.out.print("Enter target sum: ");
        int target = scanner.nextInt();

        int[] result = twoSumSorted(arr, target);
        if (result.length == 2) {
            System.out.println("Indices: " + result[0] + ", " + result[1]);
        } else {
            System.out.println("No solution found.");
        }
        scanner.close();
    }
}
```

</div>

## Preparation Strategy

**Weeks 1-2: Write Complete Programs**

This is critical for Zoho. Instead of just writing a function that solves a problem, practice writing entire programs with main functions, input handling, and formatted output. Solve 4 to 5 Easy problems per day in C, C++, Java, or Python — whatever language you plan to use. Focus on arrays and strings. Get comfortable with edge cases: empty inputs, single elements, and boundary values.

**Practical Exercise:** Write a complete program that reads a matrix (2D array) from input, prints its transpose, and then prints the matrix in spiral order. This combines input parsing, 2D array manipulation, and complex traversal logic.

**Weeks 3-4: Medium Problems with Full Implementation**

Move to Medium-difficulty problems. Continue writing complete programs, not just solution functions. Introduce hash tables and two-pointer techniques. Aim for 2 to 3 problems per day. Zoho's advanced programming rounds often give you a problem description and expect a fully working program within 30 to 45 minutes, so practice under those constraints.

**Example Medium Problem:** "Group Anagrams" – Given a list of strings, group the anagrams together. This tests your ability to use hash tables as a key mapping and handle string sorting.

<div class="code-group">

```python
def group_anagrams(strs):
    """
    Groups anagrams together from a list of strings.
    Returns a list of lists.
    """
    from collections import defaultdict
    anagram_map = defaultdict(list)

    for s in strs:
        # Use sorted string as the key
        key = ''.join(sorted(s))
        anagram_map[key].append(s)

    return list(anagram_map.values())

# In a complete program, you would read the list from input.
```

```javascript
function groupAnagrams(strs) {
  /**
   * Groups anagrams together from a list of strings.
   * Returns an array of arrays.
   */
  const anagramMap = new Map();

  for (const s of strs) {
    // Use sorted string as the key
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
import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] strs) {
        /**
         * Groups anagrams together from a list of strings.
         * Returns a list of lists.
         */
        Map<String, List<String>> anagramMap = new HashMap<>();

        for (String s : strs) {
            char[] charArray = s.toCharArray();
            Arrays.sort(charArray);
            String key = new String(charArray);
            anagramMap.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(anagramMap.values());
    }
}
```

</div>

**Week 5: Dynamic Programming and Design**

Spend this week on DP fundamentals and program design. For DP, focus on the classics and make sure you can implement them without hints. For program design, practice building small applications: a library management system, a student grade tracker, or a basic calculator with multiple operations. Zoho loves these kinds of design rounds.

**Design Round Example:** A basic console-based Library Management System should have classes for `Book`, `Member`, and `Library`. It should support adding books, borrowing books, returning books, and searching. Focus on clean class design, data structures (like using a list or map to store books), and handling edge cases (e.g., borrowing a book that is already borrowed).

**Week 6: Timed Practice and Review**

Simulate Zoho's actual test format. Set a timer for 60 to 90 minutes and solve 3 to 4 problems of mixed difficulty, writing complete programs for each. Review your code for clarity, naming, and structure. Revisit your weakest topic and solve 5 additional problems in that area.

**Mock Test Problem Set Example:**

1.  **Easy:** Reverse words in a given string.
2.  **Medium:** Find the maximum sum of a contiguous subarray (Kadane's Algorithm).
3.  **Medium:** Implement a function to check if a binary tree is a BST (if trees are in your syllabus).
4.  **Hard (if time permits):** N-Queens problem (printing one solution).

## Key Tips

1.  **Write complete, compilable programs.** Zoho's programming rounds are not LeetCode-style where you fill in a function. You write a full program from scratch. Practice this workflow — reading input, processing, producing output — until it is second nature.

    **Input/Output Practice:** For a problem like "Find the second largest element in an array," a complete program must:
    - Read the size `n`.
    - Read `n` integers.
    - Compute the answer.
    - Print the result.
      Here’s a concise example:

    <div class="code-group">

    ```python
    if __name__ == "__main__":
        n = int(input())
        arr = list(map(int, input().split()))
        # Find second largest logic
        first = second = float('-inf')
        for num in arr:
            if num > first:
                second = first
                first = num
            elif num > second and num != first:
                second = num
        print(second if second != float('-inf') else "No second largest")
    ```

    ```javascript
    // Using Node.js readline
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let n, arr;
    rl.question("", (size) => {
      n = parseInt(size);
      rl.question("", (elements) => {
        arr = elements.split(" ").map(Number);
        // Find second largest logic
        let first = -Infinity,
          second = -Infinity;
        for (let num of arr) {
          if (num > first) {
            second = first;
            first = num;
          } else if (num > second && num !== first) {
            second = num;
          }
        }
        console.log(second !== -Infinity ? second : "No second largest");
        rl.close();
      });
    });
    ```

    ```java
    import java.util.Scanner;
    public class SecondLargest {
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            int n = sc.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
            int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
            for (int num : arr) {
                if (num > first) {
                    second = first;
                    first = num;
                } else if (num > second && num != first) {
                    second = num;
                }
            }
            System.out.println(second != Integer.MIN_VALUE ? second : "No second largest");
            sc.close();
        }
    }
    ```

    </div>

2.  **Know C or C++ well, even if you prefer another language.** Zoho historically favors C and C++ in their coding rounds, especially for freshers. Even if you are allowed to use Java or Python, understanding pointers, memory management, and low-level data structures will serve you well in the technical interview. Practice implementing a linked list or a stack from scratch in C.

3.  **Focus on code quality.** Zoho interviewers read your code carefully. Use meaningful variable names, handle edge cases explicitly, and keep your logic modular. A well-structured brute-force solution often scores better than a messy optimal one. Always add comments for complex logic.

4.  **Prepare for the aptitude round.** Do not skip this. Zoho's aptitude test covers quantitative ability, logical reasoning, and verbal comprehension. Candidates are eliminated at this stage before they ever write code. Practice quantitative problems on percentages, ratios, time-speed-distance, and number series. For logical reasoning, focus on puzzles, syllogisms, and data interpretation.

5.  **Practice matrix and 2D array problems.** Zoho has a particular fondness for matrix-based problems: spiral traversal, rotation, searching in sorted matrices, and path-finding. These come up more often here than at many other companies.

    **Spiral Traversal Example:** Given an m x n matrix, return all elements in spiral order.

    <div class="code-group">

    ```python
    def spiral_order(matrix):
        if not matrix:
            return []
        result = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            # Traverse right
            for i in range(left, right + 1):
                result.append(matrix[top][i])
            top += 1
            # Traverse down
            for i in range(top, bottom + 1):
                result.append(matrix[i][right])
            right -= 1
            if top <= bottom:
                # Traverse left
                for i in range(right, left - 1, -1):
                    result.append(matrix[bottom][i])
                bottom -= 1
            if left <= right:
                # Traverse up
                for i in range(bottom, top - 1, -1):
                    result.append(matrix[i][left])
                left += 1
        return result
    ```

    ```javascript
    function spiralOrder(matrix) {
      if (!matrix.length) return [];
      const result = [];
      let top = 0,
        bottom = matrix.length - 1;
      let left = 0,
        right = matrix[0].length - 1;
      while (top <= bottom && left <= right) {
        for (let i = left; i <= right; i++) result.push(matrix[top][i]);
        top++;
        for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
        right--;
        if (top <= bottom) {
          for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
          bottom--;
        }
        if (left <= right) {
          for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
          left++;
        }
      }
      return result;
    }
    ```

    ```java
    import java.util.ArrayList;
    import java.util.List;
    public class SpiralMatrix {
        public List<Integer> spiralOrder(int[][] matrix) {
            List<Integer> result = new ArrayList<>();
            if (matrix.length == 0) return result;
            int top = 0, bottom = matrix.length - 1;
            int left = 0, right = matrix[0].length - 1;
            while (top <= bottom && left <= right) {
                for (int i = left; i <= right; i++) result.add(matrix[top][i]);
                top++;
                for (int i = top; i <= bottom; i++) result.add(matrix[i][right]);
                right--;
                if (top <= bottom) {
                    for (int i = right; i >= left; i--) result.add(matrix[bottom][i]);
                    bottom--;
                }
                if (left <= right) {
                    for (int i = bottom; i >= top; i--) result.add(matrix[i][left]);
                    left++;
                }
            }
            return result;
        }
    }
    ```

    </div>

[Browse all Zoho questions on CodeJeet](/company/zoho)
