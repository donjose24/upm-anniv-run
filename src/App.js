import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import ReactFullpage from '@fullpage/react-fullpage';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';

import { Animation } from '@devexpress/dx-react-chart';

const originalColors = ['#ff5f45', '#0798ec' ,'#7e8a97']


function App() {
  const [apiData, setApiData] = useState({bike_total: 0, run_total: 0});
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topFemales, setTopFemale] = useState([])
  const [topMales, setTopMale] = useState([])

  const fetchData = async () => {
    const response = await axios.get("https://upm-anniv-run.herokuapp.com/statistics")
    let batches = [];
    let topFemale = [];
    let topMale = [];

    const jsonBatches = response.data.data.batches

    for (let index in jsonBatches) {
      const batchName = index.split(" ")
      batches.push({"batchName": batchName[0], "distance": jsonBatches[index]})
    }

    const jsonTopFemale = response.data.data.top_female 

    for (let index in jsonTopFemale) { //para madali i-sort, pagbaligtarin ung index at value
      topFemale.push({"name": index, "distance": jsonTopFemale[index]})
    }

    const jsonTopMale = response.data.data.top_male

    for (let index in jsonTopMale) { //para madali i-sort, pagbaligtarin ung index at value
      topMale.push({"name": index, "distance": jsonTopMale[index]})
    }

    topFemale.sort(function(a,b){
      if (a.distance > b.distance) return -1
      if (a.distance < b.distance) return 1

      return 0
    })

    topMale.sort(function(a,b){
      if (a.distance > b.distance) return -1
      if (a.distance < b.distance) return 1

      return 0
    })

    setTopFemale(topFemale)
    setTopMale(topMale)
    setApiData(response.data.data)
    setBatches(batches)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData().then();
  }, []);

  return (
  <div>
    <div className="navbar">
      <h5 className="title"> UP Mountaineers Anniversary Run Tracker </h5>
    </div>
    <ReactFullpage 
      paddingTop = {`8%`}
      sectionsColor = {originalColors}
      verticalCentered = {false}
      render = {({state, fullpageApi}) => {
        return(
          <ReactFullpage.Wrapper>
            <div className="section">
              <div className="half">
                <h1 className="header">{(apiData.bike_total + apiData.run_total).toFixed(2)} KM</h1>
                <h3 className="subheader"> of 4300 KM </h3>
              </div>
              <div className="half">
                <div className="group">
                  <h1 className="header no-padding">{apiData.bike_total} KM</h1>
                  <h3 className="subheader"> Bike Distance </h3>
                </div>
                <div className="group">
                  <h1 className="header no-padding">{apiData.run_total} KM</h1>
                  <h3 className="subheader"> Run Distance </h3>
                </div>
              </div>
            </div>
            <div className="section">
              <Paper>
                <Chart
                  data={batches}
                >
                  <ArgumentAxis />
                  <ValueAxis max={7} />

                  <BarSeries
                    valueField="distance"
                    argumentField="batchName"
                  />
                  <Title text="Distance by Batch (km)" />
                  <Animation />
                </Chart>
              </Paper>
            </div>
            <div className="section">
              <div className="center">
              <h2 className="subheader bold"> Top Female Athletes </h2>
                <ul>
                  {topFemales.map((value, index) => {
                    return (
                      <li className="top">{value.name}, ({value.distance}km)</li>
                    )
                  })}
                </ul>
               <h2 className="subheader bold"> Top Male Athletes </h2>
                <ul>
                  {topMales.map((value, index) => {
                    return (
                      <li className="top">{value.name}, ({value.distance}km)</li>
                    )
                  })}
                </ul>
              </div>
             </div>
          </ReactFullpage.Wrapper>
        )
      }}
    />
  </div>
  )
}

export default App;
