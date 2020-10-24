import React, { useRef, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { grey } from '@material-ui/core/colors'
import { Button, Paper, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { spacing } from '@material-ui/system'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'


export const defaultDrawerWidth = 500
const minDrawerWidth = 50
const maxDrawerWidth = 1000

const styles = theme => ({
  drawer: {
    flexShrink: 0,
    width: defaultDrawerWidth
  },
  toolbar: theme.mixins.toolbar,
  dragger: {
    width: "5px",
    cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "1px solid #ddd",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "#f4f7f9"
  }
})

class Canvas extends React.Component {  
  constructor(){
    super()    
    this.canvas = React.createRef()
    this.secondCanvas = React.createRef()
    this.image = React.createRef()
    this.state = {
      canvasWidth: 401,
      canvasHeight: 401,
      gridWidth: 80,
      gridHeight: 80,
      gridRes: 10,
      picture: "https://i.ytimg.com/vi/wvCGaWXr8Qk/sddefault.jpg",
      imgData: "",
      debug: 80 / 10,
      colors: new Set()
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSizeChange = this.handleSizeChange.bind(this)
    this.handleGridSizeChange = this.handleGridSizeChange.bind(this)
    this.handleGridResChange = this.handleGridResChange.bind(this)
  }

  async handleSizeChange(event){
    const {value, id} = event.target
    var prevWidth, width, prevHeight, height
    prevWidth = width = this.state.canvasWidth
    prevHeight = height = this.state.canvasHeight
    var scaleX = 1.0
    var scaleY = 1.0
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')   
    if(id === "canvas-width")
    {
      width = value
      scaleX = width / prevWidth     
    }
    else{
      height = value
      scaleY = height / prevHeight
    } 
    const imageData = this.state.imgData
    const img = await window.createImageBitmap(imageData,0,0,prevWidth,prevHeight,{ width, height})
    ctx.drawImage(img,0,0,width,height)
    const data = ctx.getImageData(0,0,width,height)   
    this.setState(prevState => ({
      canvasWidth: width,
      canvasHeight: height,
      imgData: data
    }))   
  }

  handleGridSizeChange(event){
    const {value, name} = event.target
    this.setState(prevState => ({
       gridWidth: value,
       gridHeight: value,
      //  debug: value / this.state.gridRes
    }))
  }

  handleGridResChange(event){
    const {value, name} = event.target
    this.setState(prevState => ({
       gridRes: value,
      //  debug: this.state.gridWidth / value
    }))
  }

  handleChange(event){
    const DOMURL = window.URL || window.webkitURL || window
    const img = this.image.current
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')
    const url = DOMURL.createObjectURL(event.target.files[0])
    img.src = url 
    img.crossOrigin = "Anonymous"  
    
    var maxH = 1000 > this.state.canvasWidth ? this.state.canvasWidth : 1000
    var maxW = 1000 > this.state.canvasHeight ? this.state.canvasHeight : 1000

    img.onload  = () => {
      const iw = img.width;
      const ih = img.height;
      
      maxH = 1000 > iw ? iw : 1000
      maxW = 1000 > ih ? ih : 1000

      const scale=Math.min((maxW/iw),(maxH/ih));
      const iwScaled=iw*scale;
      const ihScaled=ih*scale;
      canvas.width=iwScaled;
      canvas.height=ihScaled;
      ctx.drawImage(img,0,0,iwScaled,ihScaled);
      const data = ctx.getImageData(0,0,iwScaled, ihScaled)

      this.setState(prevState => ({
        picture: img,        
        imgData: data,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      }))
      DOMURL.revokeObjectURL(url)
    }
  }

  componentDidUpdate(prevProps, prevState){       
    // after any update
    // 1. draw the grid
    // 2. if we have image data, draw the image
    this.copyPixels()
    // if(typeof(this.state.imgData) === 'object')
    // {
    //   console.log('update + imageData')  
    // } 
    // else{
    //   console.log('update')  
    // }
  } 
  
  componentDidMount(){
    this.drawGrid()
    typeof(this.state.imgData) === 'object' && this.drawImage()  
    console.log('mount')
}  

  drawImage(){
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')
    ctx.putImageData(this.state.imgData, 0, 0)      
    // this.copyPixels()
  }

  copyPixels(){    
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0,0,this.state.imgData.width,this.state.imgData.height)
    
    var data = imageData.data
    const secondCanvas = this.secondCanvas.current
    const ctx2 = secondCanvas.getContext('2d')

    var res = Math.floor(this.state.gridWidth / this.state.gridRes)

    var width = this.state.canvasWidth
    var height = this.state.canvasHeight
    var cellX = 0
    var cellY = 0
    var colorSet = new Set()

    for (var x = 0; x <= width; x++) {
      cellY = 0
      if(x%res === 0) cellX ++
      for (var y = 0; y <= height; y++) {
        if(y%res === 0) 
        {
          cellY ++
          var copy = ((res * cellY) * width + res * cellX) * 4
          colorSet.add([data[copy], data[copy + 1], data[copy + 2]])
        }

        var index = (y * width + x) * 4

        data[index] = data[copy]
        data[index + 1] = data[copy + 1]
        data[index + 2] = data[copy + 2]
      }
    }
    var it = colorSet.values()
    var first = it.next()
    if(this.state.debug !== colorSet.size){
      console.log(colorSet.size)      
      this.drawGrid()
      typeof(this.state.imgData) === 'object' && this.drawImage()    
      this.setState(prevState => ({
        debug: colorSet.size
      }))
    }
    ctx2.putImageData(imageData, 0, 0)
  }
   
  drawGrid(){
    console.log("draw grid")
    const canvas = this.secondCanvas.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,canvas.width, canvas.height)
    const w = this.state.gridWidth
    const h = this.state.gridHeight
    const r = this.state.gridRes
    const ps = "M " + w/r + " 0 L 0 0 0 " + h/r
    const p = "M " + w + " 0 L 0 0 0 " + h

    var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
          <defs> \
              <pattern id="smallGrid" width="'+w/r+'" height="'+h/r+'" patternUnits="userSpaceOnUse"> \
                  <path d="'+p+'" fill="none" stroke="pink" stroke-width="0.5" /> \
              </pattern> \
              <pattern id="grid" width="'+w+'" height="'+h+'" patternUnits="userSpaceOnUse"> \
                  <rect width="'+w+'" height="'+h+'" fill="url(#smallGrid)" /> \
                  <path d="'+p+'" fill="none" stroke="pink" stroke-width="1" /> \
              </pattern> \
          </defs> \
          <rect width="100%" height="100%" fill="url(#grid)" /> \
      </svg>';

    var DOMURL = window.URL || window.webkitURL || window
    
    var imgGrid = new Image()
    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'})
    var url = DOMURL.createObjectURL(svg)
    imgGrid.src = url   

    imgGrid.onload  = () => {
      ctx.drawImage(imgGrid, 0, 0)
      DOMURL.revokeObjectURL(url)
    }
  }
 
  render() {
      const hidden = {
        display: "none"
      }
      const { classes } = this.props     

      return(      
        <div> 
        <Grid container direction="row" spacing={2}>   
          <Grid item xs={3}>
            <Box
              p={1} 
              border={1} 
              borderColor="grey.200" 
              borderRadius={10} 
              minHeight={360}>
              <Grid container direction="column"> 
                <Grid item>
                  <TextField 
                      id="canvas-width"
                      type="number" 
                      label="Canvas width"
                      variant="outlined"
                      color="primary"
                      inputProps={{ step: "5" }}
                      value={this.state.canvasWidth}
                      onChange={this.handleSizeChange}
                    /> 
                </Grid>
                <Grid item>
                  <TextField     
                    id="canvas-height"
                    type="number" 
                    label="Canvas height"
                    variant="outlined"
                    color="primary"
                    inputProps={{ step: "5" }}
                    value={this.state.canvasHeight}
                    onChange={this.handleSizeChange}
                  /> 
                </Grid>
                <Grid item>
                  <TextField 
                    id="grid-width"
                    type="number" 
                    label="Grid size"
                    variant="outlined"
                    color="primary"
                    value={this.state.gridWidth}
                    onChange={this.handleGridSizeChange}
                  /> 
                </Grid>
                <Grid item>
                  <TextField 
                    id="grid-res"
                    type="number" 
                    label="Grid squares per inch"
                    variant="outlined"
                    color="primary"
                    value={this.state.gridRes}
                    onChange={this.handleGridResChange}
                  />    
                </Grid>
                <Grid item>
                  <input 
                      accept="image/*"
                      type="file" 
                      id="selectedFile" 
                      style={{display: "none"}} 
                      onChange={this.handleChange} /> 
                  <label htmlFor="selectedFile">
                    <Button variant="contained" component="span" color="primary">
                      Browse ..
                    </Button>
                  </label> 
                </Grid>  
                <Grid item>
                  <label>{this.state.debug}</label>
                </Grid>
              </Grid>   
            </Box>
          </Grid> 
          <Grid item xs={9} container direction="row">
            <Box 
              p={1} 
              border={1} 
              borderColor="grey.200" 
              borderRadius={10} 
              minHeight={360}>              
                <canvas 
                  ref={this.canvas} 
                  width={this.state.canvasWidth} 
                  height={this.state.canvasHeight} />
                <img 
                  ref={this.image} 
                  src={this.state.picture} 
                  style={hidden} />
            </Box>
            <Box 
              p={1} 
              border={1} 
              borderColor="grey.200" 
              borderRadius={10} 
              minHeight={360}>    
                <canvas 
                  marginLeft={10}
                  ref={this.secondCanvas} 
                  width={this.state.canvasWidth} 
                  height={this.state.canvasHeight} />
              </Box>
          </Grid>   
        </Grid>        
        <Divider style={{marginTop: "20px"}}/> 
        </div>
      )
    }
  }

export default withStyles(styles, { withTheme: true })(Canvas)