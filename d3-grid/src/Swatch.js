import React from 'react'
import Box from '@material-ui/core/Box'


function Swatch(props) {   
    return <Box 
        justifyContent="center"
        alignItems= "center"
        display= "flex"
        margin={0.5} 
        marginBottom={2} 
        bgcolor={arrayToRGBA(props.color)} 
        width={40} 
        height={40}    
        fontSize={8}
        >
        {RGBAToHex(props.color)}
        </Box>;
}

//Convert from rgb to hex values
function RGBAToHex(rgb) {
    if(!rgb) return ""
    var r = rgb[0].toString(16);
    var g = rgb[1].toString(16);
    var b = rgb[2].toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
}

function arrayToRGBA(colors){
    if(!colors) return null
    
    var r = colors[0]
    var g = colors[1]
    var b = colors[2]
    var a = 255

    return "rgba(" + r + "," + g+ "," + b+ "," + a + ")"
}

export default Swatch