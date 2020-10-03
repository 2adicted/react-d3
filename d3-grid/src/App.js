import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Canvas from './Canvas.js'
import theme from './theme'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign:'center',
    color: theme.palette.text.secondary,
  },
}))


function App() {  
  const classes = useStyles()
  
  return (
    <ThemeProvider theme={theme} className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        <Grid item xs={12}>
          <Canvas/> 
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
