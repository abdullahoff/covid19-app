import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
 }from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from "./Map";
import './App.css';
import Table from './Table';
import {prettyPrintStat, sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
function App() {

//STATE = How to write a variable in react
const [countries, setCountries] = useState([]); //value that is initialised to thsi array
const [country, setCountry] = useState('worldwide');
const [countryInfo, setCountryInfo] = useState ([]);
const [tableData, setTableData] = useState([]);
const [mapCentre, setMapCentre] = useState({lat: 34.80746, lng: -40.4796});
const [mapZoom, setMapZoom] = useState(3);
const [casesType, setCasesType] = useState("cases");

//modifier called use state changes value
//initial value given is initial array ie default value
// USEEFFECT = Runs a peice of code for a given condition

useEffect(() => {//initally gets values for the worldwide cases to display
  fetch("https://disease.sh/v3/covid-19/all")//url of location for worldwide data
    .then (response => response.json())//looks for data for world wide and gets and generates data array
    .then (data => {
      setCountryInfo(data);
  } )
}, [])



useEffect(() => {
  const getCountriesData = async () => {
    await fetch ("https://disease.sh/v3/covid-19/countries")//fetches data from the api
    .then ((response) => response.json())//gets the response from the api
    .then ((data) => {//inputs data into function
      const countries = data.map((country) => (//calls the function and creates an array for the call
      {
        name: country.country, //United states, United Kingdom
        value: country.countryInfo.iso2 //UK, USA, FR
      }));

      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
    });
  };
  getCountriesData();//calls the function we made to get the data
}, []);//runs when the component loads and when the conutries value changes

const onCountryChange = async (event) => {//this goes and looks at what value is then selected in the drop down
  const countryCode = event.target.value;
  setCountry(countryCode);//this sets the country code you pick in the drop down menu
  
  const url = 
    countryCode === 'worldwide' 
      ? "https://disease.sh/v3/covid-19/countries/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

  await fetch(url)
  .then(response => response.json())//now in json format that we can work with
  .then( (data) => {//updates the input node
    setCountry(countryCode);//set country info to the data we returned ie store into a variable

    setCountryInfo(data);//this sets all the data you get from the countires response
  })
};

console.log('Country INFO>>>',countryInfo)
  return (
    <div className = "app">
      <div className = "app__left">
        <div className="app__header"> 
          <h1>COVID 19 TRACKER</h1>
          <h4>By Abdullah Abdullah</h4>
          <FormControl className = "app__dropdown">
            <Select variant = "outlined" onChange={onCountryChange} value = {country}>
              <MenuItem value = "worldwide">Worldwide</MenuItem>
              {countries.map((country) => (// for every country return name
                <MenuItem value = {country.value}>{country.name}</MenuItem>//curly brackets allow one to write html within java script ie its called jsx
              ))}
            </Select>
          </FormControl>
        </div>
              
        <div className= "app__stats">
        <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div> 
        <Map
        centre = {mapCentre}
        zoom = {mapZoom}
        />
      </div>
      <Card className = 'app__right'>
        <CardContent>
          
          <h3>Live Cases by Country</h3>
          <Table countries = {tableData}/>
          
          <h3>Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
