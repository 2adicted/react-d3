import React, { useRef, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { grey } from '@material-ui/core/colors'
import { Button, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { spacing } from '@material-ui/system'


class Canvas extends React.Component {  
  constructor(){
    super()    
    this.canvas = React.createRef()
    this.image = React.createRef()
    this.state = {
      canvasWidth: 401,
      canvasHeight: 401,
      gridWidth: 80,
      gridHeight: 80,
      gridRes: 10,
      picture: "https://i.ytimg.com/vi/wvCGaWXr8Qk/sddefault.jpg",
      imgData: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSizeChange = this.handleSizeChange.bind(this)
    this.handleGridSizeChange = this.handleGridSizeChange.bind(this)
    this.handleGridResChange = this.handleGridResChange.bind(this)
  }

  handleSizeChange(event){
    const {value, name} = event.target
    this.setState({
      [name === "width" ? "canvasWidth" : "canvasHeight"] : value
    })
  }

  handleGridSizeChange(event){
    const {value, name} = event.target
    this.setState({
       gridWidth: value,
       gridHeight: value
    })
  }

  handleGridResChange(event){
    const {value, name} = event.target
    this.setState({
       gridRes: value
    })
  }

  componentDidUpdate(){    
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')
    
    ctx.putImageData(this.state.imgData, 0, 0)       
    this.drawGrid()
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
      const data = ctx.getImageData(0,0,this.state.canvasWidth, this.state.canvasHeight)

      this.setState({
        picture: img,        
        imgData: data,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })
      DOMURL.revokeObjectURL(url)
      this.drawGrid()
    }
  }

  componentDidMount(){
    this.drawGrid()
  }  

  drawGrid(){
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')
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
      return(        
        <Grid container spacing={2}>
          <Grid item xs={3}>
          <Box 
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            padding={1} 
            border={1} 
            borderColor="grey.200" 
            borderRadius={10} 
            height={this.state.canvasHeight}>
              <TextField 
                id="canvas-width"
                type="number" 
                label="Canvas width"
                variant="outlined"
                color="primary"
                value={this.state.canvasWidth}
                onChange={this.handleSizeChange}
                /> 
              <TextField 
                id="canvas-height"
                type="number" 
                label="Canvas height"
                variant="outlined"
                color="primary"
                value={this.state.canvasHeight}
                onChange={this.handleSizeChange}
                /> 
              <TextField 
                id="grid-width"
                type="number" 
                label="Grid size"
                variant="outlined"
                color="primary"
                value={this.state.gridWidth}
                onChange={this.handleGridSizeChange}
                /> 
              <TextField 
                id="grid-res"
                type="number" 
                label="Grid squares per inch"
                variant="outlined"
                color="primary"
                value={this.state.gridRes}
                onChange={this.handleGridResChange}
                />       
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
            </Box>
          </Grid>
          <Grid item xs={9}>
          <Box 
            p={1} 
            border={1} 
            borderColor="grey.200" 
            borderRadius={10} 
            height={this.state.canvasHeight}>
              <canvas 
                ref={this.canvas} 
                width={this.state.canvasWidth} 
                height={this.state.canvasHeight} />
              <img 
                ref={this.image} 
                src={this.state.picture} 
                style={hidden} />
              </Box>
          </Grid>        
        </Grid>
      )
    }
  }

export default Canvas