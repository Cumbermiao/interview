// 发布订阅

class Broadcast{
  constructor(){
    this.event={}
  }

  on(name,cb){
    if(!(name in this.event)){
      this.event[name]=[cb]
    }else{
      this.event[name].push(cb)
    }
  }

  emit(name){
    if(name in this.event){
      this.event[name].forEach(cb=>{
        cb()
      })
    }
  }

  off(name, cb){
    if(name in this.event){
      const cbs = this.event[name]
      cbs.forEach((item,idx)=>{
        if(item===cb){
          cbs.splice(idx,1)
          return true
        }
      })
    }
  }

  once(name,cb){
    const _this = this
    const myCb = function(){
      cb()
      _this.off(name,myCb)
    }
    this.on(name,myCb)
  }
}

const bus1 = new Broadcast()

const e1 = ()=>{
  console.log('ev1')
}
bus1.on('ev1',e1)

bus1.emit('ev1')
bus1.emit('ev1')

bus1.off('ev1',e1)
bus1.emit('ev1')

bus1.once('ev2',()=>console.log('ev2'))
bus1.emit('ev2')
bus1.emit('ev2')
