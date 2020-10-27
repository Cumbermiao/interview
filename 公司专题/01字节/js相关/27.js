function template(str,data){
  return str.replace(/\{\{(.*?)\}\}/g,(match,key)=>data[key])
}