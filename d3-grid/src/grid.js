import React, {Component} from "react"
import * as d3 from "d3"

class Grid extends Component{
    
    constructor(props){
        super(props)
        this.myRef = React.createRef()
        this.state = {
            picture: "https://i.ytimg.com/vi/wvCGaWXr8Qk/sddefault.jpg",
            height: 400,
            imageStatus: "no image"}
        this.handleChange = this.handleChange.bind(this)
        this.handleChange2 = this.handleChange2.bind(this)
    }

    handleChange(event){
        this.setState({
            picture: URL.createObjectURL(event.target.files[0])
        })
    }

    handleChange2(event){
        this.setState({height: event.target.value})
        document.getElementById('myImage').height = event.target.value
    }

    handleImageLoaded(){
        // const image = document.getElementById('myImage')
        // this.setState({
        //     height: image.height
        // })
        this.setImageHeight()
        URL.revokeObjectURL(this.src)
        this.setState({ imageStatus: "loaded" })
    }

    handleImageErrored() {
        this.setState({ imageStatus: "failed to load" })
    }

    setImageHeight()
    {
        document.getElementById('myImage').height = this.state.height
    }

    componentDidMount(){    
        const xStepsBig = d3.range(10, this.props.width, 20),
            yStepsBig = d3.range(10, this.props.height, 20),
            xStepsSmall = d3.range(0, this.props.width + 6, 6),
            yStepsSmall = d3.range(0, this.props.height + 6, 6)

        const line = d3.line()

        const svg = d3.select(this.myRef.current)
            .append("svg")  
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .attr("transform", "translate(-.5,-.5)")
            .style("background", 'url(' + this.state.picture + ') no-repeat')
            .style("opacity", 0.5)
            .style("padding", 10)
            .style("margin-left", 50)

        svg.selectAll(".x")
            .data(xStepsBig)
            .enter().append("path")
            .attr("class", "x")
            .datum(function(x) { return yStepsSmall.map(function(y) { return [x, y]; }); });

        svg.selectAll(".y")
            .data(yStepsBig)
            .enter().append("path")
            .attr("class", "y")
            .datum(function(y) { return xStepsSmall.map(function(x) { return [x, y]; }); });

        const path = svg.selectAll("path")
            .attr("d", line)        
    }

    render(){
        return( 
            <div>
                <label for="selectedFile">
                    <input 
                        type="file" 
                        id="selectedFile" 
                        style={{display: "none"}} 
                        onChange={this.handleChange} /> 
                        Browse...
                </label>
                <br/>
                <p>Image height: {this.state.height}</p>
                <p>{this.state.imageStatus}</p>
                <label>                    
                    <input 
                        className="heightInput"
                        type="number" 
                        name="height" 
                        onChange={this.handleChange2} 
                        value={this.state.height}/>
                    Image height 
                </label>
                <br/>                
                <img 
                    id="myImage" 
                    src={this.state.picture} 
                    onLoad={this.handleImageLoaded.bind(this)}
                    onError={this.handleImageErrored.bind(this)}
                    />
                <div ref={this.myRef}></div> 
            </div>
        ) 
    }
}

export default Grid