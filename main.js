class BlockSet {
  constructor(gameController, kind) {
    this.rotable = true;
    switch(kind){
      case 0: //I
        this.block = [[-2, 0], [-1, 0], [0,0], [1,0]]
        this.color = '#9DCCE0'
        break;
      case 1: // O
        this.block = [[-1,-1],[-1,0], [0,-1], [0,0]]
        this.color = '#f2cf01'
        this.rotable = false
        break
      case 2: // T
        this.block = [[-1, 0], [0, 0], [1, 0], [0, 1]]
        this.color = '#9460a0'
        break;
      case 3: // L
        this.block = [[-1,0],[0,0],[1,0],[-1,1]]
        this.color = '#d16b16'
        break;
      case 4: // J
        this.block = [[-1,0],[0,0],[1,0],[1,1]]
        this.color = '#0074bf'
        break;
      case 5: // Z
        this.block = [[-1,0], [0,0], [0, -1], [1, -1]]
        this.color = '#56a764'
        break;
      case 6: // Z
        this.block = [[-1, -1], [0, -1], [0, 0], [0,1]]
        this.color = '#c93a40'
        break;
      default:
        this.block = [[-2, 0], [-1, 0], [0,0], [1,0]]
        this.color = '#9DCCE0'
        break;
    }
    this.x = 0
    this.y = 0
  }
  rotated(){
    if(!this.rotable){
      return;
    }
    for(let i = 0;i<this.block.length;i++){
      var before = this.block[i]
      this.block[i] = [before[1], -before[0]]
    }
  }
  rotate(){
    var result = new BlockSet
    result.color = this.color
    result.x = this.x
    result.y = this.y
    result.block = new Array(this.block.length)
    for(let i = 0; i < this.block.length; i++){
      result.block[i] = [this.block[i][0], this.block[i][1]]
    }
    result.rotated()
    return result
  }
  translate(deltaX, deltaY){
    var result = new BlockSet
    result.color = this.color
    result.x = this.x + deltaX
    result.y = this.y + deltaY

    result.block = new Array();
    for(let y = 0; y < this.block.length; y++) {
      result.block[y] = new Array(2).fill(0);
    }
    
    for(let i = 0; i < this.block.length; i++) {
      result.block[i] = [this.block[i][0], this.block[i][1]]
    }
    return result
  }
}
class GameController {
  constructor(width, height){
    this.canvas = document.getElementById('game')
    this.canvas.width = 250
    this.canvas.height = 500
    this.meshNumberX = 10;
    this.meshNumberY = 20;
    this.stage = new Array(this.meshNumberX);
    for(let x = 0; x < this.meshNumberX; x++) {
      this.stage[x] = new Array(this.meshNumberY).fill("");
    }
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.blockWidth = this.width/this.meshNumberX;
    this.blockHeight = this.height/this.meshNumberY;
    this.newBlockSet()
    this.frameNumber = 0;
    this.timerID = setInterval( ()=>{ this.render() }, 100);
    document.body.addEventListener('keydown',
    event => {
        if (event.key === 'ArrowUp') {
          if(this.canMoval(this.nowBlockSet.rotate())){
            this.nowBlockSet.rotated()
          }
        }else if(event.key == 'ArrowDown') {
          if(this.canMoval(this.nowBlockSet.translate(0, 1))){
            this.nowBlockSet.y += 1;
          }
        }else if(event.key == 'ArrowRight') {
          if(this.canMoval(this.nowBlockSet.translate(1, 0))){
            this.nowBlockSet.x += 1;
          }
        }else if(event.key == 'ArrowLeft') {
          if(this.canMoval(this.nowBlockSet.translate(-1, 0))){
            this.nowBlockSet.x -= 1;
          }
        }
    });
  }
  searchFullLine(){
    var fullLine = [];
    for (let y = 0; y < this.meshNumberY; y++){
      var isfullLine = true;
      for (let x = 0; x < this.meshNumberX; x++){
        if(this.stage[x][y]==0){
          isfullLine = false;
          break;
        }
      }
      if(isfullLine){
        fullLine.push(y);
      }
    }
    return fullLine
  }
  canMoval(block){
    for (let i = 0; i < block.block.length; i++) {

      var compareBlock = [block.block[i][0] + block.x, block.block[i][1] + block.y]
      if(compareBlock[0] < 0 || compareBlock[0] >= this.meshNumberX){
        return false
      }
      if(compareBlock[1] >= this.meshNumberY){
        return false
      }
      if(compareBlock[1] < 0){
        continue
      }
      if(this.stage[compareBlock[0]][compareBlock[1]] != ""){
        return false
      }
    }
    return true
  }
  showGhostBlock(){
    var i = 1;
    while(this.canMoval(this.nowBlockSet.translate(0,i))){
      i++;
    }
    i--;
    var ghost = this.nowBlockSet.translate(0,i)
    ghost.color = '#9193a0';
    this.drawBlockSet(ghost)
  }

  getCanvesPoint(x, y){
    return [x*this.blockWidth, y*this.blockHeight]
  }
  newBlockSet(){
    this.nowBlockSet = new BlockSet(this, Math.floor(Math.random()*8))
    this.nowBlockSet.x = this.meshNumberX/2;
  }
  drawStage() {
    var ctx = this.canvas.getContext('2d')
    for(let y=0; y < this.meshNumberY; y++){
      for (let x=0; x < this.meshNumberX; x++){
        const canvasPoint = this.getCanvesPoint(x, y)
        if ( this.stage[x][y] != "" ){
          ctx.fillStyle = this.stage[x][y]
          ctx.fillRect(canvasPoint[0], canvasPoint[1], this.blockWidth, this.blockHeight)
        }
      }
    }
  }
  drawBlockSet(block) {
    var ctx = this.canvas.getContext('2d')
    for (let i=0; i < block.block.length; i++){
      const canvasPoint = this.getCanvesPoint(block.block[i][0]+block.x, block.block[i][1]+block.y)
      ctx.fillStyle = block.color
      ctx.fillRect(canvasPoint[0], canvasPoint[1], this.blockWidth, this.blockHeight)
    }
  }
  fixedBlockSet() {
    for (let i=0; i < this.nowBlockSet.block.length; i++){
      var fixedBlockPoint = this.nowBlockSet.block[i]
      this.stage[fixedBlockPoint[0]+this.nowBlockSet.x][fixedBlockPoint[1] + this.nowBlockSet.y] = this.nowBlockSet.color
    }
  }
  render(){
    this.frameNumber += 1;
    if(this.frameNumber%6==0){
      this.frameNumber = 0;
      if(this.canMoval(this.nowBlockSet.translate(0,1))){
        this.nowBlockSet.y += 1;
      }else{
        if(this.nowBlockSet.y == 0){
          clearInterval(this.timerID)
          return
        }
        this.fixedBlockSet()
        var fullLine = this.searchFullLine()
        fullLine.sort((a,b)=>{return b-a})
        console.log(fullLine)
        for(let [i, v] of fullLine.entries()){
          for(var x = 0; x < this.meshNumberX; x++){
            this.stage[x][v] = 0;
            this.stage[x].splice(v,1)
          }
        }
        console.log(this.stage)
        if(fullLine.length != 0){
          for(var x = 0; x < this.meshNumberX; x++){
            var newArray  = new Array(fullLine.length).fill("")
            this.stage[x] = newArray.concat(this.stage[x])
          }
        }
        console.log(this.stage)
        this.newBlockSet()
      }
    }
    if(this.canvas.getContext) {
      var ctx = this.canvas.getContext('2d')
      ctx.fillStyle = 'rgb(204,204,204)'
      ctx.fillRect(0, 0, this.width, this.height)
      this.drawStage()
      this.showGhostBlock();
      this.drawBlockSet(this.nowBlockSet)
    }
  }
}
game = new GameController()
game.render()
