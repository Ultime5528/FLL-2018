import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui-next/styles';
import AppBar from 'material-ui-next/AppBar';
import Toolbar from 'material-ui-next/Toolbar';
import Typography from 'material-ui-next/Typography';
import IconButton from 'material-ui-next/IconButton';
import MenuIcon from 'material-ui-icons-next/Menu';
import Drawer from 'material-ui-next/Drawer'
import {MenuItem} from 'material-ui-next/Menu'
import Divider from 'material-ui-next/Divider'
import waterdrop from './water-drop.svg'
import TuileDebit from './TuileDebit'
import TuileConso from './TuileConso'
import Grid from 'material-ui-next/Grid'
import Paper from 'material-ui-next/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui-next/Table';
import io from 'socket.io-client';

const socket = io();

const styles = {
  
  flex: {
    flex: 1,
  },
  
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  
  drawerHeader: {
    display: 'flex',
    'align-items': 'center',
    margin: 12
  },
  
  drawerLogo : {
    width: 70,
    marginRight: 12
  },
  
  tuileContainer: {
    margin: 12
    //flexGrow: 1,
  },

  tuile: {
    //width: 200,
    //margin: 12
  }

};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {drawerOpen: false, debits: [], consommations: [] };
    this.updateDebit = this.updateDebit.bind(this);
  }


  toggleDrawer = (open) => () => {
    this.setState( { drawerOpen: open } );
  }

  updateDebit(data) {
    console.log(data);
    this.setState((prevState, props) => {
      prevState.debits[data.id - 1] = data;
      console.log(prevState);
      return prevState;
    });
  }


  componentDidMount() {
    
    fetch('/consommation')
      .then(res => res.json())
      .then(res => res.map(row => {
        row.dateDebut = new Date(row.dateDebut);
        row.dateFin = new Date(row.dateFin);
        return row;
      }))
      .then(res => this.setState({consommations: res}))
      .then(() => socket.on('consommation', function(data){
        console.log(data);
        console.log(this);
        this.setState((prevState, props) => prevState.consommations.push(data));
      }))
      .catch(err => console.error(err));

    fetch('/debit')
      .then(res => res.json())
      .then(res => this.setState({debits: res}))
      .then(() => socket.on('debit', this.updateDebit))
      .catch(err => console.error(err));

  }


  componentWillUnmount() {
    io.removeAllListeners('consommation');
    io.removeAllListeners('debit');
  }

  mapDebitTuiles = classTuile => (row) => (
    <Grid item key={row.id} xs={12} sm={3} md={3}>
      <TuileDebit nom={row.nom} key={row.id} noCapteur={row.id} debit={row.debit} className={classTuile}/>  
    </Grid>
  );

  mapConsoTuiles = classTuile => (row) => (
    <Grid item key={row.id} xs={9} sm={3} md={3}>
      <TuileConso nom={row.nom} key={row.id} noCapteur={row.id} debit={row.debit} className={classTuile}/>  
    </Grid>
  );

  render() {
    const { classes } = this.props;

    let totalConso = [];

    console.log(this.state.consommations);

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography type="title"  className={classes.flex}>
              Accueil
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div className={classes.drawerHeader}>
            <img src={waterdrop} className = {classes.drawerLogo} style={{display: 'inline'}} alt='logo'/>
            <div>
              <Typography type='title' >Le super compteur qui n'a pas de nom</Typography>
              <Typography type='subheading' >Ultime 22369</Typography>
            </div>
          </div>
          <Divider/>
          <MenuItem>Accueil</MenuItem>
          <MenuItem>Historique</MenuItem>
          <MenuItem>Consommation Journalière</MenuItem>
        </Drawer>
        {true && <div style={{margin: 8}}>
          <Grid container spacing={16} style={{margin: 0, width:'100%'}} className={classes.tuileContainer}>
            {this.state.debits.map(this.mapDebitTuiles(classes.tuile))}
          </Grid>
          <Grid container spacing={16} style={{margin: 0, width:'100%'}} className={classes.tuileContainer}>
            {this.state.debits.map(this.mapConsoTuiles(classes.tuile))}
          </Grid>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Capteur</TableCell>
                  <TableCell>Date de début</TableCell>
                  <TableCell>Date de fin</TableCell>
                  <TableCell numeric>Quantité (L)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.consommations.map(n => {
                  return (
                    <TableRow key={n.dateDebut}>
                      <TableCell>{n.capteurId}</TableCell>
                      <TableCell>{n.dateDebut.toString()}</TableCell>
                      <TableCell>{n.dateFin.toString()}</TableCell>
                      <TableCell numeric>{n.quantite}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>}
        
        
      </div>
    );
  }

}


App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);