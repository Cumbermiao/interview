// request(url, successCallback,failCallback);
// function cacheRequest(url,sc,fb){
//   //
// }
// cacheRequest('/a', (data1)=>{console. log(1)})
// cacheRequest('/a', (data1)=>{console. log(2)})
// cacheRequest('/b', (data2)=>{console. log(3)})


request(url, successCallback,failCallback);

function cacheRequest(url,sc,fb){
  const cached = {};

  if(url in cached){
    sc(cached[url])
  }else{
    request(url,function(data){
      cached[url] = data
      sc(data)
    },fb)
  }
}

cacheRequest('/a', (data1)=>{console. log(1)})
cacheRequest('/a', (data1)=>{console. log(2)})
cacheRequest('/b', (data2)=>{console. log(3)})


// @test TODO: