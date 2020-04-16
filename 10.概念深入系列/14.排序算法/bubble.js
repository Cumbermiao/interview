function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function bubbleSort(arr) {
  if (arr.length <= 1) return arr;
  let i = 0,
    j = 0;
  for (; i < arr.length; i++) {
    for (j = 0; j < arr.length - i; j++) {
      if (arr[j] < arr[j - 1]) {
        swap(arr, j - 1, j);
      }
    }
  }
}

function binarySearch(arr, base) {
  arr.sort((a,b)=>a-b)
  function search(arr, i = 0, j = arr.length - 1) {
    if (i < j) {
      let mid = ((i + j) / 2) | 0;
      if(arr[mid]===base)return mid
      else if(arr[mid]>base){
        return search(arr,i,mid-1)
      }else{
        return search(arr,mid+1,j)
      }
    }else if(i===j){
      return arr[i]===base?i:false
    }else {
      return false
    }
    
  }
}
