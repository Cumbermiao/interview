/**
 * 
 * @param {String} s 
 * @param {String} t 
 */
function compare(s,t){
  const sArr = s.split('');
  const tArr = t.split('');
  sArr.sort();
  tArr.sort();

  let i = 0;
  while(i<s.length){
    if(sArr[i]===tArr[i])i++
    else{
      console.log(tArr[i])
      return i
    }
  }
  console.log(tArr[i])
  return i
}

// test

// compare('abcde','abcdef')
// compare('abcde','edcbaf')
// compare('abcde','abcfde')

compare('aaaddd','aaabddd')
compare('aaaddd','dcdadaa')
