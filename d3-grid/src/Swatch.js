import React from 'react'
import Box from '@material-ui/core/Box'



function Swatch(props) {   
    return <Box margin={0.5} marginBottom={2} bgcolor={arrayToRGBA(props.color)} width={20} height={20}></Box>;
}

function arrayToRGBA(colors){
    
    var r = colors[0]
    var g = colors[1]
    var b = colors[2]
    var a = colors[3]

    return "rgba(" + r + "," + g+ "," + b+ "," + a + ")"
}

export default Swatch