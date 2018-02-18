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

class TuileConso extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }


    render() {
        
        const { classes, nom, noCapteur, totalConso, ...other } = this.props;

        let nomMaj = (!nom || nom.length === 0) ? ' ' : nom.charAt(0).toUpperCase() + nom.slice(1) + " - Total";

        return (
            <Card {...other}>
                <CardContent>
                    <Typography variant='title'>{nomMaj}</Typography>
                    <Typography variant='subheading'>{noCapteur}</Typography>
                    <Divider className={classes.divider}/>
                    <Typography variant='subheading'>{totalConso ? totalConso.toFixed(2) : 0} L</Typography>
                </CardContent>
            </Card>
        );

    }

}


export default withStyles(styles)(TuileConso);