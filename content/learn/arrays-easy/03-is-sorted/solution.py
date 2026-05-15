def is_sorted(a):
    for i in range(1, len(a)):
        if a[i - 1] > a[i]:
            return False
    return True


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
print("true" if is_sorted(a) else "false")
