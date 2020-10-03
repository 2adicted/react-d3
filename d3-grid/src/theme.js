import { createMuiTheme } from '@material-ui/core'
import { red, lime, grey } from '@material-ui/core/colors'

const theme = createMuiTheme({
    palette:{
        primary:{
            main: red[300],            
        },
        secondary:{
            main: lime[300],
            contrastText: red[900]
        }
    }
})

theme.props={
    MuiButton:{
        disableElevation: true
    },
    MuiInputLabel:{
        shrink: true
    },
    MuiInput:{
        disableUnderline: true
    }
}

theme.overrides = {
    MuiButton:{
        root:{
            borderRadius: 5,
            textTransform: "none"
        },
        containedPrimary:{
            "&:hover":{
                backgroundColor: lime[600],
                color: red[900]
            }
        },
        containedSecondary:{
            fontWeight: 700
        }
    },
    MuiOutlinedInput:{
        root:{
            marginBottom: 20,
        },
    },
    MuiInput:{
        root:{
            top: theme.spacing(1),
            border: `1px solid ${grey[500]}`,
            outline: `1px solid transparent`,
            padding: theme.spacing(1),
            "&$focused":{
                border: `1px solid ${theme.palette.primary.main}`,
                outline: `1px solid ${theme.palette.primary.main}`,
            },
        },
        MuiInputLabel:{
            outlined: {
                textTransform: 'uppercase',
                fontSize: '1.5rem',
            }
        }
    }
}

export default theme