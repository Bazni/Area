import schedule from 'node-schedule';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import {
  getWeatherIn,
  sendMail,
  interpolate,
  getGithubCommits,
  getAllCrypto,
  getGithubRepositoryList,
  getRSSFeed,
  getLatestMovie,
  getLatestTV,
  getNumberOfFootballMatchesToday,
  getYoutubeSubscriber,
} from './src/utils/triggers';
import config from './config';

const app = express();
const router = express.Router();

global.app = app;
app.set('models', require('./src/models'));

app.use(morgan('dev'));
app.use('/docs', express.static('./docs'));
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./src/routes_public')(router);

// require('./src/middleware')(router);
require('./src/routes_private')(router, require('./src/middleware/tokenValidator'));

app.use(router);
app.listen(config.app.port);

const {
  AREA,
  Action,
  Reaction,
  User,
} = global.app.get('models');

const triggers = {
  tempgt: conf => new Promise((resolve, reject) => {
    getWeatherIn(conf.city).then((weather) => {
      if (weather.main.temp > conf.temperature) {
        resolve({
          temperature: weather.main.temp,
          city: conf.city,
          deathTimer: 10,
        });
      } else {
        reject(new Error(`Temperature didn't match ${weather.main.temp} > ${conf.temperature} `));
      }
    });
  }),
  templt: conf => new Promise((resolve, reject) => {
    getWeatherIn(conf.city).then((weather) => {
      if (weather.main.temp < conf.temperature) {
        resolve({
          temperature: weather.main.temp,
          city: conf.city,
          deathTimer: 10,
        });
      } else {
        reject(new Error(`Temperature didn't match ${weather.main.temp} < ${conf.temperature} `));
      }
    });
  }),
  cryptogt: conf => new Promise((resolve, reject) => {
    getAllCrypto().then((crypto) => {
      let i = 0;
      for (; i < crypto.data.length && crypto.data[i].symbol !== conf.currency; i += 1);
      if (crypto.data[i].symbol === conf.currency) {
        if (crypto.data[i].quote.USD.price > conf.limite) {
          resolve({
            currencyValue: crypto.data[i].quote.USD.price,
            currencyName: crypto.data[i].name,
            deathTimer: 10,
          });
        } else {
          reject(new Error('The crypto condition is not passed'));
        }
      } else {
        reject(new Error(`Crypto currency didn't match ${conf.currency} `));
      }
    }).catch((e) => {
      reject(e);
    });
  }),
  cryptolt: conf => new Promise((resolve, reject) => {
    getAllCrypto().then((crypto) => {
      let i = 0;
      for (; i < crypto.data.length && crypto.data[i].symbol !== conf.currency; i += 1);
      if (crypto.data[i].symbol === conf.currency) {
        if (crypto.data[i].quote.USD.price < conf.limite) {
          resolve({
            currencyValue: crypto.data[i].quote.USD.price,
            currencyName: crypto.data[i].name,
            deathTimer: 10,
          });
        } else {
          reject(new Error('The crypto condition is not passed'));
        }
      } else {
        reject(new Error(`Crypto currency didn't match ${conf.currency}`));
      }
    }).catch((e) => {
      reject(e);
    });
  }),
  climat: conf => new Promise((resolve, reject) => {
    getWeatherIn(conf.city).then((weather) => {
      if (weather.weather[0].description === conf.climat) {
        resolve({
          climat: weather.weather[0].description,
          city: conf.city,
          deathTimer: 10,
        });
      } else {
        reject(new Error(`Climat didn't match ${weather.weather[0].description} !== ${conf.climat}`));
      }
    });
  }),
  github: (conf, data) => new Promise((resolve, reject) => {
    getGithubCommits(conf.user, conf.repository).then((commits) => {
      const commit = commits[0];
      if (data.sha !== commit.sha) {
        AREA.update({
          lastState: {
            deathTimer: 0,
            sha: commit.sha,
          },
        }, {
          where: {
            uuid: data.area,
          },
        }).then(() => {
          resolve({
            userName: commit.commit.author.name,
            commitMessage: commit.commit.message,
            repositoryName: conf.repository,
            deathTimer: 0,
          });
        }).catch((e) => {
          reject(new Error(e));
        });
      } else {
        reject(new Error('No new commit'));
      }
    });
  }),
  githubrepo: (conf, data) => new Promise((resolve, reject) => {
    getGithubRepositoryList(conf.user).then((repos) => {
      const repo = repos[0];
      if (data.id !== repo.id) {
        AREA.update({
          lastState: {
            deathTimer: 0,
            id: repo.id,
          },
        }, {
          where: {
            uuid: data.area,
          },
        }).then(() => {
          resolve({
            userName: repo.owner.login,
            repositoryName: repo.name,
            deathTimer: 0,
          });
        }).catch((e) => {
          reject(new Error(e));
        });
      } else {
        reject(new Error('No new repo'));
      }
    });
  }),
  timer: (conf, data) => new Promise((resolve, reject) => {
    if (data.deathTimer <= 0) {
      const years = (conf.years) ? conf.years : 0;
      const months = (conf.months) ? conf.months : 0;
      const days = (conf.days) ? conf.days : 0;
      const hours = (conf.hours) ? conf.hours : 0;
      const min = (conf.minutes) ? conf.minutes : 0;
      resolve({
        deathTimer: min + 60 * (hours + 24 * (days + 30 * (months + 12 * years))),
        timeLeft: min + 60 * (hours + 24 * (days + 30 * (months + 12 * years))),
      });
    } else {
      reject(new Error(`Time hasn't passed, remaining ${data.deathTimer} minutes`));
    }
  }),
  rss: (conf, data) => new Promise((resolve, reject) => {
    getRSSFeed(conf.rssUrl).then((rsss) => {
      const rss = rsss[0];
      if (rss.created !== data.created) {
        AREA.update({
          lastState: {
            deathTimer: 0,
            created: rss.created,
          },
        }, {
          where: {
            uuid: data.area,
          },
        }).then(() => {
          resolve({
            title: rss.title,
            description: rss.description,
            link: rss.link,
            deathTimer: 0,
          });
        }).catch((e) => {
          reject(new Error(e));
        });
      } else {
        reject(new Error('No new repo'));
      }
    }).catch((err) => {
      reject(err);
    });
  }),
  movie: (conf, data) => new Promise((resolve, reject) => {
    getLatestMovie().then((movie) => {
      if (movie.id !== data.id) {
        AREA.update({
          lastState: {
            deathTimer: 0,
            id: movie.id,
          },
        }, {
          where: {
            uuid: data.area,
          },
        }).then(() => {
          resolve({
            title: movie.original_title,
            description: movie.overview,
            deathTimer: 0,
          });
        }).catch((e) => {
          reject(new Error(e));
        });
      }
    }).catch((err) => {
      reject(err);
    });
  }),
  tv: (conf, data) => new Promise((resolve, reject) => {
    getLatestTV().then((tv) => {
      if (tv.id !== data.id) {
        AREA.update({
          lastState: {
            deathTimer: 0,
            id: tv.id,
          },
        }, {
          where: {
            uuid: data.area,
          },
        }).then(() => {
          resolve({
            title: tv.name,
            deathTimer: 0,
          });
        }).catch((e) => {
          reject(new Error(e));
        });
      }
    }).catch((err) => {
      reject(err);
    });
  }),
  foot: () => new Promise((resolve, reject) => {
    getNumberOfFootballMatchesToday().then((matches) => {
      if (matches.count > 0) {
        resolve({
          nbMatches: matches.count,
          deathTimer: 24 * 60,
        });
      } else {
        reject(new Error('No football matches today'));
      }
    }).catch((err) => {
      reject(err);
    });
  }),
  youtubegt: conf => new Promise((resolve, reject) => {
    getYoutubeSubscriber(conf.channel).then((youtube) => {
      if (youtube.items[0].statistics.subscriberCount > conf.count) {
        resolve({
          subscriberCount: youtube.items[0].statistics.subscriberCount,
        });
      } else {
        reject(new Error(`The number of subscriber of this channel is inferior to: ${conf.count}`));
      }
    }).catch((err) => {
      reject(err);
    });
  }),
  email: (conf, data) => new Promise((resolve, reject) => {
    User.findByPk(data.user).then((user) => {
      if (!user) reject(new Error('User Not Found'));
      const cfg = {
        to: user.email,
        subject: interpolate(conf.title, data),
        text: interpolate(conf.message, data),
      };
      sendMail(cfg).then((d) => {
        resolve(d);
      }).catch((e) => {
        reject(e);
      });
    });
  }),
};

schedule.scheduleJob('*/1 * * * *', () => {
  console.log('Checking triggers...');
  AREA.findAll().then((areas) => {
    areas.forEach((area) => {
      if (area.lastState
        && area.lastState.deathTimer > 1) {
        AREA.update({
          lastState: {
            deathTimer: area.lastState.deathTimer - 1,
          },
        }, {
          where: {
            uuid: area.uuid,
          },
        }).then((ok) => {
          console.log(ok);
        }).catch((e) => {
          console.log(e);
        });
        return;
      }

      Action.findByPk(area.actionUUID).then((action) => {
        triggers[action.function](area.actionConfig, {
          ...area.lastState,
          area: area.uuid,
          deathTimer: (area.lastState) ? area.lastState.deathTimer - 1 : 0,
        }).then((data) => {
          Reaction.findByPk(area.reactionUUID).then((reaction) => {
            triggers[reaction.function](area.reactionConfig, { ...data, user: area.userUUID })
              .then(() => {
                AREA.findByPk(area.uuid).then((aaaa) => {
                  AREA.update({
                    lastState: {
                      ...aaaa.lastState,
                      deathTimer: data.deathTimer,
                    },
                  }, {
                    where: {
                      uuid: area.uuid,
                    },
                  }).then((ok) => {
                    console.log(ok);
                  }).catch((e) => {
                    console.log(e);
                  });
                }).catch((e) => {
                  console.log(e);
                });
              }).catch((e) => {
                console.log(e);
              });
          }).catch((e) => {
            console.log(e);
          });
        }).catch((e) => {
          console.log(e.message);
          AREA.update({
            lastState: {
              ...area.lastState,
              deathTimer: 0,
            },
          }, {
            where: {
              uuid: area.uuid,
            },
          }).then((ok) => {
            console.log(ok);
          }).catch((err) => {
            console.log(err);
          });
        });
      }).catch((e) => {
        console.log(e);
      });
    });
  }).catch((e) => {
    console.log(e);
  });
});

// eslint-disable-next-line no-console
console.log(`API running on ${config.app.hostname}:${config.app.port}`);
