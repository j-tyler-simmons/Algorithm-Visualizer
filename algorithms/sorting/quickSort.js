const steps = [];

function recordStep(values, type, indices) {
    steps.push({
        values: [...values],
        type: type,
        indices: indices
    });
}

function partition(values, low, high) {
    const pivot = values[high];
    recordStep(values, "pivot", [high]);

    let i = low - 1;

    for (let j = low; j < high; j++) {
        recordStep(values, "compare", [j, high]);

        if (values[j] < pivot) {
            i++;

            if (i !== j) {
                const temp = values[i];

                values[i] = values[j];
                values[j] = temp;
                recordStep(values, "swap", [i, j]);
            }
        }
    }

    const pivotIndex = i + 1;

    if (pivotIndex !== high) {
        const temp2 = values[pivotIndex];

        values[high] = temp2;
        values[pivotIndex] = pivot;
        recordStep(values, "swap", [pivotIndex, high]);
    }
    

    return pivotIndex;
}

function quickSortRecursive(values, low, high) {
    if (low >= high) {
        return;
    }
    else {
        const pivot = partition(values, low, high);
        quickSortRecursive(values, low, pivot - 1);
        quickSortRecursive(values, pivot + 1, high);
    }
}

export function quickSort(values) {
    steps.length = 0;

    recordStep(values, "initial", []);

    quickSortRecursive(values, 0, values.length - 1);

    return steps;
}