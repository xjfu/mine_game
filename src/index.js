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


const MODE = [
    EASY,
    MEDIUM,
    HARD,
]


const boardStyle = (row) => ({
    width: `${row * (30 + 4)}px`,
})





class App extends React.Component {
    state = {
        row: EASY,
        column: EASY,
        isGameOver: false,
        blocks: [],
        message: '^_^',
        className: 'square',
        mineNum: MineNum,

        checkClass: Array(64).fill(false),
        m: Array(64).fill("m_0"),
        // isRoot:Array(64).fill(false),
        click: false,
        rightClick: false,
        win: false,
        
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
            mineNum,
        } = this.state
        const blockIdx = []
        const blockNum = row * column
        for (let i = 0; i < blockNum; i++) {
            if (i < mineNum) {
                blockIdx.push(9)
            } else {
                blockIdx.push(0)
            }
        }

        
        //地雷随机分布

        this.randomShuffe(blockIdx) 

        // 每个blocks 数字
        this.arrayEnd(blockIdx) 

        // block 变成对象类型
        // const position = []
        
        const bs = blockIdx.map((value, idx)=>({
            isShow: false,
            isRoot: 0,
            value:value,
            className:'square',
            // m: 'm_0',
            idx: idx,
            itemFlag: false,
            clickType: 0,
            // position:getPosition(idx),
        }))
        
        // 存入state
        this.setState({
            blocks:bs,
        })
    }

    addOne(blocks, x, y) { 
        const {row, column} = this.state
        const pos = [
            [x-1, y-1],
            [x-1, y],
            [x-1, y+1],
            [x, y-1],
            [x, y+1],
            [x+1, y-1],
            [x+1, y],
            [x+1, y+1],
        ]
        for (let i = 0; i < pos.length; i++) {
            let r = pos[i][0]
            let c = pos[i][1]
            
            if(r >=0 && c >=0 && r<row && c <column) {
                let idx = this.getIdx(r, c)
                if(blocks[idx] !== 9) {
                    blocks[idx] += 1
                    
                }
            }
        }
        // for (let index = 0; index < array.length; index++) {
        //     const element = array[index];
            
        // }
        // if(row-1>=0 && column-1 >=0) {
        //     let idx = (row - 1) * 8 + column - 1
        //     if(blocks[idx] != 9) {
        //         blocks[idx] += 1
        //     }
        // } 
        //  if(row-1 >=0 && column >=0) {
        //     let idx = (row - 1) * 8 + column
        //     if(blocks[idx] != 9)
        //     blocks[idx] += 1
        // } 
        //  if(row-1 >=0 && column+1 <8) {
        //     let idx = (row - 1) * 8 + column + 1
        //     if(blocks[idx] != 9)
        //     blocks[idx] += 1
        // } 
        //  if(row >=0 && column-1 >=0) {
        //     let idx = (row) * 8 + column - 1
        //     if(blocks[idx] != 9)
        //     blocks[idx] += 1
        // } 
        //  if(row >=0, column+1 < 8) {
        //     let idx = (row) * 8 + column + 1
        //     if(blocks[idx] != 9)
        //     blocks[idx] += 1
        // } 
        //  if(row+1 <8 && column-1 <8) {
        //     let idx = (row + 1) * 8 + column - 1
        //     if(blocks[idx] != 9)
        //     blocks[idx] += 1
        // } 
        //  if(row+1 <8 && column >=0) {
        //     let idx = (row + 1) * 8 + column
        //     if(blocks[idx] != 9)
        //     blocks[idx] += 1
        // } 
        //  if(row+1 < 8 && column+1 <8) {
        //     let idx = (row + 1) * 8 + column + 1
        //     if(blocks[idx] != 9)
        //     blocks[idx] += 1
        // }
        
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

  
    getNine(x, y, idx) {

        // const {x, y} = this.getRowColumn(idx)
        const {row, column} = this.state
        const {blocks} = this.state
        const pos = [
            [x-1, y-1],
            [x-1, y],
            [x-1, y+1],
            [x, y-1],
            [x, y+1],
            [x+1, y-1],
            [x+1, y],
            [x+1, y+1],
        ]
        for (let i = 0; i < pos.length; i++) {
            let r = pos[i][0]
            let c = pos[i][1]
            if(r >=0 && c >=0 && r<row && c <column) {
                let idx = this.getIdx(r, c)
                if(blocks[idx].value == 0 && blocks[idx].isShow==false) {
                    // const {x, y} = this.getRowColumn(idx)
                    this.mineReturn(r, c)
                } else if (blocks[idx].value == 9 && blocks[idx].isShow == false) {
                    for (let i = 0; i < blocks.length; i++) {
                        blocks[i].isShow = true
                        if (blocks[i].value == 0) {
                            blocks[i].className = 'square m_10'
                        } else {
                            blocks[i].className = 'square m_'+blocks[i].value
                        }
                    }
                    this.setState({blocks})
                    return
            
                } else if(blocks[idx].isShow == false){
                    blocks[idx].isShow = true
                    blocks[idx].className = 'square m_'+blocks[idx].value
                    blocks[idx].itemFlag = false
                    this.setState({blocks})
                }
                

               
            } 
        }

  
    }

    changeNine(x, y, idx) {
        
        // const {x, y} = this.getRowColumn(idx)
        const {row, column} = this.state
        const {blocks} = this.state
        let count = 0
        const pos = [
            [x-1, y-1],
            [x-1, y],
            [x-1, y+1],
            [x, y-1],
            [x, y+1],
            [x+1, y-1],
            [x+1, y],
            [x+1, y+1],
        ]

        for (let i = 0; i < pos.length; i++) {
            let r = pos[i][0]
            let c = pos[i][1]
            if(r >=0 && c >=0 && r<row && c <column) {
                // 满足条件
                let idx = this.getIdx(r, c)
                if(blocks[idx].itemFlag === true) {
                    count += 1
                }
            } 
        }
        return count
        
    }

    
    getIdx(x, y) {
        const {row} = this.state
        const idx = x * row + y
        return idx
    }
    
    mineReturn(x, y) {
        const {blocks} = this.state
        const {row, column} = this.state
        const idx = this.getIdx(x, y)
        if (x < 0 || y >= column || x >= row || y < 0 ) {
            return 
        } else if(blocks[idx].isRoot === 0 && blocks[idx].value != 9){
            blocks[idx].isShow = true
            blocks[idx].isRoot = 1
            if(blocks[idx].value !== 0) {
                
                blocks[idx].className = 'square m_'+blocks[idx].value
                blocks[idx].itemFlag = false
                // this.setState({blocks})
                return 
            } else if(blocks[idx].value === 0){
                blocks[idx].className = 'square m_10'
                blocks[idx].itemFlag = false

                // this.setState({blocks})
                this.mineReturn(x-1, y)
                this.mineReturn(x+1, y)
                this.mineReturn(x, y-1)
                this.mineReturn(x, y+1)
                this.mineReturn(x-1, y+1)
                this.mineReturn(x+1, y+1)
                this.mineReturn(x+1, y-1)
                this.mineReturn(x-1, y-1)
            }
        }
        
        // this.state.checkClass[idx] = true
    
    }

    getRowColumn(idx) {
        const {row} = this.state
        const x = Math.floor(idx / row)
        const y = Math.floor(idx % row)
        return {x, y}
    }

    positionMine(idx) {
        
        const {blocks} = this.state

        
        if(blocks[idx].value === 0) {

            const {x, y} = this.getRowColumn(idx)

            blocks[idx].isShow = true
            blocks[idx].className = 'square m_10'
            blocks[idx].item = false
            this.setState({blocks})
            this.mineReturn(x, y)
            
        } else if(blocks[idx].value == 9) {
            // 点击到雷
            
            // blocks[idx].m = 'm_9'
            // this.state.checkClass = Array(64).fill(true)
            // this.setState({blocks})
            for (let i = 0; i < blocks.length; i++) {
                blocks[i].isShow = true
                if (blocks[i].value == 0) {
                    blocks[i].className = 'square m_10'
                } else {
                    blocks[i].className = 'square m_'+blocks[i].value
                }
            }
            this.setState({blocks})
            return
             
        } else {
            blocks[idx].isShow = true
            blocks[idx].className = 'square m_'+blocks[idx].value
            blocks[idx].itemFlag = false
            this.setState({blocks})
        }
        
    }

    handleClick(item, idx) {
        // 添加class
        // 设置定时器
        // let {click} = this.state
        const {blocks} = this.state

        blocks[idx].clickType = 1
        setTimeout(()=>{
            blocks[idx].clickType = 0
        }, 500)
        
        // log('block[idx]', blocks[idx].clickType)
        
        // if(blocks[idx].clickType == 1) {
        //     const {x, y} = this.getRowColumn(idx)
        //     let c = this.changeNine(x, y, idx)
        //     if(c === item.value) {
        //         // 周围的旗子数量与中间数字相等,翻开其它未显示的
                
        //         this.getNine(x, y, idx)
        //     }
        // }
        // const {row, column} = this.state
        // const {x, y} = this.getRowColumn(idx)
            
        this.positionMine(idx)
    
    }

    handleBlockMark(e, item, idx) {
        // const {checkClass} = this.state
        e.preventDefault()
        const {blocks} = this.state
        
        

        // blocks[idx].clickType += 1
        // setTimeout(()=>{
        //     blocks[idx].clickType = 0
        // }, 1000)
        log('block[idx]', blocks[idx].clickType)
        if(blocks[idx].clickType == 1) {
            const {x, y} = this.getRowColumn(idx)
            let c = this.changeNine(x, y, idx)
            
            if(c === item.value) {
                // 周围的旗子数量与中间数字相等,翻开其它未显示的

                this.getNine(x, y, idx)
            }
        } else if(blocks[idx].isShow == false){
            blocks[idx].isShow = true   
            blocks[idx].itemFlag = true
            blocks[idx].className = "square m_11"
            
            this.setState({blocks})   
        }
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
                            <button className={item.isShow ? item.className: 'square m_0'} 
                            key={idx} 
                            value = {item.value}
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