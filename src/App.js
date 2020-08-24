import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';


const log = console.log.bind(console)

const EASY = 8
const MEDIUM = 12
const HARD = 16
const MineNum = 10

const Mode = [
    EASY, 
    MEDIUM,
    HARD,
]


const boardStyle = (row) => ({
    width: `${row * (30 + 4)}px`,
})

const getRowColumn = function(idx) {
    const row = Math.floor(idx / 8)
    const column = Math.floor(idx % 8)
    return {row, column}
}

const getIdx = function(row, column) {
    const idx = row * 8 + column
    return idx
}

class App extends React.Component {
    state = {
        row: EASY,
        column: EASY,
        isGameOver: false,
        blocks: [],
        mineNum: MineNum,
        className: 'square',
        checkClass: Array(64).fill(false),
        m: Array(64).fill("m_0"),
        isRoot:Array(64).fill(false),
        click: false,
    }
    componentDidMount () {
        this.setUp()
    }

    addOne(blocks, row, column) {    
        const maxRow = this.state.row
        const maxColumn = this.state.column
        if(row-1>=0 && column-1 >=0) {
            let idx = (row - 1) * 8 + column - 1
            if(blocks[idx] != 9) {
                blocks[idx] += 1
            }
        } 
         if(row-1 >=0 && column >=0) {
            let idx = (row - 1) * 8 + column
            if(blocks[idx] != 9)
            blocks[idx] += 1
        } 
         if(row-1 >=0 && column+1 <8) {
            let idx = (row - 1) * 8 + column + 1
            if(blocks[idx] != 9)
            blocks[idx] += 1
        } 
         if(row >=0 && column-1 >=0) {
            let idx = (row) * 8 + column - 1
            if(blocks[idx] != 9)
            blocks[idx] += 1
        } 
         if(row >=0, column+1 < 8) {
            let idx = (row) * 8 + column + 1
            if(blocks[idx] != 9)
            blocks[idx] += 1
        } 
         if(row+1 <8 && column-1 <8) {
            let idx = (row + 1) * 8 + column - 1
            if(blocks[idx] != 9)
            blocks[idx] += 1
        } 
         if(row+1 <8 && column >=0) {
            let idx = (row + 1) * 8 + column
            if(blocks[idx] != 9)
            blocks[idx] += 1
        } 
         if(row+1 < 8 && column+1 <8) {
            let idx = (row + 1) * 8 + column + 1
            if(blocks[idx] != 9)
            blocks[idx] += 1
        }
        
    }

    arrayEnd(blocks){
        const row = 8
        const column = 8
        for (let i = 0; i < row * column; i++) {
            if(blocks[i] == 9) {
                const row =  Math.floor(i / 8)
                const column = Math.floor(i % 8)
                this.addOne(blocks, row, column)
            }
            
        }
        
    }

    randomShuffe(input) {
        for (var i = input.length-1; i >=0; i--) {
            var randomIndex = Math.floor(Math.random()*(i+1));
            var itemAtIndex = input[randomIndex];
    
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        
    }
    
    setUp() {
        const {
            row,
            column,
            blocks,
            className,
            mineNum,
        } = this.state
        const blockIdx = []
        
        const blockNum = row * column
        for (let index = 0; index < blockNum; index++) {
            if(index < 10) {
                blockIdx.push(9)
            } else {
                blockIdx.push(0)
            }
        }
        // 随机地雷
        this.randomShuffe(blocks)

        // 设置数组数字
        this.arrayEnd(blocks)
        this.setState({
            blocks,
        })
    }


    mReturn(row, column, isRoot) {
        // const state = this.state
        // const m = this.m
        // const blocks = this.blocks
        
        // const {blocks} = this.state
        // const {m} = this.state
        // const {checkClass} = this.state
        const idx = row * 8 + column
        
        
        if (row < 0 || column >= 8 || row >= 8 || column < 0 ) {
            return 
        } else if(isRoot[idx] == false && this.state.blocks[idx] != 9){
            isRoot[idx] = true
            if(this.state.blocks[idx] != 0) {
                this.state.checkClass[idx] = true
                this.state.m[idx] = 'm_'+ this.state.blocks[idx]
                return 
            } else if(this.state.blocks[idx] == 0){
                this.state.checkClass[idx] = true
                this.state.m[idx] = 'm_10'
                this.mReturn(row-1, column, isRoot)
                this.mReturn(row+1, column, isRoot)
                this.mReturn(row, column-1, isRoot)
                this.mReturn(row, column+1, isRoot)
                this.mReturn(row-1, column+1, isRoot)
                this.mReturn(row+1, column+1, isRoot)
                this.mReturn(row+1, column-1, isRoot)
                this.mReturn(row-1, column-1, isRoot)
            }
            
        }
        
        // this.state.checkClass[idx] = true
    
    }
   

    handleClick(item, idx) {
        // 添加class
        const {blocks} = this.state
        const {m} = this.state
        const {checkClass} = this.state    
        // 设置定时器
        this.state.click = true
        setTimeout(()=>{
            this.state.click = false
        }, 1000)

        if(blocks[idx] == 0) {
            
            const row = Math.floor(idx / 8)
            const column = Math.floor(idx % 8)
            this.state.checkClass[idx] = true
            this.state.m[idx] = 'm_10'
            this.mReturn(row, column, this.state.isRoot)
        } else if(blocks[idx] == 9) {
            this.state.checkClass = Array(64).fill(true)
            this.setState({blocks})
            for (let i = 0; i < this.state.m.length; i++) {
                
                if (blocks[i] == 0) { //递归翻
                    this.state.m[i] = 'm_10'
                } else {
                    this.state.m[i] = 'm_' + blocks[i]
                }
            }
            return 
        } else {
            this.state.checkClass[idx] = true
            this.state.m[idx] = 'm_' + blocks[idx]
        }

        this.setState({m, blocks, checkClass})
        
        
        
    }

    changeNine(row, column, idx) {
        let count = 0
        if(row-1>=0 && column-1 >=0) {
            let idx = getIdx(row-1, column-1)
            if(this.state.m[idx] == 'm_11') {
                count += 1
            }
        } 
        if(row-1 >=0 && column >=0) {
            let idx = getIdx(row-1, column)
            if(this.state.m[idx] == 'm_11') {
               
                count += 1
            }
        } 
        if(row-1 >=0 && column+1 <8) {
            let idx = getIdx(row-1, column+1)
            if(this.state.m[idx] == 'm_11') {
               
                count += 1
            }        } 
        if(row >=0 && column-1 >=0) {
            let idx = getIdx(row, column-1)
            if(this.state.m[idx] == 'm_11') {
               
                count += 1
            }        } 
        if(row >=0, column+1 < 8) {
            let idx = getIdx(row, column+1)
            if(this.state.m[idx] == 'm_11') {
               
                count += 1
            }        } 
        if(row+1 <8 && column-1 <8) {
            let idx = getIdx(row+1, column-1)
            if(this.state.m[idx] == 'm_11') {
               
                count += 1
            }        } 
        if(row+1 <8 && column >=0) {
            let idx = getIdx(row+1, column)
            if(this.state.m[idx] == 'm_11') {
               
                count += 1
            }        } 
        if(row+1 < 8 && column+1 <8) {
            let idx = getIdx(row+1, column+1)
            if(this.state.m[idx] == 'm_11') {
               
                count += 1
            }        
        }
        return count

    }

    zeroNumberIdx(idx) {
        if(this.state.checkClass[idx] == false) {
            this.state.checkClass[idx] = true
            if(this.state.blocks[idx] == 0) {
                this.state.m[idx] = "m_10"
                this.state.checkClass[idx] = true

            } else {
                this.state.m[idx] = "m_" + this.state.blocks[idx]
                this.state.checkClass[idx] = true
            }
                
        }
    }

    getNine(row, column, idx) {
        if(row-1>=0 && column-1 >=0) {
            let idx = getIdx(row-1, column-1)
            
        } 
        if(row-1 >=0 && column >=0) {
            let idx = getIdx(row-1, column)
            this.zeroNumberIdx(idx)
        } 
        if(row-1 >=0 && column+1 <8) {
            let idx = getIdx(row-1, column+1)
            this.zeroNumberIdx(idx)

        }

        if(row >=0 && column-1 >=0) {
            let idx = getIdx(row, column-1)
            this.zeroNumberIdx(idx)

        }
        if(row >=0, column+1 < 8) {
            let idx = getIdx(row, column+1)
            this.zeroNumberIdx(idx)

        }
        if(row+1 <8 && column-1 >=0) {
            let idx = getIdx(row+1, column-1)
            this.zeroNumberIdx(idx)

        }
        if(row+1 <8 && column >=0) {
            let idx = getIdx(row+1, column)
            this.zeroNumberIdx(idx)
        }
        if(row+1 < 8 && column+1 <8) {
            let idx = getIdx(row+1, column+1)
            this.zeroNumberIdx(idx)
        }
    }

    handleBlockMark(e, item, idx) {
        e.preventDefault()
        const {row, column} = getRowColumn(idx)

        if(this.state.click == true) {
            // 执行翻雷
            // 
            // 四周红旗的数量
            let c = this.changeNine(row, column, idx)
            
            if(c == this.state.blocks[idx]) {
                this.getNine(row, column, idx)
            } else {
                // 点击有样式松开无样式
            }

        }
        const {blocks} = this.state
        this.setState({blocks})
        if(this.state.checkClass[idx] == true) {
               
        } else {
            this.state.m[idx] = "m_11"
            this.state.checkClass[idx] = true   
        }
        
    }
    
    render() {
        const {blocks} = this.state
        return (
            <div className="App">
                <div className="game-board">
                    {/* <Board squares={this.squares} onClick={(i)=>this.handleClick(i)} /> */}
                    <div className="board-row" style={boardStyle(8)}>
                        {/* 循环 */}
                        {blocks.map((item, idx) => (
                            <button className={this.state.checkClass[idx]? 'square '+this.state.m[idx]: this.state.className+' m_0'} 
                            key={idx} 
                            
                            onClick={()=>this.handleClick(item, idx)} 
                            onContextMenu={(e)=>this.handleBlockMark(e, item, idx)}></button>
                        ))}
                    </div>
                </div>
            </div>
          );              
    }
}

ReactDOM.render(
//   <React.StrictMode>
    <App />,
//   </React.StrictMode>,
  document.getElementById('root')
);