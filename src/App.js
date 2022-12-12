import * as React from 'react';
import { BrowserRouter, NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Umbrella from '@mui/icons-material/Umbrella';
import Thermostat from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Chip from '@mui/material/Chip';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react"
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

const theme = createTheme();

export default function Weather() {
  const todayD = dayjs(new Date());
  const [date, setDate] = useState(dayjs(todayD))
  var y = todayD.get('year');
  var m = todayD.get('month')+1;
  var d = todayD.get('date');
  const [dateString, setDateString] = useState(`${y}-${m}-${d}`)
  const [dateShow, setDateShow] = useState(`${d}/${m}/${y}`)
  const [curWeather, setCurWeather] = useState("")

  const [curTemp, setCurTemp] = useState("")
  const [curWind, setCurWind] = useState("")
  const [weatherData, setWeatherData] = useState([])

  const handleChange = (newValue) => {
    setDate(newValue);
    var yI = newValue.get('year');
    var mI = newValue.get('month')+1;
    var dI = newValue.get('date');
    setDateString(`${yI}-${mI}-${dI}`);
    setDateShow(`${dI}/${mI}/${yI}`)
  };

  const listRain = weatherData.map((data, index, rain = false, lTime = "") =>{
    var tTime = `${index}am`;
    
    if(index == 12){
      tTime = "12pm";
    }else if(index == 0){
      tTime = "12am";
    } else if(index > 12){
      tTime = `${index-12}pm`;
    }

    if(data >= 61 ){
      return <Chip icon={<ThunderstormIcon />} label={tTime} size="small" color="info" />
    } else{
      return <Chip icon={<Umbrella />} label={tTime} size="small" variant="outlined" />
    }
  }
  );

  const card = (
    <React.Fragment>
      <CardContent
      align="center">
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {dateShow}
        </Typography>
        <Typography variant="h5" component="div">
          {curWeather}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {curTemp}<Thermostat/> {curWind}<AirIcon/>
        </Typography>
        <Typography
          maxWidth={275}
          align="center"
          border={1}
          padding={1}
          component="div"
        >
          {listRain}
        </Typography>
      </CardContent>
      <CardActions >
      </CardActions>
    </React.Fragment>
  );

  function HomePage() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      const url = `https://api.open-meteo.com/v1/forecast?latitude=2.90&longitude=101.64&hourly=weathercode&daily=weathercode,temperature_2m_max,windspeed_10m_max&current_weather=true&timezone=Asia%2FSingapore&start_date=${dateString}&end_date=${dateString}`;
      fetch(url).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // console.log(data);
            var wCode = data.current_weather.weathercode;
            var wTemp = data.current_weather.temperature;
            var wWind = data.current_weather.windspeed;

            var tD = dayjs(dayjs(new Date()), "DD-MM-YYYY");
            var sD = dayjs(date, "DD-MM-YYYY");

            if(`${tD.get('date')}/${tD.get('month')}/${tD.get('year')}` !== `${sD.get('date')}/${sD.get('month')}/${sD.get('year')}`){
              wCode = data.daily.weathercode;
              wTemp = "max "+data.daily.temperature_2m_max;
              wWind = "max "+data.daily.windspeed_10m_max;
            }
           
            var wStr = "";
            
            if(wCode === 0){
              wStr = "Clear sky";
            }else if(wCode === 1){
              wStr = "Mainly clear";
            } else if(wCode === 2){
              wStr = "Partly Cloudy";
            } else if(wCode === 3){
              wStr = "Overcast";
            } else if(wCode === 45 || wCode === 48){
              wStr = "Fog";
            } else if(wCode >= 51 && wCode <= 57){
              wStr = "Drizzle";
            } else if(wCode >= 61 && wCode <= 67){
              wStr = "Rain";
            } else if(wCode >= 71 && wCode <= 77){
              wStr = "Snow";
            } else if(wCode >= 80 && wCode <= 82){
              wStr = "Rain Shower";
            } else if(wCode >= 85 && wCode <= 86){
              wStr = "Rain Shower";
            } else if(wCode >= 95){
              wStr = "Thunderstorm";
            }

            setCurWeather(wStr);
            setCurTemp(wTemp);
            setCurWind(wWind);
            setWeatherData(data.hourly.weathercode)
          })
        } else {
          console.log('Error happened')
        }
      })
      
      navigate('/result');
    };

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <DesktopDatePicker
            label="Date"
            inputFormat="DD/MM/YYYY"
            value={date}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Will it rain?
        </Button>
      </Box>
    </LocalizationProvider>
    );
  }
  
  function ResultPage() {
    return (
      <Box sx={{ mt: 3, minWidth: 275 } }>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card variant="outlined">{card}</Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function InfoPage() {
    return (
      <Box sx={{ mt: 3, minWidth: 275 } }>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <React.Fragment>
                <CardContent>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Credit
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <ul>
                      <li><Link href="https://mui.com">mui.com</Link></li>
                      <li><Link href="https://open-meteo.com">open-meteo.com</Link></li>
                    </ul>
                  </Typography>
                </CardContent>
                <CardActions >
                </CardActions>
              </React.Fragment>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <BrowserRouter>
          <nav>
            <NavLink to='/'>
            <Grid container spacing={2} align="center">
              <Grid item xs={4}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <Umbrella />
                </Avatar>
              </Grid>
              <Grid item xs={8}>
                Kuala Lumpur, Malaysia
              </Grid>
            </Grid>
            </NavLink>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/result" element={<ResultPage/>}/>
            <Route path="/info" element={<InfoPage/>}/>
          </Routes>
          <Stack direction="row" spacing={1}>
          <NavLink to='/'>
            <IconButton aria-label="home">
              <HomeIcon />
            </IconButton>
          </NavLink>
          <NavLink to='/info'>
            <IconButton aria-label="info">
              <InfoIcon />
            </IconButton>
          </NavLink>
          </Stack>
          </BrowserRouter>
        </Box>
      </Container>
    </ThemeProvider>
  );
}