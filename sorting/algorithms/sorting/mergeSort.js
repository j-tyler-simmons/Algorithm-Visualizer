const steps = [];

function recordStep(values, type, indices, details = {}) {
    steps.push({
        values: [...values],
        type: type,
        indices: indices,
        ...details
    });
}

function mergeSortRecursive(values, left, right, depth) {
    if (left >= right) {
        recordStep(values, "leaf", [], {
            left: left,
            right: right,
            depth: depth
        });

        return;
    }

    const mid = Math.floor((left + right) / 2);

    recordStep(values, "split", [], {
        left: left,
        mid: mid,
        right: right
    });

    mergeSortRecursive(values, left, mid, depth + 1);
    mergeSortRecursive(values, mid + 1, right, depth + 1);

    merge(values, left, mid, right);
}

function merge(values, left, mid, right) {
    const leftArray = values.slice(left, mid + 1);
    const rightArray = values.slice(mid + 1, right + 1);

    //left array index
    let i = 0;
    //right array index
    let j = 0;
    //values index
    let k = left;

    while (i < leftArray.length && j < rightArray.length) {
        recordStep(
            values,
            "compare",
            [left + i, mid + 1 + j],
            {
                left: left,
                mid: mid,
                right: right
            }
        );

        if (leftArray[i] <= rightArray[j]) {
            values[k] = leftArray[i];
            recordStep(
                values,
                "write",
                [k],
                {
                    left: left,
                    mid: mid,
                    right: right
                }
            );

            i++;
        }
        else {
            values[k] = rightArray[j];
            recordStep(
                values,
                "write",
                [k],
                {
                    left: left,
                    mid: mid,
                    right: right
                }
            );

            j++;
        }

        k++;
    }

    while (i < leftArray.length) {
        values[k] = leftArray[i];
        recordStep(
            values,
            "write",
            [k],
            {
                left: left,
                mid: mid,
                right: right
            }
        );

        i++;
        k++;
    }
    while (j < rightArray.length) {
        values[k] = rightArray[j];
        recordStep(
            values,
            "write",
            [k],
            {
                left: left,
                mid: mid,
                right: right
            }
        );

        j++;
        k++;
    }

    recordStep(values, "merge-complete", [], {
        left: left,
        right: right
    });
}

export function mergeSort(values) {
    steps.length = 0;

    recordStep(values, "initial", [], {
        left: 0,
        right: values.length - 1,
        depth: 0
    });

    mergeSortRecursive(values, 0, values.length - 1, 0);

    return steps;
}