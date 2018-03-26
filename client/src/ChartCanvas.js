import React, { Component } from 'react';
import Chart from 'chart.js';

class ChartCanvas extends Component {

    constructor(props) {
        super(props);
        this.saveRef = this.saveRef.bind(this);
        
        this.canvas = null;
        this.chart = null;

    }

    componentWillUnmount() {        
        if(this.chart)
            this.chart.destroy();
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        this.createChart();
    }


    saveRef = (ref) => {
        this.canvas = ref;
    };

    createChart = () => {

        if(this.canvas && this.props.config) {
            
            if(this.chart)
                this.chart.destroy();

            this.chart = new Chart(this.canvas.getContext('2d'), this.props.config);
            
        }
    };

    render() {
        return <canvas ref={this.saveRef} ></canvas>;
    } 



}

export default ChartCanvas;