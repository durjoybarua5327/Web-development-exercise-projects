test= int(input())
for _ in range(test):
    a = int(input())
    b = list(map(int, input().split()))
    p = True
    for i in range(len(b) - 2):
        if b[i] == 1 and b[i+1] == 0 and b[i+2] == 1:
            p = False
            break
    print("YES" if p else "NO")