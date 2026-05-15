#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int secondLargest(const vector<int>& a) {
    int largest = INT_MIN;
    int second = INT_MIN;
    for (int x : a) {
        if (x > largest) {
            second = largest;
            largest = x;
        } else if (x < largest && x > second) {
            second = x;
        }
    }
    return second == INT_MIN ? -1 : second;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << secondLargest(a) << "\n";
    return 0;
}
