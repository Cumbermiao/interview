function QuickSort(arr) {
  let sort = function(arr, left = 0, right = arr.length - 1) {
    let il = left;
    let ir = right;
    //注意 <=
    if (il <= ir) {
      let baseVal = arr[ir];
      //注意 <
      while (il < ir) {
        while (il < ir && arr[il] <= baseVal) {
          il++;
        }
        arr[ir] = arr[il];
        while (il < ir && arr[ir] > baseVal) {
          ir--;
        }
        arr[il] = arr[ir];
      }
      arr[il] = baseVal;
      sort(arr, left, il - 1);
      sort(arr, il + 1, right);
    }
    return;
  };
  sort(arr);
  return arr;
}

console.log(quickSort([1, 11, 2, 23, 33, 3, 4, 4, 6, 4]));
console.log(quickSort([1]));
console.log(quickSort([1, 1]));
console.log(quickSort([1, 1, 2]));

function QuickSort(arr) {
  let sort = function(arr, left = 0, right = arr.length - 1) {
    let il = left;
    let ir = right;
    if (il <= ir) {
      let baseVal = arr[ir];
      while (il < ir) {
        while (il < ir && arr[il] <= baseVal) {
          il++;
        }
        arr[ir] = arr[il];
        while (il < ir && arr[ir] > baseVal) {
          ir--;
        }
        arr[il] = arr[ir];
      }
      arr[il] = baseVal;
      sort(arr, left, il - 1);
      sort(arr, il + 1, right);
    }
    return;
  };
  sort(arr);
  return arr;
}
