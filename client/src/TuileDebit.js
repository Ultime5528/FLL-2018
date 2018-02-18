import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'

const styles = theme => ({
    divider : {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    }
});

const min = 0;
const max = 5;

class TuileDebit extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }


    render() {
        
        const { classes, nom, debit, noCapteur, ...other } = this.props;

        let nomMaj = (!nom || nom.length === 0) ? ' ' : nom.charAt(0).toUpperCase() + nom.slice(1);
        let debitRound = debit.toFixed(3);

        return (
            <Card {...other}>
                <CardContent>
                    <Typography variant='title'>{nomMaj}</Typography>
                    <Typography variant='subheading'>Capteur {noCapteur}</Typography>
                    <Divider className={classes.divider}/>
                    <Typography variant='subheading'>{debitRound} L/min</Typography>
                    <LinearProgress variant='determinate' value={(debit - min) * 100 / (max - min) }  />
                </CardContent>
            </Card>
        );

    }

}


TuileDebit.propTypes = {
    nom: PropTypes.string,
    noCapteur: PropTypes.number,
    debit: PropTypes.number,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TuileDebit);