import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';


const log = console.log.bind(console)

// const MODE = [
//     EASY,
//     MEDIUM,
//     HARD,
// ]
  
const mReturn = function(m, state,blocks, row, column) {
    // row = Math.floor(row)
    // column = Math.floor(column)
    const idx = row * 8 + column
    if (row < 0 || column >= 8 || row >= 8 || column < 0) {
        return 0
    } else if(state[idx] == true) {
        return 0    
    } else if(blocks[idx] != 9){
        if(m[idx] != 0) {
            m[idx] = 'm_'+ blocks[idx]
        } else {
            m[idx] = 'm_10'
        }
        state[idx] = true
        
        // m[idx] = 'm_'+blocks[idx]
        // log(state)
        mReturn(m, state,blocks, row+1, column)
        mReturn(m,state, blocks,row-1, column)
        mReturn(m,state, blocks, row, column+1)
        mReturn(m,state, blocks, row, column+1)
    }
}

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
        row: 8,
        column: 8,
        isGameOver: false,
        blocks: [],
        message: '^_^',
        className: 'square',
        checkClass: Array(64).fill(false),
        m: Array(64).fill("m_0"),
        isRoot:Array(64).fill(false),
        click: false,
        rightClick: false,
        win: false,
        position:[]
    }
   
    componentDidMount () {
        this.setUp()
    }
    setUp() {
        const {
            row,
            column,
            blocks,
            className,
        } = this.state
        for (let index = 0; index < row*column; index++) {
            if(index < 10) {
                blocks.push(9)
            } else {
                blocks.push(0)
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

    addOne(blocks, row, column) {    
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
    

    mReturn(row, column, isRoot) {
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
            
            if(this.state.blocks[idx] == 0) {

                this.state.m[idx] = "m_10"
                this.state.checkClass[idx] = true
                this.zeroReturn(idx)
            } else {
                this.isMine(idx)
                this.state.m[idx] = "m_" + this.state.blocks[idx]
                this.state.checkClass[idx] = true
            }
                
        }
    }

    zeroReturn(idx) {
        const {row, column} = getRowColumn(idx)
        this.mReturn(row, column, this.state.isRoot)        
    }

    getNine(row, column, idx) {
        if(row-1>=0 && column-1 >=0) {
            let idx = getIdx(row-1, column-1)
            this.zeroNumberIdx(idx)
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
    isMine(idx) {
        const {blocks} = this.state
        const {m} = this.state
        const {checkClass} = this.state    
        let {win} = this.state

        
        if(blocks[idx] == 0) {
            
            const row = Math.floor(idx / 8)
            const column = Math.floor(idx % 8)
            if(this.state.click || this.state.rightClick) {
            
                let c = this.changeNine(row, column, idx)
                
                if(c == this.state.blocks[idx]) {
                    this.getNine(row, column, idx)
                    
                } else {
                    // 点击松开样式
                }
    
            }
            

            this.state.checkClass[idx] = true
            m[idx] = 'm_10'
            this.mReturn(row, column, this.state.isRoot)
            
        } else if(blocks[idx] == 9) {
            // this.state.checkClass[idx] = true
            m[idx] = 'm_9'
            this.state.checkClass = Array(64).fill(true)
            // this.setState({blocks})
            for (let i = 0; i < m.length; i++) {
                
                if (blocks[i] == 0) {
                    m[i] = 'm_10'
                } else {
                    m[i] = 'm_' + blocks[i]
                }
            }
            this.setState({win})
            this.setState({blocks})
            this.setState({m})
            return
             
        } else {
            this.state.checkClass[idx] = true
            m[idx] = 'm_' + blocks[idx]
        }
        this.setState({m, blocks, checkClass})
    }

    handleClick(item, idx) {
        // 添加class
        // 设置定时器
        this.state.click = true
        setTimeout(()=>{
            this.state.click = false
        }, 1000)
        
        const {row, column} = getRowColumn(idx)
        if(this.state.click && this.state.rightClick) {
            
            let c = this.changeNine(row, column, idx)
            
            if(c == this.state.blocks[idx]) {
                this.getNine(row, column, idx)
            } else {
                // 点击有样式松开无样式
            }

        }

        // 判断idx位置是不是雷
        this.isMine(idx)
        
    }

    handleBlockMark(e, item, idx) {
        const {checkClass} = this.state
        e.preventDefault()
        const {row, column} = getRowColumn(idx)

        this.state.rightClick = true
        setTimeout(()=>{
            this.state.rightClick = false
        }, 1000)

        if(this.state.click && this.state.rightClick) {
            
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
        // 赢了
        
        // log('checkClass', checkClass)
    }
    


    render() {
        const {blocks} = this.state
        return (
            <div className="App">
                <div className="game-board">
                    {/* <Board squares={this.squares} onClick={(i)=>this.handleClick(i)} /> */}
                    {/* <div className="mode">
                        {Mode.map((item)=>{
                            <button key="item" onClick={()=>this.handleModeClick(item)}>   
                            {`${item} * ${item}`}
                            </button>
                        })}
                    </div> */}
                    <div className="board-row" style={boardStyle(8)}>
                        {/* 循环 */}
                        {blocks.map((item, idx) => (
                            <button className={this.state.checkClass[idx]? 'square '+this.state.m[idx]: this.state.className+' m_0'} 
                            key={idx} 
                            // value = {item}
                            onClick={()=>this.handleClick(item, idx)} 
                            onContextMenu={(e)=>this.handleBlockMark(e, item, idx)}></button>
                        ))}
                    </div>
                    <div>
                        
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