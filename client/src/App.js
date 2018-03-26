import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer'
import {MenuItem} from 'material-ui/Menu'
import Divider from 'material-ui/Divider'
import Logo from './Digito.svg'
import UltimeLogo from './Ultime-22369.svg'
import TuileDebit from './TuileDebit'
import TuileConso from './TuileConso'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import io from 'socket.io-client';
import * as Messages from './Messages';
import ChartCanvas from './ChartCanvas';
import moment from 'moment';
import './App.css'

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

  logoBar : {
    height: 48,
    paddingBottom: 0
  },
  
  tuileContainer: {
    margin: 12
    //flexGrow: 1,
  },

  tuile: {
    //width: 200,
    //margin: 12
  },

  button: {
    margin: 12
  },

  conseils: {
    margin: 12,
    padding: 12
  }

};

var colors = {
  blue: 'rgba(0,0,255,1.0)',
  orange: 'rgba(255, 150, 0, 1.0)'
}

var configGraphique = {
  type: 'line',
  data: {
    //labels: [],
    datasets: [{
      label: 'Capteur 1',
      backgroundColor: colors.orange,
      borderColor: colors.orange,
      data: [],
      fill: false,
    }, {
      label: 'Capteur 2',
      fill: false,
      backgroundColor: colors.blue,
      borderColor: colors.blue,
      data: [],
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Évolution de votre consommation d'eau des 10 derniers jours"
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    scales: {
      xAxes: [{
        type: 'time',
						time: {
              unitStepSize: 1,

              unit: 'day',

							format: 'MM/DD/YYYY',
              // round: 'day'
              /*displayFormats: {
                'day': 'DD/MM',
                'hour': 'HH/mm' //<-- set this
              },*/
							tooltipFormat: 'll'
						},
						scaleLabel: {
							display: true,
							labelString: 'Date'
            },
            gridLines: {
              offsetGridLines: false
            }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Consommation (L)'
        }
      }]
    }
  }
};


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {drawerOpen: false, debits: [], consommations: [], page: 0, graphique: configGraphique};
    this.updateDebit = this.updateDebit.bind(this);
    this.modifierConsommation = this.modifierConsommation.bind(this);
    this.setPage = this.setPage.bind(this);
  }


  toggleDrawer = (open) => () => {
    this.setState( { drawerOpen: open } );
  }

  setPage = (num) => () => {
    this.setState( {page: num, drawerOpen: false} );
  }

  updateDebit(data) {
    this.setState((prevState, props) => {
      prevState.debits[data.id - 1] = data;
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
      .then(res => {
        this.configurerGraphique(res);
        return res;
      })
      .then(res => this.setState({consommations: res}))
      .then(() => socket.on('consommation', this.modifierConsommation))
      .catch(err => console.error(err));

    fetch('/debit')
      .then(res => res.json())
      .then(res => this.setState({debits: res}))
      .then(() => socket.on('debit', this.updateDebit))
      .catch(err => console.error(err));


  }

  configurerGraphique(rows) {
    let conso1 = [];
    let conso2 = [];

    for(let i = 0; i < 10; i++){
      conso1.push(0);
      conso2.push(0);
    }

    rows.forEach(row => {
      let date = moment(row.dateDebut);
      let diff = moment().startOf('day').diff(date.startOf('day'), 'days');
      if(diff < 10){
        if(row.capteurId === 1)
          conso1[diff] += row.quantite;
        else
          conso2[diff] += row.quantite;
      }
    });

    this.setState(prevState => {
      let graphique = {...prevState.graphique};

      graphique.data.datasets[0].data = conso1.map( (element, index) => {
        return {
          x: moment().subtract(index, 'days').format('MM/DD/YYYY'),
          y: element
        };
      });

      graphique.data.datasets[1].data = conso2.map( (element, index) => {
        return {
          x: moment().subtract(index, 'days').format('MM/DD/YYYY'),
          y: element
        };
      });

      return {graphique : graphique};

    });


  }


  componentWillUnmount() {
    io.removeAllListeners('consommation');
    io.removeAllListeners('debit');
  }

  modifierConsommation(row) {

    if(row.old_val === null) {

      this.setState(prevState => {

        row.new_val.dateDebut = new Date(row.new_val.dateDebut);
        row.new_val.dateFin = new Date(row.new_val.dateFin);

        let conso = prevState.consommations;
        conso.push(row.new_val);
        this.configurerGraphique(conso);
        return {consommation: conso};

      });

    }
    else {
      window.location.reload(true);
    }

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

  reset() {
    fetch('/reset', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({date : new Date()})
    })
    .then(() => {window.location.reload(true);});
  }

  render() {
    
    const { classes } = this.props;

    let messages = [];

    let sommeConso = 0;

    if(this.state.debits[0] && this.state.debits[1]){
      
      let today = new Date();
      let conseilDouche = false;
      let conseilToilette = false;

      this.state.debits[0].totalConso = 0;
      this.state.debits[1].totalConso = 0;

      for(let i = 0; i < this.state.consommations.length; i++){
        let conso = this.state.consommations[i];
        if(conso.dateDebut.getFullYear() === today.getFullYear()
          && conso.dateDebut.getDate() === today.getDate()
          && conso.dateDebut.getMonth() === today.getMonth()) {

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

      sommeConso = this.state.debits[0].totalConso + this.state.debits[1].totalConso;
      
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
            <img src={Logo} className = {classes.logoBar} style={{display: 'inline', paddingRight: 16}} alt='logo'/>
            <a target="_blank" rel="noopener noreferrer" href='https://facebook.com/ultime22369'><img src={UltimeLogo} className = {classes.logoBar} style={{display: 'inline'}} alt='logo'/></a>
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
          <Button variant="raised" color="primary" className={classes.button} onClick={this.reset}>
            Réinitialiser
          </Button>
        </Drawer>
        {this.state.page === 0 && <div style={{margin: 8}}>
	    {messages.length > 0 &&
          <Paper className={classes.conseils}>
            <Typography variant='title'>Conseils</Typography>
            {messages.map( (c) =>  <Typography variant='subheading'>{c.texte}</Typography>)}
            <Typography variant='subheading'>La <a target="_blank" rel="noopener noreferrer" href='http://www.v3r.net/services-au-citoyen/eau/economie-d-eau-potable'>Ville de Trois-Rivières</a> propose plusieurs moyens d'économiser de l'eau.</Typography>
          </Paper>}
          {messages.length === 0 &&
          <Paper className={classes.conseils}>
          {(sommeConso > 0) &&
            <div>
              <Typography variant='title'>Félicitations!</Typography>
              <Typography variant='subheading'>{Messages.felicitations[Math.floor(Math.random() * Messages.felicitations.length)].texte}</Typography>
              <Typography variant='subheading'><a target="_blank" rel="noopener noreferrer" href='http://www.v3r.net/services-au-citoyen/eau'>Ville de Trois-Rivières > Eau</a></Typography>
            </div>}
            {(sommeConso <= 0) &&
            <div>
              <Typography variant='title'>Bienvenue!</Typography>
            </div>}
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
            <ChartCanvas config={this.state.graphique} />
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
    /*let DateString = date.getDate().toString();
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
    */
    return moment(date).format('YYYY-MM-DD HH:mm');
  }

}


App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);