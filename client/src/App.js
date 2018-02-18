import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer'
import {MenuItem} from 'material-ui/Menu'
import Divider from 'material-ui/Divider'
import Logo from './Digito.svg'
import TuileDebit from './TuileDebit'
import TuileConso from './TuileConso'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import io from 'socket.io-client';
import * as Messages from './Messages';

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
    'flex-direction': 'column',
    margin: 16
  },
  
  drawerLogo : {
    height: 100,
    paddingBottom: 16
  },
  
  tuileContainer: {
    margin: 12
    //flexGrow: 1,
  },

  tuile: {
    //width: 200,
    //margin: 12
  },

  conseils: {
    margin: 12,
    padding: 12
  }

};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {drawerOpen: false, debits: [], consommations: [], page: 0};
    this.updateDebit = this.updateDebit.bind(this);
    this.setPage = this.setPage.bind(this);
  }


  toggleDrawer = (open) => () => {
    this.setState( { drawerOpen: open } );
  }

  setPage = (num) => () => {
    this.setState( {page: num, drawerOpen: false} );
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
    <Grid item key={row.id} xs={12} sm={6} md={3}>
      <TuileDebit nom={row.nom} key={row.id} noCapteur={row.id} debit={row.debit} className={classTuile}/>  
    </Grid>
  );

  mapConsoTuiles = classTuile => (row) => (
    <Grid item key={row.id} xs={12} sm={6} md={3}>
      <TuileConso nom={row.nom} key={row.id} noCapteur={"Capteur " + row.id} totalConso={row.totalConso} className={classTuile}/>  
    </Grid>
  );

  render() {
    const { classes } = this.props;

    let messages = [];

    if(this.state.debits[0] && this.state.debits[1]){
      
      let today = new Date();
      let conseilDouche = false;
      let conseilToilette = false;

      console.log(today);

      this.state.debits[0].totalConso = 0;
      this.state.debits[1].totalConso = 0;

      for(let i = 0; i < this.state.consommations.length; i++){
        let conso = this.state.consommations[i];
        if(conso.dateDebut.getFullYear() === today.getFullYear()
          && conso.dateDebut.getDate() === today.getDate()
          && conso.dateDebut.getMonth() === today.getMonth()) {

            console.log("Ligne " + i);
            console.log(conso);

            if(conso.capteurId === 1 && conso.quantite >= 29.0)
              conseilDouche = true;

            if(conso.capteurId === 2 && conso.quantite >= 18.0)
              conseilToilette = true;

            this.state.debits[conso.capteurId - 1].totalConso += conso.quantite;

        }
      }
      
      if(conseilDouche)
        messages.push(Messages.conseilsDouche[Math.floor(Math.random() * Messages.conseilsDouche.length)]);

      if(conseilToilette)
        messages.push(Messages.conseilsToilette[Math.floor(Math.random() * Messages.conseilsToilette.length)]);

      if(this.state.debits[0].totalConso + this.state.debits[1].totalConso >= 365)
        messages.push(Messages.conseilsEnsemble[Math.floor(Math.random() * Messages.conseilsEnsemble.length)]);

    }

 

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            {this.state.page === 0 &&
            <Typography variant="title" color="inherit" className={classes.flex}>
              Accueil
            </Typography>}
            {this.state.page === 1 &&
            <Typography variant="title" color="inherit" className={classes.flex}>
              Historique
            </Typography>}
          </Toolbar>
        </AppBar>

        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div className={classes.drawerHeader}>
            <img src={Logo} className = {classes.drawerLogo} style={{display: 'inline'}} alt='logo'/>
            <div>
              <Typography variant='subheading' >Ultime 22369</Typography>
            </div>
          </div>
          <Divider/>
          <MenuItem onClick={this.setPage(0)}>Accueil</MenuItem>
          <MenuItem onClick={this.setPage(1)}>Historique</MenuItem>
        </Drawer>
        {this.state.page === 0 && <div style={{margin: 8}}>
	    {messages.length > 0 &&
          <Paper className={classes.conseils}>
            <Typography variant='title'>Conseils</Typography>
            {messages.map( (c) =>  <Typography variant='subheading'>{c.texte}</Typography>)}
            <Typography variant='subheading'>La <a target="_blank" href='http://www.v3r.net/services-au-citoyen/eau/economie-d-eau-potable'>Ville de Trois-Rivières</a> propose plusieurs moyens d'économiser de l'eau.</Typography>
          </Paper>}
          {messages.length == 0 &&
          <Paper className={classes.conseils}>
            <Typography variant='title'>Félicitations!</Typography>
            <Typography variant='subheading'>{Messages.felicitations[Math.floor(Math.random() * Messages.felicitations.length)].texte}</Typography>
            <Typography variant='subheading'><a target="_blank" href='http://www.v3r.net/services-au-citoyen/eau'>Ville de Trois-Rivières -> Eau</a></Typography>
          </Paper>}
          <Grid container spacing={16} style={{margin: 0, width:'100%'}} className={classes.tuileContainer}>
            {this.state.debits.map(this.mapDebitTuiles(classes.tuile))}
          </Grid>
          <Grid container spacing={16} style={{margin: 0, width:'100%'}} className={classes.tuileContainer}>
            {this.state.debits.map(this.mapConsoTuiles(classes.tuile))}
            <Grid item key={2} xs={12} sm={6} md={3}>
              <TuileConso nom="Aujourd'hui"
              key="2"
              noCapteur="Capteurs 1 et 2"
              totalConso= {this.state.debits[0] && this.state.debits[1] ? this.state.debits[0].totalConso + this.state.debits[1].totalConso : 0}
              className={classes.tuile}/>  
            </Grid>
          </Grid>
          </div>}
          {this.state.page === 1 && <Paper>
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
                      <TableCell>{this.formatDate(n.dateDebut)}</TableCell>
                      <TableCell>{this.formatDate(n.dateFin)}</TableCell>
                      <TableCell numeric>{n.quantite.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>}
        
        
        
      </div>
    );
  }


  formatDate(date) {
    let DateString = date.getDate().toString();
    let MonthString = (date.getMonth() + 1).toString();
    let HourString = (date.getHours() + 1).toString();
    let MinutesString = date.getMinutes().toString();

    if(date.getDate() < 10){
      DateString = "0" + date.getDate();
    }
    if(date.getMonth() + 1 < 10){
      MonthString = "0" + (date.getMonth() + 1);
    }
    if(date.getHours() + 1 < 10){
      HourString = "0" + (date.getHours() + 1);
    }
    if(date.getMinutes() < 10){
      MinutesString = "0" + date.getMinutes();
    }

    return  date.getFullYear() +  "/" + MonthString + "/" + DateString + " " + HourString + ":" + MinutesString;
  }

}


App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);