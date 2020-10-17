import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles'
import { ThemeProvider, Toolbar, Typography } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Canvas from './Canvas.js'
import Page from './Page.js'
import theme from './theme'

const drawerWidth = 400

const useStyles = makeStyles((theme) => ({
  root: {    
    display: 'flex',
    flexGrow: 1,
  },  
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign:'center',
    color: theme.palette.text.secondary,
  },  
  toolbar: theme.mixins.toolbar
}))


function App() {  
  const classes = useStyles()
  
  return (
    <ThemeProvider theme={theme} className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar> 
          <Typography variant='h6' noWrap>
            Goblin maker
          </Typography>
        </Toolbar>
      </AppBar>      
      <Page/> 
    </ThemeProvider>
  );
}

export default App;
