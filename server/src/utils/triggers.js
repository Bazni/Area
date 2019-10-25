import rq from 'request-promise';
import nodemailer from 'nodemailer';
import rssjson from 'rssjson';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'travl.contact@gmail.com',
    pass: 'xtAzU2CHYDcCqJz',
  },
});

const sendMail = (opt) => {
  const mailOptions = {
    from: 'AREA <travl.contact@gmail.com>',
    ...opt,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

// How to use it
// modu.getWeatherIn('rennes').then((temp) => {
//   console.log(`temperature:${temp.main.temp}`);
//   console.log(`temperature:${temp.weather[0].description}`);
// });
const getWeatherIn = (city) => {
  const options = {
    uri: 'https://api.openweathermap.org/data/2.5/weather',
    qs: {
      q: city,
      appid: '45f4dd45e0f724512ba044c5a2caf4bc',
      units: 'metric',
    },
    json: true,
  };
  return rq(options);
};

const getGithubRepositoryList = (user) => {
  const options = {
    url: `https://api.github.com/users/${user}/repos?sort=created`,
    headers: {
      'User-Agent': 'modoTube',
    },
    json: true,
  };
  return rq(options);
};

const getGithubCommits = (user, repository) => {
  const options = {
    url: `https://api.github.com/repos/${user}/${repository}/commits`,
    headers: {
      'User-Agent': 'modoTube',
    },
    json: true,
  };
  return rq(options);
};

const getAllCrypto = () => {
  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      convert: 'USD',
    },
    headers: {
      'X-CMC_PRO_API_KEY': '02ef5698-7465-4acc-940f-020a64a16375',
    },
    json: true,
    gzip: true,
  };
  return rq(requestOptions);
};

const interpolate = (template, params) => {
  const names = Object.keys(params);
  const vals = Object.values(params);
  // eslint-disable-next-line no-new-func
  return new Function(...names, `return \`${template}\`;`)(...vals);
};

const getRSSFeed = url => rssjson(url);

const getLatestMovie = () => {
  const requestOptions = {
    method: 'GET',
    uri: 'https://api.themoviedb.org/3/movie/latest',
    qs: {
      api_key: 'f4a0bbb825c5311bb87e6b836c350d10',
      language: 'en-US',
    },
    json: true,
  };
  return rq(requestOptions);
};

const getLatestTV = () => {
  const requestOptions = {
    method: 'GET',
    uri: 'https://api.themoviedb.org/3/tv/latest',
    qs: {
      api_key: 'f4a0bbb825c5311bb87e6b836c350d10',
      language: 'en-US',
    },
    json: true,
  };
  return rq(requestOptions);
};

const getNumberOfFootballMatchesToday = () => {
  const requestOptions = {
    method: 'GET',
    uri: 'http://api.football-data.org/v2/matches',
    json: true,
  };
  return rq(requestOptions);
};

const getYoutubeSubscriber = (channel) => {
  const requestOptions = {
    method: 'GET',
    uri: 'https://www.googleapis.com/youtube/v3/channels',
    qs: {
      part: 'statistics',
      forUsername: channel,
      key: 'AIzaSyCztid7EFufetK7_euOX_Qflhfb1_O2P3E',
    },
    json: true,
  };
  return rq(requestOptions);
};

export {
  getWeatherIn,
  sendMail,
  getGithubRepositoryList,
  getGithubCommits,
  interpolate,
  getAllCrypto,
  getRSSFeed,
  getLatestMovie,
  getLatestTV,
  getNumberOfFootballMatchesToday,
  getYoutubeSubscriber,
};
