import Chart from 'chart.js';
import ISearchAggregation from '../ISearchAggregation';

class SearchChart {
    protected chart: Chart;

    protected element: string;

    constructor(element: string) {
        this.element = element;
        this.chart = new Chart(element, this.getOptions());
    }

    public update(searchAggregation: ISearchAggregation[]) {
        for (let i = 0; i < searchAggregation.length; i++) {
            if (this.chart?.data?.labels) {
                this.chart.data.labels[i] = searchAggregation[i].book.name;
            }

            if (this.chart?.data?.datasets) {
                if (this.chart.data.datasets[0]?.data) {
                    this.chart.data.datasets[0].data[i] = searchAggregation[i].hits;
                }
            }
        }

        this.chart?.update();
    }

    protected getOptions() {
        const labels: [] = [];
        const data: [] = [];

        const backgroundColors = [];
        const borderColors = [];

        // Old testament colors
        let bg = 'rgba(81, 81, 81, 0.2)';
        let border = 'rgba(81, 81, 81, 0.5)';

        for (let i = 0; i <= 66; i++) {
            // New testament colors
            if (i >= 39) {
                bg = 'rgba(152, 140, 81, 0.5)';
                border = 'rgba(152, 140, 81, 1)';
            }

            backgroundColors[i] = bg;
            borderColors[i] = border;
        }

        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Instances Found',
                        data: data,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                        minBarLength: 5,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
                tooltips: {
                    displayColors: false,
                    xPadding: 15,
                    yPadding: 15,
                    backgroundColor: 'rgba(108, 117, 125, 1)',
                    callbacks: {
                        title: (tooltipItem: any) => {
                            let testament = 'Old Testament';

                            if (tooltipItem[0]?.index) {
                                testament = tooltipItem[0].index < 39 ? 'Old Testament' : 'New Testament';
                            }

                            return tooltipItem[0].label + ' - ' + testament;
                        },
                        label: (tooltipItem: any) => {
                            if (tooltipItem?.yLabel) {
                                return tooltipItem.yLabel.toLocaleString() + ' Results';
                            }

                            return '0 Results';
                        },
                    },
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        };
    }
}

export default SearchChart;
