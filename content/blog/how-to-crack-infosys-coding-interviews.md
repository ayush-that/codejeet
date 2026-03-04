---
title: "How to Crack Infosys Coding Interviews in 2026"
description: "Complete guide to Infosys coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-07-19"
category: "company-guide"
company: "infosys"
tags: ["infosys", "interview prep", "leetcode"]
---

Infosys is one of India's largest IT services companies and a significant global employer of software engineers. The company hires at massive scale — especially through their InfyTQ platform for freshers and the Infosys Specialist Programmer (SP) and Digital Specialist Engineer (DSE) tracks for more advanced roles. What distinguishes Infosys from similarly large service companies is that their SP and DSE roles have a notably higher coding bar, with problem difficulty approaching that of product companies.

For fresher hiring, the process typically involves the InfyTQ certification exam, a coding round on HackWithInfy, and a technical plus HR interview. For the SP track, the coding challenges are significantly harder. Lateral hires face technical screening, one or two coding rounds, and a managerial interview. The coding expectations scale with the role level.

## By the Numbers

Infosys has **158 questions** in the CodeJeet database, with a difficulty profile that is more demanding than you might expect:

- **Easy: 42 questions (27%)** — About a quarter of the pool. A reasonable warmup set, but Infosys is not purely a basics-testing company.
- **Medium: 82 questions (52%)** — The largest segment. Medium problems dominate the interview experience.
- **Hard: 34 questions (21%)** — One in five questions is Hard. This is a higher ratio than companies like TCS, IBM, or Accenture, and reflects the SP/DSE track difficulty.

The 27/52/21 split may surprise candidates who assume IT services companies are easy. If you are targeting the Specialist Programmer role, expect to face problems that are genuinely challenging.

## Top Topics to Focus On

**Array** — As with most companies, arrays lead the pack. Infosys array problems include standard fare like subarray sums and rotations, but also more involved problems like trapping rain water and jump game variants on the SP track. A deep understanding of two-pointer techniques, sliding windows, and prefix sums is crucial.

<div class="code-group">

```python
# Example: Kadane's Algorithm for Maximum Subarray Sum (Array)
def max_subarray_sum(nums):
    max_current = max_global = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        if max_current > max_global:
            max_global = max_current
    return max_global

# Example usage
print(max_subarray_sum([-2,1,-3,4,-1,2,1,-5,4]))  # Output: 6
```

```javascript
// Example: Kadane's Algorithm for Maximum Subarray Sum (Array)
function maxSubarraySum(nums) {
  let maxCurrent = nums[0];
  let maxGlobal = nums[0];
  for (let i = 1; i < nums.length; i++) {
    maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
    if (maxCurrent > maxGlobal) {
      maxGlobal = maxCurrent;
    }
  }
  return maxGlobal;
}

// Example usage
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // Output: 6
```

```java
// Example: Kadane's Algorithm for Maximum Subarray Sum (Array)
public class ArrayExample {
    public static int maxSubarraySum(int[] nums) {
        int maxCurrent = nums[0];
        int maxGlobal = nums[0];
        for (int i = 1; i < nums.length; i++) {
            maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
            if (maxCurrent > maxGlobal) {
                maxGlobal = maxCurrent;
            }
        }
        return maxGlobal;
    }

    public static void main(String[] args) {
        int[] arr = {-2,1,-3,4,-1,2,1,-5,4};
        System.out.println(maxSubarraySum(arr));  // Output: 6
    }
}
```

</div>

**Dynamic Programming** — This is where Infosys stands apart from its services-company peers. DP is the second most common topic, and it is heavily represented in the Hard tier. Expect problems involving sequences, grids, string matching, and optimization. If you are targeting the SP or DSE role, DP proficiency is essential. You must be comfortable with both top-down (memoization) and bottom-up (tabulation) approaches.

<div class="code-group">

```python
# Example: Bottom-up DP for Fibonacci (Dynamic Programming)
def fibonacci_bottom_up(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Example usage
print(fibonacci_bottom_up(10))  # Output: 55
```

```javascript
// Example: Bottom-up DP for Fibonacci (Dynamic Programming)
function fibonacciBottomUp(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Example usage
console.log(fibonacciBottomUp(10)); // Output: 55
```

```java
// Example: Bottom-up DP for Fibonacci (Dynamic Programming)
public class DPExample {
    public static int fibonacciBottomUp(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(fibonacciBottomUp(10));  // Output: 55
    }
}
```

</div>

**String** — String processing, pattern matching, and encoding problems. Infosys string questions range from straightforward Easy problems to Medium-level challenges that combine string manipulation with hash maps or DP. Common tasks include checking for palindromes, anagrams, and substring problems.

<div class="code-group">

```python
# Example: Check if a string is a palindrome (String)
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

# Example usage
print(is_palindrome("racecar"))  # Output: True
print(is_palindrome("hello"))    # Output: False
```

```javascript
// Example: Check if a string is a palindrome (String)
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

// Example usage
console.log(isPalindrome("racecar")); // Output: true
console.log(isPalindrome("hello")); // Output: false
```

```java
// Example: Check if a string is a palindrome (String)
public class StringExample {
    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));  // Output: true
        System.out.println(isPalindrome("hello"));    // Output: false
    }
}
```

</div>

**Math** — Number theory, combinatorics, and mathematical reasoning problems appear more frequently at Infosys than at most product companies. GCD, prime factorization, modular exponentiation, and digit-based problems are common, especially in the online assessment rounds. Efficient algorithms for prime checking and modular arithmetic are essential.

<div class="code-group">

```python
# Example: Euclidean Algorithm for GCD (Math)
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# Example: Sieve of Eratosthenes for primes up to n
def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
    primes = [i for i, prime in enumerate(is_prime) if prime]
    return primes

# Example usage
print(gcd(48, 18))  # Output: 6
print(sieve_of_eratosthenes(30))  # Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

```javascript
// Example: Euclidean Algorithm for GCD (Math)
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Example: Sieve of Eratosthenes for primes up to n
function sieveOfEratosthenes(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}

// Example usage
console.log(gcd(48, 18)); // Output: 6
console.log(sieveOfEratosthenes(30)); // Output: [2,3,5,7,11,13,17,19,23,29]
```

```java
// Example: Euclidean Algorithm for GCD (Math)
public class MathExample {
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Example: Sieve of Eratosthenes for primes up to n
    public static List<Integer> sieveOfEratosthenes(int n) {
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int p = 2; p * p <= n; p++) {
            if (isPrime[p]) {
                for (int i = p * p; i <= n; i += p) {
                    isPrime[i] = false;
                }
            }
        }
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) primes.add(i);
        }
        return primes;
    }

    public static void main(String[] args) {
        System.out.println(gcd(48, 18));  // Output: 6
        System.out.println(sieveOfEratosthenes(30));  // Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    }
}
```

</div>

**Hash Table** — The standard hash map patterns: frequency counting, two-sum variants, and group-by operations. Hash tables serve as the bridge between brute-force and optimal solutions for many Infosys problems. Mastering the use of dictionaries (Python), objects/Maps (JavaScript), and HashMaps (Java) is fundamental.

<div class="code-group">

```python
# Example: Two Sum using Hash Table
def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

# Example usage
print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]
```

```javascript
// Example: Two Sum using Hash Table
function twoSum(nums, target) {
  const numMap = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    numMap.set(nums[i], i);
  }
  return [];
}

// Example usage
console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]
```

```java
// Example: Two Sum using Hash Table
import java.util.HashMap;
import java.util.Map;

public class HashTableExample {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            numMap.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("[" + result[0] + ", " + result[1] + "]");  // Output: [0, 1]
    }
}
```

</div>

## Preparation Strategy

**Weeks 1-2: Build Your Base**

Start with Easy problems in arrays, strings, and math. Solve 4 to 5 per day. Pay special attention to math problems — Infosys tests mathematical thinking more than most companies, and these problems are easy points once you have the techniques down. Familiarize yourself with modular arithmetic and prime number algorithms. Practice writing clean, efficient code for basic operations like array traversal, string reversal, and calculating factorial or Fibonacci numbers.

**Weeks 3-4: Medium Problems and DP Foundations**

Transition to Medium-difficulty problems. Spend half your time on arrays and strings, and half on dynamic programming. For DP, start with 1D problems (fibonacci variants, climbing stairs, house robber) and progress to 2D problems (unique paths, edit distance, longest common subsequence). Aim for 2 to 3 problems per day. Always define the DP state and recurrence before coding. Practice both recursive memoization and iterative tabulation for each problem to build flexibility.

<div class="code-group">

```python
# Example: Climbing Stairs (DP - 1D)
def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Example usage
print(climb_stairs(5))  # Output: 8
```

```javascript
// Example: Climbing Stairs (DP - 1D)
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Example usage
console.log(climbStairs(5)); // Output: 8
```

```java
// Example: Climbing Stairs (DP - 1D)
public class DPClimbingStairs {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(5));  // Output: 8
    }
}
```

</div>

**Week 5: Hard Problems and SP-Track Preparation**

If you are targeting the Specialist Programmer role, this week is critical. Tackle 10 to 12 Hard problems, prioritizing DP and array-based challenges. Practice problems from competitive programming platforms to build speed. For the HackWithInfy competition, familiarize yourself with the contest format and time constraints. Focus on complex DP problems like knapsack variations, matrix chain multiplication, and DP on trees or graphs.

<div class="code-group">

```python
# Example: 0/1 Knapsack Problem (DP - Hard)
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

# Example usage
weights = [1, 3, 4, 5]
values = [1, 4, 5, 7]
capacity = 7
print(knapsack(weights, values, capacity))  # Output: 9
```

```javascript
// Example: 0/1 Knapsack Problem (DP - Hard)
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}

// Example usage
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
const capacity = 7;
console.log(knapsack(weights, values, capacity)); // Output: 9
```

```java
// Example: 0/1 Knapsack Problem (DP - Hard)
public class Knapsack {
    public static int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i-1] <= w) {
                    dp[i][w] = Math.max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);
                } else {
                    dp[i][w] = dp[i-1][w];
                }
            }
        }
        return dp[n][capacity];
    }

    public static void main(String[] args) {
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};
        int capacity = 7;
        System.out.println(knapsack(weights, values, capacity));  // Output: 9
    }
}
```

</div>

**Week 6: Mock Tests and Weak-Area Review**

Simulate the HackWithInfy format: 3 hours, 3 problems of increasing difficulty. Run at least two full simulations. Identify your weakest area — if it is DP, spend extra time on state definition and tabulation approaches. If it is math, drill number theory problems. Reserve the last two days for a relaxed review of all major patterns. Practice input/output handling for large datasets, as platform performance matters.

## Key Tips

1.  **Differentiate your preparation by role.** The coding bar for a generic Infosys hire is very different from the Specialist Programmer or DSE track. If you are aiming for SP, prepare as you would for a product company — solve Hard problems, study DP thoroughly, and practice competitive programming. For lateral hires, expect system design questions alongside coding.

2.  **Take HackWithInfy seriously.** Infosys uses this competition to identify top candidates for the SP role, which comes with a significantly higher starting package. Top performers in HackWithInfy are fast-tracked through the hiring process. Treat it like a competitive programming contest, not a casual assessment. Practice under timed conditions and learn to quickly identify problem patterns.

3.  **Do not skip math.** Unlike at Google or Meta, where math problems are rare, Infosys explicitly tests mathematical reasoning. Practice GCD algorithms, sieve of Eratosthenes, and problems involving digits and modular arithmetic. These are predictable and scorable if you have practiced. Understand concepts like modular inverse and fast exponentiation.

4.  **Master bottom-up DP.** While top-down memoization is conceptually easier, Infosys problems often have tight time limits that favor iterative (bottom-up) DP implementations. Practice converting recursive DP solutions to tabulation form. This also helps avoid recursion depth limits for large inputs.

5.  **Prepare for platform-specific nuances.** The HackWithInfy platform has its own interface and judge behavior. Practice on similar platforms to get comfortable with input parsing, time limit expectations, and partial scoring. Know how your language handles large inputs and outputs efficiently. For example, in Java, use `BufferedReader` and `StringBuilder` for fast I/O.

<div class="code-group">

```python
# Example: Fast Input Reading in Python for large inputs
import sys

def read_large_input():
    # Read all lines at once for efficiency
    data = sys.stdin.read().strip().split()
    # Process data as integers
    nums = list(map(int, data))
    return nums

# Simulating large input processing
if __name__ == "__main__":
    # In a contest, you would read from sys.stdin
    # For demonstration, we simulate with a list
    simulated_input = "100000\n" + "1 " * 100000
    import io
    sys.stdin = io.StringIO(simulated_input)
    numbers = read_large_input()
    print(f"Read {len(numbers)} numbers")
```

```javascript
// Example: Efficient input reading in JavaScript (Node.js)
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let inputLines = [];
rl.on("line", (line) => {
  inputLines.push(line);
}).on("close", () => {
  // Process all input lines
  const numbers = inputLines.join(" ").split(" ").map(Number);
  console.log(`Read ${numbers.length} numbers`);
  // Your solution logic here
});
```

```java
// Example: Fast I/O in Java for competitive programming
import java.io.*;
import java.util.*;

public class FastIOExample {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken()); // read first integer
        int[] arr = new int[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(st.nextToken());
        }
        // Process array
        StringBuilder sb = new StringBuilder();
        for (int num : arr) {
            sb.append(num).append(" ");
        }
        System.out.println(sb.toString());
    }
}
```

</div>

[Browse all Infosys questions on CodeJeet](/company/infosys)
