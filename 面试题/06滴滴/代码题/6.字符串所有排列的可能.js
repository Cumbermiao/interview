// const str='abc'
// function t(str){}
//['abc','acb','bac',...]

function t(str){
  const strs = str.split('');
  strs.sort();
  const cp = strs.slice(0);
  const res = []

  function backtracking(template,rest){
    if(rest.length===0){
      res.push(template.slice(0))
      return 
    }

    for(let i=0;i<rest.length;i++){
      if( i>0 && rest[i]===rest[i-1])continue
      template.push(rest[i])
      let cpRest = rest.slice(0)
      cpRest.splice(i,1)
      backtracking(template,cpRest)
      template.pop()
    }
  }


  backtracking([],cp)
  return res
}


//@test

// console.log(t('abc'))
// console.log(t('abcd'))
// console.log(t('aac'))