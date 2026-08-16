export function bubbleSort(values, n) {
    if (n <= 1) {
        //base case, exit
        return;
    }
    
    for (let i = 1; i < n; i++) {
        if (values[i - 1] > values[i]) {
            const temp = values[i];
            values[i] = values[i - 1];
            values[i - 1] = temp;
        }
    }
    bubbleSort(values, n - 1);
}